"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

// Inspirado en VitaFlex AI + LiftShift + TensorFlow.js MIT — insights automáticos
export function TrainerInsights(){
  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-zinc-900 to-zinc-900">
      <CardHeader><CardTitle className="flex items-center gap-2"><Lightbulb size={16} className="text-amber-400"/> Insights Automáticos</CardTitle><p className="text-xs text-zinc-500">IA analiza todos tus clientes cada noche y te sugiere qué hacer</p></CardHeader>
      <CardContent className="space-y-2">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex gap-2">
          <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5"/>
          <div><p className="font-bold text-sm text-red-300">Sofía en riesgo — actuar hoy</p><p className="text-xs text-zinc-400">6 días sin entrenar + check-in pendiente + “rodilla molesta”. Sugerencia: baja volumen 30% + revisa técnica sentadilla.</p></div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-2">
          <TrendingUp size={16} className="text-amber-400 shrink-0 mt-0.5"/>
          <div><p className="font-bold text-sm">Lucas estancado — meseta detectada</p><p className="text-xs text-zinc-400">3 semanas sin PRs en press banca (RIR 1). Sugerencia: cambia a 5×5 + sube 2.5kg.</p></div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex gap-2">
          <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5"/>
          <div><p className="font-bold text-sm text-emerald-300">Martín y Valentina top — mantén</p><p className="text-xs text-zinc-400">92% y 95% adherencia, rachas 7 y 12 días. Listos para +2.5% la próxima semana.</p></div>
        </div>
      </CardContent>
    </Card>
  );
}
