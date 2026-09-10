"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Timer, Play, Pause, RotateCcw, SkipForward } from "lucide-react";

// Adaptado de blockbasti/just_another_workout_timer MIT (Flutter) + OpenHIIT MIT
// Modelos: Workout → Set → Exercise (adaptado a TS) + Timetable logic

type JTimerExercise = { name:string; duration:number };
type JTimerSet = { exercises: JTimerExercise[]; repetitions:number };
type JTimerWorkout = { title:string; sets: JTimerSet[] };

const PRESETS: Record<string, JTimerWorkout> = {
  tabata: {title:"Tabata 8×20/10", sets:[{repetitions:8, exercises:[{name:"Trabajo", duration:20},{name:"Descanso", duration:10}]}]},
  emom: {title:"EMOM 10×40/20", sets:[{repetitions:10, exercises:[{name:"Trabajo", duration:40},{name:"Descanso", duration:20}]}]},
  pomodoro: {title:"Pomodoro 25/5", sets:[{repetitions:4, exercises:[{name:"Foco", duration:25*60},{name:"Break", duration:5*60}]}]},
  fortime: {title:"For Time 15′", sets:[{repetitions:1, exercises:[{name:"AMRAP 15′", duration:15*60}]}]},
  rest: {title:"Descanso 90s", sets:[{repetitions:1, exercises:[{name:"Descanso", duration:90}]}]},
};

export function TimersHub(){
  const [preset,setPreset]=useState<keyof typeof PRESETS>("tabata");
  const [workout,setWorkout]=useState<JTimerWorkout>(PRESETS.tabata);
  const [running,setRunning]=useState(false);
  const [sec,setSec]=useState(0);
  const [currentExIdx,setCurrentExIdx]=useState(0);
  const [currentSetIdx,setCurrentSetIdx]=useState(0);
  const [rep,setRep]=useState(1);

  // Flatten timetable: array de exercises en orden
  const flat = workout.sets.flatMap(s=> Array(s.repetitions).fill(0).flatMap(()=> s.exercises));
  const current=flat[currentExIdx];
  const total=flat.length;
  const progress= total ? ((currentExIdx)/total)*100 : 0;

  useEffect(()=>{ setWorkout(PRESETS[preset]); setCurrentExIdx(0); setRep(1); setRunning(false); setSec(PRESETS[preset].sets[0].exercises[0].duration); },[preset]);
  useEffect(()=>{ if(current) setSec(current.duration); },[currentExIdx, workout]);

  useEffect(()=>{
    if(!running || !current) return;
    if(sec>0){
      const t=setTimeout(()=>setSec(s=>s-1),1000);
      return ()=>clearTimeout(t);
    } else {
      try{ const ctx=new (window.AudioContext|| (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext)(); const o=ctx.createOscillator(); o.frequency.value=880; o.connect(ctx.destination); o.start(); setTimeout(()=>o.stop(),150);}catch{}
      if(currentExIdx < flat.length-1){
        setCurrentExIdx(i=>i+1);
      } else {
        setRunning(false);
      }
    }
  },[running, sec, current, currentExIdx, flat.length]);

  return (
    <Card className="border-zinc-800">
      <CardHeader><CardTitle className="flex items-center gap-2"><Timer size={18} className="text-[#D6FF2A]"/> Cronómetros PRO <Badge variant="accent">just_another_timer MIT</Badge></CardTitle>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {Object.keys(PRESETS).map(k=>(
            <button key={k} onClick={()=>setPreset(k as keyof typeof PRESETS)} className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${preset===k?"bg-[#D6FF2A] text-black border-[#D6FF2A]":"bg-zinc-900 text-zinc-400 border-zinc-800"}`}>{PRESETS[k as keyof typeof PRESETS].title}</button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-widest">{current?.name || "Listo"} • {currentExIdx+1}/{total}</p>
          <p className="text-5xl font-black mt-2">{String(Math.floor(sec/60)).padStart(2,"0")}:{String(sec%60).padStart(2,"0")}</p>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-3"><div className="h-full bg-[#D6FF2A]" style={{width:`${progress}%`}} /></div>
          <p className="text-xs text-zinc-500 mt-1">{workout.title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant={running?"outline":"accent"} className="flex-1 h-12 font-black" onClick={()=>setRunning(!running)}>{running?<><Pause size={16} className="mr-2"/> Pausar</>:<><Play size={16} className="mr-2"/> Iniciar</>}</Button>
          <Button variant="ghost" size="icon" className="h-12 w-12" onClick={()=>{ setRunning(false); setCurrentExIdx(0); setSec(current?.duration||0); }}><RotateCcw size={18}/></Button>
          <Button variant="ghost" size="icon" className="h-12 w-12" onClick={()=>{ if(currentExIdx < flat.length-1) setCurrentExIdx(i=>i+1); }}><SkipForward size={18}/></Button>
        </div>
        <p className="text-[11px] text-zinc-600 text-center">just_another_workout_timer MIT (Flutter) — Workout→Set→Exercise + Timetable • blockbasti</p>
      </CardContent>
    </Card>
  );
}
