import Link from "next/link";
import dynamic from "next/dynamic";
import { prisma } from "@/lib/db";
import { getClientForSession } from "@/lib/getClient";
import { Button } from "@/components/ui/button";
const AiCoachChat = dynamic(() => import("@/components/ai-coach-chat").then((m) => m.AiCoachChat), {
  loading: () => <div className="rounded-3xl border border-subtle bg-surface/40 p-6 text-xs text-zinc-500">Cargando coach IA…</div>,
});
const PostWorkoutCoach = dynamic(
  () => import("@/components/post-workout-coach").then((m) => m.PostWorkoutCoach),
  {
    loading: () => null,
  }
);
const AdaptiveProgram = dynamic(
  () => import("@/components/adaptive-program").then((m) => m.AdaptiveProgram),
  {
    loading: () => null,
  }
);
import { FadeIn } from "@/components/ui-premium";
import { StreakVoice, TimeGreeting } from "@/components/narrator-cues";
import { TourLauncher } from "@/components/guided-tour";
import { CLIENT_TOUR, CLIENT_TOUR_KEY } from "@/lib/tours";
import { CountUp, ProgressBar, ProgressRing } from "@/components/animated-stats";
import { Gamepad2, HeartPulse, Footprints, BarChart3, Users, Settings2 } from "lucide-react";
import { lastSessionLoads, computeStreak, computeAdherence } from "@/lib/stats";
import { WeeklyProgress } from "@/components/weekly-progress";
import { SmartwatchWidget } from "@/components/smartwatch-widget";
import { Tilt3D, Tilt3DSubtle } from "@/components/tilt-3d";
import {
  Dumbbell,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  ArrowRight,
  Flame,
  TrendingUp,
  Activity,
} from "lucide-react";

