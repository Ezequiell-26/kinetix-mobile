"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, RefreshCw, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";

type Muscle = "Pecho"|"Espalda"|"Piernas"|"Hombros"|"Brazos"|"Core"|"Glúteos";
type WorkoutLog = { date:string; sets?:Array<{exerciseName:string; weight?:number|null; reps?:number|null}> };
const MUSCLES: Muscle[]=["Pecho","Espalda","Piernas","Hombros","Brazos","Core","Glúteos"];
const KEYWORDS: Record<Muscle,string[]>={
  Pecho:["press","banca","pecho","fly","apertura","fondos"],
  Espalda:["remo","jalón","jalon","dominada","pulldown","pull up","espalda"],
  Piernas:["sentadilla","prensa","extensión","extension","curl femoral","cuádriceps","cuadriceps","zancada"],
  Hombros:["press militar","militar","lateral","deltoide","elevación lateral","elevacion lateral"],
  Brazos:["bíceps","biceps","tríceps","triceps","curl","pushdown","martillo"],
  Core:["abdominal","plancha","core","crunch","elevación de piernas","elevacion de piernas"],
  Glúteos:["hip thrust","glúteo","gluteo","patada","abducción","abduccion","puente"],
};
function muscleForExercise(name:string): Muscle|null { const n=name.toLowerCase(); for(const muscle of MUSCLES){if(KEYWORDS[muscle].some(k=>n.includes(k))) return muscle;} return null; }
function freshnessFor(hours:number){ if(hours<24) return {pct:22,status:"fatigado" as const}; if(hours<48) return {pct:58,status:"recuperando" as const}; return {pct:100,status:"fresco" as const}; }

export function FitbodAdaptive(){
  const [logs,setLogs]=useState<WorkoutLog[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);
  const [adapted,setAdapted]=useState(false);
  useEffect(()=>{let cancelled=false;fetch("/api/workout-logs",{cache:"no-store"}).then(async r=>{const d=await r.json();if(!r.ok) throw new Error(d?.error||"No se pudo cargar el historial.");return Array.isArray(d)?d:[];}).then(d=>{if(!cancelled)setLogs(d);}).catch(e=>{if(!cancelled)setError(e instanceof Error?e.message:"No se pudo cargar el historial.");}).finally(()=>{if(!cancelled)setLoading(false);});return()=>{cancelled=true;}},[]);
  const muscles=useMemo(()=>MUSCLES.map(name=>{const matched=logs.flatMap(log=>(log.sets||[]).map(set=>({date:new Date(log.date),exercise:set.exerciseName}))).filter(x=>muscleForExercise(x.exercise)===name);const latest=matched.sort((a,b)=>b.date.getTime()-a.date.getTime())[0];const hours=latest?Math.max(0,(Date.now()-latest.date.getTime())/3600000):168;const f=freshnessFor(hours);return {name,...f,hours:Math.round(hours)};}),[logs]);
  const freshest=muscles.filter(m=>m.pct>=100).map(m=>m.name).slice(0,2).join(" + ")||"ningún grupo claramente fresco";
  const fatigued=muscles.filter(m=>m.pct<30).map(m=>m.name).join(", ");
  return <Card className="border-primary/20 bg-[#0B151E]">
    <CardHeader><CardTitle className="flex items-center gap-2"><Brain size={16} className="text-primary"/> Adaptación de entrenamiento <Badge variant="accent">Basada en historial</Badge></CardTitle><p className="text-xs text-[#8193A5]">Estima recuperación a partir de tus sesiones registradas. No sustituye criterio del coach.</p></CardHeader>
    <CardContent className="space-y-4">
      {loading&&<div className="flex items-center justify-center gap-2 py-6 text-xs text-[#8193A5]"><Loader2 size={15} className="animate-spin"/> Analizando historial...</div>}
      {error&&<div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-200">{error}</div>}
      {!loading&&!error&&<>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{muscles.slice(0,4).map(m=><div key={m.name} className={`rounded-xl border p-2 text-center ${m.status==="fatigado"?"border-red-500/20 bg-red-500/10":m.status==="recuperando"?"border-amber-500/20 bg-amber-500/10":"border-primary/15 bg-primary/5"}`}><p className="text-[11px] font-bold">{m.name}</p><Progress value={m.pct} className="mt-1 h-1.5"/><p className="mt-1 text-[11px]">{m.pct}% · {m.status}</p><p className="text-[10px] text-[#8193A5]">{m.hours>=168?"Sin registro":`${m.hours}h`}</p></div>)}</div>
        {fatigued&&<div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-100"><AlertTriangle size={14} className="shrink-0 text-amber-300"/> {fatigued} figura con fatiga reciente según las sesiones registradas.</div>}
        <div className="rounded-xl border border-primary/15 bg-primary/5 p-3 text-xs"><span className="font-bold text-primary">Señal actual:</span> grupos más frescos: {freshest}.</div>
        <div className="rounded-xl border border-white/[0.06] bg-[#081119] p-3 text-xs leading-5 text-[#8193A5]">La adaptación automática completa requiere reglas de programación más profundas y, para recomendaciones generativas, un proveedor de IA real. Esta vista no inventa cargas ni resultados.</div>
        <Button variant={adapted?"outline":"accent"} className="w-full" onClick={()=>setAdapted(v=>!v)}><RefreshCw size={14} className="mr-2"/>{adapted?"Ocultar orientación":"Ver orientación de recuperación"}</Button>
        {adapted&&<div className="rounded-xl border border-primary/15 bg-primary/5 p-3 text-xs"><div className="flex items-center gap-2 font-bold text-white"><TrendingUp size={14} className="text-primary"/> Orientación</div><p className="mt-1 text-[#8193A5]">Priorizá grupos con mayor tiempo desde la última sesión registrada y revisá manualmente cualquier ajuste de volumen, intensidad o ejercicio.</p></div>}
      </>}
    </CardContent>
  </Card>;
}
