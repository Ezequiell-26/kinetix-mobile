"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Home, Dumbbell, TrendingUp, MessageCircle, User, LogOut, Apple, ClipboardCheck, Settings, MoreHorizontal, X, Timer, LayoutGrid, Clock } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsBell } from "@/components/notifications-bell";
import { CommandPalettePro } from "@/components/command-palette-pro";

export function ClientBottomNav(){
  const path = usePathname();
  const [showMore,setShowMore]=useState(false);
  const items = [
    { href: "/client/dashboard", icon: Home, label: "Inicio" },
    { href: "/client/workout", icon: Dumbbell, label: "Entrenar" },
    { href: "/client/nutrition", icon: Apple, label: "Nutrición" },
    { href: "/client/progress", icon: TrendingUp, label: "Progreso" },
  ];

  const moreItems = [
    { href: "/client/messages", icon: MessageCircle, label: "Mensajes" },
    { href: "/client/tools", icon: LayoutGrid, label: "Herramientas", badge: "NUEVO" },
    { href: "/client/timers", icon: Timer, label: "Cronómetros", badge: "PRO" },
    { href: "/client/checkins", icon: ClipboardCheck, label: "Check-ins" },
    { href: "/client/history", icon: Clock, label: "Historial" },
    { href: "/client/profile", icon: User, label: "Perfil" },
    { href: "/client/settings", icon: Settings, label: "Ajustes" },
  ];

  const isMoreActive = moreItems.some(i=> path===i.href || path.startsWith(i.href+"/"));

  return (
    <>
      <nav aria-label="Navegación principal" className="lg:hidden fixed bottom-3 left-3 right-3 z-40 max-w-[560px] mx-auto">
        <div className="relative rounded-3xl bg-[#0D1319]/90 backdrop-blur-xl border border-subtle shadow-[0_16px_50px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] flex justify-around items-center px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] before:content-[''] before:absolute before:inset-0 before:rounded-3xl before:p-px before:bg-gradient-to-b before:from-white/10 before:to-transparent before:-z-10">
        {items.map(i => {
          const active = path === i.href || path.startsWith(i.href + "/");
          return (
            <Link
              key={i.href}
              href={i.href}
              aria-current={active ? "page" : undefined}
              aria-label={i.label}
              className="relative flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-xl min-h-[52px] min-w-[56px] justify-center transition-all active:scale-95"
            >
              <i.icon
                size={22}
                strokeWidth={active ? 2.5 : 2}
                className={active ? "nav-icon-active" : "nav-icon"}
              />
              <span className={`text-[10px] tracking-wide ${active ? "nav-label-active" : "nav-label"}`}>{i.label}</span>
              {active && <span className="nav-dot absolute -bottom-0.5 w-1 h-1 rounded-full" aria-hidden="true" />}
            </Link>
          );
        })}
        <button
          onClick={()=>setShowMore(!showMore)}
          aria-expanded={showMore}
          aria-label="Más opciones"
          className="relative flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-xl min-h-[52px] min-w-[56px] justify-center transition-all active:scale-95"
        >
          <MoreHorizontal
            size={22}
            strokeWidth={isMoreActive || showMore ? 2.5 : 2}
            className={isMoreActive || showMore ? "nav-icon-active" : "nav-icon"}
          />
          <span className={`text-[10px] tracking-wide ${isMoreActive || showMore ? "nav-label-active" : "nav-label"}`}>Más</span>
          {(isMoreActive || showMore) && <span className="nav-dot absolute -bottom-0.5 w-1 h-1 rounded-full" aria-hidden="true" />}
        </button>
        </div>
      </nav>

      {/* Más drawer - mobile */}
      {showMore && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setShowMore(false)} />
          <div className="relative w-full max-w-[640px] bg-[#0D1319] border-t border-subtle rounded-t-3xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-3 animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center">
              <p className="font-bold text-white">Más opciones</p>
              <button onClick={()=>setShowMore(false)} className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400"><X size={16}/></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {moreItems.map(i=>{
                const active = path===i.href;
                return (
                  <Link key={i.href} href={i.href} onClick={()=>setShowMore(false)} className={`p-3 rounded-xl border flex items-center gap-3 ${active?"bg-primary text-black border-primary font-bold":"bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700"}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${active?"bg-black text-primary":"bg-zinc-800 text-zinc-400"}`}><i.icon size={18}/></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-none">{i.label} {i.badge && <span className="text-[10px] bg-violet-500 text-white px-1.5 py-0.5 rounded-full ml-1">{i.badge}</span>}</p>
                      <p className="text-xs opacity-60 truncate">{i.href}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <p className="text-[11px] text-zinc-600 text-center">Mensajes, herramientas, check-ins, perfil y ajustes</p>
          </div>
        </div>
      )}
    </>
  );
}

export function ClientTopBar({ name }: { name?: string }){
  const path = usePathname();
  const r = useRouter();
  async function logout(){
    await fetch("/api/auth/logout", { method: "POST" });
    r.push("/login");
    r.refresh();
  }

  return (
    <header className="sticky top-0 z-30 bg-[#0A0F14]/85 backdrop-blur-xl border-b border-subtle relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary/25 after:to-transparent">
      <div className="flex items-center justify-between px-4 lg:px-8 h-[60px] max-w-[1100px] mx-auto w-full">
        <Link href="/client/dashboard" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center font-black text-black text-base shadow-[0_4px_16px_rgba(52,211,153,0.35)] group-hover:shadow-[0_4px_24px_rgba(52,211,153,0.55)] transition-shadow">
            <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative">E</span>
          </div>
          <div className="leading-none">
            <span className="font-display font-bold text-white text-sm tracking-tight block">EZEQUIEL COACHING</span>
            <span className="text-[9px] text-zinc-500 font-bold tracking-[0.18em] uppercase hidden sm:block mt-0.5">Tu mejor versión, cada día</span>
          </div>
        </Link>
        <nav aria-label="Secciones" className="hidden lg:flex items-center gap-1 ml-6 mr-auto">
          {[
            { href: "/client/dashboard", label: "Inicio" },
            { href: "/client/workout", label: "Entrenar" },
            { href: "/client/nutrition", label: "Nutrición" },
            { href: "/client/progress", label: "Progreso" },
            { href: "/client/tools", label: "Herramientas" },
          ].map(l => {
            const active = l.href === "/client/dashboard" ? path === l.href : path.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined}
                className={`px-3.5 py-2 rounded-xl text-[13px] font-bold transition ${active ? "bg-primary/10 text-primary border border-primary/25" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent"}`}>
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <CommandPalettePro role="client" />
          <div className="hidden sm:flex items-center gap-2 pl-2 ml-1 border-l border-subtle">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-subtle flex items-center justify-center text-[11px] font-black text-primary">
              {(name || "A").charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-zinc-300 max-w-[110px] truncate">{name}</span>
          </div>
          <NotificationsBell />
          <ThemeToggle />
          <button
            onClick={logout}
            className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800/60 transition"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}