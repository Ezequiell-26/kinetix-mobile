"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  X,
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardCheck,
  MessageCircle,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  BarChart3,
  BookOpen,
  Activity,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { NotificationsBell } from "@/components/notifications-bell";
import { CommandPalette } from "@/components/command-palette";
import { ThemeToggle } from "@/components/theme-toggle";

// Sidebar agrupada por trabajo real: operación del día, contenido, negocio y sistema.
const navGroups: {
  label: string;
  links: { href: string; label: string; icon: typeof LayoutDashboard }[];
}[] = [
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
const links = navGroups.flatMap((g) => g.links);

export function TrainerNav() {
  const path = usePathname();
  const r = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    r.push("/login");
    r.refresh();
  }

  return (
    <>
      {/* ── Top bar ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#080808]/85 backdrop-blur-xl border-b border-subtle/50 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary/20 after:to-transparent">
        <div className="flex items-center justify-between px-4 h-[60px] max-w-[1200px] mx-auto w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-white transition"
              aria-label="Menú"
            >
              <Menu size={20} />
            </button>
            <Link
              href="/trainer/dashboard"
              className="flex items-center gap-2.5 group"
            >
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center font-black text-black text-base shadow-[0_4px_16px_rgba(52,211,153,0.35)] group-hover:shadow-[0_4px_24px_rgba(52,211,153,0.55)] transition-shadow">
                <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">E</span>
              </div>
              <div className="leading-none">
                <span className="font-display font-bold text-white text-sm tracking-tight block">
                  EZEQUIEL COACHING
                </span>
                <span className="text-[9px] text-zinc-500 font-bold tracking-[0.18em] uppercase hidden sm:block mt-0.5">
                  Panel de entrenador
                </span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <CommandPalette />
            <ThemeToggle />
            <NotificationsBell />
            <button
              onClick={logout}
              className="hidden lg:flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition ml-1 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04]"
            >
              <LogOut size={15} /> Salir
            </button>
          </div>
        </div>
      </header>

      {/* ── Sidebar desktop ───────────────────────────────────── */}
      <div className="flex max-w-[1200px] mx-auto w-full">
        <aside className="hidden lg:flex flex-col w-[240px] shrink-0 sticky top-[60px] h-[calc(100vh-60px)] border-r border-subtle/40 py-5 px-3 overflow-y-auto">
          <nav aria-label="Navegación principal" className="flex-1 space-y-1.5">
            {navGroups.map((g) => (
              <div key={g.label} className="pb-1">
                <p className="text-[10px] uppercase font-bold tracking-[0.18em] text-zinc-600 px-3 pt-3 pb-1.5">
                  {g.label}
                </p>
                {g.links.map((l) => {
                  const active = path.startsWith(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all min-h-[42px] ${
                        active
                          ? "pill-active"
                          : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <l.icon
                        size={18}
                        strokeWidth={active ? 2.2 : 1.8}
                      />
                      {l.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-white hover:bg-white/[0.04] w-full transition mt-2"
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
        </aside>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────── */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="w-[280px] bg-[#0C131A] border-l border-subtle/50 p-4 space-y-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <span className="font-display font-bold text-white">Menú</span>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/[0.06] border border-subtle/50 flex items-center justify-center text-zinc-400 hover:text-white transition"
                aria-label="Cerrar menú"
              >
                <X size={15} />
              </button>
            </div>
            {navGroups.map((g) => (
              <div key={g.label} className="pb-2">
                <p className="text-[10px] uppercase font-bold tracking-[0.16em] text-zinc-600 px-3 pt-2 pb-1">
                  {g.label}
                </p>
                {g.links.map((l) => {
                  const active = path.startsWith(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium min-h-[46px] transition-all ${
                        active
                          ? "pill-active"
                          : "text-zinc-300 hover:bg-white/[0.04]"
                      }`}
                    >
                      <l.icon size={18} />
                      {l.label}
                    </Link>
                  );
                })}
              </div>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-zinc-500 hover:text-white w-full mt-4 transition"
            >
              <LogOut size={18} /> Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function TrainerBottomNav() {
  const path = usePathname();
  const r = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    r.push("/login");
    r.refresh();
  }

  const items = [
    { href: "/trainer/dashboard", icon: LayoutDashboard, label: "Inicio" },
    { href: "/trainer/clients", icon: Users, label: "Clientes" },
    { href: "/trainer/workouts", icon: Dumbbell, label: "Rutinas" },
    { href: "/trainer/messages", icon: MessageCircle, label: "Chat" },
  ];

  const moreItems: {
    href: string;
    icon: typeof LayoutDashboard;
    label: string;
    desc: string;
  }[] = [
    {
      href: "/trainer/checkins",
      icon: ClipboardCheck,
      label: "Check-ins",
      desc: "Revisiones pendientes",
    },
    {
      href: "/trainer/analytics",
      icon: BarChart3,
      label: "Analíticas",
      desc: "Adherencia e ingresos",
    },
    {
      href: "/trainer/exercises",
      icon: Activity,
      label: "Ejercicios",
      desc: "Biblioteca completa",
    },
    {
      href: "/trainer/resources",
      icon: BookOpen,
      label: "Recursos",
      desc: "Videos y guías",
    },
    {
      href: "/trainer/payments",
      icon: CreditCard,
      label: "Pagos",
      desc: "Suscripciones",
    },
    {
      href: "/trainer/studio",
      icon: Wrench,
      label: "Studio",
      desc: "Herramientas avanzadas",
    },
    {
      href: "/trainer/settings",
      icon: Settings,
      label: "Ajustes",
      desc: "Cuenta y app",
    },
  ];

  const isMoreActive = moreItems.some(
    (i) => path === i.href || path.startsWith(i.href + "/")
  );

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0C131A]/92 backdrop-blur-xl border-t border-subtle/40 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] flex justify-around py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
      >
        {items.map((i) => {
          const active = path.startsWith(i.href);
          return (
            <Link
              key={i.href}
              href={i.href}
              aria-current={active ? "page" : undefined}
              aria-label={i.label}
              className="relative flex flex-col items-center gap-1 px-3 py-1.5 min-h-[52px] min-w-[56px] justify-center transition-all active:scale-95"
            >
              <i.icon
                size={22}
                strokeWidth={active ? 2.5 : 2}
                className={active ? "nav-icon-active" : "nav-icon"}
              />
              <span
                className={`text-[10px] tracking-wide ${
                  active ? "nav-label-active" : "nav-label"
                }`}
              >
                {i.label}
              </span>
              {active && (
                <span
                  className="nav-dot absolute bottom-0 w-1 h-1 rounded-full"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Más opciones"
          className="relative flex flex-col items-center gap-1 px-3 py-1.5 min-h-[52px] min-w-[56px] justify-center transition-all active:scale-95"
        >
          <Menu
            size={22}
            strokeWidth={isMoreActive || open ? 2.5 : 2}
            className={isMoreActive || open ? "nav-icon-active" : "nav-icon"}
          />
          <span
            className={`text-[10px] tracking-wide ${
              isMoreActive || open ? "nav-label-active" : "nav-label"
            }`}
          >
            Más
          </span>
          {(isMoreActive || open) && (
            <span
              className="nav-dot absolute bottom-0 w-1 h-1 rounded-full"
              aria-hidden="true"
            />
          )}
        </button>
      </nav>

      {/* More drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-[640px] bg-[#0C131A] border-t border-subtle/50 rounded-t-3xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-3 animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center">
              <p className="font-display font-bold text-white">Más opciones</p>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="w-9 h-9 rounded-full bg-white/[0.06] border border-subtle/50 flex items-center justify-center text-zinc-400 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((i) => {
                const active = path === i.href;
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    onClick={() => setOpen(false)}
                    className={`p-3 rounded-xl border flex items-center gap-3 min-h-[60px] transition-all ${
                      active
                        ? "bg-primary text-black border-primary font-bold"
                        : "bg-white/[0.03] border-subtle/50 text-white hover:border-primary/30 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        active
                          ? "bg-black/20 text-black"
                          : "bg-white/[0.06] text-zinc-400"
                      }`}
                    >
                      <i.icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-none">{i.label}</p>
                      <p className="text-xs opacity-60 truncate mt-1">
                        {i.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full p-3 rounded-xl border border-subtle/50 text-zinc-400 hover:text-white hover:bg-white/[0.04] flex items-center justify-center gap-2 text-sm font-bold min-h-[52px] transition"
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </>
  );
}
