"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

// Inspirado en Workout.cool MIT — Coaching + rutinas + progreso + ejercicios
export function WorkoutCoolBanner(){
  return (
    <Card className="bg-gradient-to-br from-violet-500/10 via-zinc-900 to-zinc-900 border-violet-500/20">
      <CardContent className="pt-4 flex gap-3 items-center">
        <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center"><Sparkles size={18} className="text-white"/></div>
        <div className="flex-1">
          <p className="text-sm font-bold flex items-center gap-2">Workout.cool <Badge variant="muted">MIT</Badge></p>
          <p className="text-xs text-zinc-400">Coaching + rutinas + progreso — tu biblioteca 100 + Gym Mode + PRs inspirados en Workout.cool</p>
        </div>
      </CardContent>
    </Card>
  );
}
