import { prisma } from "@/lib/db";
import { getClientForSession } from "@/lib/getClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dumbbell, Clock, Flame, Calendar, CheckCircle2 } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function HistoryPage(){
  const sessionData = await getClientForSession().catch(() => null);
  const client = sessionData?.client;
  const user = sessionData?.session;

  const logs = await prisma.workoutLog.findMany({
    where: {
      OR: [
        ...(user?.id ? [{ userId: user.id }] : []),
        ...(client?.id ? [{ clientId: client.id }] : [])
      ]
    },
    include: {
      workout: true,
      sets: true
    },
    orderBy: { date: "desc" },
    take: 50
  }).catch(() => []);

  // Compute total volume across all logs
  const totalVolumeKg = logs.reduce((totalAcc, log) => {
    const logVolume = (log.sets || []).reduce((setAcc, st) => {
      return setAcc + ((st.weight || 0) * (st.reps || 0));
    }, 0);
    return totalAcc + logVolume;
  }, 0);

  // Total sets
  const totalSetsCompleted = logs.reduce((acc, l) => acc + (l.sets?.length || 0), 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold">Historial de Entrenamientos</h1>
        <p className="text-sm text-zinc-500">Tus sesiones reales registradas y volumen levantado</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="p-3.5 text-center">
            <span className="text-[11px] text-zinc-500 uppercase font-bold block">Entrenos</span>
            <p className="text-xl font-black text-white mt-0.5">{logs.length}</p>
            <p className="text-[10px] text-zinc-400">completados</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="p-3.5 text-center">
            <span className="text-[11px] text-zinc-500 uppercase font-bold block">Volumen Total</span>
            <p className="text-xl font-black text-primary mt-0.5">
              {totalVolumeKg > 1000 ? `${(totalVolumeKg / 1000).toFixed(1)} t` : `${totalVolumeKg} kg`}
            </p>
            <p className="text-[10px] text-zinc-400">acumulado</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="p-3.5 text-center">
            <span className="text-[11px] text-zinc-500 uppercase font-bold block">Series</span>
            <p className="text-xl font-black text-white mt-0.5">{totalSetsCompleted}</p>
            <p className="text-[10px] text-zinc-400">registradas</p>
          </CardContent>
        </Card>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {logs.length === 0 ? (
          <Card className="border-dashed border-zinc-800 bg-zinc-900/40">
            <CardContent className="py-14 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                <Dumbbell size={22} />
              </div>
              <p className="font-bold text-base text-white">No hay datos todavía</p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Tus entrenamientos finalizados se registrarán automáticamente aquí con su duración, series y volumen.
              </p>
              <Link href="/client/workout" className="inline-block mt-2">
                <Button variant="accent" size="sm" className="font-bold">
                  Ir a Entrenar →
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          logs.map((log) => {
            const logVolume = (log.sets || []).reduce((acc, st) => acc + ((st.weight || 0) * (st.reps || 0)), 0);
            return (
              <Card key={log.id} className="border-zinc-800 bg-zinc-900/90 hover:border-zinc-700 transition">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-base text-white">{log.workout?.name || "Entrenamiento"}</p>
                      <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-zinc-500">
                          <Calendar size={12} /> {new Date(log.date).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-zinc-500">
                          <Clock size={12} /> {log.durationMin || 45} min
                        </span>
                      </p>
                    </div>
                    <Badge variant="success" className="text-xs">
                      Completado
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Series Realizadas</span>
                      <span className="font-bold text-white text-sm">{log.sets.length} series</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Volumen de Sesión</span>
                      <span className="font-black text-primary text-sm">{logVolume.toLocaleString("es-AR")} kg</span>
                    </div>
                  </div>

                  {log.comment && (
                    <p className="text-xs text-zinc-400 italic">
                      &quot;{log.comment}&quot;
                    </p>
                  )}

                  <div className="flex gap-2 pt-1">
                    <Link href={`/client/workout/${log.workoutId}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Repetir Rutina
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Card className="border-dashed border-zinc-800">
        <CardContent className="py-6 text-center">
          <p className="font-bold text-sm">Progreso y Métricas</p>
          <p className="text-xs text-zinc-500 mt-0.5">Evolución de peso, medidas corporales y fotos de progreso</p>
          <Link href="/client/progress">
            <Button variant="outline" size="sm" className="mt-3">
              Ver Gráficos y Progreso →
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}