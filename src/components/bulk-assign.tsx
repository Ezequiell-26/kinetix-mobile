"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Check } from "lucide-react";

// Inspirado en Lyftr program builder + Simple MIT — asignación masiva
export function BulkAssign(){
  const [selected,setSelected]=useState<string[]>(["1"]);
  const clients=[
    {id:"1", name:"Martín Fernández"},
    {id:"2", name:"Lucas Gómez"},
    {id:"3", name:"Sofía Rodríguez"},
    {id:"4", name:"Valentina Díaz"},
  ];

  function toggle(id:string){ setSelected(s=> s.includes(id) ? s.filter(x=>x!==id) : [...s, id]); }

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Users size={16} className="text-primary"/> Asignación Masiva</CardTitle><p className="text-xs text-zinc-500">Asigná un programa a varios clientes a la vez</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2">
          {clients.map(c=>{
            const sel=selected.includes(c.id);
            return (
              <button key={c.id} onClick={()=>toggle(c.id)} className={`p-2.5 rounded-xl border flex items-center gap-2 text-left ${sel?"bg-primary text-black border-primary font-bold":"bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700"}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${sel?"bg-black border-black text-primary":"border-zinc-700"}`}>{sel && <Check size={12}/>}</div>
                <span className="text-sm">{c.name}</span>
              </button>
            );
          })}
        </div>
        <select className="w-full h-11 bg-zinc-900 border border-zinc-800 rounded-xl px-3 text-sm text-white">
          <option>Programa Hipertrofia 12 Semanas (4d)</option>
          <option>Fuerza 5×5 — 8 semanas</option>
          <option>Pérdida grasa — 12 semanas</option>
        </select>
        <Button variant="accent" className="w-full" disabled={selected.length===0} onClick={()=>alert(`Programa asignado a ${selected.length} clientes`)}>{selected.length? `Asignar a ${selected.length} clientes →` : "Seleccioná clientes"}</Button>
      </CardContent>
    </Card>
  );
}
