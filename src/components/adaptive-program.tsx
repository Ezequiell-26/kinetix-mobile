"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, RefreshCw } from "lucide-react";

// Inspirado en Jacked GPT + Adaptive Training MIT
// Genera la próxima semana automáticamente basado en RIR + adherencia + volumen
export function AdaptiveProgram({ lastWeek, onApply }:{ lastWeek: {exercise:string; weight:number; reps:number; rir:number|null}[]; onApply?: (next: typeof lastWeek)=>void }){
  const nextWeek = lastWeek.map(l=>{
    const rir=l.rir??2;
    let nextW=l.weight;
    let note="Mantener";
    if(rir >=3 && l.reps >=10){ nextW=Math.round(l.weight*1.025*2)/2; note="+2.5% (RIR alto)"; }
    else if(rir <=0){ nextW=Math.round(l.weight*0.9); note="-10% deload"; }
    else if(rir >=1.5 && rir <=2.5){ note="Busca +1 rep"; }
    return {...l, weight:nextW, note};
  });

  if(!lastWeek.length) return (
    <Card className="border-dashed"><CardContent className="py-6 text-center text-xs text-zinc-500">Completá una semana para generar la próxima adaptativa.</CardContent></Card>
  );

  return (
    <Card className="border-[#D6FF2A]/20 bg-gradient-to-br from-[#D6FF2A]/5 via-zinc-900 to-zinc-900">
      <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles size={16} className="text-[#D6FF2A]"/> Próxima Semana Adaptativa <Badge variant="accent">Jacked GPT MIT</Badge></CardTitle><p className="text-xs text-zinc-500">Auto-ajusta cargas según RIR de la semana pasada</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2">
          {nextWeek.slice(0,5).map((n,i)=>(
            <div key={i} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-3">
              <div>
                <p className="font-bold text-sm">{n.exercise}</p>
                <p className="text-xs text-zinc-500">{lastWeek[i].weight}kg × {n.reps} (RIR {n.rir}) → <span className="text-[#D6FF2A] font-bold">{n.weight}kg</span> • {n.note}</p>
              </div>
              <ArrowRight size={14} className="text-zinc-500"/>
            </div>
          ))}
        </div>
        <Button variant="accent" className="w-full" onClick={()=>onApply?.(nextWeek)}><RefreshCw size={14} className="mr-2"/> Aplicar a la próxima semana</Button>
        <p className="text-[11px] text-zinc-600 text-center">Jacked GPT Adaptive MIT — progresión inteligente local</p>
      </CardContent>
    </Card>
  );
}
