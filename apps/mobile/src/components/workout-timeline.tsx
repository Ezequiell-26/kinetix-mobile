"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, CheckCircle2, Calendar } from "lucide-react";

type TimelineItem = { id:string; date:string; name:string; durationMin:number | null; sets:number; volume:number; completed:boolean };

// Inspirado en iTrack + My-Workouts + FitnessApp (MIT)
// Workout tracking timeline: historial premium con volumen, duración, sets
export function WorkoutTimeline({ items }:{ items: TimelineItem[] }){
  const data = items.length ? items : [
    {id:"1", date: new Date(Date.now()-86400000*2).toISOString(), name:"Tren Superior A", durationMin:52, sets:18, volume:4200, completed:true},
    {id:"2", date: new Date(Date.now()-86400000*5).toISOString(), name:"Piernas + Glúteos", durationMin:48, sets:16, volume:5800, completed:true},
    {id:"3", date: new Date(Date.now()-86400000*7).toISOString(), name:"Full Body", durationMin:61, sets:20, volume:6100, completed:true},
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Calendar size={16} className="text-primary"/> Historial de Entrenos</CardTitle><p className="text-xs text-zinc-500">Timeline premium — volumen, duración, sets</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="relative pl-6 border-l border-zinc-800 space-y-4">
          {data.map(it=>(
            <div key={it.id} className="relative">
              <div className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 ${it.completed?"bg-primary border-primary":"bg-zinc-800 border-zinc-700"}`} />
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm">{it.name}</p>
                    <p className="text-xs text-zinc-500">{new Date(it.date).toLocaleDateString("es-AR", {weekday:"short", day:"2-digit", month:"short"})} • {it.durationMin} min • {it.sets} series</p>
                  </div>
                  <Badge variant={it.completed?"accent":"muted"}>{it.completed?"Completado":"Pendiente"}</Badge>
                </div>
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="flex items-center gap-1"><Dumbbell size={12}/> {it.volume.toLocaleString("es-AR")} kg</span>
                  <span className="flex items-center gap-1"><Clock size={12}/> {it.durationMin}′</span>
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400"/> {it.sets} series</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
