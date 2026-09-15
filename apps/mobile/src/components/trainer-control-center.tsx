"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Users, Clock, Flame, Target, Mail, Loader2 } from "lucide-react";

type ApiClient = {
  id: string;
  name: string;
  goal: string;
  status: string;
  assignedProgram?: { frequency?: number | null } | null;
};

type ApiLog = {
  id: string;
  clientId?: string | null;
  date: string;
  sets?: Array<{ exerciseName?: string; weight?: number | null; reps?: number | null }>;
};

type ClientRow = {
  id: string;
  name: string;
  goal: string;
  adherence: number;
  lastWorkoutDaysAgo: number;
  streak: number;
  volumeWeek: number;
  prs: number;
  checkinPending: boolean;
};

function daysAgo(date: string) {
  const value = new Date(date).getTime();
  if (!Number.isFinite(value)) return 999;
  return Math.max(0, Math.floor((Date.now() - value) / 86_400_000));
}

function computeStreak(dates: string[]) {
  const unique = [...new Set(dates.map((date) => new Date(date).toISOString().slice(0, 10)))].sort().reverse();
  if (!unique.length) return 0;
  let streak = 0;
  let cursor = new Date(unique[0] + "T12:00:00");
  for (const day of unique) {
    const current = new Date(day + "T12:00:00");
    const diff = Math.round((cursor.getTime() - current.getTime()) / 86_400_000);
    if (diff > 1) break;
    streak += 1;
    cursor = current;
  }
  return streak;
}

function computePrs(logs: ApiLog[]) {
  const byExercise = new Map<string, { recent: number; previous: number }>();
  for (const log of logs) {
    const age = daysAgo(log.date);
    for (const set of log.sets || []) {
      const weight = typeof set.weight === "number" && Number.isFinite(set.weight) ? set.weight : 0;
      if (!weight) continue;
      const exercise = String(set.exerciseName || "Ejercicio").toLowerCase();
      const entry = byExercise.get(exercise) || { recent: 0, previous: 0 };
      if (age <= 30) entry.recent = Math.max(entry.recent, weight);
      else if (age <= 60) entry.previous = Math.max(entry.previous, weight);
      byExercise.set(exercise, entry);
    }
  }
  let prs = 0;
  for (const value of byExercise.values()) if (value.recent > 0 && value.recent > value.previous) prs += 1;
  return prs;
}

