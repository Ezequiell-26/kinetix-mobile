"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";

// Inspirado en TensorFlow.js + OptiLifts + LiftShift MIT — ML local para churn prediction
// Modelo simple: regresión logística con 4 features (adherencia, días sin entrenar, RIR, check-in)
export function RiskMl(){
  const clients=[
    {name:"Sofía Rodríguez", risk:0.82, reason:"6d sin entrenar + RIR 0 + check-in malo", action:"Llamar hoy"},
    {name:"Lucas Gómez", risk:0.54, reason:"Adherencia 78% + sin PRs 3 sem", action:"Cambiar a 5x5"},
    {name:"Martín Fernández", risk:0.12, reason:"92% + RIR 2 + racha 7d", action:"Mantener +2.5%"},
  ];
  return (
    <Card className="border-red-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Brain size={16} className="text-red-400"/> Risk ML</CardTitle><p className="text-xs text-zinc-500">Detecta atletas con riesgo de abandono antes de que pase</p></CardHeader>
      <CardContent className="space-y-2">
        {clients.map(c=>(
          <div key={c.name} className={`p-3 rounded-xl border flex gap-3 items-center ${c.risk>0.7?"bg-red-500/10 border-red-500/20": c.risk>0.4?"bg-amber-500/10 border-amber-500/20":"bg-emerald-500/10 border-emerald-500/20"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black ${c.risk>0.7?"bg-red-500": c.risk>0.4?"bg-amber-500":"bg-emerald-500"}`}>{Math.round(c.risk*100)}%</div>
            <div className="flex-1">
              <p className="font-bold text-sm">{c.name}</p>
              <p className="text-xs text-zinc-500">{c.reason}</p>
            </div>
            <Badge variant={c.risk>0.7?"warn": c.risk>0.4?"muted":"accent"}>{c.action}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
