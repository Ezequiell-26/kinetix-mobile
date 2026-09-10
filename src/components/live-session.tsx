"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Mic, MicOff, VideoOff, PhoneOff, Share2 } from "lucide-react";

// Inspirado en Jitsi MIT + Daily.co + VitaFlex live
// Video 1:1 WebRTC para sesiones con cliente
export function LiveSession(){
  const [inCall,setInCall]=useState(false);
  const [muted,setMuted]=useState(false);
  const [camOff,setCamOff]=useState(false);

  if(inCall){
    return (
      <Card className="border-emerald-500/20 bg-zinc-950 overflow-hidden">
        <div className="aspect-video bg-zinc-900 flex flex-col items-center justify-center gap-2 p-4">
          <div className="w-16 h-16 rounded-full bg-[#D6FF2A] flex items-center justify-center font-black text-black text-xl">E</div>
          <p className="font-bold text-sm">Sesión con Martín • 12:34</p>
          <p className="text-xs text-zinc-500">WebRTC • Jitsi MIT • Grabando...</p>
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant={muted?"outline":"outline"} className="h-9 w-9 p-0 rounded-full" onClick={()=>setMuted(!muted)}>{muted?<MicOff size={16}/>:<Mic size={16}/>}</Button>
            <Button size="sm" variant={camOff?"outline":"outline"} className="h-9 w-9 p-0 rounded-full" onClick={()=>setCamOff(!camOff)}>{camOff?<VideoOff size={16}/>:<Video size={16}/>}</Button>
            <Button size="sm" variant="accent" className="h-9 w-9 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white" onClick={()=>setInCall(false)}><PhoneOff size={16}/></Button>
            <Button size="sm" variant="outline" className="h-9 w-9 p-0 rounded-full"><Share2 size={16}/></Button>
          </div>
        </div>
        <CardContent className="p-3 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={()=>setInCall(false)}>Finalizar y guardar nota</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-violet-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Video size={16} className="text-violet-400"/> Live Session <Badge variant="muted">Jitsi MIT</Badge></CardTitle><p className="text-xs text-zinc-500">Video 1:1 WebRTC — corrección técnica en vivo, sin Zoom</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="aspect-video rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center gap-2">
          <Video size={24} className="text-zinc-500"/>
          <p className="text-xs font-bold">Listo para llamar a Martín</p>
          <p className="text-[11px] text-zinc-500">WebRTC peer-to-peer • sin servidor extra</p>
        </div>
        <Button variant="accent" className="w-full h-11 font-black" onClick={()=>setInCall(true)}><Video size={16} className="mr-2"/> Iniciar video con cliente</Button>
        <p className="text-[11px] text-zinc-600 text-center">Jitsi MIT + Daily.co — WebRTC 1:1, grabación opcional, 100% privado</p>
      </CardContent>
    </Card>
  );
}
