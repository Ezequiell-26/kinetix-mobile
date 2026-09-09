"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const steps = [
  {title:"Bienvenido a EZEQUIEL COACHING", desc:"Tu plataforma premium de entrenamiento personalizado."},
  {title:"¿Cuál es tu objetivo?", options:["Pérdida de grasa","Ganancia muscular","Fuerza","Recomposición","Otro"]},
  {title:"¿Cuántos días podés entrenar?", options:["2","3","4","5+"]},
  {title:"¿Dónde entrenás?", options:["Gimnasio","Casa","Ambos"]},
  {title:"Finalizar perfil", desc:"Tu perfil está listo."},
];

export default function Onboarding(){
  const r=useRouter();
  const [step,setStep]=useState(0);
  const [choices,setChoices]=useState<Record<number,string>>({});
  const current = steps[step];
  function next(){
    if(step < steps.length-1) setStep(step+1);
    else r.push("/client/dashboard");
  }
  return (
    <div className="min-h-[70vh] flex flex-col justify-center">
      <div className="flex gap-2 mb-6">
        {steps.map((_,i)=>(
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i<=step?"bg-[#D6FF2A]":"bg-zinc-800"}`} />
        ))}
      </div>
      <Card className="border-zinc-800">
        <CardHeader className="text-center pt-8">
          <p className="text-xs tracking-widest text-zinc-500">PASO {step+1} DE {steps.length}</p>
          <CardTitle className="text-2xl mt-2">{current.title}</CardTitle>
          {current.desc && <p className="text-sm text-zinc-500 mt-2">{current.desc}</p>}
        </CardHeader>
        <CardContent className="space-y-3 pb-8">
          {step===0 && (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-[#D6FF2A] flex items-center justify-center font-black text-black text-3xl">E</div>
              <p className="text-sm text-zinc-400">Entrenamiento personalizado • Seguimiento real • Resultados medibles</p>
              <Button variant="accent" className="w-full" onClick={next}>COMENZAR</Button>
            </div>
          )}
          {current.options && (
            <div className="grid gap-2">
              {current.options.map(o=>(
                <button key={o} onClick={()=>{setChoices({...choices,[step]:o}); }} className={`p-4 rounded-2xl border text-left font-semibold transition ${choices[step]===o?"bg-white text-black border-white":"bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700"}`}>{o}</button>
              ))}
              <Button variant="accent" className="w-full mt-2" disabled={!choices[step]} onClick={next}>{step===steps.length-2?"FINALIZAR":"CONTINUAR"}</Button>
              {step>0 && <Button variant="ghost" className="w-full" onClick={()=>setStep(step-1)}>Atrás</Button>}
            </div>
          )}
          {step===4 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-2xl">✓</div>
              <p className="font-semibold">Tu perfil está listo.</p>
              <p className="text-sm text-zinc-500">Objetivo: {choices[1]} • {choices[2]} días • {choices[3]}</p>
              <Button variant="accent" className="w-full" onClick={next}>IR AL DASHBOARD</Button>
            </div>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-center text-zinc-600 mt-4">Podés cambiar estas preferencias en Perfil → Ajustes</p>
    </div>
  );
}
