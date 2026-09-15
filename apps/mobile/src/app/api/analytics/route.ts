import { NextRequest, NextResponse } from "next/server";
import { getSession, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertTrainerOwnsClient } from "@/lib/authorization";

/**
 * POST /api/analytics — telemetría no sensible.
 * El usuario se obtiene de la sesión y nunca del body.
 */
export async function POST(req: NextRequest) {
  try {
    const s = await getSession().catch(() => null);
    const body = await req.json();
    const { event, properties, timestamp } = body;

    if (!event || !timestamp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics Event]", {
        event,
        userId: s?.id ?? null,
        properties,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** GET /api/analytics — agregados reales, solo TRAINER. */
export async function GET(req: NextRequest) {
  const t = await requireRole(["TRAINER"]);
  if (!t) return NextResponse.json({ error: "No auth" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    if (clientId) {
      const ownsClient = await assertTrainerOwnsClient(t.id, clientId);
      if (!ownsClient) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    const startDate = startDateParam ? new Date(startDateParam) : null;
    const endDate = endDateParam ? new Date(endDateParam) : null;
    if ((startDate && Number.isNaN(startDate.getTime())) || (endDate && Number.isNaN(endDate.getTime()))) {
      return NextResponse.json({ error: "Rango de fechas inválido" }, { status: 400 });
    }
    if (startDate && endDate && startDate > endDate) {
      return NextResponse.json({ error: "startDate no puede ser posterior a endDate" }, { status: 400 });
    }

    // Siempre limitar por ownership. Con clientId, la comprobación anterior ya valida el acceso.
    const where = {
      completed: true,
      client: { trainerId: t.id },
      ...(clientId ? { clientId } : {}),
      ...(startDate || endDate
        ? { date: { ...(startDate ? { gte: startDate } : {}), ...(endDate ? { lte: endDate } : {}) } }
        : {}),
    };

    const [totalWorkouts, logs] = await Promise.all([
      prisma.workoutLog.count({ where }),
      prisma.workoutLog.findMany({
        where,
        select: {
          durationMin: true,
          sets: { select: { exerciseName: true, weight: true, reps: true } },
        },
        take: 5000,
      }),
    ]);

    let totalVolume = 0;
    let durationSum = 0;
    let durationN = 0;
    const byExercise = new Map<string, number>();
    for (const log of logs) {
      if (log.durationMin != null) {
        durationSum += log.durationMin;
        durationN++;
      }
      for (const set of log.sets) {
        totalVolume += (set.weight ?? 0) * (set.reps ?? 0);
        byExercise.set(set.exerciseName, (byExercise.get(set.exerciseName) ?? 0) + 1);
      }
    }

    const mostPopularExercises = [...byExercise.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, sets]) => ({ name, sets }));

    return NextResponse.json({
      totalWorkouts,
      totalVolume: Math.round(totalVolume * 100) / 100,
      averageDuration: durationN ? Math.round((durationSum / durationN) * 10) / 10 : 0,
      mostPopularExercises,
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
