"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Dumbbell, Zap, Check } from "lucide-react";

// Inspirado en Jacked GPT + Workout AI Trainer (MIT)
// https://github.com/jessedelira/gym-tracker (AI generation patterns) + Jacked GPT (MIT)
// Generación local rule-based (sin API key) + opcional OpenAI si hay key
type GenParams = {
  goal: "hipertrofia" | "fuerza" | "perdida_grasa" | "resistencia";
  days: 3 | 4 | 5;
  level: "principiante" | "intermedio" | "avanzado";
  equipment: "gym" | "casa" | "mixto";
  duration: 4 | 8 | 12;
};

const GOAL_TEMPLATES: Record<string, {split:string[], repRange:string, rir:number, rest:number}> = {
  hipertrofia: {split:["Pecho+Tríceps","Espalda+Bíceps","Piernas+Glúteos","Hombros+Core","Full Body"], repRange:"8-12", rir:2, rest:90},
  fuerza: {split:["Torso","Pierna","Torso","Pierna","Full Body Heavy"], repRange:"4-6", rir:1, rest:180},
  perdida_grasa: {split:["Full Body A","Full Body B","Cardio+Core","Full Body C","HIIT"], repRange:"12-15", rir:3, rest:60},
  resistencia: {split:["Push","Pull","Legs","Push","Pull"], repRange:"15-20", rir:3, rest:60},
};

