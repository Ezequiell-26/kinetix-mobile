"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, AlertTriangle, CheckCircle } from "lucide-react";

// Inspirado en wger injury + Caliber science + open-wearables MIT
// Prevención: desequilibrios, volumen, RIR bajo
export function InjuryPrevention(){
  const risks=[
    {muscle:"Hombro", risk:72, reason:"Volumen press +86% sin pull", action:"Añade 2 remos"},
    {muscle:"Rodilla", risk:45, reason:"Sentadilla RIR 0.5 + 5d seguidos", action:"Deload -20%"},
    {muscle:"Lumbar", risk:18, reason:"Peso muerto 3×/sem", action:"OK"},
  ];
  return (
    <Card className="border-red-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><ShieldAlert size={16} className="text-red-400"/> Prevención Lesiones</CardTitle><p className="text-xs text-zinc-500">Desequilibrios + volumen + RIR → riesgo 0-100%</p></CardHeader>
      <CardContent className="space-y-2">
        {risks.map(r=>(
          <div key={r.muscle} className={`p-3 rounded-xl border flex gap-3 items-center ${r.risk>60?"bg-red-500/10 border-red-500/20": r.risk>30?"bg-amber-500/10 border-amber-500/20":"bg-emerald-500/10 border-emerald-500/20"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black ${r.risk>60?"bg-red-500": r.risk>30?"bg-amber-500":"bg-emerald-500"}`}>{r.risk}%</div>
            <div className="flex-1">
              <p className="font-bold text-sm">{r.muscle}</p>
              <p className="text-xs text-zinc-500">{r.reason}</p>
            </div>
            <Badge variant={r.risk>60?"warn": r.risk>30?"muted":"accent"}>{r.action}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
