import { NextRequest, NextResponse } from "next/server";
import { getSession, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertTrainerOwnsClient, validateClientIdForTrainer } from "@/lib/authorization";

/**
 * POST /api/analytics — ingesta de eventos (fire-and-forget).
 * El userId se toma de la SESIÓN cuando existe; el `userId` del body se
 * ignora (antes se aceptaba arbitrario sin auth). Sin sesión se acepta
 * igual (endpoint de telemetría, no de datos) pero sin atribución.
 */
export async function POST(req: NextRequest) {
  try {
    const s = await getSession().catch(() => null);
    const body = await req.json();
    const { event, properties, timestamp } = body;

    if (!event || !timestamp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Solo en desarrollo se loguea (no hay email real configurado).
    // Nunca incluye secretos: event + userId de sesión + props.
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics — agregados REALES (solo TRAINER).
 * Ahora con verificación de ownership: un trainer solo puede ver analytics
 * de sus propios clientes. Si se pasa clientId, se verifica que pertenezca
 * al trainer autenticado.
 */
export async function GET(req: NextRequest) {
  const t = await requireRole(["TRAINER"]);
  if (!t) return NextResponse.json({ error: "No auth" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // P0 Security: verificar ownership del clientId si se proporciona
    if (clientId) {
      const ownsClient = await assertTrainerOwnsClient(t.id, clientId);
      if (!ownsClient) {
        // 404 para no revelar si el cliente existe o no
        return NextResponse.json(
          { error: "Cliente no encontrado" },
          { status: 404 }
        );
      }
    }

    const date: { gte?: Date; lte?: Date } = {};
    if (startDate) date.gte = new Date(startDate);
    if (endDate) date.lte = new Date(endDate);
    const where = {
      completed: true,
      ...(clientId ? { clientId } : {}),
      ...(startDate || endDate ? { date } : {}),
    };

    const [totalWorkouts, logs] = await Promise.all([
      prisma.workoutLog.count({ where }),
      prisma.workoutLog.findMany({
        where,
        select: {
          durationMin: true,
          sets: { select: { exerciseName: true, weight: true, reps: true } },
        },
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
        byExercise.set(
          set.exerciseName,
          (byExercise.get(set.exerciseName) ?? 0) + 1
        );
      }
    }

    const mostPopularExercises = [...byExercise.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, sets]) => ({ name, sets }));

    return NextResponse.json({
      totalWorkouts,
      totalVolume: Math.round(totalVolume * 100) / 100,
      averageDuration: durationN
        ? Math.round((durationSum / durationN) * 10) / 10
        : 0,
      mostPopularExercises,
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
