"use client";
import { Badge } from "@/components/ui/badge";
import { TimersHub } from "@/components/timers-hub";
import { OpenHiitPro } from "@/components/openhiit-pro";
import { HiitTimer } from "@/components/hiit-timer";

export default function TimersPage(){
  return (
    <div className="space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-display font-bold">Cronómetros PRO</h1>
        <p className="text-sm text-zinc-500">Todos los timers en un lugar — Tabata, EMOM, Pomodoro, Descanso</p>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <Badge variant="accent">Tabata</Badge>
        <Badge variant="muted">EMOM</Badge>
        <Badge variant="muted">AMRAP</Badge>
        <Badge variant="muted">For Time</Badge>
        <Badge variant="muted">Pomodoro</Badge>
      </div>
      <TimersHub />
      <OpenHiitPro />
      <HiitTimer />
    </div>
  );
}
