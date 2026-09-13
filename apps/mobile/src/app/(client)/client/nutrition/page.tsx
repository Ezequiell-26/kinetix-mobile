"use client";
import { useState, useEffect } from "react";
import { CalorieCalculator, OneRMCalculator } from "@/components/calorie-calculator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarcodeScanner } from "@/components/barcode-scanner";
import { FoodDatabase } from "@/components/food-database";
import { SparkyHabits } from "@/components/sparky-habits";
import { CalculatorsHub } from "@/components/calculators-hub";
import { OpenFoodFactsPro } from "@/components/openfoodfacts-pro";
import { MealieKitchen } from "@/components/mealie-kitchen";
import { NutritionPro } from "@/components/nutrition-pro";
import { AiMealPlanner } from "@/components/ai-meal-planner";
import { MacroTiming } from "@/components/macro-timing";
import { Tabs } from "@/components/ui/tabs";
import { CollapsibleSection } from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Timer, Calculator, Search } from "lucide-react";
import { Tilt3D } from "@/components/tilt-3d";

export default function NutritionPage(){
  type DayFood = { name: string; kcal: number; p: number; c: number; f: number };
  const dayKey = `ec-food-day-${new Date().toISOString().slice(0, 10)}`;
  const [today, setToday] = useState<DayFood[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(dayKey);
      if (raw) setToday(JSON.parse(raw) as DayFood[]);
    } catch {
      // JSON corrupto (ej. escritura interrumpida): se arranca el día vacío.
      // No hay acción de red que reintentar, por eso no hay banner de error.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function persist(list: DayFood[]) {
    setToday(list);
    try {
      localStorage.setItem(dayKey, JSON.stringify(list));
    } catch {
      // Cuota llena o modo privado: el día vive solo en memoria esta sesión.
    }
  }
  function addFood(f: { name: string; kcal?: number; calories?: number; p?: number; protein?: number; c?: number; carbs?: number; f?: number; fat?: number }) {
    persist([...today, {
      name: f.name,
      kcal: Math.round(f.kcal ?? f.calories ?? 0),
      p: Math.round((f.p ?? f.protein ?? 0) * 10) / 10,
      c: Math.round((f.c ?? f.carbs ?? 0) * 10) / 10,
      f: Math.round((f.f ?? f.fat ?? 0) * 10) / 10,
    }]);
  }
  const totals = today.reduce(
    (a, f) => ({ kcal: a.kcal + f.kcal, p: a.p + f.p, c: a.c + f.c, f: a.f + f.f }),
    { kcal: 0, p: 0, c: 0, f: 0 }
  );
  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-display font-bold">Nutrición VIP</h1>
          <p className="text-sm text-zinc-500">Tu plan, calculadoras y hábitos — todo organizado</p>
        </div>
        <Badge variant="accent">VIP</Badge>
      </div>

      <Tilt3D max={4} scale={1.01} radiusClass="rounded-2xl">
      <a href="/client/timers" className="block">
        <div className="bg-gradient-to-br from-primary/10 via-zinc-900 to-zinc-900 border border-primary/20 rounded-2xl p-4 flex items-center gap-3 hover:border-primary/30 hover:shadow-[0_8px_28px_rgba(52,211,153,0.12)] transition-all">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-black shadow-[0_4px_14px_rgba(52,211,153,0.3)]"><Timer size={18} /></div>
          <div className="flex-1"><p className="font-bold text-sm">Cronómetros PRO →</p><p className="text-xs text-zinc-400">Tabata, EMOM, Pomodoro — página dedicada</p></div>
          <span className="text-xs bg-primary text-black px-2 py-1 rounded-full font-bold">PRO</span>
        </div>
      </a>
      </Tilt3D>

      <Tilt3D max={3} scale={1.008} radiusClass="rounded-2xl">
      <Card className="bg-gradient-to-br from-primary/10 via-[#111111] to-[#111111] border-primary/20 shadow-[0_12px_36px_rgba(0,0,0,0.3)]">
        <CardContent className="pt-4 flex gap-3 items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center font-black text-black shadow-[0_4px_14px_rgba(52,211,153,0.3)]">E</div>
          <div className="flex-1">
            <p className="text-sm font-bold">Plan de Ezequiel</p>
            <p className="text-xs text-zinc-400">Tus macros están ajustados a tu objetivo. Revisión semanal.</p>
          </div>
          <Link href="/client/messages"><Button variant="outline" size="sm">Consultar</Button></Link>
        </CardContent>
      </Card>
      </Tilt3D>

      <Tabs
        tabs={[
          {id:"calc", label:"Calculadoras"},
          {id:"alimentos", label:"Alimentos"},
          {id:"habitos", label:"Hábitos"},
        ]}
        defaultId="calc"
      >
        {(active)=> (
          <>
            {active==="calc" && (
              <div className="space-y-4">
                {/* Bloque dominante: TDEE + macros. Es la acción principal. */}
                <CalorieCalculator />
                {/* Resto plegado: progressive disclosure, sin competir con el principal. */}
                <CollapsibleSection
                  title="Más calculadoras y herramientas"
                  subtitle="1RM, timing de macros, nutrición avanzada"
                  icon={<Calculator size={18} />}
                >
                  <OneRMCalculator />
                  <MacroTiming />
                  <NutritionPro />
                  <CalculatorsHub />
                </CollapsibleSection>
              </div>
            )}
            {active==="alimentos" && (
              <div className="space-y-4">
                <Card className="border-primary/25 bg-primary/[0.05] shadow-[0_8px_28px_rgba(0,0,0,0.25)]">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-white">Mi día</p>
                      <p className="text-xs font-black text-primary tabular-nums">{totals.kcal} kcal</p>
                    </div>
                    {today.length === 0 ? (
                      <p className="text-xs text-zinc-500">Agregá alimentos de la base o del escáner y se suman acá.</p>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          {today.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2">
                              <span className="flex-1 min-w-0 truncate font-semibold text-zinc-200">{f.name}</span>
                              <span className="text-zinc-500 tabular-nums shrink-0">{f.kcal} kcal</span>
                              <button
                                onClick={() => persist(today.filter((_, j) => j !== i))}
                                aria-label={`Quitar ${f.name}`}
                                className="text-zinc-600 hover:text-white text-sm leading-none px-1 min-h-[32px]"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-zinc-500 tabular-nums">
                          P {Math.round(totals.p)}g · C {Math.round(totals.c)}g · F {Math.round(totals.f)}g
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <FoodDatabase onAdd={addFood} />
                <CollapsibleSection
                  title="Buscadores y bases de datos"
                  subtitle="OpenFoodFacts, código de barras, recetas, plan con IA"
                  icon={<Search size={18} />}
                >
                  <OpenFoodFactsPro />
                  <BarcodeScanner onFood={addFood} />
                  <MealieKitchen />
                  <AiMealPlanner />
                </CollapsibleSection>
              </div>
            )}
            {active==="habitos" && (
              <div className="space-y-4">
                <SparkyHabits />
              </div>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
