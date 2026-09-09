"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Dumbbell, TrendingUp, MessageCircle, User, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsBell } from "@/components/notifications-bell";

export function ClientBottomNav(){
  const path = usePathname();
  const items = [
    { href: "/client/dashboard", icon: Home, label: "Inicio" },
    { href: "/client/workout", icon: Dumbbell, label: "Entrenar" },
    { href: "/client/progress", icon: TrendingUp, label: "Progreso" },
    { href: "/client/messages", icon: MessageCircle, label: "Mensajes" },
    { href: "/client/profile", icon: User, label: "Perfil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F0F0F] border-t border-zinc-900 flex justify-around py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      {items.map(i => {
        const active = path === i.href || path.startsWith(i.href + "/");
        return (
          <Link
            key={i.href}
            href={i.href}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl min-h-[44px] justify-center transition ${
              active ? "text-black bg-[#D6FF2A] font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <i.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[10px] font-bold tracking-wide">{i.label}</span>
          </Link>
        );
      })}
    </nav>
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
