"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Activity, Loader2, AlertTriangle } from "lucide-react";

type Summary = { streak:number; adherence:number; frequency:number; totalWorkouts:number };
function predict(streak:number, entrenos7d:number, adherence:number, diasSin:number){
  const consistency=Math.min(entrenos7d/Math.max(1,4),1)*0.4;
  const adherenceScore=Math.min(adherence/100,1)*0.35;
  const recency=Math.max(0,1-diasSin/7)*0.25;
  const p=Math.max(0,Math.min(1,consistency+adherenceScore+recency));
  return p;
}

export function StreakPrediction() {
  const [summary,setSummary]=useState<Summary|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);
  const [expanded,setExpanded]=useState(false);
  const [todayDone,setTodayDone]=useState(false);
  useEffect(()=>{let cancelled=false;Promise.all([fetch("/api/workout-logs/summary",{cache:"no-store"}),fetch("/api/workout-logs",{cache:"no-store"})]).then(async([sr,lr])=>{const s=await sr.json();const l=await lr.json();if(!sr.ok)throw new Error(s?.error||"No se pudo cargar el resumen.");const arr=Array.isArray(l)?l:[];const today=new Date().toISOString().slice(0,10);if(!cancelled){setSummary(s);setTodayDone(arr.some((x:{date:string;completed?:boolean})=>x.completed!==false&&String(x.date).slice(0,10)===today));}}).catch(e=>{if(!cancelled)setError(e instanceof Error?e.message:"No se pudo cargar la predicción.");}).finally(()=>{if(!cancelled)setLoading(false);});return()=>{cancelled=true}},[]);
  const model=useMemo(()=>{if(!summary)return null;const diasSin=todayDone?0:1;const entrenos7d=Math.min(summary.frequency,7);return {diasSin,entrenos7d,pct:Math.round(predict(summary.streak,entrenos7d,summary.adherence,diasSin)*100)}},[summary,todayDone]);
  return <Card className="border-primary/20 bg-[#0B151E]"><CardHeader><CardTitle className="flex items-center gap-2"><Flame size={16} className="text-primary"/> Continuidad de entrenamiento <Badge variant="accent">Estimación</Badge></CardTitle><p className="text-xs text-[#8193A5]">Calculada desde tus datos registrados; no es un modelo entrenado ni una probabilidad clínica.</p></CardHeader><CardContent className="space-y-4">{loading&&<div className="flex items-center justify-center gap-2 py-6 text-xs text-[#8193A5]"><Loader2 size={15} className="animate-spin"/> Analizando actividad...</div>}{error&&<div role="alert" className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-200"><AlertTriangle size={14}/>{error}</div>}{!loading&&!error&&model&&summary&&<><div className="rounded-2xl border border-white/[0.06] bg-[#081119] p-5 text-center"><div className="mx-auto grid h-28 w-28 place-items-center rounded-full border-4 border-primary/30 bg-primary/5"><div><div className="text-3xl font-black text-primary">{model.pct}%</div><div className="text-[10px] font-bold text-[#8193A5]">continuidad estimada</div></div></div><p className="mt-4 text-sm font-black text-white">{todayDone?"Entrenamiento registrado hoy":"Todavía podés mantener la continuidad"}</p><p className="mt-1 text-xs text-[#8193A5]">Racha actual: {summary.streak} días · Adherencia: {summary.adherence}%</p></div><div className="grid grid-cols-3 gap-2 text-xs"><div className="rounded-xl border border-[#1C3142] bg-[#081119] p-3"><Activity size={14} className="text-primary"/><strong className="mt-1 block">{summary.totalWorkouts}</strong><span className="text-[#8193A5]">sesiones</span></div><div className="rounded-xl border border-[#1C3142] bg-[#081119] p-3"><Flame size={14} className="text-orange-300"/><strong className="mt-1 block">{summary.streak}d</strong><span className="text-[#8193A5]">racha</span></div><div className="rounded-xl border border-[#1C3142] bg-[#081119] p-3"><strong className="block">{summary.frequency}/sem</strong><span className="text-[#8193A5]">objetivo</span></div></div><Button variant="outline" className="w-full" onClick={()=>setExpanded(v=>!v)}>{expanded?"Ocultar detalle":"Ver cómo se calcula"}</Button>{expanded&&<div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs leading-5 text-[#8193A5]">La estimación combina de forma transparente consistencia semanal, adherencia y recencia. No utiliza pesos entrenados ni afirma que pueda predecir el comportamiento futuro con certeza.</div>}</>}</CardContent></Card>;
}
