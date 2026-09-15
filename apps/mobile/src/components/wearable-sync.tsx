"use client";

import * as React from "react";
import { Activity, Award, Link2, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface WearableData {
  steps?: number;
  distance?: number;
  calories?: number;
  heartRate?: number;
  sleepHours?: number;
  activeMinutes?: number;
  floors?: number;
}

type Provider = "apple-health" | "google-fit" | "garmin" | "fitbit" | "polar";
interface WearableSyncProps {
  provider: Provider;
  isConnected: boolean;
  onConnect?: () => void | Promise<void>;
  onDisconnect?: () => void | Promise<void>;
  onDataSync?: (data: WearableData) => void;
  data?: WearableData | null;
  lastSync?: Date;
}

const configs: Record<Provider, { name: string; icon: string }> = {
  "apple-health": { name: "Apple Health", icon: "Apple" },
  "google-fit": { name: "Google Fit", icon: "Google" },
  garmin: { name: "Garmin Connect", icon: "Garmin" },
  fitbit: { name: "Fitbit", icon: "Fitbit" },
  polar: { name: "Polar Flow", icon: "Polar" },
};

const percent = (value: number | undefined, goal: number) => value == null ? 0 : Math.min(100, Math.max(0, (value / goal) * 100));

export function WearableSync({ provider, isConnected, onConnect, onDisconnect, onDataSync, data = null, lastSync }: WearableSyncProps) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const config = configs[provider];

  async function connect() {
    if (!onConnect) {
      setError(`La conexión con ${config.name} todavía no está configurada en este entorno.`);
      return;
    }
    setBusy(true); setError(null);
    try { await onConnect(); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo conectar el dispositivo."); }
    finally { setBusy(false); }
  }

  async function disconnect() {
    if (!onDisconnect) return;
    setBusy(true); setError(null);
    try { await onDisconnect(); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo desconectar."); }
    finally { setBusy(false); }
  }

  async function sync() {
    if (!onConnect) {
      setError(`La sincronización con ${config.name} todavía no está configurada.`);
      return;
    }
    setBusy(true); setError(null);
    try {
      await onConnect();
      if (data && onDataSync) onDataSync(data);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo sincronizar."); }
    finally { setBusy(false); }
  }

  if (!isConnected) {
    return <Card className="w-full border-white/[0.07] bg-[#0B151E]"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Link2 size={17} className="text-primary" /> {config.name}</CardTitle></CardHeader><CardContent className="space-y-3"><p className="text-sm text-[#8193A5]">Conectá una fuente de actividad para importar métricas reales. KinetixFitt no genera valores simulados.</p>{error && <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-200">{error}</div>}<button type="button" onClick={() => void connect()} disabled={busy} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-black text-black disabled:opacity-50">{busy ? "Conectando…" : `Conectar ${config.name}`}</button></CardContent></Card>;
  }

  const steps = data?.steps;
  const calories = data?.calories;
  const active = data?.activeMinutes;
  const sleep = data?.sleepHours;

  return <Card className="w-full border-white/[0.07] bg-[#0B151E]"><CardHeader><div className="flex items-center justify-between gap-3"><CardTitle className="flex items-center gap-2 text-base"><Link2 size={17} className="text-primary" /> {config.name}</CardTitle><Badge variant={busy ? "muted" : "success"}>{busy ? "Sincronizando" : "Conectado"}</Badge></div><p className="mt-1 text-xs text-[#8193A5]">{lastSync ? `Última sincronización: ${lastSync.toLocaleString("es-AR")}` : "Fuente conectada"}</p></CardHeader><CardContent className="space-y-4">{error && <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-200">{error}</div>}{!data && <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 text-sm text-[#8193A5]">Todavía no hay datos importados desde el dispositivo.</div>}{data && <><Metric icon={<Activity size={15} />} label="Pasos" value={steps == null ? "—" : steps.toLocaleString("es-AR")} progress={percent(steps, 10000)} /><Metric icon={<Zap size={15} />} label="Calorías" value={calories == null ? "—" : `${calories.toLocaleString("es-AR")} kcal`} progress={percent(calories, 2500)} /><Metric icon={<TrendingUp size={15} />} label="Minutos activos" value={active == null ? "—" : `${active} min`} progress={percent(active, 60)} /><Metric icon={<Award size={15} />} label="Sueño" value={sleep == null ? "—" : `${sleep} h`} progress={percent(sleep, 8)} /></>}{data && <div className="grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4 text-center"><Stat label="Distancia" value={data.distance == null ? "—" : `${data.distance} km`} /><Stat label="Frecuencia" value={data.heartRate == null ? "—" : `${data.heartRate} bpm`} /><Stat label="Pisos" value={data.floors == null ? "—" : String(data.floors)} /></div>}<button type="button" onClick={() => void sync()} disabled={busy} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy ? "Sincronizando…" : "Sincronizar ahora"}</button><button type="button" onClick={() => void disconnect()} disabled={busy} className="w-full py-1 text-xs font-semibold text-red-300">Desconectar</button></CardContent></Card>;
}

function Metric({ icon, label, value, progress }: { icon: React.ReactNode; label: string; value: string; progress: number }) { return <div className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-[#9AAABB]">{icon}{label}</span><span className="font-bold text-white">{value}</span></div><Progress value={progress} className="h-1.5" /></div>; }
function Stat({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] uppercase tracking-[0.12em] text-[#617384]">{label}</p><p className="mt-1 text-sm font-bold text-white">{value}</p></div>; }

export function useWearableSync() {
  const [connectedProviders, setConnectedProviders] = React.useState<Provider[]>([]);
  const [lastSyncDates, setLastSyncDates] = React.useState<Record<string, Date>>({});
  const [aggregatedData, setAggregatedData] = React.useState<WearableData | null>(null);

  const connectProvider = React.useCallback(async (_provider: Provider) => {
    throw new Error("Este proveedor requiere integración OAuth/nativa real antes de conectarse.");
  }, []);
  const disconnectProvider = React.useCallback(async (provider: Provider) => {
    setConnectedProviders((current) => current.filter((value) => value !== provider));
    setLastSyncDates((current) => { const next = { ...current }; delete next[provider]; return next; });
  }, []);
  const aggregateData = React.useCallback((sources: WearableData[]): WearableData => {
    if (!sources.length) return {};
    const valid = <K extends keyof WearableData>(key: K) => sources.map((source) => source[key]).filter((value): value is number => typeof value === "number" && Number.isFinite(value));
    const averages = valid("heartRate");
    return {
      steps: valid("steps").reduce((sum, value) => sum + value, 0),
      distance: valid("distance").reduce((sum, value) => sum + value, 0),
      calories: valid("calories").reduce((sum, value) => sum + value, 0),
      heartRate: averages.length ? Math.round(averages.reduce((sum, value) => sum + value, 0) / averages.length) : undefined,
      sleepHours: valid("sleepHours").reduce((sum, value) => sum + value, 0),
      activeMinutes: valid("activeMinutes").reduce((sum, value) => sum + value, 0),
      floors: valid("floors").reduce((sum, value) => sum + value, 0),
    };
  }, []);

  return { connectedProviders, lastSyncDates, aggregatedData, connectProvider, disconnectProvider, aggregateData, setAggregatedData };
}
