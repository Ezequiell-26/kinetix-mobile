"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle, TrendingUp, CheckCircle, Camera } from "lucide-react";

// Inspirado en VitaFlex-AI + OptiLifts + Strive — IA analiza check-in semanal
export function CheckinAI({ checkin }:{ checkin: {energia:number; sueno:number; estres:number; entrenos:number; rendimiento:number; molestias:string; alimentacion:number; progreso:number} }){
  const risk = (10-checkin.energia)+(10-checkin.sueno)+checkin.estres+(5-checkin.entrenos)*2;
  const status = risk>18 ? "riesgo" : risk>10 ? "atención" : "óptimo";
  const tip = risk>18 ? "Prioriza sueño 8h + deload -30% volumen esta semana." : risk>10 ? "Mantén carga pero suma 1h de sueño y revisa proteína." : "¡Excelente! Listo para +2.5% la próxima semana.";

  return (
    <Card className={`border ${status==="riesgo"?"border-red-500/30 bg-red-500/5": status==="atención"?"border-amber-500/30 bg-amber-500/5":"border-emerald-500/30 bg-emerald-500/5"}`}>
      <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles size={16} className={status==="riesgo"?"text-red-400": status==="atención"?"text-amber-400":"text-emerald-400"}/> Análisis IA Check-in <Badge variant={status==="riesgo"?"warn": status==="atención"?"warn":"accent"}>{status.toUpperCase()}</Badge></CardTitle><p className="text-xs text-zinc-500">IA local analiza energía, sueño, estrés, entrenos → sugerencia automática</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            {label:"Energía", v:checkin.energia},
            {label:"Sueño", v:checkin.sueno},
            {label:"Estrés", v:checkin.estres},
            {label:"Rendimiento", v:checkin.rendimiento},
          ].map(m=>(
            <div key={m.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"><p className="text-[11px] text-zinc-500">{m.label}</p><p className={`font-black ${m.v>=7?"text-emerald-400": m.v>=4?"text-amber-400":"text-red-400"}`}>{m.v}/10</p></div>
          ))}
        </div>
        {checkin.molestias && <p className="text-xs bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">⚠️ Molestias: {checkin.molestias}</p>}
        <div className={`p-3 rounded-xl flex gap-2 ${status==="riesgo"?"bg-red-500/10 border border-red-500/20": status==="atención"?"bg-amber-500/10 border border-amber-500/20":"bg-emerald-500/10 border border-emerald-500/20"}`}>
          <span className="text-lg">{status==="riesgo"?"🚨": status==="atención"?"⚡":"✅"}</span>
          <div><p className="font-bold text-sm">{status==="riesgo"?"Cliente en riesgo — actuar hoy": status==="atención"?"Atención — ajustar hábitos":"Óptimo — progresar"}</p><p className="text-xs text-zinc-400">{tip}</p></div>
        </div>
        <p className="text-[11px] text-zinc-600 text-center">VitaFlex AI + OptiLifts MIT — análisis local sin subir fotos a cloud</p>
      </CardContent>
    </Card>
  );
}
