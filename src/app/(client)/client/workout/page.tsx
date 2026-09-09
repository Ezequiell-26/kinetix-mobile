import Link from "next/link";
import { prisma } from "@/lib/db";
import { getClientForSession } from "@/lib/getClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Calendar, CheckCircle2, Clock } from "lucide-react";

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
              Aún no tienes un perfil de cliente activo. Contacta a Ezequiel para comenzar.
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

  // Fallback: if client doesn't have assigned program, get default program if available
  const activeProgram = program || await prisma.program.findFirst({
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
  });

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

  if (!activeProgram || !activeProgram.weeks.length) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Mis Entrenamientos</h1>
          <p className="text-sm text-zinc-500">Plan personalizado</p>
        </div>
        <Card className="border-dashed border-zinc-800 bg-zinc-900/30">
          <CardContent className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D6FF2A]/10 border border-[#D6FF2A]/20 flex items-center justify-center mx-auto text-[#D6FF2A]">
              <Dumbbell size={24} />
            </div>
            <p className="font-bold text-base">Ezequiel está diseñando tu plan</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Tu entrenador está preparando las semanas y ejercicios ideales para tu objetivo. Te notificaremos en cuanto esté listo.
            </p>
            <Link href="/client/messages" className="inline-block mt-2 text-xs font-bold text-[#D6FF2A] hover:underline">
              Escribir a Ezequiel por el chat →
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

      {activeProgram.weeks.map(w => (
        <div key={w.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-widest text-zinc-400 uppercase flex items-center gap-1.5">
              <Calendar size={14} className="text-[#D6FF2A]" /> Semana {w.weekNumber}
            </h2>
            <span className="text-xs text-zinc-500">{w.workouts.length} sesiones</span>
          </div>

          <div className="space-y-2.5">
            {w.workouts.map(workout => {
              const isDone = completedWorkoutIds.has(workout.id);
              return (
                <Link key={workout.id} href={`/client/workout/${workout.id}`}>
                  <Card className={`hover:border-zinc-700 transition border-zinc-800 group ${isDone ? "bg-zinc-900/40 opacity-80" : "bg-zinc-900/90"}`}>
                    <CardContent className="p-4 flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition ${isDone ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white text-black group-hover:bg-[#D6FF2A]"}`}>
                        {isDone ? <CheckCircle2 size={20} /> : workout.dayNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-white truncate group-hover:text-[#D6FF2A] transition">
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
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
