"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Map, Users, MessageCircle, Route } from "lucide-react";

// Inspirado en runFlutterRun MIT (Flutter + Java, outdoor tracker + social)
// https://github.com/BenjaminCanape/RunFlutterRun — outdoor activity + comments
export function RunTracker(){
  return (
    <Card className="border-emerald-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Map size={16} className="text-emerald-400"/> Run Social</CardTitle><p className="text-xs text-zinc-500">Outdoor tracker + social: corre, comparte, comenta</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="h-32 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center gap-1">
          <Route size={20} className="text-emerald-400"/>
          <p className="text-xs font-bold">Última corrida — 5.2km • 28:14 • 5:25/km</p>
          <p className="text-[11px] text-zinc-500">Parque Sarmiento • GPX cargado</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-2">
          <div className="flex gap-2 items-center"><div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-black text-[11px]">S</div><p className="text-xs"><span className="font-bold">Sofía:</span> ¡Qué ritmo! </p></div>
          <div className="flex gap-2 items-center"><div className="w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center font-black text-[11px]">E</div><p className="text-xs"><span className="font-bold">Tu coach:</span> Excelente, subimos 500m la próxima.</p></div>
          <div className="flex gap-2">
            <input placeholder="Comentar..." className="flex-1 h-8 px-3 bg-zinc-950 border border-zinc-800 rounded-full text-xs text-white placeholder:text-zinc-500" />
            <Button size="sm" variant="accent" className="h-8 w-8 p-0 rounded-full"><MessageCircle size={14}/></Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1"><Users size={14} className="mr-1"/> Ver feed</Button>
          <Button variant="accent" size="sm" className="flex-1">Compartir run</Button>
        </div>
      </CardContent>
    </Card>
  );
}
