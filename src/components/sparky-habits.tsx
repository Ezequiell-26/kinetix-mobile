"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Droplets, Moon, Footprints, Apple, Sparkles } from "lucide-react";

// Inspirado en SparkyFitness MIT — Fitness + nutrición + agua + IA
// https://github.com/search?q=sparkyfitness
export function SparkyHabits(){
  const [water,setWater]=useState(1.4); // L
  const [sleep,setSleep]=useState(7.2);
  const [steps,setSteps]=useState(6840);
  const [protein,setProtein]=useState(128);
  const [aiTip,setAiTip]=useState("¡Vas bien! Sumá 500ml más de agua para llegar al 100%.");

  useEffect(()=>{
    if(water < 2) setAiTip("💧 Tu hidratación está baja. Tomá 1 vaso ahora y sumá +0.25L");
    else if(sleep < 7) setAiTip("😴 Dormiste poco. Priorizá 30min más hoy para recuperar.");
    else if(protein < 140) setAiTip("🍗 Te faltan ~30g de proteína. Sumá un yogur o 100g de pollo.");
    else if(steps < 8000) setAiTip("👟 Te faltan 1.2k pasos. Una caminata de 15min te lleva al 100%.");
    else setAiTip("🔥 ¡Todo en verde! Mantené la racha mañana.");
  },[water,sleep,steps,protein]);

  return (
    <Card className="border-sky-500/20 bg-gradient-to-br from-sky-500/5 via-zinc-900 to-zinc-900">
      <CardHeader><CardTitle className="flex items-center gap-2"><Droplets size={18} className="text-sky-400"/> Hábitos IA <Badge variant="muted">SparkyFitness MIT</Badge></CardTitle><p className="text-xs text-zinc-500">Agua + sueño + pasos + proteína con IA local</p></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <button onClick={()=>setWater(v=>Math.min(3.5, +(v+0.25).toFixed(2)))} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-left hover:border-sky-500/30 transition">
            <div className="flex justify-between items-center"><span className="text-xs flex items-center gap-1"><Droplets size={12} className="text-sky-400"/> Agua</span><Badge variant="muted" className="text-[10px]">{Math.round(water/2.5*100)}%</Badge></div>
            <p className="font-black mt-1">{water.toFixed(2)} <span className="text-xs font-normal text-zinc-500">/ 2.5 L</span></p>
            <Progress value={water/2.5*100} className="mt-2 h-1.5" />
            <p className="text-[11px] text-sky-400 mt-1">+0.25L</p>
          </button>
          <button onClick={()=>setSleep(v=>Math.min(9, +(v+0.3).toFixed(1)))} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-left hover:border-zinc-700 transition">
            <div className="flex justify-between items-center"><span className="text-xs flex items-center gap-1"><Moon size={12}/> Sueño</span><Badge variant="muted" className="text-[10px]">{Math.round(sleep/8*100)}%</Badge></div>
            <p className="font-black mt-1">{sleep.toFixed(1)}h <span className="text-xs font-normal text-zinc-500">/ 8h</span></p>
            <Progress value={sleep/8*100} className="mt-2 h-1.5" />
          </button>
          <button onClick={()=>setSteps(v=>Math.min(15000, v+800))} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-left hover:border-zinc-700 transition">
            <div className="flex justify-between items-center"><span className="text-xs flex items-center gap-1"><Footprints size={12}/> Pasos</span><Badge variant="muted" className="text-[10px]">{Math.round(steps/10000*100)}%</Badge></div>
            <p className="font-black mt-1">{steps.toLocaleString("es-AR")} <span className="text-xs font-normal text-zinc-500">/ 10k</span></p>
            <Progress value={steps/10000*100} className="mt-2 h-1.5" />
          </button>
          <button onClick={()=>setProtein(v=>Math.min(200, v+15))} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-left hover:border-zinc-700 transition">
            <div className="flex justify-between items-center"><span className="text-xs flex items-center gap-1"><Apple size={12} className="text-emerald-400"/> Proteína</span><Badge variant="muted" className="text-[10px]">{Math.round(protein/172*100)}%</Badge></div>
            <p className="font-black mt-1">{protein}g <span className="text-xs font-normal text-zinc-500">/ 172g</span></p>
            <Progress value={protein/172*100} className="mt-2 h-1.5" />
          </button>
        </div>
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 flex gap-2 items-start">
          <Sparkles size={16} className="text-[#D6FF2A] shrink-0 mt-0.5"/>
          <div><p className="text-xs font-bold text-[#D6FF2A]">IA SparkyFitness</p><p className="text-xs text-zinc-300 mt-1">{aiTip}</p></div>
        </div>
        <p className="text-[11px] text-zinc-600 text-center">SparkyFitness MIT — agua, sueño, pasos, proteína + IA local</p>
      </CardContent>
    </Card>
  );
}
