"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge, TrendingUp, Zap } from "lucide-react";

// Inspirado en VBT (Velocity Based Training) + OptiLifts + Flexify MIT
// Tracker de velocidad de barra: m/s, pérdida de velocidad, RIR estimado
export function VelocityTracker(){
  const [vel,setVel]=useState(0.42);
  const rir=Math.max(0, Math.round((0.5 - vel)*10));
  const loss= vel<0.35 ? 35 : vel<0.4 ? 20 : 10;
  return (
    <Card className="border-sky-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Gauge size={16} className="text-sky-400"/> Velocity Tracker</CardTitle><p className="text-xs text-zinc-500">Velocidad de barra (m/s) → RIR + pérdida → auto-regula carga</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
          <p className="text-xs text-zinc-500">Velocidad última rep</p>
          <p className="text-4xl font-black text-sky-400">{vel.toFixed(2)} <span className="text-lg">m/s</span></p>
          <div className="flex gap-2 justify-center mt-2">
            <Badge variant={rir<=1?"warn": rir<=3?"muted":"accent"}>RIR ~{rir}</Badge>
            <Badge variant={loss>25?"warn":"muted"}>Pérdida {loss}%</Badge>
          </div>
        </div>
        <input type="range" min={0.15} max={0.65} step={0.02} value={vel} onChange={e=>setVel(Number(e.target.value))} className="w-full accent-sky-400" />
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-center"><TrendingUp size={12} className="mx-auto text-emerald-400"/><p className="font-bold">{vel>0.45?"Subir 2.5kg": vel<0.30?"Bajar 5%":"Mantener"}</p><p className="text-zinc-500">Sugerencia</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-center"><Zap size={12} className="mx-auto text-amber-400"/><p className="font-bold">{loss>30?"Stop serie":"Sigue"}</p><p className="text-zinc-500">Fatiga</p></div>
        </div>
      </CardContent>
    </Card>
  );
}
