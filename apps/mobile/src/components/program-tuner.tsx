"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, TrendingUp, RefreshCw } from "lucide-react";

// Inspirado en OptiLifts + Jacked GPT + VitaFlex MIT — auto-tuner de programa
export function ProgramTuner(){
  const [applied,setApplied]=useState(false);
  return (
    <Card className="border-primary/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Wrench size={16} className="text-primary"/> Auto-Tuner Programa</CardTitle><p className="text-xs text-zinc-500">IA revisa check-ins + RIR + volumen y propone cambios a tu programa</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-2">
          <p className="font-bold text-sm">Propuesta para Lucas — Hipertrofia 12 Semanas</p>
          <div className="space-y-1 text-xs">
            <p className="flex justify-between"><span>Press Banca 4×8 RIR2</span><span className="text-amber-400">→ 5×5 RIR1 (+fuerza)</span></p>
            <p className="flex justify-between"><span>Sentadilla 4×10</span><span className="text-emerald-400">→ 4×8 +2.5kg</span></p>
            <p className="flex justify-between"><span>Descanso 90s</span><span className="text-zinc-500">→ 120s (fatiga)</span></p>
          </div>
          <p className="text-[11px] text-zinc-500">Basado en: RIR 0.8 + check-in “molestia rodilla” + 78% adherencia</p>
        </div>
        <Button variant="accent" className="w-full" onClick={()=>setApplied(true)} disabled={applied}>{applied?"Aplicado":"Aplicar cambios al programa →"}</Button>
        {applied && <p className="text-xs text-center text-emerald-400">Programa actualizado. Lucas verá los cambios en su app.</p>}
      </CardContent>
    </Card>
  );
}
