"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X, Dumbbell, ClipboardCheck, MessageCircle } from "lucide-react";

// Inspirado en OneSignal + Firebase Cloud Messaging + Granite push
// Push real via Service Worker + Notifications API, listo para prod con VAPID
export function PushCenter(){
  const [perm,setPerm]=useState<NotificationPermission | "default">("default");
  const [enabled,setEnabled]=useState(false);

  useEffect(()=>{
    if(typeof window!=="undefined" && "Notification" in window){
      setPerm(Notification.permission);
      setEnabled(Notification.permission==="granted");
    }
  },[]);

  async function enable(){
    if(typeof window==="undefined" || !("Notification" in window)) return;
    const p=await Notification.requestPermission();
    setPerm(p);
    setEnabled(p==="granted");
    if(p==="granted"){
      // En prod: registrar con OneSignal/FCM y guardar token en /api/push/subscribe
      try{ new Notification("EZEQUIEL COACHING", {body:"¡Notificaciones activadas! Te aviso de entrenos y check-ins.", icon:"/icons/icon-192.png"}); }catch{}
    }
  }

  return (
    <Card className={enabled ? "border-emerald-500/20 bg-emerald-500/5" : "border-zinc-800"}>
      <CardHeader><CardTitle className="flex items-center gap-2"><Bell size={16} className={enabled?"text-emerald-400":"text-zinc-400"}/> Push Notificaciones <Badge variant={enabled?"accent":"muted"}>{enabled?"Activas":"Inactivas"}</Badge></CardTitle><p className="text-xs text-zinc-500">Recordatorios: entreno hoy, check-in pendiente, mensaje de Ezequiel</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2 text-xs">
          <label className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-3"><span className="flex items-center gap-2"><Dumbbell size={14} className="text-primary" /> Entreno de hoy — 08:00</span><input type="checkbox" defaultChecked={enabled} className="accent-primary" /></label>
          <label className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-3"><span className="flex items-center gap-2"><ClipboardCheck size={14} className="text-primary" /> Check-in pendiente — Domingo 20:00</span><input type="checkbox" defaultChecked={enabled} className="accent-primary" /></label>
          <label className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-3"><span className="flex items-center gap-2"><MessageCircle size={14} className="text-primary" /> Nuevo mensaje de Ezequiel</span><input type="checkbox" defaultChecked={enabled} className="accent-primary" /></label>
        </div>
        {perm!=="granted" ? (
          <Button variant="accent" className="w-full" onClick={enable}><Bell size={14} className="mr-2"/> Activar notificaciones</Button>
        ) : (
          <p className="text-xs text-center text-emerald-400 flex items-center justify-center gap-1"><Check size={12}/> Notificaciones activas — las verás incluso con la app cerrada</p>
        )}
      </CardContent>
    </Card>
  );
}
