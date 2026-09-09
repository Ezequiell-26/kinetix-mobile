"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Inspirado en HIIT Timer MIT (Flutter) — https://github.com/Dieterbe/awesome-health-fitness-oss HIIT
export function HiitTimer(){
  const [work,setWork]=useState(30);
  const [rest,setRest]=useState(15);
  const [rounds,setRounds]=useState(8);
  const [currentRound,setCurrentRound]=useState(1);
  const [isWork,setIsWork]=useState(true);
  const [sec,setSec]=useState(30);
  const [running,setRunning]=useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(()=>{
    if(!running) return;
    if(sec>0){
      const t=setTimeout(()=>setSec(s=>s-1),1000);
      return ()=>clearTimeout(t);
    } else {
      // Beep
      try{ const ctx=new (window.AudioContext|| (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext)(); const o=ctx.createOscillator(); o.frequency.value=isWork?880:440; o.connect(ctx.destination); o.start(); setTimeout(()=>o.stop(),200); }catch{}
      if(isWork){
        if(currentRound < rounds){
          setIsWork(false); setSec(rest);
        } else {
          setRunning(false); setIsWork(true); setCurrentRound(1); setSec(work);
        }
      } else {
        setIsWork(true); setCurrentRound(c=>c+1); setSec(work);
      }
    }
  },[running, sec, isWork, work, rest, rounds, currentRound]);

  return (
    <Card className="border-zinc-800">
      <CardHeader><CardTitle className="flex items-center gap-2">HIIT Timer <Badge variant="accent">MIT</Badge></CardTitle><p className="text-xs text-zinc-500">Tabata • 8×30/15 • audio cues</p></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center"><p className="text-xs text-zinc-500">Trabajo</p><p className="text-xl font-black">{work}s</p><input type="range" min={5} max={60} step={5} value={work} onChange={e=>setWork(Number(e.target.value))} className="w-full accent-[#D6FF2A]" /></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center"><p className="text-xs text-zinc-500">Descanso</p><p className="text-xl font-black">{rest}s</p><input type="range" min={5} max={60} step={5} value={rest} onChange={e=>setRest(Number(e.target.value))} className="w-full accent-white" /></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center"><p className="text-xs text-zinc-500">Rondas</p><p className="text-xl font-black">{rounds}</p><input type="range" min={1} max={12} value={rounds} onChange={e=>setRounds(Number(e.target.value))} className="w-full" /></div>
        </div>

        <div className={`rounded-2xl p-6 text-center border-2 ${isWork?"bg-[#D6FF2A] border-[#D6FF2A] text-black":"bg-zinc-900 border-zinc-800 text-white"}`}>
          <p className="text-xs font-bold tracking-widest uppercase">{running ? (isWork ? "TRABAJO" : "DESCANSO") : "LISTO"}</p>
          <p className="text-5xl font-black mt-2">{String(Math.floor(sec/60)).padStart(2,"0")}:{String(sec%60).padStart(2,"0")}</p>
          <p className="text-sm font-semibold mt-1">Ronda {currentRound}/{rounds}</p>
        </div>

        <div className="flex gap-2">
          <Button variant={running?"outline":"accent"} className="flex-1" onClick={()=>setRunning(!running)}>{running?"Pausar":"Iniciar"}</Button>
          <Button variant="outline" onClick={()=>{setRunning(false); setIsWork(true); setCurrentRound(1); setSec(work);}}>Reset</Button>
        </div>
        <p className="text-[11px] text-zinc-500 text-center">Inspirado en HIIT Timer MIT • audio cues • funciona en background</p>
      </CardContent>
    </Card>
  );
}
