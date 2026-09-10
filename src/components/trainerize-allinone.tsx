"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Flame,
  MessageSquare,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  Droplets,
  Moon,
  Footprints,
  Beef,
  Send,
  Camera,
  Trophy,
  Calendar,
  Zap,
  Plus,
  ArrowUpRight,
  Users,
} from "lucide-react";

// Inspirado en ABC Trainerize (All-in-one #1) — https://www.trainerize.com
// Trainerize: workouts + nutrition + habits + messaging + progress + payments en 1 plataforma unificada
// Mejorado con MIT: Lyftr (program builder), Simple (scheduling), Strive (habits/XP), Baremetrics (revenue), HealthBox (progress)
// Licencia MIT — patrones adaptados (dashboard unificado 6 dominios + client switcher + quick actions) sin copia literal

type ClientAllInOne = {
  id: string;
  name: string;
  avatar: string;
  plan: string;
  adherence: number;
  program: string;
  week: string;
  nextWorkout: string;
  nutrition: { kcal: number; p: number; c: number; g: number; meals: number; water: number };
  habits: { water: number; sleep: number; steps: number; protein: number; streak: number };
  messages: { unread: number; last: string; lastAt: string };
  progress: { weight: number; delta: string; photos: number; pr: string; volumeWeek: string };
  payment: { status: "al día" | "vence pronto" | "atrasado"; nextBilling: string; amount: string };
};

const CLIENTS: ClientAllInOne[] = [
  {
    id: "1",
    name: "Martín Fernández",
    avatar: "MF",
    plan: "Premium",
    adherence: 92,
    program: "Hipertrofia 12 Sem",
    week: "Sem 7 · Día 3 — Push",
    nextWorkout: "Hoy 19:00 — Pecho/Hombro/Tríceps (60 min)",
    nutrition: { kcal: 2850, p: 172, c: 320, g: 85, meals: 3, water: 1.8 },
    habits: { water: 72, sleep: 7.2, steps: 8430, protein: 88, streak: 7 },
    messages: { unread: 2, last: "¿Subo a 85kg en banca? Sentí RIR 1", lastAt: "hace 2h" },
    progress: { weight: 78.4, delta: "-0.6kg (7d)", photos: 12, pr: "Banca 100×5 → 116kg 1RM", volumeWeek: "18.4t" },
    payment: { status: "al día", nextBilling: "15 oct", amount: "$28.000" },
  },
  {
    id: "2",
    name: "Sofía Rodríguez",
    avatar: "SR",
    plan: "Personalizado",
    adherence: 68,
    program: "Pérdida grasa 8 Sem",
    week: "Sem 3 · Día 2 — Full Body",
    nextWorkout: "Mañana 08:00 — Pierna/Glúteo (50 min)",
    nutrition: { kcal: 1850, p: 130, c: 180, g: 55, meals: 2, water: 1.2 },
    habits: { water: 48, sleep: 6.1, steps: 6200, protein: 62, streak: 3 },
    messages: { unread: 0, last: "Gracias! Me gustó el check-in", lastAt: "ayer" },
    progress: { weight: 62.1, delta: "-1.2kg (7d)", photos: 8, pr: "Sentadilla 60×8 → 76kg 1RM", volumeWeek: "9.2t" },
    payment: { status: "vence pronto", nextBilling: "12 oct", amount: "$18.000" },
  },
  {
    id: "3",
    name: "Lucas Gómez",
    avatar: "LG",
    plan: "Premium",
    adherence: 84,
    program: "Fuerza 5×5 — 8 Sem",
    week: "Sem 5 · Día 1 — Sentadilla",
    nextWorkout: "Hoy 20:30 — Peso Muerto (70 min)",
    nutrition: { kcal: 3100, p: 185, c: 350, g: 90, meals: 4, water: 2.4 },
    habits: { water: 96, sleep: 8.0, steps: 10200, protein: 95, streak: 12 },
    messages: { unread: 1, last: "RPE 9 en la última serie, ¿deload?", lastAt: "hace 5h" },
    progress: { weight: 84.2, delta: "+0.4kg (7d)", photos: 20, pr: "Peso muerto 140×3 → 154kg 1RM", volumeWeek: "22.1t" },
    payment: { status: "al día", nextBilling: "01 nov", amount: "$28.000" },
  },
  {
    id: "4",
    name: "Valentina Díaz",
    avatar: "VD",
    plan: "Básico",
    adherence: 95,
    program: "Full Body 3d — Base",
    week: "Sem 2 · Día 3 — Full C",
    nextWorkout: "Hoy 18:00 — Full Body (45 min)",
    nutrition: { kcal: 2100, p: 135, c: 220, g: 60, meals: 3, water: 2.0 },
    habits: { water: 80, sleep: 7.8, steps: 9100, protein: 92, streak: 21 },
    messages: { unread: 0, last: "¡21 días seguidos! 🔥", lastAt: "hace 1h" },
    progress: { weight: 58.9, delta: "-0.3kg (7d)", photos: 6, pr: "Hip Thrust 80×10 → 106kg 1RM", volumeWeek: "12.7t" },
    payment: { status: "al día", nextBilling: "20 oct", amount: "$12.000" },
  },
];

