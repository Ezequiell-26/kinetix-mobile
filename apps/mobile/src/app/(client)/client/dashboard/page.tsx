import Link from "next/link";
import { prisma } from "@/lib/db";
import { getClientForSession } from "@/lib/getClient";
import { Button } from "@/components/ui/button";
import { TimeGreeting } from "@/components/narrator-cues";
import { AiCoachChat } from "@/components/ai-coach-chat";
import { BRAND } from "@/constants/branding";
import { computeAdherence, computeStreak } from "@/lib/stats";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Dumbbell,
  Flame,
  Goal,
  MessageCircle,
  Play,
  Scale,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";

type ExercisePreview = {
  id: string;
  sets: number;
  reps: number;
  rir: number | null;
  exercise: { name: string; muscleGroup: string | null };
};

function muscleLabel(value: string | null) {
  const map: Record<string, string> = {
    chest: "Pecho",
    back: "Espalda",
    shoulders: "Hombros",
    biceps: "Bíceps",
    triceps: "Tríceps",
    abdominals: "Core",
    glutes: "Glúteos",
    "upper legs": "Piernas",
    "lower legs": "Gemelos",
    cardio: "Cardio",
  };
  const key = value?.toLowerCase() || "";
  for (const [needle, label] of Object.entries(map)) if (key.includes(needle)) return label;
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "Fuerza";
}

function Sparkline({ muted = false }: { muted?: boolean }) {
  return (
    <svg viewBox="0 0 180 40" className="h-10 w-full" aria-hidden="true">
      <path
        d="M2 31 C 18 26, 21 30, 33 24 S 51 18, 62 24 S 78 14, 93 20 S 110 10, 123 16 S 143 12, 155 8 S 169 10, 178 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className={muted ? "text-[#314656]" : "text-[#C6F91E]"}
      />
      {!muted && (
        <path
          d="M2 31 C 18 26, 21 30, 33 24 S 51 18, 62 24 S 78 14, 93 20 S 110 10, 123 16 S 143 12, 155 8 S 169 10, 178 3 V40 H2Z"
          className="fill-[#C6F91E]/10"
        />
      )}
    </svg>
  );
}

function StatCard({ label, value, unit, icon: Icon, detail }: { label: string; value: string; unit: string; icon: typeof Dumbbell; detail: string }) {
  return (
    <div className="group rounded-[24px] border border-[#1C3142] bg-[#0B151E] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:border-[#C6F91E]/30 hover:bg-[#0D1821]">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C6F91E]/20 bg-[#C6F91E]/[0.08] text-[#C6F91E]"><Icon size={18} /></span>
        <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8193A5]">{label}</p><p className="mt-0.5 text-[10px] text-[#55697A]">esta semana</p></div>
      </div>
      <div className="mt-4 flex items-end gap-2"><span className="font-display text-3xl font-black tracking-tight text-white">{value}</span><span className="pb-1 text-sm font-bold text-[#8193A5]">{unit}</span></div>
      <p className="mt-2 text-xs text-[#8193A5]">{detail}</p>
      <div className="mt-2"><Sparkline /></div>
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(100, Math.round(value)));
  const circumference = 2 * Math.PI * 36;
  return (
    <div className="relative h-[92px] w-[92px] shrink-0">
      <svg viewBox="0 0 92 92" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="46" cy="46" r="36" fill="none" stroke="#1C3142" strokeWidth="7" />
        <circle cx="46" cy="46" r="36" fill="none" stroke="#C6F91E" strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - safe / 100)} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-white">{safe}%</span>
    </div>
  );
}

