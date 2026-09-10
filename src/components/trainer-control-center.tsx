"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, TrendingDown, Users, Clock, Flame, Target, ArrowRight, Mail } from "lucide-react";

type ClientRow = { id:string; name:string; goal:string; adherence:number; lastWorkoutDaysAgo:number; streak:number; volumeWeek:number; prs:number; checkinPending:boolean; };

const MOCK_CLIENTS: ClientRow[] = [
  {id:"1", name:"Martín Fernández", goal:"Pérdida grasa", adherence:92, lastWorkoutDaysAgo:1, streak:7, volumeWeek:18500, prs:2, checkinPending:false},
  {id:"2", name:"Lucas Gómez", goal:"Hipertrofia", adherence:78, lastWorkoutDaysAgo:4, streak:2, volumeWeek:14200, prs:0, checkinPending:true},
  {id:"3", name:"Sofía Rodríguez", goal:"Fuerza", adherence:85, lastWorkoutDaysAgo:6, streak:0, volumeWeek:9800, prs:1, checkinPending:true},
  {id:"4", name:"Valentina Díaz", goal:"Recomposición", adherence:95, lastWorkoutDaysAgo:0, streak:12, volumeWeek:22100, prs:3, checkinPending:false},
];

// Inspirado en Lyftr progression + Simple analytics + OptiLifts + Twenty CRM MIT
// Control total: quién avanza, quién se estanca, quién en riesgo
export function TrainerControlCenter(){
  const [filter,setFilter]=useState<"todos"|"riesgo"|"estancado"|"top">("todos");

  const enriched = useMemo(()=>{
    return MOCK_CLIENTS.map(c=>{
      let status:"ok"|"riesgo"|"estancado"|"top" = "ok";
      let reason="";
      if(c.lastWorkoutDaysAgo>=5 || c.adherence<80){ status="riesgo"; reason=`${c.lastWorkoutDaysAgo}d sin entrenar • ${c.adherence}% adherencia`; }
      else if(c.prs===0 && c.volumeWeek<12000){ status="estancado"; reason="Sin PRs + volumen bajo — posible meseta"; }
      else if(c.adherence>=90 && c.streak>=7){ status="top"; reason=`Racha ${c.streak}d • ${c.volumeWeek.toLocaleString("es-AR")}kg`; }
      return {...c, status, reason};
    });
  },[]);

  const filtered = enriched.filter(c=> filter==="todos" || c.status===filter);
  const counts = {
    todos: enriched.length,
    riesgo: enriched.filter(c=>c.status==="riesgo").length,
    estancado: enriched.filter(c=>c.status==="estancado").length,
    top: enriched.filter(c=>c.status==="top").length,
  };

  return (
    <Card className="border-violet-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Users size={18} className="text-violet-400"/> Control Total Clientes <Badge variant="muted">Lyftr + OptiLifts MIT</Badge></CardTitle>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[
            {id:"todos", label:`Todos (${counts.todos})`},
            {id:"riesgo", label:`🚨 Riesgo (${counts.riesgo})`},
            {id:"estancado", label:`⚠️ Estancados (${counts.estancado})`},
            {id:"top", label:`🔥 Top (${counts.top})`},
          ].map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id as typeof filter)} className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${filter===f.id?"bg-[#D6FF2A] text-black border-[#D6FF2A]":"bg-zinc-900 text-zinc-400 border-zinc-800"}`}>{f.label}</button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {filtered.map(c=>(
          <div key={c.id} className={`p-3 rounded-xl border flex gap-3 items-center ${c.status==="riesgo"?"bg-red-500/10 border-red-500/20": c.status==="estancado"?"bg-amber-500/10 border-amber-500/20": c.status==="top"?"bg-emerald-500/10 border-emerald-500/20":"bg-zinc-900 border-zinc-800"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${c.status==="riesgo"?"bg-red-500 text-white": c.status==="estancado"?"bg-amber-500 text-white": c.status==="top"?"bg-emerald-500 text-white":"bg-zinc-800 text-zinc-400"}`}>
              {c.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm flex items-center gap-1.5">{c.name} {c.status==="top" && <Flame size={12} className="text-orange-400"/>} {c.checkinPending && <Badge variant="warn" className="text-[10px]">Check-in</Badge>}</p>
              <p className="text-xs text-zinc-500 truncate">{c.goal} • {c.reason}</p>
              <div className="flex gap-2 mt-1 text-[11px]">
                <span className="flex items-center gap-1"><Target size={10}/> {c.adherence}%</span>
                <span className="flex items-center gap-1"><Clock size={10}/> {c.lastWorkoutDaysAgo===0?"Hoy": `${c.lastWorkoutDaysAgo}d`}</span>
                <span className="flex items-center gap-1"><TrendingUp size={10}/> {c.volumeWeek.toLocaleString("es-AR")}kg</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Button size="sm" variant={c.status==="riesgo"?"accent":"outline"} className="h-7 text-xs" onClick={()=>alert(`Mensaje a ${c.name}: ¿Cómo vas? Noté ${c.reason.toLowerCase()}`)}><Mail size={12} className="mr-1"/> Mensaje</Button>
              <Button size="sm" variant="ghost" className="h-6 text-[11px]">Ver ficha →</Button>
            </div>
          </div>
        ))}
        {filtered.length===0 && <p className="text-xs text-center text-zinc-500 py-6">Ningún cliente en {filter}</p>}
        <p className="text-[11px] text-zinc-600 text-center">Lyftr + OptiLifts + Simple MIT — meseta = sin PRs + volumen bajo + RIR, riesgo = 5d sin entrenar o &lt;80% adherencia</p>
      </CardContent>
    </Card>
  );
}
