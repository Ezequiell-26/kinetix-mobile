"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Instagram, Download, Award } from "lucide-react";
import { copyText } from "@/lib/clipboard";

// Inspirado en FitBook share + Strive social MIT
export function SocialShare(){
  const [copied,setCopied]=useState(false);
  async function share(type:string){
    const text= type==="ig" ? "Mi progreso con EZEQUIEL COACHING: -3kg, +2cm hombros #EzequielCoaching" : "Mi progreso — EZEQUIEL COACHING";
    try{
      if(navigator.share){
        await navigator.share({title:"Mi progreso", text});
        return;
      }
      const ok = await copyText(text);
      setCopied(ok);
      if(ok) setTimeout(()=>setCopied(false),2000);
    }catch{
      // Cancelado por el usuario o portapapeles bloqueado: no hacer nada.
    }
  }
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Share2 size={16} className="text-primary"/> Compartir Progreso</CardTitle><p className="text-xs text-zinc-500">Compartí tu transformación — sin exponer datos privados</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-800 flex flex-col items-center justify-center gap-2 p-4">
          <Award size={24} className="text-primary"/>
          <p className="font-black text-sm">-3.2kg • +3cm hombros</p>
          <p className="text-xs text-zinc-500">8 semanas con EZEQUIEL COACHING</p>
          <Badge variant="accent">Antes → Después</Badge>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="accent" size="sm" onClick={()=>share("ig")}><Instagram size={14} className="mr-1"/> IG</Button>
          <Button variant="outline" size="sm" onClick={()=>share("wa")}>WhatsApp</Button>
          <Button variant="outline" size="sm" onClick={()=>share("dl")}><Download size={14} className="mr-1"/> Imagen</Button>
        </div>
        {copied && <p className="text-xs text-emerald-400 text-center">Texto copiado al portapapeles ✓</p>}
      </CardContent>
    </Card>
  );
}