export default async function ClientDashboardPage() {
  const sessionData = await getClientForSession().catch(() => null);
  const client = sessionData?.client;
  const session = sessionData?.session;
  const displayName = client?.name || session?.name || "Atleta";
  const firstName = displayName.split(" ")[0];

  if (!client) {
    return (
      <div className="mx-auto max-w-2xl rounded-[30px] border border-[#1C3142] bg-[#0B151E] p-10 text-center shadow-[0_26px_90px_rgba(0,0,0,0.28)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C6F91E]/20 bg-[#C6F91E]/10 text-[#C6F91E]"><Dumbbell size={25} /></div>
        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-[#C6F91E]">{BRAND.name}</p>
        <h1 className="mt-3 font-display text-4xl font-black text-white">Hola, {firstName}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8193A5]">Tu ficha de atleta todavía está en preparación. Cuando tu coach asigne el programa, aparecerá acá.</p>
        <Link href="/client/messages" className="mt-7 inline-flex h-11 items-center rounded-xl bg-[#C6F91E] px-5 text-sm font-black text-black">Escribir a tu coach</Link>
      </div>
    );
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monday = new Date(now);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const [program, todayLog, recentLogs, measurements, latestCheckin, latestMessage, unreadMessages] = await Promise.all([
    client.assignedProgramId
      ? prisma.program.findUnique({
          where: { id: client.assignedProgramId },
          include: { weeks: { orderBy: { weekNumber: "asc" }, include: { workouts: { orderBy: { dayNumber: "asc" }, include: { exercises: { orderBy: { order: "asc" }, include: { exercise: true } } } } } } },
        })
      : Promise.resolve(null),
    prisma.workoutLog.findFirst({ where: { clientId: client.id, date: { gte: startOfToday } }, include: { workout: true, sets: true }, orderBy: { date: "desc" } }).catch(() => null),
    prisma.workoutLog.findMany({ where: { clientId: client.id }, include: { workout: true, sets: true }, orderBy: { date: "desc" }, take: 30 }).catch(() => []),
    prisma.progressMeasurement.findMany({ where: { clientId: client.id }, orderBy: { date: "desc" }, take: 8 }).catch(() => []),
    prisma.checkIn.findFirst({ where: { clientId: client.id }, orderBy: { date: "desc" } }).catch(() => null),
    prisma.message.findFirst({ where: { OR: [{ receiverId: session?.id || "none" }, { clientId: client.id }] }, orderBy: { createdAt: "desc" }, include: { sender: true } }).catch(() => null),
    session?.id ? prisma.message.count({ where: { receiverId: session.id, read: false } }).catch(() => 0) : Promise.resolve(0),
  ]);

  type WorkoutWithExercises = (typeof program extends null ? never : NonNullable<typeof program>["weeks"][number]["workouts"][number]);
  const workouts = (program?.weeks.flatMap((week) => week.workouts) ?? []) as WorkoutWithExercises[];
  const completedIds = new Set(recentLogs.map((log) => log.workoutId).filter((id): id is string => Boolean(id)));
  const nextWorkout = workouts.find((workout) => !completedIds.has(workout.id)) ?? workouts[0] ?? null;
  const todayCompleted = Boolean(todayLog);
  const weekLogs = recentLogs.filter((log) => new Date(log.date) >= monday);
  const weekSessions = weekLogs.length;
  const volume = weekLogs.reduce((total, log) => total + log.sets.reduce((sum, set) => sum + (set.weight || 0) * (set.reps || 0), 0), 0);
  const streak = computeStreak(recentLogs.map((log) => log.date));
  const adherence = computeAdherence(recentLogs.map((log) => log.date), program?.frequency || 4);
  const currentWeight = measurements[0]?.weight ?? client.weight ?? null;
  const previousWeight = measurements[1]?.weight ?? null;
  const weightDelta = currentWeight !== null && previousWeight !== null ? currentWeight - previousWeight : null;
  const checkinPending = !latestCheckin || now.getTime() - new Date(latestCheckin.date).getTime() > 7 * 24 * 60 * 60 * 1000;
  const dateLine = now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];
  const weekDays = dayLabels.map((label, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const count = weekLogs.filter((log) => { const date = new Date(log.date); return date >= day && date < next; }).length;
    return { label, count, isToday: day.toDateString() === now.toDateString() };
  });

  return (
    <div className="mx-auto max-w-[1240px] space-y-5 pb-10 text-white">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#8193A5]">{dateLine} · Objetivo: <span className="text-[#C6F91E]">{client.goal ? client.goal.replaceAll("_", " ").toLowerCase() : "rendimiento y salud"}</span></p>
          <h1 className="mt-2 font-display text-4xl font-black leading-none tracking-tight sm:text-[48px]"><TimeGreeting name={firstName} /></h1>
          <p className="mt-2 text-sm text-[#8193A5]">Tu disciplina de hoy es tu resultado de mañana.</p>
        </div>
        <div className="hidden items-center gap-2 rounded-xl border border-[#1C3142] bg-[#0B151E] px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8193A5] lg:flex"><span className="h-2 w-2 rounded-full bg-[#C6F91E] shadow-[0_0_14px_rgba(198,249,30,0.75)]" />Datos en tiempo real</div>
      </header>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_318px]">
        <div className="relative overflow-hidden rounded-[30px] border border-[#1C3142] bg-[#0B151E] shadow-[0_28px_90px_rgba(0,0,0,0.30)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_25%,rgba(198,249,30,0.13),transparent_28%),radial-gradient(circle_at_15%_100%,rgba(20,55,71,0.32),transparent_42%)]" />
          <div className="pointer-events-none absolute -right-16 -top-20 h-[320px] w-[320px] rounded-full border border-[#C6F91E]/10" />
          <div className="pointer-events-none absolute right-8 top-24 h-[235px] w-[235px] rounded-full border border-[#C6F91E]/[0.07]" />
          <div className="pointer-events-none absolute bottom-[-45px] right-[8%] select-none text-[210px] font-black leading-none text-[#C6F91E]/[0.025]">K</div>
          <div className="relative flex min-h-[405px] flex-col p-7 sm:p-9">
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C6F91E]/20 bg-[#C6F91E]/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.20em] text-[#C6F91E]"><span className="h-1.5 w-1.5 rounded-full bg-[#C6F91E] animate-pulse" />{todayCompleted ? "Entrenamiento completado" : "Entrenamiento de hoy"}</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#8193A5]"><Clock3 size={14} />{todayLog?.durationMin || nextWorkout?.estimatedMin || 60} min</span>
            </div>
            <div className="mt-6 max-w-[700px]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55697A]">Tu sesión</p>
              <h2 className="mt-2 font-display text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl">{todayLog?.workout?.name || nextWorkout?.name || "Tu coach está preparando tu plan"}</h2>
              <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#8193A5]">{todayCompleted ? "Sesión registrada. Revisá el detalle y mantené el ritmo." : nextWorkout ? `${nextWorkout.exercises.length} ejercicios seleccionados para tu programa.` : "Cuando tu coach asigne un programa, aparecerá acá."}</p>
            </div>
            {nextWorkout && !todayCompleted && (
              <div className="mt-6 max-w-[640px] space-y-2">
                {nextWorkout.exercises.slice(0, 3).map((exercise: ExercisePreview, index: number) => (
                  <div key={exercise.id} className="flex items-center gap-3 rounded-2xl border border-[#1C3142]/80 bg-black/20 px-3.5 py-2.5 backdrop-blur-sm">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#C6F91E]/25 bg-[#C6F91E]/10 text-[11px] font-black text-[#C6F91E]">{index + 1}</span>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">{exercise.exercise.name}</p><p className="text-[10px] uppercase tracking-wider text-[#55697A]">{muscleLabel(exercise.exercise.muscleGroup)}</p></div>
                    <span className="shrink-0 text-xs font-bold tabular-nums text-[#D2DCE4]">{exercise.sets} × {exercise.reps}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-auto pt-7">
              <Link href={todayLog ? `/client/workout/${todayLog.workoutId}` : nextWorkout ? `/client/workout/${nextWorkout.id}` : "/client/workout"} className="block">
                <Button variant="accent" className="h-14 w-full rounded-2xl text-base font-black tracking-wide shadow-[0_10px_42px_rgba(198,249,30,0.18)]">{todayCompleted ? "VER ENTRENAMIENTO" : "COMENZAR ENTRENAMIENTO"}<ArrowRight size={18} className="ml-2" /></Button>
              </Link>
            </div>
          </div>
        </div>

        <aside className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[26px] border border-[#1C3142] bg-[#0B151E] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-black"><Goal size={18} className="text-[#C6F91E]" />Tu objetivo</div><Link href="/client/progress" className="text-[10px] font-bold uppercase tracking-wider text-[#C6F91E]">Ver detalles</Link></div>
            <div className="mt-5 flex items-center gap-4"><ProgressRing value={adherence} /><div><p className="text-lg font-black text-white">{currentWeight !== null ? `${currentWeight.toFixed(1)} kg` : "Sin peso"}</p><p className="mt-1 text-xs text-[#8193A5]">adherencia del plan</p><p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#55697A]">Meta semanal · {program?.frequency || 4} sesiones</p></div></div>
          </div>
          <div className="rounded-[26px] border border-[#C6F91E]/20 bg-[#C6F91E]/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-black"><Dumbbell size={18} className="text-[#C6F91E]" />Próximo entrenamiento</div><span className="text-[#C6F91E]"><Play size={16} fill="currentColor" /></span></div>
            <p className="mt-5 text-lg font-black text-white">{todayCompleted ? "Siguiente sesión" : nextWorkout?.name || "Por definir"}</p>
            <p className="mt-1 text-xs text-[#8193A5]">{nextWorkout ? `${nextWorkout.estimatedMin || 60} min · ${nextWorkout.exercises.length} ejercicios` : "Tu coach todavía no asignó un programa."}</p>
            <Link href={nextWorkout ? `/client/workout/${nextWorkout.id}` : "/client/workout"} className="mt-5 flex h-10 items-center justify-center rounded-xl bg-[#C6F91E] text-xs font-black text-black transition hover:brightness-105">Ver entrenamiento <ArrowRight size={14} className="ml-1" /></Link>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Volumen" value={Math.round(volume).toLocaleString("es-AR")} unit="kg" icon={TrendingUp} detail="carga total registrada" />
        <StatCard label="Sesiones" value={String(weekSessions)} unit="esta semana" icon={Dumbbell} detail="entrenamientos completados" />
        <StatCard label="Peso" value={currentWeight !== null ? currentWeight.toFixed(1) : "—"} unit="kg" icon={Scale} detail={weightDelta === null ? "sin comparación" : `${weightDelta > 0 ? "+" : ""}${weightDelta.toFixed(1)} kg vs. anterior`} />
        <StatCard label="Racha" value={streak ? String(streak) : "0"} unit="días" icon={Flame} detail={streak ? "manteniendo consistencia" : "empezá hoy"} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-[26px] border border-[#1C3142] bg-[#0B151E] p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.20em] text-[#55697A]">Semana</p><h3 className="mt-1 font-display text-xl font-black text-white">Tu actividad</h3></div><Link href="/client/progress" className="text-xs font-black text-[#C6F91E]">Ver progreso →</Link></div>
          <div className="mt-6 grid grid-cols-7 gap-2">
            {weekDays.map((day) => <div key={day.label} className={`rounded-2xl border p-3 text-center ${day.isToday ? "border-[#C6F91E]/35 bg-[#C6F91E]/10" : "border-[#1C3142] bg-[#081119]"}`}><p className="text-[10px] font-black uppercase text-[#8193A5]">{day.label}</p><div className={`mx-auto mt-3 h-11 w-11 rounded-full border-4 ${day.count ? "border-[#C6F91E] bg-[#C6F91E]/15" : "border-[#1C3142] bg-[#0B151E]"}`} /><p className="mt-2 text-[10px] font-bold text-[#55697A]">{day.count ? "Activo" : "Libre"}</p></div>)}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-[#1C3142] pt-4 text-xs"><span className="flex items-center gap-2 text-[#8193A5]"><CalendarDays size={14} />{weekSessions} de {program?.frequency || 4} sesiones objetivo</span><span className="font-black text-[#C6F91E]">{adherence}% adherencia</span></div>
        </div>
        <div className="rounded-[26px] border border-[#1C3142] bg-[#0B151E] p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.20em] text-[#55697A]">Seguimiento</p><h3 className="mt-1 font-display text-xl font-black text-white">Esta semana</h3></div><ClipboardCheck size={18} className="text-[#C6F91E]" /></div>
          <Link href="/client/checkins" className="mt-5 flex items-center gap-3 rounded-2xl border border-[#1C3142] bg-[#081119] p-4 transition hover:border-[#C6F91E]/25"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${checkinPending ? "bg-amber-400/10 text-amber-300" : "bg-[#C6F91E]/10 text-[#C6F91E]"}`}>{checkinPending ? <ClipboardCheck size={18} /> : <CheckCircle2 size={18} />}</span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-white">Check-in semanal</span><span className="mt-0.5 block truncate text-xs text-[#8193A5]">{latestCheckin ? `Último: ${new Date(latestCheckin.date).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}` : "Contale a tu coach cómo vino tu semana"}</span></span><ArrowRight size={16} className="text-[#55697A]" /></Link>
          <Link href="/client/messages" className="mt-3 flex items-center gap-3 rounded-2xl border border-[#1C3142] bg-[#081119] p-4 transition hover:border-[#C6F91E]/25"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6F91E]/10 text-[#C6F91E]"><MessageCircle size={18} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-white">Mensajes</span><span className="mt-0.5 block truncate text-xs text-[#8193A5]">{unreadMessages ? `${unreadMessages} mensaje${unreadMessages === 1 ? "" : "s"} sin leer` : latestMessage ? "Última conversación con tu coach" : "Abrí la conversación"}</span></span><ArrowRight size={16} className="text-[#55697A]" /></Link>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#C6F91E]/15 bg-[#0B151E] p-5 sm:p-6">
        <div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.20em] text-[#55697A]">Inteligencia</p><h3 className="mt-1 flex items-center gap-2 font-display text-xl font-black text-white"><Sparkles size={18} className="text-[#C6F91E]" />Tu coach inteligente</h3></div><Trophy size={18} className="text-[#C6F91E]" /></div>
        <div className="mt-5"><AiCoachChat /></div>
      </section>
    </div>
  );
}
