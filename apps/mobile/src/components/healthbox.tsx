"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Droplets, Moon, Activity, Smartphone } from "lucide-react";

// Inspirado en HealthBox + open-wearables + Apple Health MIT
// Agregador salud: FC, HRV, pasos, sueño, calorías en 1 lugar
export function HealthBox(){
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Heart size={16} className="text-red-400"/> HealthBox</CardTitle><p className="text-xs text-zinc-500">Todo tu salud en 1 lugar — FC, HRV, pasos, sueño</p></CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center"><Heart size={14} className="mx-auto text-red-400"/><p className="font-black">68 lpm</p><p className="text-[11px] text-zinc-500">FC reposo</p><p className="text-[11px] text-emerald-400">↓ -4</p></div>
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 text-center"><Activity size={14} className="mx-auto text-violet-400"/><p className="font-black">42ms</p><p className="text-[11px] text-zinc-500">HRV</p><p className="text-[11px] text-emerald-400">↑ +3</p></div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center"><Smartphone size={14} className="mx-auto text-zinc-400"/><p className="font-black">8.2k</p><p className="text-[11px] text-zinc-500">Pasos hoy</p><div className="h-1 bg-zinc-800 rounded-full overflow-hidden mt-1"><div className="h-full bg-primary" style={{width:"82%"}} /></div></div>
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-3 text-center"><Moon size={14} className="mx-auto text-sky-400"/><p className="font-black">7.4h</p><p className="text-[11px] text-zinc-500">Sueño</p><p className="text-[11px] text-zinc-500">82/100</p></div>
      </CardContent>
    </Card>
  );
}
