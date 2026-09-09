"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const habits = [
  {id:"water", label:"Agua", icon:"\uD83D\uDCA7", target:"3.0 L", unit:"L"},
  {id:"steps", label:"Pasos", icon:"\uD83D\uDC5F", target:"10k", unit:""},
  {id:"sleep", label:"Sueño", icon:"\uD83D\uDCA4", target:"8h", unit:"h"},
  {id:"protein", label:"Proteína", icon:"\uD83C\uDF57", target:"172g", unit:"g"},
];

export function HabitTracker(){
  const [values,setValues]=useState<Record<string,number>>({water:2.1, steps:8.4, sleep:7.2, protein:142});
  const targets: Record<string,number> = {water:3.0, steps:10, sleep:8, protein:172};
  return (
    <Card>
      <CardHeader><CardTitle>Hábitos de hoy</CardTitle><p className="text-xs text-zinc-500">Toca para sumar • se guarda automático</p></CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {habits.map(h=>{
          const v = values[h.id];
          const t = targets[h.id];
          const pct = Math.min(100, Math.round(v/t*100));
          return (
            <button key={h.id} onClick={()=>setValues({...values, [h.id]: Math.min(t, v+0.3)})} className="text-left bg-zinc-900 border border-zinc-800 rounded-2xl p-3 hover:border-zinc-700 transition">
              <div className="flex justify-between items-center"><span>{h.icon} {h.label}</span><span className="text-xs bg-zinc-800 px-2 py-0.5 rounded-full">{pct}%</span></div>
              <p className="font-black mt-1">{v}{h.unit} <span className="text-xs font-normal text-zinc-500">/ {h.target}</span></p>
              <Progress value={pct} className="mt-2 h-1.5" />
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
