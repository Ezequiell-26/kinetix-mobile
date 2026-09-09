"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Suggestion = { type: "up" | "deload" | "check"; title:string; desc:string; action:string };

export function ProgressionSuggestion({ rir, reps, targetReps="8-12" }:{rir:number; reps:number; targetReps?:string}){
  // Logic: if RIR > target+1, suggest up; if RIR <1 and reps < target, suggest deload/check
  const targetRIR = 2;
  let suggestion: Suggestion | null = null;
  if(rir > targetRIR + 1 && reps >= 8){
    suggestion = {type:"up", title:"Posible progresión", desc:`Completaste ${reps} reps con RIR ${rir} (objetivo RIR ${targetRIR}). Sugerencia: aumentar ligeramente la carga la próxima semana.`, action:"Sugerir +2.5kg"};
  } else if(rir < 1 && reps < 6){
    suggestion = {type:"deload", title:"Revisar fatiga", desc:`RIR ${rir} con ${reps} reps indica alta fatiga. Sugerencia: revisar descanso, sueño o reducir volumen.`, action:"Ver check-in"};
  } else if(rir === targetRIR){
    suggestion = {type:"check", title:"En objetivo", desc:`RIR ${rir} perfecto. Mantener carga y buscar 1 rep más la próxima.`, action:"Mantener"};
  }
  if(!suggestion) return null;
  const colors = suggestion.type==="up" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : suggestion.type==="deload" ? "border-amber-500/20 bg-amber-500/10 text-amber-400" : "border-zinc-800 bg-zinc-900 text-zinc-300";
  return (
    <Card className={`${colors} border`}>
      <CardContent className="pt-4 flex gap-3">
        <div className="text-lg">{suggestion.type==="up"?"\u2191": suggestion.type==="deload"?"\u26A0":"\u2713"}</div>
        <div className="flex-1">
          <p className="font-bold text-sm">{suggestion.title} <Badge variant="muted" className="ml-2 text-[10px]">No es diagnóstico médico</Badge></p>
          <p className="text-xs opacity-80 mt-1">{suggestion.desc}</p>
          <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">{suggestion.action}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
