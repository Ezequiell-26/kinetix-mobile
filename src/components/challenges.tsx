"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, Target, Crown, Users } from "lucide-react";

// Inspirado en Strive challenges + FitBook streaks + Simple MIT
// Challenges mensuales + leaderboard anonimizado
const CHALLENGES = [
  {id:"push", title:"1000 Flexiones", desc:"En 30 días", progress:640, target:1000, unit:"reps", participants:24, reward:"50 XP"},
  {id:"run", title:"50km Running", desc:"GPX acumulado", progress:32, target:50, unit:"km", participants:12, reward:"100 XP"},
  {id:"streak", title:"Racha 21", desc:"21 días seguidos", progress:14, target:21, unit:"días", participants:18, reward:"200 XP"},
];

export function Challenges(){
  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-zinc-900 to-zinc-900">
      <CardHeader><CardTitle className="flex items-center gap-2"><Trophy size={18} className="text-amber-400"/> Challenges</CardTitle><p className="text-xs text-zinc-500">Desafíos mensuales + leaderboard — compite sin exponer datos</p></CardHeader>
      <CardContent className="space-y-3">
        {CHALLENGES.map(c=>{
          const pct=Math.round(c.progress/c.target*100);
          return (
            <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-sm flex items-center gap-1.5"><Target size={12} className="text-amber-400"/> {c.title} <Badge variant="muted" className="text-[10px]">{c.reward}</Badge></p>
                  <p className="text-xs text-zinc-500">{c.desc} • {c.participants} participantes</p>
                </div>
                <span className="text-xs font-mono bg-zinc-800 px-2 py-1 rounded-full">{pct}%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mt-2"><div className="h-full bg-amber-400" style={{width:`${pct}%`}} /></div>
              <p className="text-xs text-zinc-400 mt-1">{c.progress} / {c.target} {c.unit}</p>
            </div>
          );
        })}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
          <p className="text-xs font-bold flex items-center gap-1"><Crown size={12} className="text-amber-400"/> Leaderboard (anonimizado)</p>
          <div className="mt-2 space-y-1 text-xs">
            {[["#1", "Atleta G.", "92%"], ["#2", "Vos", "88%"], ["#3", "Atleta M.", "85%"]].map(([pos,name,score])=>(
              <div key={pos} className={`flex justify-between p-1.5 rounded-lg ${name==="Vos"?"bg-primary text-black font-bold":"bg-zinc-900"}`}><span>{pos} {name}</span><span>{score}</span></div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
