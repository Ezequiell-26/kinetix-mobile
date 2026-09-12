"use client";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Flame } from "lucide-react";

type SetRecord = { exerciseName:string; weight:number|null; reps:number|null; date:string; rir?:number|null };

// Inspirado en Lyftr PRs + Flexify graphs (MIT)
// https://github.com/Cawlumm/lyftr (MIT) — Personal records, progression charts
// https://github.com/brandonp2412/Flexify (MIT) — Graphs, Strength visualization
export function PrTracker({ sets }:{ sets: SetRecord[] }){
  const prs = useMemo(()=>{
    const byEx = new Map<string, {best1RM:number; bestSet:SetRecord; history:SetRecord[]}>();
    for(const s of sets){
      if(!s.weight || !s.reps) continue;
      const oneRM = s.weight * (1 + s.reps/30); // Epley
      const cur = byEx.get(s.exerciseName);
      const entry = {best1RM: oneRM, bestSet: s, history: [s]};
      if(!cur) byEx.set(s.exerciseName, entry);
      else {
        cur.history.push(s);
        if(oneRM > cur.best1RM){ cur.best1RM = oneRM; cur.bestSet = s; }
      }
    }
    return Array.from(byEx.entries()).map(([name, v])=>({name, ...v})).sort((a,b)=>b.best1RM-a.best1RM).slice(0,6);
  },[sets]);

  if(prs.length===0) return (
    <Card className="border-dashed"><CardContent className="py-8 text-center text-zinc-500 text-sm">Sin registros aún — completá entrenamientos para ver tus PRs.</CardContent></Card>
  );

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Trophy size={18} className="text-primary"/> Récords Personales <Badge variant="accent">PR</Badge></CardTitle></CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-3">
        {prs.map(p=>(
          <div key={p.name} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <p className="font-bold text-sm line-clamp-1">{p.name}</p>
            <p className="text-2xl font-black mt-1">{Math.round(p.best1RM)} <span className="text-sm font-normal text-zinc-400">kg 1RM</span></p>
            <p className="text-xs text-zinc-500 mt-1">{p.bestSet.weight}kg × {p.bestSet.reps} • {new Date(p.bestSet.date).toLocaleDateString("es-AR")}</p>
            <div className="flex gap-1 mt-2">
              {p.history.slice(-8).map((h,i)=>{
                const h1rm = (h.weight||0)*(1+(h.reps||0)/30);
                const pct = Math.max(10, Math.min(100, (h1rm / p.best1RM)*100));
                return <div key={i} className="flex-1 bg-zinc-800 rounded-full h-1.5 overflow-hidden"><div className="h-full bg-primary" style={{width:`${pct}%`}} /></div>;
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
