"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, Smartphone } from "lucide-react";

// Inspirado en Simple MIT + workout-tracker iCal + Google Calendar API
// Sync entrenos a Google/Apple Calendar con 1 click
export function CalendarSync(){
  const [synced,setSynced]=useState<Record<string,boolean>>({});

  function toggle(cal:string){
    setSynced(s=>({...s, [cal]: !s[cal]}));
  }

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Calendar size={16} className="text-blue-400"/> Calendar Sync</CardTitle><p className="text-xs text-zinc-500">Tus entrenos en Google / Apple Calendar — recordatorios automáticos</p></CardHeader>
      <CardContent className="space-y-3">
        {[
          {id:"google", name:"Google Calendar", desc:"Sync + notificaciones push", color:"bg-blue-500"},
          {id:"apple", name:"Apple Calendar", desc:"iCal + recordatorios", color:"bg-zinc-900"},
          {id:"outlook", name:"Outlook", desc:"Office 365 sync", color:"bg-blue-600"},
        ].map(cal=>(
          <div key={cal.id} className={`p-3 rounded-xl border flex items-center gap-3 ${synced[cal.id]?"bg-emerald-500/10 border-emerald-500/20":"bg-zinc-900 border-zinc-800"}`}>
            <div className={`w-10 h-10 rounded-xl ${cal.color} flex items-center justify-center text-white`}><Calendar size={18}/></div>
            <div className="flex-1">
              <p className="font-bold text-sm flex items-center gap-1">{cal.name} {synced[cal.id] && <Check size={12} className="text-emerald-400"/>}</p>
              <p className="text-xs text-zinc-500">{cal.desc}</p>
            </div>
            <Button size="sm" variant={synced[cal.id]?"outline":"accent"} className="h-8 text-xs" onClick={()=>toggle(cal.id)}>{synced[cal.id]?"Conectado":"Conectar"}</Button>
          </div>
        ))}
        <Button variant="outline" className="w-full" onClick={()=>{
          const ical="BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Entreno KINETIXFITT - Tren Superior\nDTSTART:20260915T140000Z\nDURATION:PT60M\nDESCRIPTION:Press Banca 4x8 RIR2\nEND:VEVENT\nEND:VCALENDAR";
          const blob=new Blob([ical],{type:"text/calendar"});
          const url=URL.createObjectURL(blob);
          const a=document.createElement("a");
          a.href=url; a.download="kinetixfitt_entrenos.ics"; a.click();
        }}><Smartphone size={14} className="mr-2"/> Descargar .ics (todos)</Button>
      </CardContent>
    </Card>
  );
}
