"use client";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";

type LiftLog = { exercise:string; weight:number; reps:number; rir:number|null; date:string };

// Inspirado en OptiLifts MIT — https://github.com/topics/optilifts
// Optimización automática de progresión: +2.5% si RIR alto, deload si fatiga, mantener si en rango
export function OptiLiftsProgression({ logs, onApply }:{ logs: LiftLog[]; onApply?: (suggestion:{exercise:string; newLoad:string})=>void }){
  const suggestions = useMemo(()=>{
    const byEx = new Map<string, LiftLog[]>();
    for(const l of logs) {
      if(!byEx.has(l.exercise)) byEx.set(l.exercise, []);
      byEx.get(l.exercise)!.push(l);
    }
    const out: Array<{exercise:string; trend:"up"|"down"|"hold"; title:string; desc:string; newLoad:string; color:string}> = [];
    for(const [ex, arr] of byEx){
      arr.sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime());
      const last = arr[arr.length-1];
      const avgRir = arr.slice(-3).reduce((acc,c)=>acc+(c.rir??2),0) / Math.min(3, arr.length);
      const avgReps = arr.slice(-3).reduce((acc,c)=>acc+(c.reps||8),0) / Math.min(3, arr.length);
      if(avgRir >= 3 && avgReps >= 10){
        const newW = Math.round(last.weight * 1.025 * 2)/2; // +2.5% redondeado a 0.5kg
        out.push({exercise:ex, trend:"up", title:"Subir carga", desc:`RIR ${avgRir.toFixed(1)} + ${avgReps.toFixed(0)} reps → listo para +2.5%`, newLoad:`${newW}kg`, color:"emerald"});
      } else if(avgRir <= 0.5 && avgReps < 6){
        out.push({exercise:ex, trend:"down", title:"Deload sugerido", desc:`RIR ${avgRir.toFixed(1)} indica fatiga alta. Baja 10% 1 semana.`, newLoad:`${Math.round(last.weight*0.9)}kg`, color:"amber"});
      } else if(avgRir >=1.5 && avgRir <=2.5){
        out.push({exercise:ex, trend:"hold", title:"Mantener", desc:`RIR ${avgRir.toFixed(1)} perfecto. Busca +1 rep antes de subir.`, newLoad:`${last.weight}kg`, color:"zinc"});
      }
    }
    return out.slice(0,5);
  },[logs]);

  if(suggestions.length===0) return (
    <Card className="border-dashed"><CardContent className="py-8 text-center text-zinc-500 text-sm">Completá 3 sesiones para ver sugerencias OptiLifts.</CardContent></Card>
  );

  return (
    <Card className="border-[#D6FF2A]/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Zap size={18} className="text-[#D6FF2A]"/> Progresión Inteligente <Badge variant="accent">OptiLifts MIT</Badge></CardTitle><p className="text-xs text-zinc-500">IA rule-based: RIR + reps → +2.5% / deload / mantener</p></CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map(s=>(
          <div key={s.exercise} className={`flex items-center justify-between p-3 rounded-xl border ${s.trend==="up"?"bg-emerald-500/10 border-emerald-500/20": s.trend==="down"?"bg-amber-500/10 border-amber-500/20":"bg-zinc-900 border-zinc-800"}`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.trend==="up"?"bg-emerald-500 text-white": s.trend==="down"?"bg-amber-500 text-white":"bg-zinc-800 text-zinc-400"}`}>
                {s.trend==="up"?<TrendingUp size={16}/>: s.trend==="down"?<TrendingDown size={16}/>:<Minus size={16}/>}
              </div>
              <div>
                <p className="font-bold text-sm">{s.exercise}</p>
                <p className="text-xs text-zinc-400">{s.desc}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-black ${s.trend==="up"?"text-emerald-400": s.trend==="down"?"text-amber-400":"text-white"}`}>{s.newLoad}</p>
              <Button size="sm" variant={s.trend==="up"?"accent":"outline"} className="h-7 text-xs mt-1" onClick={()=>onApply?.(s)}>{s.trend==="up"?"Aplicar": s.trend==="down"?"Deload":"OK"}</Button>
            </div>
          </div>
        ))}
        <p className="text-[11px] text-zinc-600 text-center">OptiLifts MIT — no es consejo médico. Inspirado en <a href="https://github.com/topics/optilifts" target="_blank" className="underline">OptiLifts</a></p>
      </CardContent>
    </Card>
  );
}