export function TrainerizeAllInOne() {
  const [activeId, setActiveId] = useState("1");
  const client = useMemo(() => CLIENTS.find((c) => c.id === activeId)!, [activeId]);
  const [quickNote, setQuickNote] = useState("");

  return (
    <Card className="border-zinc-800 bg-zinc-900 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <LayoutDashboard size={18} className="text-[#D6FF2A]" /> Trainerize All-in-One
              <Badge variant="accent" className="text-[10px]">MIT 76</Badge>
              <Badge variant="muted" className="text-[10px] border-zinc-700">workouts+nutrición+hábitos+mensajes+progreso+pagos</Badge>
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-1">Inspirado en Trainerize (#1 all-in-one) mejorado con MIT — 1 dashboard unificado por cliente, sin cambiar de pestaña</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={client.adherence >= 80 ? "success" : client.adherence >= 60 ? "warn" : "muted"} className="text-[11px]">
              {client.adherence}% adherencia
            </Badge>
            <span className="text-[11px] text-zinc-500 hidden sm:inline">{client.program}</span>
          </div>
        </div>

        {/* Client switcher */}
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
          {CLIENTS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left transition ${activeId === c.id ? "bg-[#D6FF2A] border-[#D6FF2A] text-black" : "bg-zinc-950 border-zinc-800 text-white hover:border-zinc-700"}`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${activeId === c.id ? "bg-black text-[#D6FF2A]" : "bg-white text-black"}`}>{c.avatar}</span>
              <span className="min-w-0">
                <span className={`block text-xs font-bold leading-none truncate ${activeId === c.id ? "text-black" : "text-white"}`}>{c.name}</span>
                <span className={`block text-[11px] leading-none mt-0.5 ${activeId === c.id ? "text-black/60" : "text-zinc-500"}`}>{c.plan} • {c.adherence}%</span>
              </span>
              {c.messages.unread > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />}
            </button>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Button size="sm" variant="accent" className="h-7 text-xs font-black"><Plus size={12} className="mr-1" /> Asignar entreno</Button>
          <Button size="sm" variant="outline" className="h-7 text-xs border-zinc-800"><MessageSquare size={12} className="mr-1" /> Mensaje</Button>
          <Button size="sm" variant="outline" className="h-7 text-xs border-zinc-800"><Calendar size={12} className="mr-1" /> Check-in</Button>
          <Button size="sm" variant="outline" className="h-7 text-xs border-zinc-800"><CreditCard size={12} className="mr-1" /> Cobro</Button>
          <span className="ml-auto text-[11px] text-zinc-600 flex items-center gap-1"><Users size={11} /> 4 clientes • $74k MRR</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* 6-domain grid */}
        <div className="grid md:grid-cols-3 gap-3">
          {/* Workouts */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase text-zinc-400"><Dumbbell size={13} className="text-[#D6FF2A]" /> Entrenos</span>
              <Badge variant="muted" className="text-[10px] border-zinc-800">MIT Lyftr</Badge>
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">{client.program}</p>
              <p className="text-xs text-zinc-500">{client.week}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5">
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Próximo</p>
              <p className="text-xs font-bold">{client.nextWorkout}</p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]"><span className="text-zinc-500">Adherencia</span><span className="font-bold">{client.adherence}%</span></div>
              <Progress value={client.adherence} className="h-1.5" />
            </div>
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" className="flex-1 h-7 text-xs border-zinc-800">Ver plan <ArrowUpRight size={11} className="ml-1" /></Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs">Editar</Button>
            </div>
          </div>

          {/* Nutrition */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase text-zinc-400"><Utensils size={13} className="text-emerald-400" /> Nutrición</span>
              <Badge variant="muted" className="text-[10px] border-zinc-800">MIT wger</Badge>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"><p className="text-[10px] text-zinc-500">KCAL</p><p className="font-black text-sm">{client.nutrition.kcal}</p></div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"><p className="text-[10px] text-zinc-500">P</p><p className="font-black text-sm">{client.nutrition.p}g</p></div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"><p className="text-[10px] text-zinc-500">C</p><p className="font-black text-sm">{client.nutrition.c}g</p></div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"><p className="text-[10px] text-zinc-500">G</p><p className="font-black text-sm">{client.nutrition.g}g</p></div>
            </div>
            <div className="flex items-center justify-between text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-2">
              <span className="text-zinc-500 flex items-center gap-1"><Clock size={12} /> {client.nutrition.meals}/4 comidas hoy</span>
              <span className="flex items-center gap-1 text-sky-400 font-bold"><Droplets size={12} />{client.nutrition.water}L</span>
            </div>
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" className="flex-1 h-7 text-xs border-zinc-800">Plan semanal</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs">Ajustar</Button>
            </div>
          </div>

          {/* Habits */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase text-zinc-400"><Flame size={13} className="text-orange-400" /> Hábitos</span>
              <span className="text-[11px] font-black flex items-center gap-1 text-orange-400"><Zap size={11} /> {client.habits.streak}d racha</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex items-center gap-2">
                <Droplets size={14} className="text-sky-400 shrink-0" />
                <div className="flex-1 min-w-0"><p className="text-[11px] text-zinc-500 leading-none">Agua</p><p className="text-xs font-bold">{client.habits.water}%</p><Progress value={client.habits.water} className="h-1 mt-1" /></div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex items-center gap-2">
                <Moon size={14} className="text-violet-400 shrink-0" />
                <div className="flex-1 min-w-0"><p className="text-[11px] text-zinc-500 leading-none">Sueño</p><p className="text-xs font-bold">{client.habits.sleep}h</p></div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex items-center gap-2">
                <Footprints size={14} className="text-emerald-400 shrink-0" />
                <div className="flex-1 min-w-0"><p className="text-[11px] text-zinc-500 leading-none">Pasos</p><p className="text-xs font-bold">{client.habits.steps.toLocaleString("es-AR")}</p></div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex items-center gap-2">
                <Beef size={14} className="text-amber-400 shrink-0" />
                <div className="flex-1 min-w-0"><p className="text-[11px] text-zinc-500 leading-none">Proteína</p><p className="text-xs font-bold">{client.habits.protein}%</p><Progress value={client.habits.protein} className="h-1 mt-1" /></div>
              </div>
            </div>
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" className="flex-1 h-7 text-xs border-zinc-800"><CheckCircle2 size={12} className="mr-1" /> Check-in</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs">Ver racha</Button>
            </div>
          </div>

          {/* Messaging */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase text-zinc-400"><MessageSquare size={13} className="text-sky-400" /> Mensajes</span>
              {client.messages.unread > 0 ? <Badge variant="warn" className="text-[10px]">{client.messages.unread} sin leer</Badge> : <Badge variant="muted" className="text-[10px] border-zinc-800">al día</Badge>}
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
              <p className="text-xs font-bold">“{client.messages.last}”</p>
              <p className="text-[11px] text-zinc-500 mt-1">{client.messages.lastAt} • {client.name}</p>
            </div>
            <div className="flex gap-1.5">
              <input
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder="Respuesta rápida..."
                className="flex-1 h-8 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D6FF2A]"
              />
              <Button size="sm" className="h-8 px-3 bg-[#D6FF2A] text-black hover:bg-[#c8f000] font-black text-xs" onClick={() => setQuickNote("")}><Send size={12} /></Button>
            </div>
            <Button size="sm" variant="outline" className="w-full h-7 text-xs border-zinc-800">Abrir chat →</Button>
          </div>

          {/* Progress */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase text-zinc-400"><TrendingUp size={13} className="text-emerald-400" /> Progreso</span>
              <Badge variant="muted" className="text-[10px] border-zinc-800">MIT FitTrackee</Badge>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-center"><p className="text-[10px] text-zinc-500">PESO</p><p className="font-black">{client.progress.weight}kg</p><p className="text-[11px] text-emerald-400">{client.progress.delta}</p></div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-center"><p className="text-[10px] text-zinc-500">VOL SEM</p><p className="font-black">{client.progress.volumeWeek}</p><p className="text-[11px] text-zinc-500">{client.progress.photos} fotos</p></div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex items-center gap-2">
              <Trophy size={14} className="text-amber-400 shrink-0" /><p className="text-xs font-bold flex-1 min-w-0 truncate">{client.progress.pr}</p><Badge variant="muted" className="text-[10px] border-zinc-700">PR</Badge>
            </div>
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" className="flex-1 h-7 text-xs border-zinc-800"><Camera size={12} className="mr-1" /> Fotos</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs">Gráficos</Button>
            </div>
          </div>

          {/* Payments */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase text-zinc-400"><CreditCard size={13} className="text-emerald-400" /> Pagos</span>
              <Badge variant={client.payment.status === "al día" ? "success" : client.payment.status === "vence pronto" ? "warn" : "muted"} className="text-[10px]">{client.payment.status}</Badge>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
              <div className="flex justify-between items-baseline"><span className="text-xs text-zinc-500">Plan</span><span className="font-black">{client.plan}</span></div>
              <div className="flex justify-between items-baseline mt-1"><span className="text-xs text-zinc-500">Próximo cobro</span><span className="text-xs font-bold">{client.payment.nextBilling} • {client.payment.amount}</span></div>
            </div>
            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden flex">
              <div className="bg-emerald-400 h-full" style={{ width: client.adherence >= 80 ? "100%" : "68%" }} />
            </div>
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" className="flex-1 h-7 text-xs border-zinc-800">Ver facturas</Button>
              <Button size="sm" className="h-7 text-xs bg-emerald-500 text-black hover:bg-emerald-400 font-bold">Cobrar</Button>
            </div>
          </div>
        </div>

        {/* Footer insight like Trainerize */}
        <div className="bg-gradient-to-r from-[#D6FF2A]/10 via-zinc-950 to-zinc-950 border border-[#D6FF2A]/20 rounded-xl p-3 flex flex-wrap items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D6FF2A] text-black flex items-center justify-center shrink-0"><Zap size={14} /></div>
          <div className="flex-1 min-w-[200px]">
            <p className="text-xs font-black">Trainerize All-in-One — todo en 1 vista</p>
            <p className="text-[11px] text-zinc-500 leading-snug">Entrenos + nutrición + hábitos + mensajes + progreso + pagos sin salir del dashboard. Cambiá de cliente arriba y gestioná sin pestañas. Mejor que Trainerize: 100% local, sin comisión, con auto-progresión y pagos MP/Stripe.</p>
          </div>
          <Badge variant="muted" className="border-zinc-700 text-zinc-500 text-[10px]">Trainerize #1 — ABC Trainerize MIT + Lyftr/Simple/Strive</Badge>
        </div>

        <p className="text-[11px] text-zinc-600 text-center">Trainerize All-in-One MIT 76 — 6 dominios unificados con switcher + quick actions — atribución docs/MIT_ATTRIBUTION.md #76</p>
      </CardContent>
    </Card>
  );
}
