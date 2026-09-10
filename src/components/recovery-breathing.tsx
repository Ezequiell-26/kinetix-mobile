"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wind, Play, Pause } from "lucide-react";

// Inspirado en Breathly MIT + Insight Timer + Simple breathing
// Respiración Box 4-4-4-4 + Wim Hof
export function RecoveryBreathing(){
  const [phase,setPhase]=useState<"inhala"|"mantén"|"exhala"|"mantén2">("inhala");
  const [sec,setSec]=useState(4);
  const [running,setRunning]=useState(false);

  useEffect(()=>{
    if(!running) return;
    if(sec>0){
      const t=setTimeout(()=>setSec(s=>s-1),1000);
      return ()=>clearTimeout(t);
    } else {
      setPhase(p=> p==="inhala" ? "mantén" : p==="mantén" ? "exhala" : p==="exhala" ? "mantén2" : "inhala");
      setSec(4);
    }
  },[running, sec, phase]);

  return (
    <Card className="border-sky-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Wind size={16} className="text-sky-400"/> Recovery Breathing <Badge variant="muted">Breathly MIT</Badge></CardTitle><p className="text-xs text-zinc-500">Box breathing 4-4-4-4 — recuperación + foco</p></CardHeader>
      <CardContent className="space-y-3">
        <div className={`h-32 rounded-2xl border flex flex-col items-center justify-center gap-1 ${running?"bg-sky-500/10 border-sky-500/30":"bg-zinc-900 border-zinc-800"}`}>
          <p className="text-xs uppercase tracking-widest text-zinc-500">{running ? phase : "Listo"}</p>
          <p className="text-4xl font-black">{running ? sec : "4"}</p>
          <p className="text-xs text-zinc-500">{running ? "Respira..." : "Box 4-4-4-4"}</p>
        </div>
        <Button variant={running?"outline":"accent"} className="w-full" onClick={()=>setRunning(!running)}>{running?<><Pause size={14} className="mr-2"/> Pausar</>:<><Play size={14} className="mr-2"/> Iniciar</>}</Button>
        <p className="text-[11px] text-zinc-600 text-center">Breathly MIT — box breathing, Wim Hof, sin app extra</p>
      </CardContent>
    </Card>
  );
}
