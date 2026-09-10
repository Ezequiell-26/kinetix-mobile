"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bot, Clock, Mail, Check, ToggleLeft, ToggleRight } from "lucide-react";

// Inspirado en PT Distinction (automatizaciones) + My PT Hub — https://www.ptdistinction.com
// Automatizaciones premium: onboarding, check-ins, retención
export function PtDistinctionAuto(){
  const [activeTab,setActiveTab]=useState<"onboarding"|"checkin"|"retencion">("onboarding");
  const [enabled,setEnabled]=useState({onboarding:true, checkin:true, retencion:true});

  return (
    <Card className="border-violet-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Bot size={16} className="text-violet-400"/> Automatizaciones <Badge variant="muted">PT Distinction MIT</Badge></CardTitle>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[
            {id:"onboarding", label:"Onboarding"},
            {id:"checkin", label:"Check-in"},
            {id:"retencion", label:"Retención"},
          ].map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id as typeof activeTab)} className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${activeTab===t.id?"bg-violet-500 text-white border-violet-500":"bg-zinc-900 text-zinc-400 border-zinc-800"}`}>{t.label}</button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeTab==="onboarding" && (
          <div className="space-y-2">
            <div className="flex justify-between items-center"><p className="font-bold text-sm">Onboarding D0/D1/D3/D7</p><button onClick={()=>setEnabled(e=>({...e, onboarding:!e.onboarding}))}>{enabled.onboarding?<ToggleRight size={20} className="text-violet-400"/>:<ToggleLeft size={20} className="text-zinc-600"/>}</button></div>
            {[
              {day:"D0", msg:"¡Bienvenido {name}! Tu plan {plan} está listo →", sent:"2h ago"},
              {day:"D1", msg:"¿Cómo fue tu primer entreno, {name}?", sent:"pendiente"},
              {day:"D3", msg:"Tip: registra tu RIR para auto-progresión", sent:"pendiente"},
              {day:"D7", msg:"Check-in semanal — ¿cómo te sentiste?", sent:"pendiente"},
            ].map(s=>(
              <div key={s.day} className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex justify-between items-center">
                <div><p className="font-bold text-xs">{s.day} <span className="text-zinc-500 font-normal">• {s.msg.slice(0,35)}...</span></p><p className="text-[11px] text-zinc-500">{s.sent}</p></div>
                <Check size={12} className="text-emerald-400"/>
              </div>
            ))}
          </div>
        )}
        {activeTab==="checkin" && (
          <div className="space-y-2">
            <div className="flex justify-between items-center"><p className="font-bold text-sm">Check-in ≥3d pendiente</p><button onClick={()=>setEnabled(e=>({...e, checkin:!e.checkin}))}>{enabled.checkin?<ToggleRight size={20} className="text-violet-400"/>:<ToggleLeft size={20} className="text-zinc-600"/>}</button></div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              <p className="text-xs">Si no hay check-in en 3 días → auto recordatorio:</p>
              <p className="text-xs bg-zinc-900 rounded-lg p-2 mt-1 border border-zinc-800">“Hola {`{name}`}, te falta tu check-in. ¿Cómo va tu energía 1-10?”</p>
              <Progress value={65} className="mt-2 h-1.5" />
              <p className="text-[11px] text-zinc-500 mt-1">65% responden al auto-reminder</p>
            </div>
          </div>
        )}
        {activeTab==="retencion" && (
          <div className="space-y-2">
            <div className="flex justify-between items-center"><p className="font-bold text-sm">Retención 5d sin entrenar</p><button onClick={()=>setEnabled(e=>({...e, retencion:!e.retencion}))}>{enabled.retencion?<ToggleRight size={20} className="text-violet-400"/>:<ToggleLeft size={20} className="text-zinc-600"/>}</button></div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <p className="text-xs">5 días sin entrenar → auto-mensaje + tarea CRM 48h:</p>
              <p className="text-xs bg-zinc-900 rounded-lg p-2 mt-1 border border-zinc-800">“Hola {`{name}`}, noté {`{adherence}`}% adherencia. ¿Ajustamos tu plan?”</p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" className="h-7 text-xs flex-1"><Mail size={12} className="mr-1"/> Mensaje</Button>
                <Button size="sm" variant="accent" className="h-7 text-xs flex-1">Tarea 48h + Link pago</Button>
              </div>
            </div>
          </div>
        )}
        <p className="text-[11px] text-zinc-600 text-center">PT Distinction + My PT Hub MIT — automatizaciones sin Zapier</p>
      </CardContent>
    </Card>
  );
}
