"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Apple, MessageCircle, Star, TrendingUp } from "lucide-react";

// Inspirado en Future MIT (premium daily check-ins + Apple Watch) + Trainwell + Caliber
// https://www.future.co — Experiencia premium con coach humano + Apple Watch rings
export function FuturePremium({ compact=false }:{ compact?: boolean }){
  const [mood,setMood]=useState(4);
  const [energy,setEnergy]=useState(4);
  const [sleep,setSleep]=useState(7.2);

  const rings=[
    {label:"Fuerza", pct:73, color:"#D6FF2A"},
    {label:"Nutri", pct:92, color:"#10b981"},
    {label:"Descanso", pct:45, color:"#8b5cf6"},
  ];

  if(compact){
    return (
      <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 via-zinc-900 to-zinc-900">
        <CardContent className="pt-4 flex gap-3 items-center">
          <div className="flex -space-x-2">
            {rings.map(r=>(
              <div key={r.label} className="w-8 h-8 rounded-full border-2 border-zinc-900 flex items-center justify-center text-[10px] font-black" style={{background:r.color, color:"#000"}}>{r.pct}%</div>
            ))}
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">Future Premium</p>
            <p className="text-xs text-zinc-500">Rings + check-in 30s + coach humano</p>
          </div>
          <Badge variant="muted">Future MIT</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 via-zinc-900 to-zinc-900">
      <CardHeader><CardTitle className="flex items-center gap-2"><Apple size={16} className="text-violet-400"/> Future Premium <Badge variant="muted">Apple Watch MIT</Badge></CardTitle><p className="text-xs text-zinc-500">Daily check-in 30s + Apple Watch rings + coach humano &lt;2h</p></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3 justify-center">
          {rings.map(r=>(
            <div key={r.label} className="text-center">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#27272A" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={r.color} strokeWidth="10" strokeDasharray={`${r.pct*2.51} 251`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-black">{r.pct}%</span>
              </div>
              <p className="text-[11px] font-bold mt-1">{r.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-3">
          <p className="font-bold text-sm">Check-in 30s — hoy</p>
          <div className="grid grid-cols-3 gap-2">
            <div><p className="text-[11px] text-zinc-500">Ánimo</p><div className="flex gap-1 mt-1">{[1,2,3,4,5].map(v=>(
              <button key={v} onClick={()=>setMood(v)} className={`w-7 h-7 rounded-full text-xs font-bold ${mood===v?"bg-[#D6FF2A] text-black":"bg-zinc-800 text-zinc-500"}`}>{v}</button>
            ))}</div></div>
            <div><p className="text-[11px] text-zinc-500">Energía</p><div className="flex gap-1 mt-1">{[1,2,3,4,5].map(v=>(
              <button key={v} onClick={()=>setEnergy(v)} className={`w-7 h-7 rounded-full text-xs font-bold ${energy===v?"bg-[#D6FF2A] text-black":"bg-zinc-800 text-zinc-500"}`}>{v}</button>
            ))}</div></div>
            <div><p className="text-[11px] text-zinc-500">Sueño</p><div className="flex items-center gap-1 mt-1"><button onClick={()=>setSleep(s=>Math.max(4,s-0.5))} className="w-7 h-7 rounded-full bg-zinc-800 text-xs">-</button><span className="font-bold text-xs">{sleep.toFixed(1)}h</span><button onClick={()=>setSleep(s=>Math.min(10,s+0.5))} className="w-7 h-7 rounded-full bg-zinc-800 text-xs">+</button></div></div>
          </div>
          <Button variant="accent" className="w-full h-9 text-xs font-bold">Enviar check-in 30s →</Button>
        </div>
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 flex gap-2">
          <div className="w-8 h-8 rounded-full bg-[#D6FF2A] flex items-center justify-center font-black text-black text-xs">E</div>
          <div className="flex-1"><p className="text-xs font-bold">Ezequiel • responde en &lt;2h</p><p className="text-xs text-zinc-400">“Vi tu check-in, ajustamos volumen hoy. ¡Vamos!”</p></div>
          <Badge variant="accent">Humano</Badge>
        </div>
        <div className="flex gap-1 justify-center">
          {[1,2,3,4,5,6,7].map(d=>(
            <div key={d} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${d<=5?"bg-[#D6FF2A] text-black":"bg-zinc-800 text-zinc-500"}`}>{d<=5?"✓":d}</div>
          ))}
        </div>
        <p className="text-xs text-center text-zinc-500">Racha 5 días • Future MIT + Habitica</p>
        <p className="text-[11px] text-zinc-600 text-center">Future MIT (Apple Watch rings + daily 30s) + Trainwell human • <a href="https://www.future.co" target="_blank" className="underline">Ver Future</a></p>
      </CardContent>
    </Card>
  );
}
