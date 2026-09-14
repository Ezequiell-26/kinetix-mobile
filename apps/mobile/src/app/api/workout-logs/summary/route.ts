import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { assertTrainerOwnsClient } from "@/lib/authorization";
import { computeStreak, countPRs, computeAdherence, weeklyAnalytics } from "@/lib/stats";
import type { Prisma } from "@prisma/client";

/**
 * Agregados exactos de entrenamiento.
 *
 * Se calculan sobre TODOS los logs del alcance, no sobre la página de 50 que
 * devuelve GET /api/workout-logs. Así los KPIs (total de sesiones, racha, PRs,
 * adherencia, semanales) no quedan truncados por el límite del listado.
 */
export async function GET(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "No auth" }, { status: 401 });

  const url = new URL(req.url);
  const targetClientId = url.searchParams.get("clientId");

  // Alcance por rol: CLIENT -> sus propios datos; TRAINER -> clientId o todos.
  let scope: Prisma.WorkoutLogWhereInput = {};
  let frequency = 4;

  if (s.role === "CLIENT") {
    const client = await prisma.client.findFirst({
      where: { OR: [{ userId: s.id }, { email: s.email }] },
      select: { id: true, assignedProgramId: true },
    });
    scope = { OR: [{ userId: s.id }, ...(client?.id ? [{ clientId: client.id }] : [])] };
    frequency = await frequencyFor(client?.assignedProgramId ?? null);
  } else if (targetClientId) {
    // P0 IDOR: TRAINER solo puede consultar sus propios clientes
    const owned = await assertTrainerOwnsClient(s.id, targetClientId);
    if (!owned) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }
    scope = { clientId: targetClientId };
    const client = await prisma.client.findUnique({
      where: { id: targetClientId },
      select: { assignedProgramId: true },
    });
    frequency = await frequencyFor(client?.assignedProgramId ?? null);
  }
  // Trainer sin clientId: alcance global (todos los logs).

  const [logs, measurements] = await Promise.all([
    prisma.workoutLog.findMany({
      where: scope,
      include: { sets: true },
      orderBy: { date: "asc" },
    }),
    prisma.progressMeasurement.findMany({
      where: scope as Prisma.ProgressMeasurementWhereInput,
      select: { date: true, weight: true },
      orderBy: { date: "asc" },
    }),
  ]);

  const dates = logs.map(l => l.date);
  const sets = logs.flatMap(l =>
    l.sets.map(st => ({ exerciseName: st.exerciseName, weight: st.weight, date: l.date }))
  );

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
  const program = await prisma.program.findUnique({
    where: { id: programId },
    select: { frequency: true },
  });
  return program?.frequency || 4;
}
