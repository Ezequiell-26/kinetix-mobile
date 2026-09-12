"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, DollarSign, Clock, AlertTriangle } from "lucide-react";

// Inspirado en Twenty CRM MIT + Lyftr CRM + Simple
// Pipeline: Leads → Activos → En Riesgo → Renovación
const STAGES = [
  {id:"leads", name:"Leads", color:"bg-zinc-800", count:8},
  {id:"activos", name:"Activos", color:"bg-emerald-500", count:24},
  {id:"riesgo", name:"En Riesgo", color:"bg-amber-500", count:3},
  {id:"renovar", name:"Renovar", color:"bg-violet-500", count:5},
];

export function CrmPipeline(){
  const [selected,setSelected]=useState("riesgo");

  return (
    <Card className="border-violet-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Users size={16} className="text-violet-400"/> CRM Pipeline</CardTitle><p className="text-xs text-zinc-500">Leads → Activos → Riesgo → Renovación — auto-mensajes por trigger</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {STAGES.map(s=>(
            <button key={s.id} onClick={()=>setSelected(s.id)} className={`p-3 rounded-xl border text-center ${selected===s.id?"bg-zinc-900 border-violet-500/30":"bg-zinc-900 border-zinc-800 hover:border-zinc-700"}`}>
              <div className={`w-3 h-3 rounded-full mx-auto ${s.color}`} />
              <p className="font-bold text-sm mt-1">{s.count}</p>
              <p className="text-[11px] text-zinc-500">{s.name}</p>
            </button>
          ))}
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-2">
          <p className="font-bold text-sm flex items-center gap-1"><AlertTriangle size={12} className="text-amber-400"/> {STAGES.find(s=>s.id===selected)?.name} — auto-acciones</p>
          {selected==="riesgo" && <p className="text-xs text-zinc-400">3 clientes sin entrenar 5+ días → <Button size="sm" variant="accent" className="h-7 text-xs ml-1">Mandar mensaje auto</Button></p>}
          {selected==="renovar" && <p className="text-xs text-zinc-400">5 vencen en 7 días → <Button size="sm" variant="accent" className="h-7 text-xs ml-1">Enviar link de pago</Button></p>}
          {selected==="leads" && <p className="text-xs text-zinc-400">8 leads nuevos → <Button size="sm" variant="accent" className="h-7 text-xs ml-1">Enviar onboarding</Button></p>}
          {selected==="activos" && <p className="text-xs text-zinc-400">24 activos • adherencia 88% • 0 en riesgo hoy</p>}
        </div>
      </CardContent>
    </Card>
  );
}
