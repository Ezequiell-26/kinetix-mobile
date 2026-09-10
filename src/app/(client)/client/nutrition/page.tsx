"use client";
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
import { TimersHub } from "@/components/timers-hub";
import { AiMealPlanner } from "@/components/ai-meal-planner";
import { OpenHiitPro } from "@/components/openhiit-pro";
import { HiitTimer } from "@/components/hiit-timer";
import { Tabs } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NutritionPage(){
  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-display font-bold">Nutrición VIP</h1>
          <p className="text-sm text-zinc-500">Tabs limpios — todo organizado, nada de scroll infinito</p>
        </div>
        <Badge variant="accent">VIP</Badge>
      </div>

      <a href="/client/timers" className="block">
        <div className="bg-gradient-to-br from-[#D6FF2A]/10 via-zinc-900 to-zinc-900 border border-[#D6FF2A]/20 rounded-2xl p-4 flex items-center gap-3 hover:border-[#D6FF2A]/30 transition">
          <div className="w-10 h-10 rounded-xl bg-[#D6FF2A] flex items-center justify-center text-black">⏱️</div>
          <div className="flex-1"><p className="font-bold text-sm">Cronómetros PRO →</p><p className="text-xs text-zinc-400">Tabata, EMOM, Pomodoro — página dedicada</p></div>
          <span className="text-xs bg-[#D6FF2A] text-black px-2 py-1 rounded-full font-bold">PRO</span>
        </div>
      </a>

      <Card className="bg-gradient-to-br from-[#D6FF2A]/10 via-[#111111] to-[#111111] border-[#D6FF2A]/20">
        <CardContent className="pt-4 flex gap-3 items-center">
          <div className="w-10 h-10 rounded-xl bg-[#D6FF2A] flex items-center justify-center font-black text-black">E</div>
          <div className="flex-1">
            <p className="text-sm font-bold">Plan de Ezequiel</p>
            <p className="text-xs text-zinc-400">Tus macros están ajustados a tu objetivo. Revisión semanal.</p>
          </div>
          <Link href="/client/messages"><Button variant="outline" size="sm">Consultar</Button></Link>
        </CardContent>
      </Card>

      <Tabs
        tabs={[
          {id:"calc", label:"Calculadoras"},
          {id:"alimentos", label:"Alimentos"},
          {id:"habitos", label:"Hábitos"},
          {id:"timers", label:"Timers", badge:"PRO"},
        ]}
        defaultId="calc"
      >
        {(active)=> (
          <>
            {active==="calc" && (
              <div className="space-y-4">
                <CalorieCalculator />
                <CalculatorsHub />
                <OneRMCalculator />
                <NutritionPro />
              </div>
            )}
            {active==="alimentos" && (
              <div className="space-y-4">
                <FoodDatabase onAdd={(f)=>console.log("food added", f)} />
                <OpenFoodFactsPro />
                <BarcodeScanner onFood={(f)=>console.log("food", f)} />
                <MealieKitchen />
                <AiMealPlanner />
              </div>
            )}
            {active==="habitos" && (
              <div className="space-y-4">
                <SparkyHabits />
              </div>
            )}
            {active==="timers" && (
              <div className="space-y-4">
                <TimersHub />
                <OpenHiitPro />
                <HiitTimer />
              </div>
            )}
          </>
        )}
      </Tabs>
      <p className="text-[11px] text-zinc-600 text-center">Super clean — 4 tabs, sin scroll infinito • 45 MIT organizados</p>
    </div>
  );
}