// Grupos musculares de la biblioteca → etiqueta corta en español
const MUSCLE_ES: Record<string, string> = {
  chest: "Pecho", back: "Espalda", shoulders: "Hombros", biceps: "Bíceps",
  triceps: "Tríceps", abdominals: "Core", waist: "Core", glutes: "Glúteos",
  "upper legs": "Piernas", "lower legs": "Gemelos", "upper arms": "Brazos", cardio: "Cardio",
};
function muscleEs(raw: string | null): string {
  if (!raw) return "Fuerza";
  const key = raw.toLowerCase();
  for (const [k, v] of Object.entries(MUSCLE_ES)) if (key.includes(k)) return v;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export default async function ClientDashboardPage() {
  const sessionData = await getClientForSession().catch(() => null);
  const client = sessionData?.client;
  const session = sessionData?.session;

  const displayName = client?.name || session?.name || "Atleta";
  const firstName = displayName.split(" ")[0];
  const clientGoal = client?.goal ? client.goal.replace("_", " ").toLowerCase() : "rendimiento y salud";

  if (!client) {
    return (
      <div className="space-y-8 pt-4">
        <header className="space-y-2">
          <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Ezequiel Coaching</p>
          <h1 className="text-4xl font-display font-black text-white tracking-tight">Hola, {firstName}</h1>
          <p className="text-sm text-zinc-400">Bienvenido a tu equipo de entrenamiento.</p>
        </header>
        <div className="rounded-3xl border border-subtle bg-surface/60 p-10 text-center space-y-4 surface-card">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
            <Dumbbell size={26} />
          </div>
          <p className="font-display font-bold text-lg text-white">Tu cuenta está en preparación</p>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">
            Ezequiel está configurando tu ficha de atleta y tu primer programa de entrenamiento.
          </p>
          <Link href="/client/messages">
            <Button variant="accent" className="font-black h-12 px-6">Escribir a Ezequiel →</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Marcadores de fecha
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Carga paralela. Sin fallback: un atleta sin programa asignado ve el estado
  // "Ezequiel está diseñando tu plan", nunca el primer programa de la base.
  const [
    program,
    todayWorkoutLog,
    allWorkoutLogs,
    latestCheckin,
    latestMessage,
    latestMeasurement,
    checkinsCount,
    totalWorkouts,
    allLogDates,
    completedProgramWorkoutIds,
  ] = await Promise.all([
    client.assignedProgramId
      ? prisma.program.findUnique({
          where: { id: client.assignedProgramId },
          include: {
            weeks: {
              orderBy: { weekNumber: "asc" },
              include: {
                workouts: {
                  orderBy: { dayNumber: "asc" },
                  include: { exercises: { orderBy: { order: "asc" }, include: { exercise: true } } },
                },
              },
            },
          },
        })
      : Promise.resolve(null),

    prisma.workoutLog
      .findFirst({
        where: {
          OR: [{ clientId: client.id }, ...(session?.id ? [{ userId: session.id }] : [])],
          date: { gte: startOfToday },
        },
        include: { workout: true, sets: true },
      })
      .catch(() => null),

    prisma.workoutLog
      .findMany({
        where: {
          OR: [{ clientId: client.id }, ...(session?.id ? [{ userId: session.id }] : [])],
        },
        include: { sets: true, workout: true },
        orderBy: { date: "desc" },
        take: 30,
      })
      .catch(() => []),

    prisma.checkIn
      .findFirst({
        where: { OR: [{ clientId: client.id }, ...(session?.id ? [{ userId: session.id }] : [])] },
        orderBy: { date: "desc" },
      })
      .catch(() => null),

    prisma.message
      .findFirst({
        where: { OR: [{ receiverId: session?.id || "none" }, { clientId: client.id }] },
        orderBy: { createdAt: "desc" },
        include: { sender: true },
      })
      .catch(() => null),

    prisma.progressMeasurement
      .findFirst({
        where: { OR: [{ clientId: client.id }, ...(session?.id ? [{ userId: session.id }] : [])] },
        orderBy: { date: "desc" },
      })
      .catch(() => null),

    prisma.checkIn
      .count({ where: { OR: [{ clientId: client.id }, ...(session?.id ? [{ userId: session.id }] : [])] } })
      .catch(() => 0),

    // Total exacto de sesiones (el listado de abajo está limitado a 30).
    prisma.workoutLog
      .count({ where: { OR: [{ clientId: client.id }, ...(session?.id ? [{ userId: session.id }] : [])] } })
      .catch(() => 0),

    // Todas las fechas (solo el campo date) para racha y adherencia exactas.
    prisma.workoutLog
      .findMany({
        where: { OR: [{ clientId: client.id }, ...(session?.id ? [{ userId: session.id }] : [])] },
        select: { date: true },
      })
      .catch(() => []),

    // IDs de workouts del programa asignado ya completados (para elegir el próximo).
    client.assignedProgramId
      ? prisma.workoutLog
          .findMany({
            where: {
              OR: [{ clientId: client.id }, ...(session?.id ? [{ userId: session.id }] : [])],
              workout: { week: { programId: client.assignedProgramId } },
            },
            select: { workoutId: true },
            distinct: ["workoutId"],
          })
          .catch(() => [])
      : Promise.resolve([]),
  ]);

  // Entrenamiento de hoy: primer no completado del plan asignado
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allWorkoutsList = program?.weeks?.flatMap((w: any) => w.workouts) || [];
  const completedWorkoutIds = new Set(
    completedProgramWorkoutIds
      .map((l: any) => l.workoutId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((id: any): id is string => id !== null)
  );
  const todayWorkout = allWorkoutsList.find((w: any) => !completedWorkoutIds.has(w.id)) || allWorkoutsList[0];

  // ── Coach IA post-entreno (solo si ya entrenó hoy) ─────────────────
  // Compara lo registrado contra lo planificado del mismo workout.
  const completedPlanned = todayWorkoutLog?.workoutId
    ? allWorkoutsList.find(w => w.id === todayWorkoutLog.workoutId) ?? null
    : null;
  const plannedSets = completedPlanned
    ? completedPlanned.exercises.reduce((a, e) => a + (e.sets || 0), 0)
    : 0;
  const doneSets = todayWorkoutLog?.sets?.filter((s: any) => s.completed).length ?? 0;
  const sessionVolume = todayWorkoutLog?.sets
    ? todayWorkoutLog.sets.reduce((a, s) => a + (s.weight || 0) * (s.reps || 0), 0)
    : 0;
  const nextFocus = todayWorkout
    ? Array.from(new Set(todayWorkout.exercises.map(e => e.exercise.muscleGroup))).slice(0, 3).join(" · ")
    : null;

  // Métricas reales. Totales exactos: NO se derivan del listado de 30.
  const weeklyFrequency = program?.frequency || 4;
  const completedCount = totalWorkouts;
  const logDates = allLogDates.map((d: any) => d.date);
  // Adherencia = sesiones de las últimas 4 semanas ÷ objetivo del período.
  const adherence = computeAdherence(logDates, weeklyFrequency);

  const monday = new Date(now);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];
  const weekDays = dayLabels.map((label, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const count = allWorkoutLogs.filter(l => {
      const d = new Date(l.date);
      return d >= day && d < next;
    }).length;
    return { label, count, isToday: day.toDateString() === now.toDateString() };
  });
  const weekSessions = weekDays.reduce((a, d) => a + Math.min(1, d.count), 0);
  const streak = computeStreak(logDates);

  // Volumen real de la semana (kg levantados = peso × reps)
  const weekVolume = allWorkoutLogs
    .filter(l => new Date(l.date) >= monday)
    .reduce((acc, l) => acc + l.sets.reduce((a, s) => a + (s.weight || 0) * (s.reps || 0), 0), 0);

  const currentWeight = latestMeasurement?.weight || client.weight || null;

  const hasPendingCheckinThisWeek = latestCheckin
    ? now.getTime() - new Date(latestCheckin.date).getTime() > 7 * 24 * 60 * 60 * 1000
    : true;

  const dateLine = now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-9 pb-4">
      <StreakVoice streak={streak} />
      <TourLauncher steps={CLIENT_TOUR} storageKey={CLIENT_TOUR_KEY} tourName="Tu tour" />
      {/* ── 1 · SALUDO / ESTADO ─────────────────────────────────── */}
      <header className="space-y-2.5">
        <p className="text-[10px] font-bold tracking-[0.22em] text-zinc-500 uppercase">
          {dateLine} · Objetivo: <span className="text-primary">{clientGoal}</span>
        </p>
        <h1 className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight leading-[1.05]">
          <TimeGreeting name={firstName} />
        </h1>
        <p className="text-sm text-zinc-400">
          Hoy es un gran día para ser mejor que ayer.
        </p>
      </header>

      {/* ── 2 · HERO + RAIL SEMANAL ─────────────────────────────── */}
      <section className="grid lg:grid-cols-3 gap-5 items-stretch" data-tour="entreno-hoy">
        <div className="lg:col-span-2">
          {todayWorkoutLog ? (
            /* Completado hoy */
            <div className="relative overflow-hidden rounded-3xl h-full min-h-[320px] border border-primary/25 bg-surface surface-card">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-primary/[0.12] blur-3xl" />
                <div className="absolute -bottom-28 -left-10 w-72 h-72 rounded-full bg-primary/[0.06] blur-3xl" />
              </div>
              <div className="relative p-7 sm:p-8 flex flex-col h-full">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase">Entrenamiento completado</span>
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-[1.08] mt-4">
                  {todayWorkoutLog.workout?.name || "Sesión realizada"}
                </h2>
                <p className="text-sm text-zinc-400 mt-2">
                  {todayWorkoutLog.durationMin ? `${todayWorkoutLog.durationMin} min registrados · ` : ""}Tu esfuerzo ya vive en tu progreso.
                </p>
                <div className="mt-auto pt-6 space-y-4">
                  {todayWorkout && !completedWorkoutIds.has(todayWorkout.id) && (
                    <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-subtle pt-4">
                      <span>Próxima sesión:</span>
                      <span className="font-bold text-zinc-200">{todayWorkout.name}</span>
                    </div>
                  )}
                  <Link href={`/client/workout/${todayWorkoutLog.workoutId}`} className="block">
                    <Button variant="outline" className="w-full h-12 font-bold border-subtle text-zinc-200">
                      Ver detalle de la sesión
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : todayWorkout ? (
            /* Pendiente: el bloque dominante de la pantalla */
            <Tilt3D max={4} scale={1.008} className="h-full">
            <div className="relative overflow-hidden rounded-3xl h-full min-h-[380px] border border-primary/20 bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.25)] surface-card">
              {/* Profundidad: glows radiales del acento + textura fantasma + viñeta tipo foto de estudio */}
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(24,24,27,0.4),rgba(9,9,11,0.9))]" />
                <div className="absolute -top-28 -right-20 w-96 h-96 rounded-full bg-primary/[0.16] blur-3xl" />
                <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-primary/[0.08] blur-3xl" />
                <div className="absolute top-0 right-0 bottom-0 w-1/2 opacity-60 bg-[radial-gradient(circle_at_70%_30%,rgba(52,211,153,0.12),transparent_55%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]" />
                <Dumbbell className="absolute -right-6 -bottom-8 text-primary/10 rotate-[-18deg]" size={220} strokeWidth={1} />
              </div>

              <div className="relative p-7 sm:p-8 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/25 px-3.5 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Entrenamiento de hoy</span>
                  </span>
                  <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                    <Clock size={13} /> {todayWorkout.estimatedMin || 60} min
                  </span>
                </div>

                <h2 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-[1.04] mt-5">
                  {todayWorkout.name}
                </h2>
                <p className="text-sm text-zinc-400 mt-2.5">
                  {todayWorkout.exercises.length} ejercicios · RIR controlado
                </p>

                {/* Progreso de la sesión: 0% real hasta registrar */}
                <div className="mt-5 max-w-xs">
                  <div className="flex justify-between text-[10px] font-bold tracking-wider text-zinc-500 uppercase mb-1.5">
                    <span>Progreso de hoy</span>
                    <span>0%</span>
                  </div>
                  <ProgressBar value={0} />
                </div>

                {/* Ejercicios: monograma + nombre + músculo + series, escaneable en 1s */}
                <div className="mt-6 space-y-2">
                  {todayWorkout.exercises.slice(0, 3).map((ex, idx) => (
                    <div key={ex.id} className="flex items-center gap-3 rounded-2xl bg-zinc-950/60 border border-subtle/60 px-3.5 py-2.5 backdrop-blur-sm">
                      <span className="w-7 h-7 rounded-full bg-primary/10 border border-primary/25 text-primary text-[11px] font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{ex.exercise.name}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{muscleEs(ex.exercise.muscleGroup)}</p>
                      </div>
                      <span className="text-xs font-bold text-zinc-300 shrink-0 tabular-nums">
                        {ex.sets} × {ex.reps}
                        {ex.rir !== null && <span className="text-zinc-500 font-medium"> · RIR {ex.rir}</span>}
                      </span>
                    </div>
                  ))}
                  {todayWorkout.exercises.length > 3 && (
                    <p className="text-[11px] text-zinc-500 pl-1 pt-0.5">
                      +{todayWorkout.exercises.length - 3} ejercicios más en la sesión
                    </p>
                  )}
                </div>

                <div className="mt-auto pt-7">
                  <Link href={`/client/workout/${todayWorkout.id}`} className="block">
                    <Button
                      variant="accent"
                      className="w-full h-14 rounded-2xl text-lg font-black tracking-wide shadow-[0_8px_40px_rgba(52,211,153,0.35)]"
                    >
                      COMENZAR ENTRENAMIENTO
                      <ArrowRight size={20} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            </Tilt3D>
          ) : (
            /* Sin programa asignado: estado honesto */
            <div className="relative overflow-hidden rounded-3xl h-full min-h-[320px] border border-subtle bg-surface surface-card">
              <div className="absolute -top-20 -right-10 w-72 h-72 rounded-full bg-primary/[0.06] blur-3xl pointer-events-none" />
              <div className="relative p-8 flex flex-col items-center justify-center text-center h-full space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Dumbbell size={26} />
                </div>
                <p className="font-display font-black text-2xl text-white">Ezequiel está diseñando tu plan</p>
                <p className="text-sm text-zinc-500 max-w-xs">
                  Está preparando las semanas y ejercicios ideales para tu objetivo. Te avisa en cuanto esté listo.
                </p>
                <Link href="/client/messages" className="text-xs font-black text-primary hover:underline">
                  Escribirle ahora →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Rail semanal + widget estilo smartwatch */}
        <div className="flex flex-col gap-5 h-full">
          <Tilt3D max={5} scale={1.01} radiusClass="rounded-3xl">
            <WeeklyProgress
              days={weekDays}
              weekSessions={weekSessions}
              frequency={weeklyFrequency}
              streak={streak}
            />
          </Tilt3D>
          <Tilt3D max={10} scale={1.03} radiusClass="rounded-[38px]">
            <SmartwatchWidget
              workoutName={todayWorkoutLog ? (todayWorkoutLog.workout?.name || "Sesión de hoy") : todayWorkout?.name}
              progressPct={todayWorkoutLog ? 100 : 0}
              calories={Math.round(sessionVolume > 0 ? sessionVolume / 8 : 0)}
            />
          </Tilt3D>
        </div>
      </section>

      {/* ── 2b · COACH IA POST-ENTRENO (solo si ya entrenó hoy) ──── */}
      {todayWorkoutLog && (
        <PostWorkoutCoach
          doneSets={doneSets}
          plannedSets={plannedSets}
          volume={sessionVolume}
          durationMin={todayWorkoutLog.durationMin}
          nextWorkoutName={
            todayWorkout && !completedWorkoutIds.has(todayWorkout.id) ? todayWorkout.name : null
          }
          nextFocus={nextFocus}
          nextHref={
            todayWorkout && !completedWorkoutIds.has(todayWorkout.id)
              ? `/client/workout/${todayWorkout.id}`
              : undefined
          }
        />
      )}

      {/* ── 3 · MÉTRICAS: strip con divisores internos ──────────── */}
      <FadeIn delay={0.05}>
        <section
          className="rounded-3xl border border-subtle bg-surface/60 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-subtle overflow-hidden surface-card"
          aria-label="Métricas principales"
        >
          <div className="p-5 hover:bg-white/[0.02] transition-colors">
            <p className="text-[10px] font-bold tracking-[0.16em] text-zinc-500 uppercase flex items-center gap-1.5"><Activity size={11} /> Volumen semanal</p>
            <p className="text-3xl font-display font-black text-white tabular-nums mt-2">
              <CountUp value={Math.round(weekVolume)} />
              <span className="text-sm text-zinc-500 font-bold ml-1">kg</span>
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">kg levantados esta semana</p>
          </div>
          <div className="p-5 hover:bg-white/[0.02] transition-colors">
            <p className="text-[10px] font-bold tracking-[0.16em] text-zinc-500 uppercase flex items-center gap-1.5"><ClipboardCheck size={11} /> Adherencia</p>
            <p className="text-3xl font-display font-black text-white tabular-nums mt-2">
              <CountUp value={adherence} suffix="%" />
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">{completedCount} sesiones registradas</p>
          </div>
          <div className="p-5 hover:bg-white/[0.02] transition-colors">
            <p className="text-[10px] font-bold tracking-[0.16em] text-zinc-500 uppercase flex items-center gap-1.5"><TrendingUp size={11} /> Peso</p>
            <p className="text-3xl font-display font-black text-white tabular-nums mt-2">
              {currentWeight ? <CountUp value={currentWeight} decimals={1} suffix=" kg" /> : "—"}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">{currentWeight ? "última medición" : "cargá tu primera medición"}</p>
          </div>
          <div className="p-5 hover:bg-white/[0.02] transition-colors">
            <p className="text-[10px] font-bold tracking-[0.16em] text-zinc-500 uppercase flex items-center gap-1.5"><Flame size={11} /> Racha</p>
            <p className={`text-3xl font-display font-black tabular-nums mt-2 ${streak > 0 ? "text-primary" : "text-zinc-400"}`}>
              {streak > 0 ? <CountUp value={streak} suffix=" d" /> : "—"}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">{streak > 0 ? "entrenando día a día" : "hoy puede ser día 1"}</p>
          </div>
        </section>
      </FadeIn>

      {/* ── 4 · PENDIENTES ESTA SEMANA ──────────────────────────── */}
      <FadeIn delay={0.1}>
        <section className="space-y-3">
          <p className="text-[10px] font-bold tracking-[0.22em] text-zinc-500 uppercase px-1">Pendiente esta semana</p>
          <Link
            href="/client/checkins"
            className="group flex items-center gap-4 rounded-2xl border border-subtle bg-surface/40 px-5 py-4 hover:border-primary/30 hover:bg-surface/70 transition-all surface-card"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${hasPendingCheckinThisWeek ? "bg-warning/10 border border-warning/25 text-warning" : "bg-zinc-800/60 border border-subtle text-zinc-400"}`}>
              <ClipboardCheck size={19} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-white flex items-center gap-2">
                Check-in semanal
                {hasPendingCheckinThisWeek && (
                  <span className="text-[9px] font-black tracking-wider bg-warning/15 text-warning px-2 py-0.5 rounded-full uppercase">Pendiente</span>
                )}
              </p>
              <p className="text-xs text-zinc-500 truncate mt-0.5">
                {latestCheckin
                  ? `Último: ${new Date(latestCheckin.date).toLocaleDateString("es-AR", { day: "numeric", month: "short" })} · ${latestCheckin.reviewed ? "revisado por Ezequiel" : "en revisión"}`
                  : "Contale a Ezequiel cómo vino tu semana"}
              </p>
            </div>
            <ArrowRight size={16} className="text-zinc-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>

          {latestMessage && (
            <Link
              href="/client/messages"
              className="group flex items-center gap-4 rounded-2xl border border-subtle bg-surface/40 px-5 py-4 hover:border-primary/30 hover:bg-surface/70 transition-all surface-card"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0 font-black text-primary text-sm">
                E
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-white">Mensaje de Ezequiel</p>
                <p className="text-xs text-zinc-500 truncate mt-0.5 italic">
                  &quot;{latestMessage.content}&quot;
                </p>
              </div>
              <ArrowRight size={16} className="text-zinc-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          )}
        </section>
      </FadeIn>

      {/* ── 5 · COACH IA + SEMANA ADAPTATIVA ────────────────────── */}
      <FadeIn delay={0.15}>
        <section className="space-y-3">
          <p className="text-[10px] font-bold tracking-[0.22em] text-zinc-500 uppercase px-1">Tu coach inteligente</p>
          <AiCoachChat />
          <AdaptiveProgram lastWeek={lastSessionLoads(allWorkoutLogs)} />
        </section>
      </FadeIn>

      {/* ── 6 · DESCUBRIMIENTO ──────────────────────────────────── */}
      <FadeIn delay={0.2}>
        <section className="space-y-3">
          <div className="flex items-end justify-between px-1">
            <p className="text-[10px] font-bold tracking-[0.22em] text-zinc-500 uppercase">Explorá todo lo que podés hacer</p>
            <Link href="/client/tools" className="text-xs font-black text-primary hover:underline whitespace-nowrap">
              Ver herramientas →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { href: "/client/tools?cat=gamificacion", label: "Juegos & XP", Icon: Gamepad2 },
              { href: "/client/tools?cat=salud", label: "Salud", Icon: HeartPulse },
              { href: "/client/tools?cat=cardio", label: "Cardio", Icon: Footprints },
              { href: "/client/tools?cat=datos", label: "Datos", Icon: BarChart3 },
              { href: "/client/tools?cat=social", label: "Social", Icon: Users },
              { href: "/client/tools?cat=sistema", label: "Sistema", Icon: Settings2 },
            ].map(c => (
              <Tilt3DSubtle key={c.href}>
              <Link
                href={c.href}
                className="group relative p-3.5 rounded-2xl bg-surface/40 border border-subtle hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all text-center space-y-1.5 overflow-hidden block surface-card"
              >
                <span className="absolute inset-0 bg-gradient-to-b from-primary/0 to-primary/0 group-hover:from-primary/[0.06] group-hover:to-transparent transition-colors" />
                <c.Icon size={17} className="relative mx-auto text-primary transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                <span className="relative text-[10px] font-bold text-zinc-300 block leading-tight">{c.label}</span>
              </Link>
              </Tilt3DSubtle>
            ))}
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
