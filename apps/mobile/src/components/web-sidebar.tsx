"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  Apple,
  BarChart3,
  BookOpen,
  CreditCard,
  Dumbbell,
  FileText,
  Footprints,
  Gamepad2,
  HeartPulse,
  Home,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  Settings2,
  Timer,
  TrendingUp,
  Trophy,
  User,
  Users,
  Wrench,
  X,
  ClipboardCheck,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NotificationsBell } from "@/components/notifications-bell";
import { OfflineIndicator } from "@/components/offline-indicator";
import { ThemeToggle } from "@/components/theme-toggle";

type NavLink = { href: string; label: string; icon: LucideIcon; badge?: string };
type NavGroup = { label: string; links: NavLink[] };

/**
 * Navegación canónica del panel.
 * Las herramientas se exponen por categoría directamente en el sidebar para
 * evitar duplicar su descubrimiento dentro del dashboard.
 */
const clientNavGroups: NavGroup[] = [
  {
    label: "Principal",
    links: [
      { href: "/client/dashboard", label: "Dashboard", icon: Home },
      { href: "/client/workout", label: "Entrenamientos", icon: Dumbbell },
      { href: "/client/nutrition", label: "Nutrición", icon: Apple },
      { href: "/client/progress", label: "Progreso", icon: TrendingUp },
    ],
  },
  {
    label: "Seguimiento",
    links: [
      { href: "/client/checkins", label: "Check-ins", icon: ClipboardCheck },
      { href: "/client/history", label: "Historial", icon: Clock },
      { href: "/client/achievements", label: "Logros & XP", icon: Trophy },
    ],
  },
  {
    label: "Herramientas",
    links: [
      { href: "/client/tools", label: "Centro de herramientas", icon: LayoutGrid },
      { href: "/client/tools?cat=gamificacion", label: "Juegos & XP", icon: Gamepad2 },
      { href: "/client/tools?cat=salud", label: "Salud & Recuperación", icon: HeartPulse },
      { href: "/client/tools?cat=cardio", label: "Cardio & Outdoor", icon: Footprints },
      { href: "/client/tools?cat=datos", label: "Datos & Integraciones", icon: BarChart3 },
      { href: "/client/tools?cat=social", label: "Social & Comunidad", icon: Users },
      { href: "/client/tools?cat=educacion", label: "Educación", icon: BookOpen },
      { href: "/client/tools?cat=sistema", label: "Sistema & App", icon: Settings2 },
      { href: "/client/timers", label: "Cronómetros", icon: Timer, badge: "PRO" },
      { href: "/client/resources", label: "Recursos VIP", icon: BookOpen },
    ],
  },
  {
    label: "Comunicación",
    links: [
      { href: "/client/messages", label: "Mensajes", icon: MessageCircle },
    ],
  },
  {
    label: "Cuenta",
    links: [
      { href: "/client/profile", label: "Mi Perfil", icon: User },
      { href: "/client/settings", label: "Ajustes", icon: Settings },
    ],
  },
];

const trainerNavGroups: NavGroup[] = [
  {
    label: "Principal",
    links: [
      { href: "/trainer/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/trainer/clients", label: "Clientes", icon: Users },
      { href: "/trainer/checkins", label: "Check-ins", icon: ClipboardCheck },
      { href: "/trainer/messages", label: "Mensajes", icon: MessageCircle },
    ],
  },
  {
    label: "Entrenamiento",
    links: [
      { href: "/trainer/workouts", label: "Entrenamientos", icon: Dumbbell },
      { href: "/trainer/exercises", label: "Ejercicios", icon: Activity },
      { href: "/trainer/resources", label: "Recursos", icon: BookOpen },
    ],
  },
  {
    label: "Negocio",
    links: [
      { href: "/trainer/analytics", label: "Analíticas", icon: BarChart3 },
      { href: "/trainer/payments", label: "Pagos", icon: CreditCard },
      { href: "/trainer/studio", label: "Studio", icon: Wrench },
    ],
  },
  {
    label: "Sistema",
    links: [
      { href: "/trainer/changelog", label: "Novedades", icon: FileText, badge: "NUEVO" },
      { href: "/trainer/settings", label: "Ajustes", icon: Settings },
    ],
  },
];

interface WebSidebarProps {
  role: "CLIENT" | "TRAINER";
  userName?: string | null;
  _userAvatar?: string | null;
  children?: React.ReactNode;
}

