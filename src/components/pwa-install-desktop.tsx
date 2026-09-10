"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Download, Check } from "lucide-react";

export function PwaInstallDesktop(){
  const [deferred,setDeferred]=useState<any>(null);
  const [isElectron,setIsElectron]=useState(false);
  const [isInstalled,setIsInstalled]=useState(false);

  useEffect(()=>{
    // @ts-ignore
    if(window.ezequiel?.isElectron) setIsElectron(true);
    if(window.matchMedia("(display-mode: standalone)").matches) setIsInstalled(true);
    const handler=(e:any)=>{ e.preventDefault(); setDeferred(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return ()=> window.removeEventListener("beforeinstallprompt", handler);
  },[]);

  if(isElectron) return (
    <Card className="border-emerald-500/20 bg-emerald-500/5"><CardContent className="pt-4 flex gap-3 items-center"><Check size={16} className="text-emerald-400"/><div><p className="font-bold text-sm">App Nativa Windows/Mac</p><p className="text-xs text-zinc-500">Ejecutando en Electron • auto-update • tray</p></div><Badge variant="accent">Nativa</Badge></CardContent></Card>
  );

  if(isInstalled) return null;

  return (
    <Card className="border-[#D6FF2A]/20">
      <CardContent className="pt-4 space-y-3">
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#D6FF2A] flex items-center justify-center text-black"><Monitor size={18}/></div>
          <div className="flex-1">
            <p className="font-bold text-sm flex items-center gap-2">Instalar en Windows/Mac <Badge variant="accent">PWA</Badge></p>
            <p className="text-xs text-zinc-500">1 click → app nativa en tu PC/Mac, offline, sin Chrome</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"><Monitor size={14} className="mx-auto text-zinc-400"/><p className="text-xs font-bold mt-1">Windows</p><p className="text-[11px] text-zinc-500">Chrome/Edge → Instalar</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"><Smartphone size={14} className="mx-auto text-zinc-400"/><p className="text-xs font-bold mt-1">Mac</p><p className="text-[11px] text-zinc-500">Chrome → Instalar</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"><Download size={14} className="mx-auto text-[#D6FF2A]"/><p className="text-xs font-bold mt-1">Electron</p><p className="text-[11px] text-zinc-500">.exe / .dmg</p></div>
        </div>
        {deferred ? (
          <Button variant="accent" className="w-full" onClick={async()=>{ deferred.prompt(); const {outcome}=await deferred.userChoice; if(outcome==="accepted") setDeferred(null); }}><Download size={14} className="mr-2"/> Instalar PWA ahora</Button>
        ) : (
          <p className="text-xs text-center text-zinc-500">En Chrome/Edge: menú ⋮ → Instalar EZEQUIEL COACHING. En Electron: npm run build:win / build:mac en /electron</p>
        )}
        <p className="text-[11px] text-zinc-600 text-center">PWA installable Windows/Mac/Linux + Electron nativo (Tray, auto-update, offline)</p>
      </CardContent>
    </Card>
  );
}
