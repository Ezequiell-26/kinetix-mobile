"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Flame, Check } from "lucide-react";

// Inspirado en Habitica + Streaks MIT — calendario de hábitos con rachas
export function HabitCalendar(){
  const days= Array.from({length:30},(_,i)=>{
    const d=new Date();
    d.setDate(d.getDate() - (29-i));
    const done=Math.random()>0.25;
    const today=i===29;
    return {date:d, done, today};
  });
  const streak=7;
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Calendar size={16} className="text-primary"/> Calendario Hábitos <Badge variant="accent" className="inline-flex"><Flame size={11} className="mr-1" /> Streak {streak}d</Badge></CardTitle><p className="text-xs text-zinc-500">30 días • verde = entrenaste, gris = descanso</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-7 gap-1">
          {["L","M","X","J","V","S","D"].map(d=>(
            <div key={d} className="text-[11px] text-zinc-500 text-center font-bold">{d}</div>
          ))}
          {days.map((d,i)=>(
            <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-bold border ${d.today?"border-primary ring-1 ring-primary/30": "border-transparent"} ${d.done?"bg-primary text-black":"bg-zinc-900 text-zinc-600"}`}>
              {d.done ? <Check size={12}/> : d.date.getDate()}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs bg-zinc-900 border border-zinc-800 rounded-xl p-2">
          <span className="flex items-center gap-1"><Flame size={12} className="text-orange-400"/> Racha actual: {streak} días</span>
          <span className="text-zinc-500">Mejor: 12 días</span>
        </div>
      </CardContent>
    </Card>
  );
}
