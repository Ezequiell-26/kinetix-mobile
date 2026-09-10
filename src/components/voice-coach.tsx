"use client";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2, Play, Pause, SkipForward } from "lucide-react";

// Inspirado en Web Speech API + VitaFlex-AI voice + OpenHIIT audio cues
// Voz en entreno: cuenta reps, descanso, motivación
export function VoiceCoach({ exerciseName, nextExercise }:{ exerciseName: string; nextExercise?: string }){
  const [speaking,setSpeaking]=useState(false);
  const [enabled,setEnabled]=useState(true);
  const utteranceRef=useRef<SpeechSynthesisUtterance | null>(null);

  function speak(text:string){
    if(!enabled || typeof window==="undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang="es-AR";
    u.rate=1.0;
    u.onstart=()=>setSpeaking(true);
    u.onend=()=>setSpeaking(false);
    utteranceRef.current=u;
    window.speechSynthesis.speak(u);
  }

  function stop(){ if(typeof window!=="undefined" && "speechSynthesis" in window){ window.speechSynthesis.cancel(); setSpeaking(false);} }

  return (
    <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 via-zinc-900 to-zinc-900">
      <CardHeader><CardTitle className="flex items-center gap-2"><Mic size={16} className="text-violet-400"/> Voz Coach <Badge variant={enabled?"accent":"muted"}>{enabled?"Activa":"Silenciada"}</Badge></CardTitle><p className="text-xs text-zinc-500">Audio en entreno: reps, descanso, siguiente ejercicio</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button size="sm" variant={speaking?"outline":"accent"} className="flex-1" onClick={()=> speaking ? stop() : speak(`Vamos, ${exerciseName}. Controla la técnica. Respira.`)}>{speaking?<><Pause size={14} className="mr-1"/> Pausar</>:<><Volume2 size={14} className="mr-1"/> Probar voz</>}</Button>
          <Button size="sm" variant="ghost" onClick={()=>setEnabled(!enabled)}>{enabled?"Silenciar":"Activar"}</Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button size="sm" variant="outline" className="h-10 text-xs" onClick={()=>speak(`Siguiente: ${nextExercise || "descanso"}. Preparate.`)}><SkipForward size={14} className="mr-1"/> Siguiente</Button>
          <Button size="sm" variant="outline" className="h-10 text-xs" onClick={()=>speak("Tres, dos, uno. ¡Vamos!")}><Play size={14} className="mr-1"/> Cuenta</Button>
          <Button size="sm" variant="outline" className="h-10 text-xs" onClick={()=>speak("Excelente serie. Descansá 90 segundos.")}>Motivar</Button>
        </div>
        <p className="text-[11px] text-zinc-600 text-center">Web Speech API (nativo) + VitaFlex voice MIT — sin librería extra</p>
      </CardContent>
    </Card>
  );
}
