import Link from "next/link";
import { prisma } from "@/lib/db";
import { getClientForSession } from "@/lib/getClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PremiumCalendar } from "@/components/premium-calendar";
import { 
  Dumbbell, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  ClipboardCheck, 
  TrendingUp, 
  ArrowRight,
  Flame,
  Calendar,
  AlertCircle
} from "lucide-react";

export default async function ClientDashboardPage(){
  const sessionData = await getClientForSession().catch(() => null);
  const client = sessionData?.client;
  const session = sessionData?.session;

  const displayName = client?.name || session?.name || "Atleta";
  const clientGoal = client?.goal ? client.goal.replace("_", " ") : "Rendimiento y Salud";

  if (!client) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Hola, {displayName} 👋</h1>
          <p className="text-sm text-zinc-500">Bienvenido a Ezequiel Coaching</p>
        </div>
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="py-12 text-center space-y-3">
            <p className="font-bold text-base text-white">Tu cuenta está en preparación</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Ezequiel está configurando tu ficha de atleta y tu primer programa de entrenamiento.
            </p>
            <Link href="/client/messages" className="inline-block mt-2">
              <Button variant="accent" size="sm" className="font-bold">
                Escribir a Ezequiel →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Current date markers
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Parallel data fetching for client
  const [
    program,
    todayWorkoutLog,
    allWorkoutLogs,
    latestCheckin,
    latestMessage,
    latestMeasurement
  ] = await Promise.all([
    client.assignedProgramId ? prisma.program.findUnique({
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
    }) : prisma.program.findFirst({
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
    }),

    prisma.workoutLog.findFirst({
      where: {
        OR: [
          { clientId: client.id },
          ...(session?.id ? [{ userId: session.id }] : [])
        ],
        date: { gte: startOfToday }
      },
      include: { workout: true }
    }).catch(() => null),

    prisma.workoutLog.findMany({
      where: {
        OR: [
          { clientId: client.id },
          ...(session?.id ? [{ userId: session.id }] : [])
        ]
      },
      orderBy: { date: "desc" },
      take: 30
    }).catch(() => []),

    prisma.checkIn.findFirst({
      where: {
        OR: [
          { clientId: client.id },
          ...(session?.id ? [{ userId: session.id }] : [])
        ]
      },
      orderBy: { date: "desc" }
    }).catch(() => null),

    prisma.message.findFirst({
      where: {
        OR: [
          { receiverId: session?.id || "none" },
          { clientId: client.id }
        ]
      },
      orderBy: { createdAt: "desc" },
      include: { sender: true }
    }).catch(() => null),

    prisma.progressMeasurement.findFirst({
      where: {
        OR: [
          { clientId: client.id },
          ...(session?.id ? [{ userId: session.id }] : [])
        ]
      },
      orderBy: { date: "desc" }
    }).catch(() => null)
  ]);

  // Determine "Entrenamiento de Hoy"
  const allWorkoutsList = program?.weeks?.flatMap(w => w.workouts) || [];
  const completedWorkoutIds = new Set(allWorkoutLogs.map(l => l.workoutId));
  
  // Find first non-completed workout, or default to the first workout
  const todayWorkout = allWorkoutsList.find(w => !completedWorkoutIds.has(w.id)) || allWorkoutsList[0];
  const nextWorkoutIndex = allWorkoutsList.findIndex(w => w.id === todayWorkout?.id);
  const nextWorkout = allWorkoutsList[nextWorkoutIndex + 1] || null;

  // Real adherence calculation
  const weeklyFrequency = program?.frequency || 4;
  const targetWorkouts = weeklyFrequency * 4;
  const completedCount = allWorkoutLogs.length;
  const adherence = Math.min(100, Math.round((completedCount / Math.max(1, targetWorkouts)) * 100));

  // Current weight
  const currentWeight = latestMeasurement?.weight || client.weight || null;

  // Check-in status
  const hasPendingCheckinThisWeek = latestCheckin 
    ? (now.getTime() - new Date(latestCheckin.date).getTime()) > 7 * 24 * 60 * 60 * 1000
    : true;

  return (
    <div className="space-y-5">
      {/* Saludo y Objetivo */}
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">
          Hola, {displayName.split(" ")[0]} 👋
        </h1>
        <p className="text-xs text-zinc-400">
          Objetivo activo: <span className="text-[#D6FF2A] font-bold">{clientGoal}</span>
        </p>
      </div>

      {/* ELEMENTO PRIORITARIO: ENTRENAMIENTO DE HOY */}
      {todayWorkoutLog ? (
        /* Caso: Ya entrenó hoy */
        <Card className="border-emerald-500/40 bg-gradient-to-br from-emerald-500/[0.08] via-zinc-900 to-zinc-950 shadow-lg">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="success" className="text-xs font-bold py-1 px-3">
                ✓ ENTRENAMIENTO DE HOY COMPLETADO
              </Badge>
              <span className="text-xs text-zinc-400">{todayWorkoutLog.durationMin || 45} min</span>
            </div>
            <div>
              <p className="font-display font-bold text-xl text-white">
                {todayWorkoutLog.workout?.name || "Sesión Realizada"}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                ¡Gran sesión! Tu esfuerzo ya quedó registrado en tu progreso.
              </p>
            </div>
            {nextWorkout && (
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Próximo entrenamiento:</span>
                <span className="font-semibold text-zinc-300">{nextWorkout.name}</span>
              </div>
            )}
            <Link href={`/client/workout/${todayWorkoutLog.workoutId}`} className="block pt-1">
              <Button variant="outline" size="sm" className="w-full text-xs h-10 border-zinc-700">
                Ver detalle de la sesión
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : todayWorkout ? (
        /* Caso: Tiene entrenamiento asignado pendiente */
        <Card className="border-[#D6FF2A]/50 bg-gradient-to-br from-[#D6FF2A]/[0.10] via-zinc-900 to-zinc-950 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#D6FF2A]/[0.08] rounded-full blur-3xl pointer-events-none" />
          <CardContent className="p-5 space-y-4 relative">
            <div className="flex items-center justify-between">
              <Badge variant="accent" className="font-black text-xs py-1 px-3">
                ENTRENAMIENTO DE HOY
              </Badge>
              <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                <Clock size={13} /> {todayWorkout.estimatedMin || 60} min
              </span>
            </div>

            <div>
              <h2 className="font-display font-black text-2xl text-white tracking-tight">
                {todayWorkout.name}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {todayWorkout.exercises.length} ejercicios programados • RIR controlado
              </p>
            </div>

            {/* Exercise preview */}
            <div className="space-y-1.5 pt-1">
              {todayWorkout.exercises.slice(0, 3).map((ex, idx) => (
                <div
                  key={ex.id}
                  className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80"
                >
                  <span className="font-medium text-white truncate max-w-[200px]">
                    {idx + 1}. {ex.exercise.name}
                  </span>
                  <span className="text-zinc-400 text-[11px] shrink-0">
                    {ex.sets} × {ex.reps} {ex.rir !== null ? `(RIR ${ex.rir})` : ""}
                  </span>
                </div>
              ))}
              {todayWorkout.exercises.length > 3 && (
                <p className="text-[11px] text-zinc-500 text-center pt-0.5">
                  +{todayWorkout.exercises.length - 3} ejercicios más
                </p>
              )}
            </div>

            <Link href={`/client/workout/${todayWorkout.id}`} className="block pt-1">
              <Button
                variant="accent"
                className="w-full h-14 font-black text-base tracking-wide shadow-lg shadow-[#D6FF2A]/20"
              >
                COMENZAR ENTRENAMIENTO →
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* Caso: Sin rutina cargada */
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardContent className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
              <Dumbbell size={24} />
            </div>
            <p className="font-bold text-base text-white">Sin entrenamiento programado para hoy</p>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Ezequiel está asignando tu rutina de la semana. Podés escribirle en el chat si tenés alguna duda.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Progreso del Atleta */}
      <div className="grid grid-cols-3 gap-2.5">
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="p-3 text-center">
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Peso</span>
            <p className="text-lg font-black text-white mt-0.5">
              {currentWeight ? `${currentWeight} kg` : "--"}
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">actual</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="p-3 text-center">
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Adherencia</span>
            <p className="text-lg font-black text-white mt-0.5">{adherence}%</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">{completedCount} sesiones</p>
          </CardContent>
        </Card>

        <Card className="border-[#D6FF2A]/20 bg-[#D6FF2A]/[0.03]">
          <CardContent className="p-3 text-center">
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Plan</span>
            <p className="text-lg font-black text-[#D6FF2A] mt-0.5">{client.plan}</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">{weeklyFrequency}d / sem</p>
          </CardContent>
        </Card>
      </div>

      {/* Check-in Card */}
      <Link href="/client/checkins" className="block">
        <Card className={`border-zinc-800 hover:border-zinc-700 transition ${hasPendingCheckinThisWeek ? "border-[#D6FF2A]/30 bg-zinc-900" : "bg-zinc-900/80"}`}>
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-[#D6FF2A] shrink-0 font-bold">
              <ClipboardCheck size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm text-white">Check-in Semanal</p>
                {hasPendingCheckinThisWeek && (
                  <Badge variant="warn" className="text-[10px]">Pendiente</Badge>
                )}
              </div>
              <p className="text-xs text-zinc-400 truncate mt-0.5">
                {latestCheckin
                  ? `Último: ${new Date(latestCheckin.date).toLocaleDateString("es-AR", { day: "numeric", month: "short" })} ${latestCheckin.reviewed ? "• Revisado ✓" : "• En revisión"}`
                  : "Completá tu reporte semanal para Ezequiel"}
              </p>
            </div>
            <ArrowRight size={16} className="text-zinc-500 shrink-0" />
          </CardContent>
        </Card>
      </Link>

      {/* Último Mensaje del Entrenador */}
      {latestMessage && (
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="p-4 flex gap-3.5 items-start">
            <div className="w-10 h-10 rounded-xl bg-[#D6FF2A] flex items-center justify-center font-black text-black text-sm shrink-0">
              E
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex justify-between items-baseline">
                <p className="font-bold text-xs text-white">Mensaje de Ezequiel</p>
                <span className="text-[10px] text-zinc-500">
                  {new Date(latestMessage.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                </span>
              </div>
              <p className="text-xs text-zinc-300 italic line-clamp-2">
                &quot;{latestMessage.content}&quot;
              </p>
              <Link href="/client/messages" className="inline-block pt-1 text-xs font-bold text-[#D6FF2A] hover:underline">
                Responder mensaje →
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendario de Actividad */}
      <PremiumCalendar />
    </div>
  );
}
