import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { exerciseSchema } from "@/lib/validations";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "No auth" }, { status: 401 });
  if (s.role !== "TRAINER") return NextResponse.json({ error: "Solo entrenador" }, { status: 403 });
  const { id } = await params;

  const existing = await prisma.exercise.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Ejercicio no encontrado" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body || Array.isArray(body)) return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  const parsed = exerciseSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Datos de ejercicio inválidos" }, { status: 400 });
  if (Object.keys(parsed.data).length === 0) return NextResponse.json({ error: "No hay cambios válidos" }, { status: 400 });

  const ex = await prisma.exercise.update({ where: { id }, data: parsed.data });
  return NextResponse.json(ex);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "No auth" }, { status: 401 });
  if (s.role !== "TRAINER") return NextResponse.json({ error: "Solo entrenador" }, { status: 403 });
  const { id } = await params;

  const exercise = await prisma.exercise.findUnique({
    where: { id },
    select: { id: true, _count: { select: { workoutExercises: true } } },
  });
  if (!exercise) return NextResponse.json({ error: "Ejercicio no encontrado" }, { status: 404 });
  if (exercise._count.workoutExercises > 0) {
    return NextResponse.json(
      { error: "No se puede eliminar un ejercicio que forma parte de rutinas existentes" },
      { status: 409 },
    );
  }

  await prisma.exercise.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
