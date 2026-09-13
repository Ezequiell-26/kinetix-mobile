"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardCheck,
  MessageCircle,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  BookOpen,
  Activity,
  Wrench,
  Home,
  TrendingUp,
  Apple,
  Timer,
  LayoutGrid,
  Clock,
  Trophy,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NotificationsBell } from "@/components/notifications-bell";
import { ThemeToggle } from "@/components/theme-toggle";

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};
type NavGroup = { label: string; links: NavLink[] };

// Navegación para CLIENTE - estilo Cloudflare sidebar
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
      { href: "/client/achievements", label: "Logros & XP", icon: Trophy, badge: "NUEVO" },
    ],
  },
  {
    label: "Herramientas",
    links: [
      { href: "/client/timers", label: "Cronómetros", icon: Timer, badge: "PRO" },
      { href: "/client/tools", label: "Calculadoras", icon: LayoutGrid },
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

// Navegación para TRAINER - estilo Cloudflare sidebar
const trainerNavGroups: NavGroup[] = [
  {
    label: "Operación",
    links: [
      { href: "/trainer/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/trainer/clients", label: "Clientes", icon: Users },
      { href: "/trainer/checkins", label: "Check-ins", icon: ClipboardCheck },
      { href: "/trainer/messages", label: "Mensajes", icon: MessageCircle },
    ],
  },
  {
    label: "Contenido",
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
    links: [{ href: "/trainer/settings", label: "Ajustes", icon: Settings }],
  },
];

interface WebSidebarProps {
  role: "CLIENT" | "TRAINER";
  userName?: string | null;
  _userAvatar?: string | null;
}

export function WebSidebar({ role, userName, _userAvatar }: WebSidebarProps) {
  const pathname = usePathname();
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

  return (
    <>
      {/* Top Bar */}
      <header className="sticky top-0 z-40 h-16 border-b border-subtle/50 bg-[#080808]/85 backdrop-blur-xl">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-white transition"
              aria-label="Menú"
            >
              <Menu size={20} />
            </button>
            
            {/* Logo */}
            <Link href={dashboardHref} className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center font-black text-black text-base shadow-[0_4px_16px_rgba(52,211,153,0.35)] group-hover:shadow-[0_4px_24px_rgba(52,211,153,0.55)] transition-shadow overflow-hidden">
                <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg width="20" height="20" viewBox="0 0 512 512" className="w-full h-full" aria-hidden="true">
                  <rect width="512" height="512" rx="100" fill="url(#bgGradWeb)"/>
                  <defs>
                    <linearGradient id="bgGradWeb" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#0a0f14"/>
                      <stop offset="100%" stop-color="#0d1319"/>
                    </linearGradient>
                  </defs>
                  <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="Space Grotesk, Inter, sans-serif" font-weight="900" font-size="280" letter-spacing="-6" fill="#34d399">K</text>
                </svg>
              </div>
              <div className="hidden sm:block leading-none">
                <span className="font-display font-bold text-white text-sm tracking-tight block">KinetiX</span>
                <span className="text-[9px] text-zinc-500 font-bold tracking-[0.18em] uppercase">
                  {role === "CLIENT" ? "Panel de Cliente" : "Panel de Entrenador"}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationsBell />
            
            {/* User info */}
            <div className="hidden md:flex items-center gap-2 pl-3 ml-2 border-l border-subtle/50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center text-xs font-black text-primary">
                {avatarInitial}
              </div>
              <span className="text-xs font-semibold text-zinc-300 max-w-[120px] truncate">{userName}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition ml-1 px-3 py-1.5 rounded-lg hover:bg-white/[0.04]"
              title="Cerrar sesión"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Desktop Sidebar - estilo Cloudflare */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-16 h-[calc(100vh-64px)] border-r border-subtle/40 bg-[#080808]/50 backdrop-blur-sm overflow-y-auto">
          <nav className="flex-1 py-4 px-3 space-y-6">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] uppercase font-bold tracking-[0.18em] text-zinc-600 px-3 mb-2">
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {group.links.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all min-h-[40px] ${
                            isActive
                              ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(52,211,153,0.1)]"
                              : "text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                          }`}
                        >
                          <link.icon
                            size={18}
                            strokeWidth={isActive ? 2.2 : 1.8}
                            className="shrink-0"
                          />
                          <span className="flex-1">{link.label}</span>
                          {link.badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              link.badge === "NUEVO" 
                                ? "bg-violet-500 text-white" 
                                : "bg-primary text-black"
                            }`}>
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

          {/* User section en sidebar desktop */}
          <div className="border-t border-subtle/40 p-4 mt-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center text-sm font-black text-primary">
                {avatarInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{userName}</p>
                <p className="text-xs text-zinc-500 truncate">
                  {role === "CLIENT" ? "Cliente" : "Entrenador"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-white hover:bg-white/[0.04] transition"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6">
            {/* Mobile drawer overlay */}
            {mobileOpen && (
              <>
                <div
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
                  onClick={() => setMobileOpen(false)}
                />
                <div className="fixed inset-y-0 left-0 z-50 w-72 bg-[#080808] border-r border-subtle/50 lg:hidden overflow-y-auto">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-display font-bold text-white">Menú</span>
                      <button
                        onClick={() => setMobileOpen(false)}
                        className="w-8 h-8 rounded-lg bg-white/[0.06] border border-subtle/50 flex items-center justify-center text-zinc-400 hover:text-white transition"
                        aria-label="Cerrar menú"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* User info mobile */}
                    <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/[0.03] border border-subtle/30">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center text-sm font-black text-primary">
                        {avatarInitial}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{userName}</p>
                        <p className="text-xs text-zinc-500">
                          {role === "CLIENT" ? "Cliente" : "Entrenador"}
                        </p>
                      </div>
                    </div>

                    {navGroups.map((group) => (
                      <div key={group.label} className="mb-6">
                        <p className="text-[10px] uppercase font-bold tracking-[0.18em] text-zinc-600 px-3 mb-2">
                          {group.label}
                        </p>
                        <ul className="space-y-1">
                          {group.links.map((link) => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                            return (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                                    isActive
                                      ? "bg-primary/10 text-primary border border-primary/20"
                                      : "text-zinc-300 hover:bg-white/[0.04]"
                                  }`}
                                >
                                  <link.icon size={18} className="shrink-0" />
                                  <span>{link.label}</span>
                                  {link.badge && (
                                    <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                      link.badge === "NUEVO" 
                                        ? "bg-violet-500 text-white" 
                                        : "bg-primary text-black"
                                    }`}>
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

                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                      className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-zinc-500 hover:text-white hover:bg-white/[0.04] transition"
                    >
                      <LogOut size={16} />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
