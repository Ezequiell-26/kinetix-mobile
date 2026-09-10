"use client";
import { CalorieCalculator, OneRMCalculator } from "@/components/calorie-calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarcodeScanner } from "@/components/barcode-scanner";
import { FoodDatabase } from "@/components/food-database";
import { SparkyHabits } from "@/components/sparky-habits";
import { CalculatorsHub } from "@/components/calculators-hub";
import { TimersHub } from "@/components/timers-hub";
import { AiMealPlanner } from "@/components/ai-meal-planner";
import { OpenHiitPro } from "@/components/openhiit-pro";
import { HiitTimer } from "@/components/hiit-timer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NutritionPage(){
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-display font-bold">Nutrición VIP</h1>
          <p className="text-sm text-zinc-500">Calculadoras premium • todo lo que necesitás en una app</p>
        </div>
        <Badge variant="accent">VIP</Badge>
      </div>

      <a href="/client/timers" className="block">
        <div className="bg-gradient-to-br from-[#D6FF2A]/10 via-zinc-900 to-zinc-900 border border-[#D6FF2A]/20 rounded-2xl p-4 flex items-center gap-3 hover:border-[#D6FF2A]/30 transition">
          <div className="w-10 h-10 rounded-xl bg-[#D6FF2A] flex items-center justify-center text-black">⏱️</div>
          <div className="flex-1"><p className="font-bold text-sm">Cronómetros PRO →</p><p className="text-xs text-zinc-400">Tabata, EMOM, Pomodoro, Descanso — todo en un lugar</p></div>
          <span className="text-xs bg-[#D6FF2A] text-black px-2 py-1 rounded-full font-bold">PRO</span>
        </div>
      </a>
      <div className="grid gap-3">
        <Card className="bg-gradient-to-br from-[#D6FF2A]/10 via-[#111111] to-[#111111] border-[#D6FF2A]/20">
          <CardContent className="pt-4 flex gap-3 items-center">
            <div className="w-10 h-10 rounded-xl bg-[#D6FF2A] flex items-center justify-center font-black text-black">E</div>
            <div className="flex-1">
              <p className="text-sm font-bold">Plan de Ezequiel</p>
              <p className="text-xs text-zinc-400">Tus macros están ajustados a tu objetivo: perder grasa manteniendo músculo. Revisión semanal.</p>
            </div>
            <Link href="/client/messages"><Button variant="outline" size="sm">Consultar</Button></Link>
          </CardContent>
        </Card>
      </div>

      <CalorieCalculator />
      <FoodDatabase onAdd={(f)=>console.log("food added", f)} />
      <BarcodeScanner onFood={(f)=>console.log("food", f)} />
      <OneRMCalculator />
      <SparkyHabits />
      <CalculatorsHub />
      <AiMealPlanner />
      <TimersHub />
      <OpenHiitPro />
      <HiitTimer />

      <Card>
        <CardHeader><CardTitle>Hábitos VIP</CardTitle><p className="text-xs text-zinc-500">Check diario — racha y adherencia</p></CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {[
            {label:"Agua", value:"2.1/3.0 L", prog:70},
            {label:"Pasos", value:"8.420 / 10k", prog:84},
            {label:"Sueño", value:"7.2h", prog:90},
            {label:"Proteína", value:"142/172g", prog:82},
          ].map(h=>(
            <div key={h.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
              <p className="text-xs text-zinc-500">{h.label}</p>
              <p className="text-sm font-bold mt-1">{h.value}</p>
              <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-[#D6FF2A]" style={{width:`${h.prog}%`}} /></div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recordatorios</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <label className="flex gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800"><input type="checkbox" defaultChecked /> <span>Pesar comida (foto) — diario 20:00</span></label>
          <label className="flex gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800"><input type="checkbox" /> <span>Beber agua — cada 2h</span></label>
          <label className="flex gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800"><input type="checkbox" defaultChecked /> <span>Check-in domingo</span></label>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-zinc-500">VIP: todo integrado — entrenamiento + nutrición + hábitos + progreso en una app prolija, minimalista y blanca/negra. MIT FitBook + HIIT Timer.</p>
    </div>
  );
}