export function WebSidebar({ role, userName, children }: WebSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navGroups = role === "CLIENT" ? clientNavGroups : trainerNavGroups;
  const dashboardHref = role === "CLIENT" ? "/client/dashboard" : "/trainer/dashboard";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const avatarInitial = (userName || "U").charAt(0).toUpperCase();

  const isActive = (href: string) => {
    const [basePath, query] = href.split("?");
    if (pathname !== basePath && !pathname.startsWith(`${basePath}/`)) return false;

    if (!query) {
      return pathname === basePath && searchParams.toString() === "";
    }

    const expected = new URLSearchParams(query);
    for (const [key, value] of expected.entries()) {
      if (searchParams.get(key) !== value) return false;
    }
    return true;
  };

  const renderNav = (mobile = false) => (
    <nav className={mobile ? "space-y-5" : "space-y-6"} aria-label={mobile ? "Menú móvil" : "Navegación principal"}>
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="px-3 mb-2 text-[10px] uppercase font-bold tracking-[0.18em] text-zinc-600">
            {group.label}
          </p>
          <ul className="space-y-1">
            {group.links.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    onClick={mobile ? () => setMobileOpen(false) : undefined}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                      active
                        ? "border-primary/20 bg-primary/10 text-primary shadow-[0_0_24px_rgba(214,255,42,0.08)]"
                        : "border-transparent text-zinc-400 hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <link.icon size={18} strokeWidth={active ? 2.2 : 1.8} className="shrink-0" />
                    <span className="min-w-0 flex-1 truncate">{link.label}</span>
                    {link.badge && (
                      <span
                        className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                          link.badge === "NUEVO" ? "bg-violet-500 text-white" : "bg-primary text-black"
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen overflow-x-clip bg-[#080D11]">
      <OfflineIndicator />
      <header className="sticky top-0 z-40 h-16 border-b border-subtle/50 bg-[#080D11]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMobileOpen((open) => !open)}
              className="-ml-2 rounded-lg p-2 text-zinc-400 transition hover:bg-white/[0.04] hover:text-white lg:hidden"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href={dashboardHref} className="group flex min-w-0 items-center gap-3">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary font-black text-black shadow-[0_4px_20px_rgba(214,255,42,0.18)]">
                <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="font-display text-lg font-black" aria-hidden="true">K</span>
              </div>
              <div className="hidden min-w-0 sm:block">
                <span className="block font-display text-sm font-bold tracking-tight text-white">KINETIXFITT</span>
                <span className="block truncate text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  {role === "CLIENT" ? "Panel de Cliente" : "Panel de Entrenador"}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <NotificationsBell />
            <div className="hidden items-center gap-2 border-l border-subtle/50 pl-3 md:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-black text-primary">
                {avatarInitial}
              </div>
              <span className="max-w-[120px] truncate text-xs font-semibold text-zinc-300">{userName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="ml-1 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
              title="Cerrar sesión"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)] min-w-0">
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-72 shrink-0 flex-col overflow-y-auto border-r border-subtle/40 bg-[#080D11]/70 backdrop-blur-sm lg:flex">
          <div className="flex-1 px-3 py-5">{renderNav()}</div>
          <div className="border-t border-subtle/40 p-4">
            <div className="mb-3 flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-black text-primary">
                {avatarInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{userName}</p>
                <p className="truncate text-xs text-zinc-500">{role === "CLIENT" ? "Cliente" : "Entrenador"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-transparent">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">{children}</div>
        </main>
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-50 cursor-default bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          />
          <aside
            className="fixed inset-y-0 left-0 z-[51] w-[min(88vw,22rem)] overflow-y-auto border-r border-subtle/50 bg-[#080D11] shadow-2xl lg:hidden"
            aria-label="Menú móvil"
          >
            <div className="p-4 pt-5">
              <div className="mb-6 flex items-center justify-between">
                <Link href={dashboardHref} onClick={() => setMobileOpen(false)} className="font-display font-bold text-white">
                  KINETIXFITT
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-subtle/50 bg-white/[0.06] text-zinc-400 transition hover:text-white"
                  aria-label="Cerrar menú"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mb-6 flex items-center gap-3 rounded-xl border border-subtle/30 bg-white/[0.03] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-black text-primary">
                  {avatarInitial}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{userName}</p>
                  <p className="text-xs text-zinc-500">{role === "CLIENT" ? "Cliente" : "Entrenador"}</p>
                </div>
              </div>

              {renderNav(true)}

              <button
                onClick={handleLogout}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
              >
                <LogOut size={16} /> Cerrar sesión
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
