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

async function getOwnedProgram(id: string, trainerId: string) {
  const program = await prisma.program.findUnique({ where: { id }, select: { trainerId: true, durationWeeks: true, frequency: true } });
  if (!program) return { kind: "missing" as const };
  if (program.trainerId !== trainerId) return { kind: "forbidden" as const };
  return { kind: "ok" as const, program };
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "No auth" }, { status: 401 });
  const { id } = await params;

  if (s.role === "CLIENT") {
    const client = await prisma.client.findFirst({ where: { OR: [{ userId: s.id }, { email: s.email }] }, select: { assignedProgramId: true } });
    if (!client || client.assignedProgramId !== id) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  } else {
    const program = await prisma.program.findUnique({ where: { id }, select: { trainerId: true } });
    if (!program) return NextResponse.json({ error: "Programa no encontrado" }, { status: 404 });
    if (program.trainerId && program.trainerId !== s.id) return NextResponse.json({ error: "Programa no encontrado" }, { status: 404 });
  }

  const program = await prisma.program.findUnique({ where: { id }, include: FULL_INCLUDE });
  if (!program) return NextResponse.json({ error: "Programa no encontrado" }, { status: 404 });
  return NextResponse.json(program);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s || s.role !== "TRAINER") return NextResponse.json({ error: "Solo trainer" }, { status: 403 });
  const { id } = await params;
  const access = await getOwnedProgram(id, s.id);
  if (access.kind === "missing") return NextResponse.json({ error: "Programa no encontrado" }, { status: 404 });
  if (access.kind === "forbidden") return NextResponse.json({ error: "Programa no encontrado" }, { status: 404 });

  try {
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 160) : "";
    if (!name) return NextResponse.json({ error: "El nombre del programa es requerido" }, { status: 400 });
    const description = typeof body?.description === "string" ? body.description.trim().slice(0, 1000) : null;
    const weeks = body?.weeks;
    if (weeks !== undefined && !Array.isArray(weeks)) return NextResponse.json({ error: "El formato de semanas no es válido" }, { status: 400 });
    if (Array.isArray(weeks) && weeks.length > 52) return NextResponse.json({ error: "El programa no puede superar 52 semanas" }, { status: 400 });

    const durationWeeks = boundedInt(body?.durationWeeks, access.program.durationWeeks, 1, 52);
    const frequency = boundedInt(body?.frequency, access.program.frequency, 1, 7);

    await prisma.$transaction(async (tx) => {
      await tx.program.update({ where: { id }, data: { name, description, durationWeeks, frequency } });
      if (Array.isArray(weeks)) await replaceProgramWeeks(id, weeks, tx);
    });

    return NextResponse.json(await prisma.program.findUnique({ where: { id }, include: FULL_INCLUDE }));
  } catch (error: unknown) {
    console.error("[PROGRAM PUT]", error);
    return NextResponse.json({ error: "No se pudo actualizar el programa" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s || s.role !== "TRAINER") return NextResponse.json({ error: "Solo trainer" }, { status: 403 });
  const { id } = await params;
  const access = await getOwnedProgram(id, s.id);
  if (access.kind === "missing") return NextResponse.json({ error: "Programa no encontrado" }, { status: 404 });
  if (access.kind === "forbidden") return NextResponse.json({ error: "La plantilla global no se puede eliminar o no existe." }, { status: 403 });
  await prisma.program.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
