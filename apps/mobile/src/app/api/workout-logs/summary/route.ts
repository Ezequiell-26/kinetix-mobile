import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { assertTrainerOwnsClient } from "@/lib/authorization";
import { computeStreak, countPRs, computeAdherence, weeklyAnalytics } from "@/lib/stats";
import type { Prisma } from "@prisma/client";

/** Agregados exactos de entrenamiento dentro del alcance autorizado. */
export async function GET(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "No auth" }, { status: 401 });

  const url = new URL(req.url);
  const targetClientId = url.searchParams.get("clientId");
  let scope: Prisma.WorkoutLogWhereInput;
  let measurementScope: Prisma.ProgressMeasurementWhereInput;
  let frequency = 4;

  if (s.role === "CLIENT") {
    const client = await prisma.client.findFirst({
      where: { OR: [{ userId: s.id }, { email: s.email }] },
      select: { id: true, assignedProgramId: true },
    });
    scope = { OR: [{ userId: s.id }, ...(client?.id ? [{ clientId: client.id }] : [])] };
    measurementScope = { OR: [{ userId: s.id }, ...(client?.id ? [{ clientId: client.id }] : [])] };
    frequency = await frequencyFor(client?.assignedProgramId ?? null);
  } else if (targetClientId) {
    if (!(await assertTrainerOwnsClient(s.id, targetClientId))) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }
    scope = { clientId: targetClientId };
    measurementScope = { clientId: targetClientId };
    const client = await prisma.client.findUnique({ where: { id: targetClientId }, select: { assignedProgramId: true } });
    frequency = await frequencyFor(client?.assignedProgramId ?? null);
  } else {
    // Trainer global: únicamente clientes pertenecientes a este trainer.
    scope = { client: { trainerId: s.id } };
    measurementScope = { client: { trainerId: s.id } };
  }

  const [logs, measurements] = await Promise.all([
    prisma.workoutLog.findMany({ where: scope, include: { sets: true }, orderBy: { date: "asc" } }),
    prisma.progressMeasurement.findMany({ where: measurementScope, select: { date: true, weight: true }, orderBy: { date: "asc" } }),
  ]);

  const dates = logs.map((log) => log.date);
  const sets = logs.flatMap((log) => log.sets.map((set) => ({ exerciseName: set.exerciseName, weight: set.weight, date: log.date })));

  return NextResponse.json({
    totalWorkouts: logs.length,
    streak: computeStreak(dates),
    prs: countPRs(sets),
    adherence: computeAdherence(dates, frequency),
    frequency,
    weekly: weeklyAnalytics(logs, measurements, frequency),
  });
}

async function frequencyFor(programId: string | null): Promise<number> {
  if (!programId) return 4;
  const program = await prisma.program.findUnique({ where: { id: programId }, select: { frequency: true } });
  return program?.frequency || 4;
}
