import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BRAND } from "@/constants/branding";
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Dumbbell, MessageSquare, Plus, Users } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default async function TrainerDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "TRAINER") redirect("/client/dashboard");

  const now = new Date();
  const today = startOfDay(now);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);

  const [clients, pendingCheckins, unreadMessages, workoutsToday, activeSubscriptions] = await Promise.all([
    prisma.client.findMany({
      where: { trainerId: session.id },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        workoutLogs: { orderBy: { date: "desc" }, take: 1, select: { date: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.checkIn.findMany({
      where: { reviewed: false, client: { trainerId: session.id } },
      select: { id: true, clientId: true, comentario: true, date: true, client: { select: { name: true } } },
      orderBy: { date: "desc" },
      take: 10,
    }),
    prisma.message.findMany({
      where: { receiverId: session.id, read: false, client: { trainerId: session.id } },
      select: { id: true, senderId: true, content: true, createdAt: true, sender: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.workoutLog.findMany({
      where: { date: { gte: today }, client: { trainerId: session.id } },
      select: { id: true, clientId: true, workoutName: true, durationMin: true, date: true, client: { select: { name: true } } },
      orderBy: { date: "desc" },
      take: 20,
    }),
    prisma.subscription.findMany({
      where: { status: "ACTIVA", client: { trainerId: session.id } },
      select: { price: true },
    }),
  ]);

  const activeClients = clients.filter((client) => client.status === "ACTIVO");
  const newClientsThisWeek = clients.filter((client) => client.createdAt >= sevenDaysAgo);
  const inactiveClients = activeClients.filter((client) => {
    const lastWorkout = client.workoutLogs[0]?.date;
    return !lastWorkout || lastWorkout < fourDaysAgo;
  });
  const mrr = activeSubscriptions.reduce((total, sub) => total + (sub.price || 0), 0);

  const attention = [
    ...pendingCheckins.map((item) => ({ id: `checkin-${item.id}`, title: item.client?.name || "Cliente", subtitle: item.comentario?.slice(0, 80) || "Check-in pendiente de revisión", label: "Check-in", href: "/trainer/checkins", variant: "warn" as const })),
    ...unreadMessages.map((item) => ({ id: `message-${item.id}`, title: item.sender?.name || "Cliente", subtitle: item.content.slice(0, 80), label: "Mensaje", href: `/trainer/messages?with=${encodeURIComponent(item.senderId)}`, variant: "accent" as const })),
    ...inactiveClients.slice(0, 3).map((item) => ({ id: `inactive-${item.id}`, title: item.name, subtitle: "Sin entrenamiento registrado en los últimos 4 días", label: "Sin actividad", href: `/trainer/clients/${item.id}`, variant: "muted" as const })),
  ].slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{BRAND.name}</p>
          <h1 className="mt-1 text-2xl font-display font-bold tracking-tight text-white lg:text-3xl">Panel del Entrenador</h1>
          <p className="text-sm text-zinc-400">Cartera, actividad y alertas de tus atletas.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/trainer/clients/new"><Button variant="accent" size="sm" className="min-h-[44px]"><Plus size={16} className="mr-1" />Nuevo Cliente</Button></Link>
          <Link href="/trainer/workouts"><Button variant="outline" size="sm" className="min-h-[44px]"><Dumbbell size={16} className="mr-1" />Crear Rutina</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-zinc-500"><Users size={15} /><span className="text-[10px] font-bold uppercase tracking-widest">Activos</span></div><p className="mt-2 text-3xl font-black text-white">{activeClients.length}</p><p className="mt-1 text-xs text-zinc-500">+{newClientsThisWeek.length} esta semana</p></CardContent></Card>
        <Card className={pendingCheckins.length ? "border-amber-500/30" : ""}><CardContent className="p-4"><div className="flex items-center gap-2 text-zinc-500"><AlertCircle size={15} /><span className="text-[10px] font-bold uppercase tracking-widest">Check-ins</span></div><p className="mt-2 text-3xl font-black text-white">{pendingCheckins.length}</p><p className="mt-1 text-xs text-zinc-500">{pendingCheckins.length ? "Requieren revisión" : "Al día"}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-zinc-500"><Dumbbell size={15} /><span className="text-[10px] font-bold uppercase tracking-widest">Hoy</span></div><p className="mt-2 text-3xl font-black text-white">{workoutsToday.length}</p><p className="mt-1 text-xs text-zinc-500">Entrenamientos registrados</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-zinc-500"><MessageSquare size={15} /><span className="text-[10px] font-bold uppercase tracking-widest">Mensajes</span></div><p className="mt-2 text-3xl font-black text-white">{unreadMessages.length}</p><p className="mt-1 text-xs text-zinc-500">Sin leer</p></CardContent></Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base"><AlertCircle size={18} className="text-primary" /> Atención necesaria</CardTitle>
            {attention.length > 0 && <Badge variant="muted">{attention.length}</Badge>}
          </CardHeader>
          <CardContent>
            {attention.length === 0 ? (
              <div className="py-10 text-center"><CheckCircle2 size={32} className="mx-auto text-emerald-400" /><p className="mt-2 font-bold text-white">Todo al día</p><p className="mt-1 text-sm text-zinc-500">No hay alertas pendientes en tu cartera.</p></div>
            ) : (
              <div className="space-y-2">
                {attention.map((item) => (
                  <Link key={item.id} href={item.href} className="block rounded-xl border border-subtle/60 bg-zinc-950/50 p-3 transition hover:border-primary/30">
                    <div className="flex items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-sm font-bold text-white">{item.title.slice(0,1).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-bold text-white">{item.title}</p><Badge variant={item.variant} className="shrink-0 text-[10px]">{item.label}</Badge></div><p className="mt-0.5 truncate text-xs text-zinc-400">{item.subtitle}</p></div><ArrowRight size={15} className="shrink-0 text-zinc-600" /></div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Clock size={18} className="text-primary" /> Resumen de negocio</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div><div className="flex items-center justify-between text-xs"><span className="text-zinc-500">MRR registrado</span><span className="font-bold text-white">$ {mrr.toLocaleString("es-AR")}</span></div><Progress value={mrr > 0 ? 100 : 0} className="mt-2" /></div>
            <div><div className="flex items-center justify-between text-xs"><span className="text-zinc-500">Clientes activos</span><span className="font-bold text-white">{activeClients.length}</span></div><Progress value={Math.min(100, activeClients.length * 10)} className="mt-2" /></div>
            <Link href="/trainer/payments"><Button variant="outline" className="w-full">Ver pagos <ArrowRight size={15} className="ml-2" /></Button></Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Actividad de hoy</CardTitle><Link href="/trainer/clients" className="text-xs font-bold text-primary hover:underline">Ver cartera</Link></CardHeader>
        <CardContent>
          {workoutsToday.length === 0 ? <div className="py-8 text-center text-sm text-zinc-500">Todavía no hay entrenamientos registrados hoy.</div> : <div className="grid gap-2 sm:grid-cols-2">{workoutsToday.slice(0, 8).map((workout) => <div key={workout.id} className="rounded-xl border border-subtle/60 bg-zinc-950/50 p-3"><p className="text-sm font-bold text-white">{workout.client?.name || "Cliente"}</p><p className="mt-1 text-xs text-zinc-500">{workout.workoutName || "Sesión"}{workout.durationMin ? ` · ${workout.durationMin} min` : ""}</p></div>)}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
