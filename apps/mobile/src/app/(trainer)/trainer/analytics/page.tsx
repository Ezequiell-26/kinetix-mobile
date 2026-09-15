import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RevenueAnalytics } from "@/components/revenue-analytics";

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export default async function AnalyticsPage() {
  /* ── Real data queries ── */
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

  // Total clients
  const totalClients = await prisma.client.count();

  // Workout logs last 30 days
  const recentLogs = await prisma.workoutLog.findMany({
    where: { date: { gte: thirtyDaysAgo }, completed: true },
    include: { client: true, _count: { select: { sets: true } } },
    orderBy: { date: "desc" },
  });

  // Check-ins
  const totalCheckins = await prisma.checkIn.count();
  const reviewedCheckins = await prisma.checkIn.count({ where: { reviewed: true } });
  const pendingCheckins = await prisma.checkIn.count({ where: { reviewed: false } });

  // Clients with most recent workout
  const clients = await prisma.client.findMany({
    include: {
      workoutLogs: { orderBy: { date: "desc" }, take: 1, where: { completed: true } },
      checkIns: { orderBy: { date: "desc" }, take: 1 },
    },
  });

  // Adherence: clients who trained in the last 7 days / total clients
  const activeThisWeek = clients.filter(
    (c) => c.workoutLogs[0]?.date && c.workoutLogs[0].date >= sevenDaysAgo
  ).length;
  const adherencePercent = totalClients > 0 ? Math.round((activeThisWeek / totalClients) * 100) : 0;

  // Top clients by volume (sum of sets from logs in last 30 days)
  const logsByClient: Record<string, { name: string; totalSets: number; totalWorkouts: number }> = {};
  for (const log of recentLogs) {
    const cid = log.clientId;
    if (!cid) continue;
    if (!logsByClient[cid]) {
      logsByClient[cid] = { name: log.client?.name || "Sin nombre", totalSets: 0, totalWorkouts: 0 };
    }
    logsByClient[cid].totalWorkouts++;
    logsByClient[cid].totalSets += log._count?.sets ?? 0;
  }
  const topClients = Object.values(logsByClient)
    .sort((a, b) => b.totalWorkouts - a.totalWorkouts)
    .slice(0, 5);

  // Churn risk: clients who haven't trained in 5+ days
  const churnClients = clients.filter((c) => {
    const last = c.workoutLogs[0]?.date;
    if (!last) return true; // Never trained
    return now.getTime() - new Date(last).getTime() > 5 * 86400000;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-display font-bold">Analíticas</h1>
        <p className="text-sm text-zinc-500">Métricas reales de tu coaching</p>
      </div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Clientes totales", value: totalClients },
          { label: "Entrenamientos (30d)", value: recentLogs.length },
          { label: "Adherencia semanal", value: `${adherencePercent}%` },
          { label: "Check-ins pendientes", value: pendingCheckins },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-black">{kpi.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* ── Check-ins overview ── */}
        <Card>
          <CardHeader><CardTitle>Check-ins</CardTitle></CardHeader>
          <CardContent>
            {totalCheckins === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-8">No hay check-ins todavía.</p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Revisados</span>
                  <span className="font-bold text-primary">{reviewedCheckins}</span>
                </div>
                <Progress value={totalCheckins > 0 ? (reviewedCheckins / totalCheckins) * 100 : 0} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Pendientes</span>
                  <span className="font-bold text-amber-400">{pendingCheckins}</span>
                </div>
                <p className="text-xs text-zinc-500">Total: {totalCheckins} check-ins</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Top clients by workouts ── */}
        <Card>
          <CardHeader><CardTitle>Top clientes por actividad</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {topClients.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-8">No hay entrenamientos registrados.</p>
            ) : (
              topClients.map((c) => (
                <div key={c.name} className="flex gap-3 items-center p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black text-sm">
                    {c.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-zinc-500">{c.totalWorkouts} entrenamientos • {c.totalSets} sets</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* ── Churn risk ── */}
        <Card>
          <CardHeader>
            <CardTitle>Riesgo de abandono</CardTitle>
            {churnClients.length > 0 && <Badge variant="warn">{churnClients.length} en riesgo</Badge>}
          </CardHeader>
          <CardContent className="space-y-3">
            {churnClients.length === 0 ? (
              <p className="text-sm text-emerald-400 text-center py-8">Todos tus clientes están activos.</p>
            ) : (
              churnClients.slice(0, 5).map((c) => {
                const lastDate = c.workoutLogs[0]?.date;
                const daysSince = lastDate ? Math.floor((now.getTime() - new Date(lastDate).getTime()) / 86400000) : null;
                const lastCheckinScore = c.checkIns[0]?.energia;
                return (
                  <div key={c.id} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="text-sm font-bold text-red-400">{c.name}</p>
                    <p className="text-xs text-zinc-400">
                      {daysSince !== null ? `${daysSince} días sin entrenar` : "Nunca entrenó"}
                      {lastCheckinScore ? ` • último check-in energía: ${lastCheckinScore}/10` : ""}
                    </p>
                    <Progress value={daysSince !== null ? Math.max(10, 100 - daysSince * 10) : 10} className="mt-2 h-1.5" />
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ingresos detallados (movido desde el dashboard: su lugar natural es acá) */}
      <RevenueAnalytics />
    </div>
  );
}