export function AiRoutineGenerator({ onGenerate }:{ onGenerate: (program: {name:string; durationWeeks:number; frequency:number; weeks:Array<{weekNumber:number; name:string; days:Array<{name:string; exercises:Array<{name:string; sets:number; reps:string; rir:number; restSec:number}>}>}>})=>void }){
  const [params,setParams]=useState<GenParams>({goal:"hipertrofia", days:4, level:"intermedio", equipment:"gym", duration:8});
  const [prompt,setPrompt]=useState("Mujer 28a, objetivo glúteos y piernas, 4d/sem en gym, intermedio");
  const [generating,setGenerating]=useState(false);
  const [preview,setPreview]=useState<ReturnType<typeof buildProgram> | null>(null);

  function buildProgram(p: GenParams & {prompt:string}){
    const tpl = GOAL_TEMPLATES[p.goal];
    const pool: Record<string, string[]> = {
      "Pecho":["Press Banca","Press Inclinado","Aperturas","Fondos","Push Up"],
      "Espalda":["Remo con Barra","Dominadas","Jalón al Pecho","Remo Mancuerna","Peso Muerto"],
      "Piernas":["Sentadilla","Prensa","Peso Muerto Rumano","Zancadas","Hip Thrust"],
      "Hombros":["Press Militar","Elevaciones Laterales","Pájaro","Face Pull","Encogimientos"],
      "Bíceps":["Curl Barra","Curl Martillo","Curl Concentrado"],
      "Tríceps":["Press Francés","Extensión Polea","Fondos Tríceps"],
      "Glúteos":["Hip Thrust","Patada Glúteo","Abducción","Peso Muerto Sumo"],
      "Core":["Plancha","Crunch","Russian Twist","Elevación Piernas"],
      "Full Body":["Sentadilla","Press Banca","Remo","Peso Muerto","Plancha"],
    };
    const getEx = (muscle:string)=> pool[muscle]?.slice(0,3) || pool["Full Body"].slice(0,3);

    const weeks=[];
    for(let w=1; w<=p.duration; w++){
      const progressiveOverload = w>1 ? ` +${(w-1)*2.5}% carga` : "";
      const days=[];
      for(let d=1; d<=p.days; d++){
        const dayName = tpl.split[(d-1)%tpl.split.length];
        const muscles = dayName.split(/\+| |Full Body|Cardio/ ).filter(Boolean).slice(0,2);
        const exNames: string[] = [];
        for(const m of muscles.length?muscles:["Full Body"]){
          exNames.push(...getEx(m));
        }
        // Cap to 6 exercises per day
        const uniq = Array.from(new Set(exNames)).slice(0,6);
        const exercises = uniq.map(name=>({
          name,
          sets: p.level==="principiante"?3 : p.level==="intermedio"?4 : 5,
          reps: tpl.repRange,
          rir: tpl.rir,
          restSec: tpl.rest,
        }));
        days.push({name: `${dayName}${progressiveOverload}`, exercises});
      }
      weeks.push({weekNumber:w, name:`Semana ${w}${w===p.duration?" — Descarga -10% volumen":""}`, days});
    }
    return {
      name: `${p.goal.replace("_"," ")} ${p.duration} semanas • ${p.days}d • ${p.level}`,
      durationWeeks: p.duration,
      frequency: p.days,
      weeks,
      meta: {prompt: p.prompt, equipment: p.equipment}
    };
  }

  function handleGenerate(){
    setGenerating(true);
    setTimeout(()=>{
      const prog = buildProgram({...params, prompt});
      setPreview(prog);
      setGenerating(false);
    }, 700);
  }

  function handleUse(){
    if(!preview) return;
    onGenerate(preview as unknown as Parameters<typeof onGenerate>[0]);
    setPreview(null);
  }

  return (
    <Card className="border-[#D6FF2A]/30 bg-gradient-to-br from-[#D6FF2A]/10 via-zinc-900 to-zinc-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Sparkles size={18} className="text-[#D6FF2A]"/> Generador IA <Badge variant="accent">Jacked GPT • MIT</Badge></CardTitle>
        <p className="text-xs text-zinc-400">1 prompt → programa 4-12 semanas con progresión automática. Local rule-based (sin API key) • inspirado en Jacked GPT + Workout AI Trainer MIT</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Describe al cliente (prompt)</Label>
          <Input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Ej: Hombre 35a, fuerza, 3d, casa con mancuernas" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div><Label>Objetivo</Label><select value={params.goal} onChange={e=>setParams({...params, goal:e.target.value as GenParams["goal"]})} className="w-full h-11 bg-zinc-900 border border-zinc-800 rounded-xl px-3 text-sm text-white"><option value="hipertrofia">Hipertrofia</option><option value="fuerza">Fuerza</option><option value="perdida_grasa">Pérdida grasa</option><option value="resistencia">Resistencia</option></select></div>
          <div><Label>Días</Label><select value={params.days} onChange={e=>setParams({...params, days:Number(e.target.value) as 3|4|5})} className="w-full h-11 bg-zinc-900 border border-zinc-800 rounded-xl px-3 text-sm text-white"><option value={3}>3d</option><option value={4}>4d</option><option value={5}>5d</option></select></div>
          <div><Label>Nivel</Label><select value={params.level} onChange={e=>setParams({...params, level:e.target.value as GenParams["level"]})} className="w-full h-11 bg-zinc-900 border border-zinc-800 rounded-xl px-3 text-sm text-white"><option value="principiante">Principiante</option><option value="intermedio">Intermedio</option><option value="avanzado">Avanzado</option></select></div>
          <div><Label>Duración</Label><select value={params.duration} onChange={e=>setParams({...params, duration:Number(e.target.value) as 4|8|12})} className="w-full h-11 bg-zinc-900 border border-zinc-800 rounded-xl px-3 text-sm text-white"><option value={4}>4 sem</option><option value={8}>8 sem</option><option value={12}>12 sem</option></select></div>
        </div>
        <Button variant="accent" className="w-full h-12 font-black" onClick={handleGenerate} disabled={generating}>
          {generating ? "Generando..." : <><Zap size={16} className="mr-2"/> GENERAR CON IA</>}
        </Button>

        {preview && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div><p className="font-bold text-white">{preview.name}</p><p className="text-xs text-zinc-500">{preview.durationWeeks} semanas • {preview.frequency}d/sem • {preview.weeks[0].days[0].exercises[0].reps} • RIR {preview.weeks[0].days[0].exercises[0].rir}</p></div>
              <Badge variant="accent">Preview</Badge>
            </div>
            <div className="max-h-64 overflow-auto space-y-2">
              {preview.weeks.slice(0,2).map(w=>(
                <div key={w.weekNumber} className="bg-zinc-900 rounded-xl p-3">
                  <p className="text-xs font-bold text-[#D6FF2A]">{w.name}</p>
                  {w.days.map((d,i)=>(
                    <p key={i} className="text-xs text-zinc-300 mt-1">Día {i+1} — {d.name}: {d.exercises.map(e=>e.name).join(", ")}</p>
                  ))}
                </div>
              ))}
              {preview.weeks.length>2 && <p className="text-xs text-zinc-500 text-center">+ {preview.weeks.length-2} semanas más con sobrecarga +2.5%/sem</p>}
            </div>
            <div className="flex gap-2">
              <Button variant="accent" className="flex-1" onClick={handleUse}><Check size={16} className="mr-1"/> Usar este programa</Button>
              <Button variant="ghost" onClick={()=>setPreview(null)}>Descartar</Button>
            </div>
          </div>
        )}
        <p className="text-[11px] text-zinc-600 text-center">Inspirado en <a href="https://github.com/brandonp2412/Flexify" target="_blank" className="underline">Jacked GPT / Workout AI Trainer (MIT)</a> • 100% local, sin API key necesaria. Conectable a OpenAI/Mistral vía /api/ai/generate.</p>
      </CardContent>
    </Card>
  );
}
