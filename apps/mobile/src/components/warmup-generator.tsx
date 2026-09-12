"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Play } from "lucide-react";

// Inspirado en GMB + Calisthenia + Simple MIT — warmup específico por patrón
const WARMUPS: Record<string, string[]> = {
  Sentadilla: ["Banded walks 2×15", "Goblet squat 2×8", "Salto caja 2×3"],
  Press: ["Banda Y-T-W 2×10", "Fondo 2×8", "Press barra 2×5"],
  Bisagra: ["Cat-camel 10", "Puente glúteo 2×10", "Kettle swing 2×8"],
};

export function WarmupGenerator(){
  const [pattern,setPattern]=useState<keyof typeof WARMUPS>("Sentadilla");
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Flame size={16} className="text-orange-400"/> Warmup Generator</CardTitle><p className="text-xs text-zinc-500">Calentamiento específico por patrón — no genérico</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-1.5">
          {(Object.keys(WARMUPS) as Array<keyof typeof WARMUPS>).map(p=>(
            <button key={p} onClick={()=>setPattern(p)} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${pattern===p?"bg-orange-500 text-white border-orange-500":"bg-zinc-900 text-zinc-400 border-zinc-800"}`}>{p}</button>
          ))}
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-1">
          {WARMUPS[pattern].map((w,i)=>(
            <div key={i} className="flex justify-between text-xs bg-zinc-950 rounded-lg p-2 border border-zinc-800">
              <span>{i+1}. {w}</span>
              <Badge variant="muted" className="text-[10px]">40s</Badge>
            </div>
          ))}
        </div>
        <Button variant="accent" className="w-full"><Play size={14} className="mr-2"/> Iniciar warmup 3′</Button>
      </CardContent>
    </Card>
  );
}
