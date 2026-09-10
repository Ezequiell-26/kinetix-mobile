"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sword, Shield, Heart, Star, Flame } from "lucide-react";

// Inspirado en Habitica MIT (gamified habit tracker, RPG) + Strive + FitBook
// https://github.com/HabitRPG/habitica — habit tracker RPG
export function HabiticaGamify(){
  const [hp,setHp]=useState(45);
  const [xp,setXp]=useState(1240);
  const [gold,setGold]=useState(86);
  return (
    <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 via-zinc-900 to-zinc-900">
      <CardHeader><CardTitle className="flex items-center gap-2"><Sword size={16} className="text-violet-400"/> Habitica RPG <Badge variant="muted">Habitica MIT</Badge></CardTitle><p className="text-xs text-zinc-500">Hábitos como RPG — gana XP, oro, sube nivel, pierde HP si faltas</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2"><Heart size={14} className="mx-auto text-red-400"/><p className="font-black text-red-400">{hp}/50 HP</p><div className="h-1 bg-zinc-800 rounded-full overflow-hidden mt-1"><div className="h-full bg-red-500" style={{width:`${hp/50*100}%`}} /></div></div>
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-2"><Star size={14} className="mx-auto text-violet-400"/><p className="font-black text-violet-400">Nv 8</p><p className="text-[11px] text-zinc-500">{xp} XP</p></div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2"><Shield size={14} className="mx-auto text-amber-400"/><p className="font-black text-amber-400">{gold} oro</p><p className="text-[11px] text-zinc-500">Tienda</p></div>
        </div>
        <div className="space-y-1">
          <button onClick={()=>{setXp(x=>x+10); setGold(g=>g+2); setHp(h=>Math.min(50,h+1));}} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 flex justify-between items-center text-xs">
            <span className="flex items-center gap-1"><Flame size={12} className="text-orange-400"/> Completar entreno</span><span className="text-emerald-400 font-bold">+10 XP +2 oro</span>
          </button>
          <button onClick={()=>setHp(h=>Math.max(0,h-5))} className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500/30 flex justify-between items-center text-xs">
            <span>Faltar entreno</span><span className="text-red-400 font-bold">-5 HP</span>
          </button>
        </div>
        <p className="text-[11px] text-zinc-600 text-center">Habitica MIT (RPG) + Strive — pierde HP si faltas, gana XP si cumplís</p>
      </CardContent>
    </Card>
  );
}
