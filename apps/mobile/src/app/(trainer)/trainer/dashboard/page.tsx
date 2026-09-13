import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainerControlCenter } from "@/components/trainer-control-center";
import { TrainerInsights } from "@/components/trainer-insights";
import { PwaInstallDesktop } from "@/components/pwa-install-desktop";
import { LiveSession } from "@/components/live-session";
import { ExportCenter } from "@/components/export-center";
import { LiftShiftAnalytics } from "@/components/liftshift-analytics";
import { Badge } from "@/components/ui/badge";
import { ChangelogNotification } from "@/components/changelog-notification";
import { AdherenceChart, RevenueChart, CheckinDonut } from "@/components/analytics-charts";
import { Progress } from "@/components/ui/progress";
import { UiPremiumStrip, FadeIn, StaggerContainer, StaggerItem } from "@/components/ui-premium";
import { CountUp, ProgressBar } from "@/components/animated-stats";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TourLauncher } from "@/components/guided-tour";
import { TRAINER_TOUR, TRAINER_TOUR_KEY } from "@/lib/tours";
import { Tilt3D, Tilt3DSubtle } from "@/components/tilt-3d";
import { 
  Users, 
  Dumbbell, 
  ClipboardCheck, 
  MessageSquare, 
  AlertTriangle, 
  Plus, 
  TrendingUp, 
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench
} from "lucide-react";

