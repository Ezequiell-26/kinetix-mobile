import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { replaceProgramWeeks } from "@/lib/programs";

const FULL_INCLUDE = {
  weeks: {
    orderBy: { weekNumber: "asc" as const },
    include: {
      workouts: {
        orderBy: { dayNumber: "asc" as const },
        include: { exercises: { orderBy: { order: "asc" as const }, include: { exercise: true } } },
      },
    },
  },
  clients: { select: { id: true, name: true } },
};

function boundedInt(value: unknown, fallback: number, min: number, max: number) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "No auth" }, { status: 401 });

  if (s.role === "CLIENT") {
    const client = await prisma.client.findFirst({ where: { OR: [{ userId: s.id }, { email: s.email }] } });
    if (!client?.assignedProgramId) return NextResponse.json([]);
    const program = await prisma.program.findUnique({ where: { id: client.assignedProgramId }, include: FULL_INCLUDE });
    return NextResponse.json(program ? [program] : []);
  }

  const programs = await prisma.program.findMany({
    where: { OR: [{ trainerId: s.id }, { trainerId: null }] },
    include: FULL_INCLUDE,
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(programs);
}

export async function POST(req: Request) {
  const s = await getSession();
  if (!s || s.role !== "TRAINER") return NextResponse.json({ error: "Solo trainer" }, { status: 403 });

  try {
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 160) : "";
    if (!name) return NextResponse.json({ error: "El nombre del programa es requerido" }, { status: 400 });

    const description = typeof body?.description === "string" ? body.description.trim().slice(0, 1000) : null;
    const weeks = body?.weeks;
    if (weeks !== undefined && !Array.isArray(weeks)) return NextResponse.json({ error: "El formato de semanas no es válido" }, { status: 400 });
    if (Array.isArray(weeks) && weeks.length > 52) return NextResponse.json({ error: "El programa no puede superar 52 semanas" }, { status: 400 });

    const durationWeeks = boundedInt(body?.durationWeeks, Array.isArray(weeks) && weeks.length ? weeks.length : 4, 1, 52);
    const frequency = boundedInt(body?.frequency, 4, 1, 7);

    const created = await prisma.$transaction(async (tx) => {
      const program = await tx.program.create({
        data: { trainerId: s.id, name, description, durationWeeks, frequency },
      });
      if (Array.isArray(weeks)) await replaceProgramWeeks(program.id, weeks, tx);
      return tx.program.findUnique({ where: { id: program.id }, include: FULL_INCLUDE });
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    console.error("[PROGRAMS POST]", error);
    return NextResponse.json({ error: "No se pudo guardar el programa" }, { status: 500 });
  }
}
