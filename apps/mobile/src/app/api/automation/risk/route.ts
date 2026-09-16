import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const MAX_CLIENTS = 100;
const INACTIVITY_DAYS = 5;
const CHECKIN_DAYS = 7;

function daysBetween(from: Date, to = new Date()) {
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / 86_400_000));
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No auth" }, { status: 401 });
  if (session.role !== "TRAINER") return NextResponse.json({ error: "Solo trainer" }, { status: 403 });

  try {
    const clients = await prisma.client.findMany({
      where: { trainerId: session.id, status: { not: "FINALIZADO" } },
      orderBy: { updatedAt: "desc" },
      take: MAX_CLIENTS,
      select: {
        id: true,
        name: true,
        userId: true,
        startDate: true,
        workoutLogs: { orderBy: { date: "desc" }, take: 1, select: { date: true } },
        checkIns: { orderBy: { date: "desc" }, take: 1, select: { date: true, reviewed: true } },
      },
    });

    const now = new Date();
    const risks = clients.flatMap((client) => {
      const lastWorkout = client.workoutLogs[0]?.date ?? null;
      const lastCheckIn = client.checkIns[0]?.date ?? null;
      const lastActivity = [lastWorkout, lastCheckIn, client.startDate].filter(Boolean).sort((a, b) => b!.getTime() - a!.getTime())[0] ?? now;
      const inactiveDays = daysBetween(lastActivity, now);
      const checkinDays = lastCheckIn ? daysBetween(lastCheckIn, now) : daysBetween(client.startDate, now);
      const reasons: string[] = [];
      if (inactiveDays >= INACTIVITY_DAYS) reasons.push(`Sin actividad hace ${inactiveDays} días`);
      if (checkinDays >= CHECKIN_DAYS) reasons.push("Check-in pendiente");
      if (client.checkIns[0] && !client.checkIns[0].reviewed) reasons.push("Check-in sin revisar");
      if (!reasons.length) return [];
      return [{
        id: client.id,
        name: client.name,
        userId: client.userId,
        lastWorkoutAt: lastWorkout,
        lastCheckInAt: lastCheckIn,
        inactiveDays,
        reasons,
        priority: inactiveDays >= 10 ? "high" : inactiveDays >= INACTIVITY_DAYS ? "medium" : "low",
      }];
    });

    risks.sort((a, b) => b.inactiveDays - a.inactiveDays);
    return NextResponse.json({ generatedAt: now.toISOString(), risks });
  } catch (error) {
    console.error("[AUTOMATION RISK]", error);
    return NextResponse.json({ error: "No se pudieron calcular los riesgos" }, { status: 500 });
  }
}
