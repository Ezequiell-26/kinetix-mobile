"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, ArrowLeftRight, Ruler } from "lucide-react";

// Inspirado en PhotoCompare existente + MediaPipe + VitaFlex scanner
// Slider antes/después + medidas IA sobre foto
export function PhotoAiCompare(){
  const [slider,setSlider]=useState(50);
  const [measure,setMeasure]=useState(false);

  return (
    <Card className="border-violet-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Camera size={16} className="text-violet-400"/> Fotos Progreso IA <Badge variant="muted">Slider + Medidas IA</Badge></CardTitle><p className="text-xs text-zinc-500">Desliza para comparar + IA estima cintura/hombros</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="relative h-64 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 select-none">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-500 text-xs">Foto Inicio — Semana 1</div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-zinc-900 flex items-center justify-center text-zinc-300 text-xs" style={{clipPath:`inset(0 ${100-slider}% 0 0)`}}>Foto Actual — Semana 8</div>
          <div className="absolute top-0 bottom-0 w-0.5 bg-white" style={{left:`${slider}%`}} />
          <input type="range" min={0} max={100} value={slider} onChange={e=>setSlider(Number(e.target.value))} className="absolute bottom-3 left-3 right-3 accent-primary" />
          <div className="absolute top-2 left-2 flex gap-1"><Badge variant="muted">Antes</Badge><Badge variant="accent">Después</Badge></div>
        </div>
        <Button size="sm" variant={measure?"accent":"outline"} className="w-full" onClick={()=>setMeasure(!measure)}><Ruler size={14} className="mr-2"/>{measure?"Ocultar medidas IA":"Mostrar medidas IA"}</Button>
        {measure && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"><p className="text-[11px] text-zinc-500">Hombros</p><p className="font-black text-sm">118 → 121 cm</p><p className="text-[11px] text-emerald-400">+3cm</p></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"><p className="text-[11px] text-zinc-500">Cintura</p><p className="font-black text-sm">84 → 81 cm</p><p className="text-[11px] text-emerald-400">-3cm</p></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"><p className="text-[11px] text-zinc-500">Pecho</p><p className="font-black text-sm">102 → 104 cm</p><p className="text-[11px] text-emerald-400">+2cm</p></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
