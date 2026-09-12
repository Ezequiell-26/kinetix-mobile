"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Battery, Moon, Heart, Zap } from "lucide-react";

// Inspirado en Oura + Whoop + open-wearables MIT — readiness score
export function RecoveryScore(){
  const score=78;
  const factors=[
    {label:"Sueño", value:82, icon:Moon, color:"violet"},
    {label:"HRV", value:75, icon:Heart, color:"red"},
    {label:"Carga", value:68, icon:Zap, color:"amber"},
    {label:"Descanso", value:85, icon:Battery, color:"emerald"},
  ];
  return (
    <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-zinc-900 to-zinc-900">
      <CardHeader><CardTitle className="flex items-center gap-2"><Battery size={16} className="text-emerald-400"/> Recovery Score <Badge variant="accent">{score}/100</Badge></CardTitle><p className="text-xs text-zinc-500">Oura/Whoop style — ¿listo para entrenar duro hoy?</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgb(var(--subtle))" strokeWidth="10" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgb(var(--primary))" strokeWidth="10" strokeDasharray={`${score*2.51} 251`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-black">{score}</span>
          </div>
          <p className={`font-bold text-sm mt-1 ${score>=80?"text-emerald-400": score>=60?"text-amber-400":"text-red-400"}`}>{score>=80?"Listo para PR": score>=60?"Entrena moderado":"Recupera hoy"}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {factors.map(f=>{
            const Icon=f.icon;
            return (
              <div key={f.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-2">
                <div className="flex justify-between items-center"><span className="text-xs flex items-center gap-1"><Icon size={12}/>{f.label}</span><span className="text-xs font-bold">{f.value}%</span></div>
                <Progress value={f.value} className="h-1.5 mt-1" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
