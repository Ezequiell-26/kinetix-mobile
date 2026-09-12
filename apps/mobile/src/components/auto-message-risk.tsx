"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Clock, AlertTriangle } from "lucide-react";

// Auto-mensajes por trigger: inactividad, check-in pendiente, meseta
export function AutoMessageRisk(){
  const [sent,setSent]=useState<string | null>(null);
  const triggers=[
    {id:"inactivo", label:"Sofía — 6d sin entrenar", msg:"Hola Sofía, noté que llevas 6 días sin entrenar. ¿Todo bien? ¿Te ajusto el plan para esta semana?", color:"red"},
    {id:"checkin", label:"Lucas — check-in pendiente", msg:"Lucas, te falta el check-in semanal. ¿Cómo te sentiste? Mandame tus fotos y energía 1-10.", color:"amber"},
    {id:"meseta", label:"Martín — meseta press banca", msg:"Martín, veo meseta en press banca 3 semanas. Vamos a cambiar a 5×5 la próxima. ¿Te parece?", color:"violet"},
  ];
  return (
    <Card className="border-amber-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle size={16} className="text-amber-400"/> Auto-Mensajes Riesgo</CardTitle><p className="text-xs text-zinc-500">Detecta riesgo y sugiere mensaje 1 click — no esperes a que se vayan</p></CardHeader>
      <CardContent className="space-y-2">
        {triggers.map(t=>(
          <div key={t.id} className={`p-3 rounded-xl border flex gap-3 items-center ${t.color==="red"?"bg-red-500/10 border-red-500/20": t.color==="amber"?"bg-amber-500/10 border-amber-500/20":"bg-violet-500/10 border-violet-500/20"}`}>
            <Clock size={14} className="text-zinc-500 shrink-0"/>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs">{t.label}</p>
              <p className="text-xs text-zinc-500 truncate">{t.msg.slice(0,60)}...</p>
            </div>
            <Button size="sm" variant={sent===t.id?"accent":"outline"} className="shrink-0 h-7 text-xs" onClick={()=>setSent(t.id)}>{sent===t.id?"Enviado":<><Send size={12} className="mr-1"/> Enviar</>}</Button>
          </div>
        ))}
        <p className="text-[11px] text-zinc-500 text-center">Trigger: 5d sin entrenar, check-in pendiente 3d, sin PRs 3 sem — auto-sugiere</p>
      </CardContent>
    </Card>
  );
}
