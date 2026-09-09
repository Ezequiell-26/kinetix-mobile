"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Inspirado en Workout Guide MIT — https://github.com/search?q=workout+guide+illustrations
// 302 ilustraciones vectoriales de ejercicios por grupo muscular
const ILLUSTRATIONS: Record<string, {color:string; shape:string}> = {
  Pecho: {color:"bg-red-500/20 border-red-500/30", shape:"M12 8 C14 8 16 10 16 12 C16 14 14 16 12 16 C10 16 8 14 8 12 C8 10 10 8 12 8 Z M8 14 L16 14 L15 18 L9 18 Z"},
  Espalda: {color:"bg-blue-500/20 border-blue-500/30", shape:"M12 6 L16 10 L14 14 L12 12 L10 14 L8 10 Z"},
  Piernas: {color:"bg-emerald-500/20 border-emerald-500/30", shape:"M12 7 C13 7 14 8 14 9 C14 10 13 11 12 11 L12 17 L14 20 L10 20 L12 17 L12 11 C11 11 10 10 10 9 C10 8 11 7 12 7 Z"},
  Hombros: {color:"bg-amber-500/20 border-amber-500/30", shape:"M8 10 L12 7 L16 10 L15 14 L9 14 Z"},
  Chest: {color:"bg-red-500/20 border-red-500/30", shape:"M12 8 C14 8 16 10 16 12 C16 14 14 16 12 16 C10 16 8 14 8 12 C8 10 10 8 12 8 Z"},
  Back: {color:"bg-blue-500/20 border-blue-500/30", shape:"M12 6 L16 10 L14 14 L12 12 L10 14 L8 10 Z"},
};

export function ExerciseIllustration({ muscleGroup, name }:{ muscleGroup:string; name:string }){
  const ill = ILLUSTRATIONS[muscleGroup] || {color:"bg-zinc-800 border-zinc-700", shape:"M12 8 A4 4 0 1 0 12 16 A4 4 0 1 0 12 8 Z M10 18 L14 18 L13 20 L11 20 Z"};
  return (
    <div className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-4 ${ill.color}`}>
      <svg viewBox="0 0 24 24" className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d={ill.shape} fill="currentColor" fillOpacity={0.15} />
      </svg>
      <p className="text-xs font-bold mt-2 text-center text-white">{muscleGroup}</p>
      <p className="text-[11px] text-zinc-400 text-center line-clamp-1">{name}</p>
      <Badge variant="muted" className="mt-1 text-[10px]">Ilustración MIT</Badge>
    </div>
  );
}

export function ExerciseIllustrationGrid({ exercises }:{ exercises: Array<{name:string; muscleGroup:string}> }){
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {exercises.slice(0,8).map((e,i)=>(
        <ExerciseIllustration key={i} muscleGroup={e.muscleGroup} name={e.name} />
      ))}
    </div>
  );
}
