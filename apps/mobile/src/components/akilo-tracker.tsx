"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scale, Droplets, Ruler, Activity, CheckCircle2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { chartAxisTick, chartTooltipStyle, chartTooltipItemStyle } from "@/lib/chart-theme";

// Inspirado en Akilo MIT (nutrición + alimentos + agua + peso + analytics) + LibreFit MIT (biblioteca + tracking)
export function AkiloTracker({ measurements }:{ measurements?: Array<{date:string; weight:number|null; bodyFat:number|null; waist:number|null}> }){
  const [weight,setWeight]=useState("81.2");
  const [waist,setWaist]=useState("82");
  const [bodyFat,setBodyFat]=useState("14.5");
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const [error,setError]=useState("");
  const data = measurements?.length ? measurements : [
    {date:"S1", weight:82.4, bodyFat:15.2, waist:84},
    {date:"S2", weight:81.8, bodyFat:14.9, waist:83},
    {date:"S3", weight:81.2, bodyFat:14.5, waist:82},
    {date:"S4", weight:80.9, bodyFat:14.1, waist:81},
  ];
  return (
    <Card className="border-sky-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Scale size={16} className="text-sky-400"/> Akilo — Peso + Medidas</CardTitle><p className="text-xs text-zinc-500">Analytics premium: peso, grasa, cintura + registro rápido</p></CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" tick={chartAxisTick} axisLine={false} tickLine={false} />
              <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} domain={["dataMin -1", "dataMax +1"]} />
              <Tooltip contentStyle={chartTooltipStyle} itemStyle={chartTooltipItemStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Line type="monotone" dataKey="weight" stroke="var(--primary)" strokeWidth={2} dot={{r:3}} name="Peso" />
              <Line type="monotone" dataKey="bodyFat" stroke="#f59e0b" strokeWidth={2} dot={{r:2}} name="% Grasa" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center"><Scale size={16} className="mx-auto text-zinc-400"/><p className="text-xs text-zinc-500 mt-1">Peso</p><p className="font-black">{weight} kg</p><Input value={weight} onChange={e=>setWeight(e.target.value)} className="mt-1 h-8 text-center text-xs" placeholder="81.2" /></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center"><Activity size={16} className="mx-auto text-amber-400"/><p className="text-xs text-zinc-500 mt-1">% Grasa</p><p className="font-black">{bodyFat}%</p><Input value={bodyFat} onChange={e=>setBodyFat(e.target.value)} className="mt-1 h-8 text-center text-xs" placeholder="14.5" /></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center"><Ruler size={16} className="mx-auto text-sky-400"/><p className="text-xs text-zinc-500 mt-1">Cintura</p><p className="font-black">{waist} cm</p><Input value={waist} onChange={e=>setWaist(e.target.value)} className="mt-1 h-8 text-center text-xs" placeholder="82" /></div>
        </div>
        <Button
          variant="accent"
          className="w-full min-h-[48px]"
          disabled={saving}
          onClick={async ()=>{
            setSaving(true); setError(""); setSaved(false);
            try{
              const res = await fetch("/api/measurements",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({
                  weight: parseFloat(weight) || null,
                  waist: parseFloat(waist) || null,
                  bodyFat: parseFloat(bodyFat) || null,
                }),
              });
              if(!res.ok) throw new Error("No se pudo guardar");
              setSaved(true);
            }catch{
              setError("No se pudo guardar. Revisá tu conexión.");
            }finally{
              setSaving(false);
            }
          }}
        >
          {saving ? "Guardando..." : saved ? "Guardado ✓" : "Guardar medición"}
        </Button>
        {error && <p role="alert" className="text-xs text-red-400 text-center">{error}</p>}
        {saved && (
          <p className="text-xs text-emerald-400 text-center flex items-center justify-center gap-1">
            <CheckCircle2 size={13} /> Medición registrada en tu progreso
          </p>
        )}
      </CardContent>
    </Card>
  );
}