export default async function TrainerDashboard(){
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);

  // Parallel database queries for real data
  const [
    allClients,
    pendingCheckins,
    unreadMessages,
    workoutsToday,
    activeSubscriptions
  ] = await Promise.all([
    prisma.client.findMany({
      include: {
        assignedProgram: true,
        workoutLogs: {
          orderBy: { date: "desc" },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" }
    }).catch(() => []),

    prisma.checkIn.findMany({
      where: { reviewed: false },
      include: { client: true, user: true },
      orderBy: { date: "desc" },
      take: 10
    }).catch(() => []),

    prisma.message.findMany({
      where: { read: false },
      include: { sender: true, client: true },
      orderBy: { createdAt: "desc" },
      take: 10
    }).catch(() => []),

    prisma.workoutLog.findMany({
      where: { date: { gte: startOfToday } },
      include: { client: true, workout: true },
      orderBy: { date: "desc" }
    }).catch(() => []),

    prisma.subscription.findMany({
      where: { status: "ACTIVA" }
    }).catch(() => [])
  ]);

  // Compute real KPIs
  const activeClients = allClients.filter(c => c.status === "ACTIVO");
  const newClientsThisWeek = allClients.filter(c => new Date(c.createdAt) >= sevenDaysAgo);
  
  // Inactive clients (active status, but last workout > 4 days ago or never)
  const inactiveClients = activeClients.filter(c => {
    const lastLog = c.workoutLogs[0]?.date;
    if (!lastLog) return true;
    return new Date(lastLog) < fourDaysAgo;
  });

  // MRR from real active subscriptions
  const realMrr = activeSubscriptions.reduce((acc, s) => acc + (s.price || 0), 0);

  // Attention needed items
  type AttentionItem = {
    id: string;
    type: "CHECKIN" | "INACTIVE" | "MESSAGE";
    title: string;
    subtitle: string;
    link: string;
    badge: string;
  };

  const attentionItems: AttentionItem[] = [];

  // 1. Pending checkins
  pendingCheckins.forEach(ch => {
    attentionItems.push({
      id: `ch-${ch.id}`,
      type: "CHECKIN",
      title: ch.client?.name || ch.user?.name || "Cliente",
      subtitle: ch.comentario ? `"${ch.comentario.slice(0, 60)}..."` : "Check-in semanal pendiente de revisión",
      link: "/trainer/checkins",
      badge: "Check-in pendiente"
    });
  });

  // 2. Unread messages
  unreadMessages.forEach(m => {
    attentionItems.push({
      id: `msg-${m.id}`,
      type: "MESSAGE",
      title: m.sender?.name || m.client?.name || "Mensaje sin leer",
      subtitle: `"${m.content.slice(0, 60)}..."`,
      link: `/trainer/messages?with=${m.senderId}`,
      badge: "Mensaje nuevo"
    });
  });

  // 3. Inactive clients
  inactiveClients.slice(0, 3).forEach(c => {
    const lastDate = c.workoutLogs[0]?.date;
    attentionItems.push({
      id: `inact-${c.id}`,
      type: "INACTIVE",
      title: c.name,
      subtitle: lastDate 
        ? `Sin entrenar desde ${new Date(lastDate).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}` 
        : "Aún no ha registrado su primer entrenamiento",
      link: `/trainer/clients/${c.id}`,
      badge: "Sin actividad"
    });
  });

  return (
    <div className="space-y-6">
      <ChangelogNotification />
      <TourLauncher steps={TRAINER_TOUR} storageKey={TRAINER_TOUR_KEY} tourName="Tour entrenador" />
      {/* Welcome & Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold tracking-tight text-white">
            Panel del Entrenador
          </h1>
          <p className="text-sm text-zinc-400">
            Resumen en tiempo real • Marca: <span className="text-primary font-bold">KinetiX</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/trainer/clients/new">
            <Button variant="accent" size="sm" className="font-bold min-h-[44px]">
              <Plus size={16} className="mr-1" /> Nuevo Cliente
            </Button>
          </Link>
          <Link href="/trainer/workouts">
            <Button variant="outline" size="sm" className="min-h-[44px]">
              <Dumbbell size={16} className="mr-1" /> Crear Rutina
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards (100% Real Data) — contadores y barras animadas */}
      <div data-tour="kpis">
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3" stagger={0.08}>
        <StaggerItem>
        <Tilt3DSubtle>
        <Card className="h-full">
          <CardContent className="p-4">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase block">
              Clientes Activos
            </span>
            <p className="text-3xl font-black text-white mt-1 tabular-nums">
              <CountUp value={activeClients.length} />
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              +{newClientsThisWeek.length} nuevos esta semana
            </p>
            <ProgressBar value={Math.min(100, activeClients.length * 10)} className="mt-3" />
          </CardContent>
        </Card>
        </Tilt3DSubtle>
        </StaggerItem>

        <StaggerItem>
        <Tilt3DSubtle>
        <Card className={`h-full ${pendingCheckins.length > 0 ? "border-primary/30 bg-primary/[0.03]" : ""}`}>
          <CardContent className="p-4">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase block">
              Check-ins Pendientes
            </span>
            <p className="text-3xl font-black text-white mt-1 tabular-nums">
              <CountUp value={pendingCheckins.length} />
            </p>
            <p className={`text-xs mt-0.5 ${pendingCheckins.length > 0 ? "text-amber-400 font-medium" : "text-zinc-500"}`}>
              {pendingCheckins.length > 0 ? "Requieren respuesta" : "Al día"}
            </p>
            <ProgressBar value={pendingCheckins.length > 0 ? 100 : 0} color={pendingCheckins.length > 0 ? "#fbbf24" : "#4ade80"} className="mt-3" />
          </CardContent>
        </Card>
        </Tilt3DSubtle>
        </StaggerItem>

        <StaggerItem>
        <Tilt3DSubtle>
        <Card className="h-full">
          <CardContent className="p-4">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase block">
              Entrenamientos Hoy
            </span>
            <p className="text-3xl font-black text-white mt-1 tabular-nums">
              <CountUp value={workoutsToday.length} />
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              {workoutsToday.length === 1 ? "sesión finalizada" : "sesiones finalizadas"}
            </p>
            <ProgressBar value={Math.min(100, workoutsToday.length * 25)} className="mt-3" />
          </CardContent>
        </Card>
        </Tilt3DSubtle>
        </StaggerItem>

        <StaggerItem>
        <Tilt3DSubtle>
        <Card className={`h-full ${unreadMessages.length > 0 ? "border-amber-500/30" : ""}`}>
          <CardContent className="p-4">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase block">
              Mensajes Sin Leer
            </span>
            <p className="text-3xl font-black text-white mt-1 tabular-nums">
              <CountUp value={unreadMessages.length} />
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              {unreadMessages.length > 0 ? "Conversaciones activas" : "Sin mensajes pendientes"}
            </p>
            <ProgressBar value={Math.min(100, unreadMessages.length * 20)} color="#fbbf24" className="mt-3" />
          </CardContent>
        </Card>
        </Tilt3DSubtle>
        </StaggerItem>
      </StaggerContainer>
      </div>

      {/* Main Grid: Atención Necesaria & Actividad Reciente */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Sección: Atención necesaria */}
        <Card className="lg:col-span-2" data-tour="atencion">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle size={18} className="text-primary" /> Atención Necesaria
            </CardTitle>
            {pendingCheckins.length > 0 && (
              <Link href="/trainer/checkins" className="text-xs text-primary hover:underline font-bold">
                Ver todos ({pendingCheckins.length}) →
              </Link>
            )}
          </CardHeader>

          <CardContent className="space-y-3">
            {attentionItems.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
                <p className="font-bold text-sm text-white">Todo al día</p>
                <p className="text-xs text-zinc-500">
                  No hay check-ins pendientes, mensajes sin responder ni clientes en riesgo actualmente.
                </p>
              </div>
            ) : (
              attentionItems.slice(0, 5).map(item => (
                <Link key={item.id} href={item.link} className="block group">
                  <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-subtle/60 hover:border-primary/30 transition flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-subtle flex items-center justify-center font-bold text-sm text-white shrink-0 group-hover:bg-primary group-hover:text-black transition">
                      {item.title?.[0]?.toUpperCase() || "C"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-sm text-white truncate group-hover:text-primary transition">
                          {item.title}
                        </p>
                        <Badge
                          variant={item.type === "CHECKIN" ? "warn" : item.type === "MESSAGE" ? "accent" : "muted"}
                          className="text-[10px] shrink-0"
                        >
                          {item.badge}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock size={18} className="text-primary" /> Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex-1">
            {workoutsToday.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500 space-y-1">
                <p className="font-bold text-zinc-400">Sin entrenamientos hoy aún</p>
                <p>Las sesiones finalizadas hoy aparecerán aquí en tiempo real.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">
                  Entrenamientos de hoy:
                </span>
                {workoutsToday.slice(0, 4).map(w => (
                  <div key={w.id} className="p-2.5 bg-zinc-950/50 rounded-xl border border-subtle/60 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">{w.client?.name || "Cliente"}</p>
                      <p className="text-[11px] text-zinc-500">
                        {w.workout?.name || w.workoutName || "Sesión"}{w.durationMin ? ` (${w.durationMin} min)` : ""}
                      </p>
                    </div>
                    <Badge variant="success" className="text-[10px]">Completado</Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Quick stats: MRR */}
            <div className="pt-3 border-t border-subtle space-y-2">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-zinc-400">Ingresos Activos (MRR)</span>
                <span className="font-black text-white text-sm">
                  ${realMrr.toLocaleString("es-AR")} ARS
                </span>
              </div>
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-zinc-400">Total Clientes en Plataforma</span>
                <span className="font-bold text-white">{allClients.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clientes Activos Recientes */}
      <Card data-tour="clientes">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users size={18} className="text-primary" /> Clientes Recientes
          </CardTitle>
          <Link href="/trainer/clients" className="text-xs text-primary hover:underline font-bold">
            Ver listado completo ({allClients.length}) →
          </Link>
        </CardHeader>
        <CardContent>
          {allClients.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No hay clientes registrados todavía. Presioná &quot;+ Nuevo Cliente&quot; para agregar el primero.
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-3">
              {allClients.slice(0, 3).map(c => (
                <Tilt3DSubtle key={c.id}>
                <Link
                  href={`/trainer/clients/${c.id}`}
                  className="block p-3.5 rounded-xl bg-zinc-950/50 border border-subtle/60 hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl pill-active flex items-center justify-center font-black text-sm group-hover:bg-primary transition shrink-0">
                      {c.name?.[0]?.toUpperCase() || "C"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate group-hover:text-primary transition">
                        {c.name}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">{c.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 mt-3">
                    <Badge variant={c.status === "ACTIVO" ? "success" : "muted"} className="text-[10px]">
                      {c.status}
                    </Badge>
                    <Badge variant="muted" className="text-[10px]">
                      {c.plan}
                    </Badge>
                  </div>
                </Link>
                </Tilt3DSubtle>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Herramientas avanzadas → Studio (CRM, Risk, plataformas, negocio) */}
      <Link href="/trainer/studio" className="block">
        <Tilt3D max={4} scale={1.01} radiusClass="rounded-2xl">
        <div className="bg-gradient-to-br from-violet-500/8 via-surface to-surface-elevated border border-violet-500/20 rounded-2xl p-4 flex items-center gap-3 hover:border-violet-500/40 hover:shadow-[0_8px_28px_rgba(139,92,246,0.12)] transition-all surface-card">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-[0_4px_14px_rgba(139,92,246,0.35)]"><Wrench size={18} /></div>
          <div className="flex-1">
            <p className="font-bold text-sm text-white">Studio — herramientas avanzadas →</p>
            <p className="text-xs text-zinc-500">CRM y retención, programación masiva, kits de plataformas y negocio</p>
          </div>
        </div>
        </Tilt3D>
      </Link>
    </div>
  );
}
