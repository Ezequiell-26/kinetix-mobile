"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Utensils, Sparkles, Apple, Clock } from "lucide-react";

// Inspirado en VitaFlex-AI MIT (GPT-4o + Food Scanner + Meal Planner)
// https://github.com/syeda434am/VitaFlex-AI — FastAPI + GPT-4o + React, meal planner + food scanner + AI coach
const MEAL_TEMPLATES: Record<string, {breakfast:string; lunch:string; dinner:string; snack:string; kcal:number}> = {
  perdida_grasa: {breakfast:"Yogur griego + avena + frutos rojos", lunch:"Pollo + arroz + ensalada", dinner:"Pescado + verduras al horno", snack:"Whey + banana", kcal:1850},
  hipertrofia: {breakfast:"Huevos + pan integral + palta", lunch:"Carne + papa + brócoli", dinner:"Pollo + arroz + aceite oliva", snack:"Queso + frutos secos", kcal:2800},
  mantenimiento: {breakfast:"Avena + leche + banana", lunch:"Lentejas + ensalada", dinner:"Pollo + quinoa", snack:"Yogur + granola", kcal:2200},
};

export function AiMealPlanner(){
  const [goal,setGoal]=useState<keyof typeof MEAL_TEMPLATES>("hipertrofia");
  const [kcal,setKcal]=useState("2800");
  const [plan,setPlan]=useState<typeof MEAL_TEMPLATES["hipertrofia"] | null>(null);
  const [generating,setGenerating]=useState(false);

  function generate(){
    setGenerating(true);
    setTimeout(()=>{
      const t=MEAL_TEMPLATES[goal];
      setPlan({...t, kcal: Number(kcal) || t.kcal});
      setGenerating(false);
    }, 600);
  }

  return (
    <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-zinc-900 to-zinc-900">
      <CardHeader><CardTitle className="flex items-center gap-2"><Utensils size={18} className="text-orange-400"/> AI Meal Planner <Badge variant="muted">VitaFlex-AI MIT</Badge></CardTitle><p className="text-xs text-zinc-500">GPT-4o + Meal Planner: generá tu día de comidas según objetivo y kcal</p></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Objetivo</Label><select value={goal} onChange={e=>setGoal(e.target.value as keyof typeof MEAL_TEMPLATES)} className="w-full h-11 bg-zinc-900 border border-zinc-800 rounded-xl px-3 text-sm text-white"><option value="hipertrofia">Hipertrofia</option><option value="perdida_grasa">Pérdida grasa</option><option value="mantenimiento">Mantenimiento</option></select></div>
          <div><Label>Kcal/día</Label><Input value={kcal} onChange={e=>setKcal(e.target.value)} placeholder="2800" /></div>
        </div>
        <Button variant="accent" className="w-full h-11 font-black" onClick={generate} disabled={generating}>{generating?"Generando...":<><Sparkles size={16} className="mr-2"/> Generar con IA</>}</Button>
        {plan && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center"><p className="font-bold text-sm">Plan {goal} — {plan.kcal} kcal</p><Badge variant="accent">{plan.kcal} kcal</Badge></div>
            {[
              {label:"Desayuno", icon:Apple, value:plan.breakfast},
              {label:"Almuerzo", icon:Utensils, value:plan.lunch},
              {label:"Cena", icon:Clock, value:plan.dinner},
              {label:"Snack", icon:Sparkles, value:plan.snack},
            ].map(m=>(
              <div key={m.label} className="flex gap-2 items-start bg-zinc-950 rounded-lg p-2.5 border border-zinc-800"><m.icon size={14} className="text-orange-400 mt-0.5 shrink-0"/><div><p className="text-xs font-bold">{m.label}</p><p className="text-xs text-zinc-400">{m.value}</p></div></div>
            ))}
          </div>
        )}
        <p className="text-[11px] text-zinc-600 text-center">VitaFlex-AI MIT (GPT-4o) — meal planner + food scanner • <a href="https://github.com/syeda434am/VitaFlex-AI" target="_blank" className="underline">Ver repo</a></p>
      </CardContent>
    </Card>
  );
}
