"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExerciseImage } from "@/components/exercise-image";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, X, Timer } from "lucide-react";

// Inspirado en Lyftr Gym Mode (MIT) — https://github.com/Cawlumm/lyftr
// Licencia: MIT — self-hosted, guided active mode, rest timer, one exercise at a time
export function GymMode({
  exercises,
  onFinish,
  onExit,
}:{
  exercises: Array<{id:string; name:string; sets:number; reps:string; restSec:number; image:string|null; video?:string|null; instructions:string|null; muscleGroup:string}>;
  onFinish: ()=>void;
  onExit: ()=>void;
}){
  const [idx,setIdx]=useState(0);
  const [setNum,setSetNum]=useState(1);
  const [rest,setRest]=useState(0);
  const [paused,setPaused]=useState(false);
  const [completed,setCompleted]=useState<Record<string, boolean>>({});

  const ex = exercises[idx];
  const totalSets = exercises.reduce((a,e)=>a+e.sets,0);
  const doneSets = Object.keys(completed).length;
  const progress = totalSets ? (doneSets/totalSets)*100 : 0;

  useEffect(()=>{
    if(rest<=0) return;
    if(paused) return;
    const t=setTimeout(()=>setRest(r=>r-1),1000);
    return ()=>clearTimeout(t);
  },[rest,paused]);

  useEffect(()=>{
    if(rest===0 && !paused && Object.keys(completed).length>0){ // beep on rest end
      try{ const ctx=new (window.AudioContext||(window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext)(); const o=ctx.createOscillator(); o.frequency.value=880; o.connect(ctx.destination); o.start(); setTimeout(()=>o.stop(),250); }catch{}
    }
  },[rest, paused, completed]);

  function completeSet(){
    const key=`${ex.id}-${setNum}`;
    setCompleted(s=>({...s,[key]:true}));
    if(setNum < ex.sets){
      setSetNum(s=>s+1);
      setRest(ex.restSec || 90);
    } else {
      if(idx < exercises.length-1){
        setIdx(i=>i+1); setSetNum(1); setRest(ex.restSec || 90);
      } else {
        onFinish();
      }
    }
  }

  if(!ex) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onExit} className="text-white"><X size={18}/></Button>
          <div>
            <p className="text-xs text-zinc-400">MODO GYM • {idx+1}/{exercises.length} • Serie {setNum}/{ex.sets}</p>
            <p className="font-black text-white leading-none">{ex.name}</p>
          </div>
        </div>
        <Badge variant="accent">{Math.round(progress)}% • {doneSets}/{totalSets}</Badge>
      </div>
      <Progress value={progress} className="h-1 rounded-none" />

      {/* Rest Timer Banner */}
      {rest>0 && (
        <div className="bg-primary text-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Timer size={24} />
            <div>
              <p className="font-black text-xl leading-none">{String(Math.floor(rest/60)).padStart(2,"0")}:{String(rest%60).padStart(2,"0")}</p>
              <p className="text-xs font-bold uppercase">Descanso</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="bg-black text-white border-black" onClick={()=>setPaused(!paused)}>{paused?<Play size={16}/>:<Pause size={16}/>}</Button>
            <Button size="sm" variant="ghost" className="text-black" onClick={()=>setRest(0)}>Saltar</Button>
          </div>
        </div>
      )}

      {/* Main Exercise */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
          <ExerciseImage src={ex.image} videoSrc={ex.video} alt={ex.name} muscleGroup={ex.muscleGroup} name={ex.name} className="w-full h-full" />
        </div>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-4">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="muted">{ex.muscleGroup}</Badge>
              <Badge variant="muted">{ex.sets} × {ex.reps}</Badge>
              <Badge variant="muted">Descanso {ex.restSec}s</Badge>
            </div>
            <p className="text-sm text-zinc-400 mt-3">{ex.instructions || "Controla la técnica, respira, core firme."}</p>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {Array.from({length: ex.sets}).map((_,i)=>(
                <div key={i} className={`h-2 rounded-full ${completed[`${ex.id}-${i+1}`] ? "bg-primary" : i+1===setNum ? "bg-white" : "bg-zinc-800"}`} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950 space-y-3">
        <Button variant="accent" className="w-full h-14 text-lg font-black" onClick={completeSet}>
          COMPLETAR SERIE {setNum}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" disabled={idx===0 && setNum===1} onClick={()=>{
            if(setNum>1) setSetNum(s=>s-1); else if(idx>0){ setIdx(i=>i-1); setSetNum(exercises[idx-1].sets); }
          }}><ChevronLeft size={16}/> Anterior</Button>
          <Button variant="outline" className="flex-1" disabled={idx===exercises.length-1 && setNum===ex.sets} onClick={()=>{
            if(setNum<ex.sets) setSetNum(s=>s+1); else if(idx<exercises.length-1){ setIdx(i=>i+1); setSetNum(1); }
          }}>Siguiente <ChevronRight size={16}/></Button>
        </div>
      </div>
    </div>
  );
}
