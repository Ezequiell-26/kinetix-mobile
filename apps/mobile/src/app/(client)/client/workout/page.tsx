import Link from "next/link";
import { prisma } from "@/lib/db";
import { getClientForSession } from "@/lib/getClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Calendar, CheckCircle2, Clock, Timer, ArrowRight } from "lucide-react";
import { StrongTemplate } from "@/components/strong-template";
import { WorkoutLolGenerator } from "@/components/workoutlol-generator";
import { Tilt3D } from "@/components/tilt-3d";

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export default async function WorkoutListPage(){
  const sessionData = await getClientForSession().catch(() => null);
  const client = sessionData?.client;

  if (!client) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Mis Entrenamientos</h1>
          <p className="text-sm text-zinc-500">Sesiones programadas para vos</p>
        </div>
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
              <Dumbbell size={24} />
            </div>
            <p className="font-bold text-base">No hay datos todavía</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Aún no tenés un perfil de cliente activo. Contactá a tu coach para comenzar.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Load client's program with weeks, workouts, and exercises
  const program = client.assignedProgramId ? await prisma.program.findUnique({
    where: { id: client.assignedProgramId },
    include: {
      weeks: {
        orderBy: { weekNumber: "asc" },
        include: {
          workouts: {
            orderBy: { dayNumber: "asc" },
            include: {
              exercises: {
                orderBy: { order: "asc" },
                include: { exercise: true }
              }
            }
          }
        }
      }
    }
  }) : null;

  // Sin fallback: un atleta sin programa asignado ve el estado "KinetixFitt está
  // diseñando tu plan", nunca el primer programa de la base de datos.
  const activeProgram = program;

  // Load recent workout logs to know which workouts were completed
  const recentLogs = await prisma.workoutLog.findMany({
    where: {
      OR: [
        { clientId: client.id },
        ...(sessionData?.session?.id ? [{ userId: sessionData.session.id }] : [])
      ]
    },
    orderBy: { date: "desc" },
    take: 30
  });

  const completedWorkoutIds = new Set(recentLogs.map(l => l.workoutId));

  // Efecto Zeigarnik: lo pendiente se recuerda mejor → la próxima sesión destaca.
  const nextWorkoutId =
    activeProgram?.weeks.flatMap((w) => w.workouts).find((w) => !completedWorkoutIds.has(w.id))?.id ??
    null;

  if (!activeProgram || !activeProgram.weeks.length) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Mis Entrenamientos</h1>
          <p className="text-sm text-zinc-500">Plan personalizado</p>
        </div>
        <Card className="border-dashed border-zinc-800 bg-zinc-900/30">
          <CardContent className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
              <Dumbbell size={24} />
            </div>
            <p className="font-bold text-base">Tu coach está diseñando tu plan</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Tu entrenador está preparando las semanas y ejercicios ideales para tu objetivo. Te notificaremos en cuanto esté listo.
            </p>
            <Link href="/client/messages" className="inline-block mt-2 text-xs font-bold text-primary hover:underline">
              Escribir a tu coach por el chat →
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold">Mis Entrenamientos</h1>
        <p className="text-sm text-zinc-500">
          Programa: <span className="text-white font-medium">{activeProgram.name}</span> • {activeProgram.frequency} días/sem
        </p>
      </div>

      <StrongTemplate />

      <Link
        href="/client/timers"
        className="group flex items-center gap-4 rounded-2xl border border-subtle bg-surface/40 px-5 py-4 hover:border-primary/30 hover:bg-surface/70 transition-all"
      >
        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0 text-primary">
          <Timer size={19} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-white">Cronómetros PRO</p>
          <p className="text-xs text-zinc-500 truncate mt-0.5">Tabata, EMOM e HIIT con tu voz de narrador</p>
        </div>
        <ArrowRight size={16} className="text-zinc-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
      </Link>

      {activeProgram.weeks.map(w => (
        <div key={w.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-widest text-zinc-400 uppercase flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" /> Semana {w.weekNumber}
            </h2>
            <span className="text-xs text-zinc-500">{w.workouts.length} sesiones</span>
          </div>

          <div className="space-y-2.5">
            {w.workouts.map(workout => {
              const isDone = completedWorkoutIds.has(workout.id);
              const isNext = workout.id === nextWorkoutId;
              return (
                <Link key={workout.id} href={`/client/workout/${workout.id}`}>
                  {isNext && !isDone ? (
                    <Tilt3D max={3} scale={1.006} radiusClass="rounded-2xl">
                      <Card className="transition-colors group bg-zinc-900/90 border-primary/40 shadow-[0_8px_32px_rgba(52,211,153,0.18)]">
                        <CardContent className="p-4 flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition bg-primary text-black">
                            {workout.dayNumber}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm text-white truncate group-hover:text-primary transition">
                                {workout.name}
                              </p>
                              <Badge variant="accent" className="text-[10px] py-0">Siguiente</Badge>
                            </div>
                            <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <Clock size={12} className="text-zinc-500" /> {workout.estimatedMin || 60} min
                              </span>
                              <span>•</span>
                              <span>{workout.exercises.length} ejercicios</span>
                            </p>
                          </div>
                          <Badge variant="accent" className="text-xs font-bold shrink-0">Entrenar →</Badge>
                        </CardContent>
                      </Card>
                    </Tilt3D>
                  ) : (
                  <Card className={`transition-all group hover:-translate-y-0.5 ${isDone ? "bg-zinc-900/40 opacity-80 border-zinc-800" : "hover:border-zinc-700 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] border-zinc-800 bg-zinc-900/90"}`}>
                    <CardContent className="p-4 flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition ${isDone ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "pill-active group-hover:bg-primary group-hover:text-black"}`}>
                        {isDone ? <CheckCircle2 size={20} /> : workout.dayNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-white truncate group-hover:text-primary transition">
                            {workout.name}
                          </p>
                          {isDone && <Badge variant="success" className="text-[10px] py-0">Completado</Badge>}
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-zinc-500" /> {workout.estimatedMin || 60} min
                          </span>
                          <span>•</span>
                          <span>{workout.exercises.length} ejercicios</span>
                        </p>
                      </div>
                      <Badge variant={isDone ? "muted" : "accent"} className="text-xs font-bold shrink-0">
                        {isDone ? "Repetir" : "Entrenar →"}
                      </Badge>
                    </CardContent>
                  </Card>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* Generador de sesión alternativo (workout.lol MIT) */}
      <div className="pt-2">
        <WorkoutLolGenerator />
      </div>
    </div>
  );
}