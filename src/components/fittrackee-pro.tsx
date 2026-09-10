"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, Route, Mountain, Timer } from "lucide-react";

// Inspirado en FitTrackee MIT (Ruby, GPX) + workout-tracker Go — https://github.com/SamR1/FitTrackee
// Activity tracking: mapa, elevación, velocidad, calorías
export function FitTrackeePro(){
  return (
    <Card className="border-emerald-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Map size={16} className="text-emerald-400"/> FitTrackee Pro <Badge variant="muted">FitTrackee MIT</Badge></CardTitle><p className="text-xs text-zinc-500">Mapa GPX + elevación + velocidad — Ruby + GPX</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="h-32 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center gap-1">
          <Route size={20} className="text-emerald-400"/>
          <p className="text-xs font-bold">Bosque Palermo — 8.4km</p>
          <p className="text-[11px] text-zinc-500">Elevación +245m • 42:18 • 5:02/km • 420 kcal</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-center"><Mountain size={14} className="mx-auto text-amber-400"/><p className="font-black">+245m</p><p className="text-[11px] text-zinc-500">Desnivel</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-center"><Timer size={14} className="mx-auto text-zinc-400"/><p className="font-black">5:02/km</p><p className="text-[11px] text-zinc-500">Ritmo</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-center"><Map size={14} className="mx-auto text-emerald-400"/><p className="font-black">420 kcal</p><p className="text-[11px] text-zinc-500">Calorías</p></div>
        </div>
        <p className="text-[11px] text-zinc-600 text-center">FitTrackee MIT (Ruby, GPX) — mapa + elevación</p>
      </CardContent>
    </Card>
  );
}
