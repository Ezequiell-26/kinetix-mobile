import Link from "next/link";
import dynamic from "next/dynamic";
import { prisma } from "@/lib/db";
import { getClientForSession } from "@/lib/getClient";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/constants/branding";
import { computeAdherence, computeStreak } from "@/lib/stats";
import { TimeGreeting } from "@/components/narrator-cues";
import { ClipboardCheck, Clock3, Dumbbell, Flame, Goal, HeartPulse, MessageCircle, Play, Scale, Sparkles, TrendingUp, Trophy, Utensils, ArrowRight } from "lucide-react";

const AiCoachChat = dynamic(() => import("@/components/ai-coach-chat").then((m) => m.AiCoachChat), {
  loading: () => <div className="rounded-3xl border border-white/[0.06] bg-white/[0.025] p-6 text-sm text-zinc-500">Cargando coach IA…</div>,
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

function MiniSparkline({ active = true }: { active?: boolean }) {
  return <svg viewBox="0 0 120 36" className="h-9 w-full" aria-hidden="true"><path d="M1 30 C 10 27, 12 18, 21 23 S 35 27, 41 19 S 54 15, 61 20 S 74 13, 82 16 S 94 9, 102 13 S 112 8, 119 4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={active ? "text-primary" : "text-zinc-700"} /><path d="M1 30 C 10 27, 12 18, 21 23 S 35 27, 41 19 S 54 15, 61 20 S 74 13, 82 16 S 94 9, 102 13 S 112 8, 119 4 V36 H1Z" className={active ? "fill-primary/10" : "fill-white/[0.02]"} /></svg>;
}

const formatKg = (value: number) => `${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 }).format(value)} kg`;

export default async function ClientDashboardPage() {
  const sessionData = await getClientForSession().catch(() => null);
  const client = sessionData?.client;
  const session = sessionData?.session;
  const displayName = client?.name || session?.name || "Atleta";
  const firstName = displayName.split(" ")[0];

  if (!client) {
    return <div className="mx-auto max-w-2xl rounded-3xl border border-white/[0.06] bg-white/[0.025] p-10 text-center"><p className="text-xs font-black uppercase tracking-[0.22em] text-primary">{BRAND.name}</p><h1 className="mt-4 text-4xl font-display font-black text-white">Hola, {firstName}</h1><p className="mt-3 text-sm text-zinc-500">Tu perfil de atleta todavía está en preparación.</p><Link href="/client/messages" className="mt-7 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-black text-black">Escribir a tu coach</Link></div>;
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monday = new Date(now);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const [program, todayLog, recentLogs, logDates, latestMeasurement, latestCheckin, latestMessage, unreadMessages] = await Promise.all([
    client.assignedProgramId ? prisma.program.findUnique({ where: { id: client.assignedProgramId }, include: { weeks: { orderBy: { weekNumber: "asc" }, include: { workouts: { orderBy: { dayNumber: "asc" }, include: { exercises: { orderBy: { order: "asc" }, include: { exercise: true } } } } } } } }) : Promise.resolve(null),
    prisma.workoutLog.findFirst({ where: { clientId: client.id, date: { gte: startOfToday } }, include: { workout: true, sets: true }, orderBy: { date: "desc" } }).catch(() => null),
    prisma.workoutLog.findMany({ where: { clientId: client.id }, include: { workout: true, sets: true }, orderBy: { date: "desc" }, take: 60 }).catch(() => []),
    prisma.workoutLog.findMany({ where: { clientId: client.id }, select: { date: true }, orderBy: { date: "desc" } }).catch(() => []),
    prisma.progressMeasurement.findFirst({ where: { clientId: client.id }, orderBy: { date: "desc" } }).catch(() => null),
    prisma.checkIn.findFirst({ where: { clientId: client.id }, orderBy: { date: "desc" } }).catch(() => null),
    prisma.message.findFirst({ where: { OR: [{ receiverId: session?.id || "none" }, { clientId: client.id }] }, orderBy: { createdAt: "desc" }, include: { sender: true } }).catch(() => null),
    session?.id ? prisma.message.count({ where: { receiverId: session.id, read: false } }).catch(() => 0) : Promise.resolve(0),
  ]);

  const workouts = program?.weeks.flatMap((week) => week.workouts) ?? [];
  const completed = new Set(recentLogs.map((log) => log.workoutId).filter(Boolean));
  const nextWorkout = workouts.find((workout) => !completed.has(workout.id)) ?? workouts[0] ?? null;
  const weekLogs = recentLogs.filter((log) => new Date(log.date) >= monday);
  const weekSessions = weekLogs.length;
  const frequency = program?.frequency || 4;
  const streak = computeStreak(logDates.map((entry) => entry.date));
  const adherence = computeAdherence(logDates.map((entry) => entry.date), frequency);
  const weekVolume = weekLogs.reduce((sum, log) => sum + log.sets.reduce((setSum, set) => setSum + (set.weight || 0) * (set.reps || 0), 0), 0);
  const currentWeight = latestMeasurement?.weight ?? client.weight ?? null;
  const pendingCheckin = !latestCheckin || now.getTime() - new Date(latestCheckin.date).getTime() > 7 * 24 * 60 * 60 * 1000;
  const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];
  const weekDays = dayLabels.map((label, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const count = weekLogs.filter((log) => { const date = new Date(log.date); return date >= day && date < next; }).length;
    return { label, count, isToday: day.toDateString() === now.toDateString() };
  });

  const workoutCards = (workouts.length ? workouts : [
    { id: "empty-1", name: "Tu próximo entrenamiento", estimatedMin: null, exercises: [] },
    { id: "empty-2", name: "Movilidad & recuperación", estimatedMin: null, exercises: [] },
    { id: "empty-3", name: "Sesión de cardio", estimatedMin: null, exercises: [] },
  ]).slice(0, 4);
  const goalLabel = client.goal ? client.goal.replaceAll("_", " ").toLowerCase() : "rendimiento y salud";

  return (
    <div className="space-y-6 pb-8 text-white">
      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div><p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-600">{now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} · Objetivo: <span className="text-primary">{goalLabel}</span></p><h1 className="mt-2 text-4xl font-display font-black tracking-tight sm:text-5xl"><TimeGreeting name={firstName} /></h1><p className="mt-2 text-sm text-zinc-500">Tu disciplina de hoy es tu resultado de mañana.</p></div>
        <div className="hidden items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs text-zinc-500 xl:flex"><span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(214,255,42,0.8)]" /> Sistema operativo · datos en tiempo real</div>
      </header>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative min-h-[390px] overflow-hidden rounded-[30px] border border-primary/15 bg-gradient-to-br from-[#111316] via-[#0A0D10] to-[#08090B] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:p-9">
          <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-primary/10 blur-3xl" /><div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-primary/[0.05] blur-3xl" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_34%,rgba(214,255,42,0.10),transparent_33%),linear-gradient(135deg,rgba(255,255,255,0.025),transparent_50%)]" />
          <div className="relative flex h-full flex-col"><div className="flex items-center justify-between gap-4"><span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.20em] text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> {todayLog ? "Entrenamiento completado" : "Entrenamiento de hoy"}</span><span className="flex items-center gap-1.5 text-xs font-bold text-zinc-500"><Clock3 size={14} /> {todayLog?.durationMin || nextWorkout?.estimatedMin || 60} min</span></div>
            <div className="mt-6 max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">Tu sesión</p><h2 className="mt-2 text-4xl font-display font-black leading-[1.05] tracking-tight sm:text-5xl">{todayLog?.workout?.name || nextWorkout?.name || "Tu coach está preparando tu plan"}</h2><p className="mt-3 max-w-lg text-sm leading-6 text-zinc-500">{todayLog ? "Sesión registrada. Revisá el detalle y mantené el ritmo." : nextWorkout ? `${nextWorkout.exercises.length} ejercicios seleccionados para tu plan.` : "Cuando tu coach asigne un programa, aparecerá acá."}</p></div>
            {nextWorkout && !todayLog && <div className="mt-6 max-w-xl space-y-2">{nextWorkout.exercises.slice(0, 3).map((exercise, index) => <div key={exercise.id} className="flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-black/30 px-3.5 py-2.5 backdrop-blur-sm"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-black text-primary">{index + 1}</span><span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">{exercise.exercise.name}</span><span className="text-xs font-bold tabular-nums text-zinc-500">{exercise.sets} × {exercise.reps}</span></div>)}</div>}
            <div className="mt-auto pt-7"><Link href={todayLog ? `/client/workout/${todayLog.workoutId}` : nextWorkout ? `/client/workout/${nextWorkout.id}` : "/client/workout"} className="block"><Button variant="accent" className="h-14 w-full rounded-2xl text-base font-black tracking-wide shadow-[0_10px_42px_rgba(214,255,42,0.18)]">{todayLog ? "VER ENTRENAMIENTO" : "COMENZAR ENTRENAMIENTO"}<ArrowRight size={18} className="ml-2" /></Button></Link></div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[26px] border border-white/[0.06] bg-white/[0.025] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)]"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-black"><Goal size={18} className="text-primary" /> Tu objetivo</div><Link href="/client/progress" className="text-[10px] font-bold uppercase tracking-wider text-primary">Ver detalles</Link></div><div className="mt-5 flex items-center gap-4"><div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-[7px] border-primary/20"><div className="absolute inset-0 rounded-full border-[7px] border-primary border-r-transparent -rotate-45" /><span className="text-xl font-black">{adherence}%</span></div><div><p className="text-lg font-black text-white">{currentWeight ? formatKg(currentWeight) : "Sin peso"}</p><p className="mt-1 text-xs text-zinc-500">adherencia del plan</p></div></div></div>
          <div className="rounded-[26px] border border-primary/20 bg-primary/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)]"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-black"><Dumbbell size={18} className="text-primary" /> Próximo entrenamiento</div><span className="text-primary"><Play size={16} fill="currentColor" /></span></div><p className="mt-5 text-lg font-black">{todayLog ? "Siguiente sesión" : nextWorkout?.name || "Por definir"}</p><p className="mt-1 text-xs text-zinc-500">{todayLog ? "Tu próxima sesión aparece en tu programa." : nextWorkout ? `${nextWorkout.estimatedMin || 60} min · ${nextWorkout.exercises.length} ejercicios` : "Tu coach todavía no asignó un programa."}</p><Link href={nextWorkout ? `/client/workout/${nextWorkout.id}` : "/client/workout"} className="mt-5 flex h-10 items-center justify-center rounded-xl bg-primary text-xs font-black text-black transition hover:brightness-105">Ver entrenamiento <ArrowRight size={14} className="ml-1" /></Link></div>
        </div>
      </section>

      <section className="grid grid-cols-2 overflow-hidden rounded-[26px] border border-white/[0.06] bg-white/[0.025] lg:grid-cols-4">
        {[["Volumen semanal", Math.round(weekVolume).toLocaleString("es-AR"), "kg", TrendingUp], ["Entrenamiento", weekSessions.toString(), "sesiones", Dumbbell], ["Peso actual", currentWeight ? currentWeight.toFixed(1) : "—", "kg", Scale], ["Racha", streak.toString(), "días", Flame]].map(([label, value, unit, Icon], index) => <div key={String(label)} className={`p-5 sm:p-6 ${index > 0 ? "border-l border-white/[0.06]" : ""} ${index > 1 ? "border-t border-white/[0.06] lg:border-t-0" : ""}`}><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-600"><Icon size={13} />{label}</div><p className="mt-2 text-3xl font-display font-black tabular-nums">{String(value)} <span className="text-xs font-bold text-zinc-600">{String(unit)}</span></p><MiniSparkline active={weekSessions > 0} /></div>)}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[26px] border border-white/[0.06] bg-white/[0.025] p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-600">Esta semana</p><h3 className="mt-1 text-xl font-display font-black">Tus entrenamientos</h3></div><Link href="/client/workout" className="text-xs font-bold text-primary">Ver todos</Link></div><div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">{workoutCards.map((workout, index) => { const done = recentLogs.some((log) => log.workoutId === workout.id); return <Link key={workout.id} href={workout.id.startsWith("empty-") ? "/client/workout" : `/client/workout/${workout.id}`} className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-black/20 transition hover:-translate-y-0.5 hover:border-primary/25"><div className="flex aspect-[1.65/1] items-end bg-gradient-to-br from-[#1A1F21] via-[#0F1417] to-[#090B0D] p-3"><span className="rounded-lg bg-primary px-2 py-1 text-[9px] font-black uppercase tracking-wider text-black">{done ? "Completado" : index === 0 ? "Hoy" : "Plan"}</span></div><div className="p-3.5"><div className="flex items-start justify-between gap-2"><p className="min-h-10 flex-1 text-sm font-black leading-5 text-white">{workout.name}</p><ArrowRight size={15} className="mt-0.5 text-zinc-700 transition group-hover:translate-x-0.5 group-hover:text-primary" /></div><p className="mt-1 text-xs text-zinc-600">{workout.estimatedMin || 45} min · {workout.exercises?.length || 0} ejercicios</p></div></Link>; })}</div></div>
        <div className="rounded-[26px] border border-white/[0.06] bg-white/[0.025] p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-600">Progreso</p><h3 className="mt-1 text-xl font-display font-black">Tu semana</h3></div><TrendingUp size={19} className="text-primary" /></div><div className="mt-6 space-y-4">{weekDays.map((day) => <div key={day.label} className="flex items-center gap-3"><span className={`w-5 text-center text-[10px] font-black ${day.isToday ? "text-primary" : "text-zinc-600"}`}>{day.label}</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.05]"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, day.count * 100)}%` }} /></div><span className="w-4 text-right text-[10px] font-bold text-zinc-600">{day.count}</span></div>)}</div><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-white/[0.05] bg-black/20 p-3"><p className="text-[10px] uppercase tracking-wider text-zinc-600">Adherencia</p><p className="mt-1 text-xl font-black text-primary">{adherence}%</p></div><div className="rounded-2xl border border-white/[0.05] bg-black/20 p-3"><p className="text-[10px] uppercase tracking-wider text-zinc-600">Racha</p><p className="mt-1 text-xl font-black">{streak} d</p></div></div></div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[26px] border border-white/[0.06] bg-white/[0.025] p-5 sm:p-6"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Utensils size={18} className="text-primary" /><div><p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-600">Nutrición</p><h3 className="mt-1 text-xl font-display font-black">Tu plan de hoy</h3></div></div><Link href="/client/nutrition" className="text-xs font-bold text-primary">Ver plan completo</Link></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{["Desayuno", "Almuerzo", "Merienda", "Cena"].map((meal) => <Link key={meal} href="/client/nutrition" className="rounded-2xl border border-white/[0.05] bg-black/20 p-4 transition hover:border-primary/20"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Utensils size={18} /></div><p className="mt-3 text-sm font-black">{meal}</p><p className="mt-1 text-xs text-zinc-600">Abrir tu plan nutricional</p></Link>)}</div></div>
        <div className="rounded-[26px] border border-white/[0.06] bg-white/[0.025] p-5 sm:p-6"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Trophy size={18} className="text-primary" /><h3 className="text-xl font-display font-black">Logros</h3></div><Link href="/client/achievements" className="text-xs font-bold text-primary">Ver todos</Link></div><div className="mt-5 space-y-3">{[streak > 0 ? "Constancia" : "Primer día", weekSessions > 0 ? "Disciplina" : "Listo para empezar", adherence >= 75 ? "Progreso" : "Mantener ritmo"].map((label, i) => <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-black/20 p-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Sparkles size={17} /></span><div className="min-w-0 flex-1"><p className="text-sm font-black">{label}</p><p className="text-[10px] text-zinc-600">Actividad de tu panel</p></div><span className="text-[10px] font-black text-primary">+{(i + 1) * 50} XP</span></div>)}</div></div>
      </section>

      {(pendingCheckin || latestMessage) && <section className="grid gap-3 md:grid-cols-2"><Link href="/client/checkins" className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition hover:border-primary/25"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><ClipboardCheck size={19} /></span><div className="min-w-0 flex-1"><p className="text-sm font-black">Check-in semanal</p><p className="mt-0.5 truncate text-xs text-zinc-600">{pendingCheckin ? "Tenés un check-in pendiente" : "Tu check-in está al día"}</p></div><ArrowRight size={16} className="text-zinc-700 group-hover:text-primary" /></Link>{latestMessage && <Link href="/client/messages" className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition hover:border-primary/25"><span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><MessageCircle size={19} />{unreadMessages > 0 && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-primary px-1 text-center text-[9px] font-black text-black">{unreadMessages}</span>}</span><div className="min-w-0 flex-1"><p className="text-sm font-black">Mensaje de tu coach</p><p className="mt-0.5 truncate text-xs text-zinc-600">{latestMessage.content}</p></div><ArrowRight size={16} className="text-zinc-700 group-hover:text-primary" /></Link>}</section>}

      <section className="rounded-[26px] border border-primary/10 bg-gradient-to-r from-primary/[0.06] via-transparent to-transparent p-5 sm:p-6"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><HeartPulse size={20} /></span><div><p className="text-sm font-black">{BRAND.shortName} AI</p><p className="text-xs text-zinc-600">Analizá tu semana, ajustá tu estrategia y entrená con contexto.</p></div></div><Link href="/client/dashboard#coach-ai" className="inline-flex h-10 items-center justify-center rounded-xl border border-primary/30 px-4 text-xs font-black text-primary">Abrir coach IA <ArrowRight size={14} className="ml-1" /></Link></div></section>

      <div id="coach-ai"><AiCoachChat /></div>
    </div>
  );
}
