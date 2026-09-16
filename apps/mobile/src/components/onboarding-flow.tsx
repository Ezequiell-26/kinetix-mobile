"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Target, Calendar, Dumbbell } from "lucide-react";
import { trackOnboardingStarted, trackOnboardingFunnelStep, trackOnboardingCompleted, capture } from "@/lib/posthog";

export function OnboardingFlow({ onComplete }:{ onComplete?: ()=>void }){
  const [step,setStep]=useState(1);
  const [goal,setGoal]=useState("");
  const [days,setDays]=useState(0);
  const [place,setPlace]=useState("");

  useEffect(()=>{ trackOnboardingStarted({ source: "mobile_onboarding_flow", funnel: "onboarding_main" }); }, []);
  useEffect(()=>{
    if (step >= 1 && step <= 4) trackOnboardingFunnelStep(step as 1|2|3|4, { ui_step: step, goal: goal || undefined, days: days || undefined, place: place || undefined });
  }, [step]);

  const handleComplete = () => {
    trackOnboardingCompleted({ goal, days, place, total_steps: 4, source: "mobile_onboarding_flow", funnel: "onboarding_main" });
    onComplete?.();
  };

  if(step===1) return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-zinc-900 to-zinc-900">
      <CardContent className="pt-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center font-black text-black text-xl mx-auto">E</div>
        <div><h2 className="text-xl font-black">Bienvenido a KINETIXFITT</h2><p className="text-xs text-zinc-500">Tu transformación empieza hoy. 4 pasos, 2 minutos.</p></div>
        <Button variant="accent" className="w-full h-12 font-black" onClick={()=>{
          capture("onboarding_cta_clicked", { step: 1, funnel: "onboarding_main" });
          setStep(2);
        }}>Comenzar →</Button>
      </CardContent>
    </Card>
  );
  if(step===2) return (
    <Card><CardContent className="pt-6 space-y-4">
      <p className="font-bold flex items-center gap-2"><Target size={16} className="text-primary"/> ¿Cuál es tu objetivo?</p>
      <div className="grid grid-cols-2 gap-2">
        {["Pérdida de grasa","Ganancia muscular","Fuerza","Recomposición","Otro"].map(g=>(
          <button key={g} onClick={()=>{
            setGoal(g);
            capture("onboarding_goal_selected", { goal: g, step: 2, funnel: "onboarding_main" });
            setStep(3);
          }} className={`p-3 rounded-xl border text-sm font-bold ${goal===g?"bg-primary text-black border-primary":"bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700"}`}>{g}</button>
        ))}
      </div>
      <p className="text-[11px] text-zinc-600 text-center">Paso 2/4</p>
    </CardContent></Card>
  );
  if(step===3) return (
    <Card><CardContent className="pt-6 space-y-4">
      <p className="font-bold flex items-center gap-2"><Calendar size={16} className="text-primary"/> ¿Cuántos días podés entrenar?</p>
      <div className="grid grid-cols-4 gap-2">
        {[2,3,4,5].map(d=>(
          <button key={d} onClick={()=>{
            setDays(d);
            capture("onboarding_days_selected", { days: d, step: 3, funnel: "onboarding_main" });
            setStep(4);
          }} className={`h-16 rounded-xl border font-black text-lg ${days===d?"bg-primary text-black border-primary":"bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700"}`}>{d}<span className="text-xs font-normal block">{d===5?"5+":"días"}</span></button>
        ))}
      </div>
      <p className="text-[11px] text-zinc-600 text-center">Paso 3/4</p>
    </CardContent></Card>
  );
  if(step===4) return (
    <Card><CardContent className="pt-6 space-y-4">
      <p className="font-bold flex items-center gap-2"><Dumbbell size={16} className="text-primary"/> ¿Dónde entrenás?</p>
      <div className="grid gap-2">
        {["Gimnasio","Casa","Ambos"].map(p=>(
          <button key={p} onClick={()=>{
            setPlace(p);
            capture("onboarding_place_selected", { place: p, step: 4, funnel: "onboarding_main" });
            setStep(5);
          }} className={`p-3 rounded-xl border text-sm font-bold ${place===p?"bg-primary text-black border-primary":"bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700"}`}>{p}</button>
        ))}
      </div>
      <p className="text-[11px] text-zinc-600 text-center">Paso 4/4</p>
    </CardContent></Card>
  );
  return (
    <Card className="border-emerald-500/20 bg-emerald-500/5">
      <CardContent className="pt-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white mx-auto"><Check size={20}/></div>
        <div><h2 className="font-black">¡Tu perfil está listo!</h2><p className="text-xs text-zinc-500">{goal} • {days} días • {place} • Tu coach te asignará tu primer programa</p></div>
        <Button variant="accent" className="w-full" onClick={handleComplete}>Ir a mi entreno →</Button>
        <p className="text-[11px] text-zinc-600">Onboarding completo — funnel 4/4</p>
      </CardContent>
    </Card>
  );
}
