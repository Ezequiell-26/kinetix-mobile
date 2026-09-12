"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, RefreshCw, TrendingUp, AlertTriangle } from "lucide-react";

// Inspirado en Fitbod MIT (IA adaptativa) — https://www.fitbod.me
// Músculo fresco/recuperación, adapta workout según historial
const MUSCLES=["Pecho","Espalda","Piernas","Hombros","Brazos","Core","Glúteos"] as const;
const MOCK_HISTORY=[
  {muscle:"Pecho", hoursSince:18, volume:12},
  {muscle:"Espalda", hoursSince:48, volume:8},
  {muscle:"Piernas", hoursSince:72, volume:15},
  {muscle:"Hombros", hoursSince:24, volume:6},
];

function freshnessFor(hours:number){
  if(hours<24) return {pct:22, status:"fatigued" as const};
  if(hours<48) return {pct:58, status:"recovering" as const};
  return {pct:100, status:"fresh" as const};
}

export function FitbodAdaptive(){
  const [adapted,setAdapted]=useState(false);

  const muscles = useMemo(()=>{
    return MUSCLES.map(m=>{
      const h=MOCK_HISTORY.find(x=>x.muscle===m);
      const hours=h?.hoursSince ?? 96;
      const f=freshnessFor(hours);
      return {name:m, ...f, hours};
    });
  },[]);

  const planned=[
    {name:"Push (Pecho+Hombros)", muscles:["Pecho","Hombros"]},
    {name:"Pull (Espalda+Brazos)", muscles:["Espalda","Brazos"]},
    {name:"Legs (Piernas+Glúteos)", muscles:["Piernas","Glúteos"]},
  ];

  const adaptedPlan = adapted ? [
    {name:"Pull (Espalda+Brazos) ← swapeado", reason:"Pecho fatigado (18h), Espalda fresh (48h)"},
    {name:"Legs -30% volumen", reason:"Piernas recovering (72h penalizada)"},
    {name:"Push priorizado mañana", reason:"Hombros fresh, Pecho recovering"},
  ] : planned.map(p=>({name:p.name, reason:"Plan original"}));

  return (
    <Card className="border-emerald-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Brain size={16} className="text-emerald-400"/> Fitbod Adaptive</CardTitle><p className="text-xs text-zinc-500">Músculo fresco 0-100% → adapta tu workout hoy</p></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {muscles.slice(0,4).map(m=>(
            <div key={m.name} className={`p-2 rounded-xl border text-center ${m.status==="fatigued"?"bg-red-500/10 border-red-500/20": m.status==="recovering"?"bg-amber-500/10 border-amber-500/20":"bg-emerald-500/10 border-emerald-500/20"}`}>
              <p className="text-[11px] font-bold">{m.name}</p>
              <Progress value={m.pct} className="h-1.5 mt-1" />
              <p className="text-[11px] mt-1">{m.pct}% • {m.status}</p>
              <p className="text-[10px] text-zinc-500">{m.hours}h ago</p>
            </div>
          ))}
        </div>
        {muscles.some(m=>m.pct<30) && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 flex gap-2 items-center text-xs">
            <AlertTriangle size={14} className="text-amber-400 shrink-0"/>
            <span>Desbalance: Pecho fatigado, Espalda fresh → swapeo recomendado</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-bold mb-1">Plan original</p>
            <div className="space-y-1">
              {planned.map(p=>(
                <div key={p.name} className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs">{p.name}</div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold mb-1 flex items-center gap-1">Adaptado <TrendingUp size={12} className="text-emerald-400"/></p>
            <div className="space-y-1">
              {adaptedPlan.map(p=>(
                <div key={p.name} className={`border rounded-lg p-2 text-xs ${adapted?"bg-emerald-500/10 border-emerald-500/20":"bg-zinc-900 border-zinc-800"}`}>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-[11px] text-zinc-500">{p.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Button variant={adapted?"outline":"accent"} className="w-full" onClick={()=>setAdapted(!adapted)}><RefreshCw size={14} className="mr-2"/>{adapted?"Ver original":"Adaptar con IA →"}</Button>
      </CardContent>
    </Card>
  );
}
