"use client";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Trophy, Flame, Target, Calendar, Dumbbell, Zap, Award, Star } from "lucide-react";

type AchData = { workouts:number; streak:number; adherence:number; prs:number; checkins:number };

// Inspirado en Strive MIT — https://github.com/search?q=strive+fitness
// React + Firebase + métricas + achievements: XP, niveles, badges, rachas
export function Achievements({ data }:{ data: AchData }){
  const achievements = useMemo(()=>{
    const list: Array<{id:string; name:string; desc:string; icon:typeof Trophy; unlocked:boolean; progress:number; xp:number}> = [
      {id:"first", name:"Primer Paso", desc:"Completá tu primer entrenamiento", icon:Dumbbell, unlocked: data.workouts>=1, progress: Math.min(100, data.workouts*100), xp:50},
      {id:"streak3", name:"Racha 3", desc:"3 días seguidos entrenando", icon:Flame, unlocked: data.streak>=3, progress: Math.min(100, (data.streak/3)*100), xp:100},
      {id:"streak7", name:"Semana de Fuego", desc:"7 días de racha", icon:Flame, unlocked: data.streak>=7, progress: Math.min(100, (data.streak/7)*100), xp:250},
      {id:"vol10", name:"10 Entrenos", desc:"10 entrenamientos completados", icon:Target, unlocked: data.workouts>=10, progress: Math.min(100, (data.workouts/10)*100), xp:200},
      {id:"adh90", name:"Disciplina 90%", desc:"90% adherencia", icon:Award, unlocked: data.adherence>=90, progress: Math.min(100, data.adherence), xp:300},
      {id:"pr3", name:"Cazador de PRs", desc:"3 récords personales", icon:Trophy, unlocked: data.prs>=3, progress: Math.min(100, (data.prs/3)*100), xp:150},
      {id:"check4", name:"Compromiso", desc:"4 check-ins", icon:Calendar, unlocked: data.checkins>=4, progress: Math.min(100, (data.checkins/4)*100), xp:100},
      {id:"month", name:"Mes Completo", desc:"30 entrenos", icon:Star, unlocked: data.workouts>=30, progress: Math.min(100, (data.workouts/30)*100), xp:500},
    ];
    return list;
  },[data]);

  const totalXp = achievements.filter(a=>a.unlocked).reduce((acc,a)=>acc+a.xp,0);
  const level = Math.floor(totalXp / 300) + 1;
  const nextXp = level*300;
  const levelProgress = ((totalXp % 300)/300)*100;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-zinc-900 to-zinc-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Trophy size={18} className="text-primary"/> Logros <span className="ml-auto text-xs font-mono bg-zinc-800 px-2 py-1 rounded-full">Nv {level} • {totalXp} XP</span></CardTitle>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mt-2"><div className="h-full bg-primary transition-all" style={{width:`${levelProgress}%`}} /></div>
        <p className="text-xs text-zinc-500">{totalXp} XP → {nextXp} XP para Nv {level+1}</p>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-3">
        {achievements.map(a=>{
          const Icon=a.icon;
          return (
            <div key={a.id} className={`p-3 rounded-xl border flex gap-3 items-center ${a.unlocked?"bg-zinc-800 border-primary/30":"bg-zinc-900 border-zinc-800 opacity-60"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.unlocked?"bg-primary text-black":"bg-zinc-800 text-zinc-500"}`}><Icon size={18}/></div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm flex items-center gap-1">{a.name} {a.unlocked && <Check size={12} className="text-emerald-400" />} <span className="text-[10px] bg-zinc-700 px-1.5 py-0.5 rounded-full ml-auto">+{a.xp} XP</span></p>
                <p className="text-xs text-zinc-500">{a.desc}</p>
                <div className="h-1 bg-zinc-700 rounded-full overflow-hidden mt-1"><div className={`h-full ${a.unlocked?"bg-primary":"bg-zinc-600"}`} style={{width:`${a.progress}%`}} /></div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
