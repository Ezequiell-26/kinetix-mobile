"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Inspirado en Lyftr muscle diagrams (MIT) — https://github.com/Cawlumm/lyftr
// Visualiza volumen semanal por grupo muscular como heatmap
const MUSCLES = [
  {key:"Pecho", label:"Pecho"},
  {key:"Espalda", label:"Espalda"},
  {key:"Piernas", label:"Piernas"},
  {key:"Hombros", label:"Hombros"},
  {key:"Bíceps", label:"Bíceps"},
  {key:"Tríceps", label:"Tríceps"},
  {key:"Glúteos", label:"Glúteos"},
  {key:"Core", label:"Core"},
  {key:"Chest", label:"Chest"},
  {key:"Back", label:"Back"},
  {key:"Legs", label:"Legs"},
  {key:"Shoulders", label:"Shoulders"},
  {key:"Abdominals", label:"Abdominals"},
];

export function MuscleMap({ volumeByMuscle }:{ volumeByMuscle: Record<string, number> }){
  const max = Math.max(1, ...Object.values(volumeByMuscle));
  // Normalize aliases
  const merged: Record<string, number> = {};
  for(const m of MUSCLES){
    const v = volumeByMuscle[m.key] || 0;
    const normKey = m.label;
    merged[normKey] = (merged[normKey]||0)+v;
  }
  const display = Object.entries(merged).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,8);
  if(display.length===0) display.push(...Object.entries(volumeByMuscle).slice(0,4));
  return (
    <Card>
      <CardHeader><CardTitle>Mapa Muscular <Badge variant="muted">Volumen semanal</Badge></CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {display.length===0 ? <p className="text-sm text-zinc-500 text-center py-4">Sin volumen aún — entrená para ver el mapa.</p> : display.map(([muscle, vol])=>{
          const pct = Math.round((vol/max)*100);
          return (
            <div key={muscle} className="flex items-center gap-3">
              <span className="text-xs font-bold w-24 shrink-0">{muscle}</span>
              <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{width:`${pct}%`, background: pct>75?"rgb(var(--primary))": pct>40?"rgb(var(--primary) / 0.55)":"#3f3f46"}} /></div>
              <span className="text-xs font-mono w-10 text-right">{vol}</span>
            </div>
          );
        })}
        <div className="flex gap-2 pt-2">
          <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">Bajo</span>
          <span className="text-[10px] px-2 py-1 rounded-full bg-primary/55 text-black">Medio</span>
          <span className="text-[10px] px-2 py-1 rounded-full bg-primary text-black font-bold">Alto</span>
        </div>
      </CardContent>
    </Card>
  );
}
