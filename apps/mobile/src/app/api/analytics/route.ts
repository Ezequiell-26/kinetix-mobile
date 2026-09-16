import { NextRequest, NextResponse } from "next/server";
import { getSession, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertTrainerOwnsClient } from "@/lib/authorization";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

const MAX_EVENT_LENGTH = 80;
const MAX_PROPERTIES = 30;
const MAX_ANALYTICS_LOGS = 5000;

/** POST /api/analytics — telemetría autenticada y acotada. */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No auth" }, { status: 401 });

  const limit = await checkRateLimit(getClientIp(req), `analytics:${session.id}`, { max: 120, windowMs: 60 * 60 * 1000 });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Límite de eventos alcanzado" },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetMs / 1000)) } },
    );
  }

  try {
    const body = await req.json();
    const event = typeof body?.event === "string" ? body.event.trim() : "";
    const timestamp = typeof body?.timestamp === "string" ? body.timestamp : "";
    const properties = body?.properties && typeof body.properties === "object" && !Array.isArray(body.properties) ? body.properties : {};

    if (!event || event.length > MAX_EVENT_LENGTH || !timestamp || Number.isNaN(Date.parse(timestamp))) {
      return NextResponse.json({ error: "Evento inválido" }, { status: 400 });
    }

    const propertyEntries = Object.entries(properties)
      .slice(0, MAX_PROPERTIES)
      .map(([key, value]) => [
        key.slice(0, 80),
        typeof value === "string"
          ? value.slice(0, 500)
          : typeof value === "number" || typeof value === "boolean" || value === null
            ? value
            : String(value).slice(0, 500),
      ] as const);

    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics Event]", { event, userId: session.id, properties: Object.fromEntries(propertyEntries) });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** GET /api/analytics — agregados reales, solo TRAINER y su cartera. */
export async function GET(req: NextRequest) {
  const t = await requireRole(["TRAINER"]);
  if (!t) return NextResponse.json({ error: "No auth" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    if (clientId && !(await assertTrainerOwnsClient(t.id, clientId))) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    const startDate = startDateParam ? new Date(startDateParam) : null;
    const endDate = endDateParam ? new Date(endDateParam) : null;
    if ((startDate && Number.isNaN(startDate.getTime())) || (endDate && Number.isNaN(endDate.getTime()))) {
      return NextResponse.json({ error: "Rango de fechas inválido" }, { status: 400 });
    }
    if (startDate && endDate && startDate > endDate) {
      return NextResponse.json({ error: "startDate no puede ser posterior a endDate" }, { status: 400 });
    }

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
        select: { durationMin: true, sets: { select: { exerciseName: true, weight: true, reps: true } } },
        take: MAX_ANALYTICS_LOGS,
        orderBy: { date: "desc" },
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

    return NextResponse.json({
      totalWorkouts,
      totalVolume: Math.round(totalVolume * 100) / 100,
      averageDuration: durationN ? Math.round((durationSum / durationN) * 10) / 10 : 0,
      mostPopularExercises: [...byExercise.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, sets]) => ({ name, sets })),
      truncated: totalWorkouts > logs.length,
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
