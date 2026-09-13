"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dumbbell } from "lucide-react";

// Inspirado en Stronk MIT (Go/Svelte, 5/3/1) — https://github.com/bcspragu/stronk
// Jim Wendler 5/3/1: 3 semanas + deload, % sobre TM (90% 1RM)
export function Stronk531(){
  const [squat,setSquat]=useState(100);
  const [bench,setBench]=useState(80);
  const [dead,setDead]=useState(120);
  const [press,setPress]=useState(60);

  const week=useMemo(()=>{
    const lifts=[
      {name:"Sentadilla", tm: Math.round(squat*0.9)},
      {name:"Press Banca", tm: Math.round(bench*0.9)},
      {name:"Peso Muerto", tm: Math.round(dead*0.9)},
      {name:"Press Militar", tm: Math.round(press*0.9)},
    ];
    const percents=[
      {w:"Semana 1 — 5/5/5+", pct:[0.65,0.75,0.85]},
      {w:"Semana 2 — 3/3/3+", pct:[0.70,0.80,0.90]},
      {w:"Semana 3 — 5/3/1+", pct:[0.75,0.85,0.95]},
      {w:"Semana 4 — Deload", pct:[0.40,0.50,0.60]},
    ];
    return {lifts, percents};
  },[squat,bench,dead,press]);

  return (
    <Card className="border-violet-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Dumbbell size={16} className="text-violet-400"/> Stronk 5/3/1</CardTitle><p className="text-xs text-zinc-500">Jim Wendler 5/3/1 — 3 semanas + deload, sobre TM 90% 1RM</p></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div><Label>Sentadilla 1RM</Label><Input type="number" value={squat} onChange={e=>setSquat(Number(e.target.value))} /></div>
          <div><Label>Press Banca</Label><Input type="number" value={bench} onChange={e=>setBench(Number(e.target.value))} /></div>
          <div><Label>Peso Muerto</Label><Input type="number" value={dead} onChange={e=>setDead(Number(e.target.value))} /></div>
          <div><Label>Press Militar</Label><Input type="number" value={press} onChange={e=>setPress(Number(e.target.value))} /></div>
        </div>
        <div className="space-y-2 max-h-64 overflow-auto">
          {week.percents.map(w=>(
            <div key={w.w} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
              <p className="font-bold text-xs text-violet-400">{w.w}</p>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                {w.pct.map((p,i)=>(
                  <div key={i} className="bg-zinc-950 rounded-lg p-2 text-center border border-zinc-800">
                    <p className="text-zinc-500">Serie {i+1}</p>
                    <p className="font-bold">{Math.round(week.lifts[0].tm*p)}kg × {w.w.includes("5/5")?5: w.w.includes("3/3")?3: w.w.includes("Deload")?5: i===2?"1+":"5"}</p>
                    <p className="text-[11px] text-zinc-500">{Math.round(p*100)}% TM</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
