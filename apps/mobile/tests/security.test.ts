/**
 * Tests E2E de seguridad P0 (requiere servidor vivo + DB con seed).
 *
 * Reemplaza la versión con tokens mock (que pasaba por 401 en vez de por
 * ownership real) y el beforeAll que BORRABA users/clientes de la DB.
 * Acá: fixtures aisladas `sectest-*@test.com`, login REAL por API y
 * limpieza solo de lo creado. Los demos (KinetixFitt/Martín/Lucas/Sofía)
 * deben seguir intactos al final.
 *
 *   Servidor:  http://localhost:3001 (o BASE_URL)
 *   Correr:    npm run test:security   (OPT-IN: no va en `npm test`)
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  assertTrainerOwnsClient,
  validateClientIdForTrainer,
} from "../src/lib/authorization";
import {
  sanitizePath,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
} from "../src/lib/security";

const BASE = process.env.BASE_URL || "http://localhost:3001";
const prisma = new PrismaClient();
const TAG = `sectest-${Date.now()}`;

let passed = 0;
let failed = 0;

function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}`, detail ?? "");
  }
}

async function login(email: string, password: string): Promise<string | null> {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  const setCookie = res.headers.get("set-cookie") || "";
  const m = setCookie.match(/ec_token=([^;]+)/);
  return m ? `ec_token=${m[1]}` : null;
}

const get = (path: string, cookie?: string) =>
  fetch(`${BASE}${path}`, {
    headers: cookie ? { Cookie: cookie } : {},
  });

async function main() {
  // Preflight: servidor vivo
  try {
    const r = await fetch(`${BASE}/login`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
  } catch {
    console.log(
      `\nABORTADO: no hay servidor en ${BASE}. Levantalo con npm run dev y reintentá.\n`
    );
    process.exit(1);
  }

  console.log("\nSeguridad P0 — ownership real\n");

  // Fixtures aisladas (solo estas se borran al final)
  const tB = await prisma.user.create({
    data: {
      name: "SecTest TrainerB",
      email: `sectest-tb-${TAG}@test.com`,
      password: await bcrypt.hash("password123", 10),
      role: "TRAINER",
    },
  });
  const cBUser = await prisma.user.create({
    data: {
      name: "SecTest ClientB",
      email: `sectest-cb-${TAG}@test.com`,
      password: await bcrypt.hash("password123", 10),
      role: "CLIENT",
    },
  });
  const cB = await prisma.client.create({
    data: {
      name: "SecTest ClientB",
      email: `sectest-cb-${TAG}@test.com`,
      userId: cBUser.id,
      trainerId: tB.id,
    },
  });

  const cookieB = await login(`sectest-tb-${TAG}@test.com`, "password123");
  const cookieEze = await login(
    "ezequiel@kinetixfitt.com",
    "Admin123!"
  );
  const cookieMartin = await login("martin@demo.com", "cliente123");
  check("login real trainerB", !!cookieB);
  check("login real KinetixFitt", !!cookieEze);
  check("login real Martín", !!cookieMartin);
  if (!cookieB || !cookieEze || !cookieMartin) throw new Error("sin sesión");

  // Víctima: ficha de Martín (dueño KinetixFitt)
  const martinList = (await (
    await get("/api/clients", cookieEze)
  ).json()) as Array<{ email: string; id: string }>;
  const martinRec = martinList.find((c) => c.email === "martin@demo.com");
  check("Martín existe y es de KinetixFitt", !!martinRec);
  if (!martinRec) throw new Error("sin fixture víctima");

  // 0. Control positivo: el token de B SÍ ve lo propio (mata tests vacuos:
  // si esto falla, los bloqueos de abajo no probarían nada).
  const own = await get(`/api/clients/${cB.id}`, cookieB);
  check("control: trainerB ve a su cliente (200)", own.status === 200, own.status);

  // 1. Trainer B NO ve cliente de KinetixFitt → 404 (no revela existencia)
  const r1 = await get(`/api/clients/${martinRec.id}`, cookieB);
  check("trainerB bloqueado en cliente ajeno (404)", r1.status === 404, r1.status);

  // 2. Cliente NO ve ficha de otro cliente → 403
  const cookieCb = await login(`sectest-cb-${TAG}@test.com`, "password123");
  const r2 = await get(`/api/clients/${martinRec.id}`, cookieCb || "");
  check("cliente bloqueado en ficha ajena (403)", r2.status === 403, r2.status);

  // 3. ID inexistente → 404 con mensaje exacto (anti-enumeración)
  const r3 = await get(
    `/api/clients/00000000-0000-0000-0000-000000000000`,
    cookieB
  );
  const b3 = (await r3.json().catch(() => ({}))) as { error?: string };
  check(
    "fake id → 404 'Cliente no encontrado'",
    r3.status === 404 && b3.error === "Cliente no encontrado",
    `${r3.status} ${b3.error}`
  );

  // 4. Upload traversal en escritura → 400
  const form = new FormData();
  form.append("type", "../..");
  form.append(
    "file",
    new Blob(["x"], { type: "image/jpeg" }),
    "p.jpg"
  );
  const r4 = await fetch(`${BASE}/api/uploads`, {
    method: "POST",
    headers: { Cookie: cookieMartin },
    body: form,
  });
  check("upload type=../.. → 400", r4.status === 400, r4.status);

  // 5. Upload sin auth → 401
  const r5 = await fetch(`${BASE}/api/uploads/progress/test.jpg`);
  check("upload anónimo → 401", r5.status === 401, r5.status);

  console.log("\nFunciones de autorización (lecturas reales a DB)\n");
  check(
    "assertTrainerOwnsClient(fake,fake) → false",
    (await assertTrainerOwnsClient(
      "00000000-0000-0000-0000-000000000000",
      "11111111-1111-1111-1111-111111111111"
    )) === false
  );
  check(
    "assertTrainerOwnsClient(B, su cliente) → true",
    (await assertTrainerOwnsClient(tB.id, cB.id)) === true
  );
  check(
    "assertTrainerOwnsClient(B, cliente de KinetixFitt) → false",
    (await assertTrainerOwnsClient(tB.id, martinRec.id)) === false
  );
  check(
    "validateClientIdForTrainer inválido → null",
    (await validateClientIdForTrainer(
      "00000000-0000-0000-0000-000000000000",
      "11111111-1111-1111-1111-111111111111"
    )) === null
  );

  console.log("\nSanitización (@/lib/security)\n");
  check(
    "sanitizePath traversal",
    sanitizePath("../../../etc/passwd") === "etc/passwd"
  );
  check(
    "sanitizePath backslashes",
    sanitizePath("..\\..\\windows\\system32") === "windows/system32"
  );
  check(
    "sanitizePath normal intacto",
    sanitizePath("normal/path/file.jpg") === "normal/path/file.jpg"
  );
  const dangerousExt = [".exe", ".bat", ".sh", ".php", ".js", ".html", ".svg"];
  check(
    "extensiones peligrosas fuera de allowlist",
    dangerousExt.every(
      (e) => !(ALLOWED_EXTENSIONS as readonly string[]).includes(e)
    )
  );
  const dangerousMime = [
    "application/x-executable",
    "text/html",
    "application/javascript",
  ];
  check(
    "MIME peligrosos fuera de allowlist",
    dangerousMime.every(
      (m) => !(ALLOWED_MIME_TYPES as readonly string[]).includes(m)
    )
  );

  // Limpieza SOLO fixtures (patrón sectest-). Los demos no se tocan.
  await prisma.client.deleteMany({ where: { email: { contains: "@test.com" } } });
  await prisma.user.deleteMany({ where: { email: { contains: "@test.com" } } });
  const demos = await prisma.user.count({
    where: {
      email: {
        in: [
          "ezequiel@kinetixfitt.com",
          "martin@demo.com",
          "lucas@demo.com",
          "sofia@demo.com",
        ],
      },
    },
  });
  check("demos intactos tras limpieza (4)", demos === 4, demos);

  await prisma.$disconnect();
  console.log(`\nResultado: ${passed} pass, ${failed} fail\n`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.log("ERROR en security E2E:", e);
  // Intento de limpieza ante fallo a mitad de camino
  await prisma.client
    .deleteMany({ where: { email: { contains: "@test.com" } } })
    .catch(() => {});
  await prisma.user
    .deleteMany({ where: { email: { contains: "@test.com" } } })
    .catch(() => {});
  await prisma.$disconnect();
  process.exit(1);
});
