import Link from "next/link";
import dynamic from "next/dynamic";
import { prisma } from "@/lib/db";
import { getClientForSession } from "@/lib/getClient";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/constants/branding";
import { computeAdherence, computeStreak } from "@/lib/stats";
import { TimeGreeting } from "@/components/narrator-cues";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Dumbbell, Flame, Goal, HeartPulse, MessageCircle, Play, Scale, Sparkles, TrendingUp, Trophy, Utensils, Zap } from "lucide-react";

const AiCoachChat = dynamic(() => import("@/components/ai-coach-chat").then((m) => m.AiCoachChat), {
  loading: () => <div className="rounded-[26px] border border-[#1C3142]/80 bg-[#0B151E]/80 p-6 text-sm text-[#8193A5]">Cargando coach IA…</div>,
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

function Sparkline({ faded = false }: { faded?: boolean }) {
  return (
    <svg viewBox="0 0 180 44" className="h-11 w-full" aria-hidden="true">
      <path d="M1 35 C 12 30, 18 35, 28 27 S 48 21, 58 27 S 75 18, 87 23 S 104 12, 115 19 S 133 16, 143 12 S 161 8, 179 3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={faded ? "text-[#314656]" : "text-[#C6F91E]"} />
      {!faded && <path d="M1 35 C 12 30, 18 35, 28 27 S 48 21, 58 27 S 75 18, 87 23 S 104 12, 115 19 S 133 16, 143 12 S 161 8, 179 3 V44 H1Z" className="fill-[#C6F91E]/10" />}
    </svg>
  );
}

function StatCard({ label, value, unit, icon: Icon, trend }: { label: string; value: string; unit: string; icon: typeof Dumbbell; trend: string }) {
  return (
    <div className="group rounded-[22px] border border-[#1C3142]/85 bg-[#0B151E]/82 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C6F91E]/25 hover:bg-[#0D1923]">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C6F91E]/20 bg-[#C6F91E]/[0.09] text-[#C6F91E]"><Icon size={18} /></span>
        <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8193A5]">{label}</p><p className="mt-0.5 text-[10px] text-[#55697A]">hoy</p></div>
      </div>
      <div className="mt-4 flex items-end gap-2"><span className="font-display text-3xl font-black tracking-tight text-white">{value}</span><span className="pb-1 text-sm font-bold text-[#8193A5]">{unit}</span></div>
      <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#C6F91E]"><TrendingUp size={13} /> {trend}</div>
      <div className="mt-2 opacity-80"><Sparkline /></div>
    </div>
  );
}

function CircleProgress({ value }: { value: number }) {
  const bounded = Math.max(0, Math.min(100, value));
  return (
    <div className="relative h-[88px] w-[88px] shrink-0">
      <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="44" cy="44" r="36" fill="none" stroke="#1C3142" strokeWidth="7" />
        <circle cx="44" cy="44" r="36" fill="none" stroke="#C6F91E" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 36}`} strokeDashoffset={`${2 * Math.PI * 36 * (1 - bounded / 100)}`} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-white">{bounded}%</span>
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
      <div className="mx-auto max-w-2xl rounded-[30px] border border-[#1C3142] bg-[#0B151E]/80 p-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C6F91E]">{BRAND.name}</p>
        <h1 className="mt-4 text-4xl font-display font-black text-white">Hola, {firstName}</h1>
        <p className="mt-3 text-sm text-[#8193A5]">Tu perfil de atleta todavía está en preparación.</p>
        <Link href="/client/messages" className="mt-7 inline-flex h-11 items-center rounded-xl bg-[#C6F91E] px-5 text-sm font-black text-black">Escribir a tu coach</Link>
      </div>
    );
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monday = new Date(now);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const [program, todayLog, recentLogs, logDates, latestMeasurement, latestCheckin, latestMessage, unreadMessages] = await Promise.all([
    client.assignedProgramId
      ? prisma.program.findUnique({
          where: { id: client.assignedProgramId },
          include: { weeks: { orderBy: { weekNumber: "asc" }, include: { workouts: { orderBy: { dayNumber: "asc" }, include: { exercises: { orderBy: { order: "asc" }, include: { exercise: true } } } } } } },
        })
      : Promise.resolve(null),
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
  const goalLabel = client.goal ? client.goal.replaceAll("_", " ").toLowerCase() : "rendimiento y salud";
  const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];
  const weekDays = dayLabels.map((label, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const count = weekLogs.filter((log) => { const date = new Date(log.date); return date >= day && date < next; }).length;
    return { label, count, isToday: day.toDateString() === now.toDateString() };
  });
  const progressPct = Math.round(adherence);
  const nextHref = nextWorkout ? `/client/workout/${nextWorkout.id}` : "/client/workout";
  const meals = ["Desayuno", "Almuerzo", "Merienda", "Cena"];
  const workoutCards = workouts.slice(0, 4);

  const metrics = [
    { label: "Calorías quemadas", value: weekLogs.length ? Math.round(weekVolume / 8).toLocaleString("es-AR") : "—", unit: "kcal", icon: Flame, trend: "+12% vs. ayer" },
    { label: "Entrenamiento", value: String(weekSessions), unit: "min", icon: Dumbbell, trend: `+${weekSessions} esta semana` },
    { label: "Peso actual", value: currentWeight ? currentWeight.toFixed(1) : "—", unit: "kg", icon: Scale, trend: adherence > 0 ? `${adherence}% adherencia` : "Sin registros" },
    { label: "XP acumulados", value: "—", unit: "XP", icon: Trophy, trend: streak ? `${streak} días de racha` : "Empezá hoy" },
  ];

  return (
    <div className="mx-auto max-w-[1240px] space-y-5 pb-10 text-white">
      <header className="flex items-end justify-between gap-5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#8193A5]">{now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} · Objetivo: <span className="text-[#C6F91E]">{goalLabel}</span></p>
          <h1 className="mt-2 font-display text-4xl font-black leading-none tracking-tight sm:text-[48px]"><TimeGreeting name={firstName} /></h1>
          <p className="mt-2 text-sm text-[#8193A5]">Tu disciplina de hoy es tu resultado de mañana.</p>
        </div>
        <div className="hidden items-center gap-2 rounded-xl border border-[#1C3142] bg-[#0B151E]/75 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8193A5] lg:flex"><span className="h-2 w-2 rounded-full bg-[#C6F91E] shadow-[0_0_14px_rgba(198,249,30,0.8)]"/>Datos en tiempo real</div>
      </header>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative min-h-[360px] overflow-hidden rounded-[28px] border border-[#1C3142] bg-[#0B151E] shadow-[0_28px_90px_rgba(0,0,0,0.30)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_28%,rgba(198,249,30,0.13),transparent_30%),radial-gradient(circle_at_28%_90%,rgba(20,55,71,0.28),transparent_42%)]" />
          <div className="absolute right-[-60px] top-[-55px] h-[310px] w-[310px] rounded-full border border-[#C6F91E]/10" />
          <div className="absolute right-[-10px] top-20 hidden h-[250px] w-[250px] rounded-full border border-[#C6F91E]/10 lg:block" />
          <div className="absolute inset-y-0 right-0 hidden w-[48%] lg:block bg-[linear-gradient(90deg,rgba(8,17,25,0),rgba(8,17,25,0.45)),radial-gradient(ellipse_at_60%_40%,rgba(198,249,30,0.12),transparent_58%)]" />
          <div className="absolute bottom-[-35px] right-[10%] text-[220px] font-black leading-none text-[#C6F91E]/[0.025] select-none">K</div>
          <div className="relative flex h-full min-h-[360px] flex-col p-7 sm:p-9">
            <div className="flex items-center justify-between gap-4"><span className="inline-flex items-center gap-2 rounded-full border border-[#C6F91E]/20 bg-[#C6F91E]/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.20em] text-[#C6F91E]"><span className="h-1.5 w-1.5 rounded-full bg-[#C6F91E] animate-pulse"/>{todayLog ? "Entrenamiento completado" : "Entrenamiento de hoy"}</span><span className="flex items-center gap-1.5 text-xs font-bold text-[#8193A5]"><Clock3 size={14}/>{todayLog?.durationMin || nextWorkout?.estimatedMin || 60} min</span></div>
            <div className="mt-6 max-w-[640px]"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55697A]">Tu sesión</p><h2 className="mt-2 font-display text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl">{todayLog?.workout?.name || nextWorkout?.name || "Tu coach está preparando tu plan"}</h2><p className="mt-3 max-w-[520px] text-sm leading-6 text-[#8193A5]">{todayLog ? "Sesión registrada. Revisá el detalle y mantené el ritmo." : nextWorkout ? `${nextWorkout.exercises.length} ejercicios seleccionados para tu programa.` : "Cuando tu coach asigne un programa, aparecerá acá."}</p></div>
            {nextWorkout && !todayLog && <div className="mt-6 max-w-[610px] space-y-2">{nextWorkout.exercises.slice(0, 3).map((exercise, index) => <div key={exercise.id} className="flex items-center gap-3 rounded-2xl border border-[#1C3142]/75 bg-[#081119]/75 px-3.5 py-2.5 backdrop-blur-sm"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C6F91E]/10 text-[11px] font-black text-[#C6F91E]">{index + 1}</span><span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">{exercise.exercise.name}</span><span className="text-xs font-bold tabular-nums text-[#8193A5]">{exercise.sets} × {exercise.reps}</span></div>)}</div>}
            <div className="mt-auto pt-7"><Link href={todayLog ? `/client/workout/${todayLog.workoutId}` : nextHref} className="block"><Button variant="accent" className="h-14 w-full rounded-2xl bg-[#C6F91E] text-base font-black tracking-wide text-black hover:bg-[#D8FF4A] shadow-[0_10px_42px_rgba(198,249,30,0.18)]">{todayLog ? "VER ENTRENAMIENTO" : "COMENZAR ENTRENAMIENTO"}<ArrowRight size={18} className="ml-2"/></Button></Link></div>
          </div>
        </div>

        <aside className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[26px] border border-[#1C3142] bg-[#0B151E]/85 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-black"><Goal size={18} className="text-[#C6F91E]"/>Tu objetivo</div><Link href="/client/progress" className="text-[10px] font-bold uppercase tracking-wider text-[#C6F91E]">Ver detalles</Link></div>
            <div className="mt-5 flex items-center gap-4"><CircleProgress value={progressPct}/><div><p className="text-base font-black text-white">{currentWeight ? `${currentWeight.toFixed(1)} kg` : "Sin peso"}</p><p className="mt-1 text-xs text-[#8193A5]">progreso del plan</p></div></div>
          </div>
          <div className="rounded-[26px] border border-[#C6F91E]/20 bg-[#C6F91E]/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-black"><Dumbbell size={18} className="text-[#C6F91E]"/>Próximo entrenamiento</div><Play size={15} fill="currentColor" className="text-[#C6F91E]"/></div>
            <p className="mt-5 text-lg font-black">{todayLog ? "Siguiente sesión" : nextWorkout?.name || "Por definir"}</p><p className="mt-1 text-xs leading-5 text-[#8193A5]">{nextWorkout ? `${nextWorkout.estimatedMin || 60} min · ${nextWorkout.exercises.length} ejercicios` : "Tu coach todavía no asignó un programa."}</p>
            <Link href={nextHref} className="mt-5 flex h-10 items-center justify-center rounded-xl bg-[#C6F91E] text-xs font-black text-black hover:bg-[#D8FF4A]">Ver entrenamiento <ArrowRight size={14} className="ml-1"/></Link>
          </div>
        </aside>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {metrics.map((metric) => <StatCard key={metric.label} {...metric}/>) }
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[26px] border border-[#1C3142] bg-[#0B151E]/82 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.20)] sm:p-6">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Dumbbell size={18} className="text-[#C6F91E]"/><h2 className="text-base font-black">Tus entrenamientos</h2></div><Link href="/client/workout" className="text-xs font-bold text-[#C6F91E]">Ver todos</Link></div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {(workoutCards.length ? workoutCards : [{ id: "empty", name: "Sin programa asignado", estimatedMin: 0, exercises: [] }]).map((workout, index) => <Link key={workout.id} href={workout.id === "empty" ? "/client/workout" : `/client/workout/${workout.id}`} className="group rounded-2xl border border-[#1C3142] bg-[#081119]/65 p-3.5 transition hover:-translate-y-0.5 hover:border-[#C6F91E]/25 hover:bg-[#0D1923]"><div className="flex items-center justify-between gap-3"><span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8193A5]">{index === 0 ? "Hoy" : index === 1 ? "Mañana" : `Sesión ${index + 1}`}</span><span className="rounded-full bg-[#C6F91E]/10 px-2 py-1 text-[9px] font-black text-[#C6F91E]">{workout.estimatedMin || 60} MIN</span></div><div className="mt-7 h-16 overflow-hidden rounded-xl bg-[radial-gradient(circle_at_60%_40%,rgba(198,249,30,0.15),transparent_28%),linear-gradient(135deg,#0B151E,#071016)]"><div className="flex h-full items-center justify-center text-[#C6F91E]/30"><Dumbbell size={34}/></div></div><p className="mt-3 truncate text-sm font-black text-white">{workout.name}</p><p className="mt-1 text-xs text-[#8193A5]">{workout.exercises.length ? `${workout.exercises.length} ejercicios` : "Programa por definir"}</p><div className="mt-3 flex items-center justify-end text-[10px] font-black text-[#8193A5] group-hover:text-[#C6F91E]">Ver detalle <ArrowRight size={13} className="ml-1"/></div></Link>)}
          </div>
        </div>
        <div className="rounded-[26px] border border-[#1C3142] bg-[#0B151E]/82 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.20)] sm:p-6">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><TrendingUp size={18} className="text-[#C6F91E]"/><h2 className="text-base font-black">Tu progreso</h2></div><Link href="/client/progress" className="text-xs font-bold text-[#C6F91E]">Ver detalles</Link></div>
          <p className="mt-5 text-3xl font-display font-black text-[#C6F91E]">+{progressPct}%</p><p className="text-xs text-[#8193A5]">vs. periodo anterior</p><div className="mt-4"><Sparkline/></div><div className="mt-2 grid grid-cols-7 text-center text-[9px] font-bold text-[#55697A]">{weekDays.map((d) => <span key={d.label}>{d.label}</span>)}</div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[26px] border border-[#1C3142] bg-[#0B151E]/82 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.20)] sm:p-6">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Utensils size={18} className="text-[#C6F91E]"/><h2 className="text-base font-black">Tu nutrición de hoy</h2></div><Link href="/client/nutrition" className="text-xs font-bold text-[#C6F91E]">Ver plan completo</Link></div>
          <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">{meals.map((meal, index) => <Link href="/client/nutrition" key={meal} className="group rounded-2xl border border-[#1C3142] bg-[#081119]/65 p-3.5 transition hover:border-[#C6F91E]/25 hover:bg-[#0D1923]"><div className="flex h-14 items-center justify-center rounded-xl bg-[radial-gradient(circle_at_50%_50%,rgba(198,249,30,0.12),transparent_55%),linear-gradient(135deg,#0D1822,#09121A)] text-[#C6F91E]/40"><Utensils size={25}/></div><p className="mt-3 text-sm font-black text-white">{meal}</p><p className="mt-1 text-xs text-[#8193A5]">{index === 0 ? "Avena · frutas" : index === 1 ? "Proteína · verduras" : index === 2 ? "Yogur · frutos secos" : "Proteína · ensalada"}</p></Link>)}</div>
        </div>
        <div className="rounded-[26px] border border-[#1C3142] bg-[#0B151E]/82 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.20)] sm:p-6">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Trophy size={18} className="text-[#C6F91E]"/><h2 className="text-base font-black">Logros recientes</h2></div><Link href="/client/achievements" className="text-xs font-bold text-[#C6F91E]">Ver todos</Link></div>
          <div className="mt-4 space-y-3">{[{ icon: Zap, name: "Constancia", detail: streak ? `${streak} días seguidos` : "Empezá tu racha" }, { icon: Flame, name: "Disciplina", detail: `${weekSessions} sesiones esta semana` }, { icon: Sparkles, name: "Progreso", detail: `${adherence}% adherencia` }].map((item) => <div key={item.name} className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C6F91E]/20 bg-[#C6F91E]/10 text-[#C6F91E]"><item.icon size={16}/></span><div className="min-w-0 flex-1"><p className="text-xs font-black text-white">{item.name}</p><p className="truncate text-[10px] text-[#8193A5]">{item.detail}</p></div></div>)}</div>
        </div>
      </section>

      {(pendingCheckin || latestMessage) && <section className="grid gap-3 md:grid-cols-2"><Link href="/client/checkins" className="flex items-center gap-3 rounded-2xl border border-[#1C3142] bg-[#0B151E]/70 p-4 transition hover:border-[#C6F91E]/25"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6F91E]/10 text-[#C6F91E]"><HeartPulse size={18}/></span><div className="min-w-0 flex-1"><p className="text-sm font-black text-white">Check-in semanal {pendingCheckin && <span className="ml-2 rounded-full bg-[#C6F91E]/10 px-2 py-0.5 text-[9px] font-black text-[#C6F91E]">PENDIENTE</span>}</p><p className="truncate text-xs text-[#8193A5]">{latestCheckin ? "Tu último check-in está guardado." : "Contale a tu coach cómo vino tu semana."}</p></div><ArrowRight size={16} className="text-[#55697A]"/></Link>{latestMessage && <Link href="/client/messages" className="flex items-center gap-3 rounded-2xl border border-[#1C3142] bg-[#0B151E]/70 p-4 transition hover:border-[#C6F91E]/25"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6F91E]/10 text-[#C6F91E]"><MessageCircle size={18}/></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="text-sm font-black text-white">Mensaje de tu coach</p>{unreadMessages > 0 && <span className="rounded-full bg-[#C6F91E] px-2 py-0.5 text-[9px] font-black text-black">{unreadMessages}</span>}</div><p className="truncate text-xs text-[#8193A5]">{latestMessage.content}</p></div><ArrowRight size={16} className="text-[#55697A]"/></Link>}</section>}

      <section className="rounded-[26px] border border-[#1C3142] bg-[#0B151E]/82 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.20)] sm:p-6">
        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Sparkles size={18} className="text-[#C6F91E]"/><h2 className="text-base font-black">Tu coach inteligente</h2></div><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#55697A]">KINETIXFITT AI</span></div>
        <div className="mt-4"><AiCoachChat/></div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-[#C6F91E]/20 bg-[radial-gradient(circle_at_70%_50%,rgba(198,249,30,0.12),transparent_32%),linear-gradient(135deg,#0B151E,#09121A)] px-5 py-4 sm:px-6"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C6F91E]/10 text-[#C6F91E]"><Trophy size={20}/></span><div><p className="text-sm font-black text-white">Seguí así, estás en el camino correcto</p><p className="text-xs text-[#8193A5]">La constancia siempre gana.</p></div></div><Link href="/client/progress" className="inline-flex h-10 items-center justify-center rounded-xl bg-[#C6F91E] px-5 text-xs font-black text-black hover:bg-[#D8FF4A]">Ver tu progreso <ArrowRight size={14} className="ml-1"/></Link></div></section>
    </div>
  );
}
