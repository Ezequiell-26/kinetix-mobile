import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { clientSchema } from "@/lib/validations";

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 200;

export async function GET(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "No auth" }, { status: 401 });
  if (s.role !== "TRAINER") return NextResponse.json({ error: "Solo trainer" }, { status: 403 });

  const url = new URL(req.url);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number.parseInt(url.searchParams.get("limit") || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT));
  const cursor = url.searchParams.get("cursor");

  const clients = await prisma.client.findMany({
    where: { trainerId: s.id },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: { assignedProgram: true, subscription: true },
  });

  const hasMore = clients.length > limit;
  const items = hasMore ? clients.slice(0, limit) : clients;
  return NextResponse.json({ items, nextCursor: hasMore ? items[items.length - 1]?.id || null : null, hasMore });
}

function fin(v: unknown): number | null {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : null;
}

export async function POST(req: Request) {
  const s = await getSession();
  if (!s || s.role !== "TRAINER") return NextResponse.json({ error: "No auth" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const parsed = clientSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message || "Datos inválidos" }, { status: 400 });
  const data = parsed.data;
  const normalizedEmail = data.email.toLowerCase().trim();

  const existing = await prisma.client.findUnique({ where: { email: normalizedEmail }, select: { id: true, trainerId: true } });
  if (existing) {
    return NextResponse.json({ error: existing.trainerId === s.id ? "Ese cliente ya existe en tu cartera." : "Email ya registrado" }, { status: 409 });
  }

  const c = await prisma.$transaction(async (tx) => {
    const created = await tx.client.create({
      data: {
        name: data.name.trim(),
        email: normalizedEmail,
        goal: data.goal || "HIPERTROFIA",
        status: data.status || "ACTIVO",
        plan: data.plan || "PERSONALIZADO",
        age: data.age ?? fin(data.age),
        weight: data.weight ?? fin(data.weight),
        height: data.height ?? fin(data.height),
        notes: data.notes?.slice(0, 1000) || null,
        trainerId: s.id,
      },
    });

    const prices: Record<string, number> = { BASICO: 12000, PERSONALIZADO: 18000, PREMIUM: 25000 };
    await tx.subscription.create({
      data: {
        clientId: created.id,
        plan: created.plan,
        status: "ACTIVA",
        nextPayment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        price: prices[created.plan] || 18000,
      },
    });
    return created;
  });

  return NextResponse.json(c, { status: 201 });
}
