"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Target, Calendar, Dumbbell } from "lucide-react";

// Spec original: 5 pasos onboarding
export function OnboardingFlow({ onComplete }:{ onComplete?: ()=>void }){
  const [step,setStep]=useState(1);
  const [goal,setGoal]=useState("");
  const [days,setDays]=useState(0);
  const [place,setPlace]=useState("");

  if(step===1) return (
    <Card className="border-[#D6FF2A]/20 bg-gradient-to-br from-[#D6FF2A]/5 via-zinc-900 to-zinc-900">
      <CardContent className="pt-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#D6FF2A] flex items-center justify-center font-black text-black text-xl mx-auto">E</div>
        <div><h2 className="text-xl font-black">Bienvenido a EZEQUIEL COACHING</h2><p className="text-xs text-zinc-500">Tu transformación empieza hoy. 5 pasos, 2 minutos.</p></div>
        <Button variant="accent" className="w-full h-12 font-black" onClick={()=>setStep(2)}>Comenzar →</Button>
      </CardContent>
    </Card>
  );
  if(step===2) return (
    <Card><CardContent className="pt-6 space-y-4">
      <p className="font-bold flex items-center gap-2"><Target size={16} className="text-[#D6FF2A]"/> ¿Cuál es tu objetivo?</p>
      <div className="grid grid-cols-2 gap-2">
        {["Pérdida de grasa","Ganancia muscular","Fuerza","Recomposición","Otro"].map(g=>(
          <button key={g} onClick={()=>{setGoal(g); setStep(3);}} className={`p-3 rounded-xl border text-sm font-bold ${goal===g?"bg-[#D6FF2A] text-black border-[#D6FF2A]":"bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700"}`}>{g}</button>
        ))}
      </div>
      <p className="text-[11px] text-zinc-600 text-center">Paso 2/5</p>
    </CardContent></Card>
  );
  if(step===3) return (
    <Card><CardContent className="pt-6 space-y-4">
      <p className="font-bold flex items-center gap-2"><Calendar size={16} className="text-[#D6FF2A]"/> ¿Cuántos días podés entrenar?</p>
      <div className="grid grid-cols-4 gap-2">
        {[2,3,4,5].map(d=>(
          <button key={d} onClick={()=>{setDays(d); setStep(4);}} className={`h-16 rounded-xl border font-black text-lg ${days===d?"bg-[#D6FF2A] text-black border-[#D6FF2A]":"bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700"}`}>{d}<span className="text-xs font-normal block">{d===5?"5+":"días"}</span></button>
        ))}
      </div>
      <p className="text-[11px] text-zinc-600 text-center">Paso 3/5</p>
    </CardContent></Card>
  );
  if(step===4) return (
    <Card><CardContent className="pt-6 space-y-4">
      <p className="font-bold flex items-center gap-2"><Dumbbell size={16} className="text-[#D6FF2A]"/> ¿Dónde entrenás?</p>
      <div className="grid gap-2">
        {["Gimnasio","Casa","Ambos"].map(p=>(
          <button key={p} onClick={()=>{setPlace(p); setStep(5);}} className={`p-3 rounded-xl border text-sm font-bold ${place===p?"bg-[#D6FF2A] text-black border-[#D6FF2A]":"bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700"}`}>{p}</button>
        ))}
      </div>
      <p className="text-[11px] text-zinc-600 text-center">Paso 4/5</p>
    </CardContent></Card>
  );
  return (
    <Card className="border-emerald-500/20 bg-emerald-500/5">
      <CardContent className="pt-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white mx-auto"><Check size={20}/></div>
        <div><h2 className="font-black">¡Tu perfil está listo!</h2><p className="text-xs text-zinc-500">{goal} • {days} días • {place} • Ezequiel te asignará tu primer programa</p></div>
        <Button variant="accent" className="w-full" onClick={()=>onComplete?.()}>Ir a mi entreno →</Button>
        <p className="text-[11px] text-zinc-600">Paso 5/5 — onboarding completo</p>
      </CardContent>
    </Card>
  );
}
