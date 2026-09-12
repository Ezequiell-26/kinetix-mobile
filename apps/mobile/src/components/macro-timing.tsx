"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { Sunrise, Sun, Apple, Moon, Zap, Dumbbell, Clock, Utensils, Target } from "lucide-react";

// Inspirado en wger (MIT datasets + nutrition logic) + Cronometer MIT
// wger: https://github.com/wger-project/wger — nutrition plans con distribución por comida
// Cronometer: timing de macros por ventana horaria — adaptado a 4-5 comidas con % distribución
// No copia AGPL de wger servidor — solo lógica pública de distribución de macros por comida y timing

type Meal = { id: string; label: string; time: string; pct: number; icon: keyof typeof MEAL_ICONS };

const MEAL_ICONS = {
  sunrise: Sunrise, sun: Sun, apple: Apple, moon: Moon, zap: Zap, dumbbell: Dumbbell,
} as const;

const PRESETS: Record<string, { meals: Meal[]; tip: string }> = {
  "4comidas": {
    meals: [
      { id: "des", label: "Desayuno", time: "07:30", pct: 25, icon: "sunrise" },
      { id: "alm", label: "Almuerzo", time: "13:00", pct: 35, icon: "sun" },
      { id: "mer", label: "Merienda", time: "17:00", pct: 15, icon: "apple" },
      { id: "cen", label: "Cena", time: "20:30", pct: 25, icon: "moon" },
    ],
    tip: "Clásico 4 comidas — ideal mantenimiento. Proteína distribuida 25-35g por comida.",
  },
  "5peri": {
    meals: [
      { id: "des", label: "Desayuno", time: "07:30", pct: 20, icon: "sunrise" },
      { id: "alm", label: "Almuerzo", time: "13:00", pct: 30, icon: "sun" },
      { id: "pre", label: "Pre-entreno", time: "16:30", pct: 15, icon: "zap" },
      { id: "post", label: "Post-entreno", time: "19:00", pct: 15, icon: "dumbbell" },
      { id: "cen", label: "Cena", time: "21:00", pct: 20, icon: "moon" },
    ],
    tip: "Peri-entreno — 30% carbs alrededor del entreno..",
  },
  "3comidas": {
    meals: [
      { id: "des", label: "Desayuno", time: "08:00", pct: 30, icon: "sunrise" },
      { id: "alm", label: "Almuerzo", time: "13:30", pct: 40, icon: "sun" },
      { id: "cen", label: "Cena", time: "20:00", pct: 30, icon: "moon" },
    ],
    tip: "3 comidas — intermitentefriendly. Proteína 40g+ por comida para síntesis.",
  },
};

export function MacroTiming() {
  const [kcal, setKcal] = useState(2400);
  const [protein, setProtein] = useState(170);
  const [carbs, setCarbs] = useState(280);
  const [fat, setFat] = useState(70);
  const [preset, setPreset] = useState<keyof typeof PRESETS>("4comidas");
  const [goal, setGoal] = useState<"volumen" | "definicion" | "mantenimiento">("mantenimiento");

  const meals = PRESETS[preset].meals;
  const tip = PRESETS[preset].tip;

  const goalTip = useMemo(() => {
    if (goal === "volumen") return "Volumen: +15% carbs peri-entreno, proteína 1.8-2.2g/kg distribuida.";
    if (goal === "definicion") return "Definición: proteína 2.2-2.6g/kg, grasa no <0.8g/kg, carbs en almuerzo.";
    return "Mantenimiento: equilibrio 30P/45C/25F, timing flexible.";
  }, [goal]);

  // wger-style: distribuir macros proporcional al % de kcal por comida
  const perMeal = useMemo(() => {
    return meals.map((m) => {
      const mkcal = Math.round(kcal * (m.pct / 100));
      const mp = Math.round(protein * (m.pct / 100));
      // Ajuste volumen: más carbs peri-entreno
      const isPeri = m.id === "pre" || m.id === "post";
      const carbPct = goal === "volumen" && isPeri ? m.pct * 1.2 : m.pct;
      // normalizar carbs para que sumen ~100% (simple: si volumen peri, compensar)
      const mc = Math.round(carbs * (carbPct / 100) * (goal === "volumen" && preset === "5peri" ? 0.93 : 1));
      const mf = Math.round(fat * (m.pct / 100));
      return { ...m, mkcal, mp, mc, mf };
    });
  }, [meals, kcal, protein, carbs, fat, goal, preset]);

  const totalPct = meals.reduce((a, b) => a + b.pct, 0);

  return (
    <Card className="border-amber-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock size={16} className="text-amber-400" /> Timing de Macros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Objetivo + preset */}
        <div className="flex gap-1.5 flex-wrap">
          {(["mantenimiento", "volumen", "definicion"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGoal(g)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border capitalize ${goal === g ? "bg-primary text-black border-primary" : "bg-zinc-900 text-zinc-400 border-zinc-800"}`}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {Object.keys(PRESETS).map((k) => (
            <button
              key={k}
              onClick={() => setPreset(k as keyof typeof PRESETS)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${preset === k ? "bg-white text-black border-white" : "bg-zinc-900 text-zinc-400 border-zinc-800"}`}
            >
              {k === "4comidas" ? "4 comidas" : k === "5peri" ? "5 peri-entreno" : "3 comidas"}
            </button>
          ))}
        </div>

        {/* Inputs macros */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <Label className="text-xs">Kcal</Label>
            <Input type="number" value={kcal} onChange={(e) => setKcal(Number(e.target.value) || 0)} />
          </div>
          <div>
            <Label className="text-xs flex items-center gap-1">P <span className="text-[10px] text-zinc-500">g</span></Label>
            <Input type="number" value={protein} onChange={(e) => setProtein(Number(e.target.value) || 0)} />
          </div>
          <div>
            <Label className="text-xs flex items-center gap-1">C <span className="text-[10px] text-zinc-500">g</span></Label>
            <Input type="number" value={carbs} onChange={(e) => setCarbs(Number(e.target.value) || 0)} />
          </div>
          <div>
            <Label className="text-xs flex items-center gap-1">G <span className="text-[10px] text-zinc-500">g</span></Label>
            <Input type="number" value={fat} onChange={(e) => setFat(Number(e.target.value) || 0)} />
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          {perMeal.map((m) => (
            <div key={m.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex gap-3 items-center">
              <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm shrink-0">
                {(() => { const I = MEAL_ICONS[m.icon]; return <I size={20} className="text-primary" />; })()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm">{m.label}</p>
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                    <Clock size={10} /> {m.time}
                  </span>
                  <Badge variant="muted" className="text-[10px] px-1.5 py-0">
                    {m.pct}%
                  </Badge>
                </div>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    {m.mp}P
                  </span>
                  <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                    {m.mc}C
                  </span>
                  <span className="text-xs bg-sky-500/10 border border-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full font-bold">
                    {m.mf}G
                  </span>
                  <span className="text-xs text-zinc-500 font-bold self-center">{m.mkcal} kcal</span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-primary" style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 space-y-1">
          <p className="text-xs font-bold flex items-center gap-1.5 text-amber-300">
            <Target size={12} /> {tip}
          </p>
          <p className="text-xs text-amber-200/70">{goalTip}</p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-zinc-600">
          <Utensils size={12} /> <span>Tip: la fibra y los micros se trackean por comida, no solo por día.</span>
        </div>

      </CardContent>
    </Card>
  );
}
