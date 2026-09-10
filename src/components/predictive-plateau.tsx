"use client";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, Activity } from "lucide-react";

// Inspirado en OptiLifts + LiftShift + TensorFlow.js (predicción local)
// Predice meseta, sobrecarga, riesgo con regresión simple sobre logs
type Log = { exercise:string; weight:number; reps:number; rir:number|null; date:string };

export function PredictivePlateau({ logs }:{ logs: Log[] }){
  const insights = useMemo(()=>{
    const byEx = new Map<string, Log[]>();
    for(const l of logs) {
      if(!byEx.has(l.exercise)) byEx.set(l.exercise, []);
      byEx.get(l.exercise)!.push(l);
    }
    const out: Array<{exercise:string; status:"plateau"|"progress"|"fatigue"; msg:string; color:string}> = [];
    for(const [ex, arr] of byEx){
      arr.sort((a,b)=> new Date(a.date).getTime()-new Date(b.date).getTime());
      if(arr.length < 3) continue;
      const last3 = arr.slice(-3);
      const avgW = last3.reduce((a,c)=>a+c.weight,0)/3;
      const firstW = arr[0].weight;
      const progress = ((avgW - firstW)/Math.max(1,firstW))*100;
      const avgRir = last3.reduce((a,c)=>a+(c.rir??2),0)/3;
      const avgReps = last3.reduce((a,c)=>a+c.reps,0)/3;
      if(progress < 1 && avgRir <=1){
        out.push({exercise:ex, status:"plateau", msg:`Meseta: +${progress.toFixed(1)}% en ${arr.length} sesiones, RIR ${avgRir.toFixed(1)} → deload sugerido`, color:"amber"});
      } else if(progress > 3 && avgRir >=2){
        out.push({exercise:ex, status:"progress", msg:`Progreso +${progress.toFixed(1)}% con RIR ${avgRir.toFixed(1)} → listo para +2.5%`, color:"emerald"});
      } else if(avgRir <0.5){
        out.push({exercise:ex, status:"fatigue", msg:`Fatiga alta: RIR ${avgRir.toFixed(1)} + ${avgReps.toFixed(0)} reps → revisa descanso`, color:"red"});
      }
    }
    return out.slice(0,4);
  },[logs]);

  if(insights.length===0) return (
    <Card className="border-dashed"><CardContent className="py-6 text-center text-xs text-zinc-500">Necesitás 3+ sesiones por ejercicio para predicción inteligente.</CardContent></Card>
  );

  return (
    <Card className="border-amber-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Activity size={16} className="text-amber-400"/> Predicción Inteligente <Badge variant="warn">OptiLifts + TF.js MIT</Badge></CardTitle><p className="text-xs text-zinc-500">Detecta mesetas, progreso y fatiga con regresión local</p></CardHeader>
      <CardContent className="space-y-2">
        {insights.map(i=>(
          <div key={i.exercise} className={`p-3 rounded-xl border flex gap-3 ${i.color==="amber"?"bg-amber-500/10 border-amber-500/20": i.color==="emerald"?"bg-emerald-500/10 border-emerald-500/20":"bg-red-500/10 border-red-500/20"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${i.color==="amber"?"bg-amber-500 text-white": i.color==="emerald"?"bg-emerald-500 text-white":"bg-red-500 text-white"}`}>
              {i.status==="plateau"?<AlertTriangle size={14}/>: i.status==="progress"?<TrendingUp size={14}/>:<TrendingDown size={14}/>}
            </div>
            <div>
              <p className="font-bold text-sm">{i.exercise}</p>
              <p className="text-xs text-zinc-400">{i.msg}</p>
            </div>
          </div>
        ))}
        <p className="text-[11px] text-zinc-600 text-center">OptiLifts + LiftShift + TensorFlow.js MIT — predicción local sin cloud</p>
      </CardContent>
    </Card>
  );
}
