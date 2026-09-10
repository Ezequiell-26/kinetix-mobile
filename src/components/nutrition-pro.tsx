"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Apple, Droplets, Beef, Wheat } from "lucide-react";

// Inspirado en Cronometer + wger nutrition + FitBook MIT
// Nutrition pro: fibra, sodio, potasio, vitaminas, timing
export function NutritionPro(){
  return (
    <Card className="border-emerald-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Apple size={16} className="text-emerald-400"/> Nutrición Pro <Badge variant="muted">Cronometer MIT</Badge></CardTitle><p className="text-xs text-zinc-500">Micros, fibra, timing — más allá de macros</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center"><Wheat size={14} className="mx-auto text-amber-400"/><p className="font-black">28g</p><p className="text-[11px] text-zinc-500">Fibra / 25g obj</p><div className="h-1 bg-zinc-800 rounded-full overflow-hidden mt-1"><div className="h-full bg-amber-400" style={{width:"112%"}} /></div></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center"><Droplets size={14} className="mx-auto text-sky-400"/><p className="font-black">2.1g</p><p className="text-[11px] text-zinc-500">Sodio / 2.3g</p><div className="h-1 bg-zinc-800 rounded-full overflow-hidden mt-1"><div className="h-full bg-sky-400" style={{width:"91%"}} /></div></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center"><Beef size={14} className="mx-auto text-red-400"/><p className="font-black">3.2g</p><p className="text-[11px] text-zinc-500">Potasio / 3.5g</p><div className="h-1 bg-zinc-800 rounded-full overflow-hidden mt-1"><div className="h-full bg-red-400" style={{width:"91%"}} /></div></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center"><Apple size={14} className="mx-auto text-emerald-400"/><p className="font-black">85mg</p><p className="text-[11px] text-zinc-500">Vit C / 90mg</p><div className="h-1 bg-zinc-800 rounded-full overflow-hidden mt-1"><div className="h-full bg-emerald-400" style={{width:"94%"}} /></div></div>
        </div>
        <div className="bg-zinc-800 rounded-xl p-2 text-xs">
          <p className="font-bold">Timing hoy:</p>
          <p className="text-zinc-400">Desayuno 07:30 (25%) • Almuerzo 13:00 (35%) • Merienda 17:00 (15%) • Cena 20:30 (25%)</p>
        </div>
        <p className="text-[11px] text-zinc-600 text-center">Cronometer + wger MIT — micros + timing, no solo macros</p>
      </CardContent>
    </Card>
  );
}
