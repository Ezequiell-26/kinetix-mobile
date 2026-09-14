"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Star, Flame, Trophy, ShoppingBag } from "lucide-react";

// Inspirado en Strive + FitBook gamification + Simple MIT
// Tienda de hábitos: ganas XP por entrenar, canjeas por recompensas
const REWARDS = [
  {id:"plan", name:"Plan Nutrición", cost:500, icon:Gift, desc:"PDF personalizado"},
  {id:"video", name:"Video Análisis", cost:300, icon:Star, desc:"Form check 1:1"},
  {id:"descuento", name:"10% Off", cost:1000, icon:Trophy, desc:"Próximo mes"},
  {id:"merch", name:"Remera EZEQUIEL COACHING", cost:2000, icon:ShoppingBag, desc:"Edición limitada"},
];

export function HabitStore({ xp=1240 }:{ xp?: number }){
  const [balance,setBalance]=useState(xp);

  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-zinc-900 to-zinc-900">
      <CardHeader><CardTitle className="flex items-center gap-2"><Gift size={18} className="text-amber-400"/> Tienda de Hábitos <Badge variant="warn">{balance} XP</Badge></CardTitle><p className="text-xs text-zinc-500">Gana XP entrenando → canjea por premios reales</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {REWARDS.map(r=>{
            const Icon=r.icon;
            const canAfford=balance>=r.cost;
            return (
              <div key={r.id} className={`p-3 rounded-xl border text-center ${canAfford?"bg-zinc-900 border-zinc-800":"bg-zinc-900/50 border-zinc-800 opacity-60"}`}>
                <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center ${canAfford?"bg-amber-400 text-black":"bg-zinc-800 text-zinc-500"}`}><Icon size={18}/></div>
                <p className="font-bold text-xs mt-1">{r.name}</p>
                <p className="text-[11px] text-zinc-500">{r.desc}</p>
                <p className="text-xs font-mono mt-1">{r.cost} XP</p>
                <Button size="sm" variant={canAfford?"accent":"outline"} className="w-full mt-2 h-7 text-xs" disabled={!canAfford} onClick={()=>setBalance(b=>b-r.cost)}>{canAfford?"Canjear":"Falta XP"}</Button>
              </div>
            );
          })}
        </div>
        <div className="bg-zinc-800 rounded-xl p-2 flex justify-between items-center text-xs">
          <span className="flex items-center gap-1"><Flame size={12} className="text-orange-400"/> Racha 7 días → +50 XP/día</span>
          <Badge variant="accent">+350 XP/sem</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