export function TrainerControlCenter(){
  const [clients, setClients] = useState<ApiClient[]>([]);
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"todos"|"riesgo"|"estancado"|"top">("todos");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [clientsResponse, logsResponse] = await Promise.all([
          fetch("/api/clients", { cache: "no-store" }),
          fetch("/api/workout-logs", { cache: "no-store" }),
        ]);
        const [clientsPayload, logsPayload] = await Promise.all([
          clientsResponse.json(),
          logsResponse.json(),
        ]);
        if (!clientsResponse.ok) throw new Error(clientsPayload?.error || "No se pudieron cargar los clientes.");
        if (!logsResponse.ok) throw new Error(logsPayload?.error || "No se pudieron cargar los entrenamientos.");
        if (!cancelled) {
          setClients(Array.isArray(clientsPayload) ? clientsPayload : []);
          setLogs(Array.isArray(logsPayload) ? logsPayload : []);
        }
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "No se pudo cargar el control de clientes.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const enriched = useMemo(() => clients.map((client) => {
    const clientLogs = logs.filter((log) => log.clientId === client.id);
    const recent28 = clientLogs.filter((log) => daysAgo(log.date) <= 28);
    const frequency = Math.max(1, Number(client.assignedProgram?.frequency || 3));
    const expected = frequency * 4;
    const adherence = Math.min(100, Math.round((recent28.length / expected) * 100));
    const lastWorkoutDaysAgo = clientLogs.length ? Math.min(...clientLogs.map((log) => daysAgo(log.date))) : 999;
    const volumeWeek = clientLogs.filter((log) => daysAgo(log.date) <= 7).reduce((total, log) => total + (log.sets || []).reduce((sum, set) => sum + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0), 0);
    const status = lastWorkoutDaysAgo >= 5 || adherence < 50 ? "riesgo" : computePrs(clientLogs) === 0 && adherence < 75 ? "estancado" : adherence >= 90 && computeStreak(clientLogs.map((log) => log.date)) >= 7 ? "top" : "ok";
    return {
      id: client.id,
      name: client.name,
      goal: client.goal,
      adherence,
      lastWorkoutDaysAgo,
      streak: computeStreak(clientLogs.map((log) => log.date)),
      volumeWeek: Math.round(volumeWeek),
      prs: computePrs(clientLogs),
      checkinPending: false,
      status,
      reason: status === "riesgo" ? `${lastWorkoutDaysAgo >= 999 ? "Sin entrenamientos" : `${lastWorkoutDaysAgo}d sin entrenar`} • ${adherence}% adherencia` : status === "estancado" ? "Sin PRs recientes + adherencia por debajo del objetivo" : status === "top" ? `Racha ${computeStreak(clientLogs.map((log) => log.date))}d • ${Math.round(volumeWeek).toLocaleString("es-AR")}kg` : `${adherence}% adherencia`,
    };
  }), [clients, logs]);

  const filtered = enriched.filter((client) => filter === "todos" || client.status === filter);
  const counts = {
    todos: enriched.length,
    riesgo: enriched.filter((client) => client.status === "riesgo").length,
    estancado: enriched.filter((client) => client.status === "estancado").length,
    top: enriched.filter((client) => client.status === "top").length,
  };

  return (
    <Card className="border-primary/20 bg-[#0B151E]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white"><Users size={18} className="text-primary"/> Control de clientes</CardTitle>
        <p className="text-xs text-[#8193A5]">Señales calculadas a partir de tus clientes y entrenamientos registrados.</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1">
          {[
            {id:"todos", label:`Todos (${counts.todos})`},
            {id:"riesgo", label:`Atención (${counts.riesgo})`},
            {id:"estancado", label:`Estancados (${counts.estancado})`},
            {id:"top", label:`Racha (${counts.top})`},
          ].map((item) => (
            <button key={item.id} type="button" onClick={() => setFilter(item.id as typeof filter)} className={`rounded-full border px-3 py-1.5 text-xs font-bold whitespace-nowrap transition ${filter===item.id ? "border-primary bg-primary text-black" : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white"}`}>{item.label}</button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && <div className="flex items-center justify-center gap-2 py-8 text-xs text-[#8193A5]"><Loader2 size={15} className="animate-spin"/> Cargando datos reales...</div>}
        {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-200"><AlertTriangle size={15} className="mt-0.5 shrink-0"/>{error}</div>}
        {!loading && !error && filtered.map((client) => (
          <div key={client.id} className={`flex items-center gap-3 rounded-xl border p-3 ${client.status==="riesgo"?"border-red-500/20 bg-red-500/5":client.status==="estancado"?"border-amber-500/20 bg-amber-500/5":client.status==="top"?"border-primary/20 bg-primary/5":"border-white/[0.06] bg-white/[0.02]"}`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${client.status==="riesgo"?"bg-red-500 text-white":client.status==="estancado"?"bg-amber-500 text-white":client.status==="top"?"bg-primary text-black":"bg-white/[0.06] text-zinc-300"}`}>{client.name.charAt(0).toUpperCase()}</div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-bold text-white">{client.name} {client.status==="top" && <Flame size={12} className="text-primary"/>}</p>
              <p className="truncate text-xs text-[#8193A5]">{client.goal} • {client.reason}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-zinc-500"><span className="flex items-center gap-1"><Target size={10}/> {client.adherence}%</span><span className="flex items-center gap-1"><Clock size={10}/> {client.lastWorkoutDaysAgo===999?"Nunca":client.lastWorkoutDaysAgo===0?"Hoy":`${client.lastWorkoutDaysAgo}d`}</span><span className="flex items-center gap-1"><TrendingUp size={10}/> {client.volumeWeek.toLocaleString("es-AR")}kg</span><span>{client.prs} PRs</span></div>
            </div>
            <div className="flex flex-col gap-1">
              <Link href={`/trainer/messages?with=${encodeURIComponent(client.id)}`}><Button size="sm" variant={client.status==="riesgo"?"accent":"outline"} className="h-8 text-xs"><Mail size={12}/> Mensaje</Button></Link>
              <Link href={`/trainer/clients/${client.id}`}><Button size="sm" variant="ghost" className="h-7 text-[11px]">Ver ficha →</Button></Link>
            </div>
          </div>
        ))}
        {!loading && !error && filtered.length===0 && <p className="py-8 text-center text-xs text-[#8193A5]">No hay clientes en esta categoría.</p>}
      </CardContent>
    </Card>
  );
}
