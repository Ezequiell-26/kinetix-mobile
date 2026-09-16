"use client";
import { useSearchParams } from "next/navigation";
import { useSessionUserKey, useUserPrefs } from "@/lib/user-prefs";
import { Suspense, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui-premium";
import { Gamepad2, HeartPulse, Footprints, BarChart3, Users, BookOpen, Settings2, Star, type LucideIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/charts/chart-skeleton";
const HabiticaGamify = dynamic(() => import("@/components/habitica-gamify").then(m => m.HabiticaGamify), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const HabitStore = dynamic(() => import("@/components/habit-store").then(m => m.HabitStore), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const HabitCalendar = dynamic(() => import("@/components/habit-calendar").then(m => m.HabitCalendar), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const Challenges = dynamic(() => import("@/components/challenges").then(m => m.Challenges), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const RecoveryBreathing = dynamic(() => import("@/components/recovery-breathing").then(m => m.RecoveryBreathing), { ssr: false, loading: () => <ChartSkeleton height={140} /> });
const SleepTracker = dynamic(() => import("@/components/sleep-tracker").then(m => m.SleepTracker), { ssr: false, loading: () => <ChartSkeleton height={160} /> });
const HealthBox = dynamic(() => import("@/components/healthbox").then(m => m.HealthBox), { ssr: false, loading: () => <ChartSkeleton height={140} /> });
const RunTracker = dynamic(() => import("@/components/run-tracker").then(m => m.RunTracker), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const GpxTracker = dynamic(() => import("@/components/gpx-tracker").then(m => m.GpxTracker), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const OpenScaleSync = dynamic(() => import("@/components/openscale-sync").then(m => m.OpenScaleSync), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const HevyImportPro = dynamic(() => import("@/components/hevy-import-pro").then(m => m.HevyImportPro), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const ExportCenter = dynamic(() => import("@/components/export-center").then(m => m.ExportCenter), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const SocialShare = dynamic(() => import("@/components/social-share").then(m => m.SocialShare), { ssr: false, loading: () => <ChartSkeleton height={100} /> });
const ReferralSystem = dynamic(() => import("@/components/referral-system").then(m => m.ReferralSystem), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const EducationHub = dynamic(() => import("@/components/education-hub").then(m => m.EducationHub), { ssr: false, loading: () => <ChartSkeleton height={140} /> });
const PushCenter = dynamic(() => import("@/components/push-center").then(m => m.PushCenter), { ssr: false, loading: () => <ChartSkeleton height={140} /> });
const PwaInstallDesktop = dynamic(() => import("@/components/pwa-install-desktop").then(m => m.PwaInstallDesktop), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const CalendarSync = dynamic(() => import("@/components/calendar-sync").then(m => m.CalendarSync), { ssr: false, loading: () => <ChartSkeleton height={140} /> });
const PremiumCalendar = dynamic(() => import("@/components/premium-calendar").then(m => m.PremiumCalendar), { ssr: false, loading: () => <ChartSkeleton height={220} /> });
const OnboardingVideo = dynamic(() => import("@/components/onboarding-video").then(m => m.OnboardingVideo), { ssr: false, loading: () => <ChartSkeleton height={140} /> });

/**
 * Hub "Más herramientas": hogar organizado para todas las funciones
 * secundarias del atleta. Nada se eliminó del dashboard viejo: cada
 * componente vive acá, agrupado por categoría, con una intro de una línea.
 */
const CATEGORIES = [
  {
    id: "gamificacion",
    label: "Juegos & XP",
    icon: Gamepad2,
    intro: "Convertí tu constancia en juego: XP, niveles, misiones y premios reales.",
    tools: [
      { label: "Hábitos RPG", desc: "Ganá XP y oro por entrenar; perdé HP si faltás", el: <HabiticaGamify /> },
      { label: "Tienda de hábitos", desc: "Canjeá tu XP por premios reales", el: <HabitStore /> },
      { label: "Calendario de hábitos", desc: "Tu mes de un vistazo: días verdes y rachas", el: <HabitCalendar /> },
      { label: "Challenges", desc: "Desafíos mensuales con leaderboard anonimizado", el: <Challenges /> },
    ],
  },
  {
    id: "salud",
    label: "Salud & Recuperación",
    icon: HeartPulse,
    intro: "Dormir, respirar y recuperar es parte del entrenamiento.",
    tools: [
      { label: "Sleep Tracker", desc: "Registro de sueño y su impacto en tu rendimiento", el: <SleepTracker /> },
      { label: "Health Box", desc: "Métricas de salud generales en un panel", el: <HealthBox /> },
      { label: "Recovery Breathing", desc: "Box breathing 4-4-4-4 para bajar revoluciones", el: <RecoveryBreathing /> },
    ],
  },
  {
    id: "cardio",
    label: "Cardio & Outdoor",
    icon: Footprints,
    intro: "Si sos de correr o pedalear, acá se registra todo.",
    tools: [
      { label: "Run Tracker", desc: "Registro de corridas con distancia y ritmo", el: <RunTracker /> },
      { label: "GPX Tracker", desc: "Importá y analizá tus rutas GPX", el: <GpxTracker /> },
    ],
  },
  {
    id: "datos",
    label: "Datos & Integraciones",
    icon: BarChart3,
    intro: "Traé tu historial de otras apps y exportá el propio cuando quieras.",
    tools: [
      { label: "Export Center", desc: "Descargá tus datos en CSV/PDF", el: <ExportCenter type="client" /> },
      { label: "Import Hevy", desc: "Migrá tu historial de Hevy en un paso", el: <HevyImportPro /> },
      { label: "OpenScale Sync", desc: "Sincronizá balanzas inteligentes abiertas", el: <OpenScaleSync /> },
    ],
  },
  {
    id: "social",
    label: "Social & Comunidad",
    icon: Users,
    intro: "Compartí tu progreso y sumá gente al coaching.",
    tools: [
      { label: "Compartir progreso", desc: "Tarjetas listas para redes, sin exponer datos privados", el: <SocialShare /> },
      { label: "Referidos", desc: "Traé un amigo: ambos ganan un mes gratis", el: <ReferralSystem /> },
    ],
  },
  {
    id: "educacion",
    label: "Educación",
    icon: BookOpen,
    intro: "Artículos y videos de KinetixFitt, sin salir de la app.",
    tools: [
      { label: "Wiki de entrenamiento", desc: "Técnica, nutrición y recovery en piezas cortas", el: <EducationHub /> },
    ],
  },
  {
    id: "sistema",
    label: "Sistema & App",
    icon: Settings2,
    intro: "Instalación, notificaciones y calendarios.",
    tools: [
      { label: "Instalar la app", desc: "PWA en Windows/Mac o pantalla de inicio en el celular", el: <PwaInstallDesktop /> },
      { label: "Notificaciones Push", desc: "Recordatorios de entreno, check-in y mensajes", el: <PushCenter /> },
      { label: "Sync de calendarios", desc: "Tus entrenos en Google/Apple Calendar", el: <CalendarSync /> },
      { label: "Calendario premium", desc: "Vista mensual de tu planificación", el: <PremiumCalendar /> },
      { label: "Bienvenida de KinetixFitt", desc: "Video + test de movimiento inicial", el: <OnboardingVideo /> },
    ],
  },
] as const;

function ToolsContentInner() {
  const params = useSearchParams();
  const catParam = params.get("cat");
  const [active, setActive] = useState<string>(
    catParam && CATEGORIES.some(c => c.id === catParam) ? catParam : CATEGORIES[0].id
  );
  const cat = CATEGORIES.find(c => c.id === active) ?? CATEGORIES[0];

  // Favoritos + recientes por usuario (apuntan a la ubicación canónica)
  const userKey = useSessionUserKey();
  const { favs, recent, isFav, toggleFav, pushRecent } = useUserPrefs(userKey);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-display font-bold">Más herramientas</h1>
        <p className="text-sm text-zinc-500">Todo lo que la app puede hacer, ordenado por categoría.</p>
      </div>

      {/* Chips de categoría: una fila scrolleable, jerarquía clara */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Categorías de herramientas">
        {CATEGORIES.map(c => {
          const fav = isFav(`/client/tools?cat=${c.id}`);
          const select = () => { setActive(c.id); pushRecent({ href: `/client/tools?cat=${c.id}`, label: c.label }); };
          return (
            // div con role="tab": un <button> dentro de otro <button> es HTML inválido
            // y provoca error de hidratación. Así la estrella sigue siendo un botón real.
            <div
              key={c.id}
              role="tab"
              tabIndex={0}
              aria-selected={active === c.id}
              onClick={select}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(); } }}
              className={`cursor-pointer px-3 py-2 rounded-full text-xs font-bold border whitespace-nowrap transition ${
                active === c.id
                  ? "bg-primary text-black border-primary"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <c.icon size={13} className="inline mr-1 -mt-0.5" aria-hidden="true" />
              {c.label}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggleFav({ href: `/client/tools?cat=${c.id}`, label: c.label }); }}
                onKeyDown={(e) => e.stopPropagation()}
                aria-label={fav ? `Quitar ${c.label} de favoritos` : `Favorito ${c.label}`}
                className={`ml-1.5 align-middle ${fav ? "text-black" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Star size={12} className={fav ? "fill-current" : ""} />
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-zinc-500">{cat.intro}</p>

      {(() => {
        const favCats = CATEGORIES.filter(c => isFav(`/client/tools?cat=${c.id}`));
        if (!favCats.length && !recent.length) return null;
        return (
          <div className="space-y-2">
            {favCats.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mr-1 flex items-center gap-1"><Star size={10} className="fill-primary text-primary" /> Favoritos</span>
                {favCats.map(c => (
                  <button key={c.id} onClick={() => setActive(c.id)} className="px-2.5 py-1 rounded-full bg-zinc-950 border border-primary/30 text-[11px] font-bold text-zinc-200 hover:border-primary/60 transition">
                    <c.icon size={11} className="inline mr-1 -mt-0.5 text-primary" />{c.label}
                  </button>
                ))}
              </div>
            )}
            {recent.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mr-1">Recientes</span>
                {recent.slice(0, 4).map(r => (
                  <Link key={r.href} href={r.href} className="px-2.5 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-[11px] font-bold text-zinc-300 hover:border-zinc-600 transition">
                    {r.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      <StaggerContainer key={active} className="space-y-4" stagger={0.07}>
        {cat.tools.map(t => (
          <StaggerItem key={t.label}>
            <div className="flex items-center gap-2 mb-1.5">
              <cat.icon size={15} className="text-primary" aria-hidden="true" />
              <p className="text-sm font-bold text-white">{t.label}</p>
              <Badge variant="muted">{cat.label}</Badge>
            </div>
            <Card className="border-zinc-800 bg-zinc-900/40 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-700">
              <CardContent className="p-3">
                {t.el}
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}

export function ToolsClient() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-zinc-500">Cargando herramientas…</div>}>
      <ToolsContentInner />
    </Suspense>
  );
}

export default ToolsClient;
