"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Users, Share2, Star } from "lucide-react";

// Inspirado en ReferralCandy + GrowSurf MIT — sistema de referidos
export function ReferralSystem(){
  const [copied,setCopied]=useState(false);
  const link="https://ezequielcoaching.com/r/martin-f";
  function copy(){
    try{
      const done = navigator.clipboard?.writeText(link);
      if(done && typeof done.catch === "function"){
        done.then(()=>setCopied(true)).catch(()=>setCopied(false));
      }else{
        setCopied(true);
      }
    }catch{
      setCopied(false);
    }
    setTimeout(()=>setCopied(false),2000);
  }
  return (
    <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-zinc-900 to-zinc-900">
      <CardHeader><CardTitle className="flex items-center gap-2"><Gift size={16} className="text-emerald-400"/> Referidos <Badge variant="accent">+1 mes gratis</Badge></CardTitle><p className="text-xs text-zinc-500">Traé un amigo → ambos ganan 1 mes gratis</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex gap-2 items-center">
          <input value={link} readOnly className="flex-1 bg-transparent text-xs text-white outline-none" />
          <Button size="sm" variant="accent" className="h-8 text-xs" onClick={copy}>{copied?"Copiado":"Copiar"}</Button>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"><Users size={14} className="mx-auto text-zinc-400"/><p className="font-black">3</p><p className="text-[11px] text-zinc-500">Referidos</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"><Star size={14} className="mx-auto text-amber-400"/><p className="font-black">2</p><p className="text-[11px] text-zinc-500">Convertidos</p></div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2"><Gift size={14} className="mx-auto text-emerald-400"/><p className="font-black text-emerald-400">2 meses</p><p className="text-[11px] text-zinc-500">Ganados</p></div>
        </div>
        <Button variant="outline" className="w-full" onClick={()=>{ if(navigator.share) navigator.share({title:"EZEQUIEL COACHING", text:"Entrena con Ezequiel — 1 mes gratis con mi link", url:link}).catch(()=>{}); else copy(); }}><Share2 size={14} className="mr-2"/> Compartir link</Button>
      </CardContent>
    </Card>
  );
}
