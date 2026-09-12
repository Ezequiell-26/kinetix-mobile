"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scale, Bluetooth, Weight, Activity } from "lucide-react";

// Inspirado en OpenScale MIT (Bluetooth scale) + FitTrack
// https://github.com/oliexdev/openScale — open source weight & body composition tracker
export function OpenScaleSync(){
  const [connected,setConnected]=useState(false);
  const [weight,setWeight]=useState(81.2);
  return (
    <Card className="border-blue-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Scale size={16} className="text-blue-400"/> OpenScale Sync</CardTitle><p className="text-xs text-zinc-500">Balanza Bluetooth — peso, grasa, músculo, agua, hueso auto-sync</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${connected?"bg-blue-500 text-white":"bg-zinc-800 text-zinc-400"}`}><Bluetooth size={18}/></div>
            <div><p className="font-bold text-sm">Xiaomi Body Comp 2</p><p className="text-xs text-zinc-500">{connected?"Conectada • último: hoy 08:12":"Desconectada"}</p></div>
          </div>
          <Button size="sm" variant={connected?"outline":"accent"} className="h-8 text-xs" onClick={()=>setConnected(!connected)}>{connected?"Desconectar":"Conectar"}</Button>
        </div>
        {connected && (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-center"><Weight size={14} className="mx-auto text-zinc-400"/><p className="font-black">{weight}kg</p><p className="text-[11px] text-zinc-500">Peso</p></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-center"><Activity size={14} className="mx-auto text-amber-400"/><p className="font-black">14.2%</p><p className="text-[11px] text-zinc-500">Grasa</p></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-center"><Scale size={14} className="mx-auto text-emerald-400"/><p className="font-black">46.1%</p><p className="text-[11px] text-zinc-500">Músculo</p></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
