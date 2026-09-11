"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";
import { playTrack } from "@/lib/voice";

// Inspirado en OpenHIIT MIT (Tabata) + Unbroken MIT (Tactical Barbell) + Simple MIT (local schedule)
// https://github.com/a-mabe/OpenHIIT (MIT) — interval timer Tabata/EMOM/AMRAP
// https://github.com/Bruno-366/Unbroken (MIT) — Tactical Barbell PWA
// https://github.com/basarsubasi/simplefitnessapp (MIT) — local create/schedule/track
const MODES = {
  tabata: {label:"Tabata", work:20, rest:10, rounds:8, color:"bg-red-500"},
  emom: {label:"EMOM", work:40, rest:20, rounds:10, color:"bg-violet-500"},
  amrap: {label:"AMRAP", work:60, rest:0, rounds:12, color:"bg-emerald-500"},
  hiit: {label:"HIIT", work:30, rest:15, rounds:8, color:"bg-primary"},
};

export function OpenHiitPro(){
  const [mode,setMode]=useState<keyof typeof MODES>("tabata");
  const [work,setWork]=useState(MODES.tabata.work);
  const [rest,setRest]=useState(MODES.tabata.rest);
  const [rounds,setRounds]=useState(MODES.tabata.rounds);
  const [current,setCurrent]=useState(1);
  const [isWork,setIsWork]=useState(true);
  const [sec,setSec]=useState(work);
  const [running,setRunning]=useState(false);

  useEffect(()=>{ const m=MODES[mode]; setWork(m.work); setRest(m.rest); setRounds(m.rounds); setSec(m.work); setIsWork(true); setCurrent(1); setRunning(false); },[mode]);
  useEffect(()=>{ if(!running) return; if(sec>0){ const t=setTimeout(()=>setSec(s=>s-1),1000); return ()=>clearTimeout(t);} else { if(isWork && rest>0){ playTrack("hiitDescansa"); setIsWork(false); setSec(rest);} else if(!isWork){ if(current < rounds){ playTrack(current + 1 >= rounds ? "hiitUltima" : "hiitTrabaja"); setCurrent(c=>c+1); setIsWork(true); setSec(work);} else { playTrack("hiitFin"); setRunning(false); setCurrent(1); setIsWork(true); setSec(work);} } else { if(current < rounds){ playTrack(current + 1 >= rounds ? "hiitUltima" : "hiitTrabaja"); setCurrent(c=>c+1); setSec(work);} else { playTrack("hiitFin"); setRunning(false); setCurrent(1); setSec(work);} } } },[running, sec, isWork, work, rest, rounds, current]);

  const cfg=MODES[mode];
  return (
    <Card className="border-zinc-800">
      <CardHeader><CardTitle className="flex items-center gap-2"><Timer size={18} className="text-primary"/> OpenHIIT Pro</CardTitle><p className="text-xs text-zinc-500">Tabata • EMOM • AMRAP • HIIT — audio cues + Tactical Barbell</p></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(Object.keys(MODES) as Array<keyof typeof MODES>).map(k=>(
            <button key={k} onClick={()=>setMode(k)} className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${mode===k?"bg-primary text-black border-primary":"bg-zinc-900 text-zinc-400 border-zinc-800"}`}>{MODES[k].label}</button>
          ))}
        </div>
        <div className={`rounded-2xl p-6 text-center border-2 ${isWork?"bg-primary border-primary text-black":"bg-zinc-900 border-zinc-800 text-white"}`}>
          <p className="text-xs font-bold tracking-widest uppercase">{running ? (isWork ? MODES[mode].label+" — TRABAJO" : "DESCANSO") : "LISTO — "+MODES[mode].label}</p>
          <p className="text-5xl font-black mt-2">{String(Math.floor(sec/60)).padStart(2,"0")}:{String(sec%60).padStart(2,"0")}</p>
          <p className="text-xs mt-1">Ronda {current}/{rounds} • {cfg.label}</p>
        </div>
        <div className="flex gap-2">
          <Button variant={running?"outline":"accent"} className="flex-1 h-12 font-black" onClick={()=>setRunning(!running)}>{running?<><Pause size={16} className="mr-2"/> Pausar</>:<><Play size={16} className="mr-2"/> Iniciar</>}</Button>
          <Button variant="ghost" size="icon" onClick={()=>{setRunning(false); setCurrent(1); setIsWork(true); setSec(work);}}><RotateCcw size={18}/></Button>
        </div>
      </CardContent>
    </Card>
  );
}
