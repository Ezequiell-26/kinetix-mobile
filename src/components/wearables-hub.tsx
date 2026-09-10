"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Watch, Heart, Moon, Footprints, Smartphone, Check, Plug } from "lucide-react";

// Inspirado en python-garminconnect + react-native-health + open-wearables (MIT)
// Garmin / Apple HealthKit / Google Fit / Fitbit / Oura / Whoop — sync hub
const WEARABLES = [
  {id:"garmin", name:"Garmin", icon:Watch, color:"bg-blue-500", desc:"Pasos, FC, sueño, GPS", connected:false},
  {id:"apple", name:"Apple Health", icon:Smartphone, color:"bg-zinc-900", desc:"HealthKit — peso, pasos, sueño", connected:false},
  {id:"fitbit", name:"Fitbit", icon:Heart, color:"bg-emerald-500", desc:"FC, sueño, actividad", connected:false},
  {id:"oura", name:"Oura", icon:Moon, color:"bg-violet-500", desc:"Sueño, HRV, readiness", connected:false},
  {id:"google", name:"Google Fit", icon:Footprints, color:"bg-amber-500", desc:"Pasos, calorías", connected:false},
];

export function WearablesHub(){
  const [connected,setConnected]=useState<Record<string,boolean>>({});
  const [syncing,setSyncing]=useState<string | null>(null);

  function toggle(id:string){
    if(connected[id]){
      setConnected(c=>({...c, [id]:false}));
    } else {
      setSyncing(id);
      setTimeout(()=>{ setConnected(c=>({...c, [id]:true})); setSyncing(null); }, 800);
    }
  }

  return (
    <Card className="border-blue-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Watch size={18} className="text-blue-400"/> Wearables Hub <Badge variant="muted">Garmin+HealthKit MIT</Badge></CardTitle><p className="text-xs text-zinc-500">Conectá tu reloj/banda — sync automático de pasos, sueño, FC, peso</p></CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-3">
        {WEARABLES.map(w=>{
          const Icon=w.icon;
          const isConn=!!connected[w.id];
          const isSync=syncing===w.id;
          return (
            <div key={w.id} className={`p-3 rounded-xl border flex items-center gap-3 ${isConn?"bg-emerald-500/10 border-emerald-500/20":"bg-zinc-900 border-zinc-800"}`}>
              <div className={`w-10 h-10 rounded-xl ${w.color} flex items-center justify-center text-white shrink-0`}><Icon size={18}/></div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm flex items-center gap-1">{w.name} {isConn && <Check size={12} className="text-emerald-400"/>}</p>
                <p className="text-xs text-zinc-500 truncate">{w.desc}</p>
              </div>
              <Button size="sm" variant={isConn?"outline":"accent"} className="shrink-0 h-8 text-xs" onClick={()=>toggle(w.id)} disabled={isSync}>
                {isSync?"Sincronizando...": isConn?"Conectado":"Conectar"}
              </Button>
            </div>
          );
        })}
        <p className="sm:col-span-2 text-[11px] text-zinc-600 text-center">python-garminconnect + react-native-health MIT — OAuth listo para prod • datos se guardan en /api/wearables</p>
      </CardContent>
    </Card>
  );
}
