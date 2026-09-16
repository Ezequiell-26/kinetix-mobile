"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Flame, Check, Loader2, AlertTriangle } from "lucide-react";

type WorkoutLog = { date: string; completed?: boolean };

function keyOf(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function currentStreak(keys: Set<string>) {
  const cursor = new Date();
  let streak = 0;
  while (keys.has(keyOf(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function bestStreak(keys: Set<string>) {
  const dates = [...keys].sort();
  let best = 0;
  let run = 0;
  let previous: Date | null = null;
  for (const value of dates) {
    const current = new Date(`${value}T12:00:00`);
    if (!previous) run = 1;
    else {
      const gap = Math.round((current.getTime() - previous.getTime()) / 86_400_000);
      run = gap === 1 ? run + 1 : 1;
    }
    best = Math.max(best, run);
    previous = current;
  }
  return best;
}

export function HabitCalendar(){
  const [logs,setLogs]=useState<WorkoutLog[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);

  useEffect(()=>{
    let cancelled=false;
    fetch("/api/workout-logs", { cache:"no-store" })
      .then(async res=>{
        const data=await res.json();
        if(!res.ok) throw new Error(data?.error || "No se pudo cargar tu historial.");
        return data;
      })
      .then(data=>{ if(!cancelled) setLogs(Array.isArray(data)?data:[]); })
      .catch(err=>{ if(!cancelled) setError(err instanceof Error?err.message:"No se pudo cargar el calendario."); })
      .finally(()=>{ if(!cancelled) setLoading(false); });
    return ()=>{cancelled=true;};
  },[]);

  const completedKeys=useMemo(()=>new Set(logs.filter(l=>l.completed!==false).map(l=>keyOf(new Date(l.date)))),[logs]);
  const days=useMemo(()=>Array.from({length:30},(_,i)=>{const d=new Date(); d.setHours(12,0,0,0); d.setDate(d.getDate()-(29-i)); return {date:d,done:completedKeys.has(keyOf(d)),today:i===29};}),[completedKeys]);
  const streak=currentStreak(completedKeys);
  const best=bestStreak(completedKeys);
  const trained=days.filter(d=>d.done).length;

  return (
    <Card className="border-primary/20 bg-[#0B151E]">
      <CardHeader><CardTitle className="flex items-center gap-2 text-white"><Calendar size={16} className="text-primary"/> Calendario de entrenamiento {streak>0 && <Badge variant="accent" className="inline-flex"><Flame size={11} className="mr-1"/> {streak}d</Badge>}</CardTitle><p className="text-xs text-[#8193A5]">Los días se basan en entrenamientos registrados en tu historial.</p></CardHeader>
      <CardContent className="space-y-3">
        {loading && <div className="flex items-center justify-center gap-2 py-8 text-xs text-[#8193A5]"><Loader2 size={15} className="animate-spin"/> Cargando historial...</div>}
        {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-200"><AlertTriangle size={14}/>{error}</div>}
        {!loading && !error && <>
          <div className="grid grid-cols-7 gap-1">
            {["L","M","X","J","V","S","D"].map(d=><div key={d} className="text-center text-[11px] font-bold text-[#8193A5]">{d}</div>)}
            {days.map((d,i)=><div key={i} title={`${d.date.toLocaleDateString("es-AR")}: ${d.done?"entrenaste":"sin entrenamiento registrado"}`} className={`flex aspect-square items-center justify-center rounded-lg border text-[11px] font-bold ${d.today?"border-primary ring-1 ring-primary/30":"border-transparent"} ${d.done?"bg-primary text-black":"bg-[#081119] text-zinc-600"}`}>{d.done?<Check size={12}/>:d.date.getDate()}</div>)}
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-[#1C3142] bg-[#081119] p-3 text-xs">
            <div><span className="block text-[#8193A5]">30 días</span><strong>{trained}</strong></div>
            <div><span className="block text-[#8193A5]">Racha actual</span><strong>{streak} días</strong></div>
            <div><span className="block text-[#8193A5]">Mejor racha</span><strong>{best} días</strong></div>
          </div>
        </>}
      </CardContent>
    </Card>
  );
}
