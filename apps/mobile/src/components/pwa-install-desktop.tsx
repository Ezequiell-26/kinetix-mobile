"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Download, Check, Share, PlusSquare, Chrome } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    ezequiel?: { isElectron?: boolean };
  }
}

export function PwaInstallDesktop(){
  const [deferred,setDeferred]=useState<BeforeInstallPromptEvent | null>(null);
  const [isElectron,setIsElectron]=useState(false);
  const [isInstalled,setIsInstalled]=useState(false);
  const [isIOS,setIsIOS]=useState(false);
  const [isWindows,setIsWindows]=useState(false);

  useEffect(()=>{
    if(window.ezequiel?.isElectron) setIsElectron(true);
    const nav = window.navigator as Navigator & { standalone?: boolean };
    if(window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true) setIsInstalled(true);
    const ua=navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));
    setIsWindows(/Windows/.test(ua));
    const handler=(e:Event)=>{ e.preventDefault(); setDeferred(e as BeforeInstallPromptEvent); };
    window.addEventListener("beforeinstallprompt", handler);
    return ()=> window.removeEventListener("beforeinstallprompt", handler);
  },[]);

  if(isElectron) return (
    <Card className="border-emerald-500/20 bg-emerald-500/5"><CardContent className="pt-4 flex gap-3 items-center"><Check size={16} className="text-emerald-400"/><div><p className="font-bold text-sm">App Nativa Windows/Mac</p><p className="text-xs text-zinc-500">Electron • Tray • auto-update • offline</p></div><Badge variant="accent">Nativa</Badge></CardContent></Card>
  );

  if(isInstalled) return (
    <Card className="border-emerald-500/20 bg-emerald-500/5"><CardContent className="pt-4 flex gap-3 items-center"><Check size={16} className="text-emerald-400"/><div><p className="font-bold text-sm">App Instalada </p><p className="text-xs text-zinc-500">Ejecutando como app nativa • offline lista</p></div><Badge variant="accent">Instalada</Badge></CardContent></Card>
  );

  // iOS specific
  if(isIOS){
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-zinc-900 to-zinc-900">
        <CardContent className="pt-4 space-y-3">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-black"><Smartphone size={18}/></div>
            <div className="flex-1">
              <p className="font-bold text-sm flex items-center gap-2">Instalar en iPhone <Badge variant="accent">iOS</Badge></p>
              <p className="text-xs text-zinc-500">2 toques → app en tu inicio, sin App Store</p>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-2">
            <div className="flex gap-2 items-center text-xs"><span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-black text-xs">1</span><Share size={14} className="text-primary"/> Toca <span className="font-bold">Compartir</span> <Share size={14} className="inline text-blue-500"/> abajo en Safari</div>
            <div className="flex gap-2 items-center text-xs"><span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-black text-xs">2</span><PlusSquare size={14} className="text-zinc-400"/> Elige <span className="font-bold">Añadir a pantalla de inicio</span> → Añadir</div>
            <div className="flex gap-2 items-center text-xs text-emerald-400"><Check size={14}/> ¡Listo! Ícono EZEQUIEL COACHING en tu inicio, abre como app nativa</div>
          </div>
          <p className="text-[11px] text-zinc-600 text-center">iOS Safari • PWA 100% nativa • push + offline • sin App Store</p>
        </CardContent>
      </Card>
    );
  }

  // Windows / Mac / Android - Chrome/Edge
  return (
    <Card className="border-primary/20">
      <CardContent className="pt-4 space-y-3">
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-black"><Monitor size={18}/></div>
          <div className="flex-1">
            <p className="font-bold text-sm flex items-center gap-2">Instalar en {isWindows?"Windows":"Mac/PC"} <Badge variant="accent">1 click</Badge></p>
            <p className="text-xs text-zinc-500">App nativa en tu {isWindows?"PC":"Mac"}, offline, sin Chrome</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"><Chrome size={14} className="mx-auto text-zinc-400"/><p className="text-xs font-bold mt-1">Windows</p><p className="text-[11px] text-zinc-500">Chrome/Edge</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"><Smartphone size={14} className="mx-auto text-zinc-400"/><p className="text-xs font-bold mt-1">Mac</p><p className="text-[11px] text-zinc-500">Chrome</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"><Download size={14} className="mx-auto text-primary"/><p className="text-xs font-bold mt-1">Electron</p><p className="text-[11px] text-zinc-500">.exe/.dmg</p></div>
        </div>
        {deferred ? (
          <Button
            variant="accent"
            className="w-full h-11 font-black"
            onClick={async()=>{
              if(!deferred) return;
              try{
                await deferred.prompt();
                const {outcome}=await deferred.userChoice;
                if(outcome==="accepted") setDeferred(null);
              }catch{
                // Instalación cancelada o no disponible: se mantiene la guía manual.
              }
            }}
          ><Download size={16} className="mr-2"/> Instalar ahora — 1 click</Button>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs space-y-1">
            <p className="font-bold">¿No ves el botón?</p>
            <p className="text-zinc-500">Chrome/Edge → menú <span className="font-bold text-white">⋮ → Instalar EZEQUIEL COACHING</span> o ícono <Download size={12} className="inline"/> en la barra de direcciones.</p>
          </div>
        )}
        <p className="text-[11px] text-zinc-600 text-center">PWA Windows/Mac/Linux + Electron nativo (Tray, offline) • 1 click</p>
      </CardContent>
    </Card>
  );
}
