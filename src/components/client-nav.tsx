"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Home, Dumbbell, TrendingUp, MessageCircle, User, LogOut, Apple, ClipboardCheck, Settings, MoreHorizontal, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsBell } from "@/components/notifications-bell";

export function ClientBottomNav(){
  const path = usePathname();
  const [showMore,setShowMore]=useState(false);
  const items = [
    { href: "/client/dashboard", icon: Home, label: "Inicio" },
    { href: "/client/workout", icon: Dumbbell, label: "Entrenar" },
    { href: "/client/progress", icon: TrendingUp, label: "Progreso" },
    { href: "/client/messages", icon: MessageCircle, label: "Mensajes" },
  ];

  const moreItems = [
    { href: "/client/nutrition", icon: Apple, label: "Nutrición", badge: "VIP" },
    { href: "/client/checkins", icon: ClipboardCheck, label: "Check-ins" },
    { href: "/client/profile", icon: User, label: "Perfil" },
    { href: "/client/settings", icon: Settings, label: "Ajustes" },
  ];

  const isMoreActive = moreItems.some(i=> path===i.href || path.startsWith(i.href+"/"));

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F0F0F] border-t border-zinc-900 flex justify-around py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {items.map(i => {
          const active = path === i.href || path.startsWith(i.href + "/");
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl min-h-[44px] justify-center transition ${active ? "text-black bg-[#D6FF2A] font-bold" : "text-zinc-400 hover:text-white"}`}
            >
              <i.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-bold tracking-wide">{i.label}</span>
            </Link>
          );
        })}
        <button
          onClick={()=>setShowMore(!showMore)}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl min-h-[44px] justify-center transition ${isMoreActive || showMore ? "text-black bg-[#D6FF2A] font-bold" : "text-zinc-400 hover:text-white"}`}
        >
          <MoreHorizontal size={20} strokeWidth={isMoreActive || showMore ? 2.5 : 1.8} />
          <span className="text-[10px] font-bold tracking-wide">Más</span>
        </button>
      </nav>

      {/* Más drawer - mobile */}
      {showMore && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setShowMore(false)} />
          <div className="relative w-full max-w-[640px] bg-[#0F0F0F] border-t border-zinc-800 rounded-t-2xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-3 animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center">
              <p className="font-bold text-white">Más opciones</p>
              <button onClick={()=>setShowMore(false)} className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400"><X size={16}/></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {moreItems.map(i=>{
                const active = path===i.href;
                return (
                  <Link key={i.href} href={i.href} onClick={()=>setShowMore(false)} className={`p-3 rounded-xl border flex items-center gap-3 ${active?"bg-[#D6FF2A] text-black border-[#D6FF2A] font-bold":"bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700"}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${active?"bg-black text-[#D6FF2A]":"bg-zinc-800 text-zinc-400"}`}><i.icon size={18}/></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-none">{i.label} {i.badge && <span className="text-[10px] bg-violet-500 text-white px-1.5 py-0.5 rounded-full ml-1">{i.badge}</span>}</p>
                      <p className="text-xs opacity-60 truncate">{i.href}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <p className="text-[11px] text-zinc-600 text-center">Nutrición VIP + Check-ins + Perfil + Ajustes</p>
          </div>
        </div>
      )}
    </>
  );
}

export function ClientTopBar({ name }: { name?: string }){
  const r = useRouter();
  async function logout(){
    await fetch("/api/auth/logout", { method: "POST" });
    r.push("/login");
    r.refresh();
  }

  return (
    <header className="sticky top-0 z-30 bg-[#080808]/80 backdrop-blur border-b border-zinc-900">
      <div className="flex items-center justify-between px-4 h-[56px] max-w-[640px] mx-auto w-full">
        <Link href="/client/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#D6FF2A] flex items-center justify-center font-black text-black text-sm">
            E
          </div>
          <span className="font-display font-bold text-white text-sm tracking-tight">
            EZEQUIEL COACHING
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 hidden sm:inline max-w-[120px] truncate">{name}</span>
          <NotificationsBell />
          <ThemeToggle />
          <button
            onClick={logout}
            className="p-2 text-zinc-400 hover:text-white transition"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
