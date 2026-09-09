"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Dumbbell, ClipboardCheck, MessageCircle, CreditCard, Settings, LogOut, Menu, BarChart3, BookOpen } from "lucide-react";
import { useState } from "react";
import { NotificationsBell } from "@/components/notifications-bell";
import { CommandPalette } from "@/components/command-palette";
import { ThemeToggle } from "@/components/theme-toggle";
const links = [
  {href:"/trainer/dashboard", label:"Dashboard", icon:LayoutDashboard},
  {href:"/trainer/clients", label:"Clientes", icon:Users},
  {href:"/trainer/workouts", label:"Entrenamientos", icon:Dumbbell},
  {href:"/trainer/exercises", label:"Ejercicios", icon:Dumbbell},
  {href:"/trainer/checkins", label:"Check-ins", icon:ClipboardCheck},
  {href:"/trainer/messages", label:"Mensajes", icon:MessageCircle},
  {href:"/trainer/analytics", label:"Analíticas", icon:BarChart3},
  {href:"/trainer/resources", label:"Recursos", icon:BookOpen},
  {href:"/trainer/payments", label:"Pagos", icon:CreditCard},
  {href:"/trainer/settings", label:"Ajustes", icon:Settings},
];
export function TrainerNav(){
  const path = usePathname(); const r=useRouter(); const [open,setOpen]=useState(false);
  async function logout(){ await fetch("/api/auth/logout",{method:"POST"}); r.push("/login"); r.refresh(); }
  return (
    <>
      {/* top bar */}
      <header className="sticky top-0 z-40 bg-[#080808]/80 backdrop-blur border-b border-zinc-900">
        <div className="flex items-center justify-between px-4 h-[56px] max-w-[1200px] mx-auto w-full">
          <div className="flex items-center gap-3">
            <button onClick={()=>setOpen(!open)} className="lg:hidden p-2 -ml-2 text-zinc-400"><Menu size={20} /></button>
            <Link href="/trainer/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D6FF2A] flex items-center justify-center font-black text-black text-sm">E</div>
              <span className="font-display font-bold tracking-tight text-white text-sm">EZEQUIEL COACHING</span>
              <span className="hidden sm:inline text-[10px] px-2 py-1 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800">TRAINER</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <CommandPalette />
            <ThemeToggle />
            <NotificationsBell />
            <button onClick={logout} className="hidden lg:flex items-center gap-2 text-xs text-zinc-500 hover:text-white ml-1"><LogOut size={16}/> Salir</button>
          </div>
        </div>
      </header>
      <div className="flex max-w-[1200px] mx-auto w-full">
        {/* sidebar desktop */}
        <aside className="hidden lg:block w-[240px] shrink-0 sticky top-[56px] h-[calc(100vh-56px)] border-r border-zinc-900 p-4 space-y-1 overflow-y-auto">
          {links.map(l=>{
            const active = path.startsWith(l.href);
            return <Link key={l.href} href={l.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${active ? "bg-white text-black" : "text-zinc-400 hover:text-white hover:bg-zinc-900"}`}><l.icon size={18}/> {l.label}</Link>
          })}
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-white w-full"><LogOut size={18}/> Cerrar sesión</button>
        </aside>
        {/* mobile drawer */}
        {open && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/60" onClick={()=>setOpen(false)} />
            <div className="w-[280px] bg-[#111111] border-l border-zinc-800 p-4 space-y-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-4"><span className="font-bold">Menú</span><button onClick={()=>setOpen(false)} className="text-zinc-500">✕</button></div>
              {links.map(l=>{
                const active = path.startsWith(l.href);
                return <Link key={l.href} href={l.href} onClick={()=>setOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium ${active ? "bg-white text-black" : "text-zinc-300 hover:bg-zinc-900"}`}><l.icon size={18}/> {l.label}</Link>
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export function TrainerBottomNav(){
  const path=usePathname();
  const items=[
    {href:"/trainer/dashboard", icon:LayoutDashboard, label:"Inicio"},
    {href:"/trainer/clients", icon:Users, label:"Clientes"},
    {href:"/trainer/workouts", icon:Dumbbell, label:"Rutinas"},
    {href:"/trainer/messages", icon:MessageCircle, label:"Chat"},
    {href:"/trainer/checkins", icon:ClipboardCheck, label:"Más"},
  ];
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F0F0F] border-t border-zinc-900 flex justify-around py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      {items.map(i=>{
        const active = path.startsWith(i.href);
        return <Link key={i.href} href={i.href} className={`flex flex-col items-center gap-1 px-3 py-1 ${active?"text-[#D6FF2A]":"text-zinc-500"}`}><i.icon size={20} strokeWidth={active?2.5:1.8} /><span className="text-[10px] font-semibold tracking-wide">{i.label}</span></Link>
      })}
    </nav>
  );
}
