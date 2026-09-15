/**
 * Tests E2E de seguridad P0 (requiere servidor vivo + DB con seed).
 *
 * Fixtures aisladas `sectest-*`, login REAL y limpieza únicamente de esas
 * fixtures. Los demos del seed no se modifican.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { assertTrainerOwnsClient, validateClientIdForTrainer } from "../src/lib/authorization";
import { sanitizePath, ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES } from "../src/lib/security";

const BASE = process.env.BASE_URL || "http://localhost:3001";
const prisma = new PrismaClient();
const TAG = `sectest-${Date.now()}`;
let passed = 0;
let failed = 0;

function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) { passed++; console.log(`  PASS  ${name}`); }
  else { failed++; console.log(`  FAIL  ${name}`, detail ?? ""); }
}

async function login(email: string, password: string): Promise<string | null> {
  const res = await fetch(`${BASE}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  if (!res.ok) return null;
  const setCookie = res.headers.get("set-cookie") || "";
  const match = setCookie.match(/ec_token=([^;]+)/);
  return match ? `ec_token=${match[1]}` : null;
}

const get = (path: string, cookie?: string) => fetch(`${BASE}${path}`, { headers: cookie ? { Cookie: cookie } : {} });

async function cleanup() {
  const fixtureUsers = await prisma.user.findMany({ where: { email: { startsWith: TAG } }, select: { id: true } });
  const fixtureIds = fixtureUsers.map((user) => user.id);
  await prisma.client.deleteMany({ where: { email: { startsWith: TAG } } }).catch(() => {});
  if (fixtureIds.length) await prisma.user.deleteMany({ where: { id: { in: fixtureIds } } }).catch(() => {});
}

async function main() {
  try {
    const r = await fetch(`${BASE}/login`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
  } catch {
    console.log(`\nABORTADO: no hay servidor en ${BASE}. Levantalo con npm run dev y reintentá.\n`);
    process.exit(1);
  }

  const tB = await prisma.user.create({ data: { name: "SecTest TrainerB", email: `${TAG}-trainer@test.com`, password: await bcrypt.hash("password123", 10), role: "TRAINER" } });
  const cBUser = await prisma.user.create({ data: { name: "SecTest ClientB", email: `${TAG}-client@test.com`, password: await bcrypt.hash("password123", 10), role: "CLIENT" } });
  const cB = await prisma.client.create({ data: { name: "SecTest ClientB", email: `${TAG}-client@test.com`, userId: cBUser.id, trainerId: tB.id } });

  const cookieB = await login(`${TAG}-trainer@test.com`, "password123");
  const cookieEze = await login("ezequiel@kinetixfitt.com", "Admin123!");
  const cookieMartin = await login("martin@demo.com", "cliente123");
  const cookieCb = await login(`${TAG}-client@test.com`, "password123");
  check("login real trainerB", !!cookieB);
  check("login real KinetixFitt", !!cookieEze);
  check("login real Martín", !!cookieMartin);
  check("login real ClientB", !!cookieCb);
  if (!cookieB || !cookieEze || !cookieMartin || !cookieCb) throw new Error("sin sesión");

  const clientsResponse = await get("/api/clients?limit=200", cookieEze);
  const clientsPayload = await clientsResponse.json();
  const martinList = Array.isArray(clientsPayload) ? clientsPayload : clientsPayload?.items;
  const martinRec = Array.isArray(martinList) ? martinList.find((c: { email?: string }) => c.email === "martin@demo.com") : null;
  check("Martín existe y es de KinetixFitt", !!martinRec);
  if (!martinRec?.id) throw new Error("sin fixture víctima");

  const own = await get(`/api/clients/${cB.id}`, cookieB);
  check("control: trainerB ve a su cliente (200)", own.status === 200, own.status);
  const r1 = await get(`/api/clients/${martinRec.id}`, cookieB);
  check("trainerB bloqueado en cliente ajeno (404)", r1.status === 404, r1.status);
  const r2 = await get(`/api/clients/${martinRec.id}`, cookieCb);
  check("cliente bloqueado en ficha ajena (403)", r2.status === 403, r2.status);
  const r3 = await get("/api/clients/00000000-0000-0000-0000-000000000000", cookieB);
  const b3 = await r3.json().catch(() => ({}));
  check("fake id → 404 anti-enumeración", r3.status === 404 && b3.error === "Cliente no encontrado", `${r3.status} ${b3.error}`);

  const form = new FormData();
  form.append("type", "../..");
  form.append("file", new Blob(["x"], { type: "image/jpeg" }), "p.jpg");
  const r4 = await fetch(`${BASE}/api/uploads`, { method: "POST", headers: { Cookie: cookieMartin }, body: form });
  check("upload type=../.. → 400", r4.status === 400, r4.status);
  const r5 = await fetch(`${BASE}/api/uploads/progress/test.jpg`);
  check("upload anónimo → 401", r5.status === 401, r5.status);

  check("assertTrainerOwnsClient(fake,fake) → false", await assertTrainerOwnsClient("00000000-0000-0000-0000-000000000000", "11111111-1111-1111-1111-111111111111") === false);
  check("assertTrainerOwnsClient(B, propio) → true", await assertTrainerOwnsClient(tB.id, cB.id) === true);
  check("assertTrainerOwnsClient(B, ajeno) → false", await assertTrainerOwnsClient(tB.id, martinRec.id) === false);
  check("validateClientIdForTrainer inválido → null", await validateClientIdForTrainer("00000000-0000-0000-0000-000000000000", "11111111-1111-1111-1111-111111111111") === null);

  check("sanitizePath traversal", sanitizePath("../../../etc/passwd") === "etc/passwd");
  check("sanitizePath backslashes", sanitizePath("..\\..\\windows\\system32") === "windows/system32");
  check("sanitizePath normal intacto", sanitizePath("normal/path/file.jpg") === "normal/path/file.jpg");
  check("extensiones peligrosas fuera de allowlist", [".exe", ".bat", ".sh", ".php", ".js", ".html", ".svg"].every((e) => !(ALLOWED_EXTENSIONS as readonly string[]).includes(e)));
  check("MIME peligrosos fuera de allowlist", ["application/x-executable", "text/html", "application/javascript"].every((m) => !(ALLOWED_MIME_TYPES as readonly string[]).includes(m)));

  await cleanup();
  const demos = await prisma.user.count({ where: { email: { in: ["ezequiel@kinetixfitt.com", "martin@demo.com", "lucas@demo.com", "sofia@demo.com"] } } });
  check("demos intactos tras limpieza (4)", demos === 4, demos);
  await prisma.$disconnect();
  console.log(`\nResultado: ${passed} pass, ${failed} fail\n`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (error) => {
  console.error("ERROR en security E2E:", error);
  await cleanup();
  await prisma.$disconnect();
  process.exit(1);
});
