"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Dumbbell } from "lucide-react";

// Inspirado en Unbroken MIT (Tactical Barbell) — https://github.com/Bruno-366/Unbroken
// React PWA para Tactical Barbell: Operator, Fighter, Zulu, Grey Man
const TEMPLATES = [
  {id:"operator", name:"Operator", desc:"3x semana • Fuerza máxima • Sentadilla + Press Banca + Peso Muerto", sets:"5x5", freq:"3d"},
  {id:"fighter", name:"Fighter", desc:"2x semana • Fuerza + Endurance • Para atletas con cardio", sets:"3x5", freq:"2d"},
  {id:"zulu", name:"Zulu", desc:"4x semana • Hipertrofia + Fuerza • Split superior/inferior", sets:"4x8", freq:"4d"},
  {id:"grey", name:"Grey Man", desc:"2x semana • Minimalista • Sentadilla + Press", sets:"3x3", freq:"2d"},
];

export function TacticalBarbell({ onSelect }:{ onSelect?: (t: typeof TEMPLATES[0])=>void }){
  return (
    <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 via-zinc-900 to-zinc-900">
      <CardHeader><CardTitle className="flex items-center gap-2"><Shield size={18} className="text-violet-400"/> Tactical Barbell</CardTitle><p className="text-xs text-zinc-500">Plantillas Operator/Fighter/Zulu/Grey Man — PWA offline</p></CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-3">
        {TEMPLATES.map(t=>(
          <button key={t.id} onClick={()=>onSelect?.(t)} className="text-left bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:border-violet-500/30 transition">
            <div className="flex justify-between items-center"><span className="font-bold text-sm">{t.name}</span><Badge variant="muted" className="text-[10px]">{t.freq}</Badge></div>
            <p className="text-xs text-zinc-400 mt-1">{t.desc}</p>
            <p className="text-xs font-mono mt-2 text-violet-400">{t.sets}</p>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
