import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { assertTrainerOwnsClient } from "@/lib/authorization";
import { prisma } from "@/lib/db";

const MAX_ITEMS = 30;

function finiteNumber(value: unknown, fallback: number | null = null) {
  if (value === null || value === undefined || value === "") return fallback;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No auth" }, { status: 401 });

  const body = await req.json().catch(() => null) as { items?: unknown } | null;
  if (!Array.isArray(body?.items) || body.items.length === 0) return NextResponse.json({ accepted: 0 });
  if (body.items.length > MAX_ITEMS) return NextResponse.json({ error: `Máximo ${MAX_ITEMS} sesiones por sincronización` }, { status: 400 });

  let accepted = 0;
  const errors: Array<{ index: number; error: string }> = [];

  for (const [index, item] of body.items.entries()) {
    if (!item || typeof item !== "object") { errors.push({ index, error: "Item inválido" }); continue; }
    const data = item as Record<string, unknown>;

    let clientId: string | null = null;
    if (session.role === "CLIENT") {
      const client = await prisma.client.findFirst({ where: { OR: [{ userId: session.id }, { email: session.email }] }, select: { id: true } });
      clientId = client?.id || null;
      if (!clientId) { errors.push({ index, error: "Perfil de cliente no encontrado" }); continue; }
    } else if (typeof data.clientId === "string") {
      if (!(await assertTrainerOwnsClient(session.id, data.clientId))) { errors.push({ index, error: "Cliente no encontrado" }); continue; }
      clientId = data.clientId;
    }

    const rawDate = typeof data.date === "string" ? new Date(data.date) : new Date();
    const date = Number.isNaN(rawDate.getTime()) ? new Date() : rawDate;
    const workoutId = typeof data.workoutId === "string" && data.workoutId ? data.workoutId : null;
    if (workoutId) {
      const workout = await prisma.workout.findUnique({ where: { id: workoutId }, include: { week: { select: { programId: true } } } });
      if (!workout) { errors.push({ index, error: "Entrenamiento no encontrado" }); continue; }
      if (session.role === "CLIENT") {
        const client = await prisma.client.findUnique({ where: { id: clientId! }, select: { assignedProgramId: true } });
        if (!client || client.assignedProgramId !== workout.week.programId) { errors.push({ index, error: "Entrenamiento fuera del programa asignado" }); continue; }
      }
    }

    const sets = Array.isArray(data.sets) ? data.sets.slice(0, 100).map((value) => {
      const set = value as Record<string, unknown>;
      return {
        exerciseName: String(set.exerciseName || "Ejercicio").slice(0, 200),
        setNumber: Math.max(1, Math.floor(finiteNumber(set.setNumber, 1)!)),
        weight: finiteNumber(set.weight), reps: finiteNumber(set.reps) === null ? null : Math.max(0, Math.floor(finiteNumber(set.reps)!)),
        rir: finiteNumber(set.rir) === null ? null : Math.max(0, Math.floor(finiteNumber(set.rir)!)),
        rpe: finiteNumber(set.rpe) === null ? null : Math.max(0, Math.floor(finiteNumber(set.rpe)!)),
        completed: set.completed !== false,
      };
    }) : [];

    const idempotencyKey = typeof data.clientMutationId === "string" ? data.clientMutationId.slice(0, 100) : null;
    if (idempotencyKey) {
      const existing = await prisma.workoutLog.findFirst({ where: { clientId, comment: { contains: `[offline:${idempotencyKey}]` } }, select: { id: true } });
      if (existing) { accepted++; continue; }
    }

    await prisma.workoutLog.create({
      data: {
        userId: session.id,
        clientId,
        workoutId,
        workoutName: typeof data.workoutName === "string" ? data.workoutName.trim().slice(0, 200) : workoutId ? undefined : "Entrenamiento sincronizado",
        date,
        durationMin: finiteNumber(data.durationMin) === null ? null : Math.max(0, Math.floor(finiteNumber(data.durationMin)!)),
        comment: `${typeof data.comment === "string" ? data.comment.slice(0, 900) : ""}${idempotencyKey ? ` [offline:${idempotencyKey}]` : ""}`.trim() || null,
        completed: data.completed !== false,
        sets: sets.length ? { create: sets } : undefined,
      },
    });
    accepted++;
  }

  return NextResponse.json({ accepted, rejected: errors.length, errors });
}
