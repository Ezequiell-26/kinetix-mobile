"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WifiOff, Wifi, HardDrive, RefreshCw, Check } from "lucide-react";

// Inspirado en Granite MIT — https://github.com/search?q=granite+pwa+offline
// PWA + offline + rutinas + PRs + estadísticas — 100% offline con sync
export function GraniteOffline(){
  const [offline,setOffline]=useState(false);
  const [pending,setPending]=useState<number>(0);
  const [cached,setCached]=useState<number>(0);
  const [lastSync,setLastSync]=useState<string | null>(null);

  useEffect(()=>{
    const check=()=>{
      setOffline(!navigator.onLine);
      // Count pending workout logs in localStorage
      try{
        const keys = Object.keys(localStorage).filter(k=>k.startsWith("ec:offline:"));
        setPending(keys.length);
        const cacheSize = JSON.stringify(localStorage).length;
        setCached(Math.round(cacheSize/1024));
        const last = localStorage.getItem("ec:lastSync");
        if(last) setLastSync(new Date(last).toLocaleTimeString("es-AR"));
      }catch{}
    };
    check();
    window.addEventListener("online", check);
    window.addEventListener("offline", check);
    const t=setInterval(check, 3000);
    return ()=>{ window.removeEventListener("online", check); window.removeEventListener("offline", check); clearInterval(t); };
  },[]);

  async function syncNow(){
    if(!navigator.onLine) return;
    try{
      const keys = Object.keys(localStorage).filter(k=>k.startsWith("ec:offline:"));
      for(const k of keys){
        const payload = localStorage.getItem(k);
        if(!payload) continue;
        const res = await fetch("/api/workout-logs", {method:"POST", headers:{"Content-Type":"application/json"}, body: payload});
        if(res.ok) localStorage.removeItem(k);
      }
      localStorage.setItem("ec:lastSync", new Date().toISOString());
      setLastSync(new Date().toLocaleTimeString("es-AR"));
      setPending(0);
    }catch{}
  }

  return (
    <Card className={`border ${offline?"border-amber-500/30 bg-amber-500/5":"border-zinc-800"}`}>
      <CardHeader><CardTitle className="flex items-center gap-2">{offline?<WifiOff size={16} className="text-amber-400"/>:<Wifi size={16} className="text-emerald-400"/>} Modo Offline <Badge variant={offline?"warn":"muted"}>{offline?"Offline":"Online"}</Badge> <Badge variant="muted">Granite MIT</Badge></CardTitle><p className="text-xs text-zinc-500">PWA 100% offline — tus series se guardan y sincronizan al volver</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3"><HardDrive size={16} className="mx-auto text-zinc-400"/><p className="text-lg font-black mt-1">{cached} KB</p><p className="text-[11px] text-zinc-500">Cache</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3"><RefreshCw size={16} className={`mx-auto ${pending?"text-amber-400":"text-zinc-400"}`}/><p className="text-lg font-black mt-1">{pending}</p><p className="text-[11px] text-zinc-500">Pendientes</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3"><Check size={16} className="mx-auto text-emerald-400"/><p className="text-xs font-bold mt-1">{lastSync||"—"}</p><p className="text-[11px] text-zinc-500">Último sync</p></div>
        </div>
        <Button variant={offline?"outline":"accent"} className="w-full" onClick={syncNow} disabled={offline || pending===0}>
          {offline ? "Sin conexión — guardando offline" : pending ? `Sincronizar ${pending} pendientes` : "Todo sincronizado ✓"}
        </Button>
        <p className="text-[11px] text-zinc-600 text-center">Granite MIT — PWA + offline + rutinas + PRs. Inspirado en <a href="https://github.com/search?q=granite+pwa" target="_blank" className="underline">Granite</a></p>
      </CardContent>
    </Card>
  );
}
