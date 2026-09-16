/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { CollapsibleSection } from "@/components/ui/accordion";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/charts/chart-skeleton";
const PhotoCompare = dynamic(() => import("@/components/photo-compare").then(m => m.PhotoCompare), { ssr: false, loading: () => <ChartSkeleton height={220} /> });
const PrTracker = dynamic(() => import("@/components/pr-tracker").then(m => m.PrTracker), { ssr: false, loading: () => <ChartSkeleton height={180} /> });
const OptiLiftsProgression = dynamic(() => import("@/components/optilifts-progression").then(m => m.OptiLiftsProgression), { ssr: false, loading: () => <ChartSkeleton height={160} /> });
const Achievements = dynamic(() => import("@/components/achievements").then(m => m.Achievements), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const PredictivePlateau = dynamic(() => import("@/components/predictive-plateau").then(m => m.PredictivePlateau), { ssr: false, loading: () => <ChartSkeleton height={160} /> });
const AkiloTracker = dynamic(() => import("@/components/akilo-tracker").then(m => m.AkiloTracker), { ssr: false, loading: () => <ChartSkeleton height={200} /> });
const HealthBox = dynamic(() => import("@/components/healthbox").then(m => m.HealthBox), { ssr: false, loading: () => <ChartSkeleton height={140} /> });
const FitTrackeePro = dynamic(() => import("@/components/fittrackee-pro").then(m => m.FitTrackeePro), { ssr: false, loading: () => <ChartSkeleton height={140} /> });
const SleepTracker = dynamic(() => import("@/components/sleep-tracker").then(m => m.SleepTracker), { ssr: false, loading: () => <ChartSkeleton height={160} /> });
const OpenScaleSync = dynamic(() => import("@/components/openscale-sync").then(m => m.OpenScaleSync), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const SocialShare = dynamic(() => import("@/components/social-share").then(m => m.SocialShare), { ssr: false, loading: () => <ChartSkeleton height={100} /> });
const Challenges = dynamic(() => import("@/components/challenges").then(m => m.Challenges), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const WearablesHub = dynamic(() => import("@/components/wearables-hub").then(m => m.WearablesHub), { ssr: false, loading: () => <ChartSkeleton height={140} /> });
const ExportCenter = dynamic(() => import("@/components/export-center").then(m => m.ExportCenter), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const HevyImportPro = dynamic(() => import("@/components/hevy-import-pro").then(m => m.HevyImportPro), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const RunTracker = dynamic(() => import("@/components/run-tracker").then(m => m.RunTracker), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const GpxTracker = dynamic(() => import("@/components/gpx-tracker").then(m => m.GpxTracker), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const WorkoutTimeline = dynamic(() => import("@/components/workout-timeline").then(m => m.WorkoutTimeline), { ssr: false, loading: () => <ChartSkeleton height={160} /> });
const StreakPrediction = dynamic(() => import("@/components/streak-prediction").then(m => m.StreakPrediction), { ssr: false, loading: () => <ChartSkeleton height={120} /> });
const GraniteOffline = dynamic(() => import("@/components/granite-offline").then(m => m.GraniteOffline), { ssr: false, loading: () => <ChartSkeleton height={100} /> });
const LiftShiftAnalytics = dynamic(() => import("@/components/liftshift-analytics").then(m => m.LiftShiftAnalytics), { ssr: false, loading: () => <ChartSkeleton height={320} /> });
const MuscleMap = dynamic(() => import("@/components/muscle-map").then(m => m.MuscleMap), { ssr: false, loading: () => <ChartSkeleton height={220} /> });
const FileUpload = dynamic(() => import("@/components/file-upload").then(m => m.FileUpload), { ssr: false, loading: () => <ChartSkeleton height={80} /> });
const ExportActions = dynamic(() => import("@/components/export-actions").then(m => m.ExportActions), { ssr: false, loading: () => <div className="h-10" /> });
import { computeStreak, countPRs, weeklyAnalytics, type WeeklyPoint } from "@/lib/stats";
import { Tilt3DSubtle } from "@/components/tilt-3d";
import {
  TrendingUp,
  Dumbbell,
  Scale,
  Camera,
  Plus,
  ArrowDown,
  ArrowUp,
  Activity,
  Trophy,
  Users,
  Flame,
  HeartPulse,
} from "lucide-react";

type Measurement = {
  id: string;
  date: string;
  weight: number | null;
  chest: number | null;
  waist: number | null;
  arm: number | null;
  leg: number | null;
  bodyFat: number | null;
};

type ProgressPhotoItem = {
  id: string;
  url: string;
  date: string;
  note: string | null;
  isPrivate: boolean;
};

type WorkoutLogItem = {
  id: string;
  date: string;
  durationMin: number | null;
  workout: { name: string } | null;
  workoutName?: string | null;
  sets: Array<{
    id: string;
    exerciseName: string;
    setNumber: number;
    weight: number | null;
    reps: number | null;
    rir: number | null;
  }>;
};

/** Agregados exactos (sobre todos los logs) que devuelve /api/workout-logs/summary. */
type Summary = {
  totalWorkouts: number;
  streak: number;
  prs: number;
  adherence: number;
  frequency: number;
  weekly: WeeklyPoint[];
};

export function ProgressClient(){
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [photos, setPhotos] = useState<ProgressPhotoItem[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogItem[]>([]);
  const [checkinsCount, setCheckinsCount] = useState(0);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [programFrequency, setProgramFrequency] = useState<number | null>(null);
  const [muscleByName, setMuscleByName] = useState<Record<string, string>>({});

  // New measurement form
  const [showMeasureForm, setShowMeasureForm] = useState(false);
  const [formWeight, setFormWeight] = useState("");
  const [formWaist, setFormWaist] = useState("");
  const [formChest, setFormChest] = useState("");
  const [formArm, setFormArm] = useState("");
  const [savingMeasure, setSavingMeasure] = useState(false);

  async function loadData(){
    setLoading(true);
    try {
      const [mRes, pRes, wRes, cRes, progRes, exRes, sRes] = await Promise.all([
        fetch("/api/measurements"),
        fetch("/api/progress-photos"),
        fetch("/api/workout-logs"),
        fetch("/api/checkins"),
        fetch("/api/programs"),
        fetch("/api/exercises"),
        fetch("/api/workout-logs/summary")
      ]);
      if (mRes.ok) {
        const m = await mRes.json();
        if (Array.isArray(m)) setMeasurements(m);
      }
      if (pRes.ok) {
        const p = await pRes.json();
        if (Array.isArray(p)) setPhotos(p);
      }
      if (wRes.ok) {
        const w = await wRes.json();
        if (Array.isArray(w)) setWorkoutLogs(w);
      }
      if (cRes.ok) {
        const c = await cRes.json();
        if (Array.isArray(c)) setCheckinsCount(c.length);
      }
      if (progRes.ok) {
        const progs = await progRes.json();
        const mine = Array.isArray(progs) ? progs[0] : null;
        if (mine?.frequency) setProgramFrequency(Number(mine.frequency) || null);
      }
      if (exRes.ok) {
        const exs = await exRes.json();
        if (Array.isArray(exs)) {
          const map: Record<string, string> = {};
          for (const e of exs) map[e.name.toLowerCase()] = e.muscleGroup;
          setMuscleByName(map);
        }
      }
      if (sRes.ok) {
        const sm = await sRes.json();
        if (sm && typeof sm.totalWorkouts === "number") setSummary(sm as Summary);
      }
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
    setLoading(false);
  }

  // Volumen por grupo muscular
  const volumeByMuscle: Record<string, number> = (() => {
    const m: Record<string, number> = {};
    for (const log of workoutLogs) {
      for (const s of log.sets) {
        const group = muscleByName[s.exerciseName.toLowerCase()] ?? "Otros";
        m[group] = (m[group] || 0) + 1;
      }
    }
    return m;
  })();

  const weeklyFrequency = summary?.frequency ?? programFrequency ?? 4;
  const totalWorkouts = summary?.totalWorkouts ?? workoutLogs.length;
  const streak = summary?.streak ?? computeStreak(workoutLogs.map(l => l.date));
  const prs = summary?.prs ?? countPRs(
    workoutLogs.flatMap(l =>
      l.sets.map(s => ({ exerciseName: s.exerciseName, weight: s.weight, date: l.date }))
    )
  );
  const sessionsLast30Days = workoutLogs.filter(
    l => new Date(l.date).getTime() >= Date.now() - 30 * 24 * 60 * 60 * 1000
  ).length;
  const adherence = summary?.adherence
    ?? Math.min(100, Math.round((sessionsLast30Days / (weeklyFrequency * 4)) * 100));
  const weeklyData = summary?.weekly ?? weeklyAnalytics(workoutLogs, measurements, weeklyFrequency);

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddMeasurement(e: React.FormEvent){
    e.preventDefault();
    if (!formWeight && !formWaist && !formChest && !formArm) return;
    setSavingMeasure(true);
    try {
      const res = await fetch("/api/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: formWeight ? parseFloat(formWeight) : null,
          waist: formWaist ? parseFloat(formWaist) : null,
          chest: formChest ? parseFloat(formChest) : null,
          arm: formArm ? parseFloat(formArm) : null,
        })
      });
      if (res.ok) {
        setShowMeasureForm(false);
        setFormWeight("");
        setFormWaist("");
        setFormChest("");
        setFormArm("");
        loadData();
      }
    } catch {}
    setSavingMeasure(false);
  }

  // Derived metrics
  const latestWeight = measurements[0]?.weight ?? null;
  const initialWeight = measurements.length > 1 ? measurements[measurements.length - 1]?.weight ?? null : latestWeight;
  const weightChange = latestWeight !== null && initialWeight !== null
    ? Number((latestWeight - initialWeight).toFixed(1))
    : null;

  // Photos
  const sortedPhotosAsc = [...photos].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const beforePhoto = sortedPhotosAsc[0] || null;
  const currentPhoto = sortedPhotosAsc.length > 1 ? sortedPhotosAsc[sortedPhotosAsc.length - 1] : null;

  // Best lifts
  const exerciseMaxes: Record<string, { maxWeight: number; reps: number; date: string }> = {};
  workoutLogs.forEach(log => {
    (log.sets || []).forEach(st => {
      if (st.weight && st.weight > 0) {
        const existing = exerciseMaxes[st.exerciseName];
        if (!existing || st.weight > existing.maxWeight) {
          exerciseMaxes[st.exerciseName] = {
            maxWeight: st.weight,
            reps: st.reps || 1,
            date: new Date(log.date).toLocaleDateString("es-AR", { day: "numeric", month: "short" })
          };
        }
      }
    });
  });

  return (
    <div className="space-y-5">
      {loadError && (
        <div
          role="alert"
          className="rounded-2xl border border-red-900/50 bg-red-950/30 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
        >
          <p className="text-sm text-zinc-300 flex-1">
            No pudimos cargar tu progreso. Revisá tu conexión e intentá de nuevo.
          </p>
          <button
            onClick={() => { setLoadError(false); loadData(); }}
            className="min-h-[44px] px-5 rounded-full bg-[#34D399] text-black text-sm font-black shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold">Mi Progreso</h1>
          <p className="text-sm text-zinc-500">Métricas reales — Privado entre vos y tu coach</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMeasureForm(!showMeasureForm)}
          className="h-10 text-xs font-bold shrink-0"
        >
          <Plus size={15} className="mr-1.5" /> Registrar Medidas
        </Button>
      </div>

      {/* ── Record Measurement Modal ─────────────────────────── */}
      {showMeasureForm && (
        <Card className="border-primary/30 animate-in fade-in">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Scale size={18} className="text-primary" /> Nuevo Registro de Medidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMeasurement} className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Peso (kg)</Label>
                  <Input type="number" step="0.1" value={formWeight} onChange={e => setFormWeight(e.target.value)} placeholder="Ej: 84.5" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Cintura (cm)</Label>
                  <Input type="number" step="0.5" value={formWaist} onChange={e => setFormWaist(e.target.value)} placeholder="Ej: 86" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Pecho (cm)</Label>
                  <Input type="number" step="0.5" value={formChest} onChange={e => setFormChest(e.target.value)} placeholder="Ej: 102" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Brazo (cm)</Label>
                  <Input type="number" step="0.5" value={formArm} onChange={e => setFormArm(e.target.value)} placeholder="Ej: 36" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowMeasureForm(false)}>Cancelar</Button>
                <Button type="submit" variant="accent" size="sm" disabled={savingMeasure} className="font-bold">
                  {savingMeasure ? "Guardando..." : "Guardar Registro"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ── KPI Strip ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Tilt3DSubtle><Card className="shadow-[0_8px_24px_rgba(0,0,0,0.25)] h-full">
          <CardContent className="p-3.5 text-center">
            <Scale size={15} className="mx-auto text-primary mb-1" />
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Peso</span>
            <p className="text-xl font-black text-white mt-0.5">{latestWeight !== null ? `${latestWeight} kg` : "--"}</p>
            {weightChange !== null && (
              <p className={`text-[11px] font-bold mt-0.5 flex items-center justify-center gap-0.5 ${weightChange <= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                {weightChange <= 0 ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
                {Math.abs(weightChange)} kg
              </p>
            )}
          </CardContent>
        </Card></Tilt3DSubtle>
        <Tilt3DSubtle><Card className="shadow-[0_8px_24px_rgba(0,0,0,0.25)] h-full">
          <CardContent className="p-3.5 text-center">
            <Dumbbell size={15} className="mx-auto text-primary mb-1" />
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Entrenos</span>
            <p className="text-xl font-black text-white mt-0.5">{totalWorkouts}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">completados</p>
          </CardContent>
        </Card></Tilt3DSubtle>
        <Tilt3DSubtle><Card className="shadow-[0_8px_24px_rgba(0,0,0,0.25)] h-full">
          <CardContent className="p-3.5 text-center">
            <Flame size={15} className="mx-auto text-primary mb-1" />
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Racha</span>
            <p className="text-xl font-black text-primary mt-0.5">{streak > 0 ? `${streak} d` : "--"}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">{streak > 0 ? "consecutivos" : "empezá hoy"}</p>
          </CardContent>
        </Card></Tilt3DSubtle>
        <Tilt3DSubtle><Card className="border-primary/20 shadow-[0_8px_24px_rgba(0,0,0,0.25)] h-full">
          <CardContent className="p-3.5 text-center">
            <Camera size={15} className="mx-auto text-primary mb-1" />
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Fotos</span>
            <p className="text-xl font-black text-white mt-0.5">{photos.length}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">privadas</p>
          </CardContent>
        </Card></Tilt3DSubtle>
      </div>

      {/* ══════════════════════════════════════════════════════
          UNIFIED 4-TAB SYSTEM
          ══════════════════════════════════════════════════════ */}
      <Tabs
        tabs={[
          { id: "metricas", label: "Métricas & Tendencias", icon: TrendingUp },
          { id: "fuerza", label: "Fuerza & Récords", icon: Dumbbell },
          { id: "cuerpo", label: "Cuerpo & Fotos", icon: Camera },
          { id: "salud", label: "Músculos & Salud", icon: HeartPulse },
        ]}
        defaultId="metricas"
      >
        {(active: string) => (
          <>
            {/* ── Tab 1: Métricas & Tendencias ──────────────── */}
            {active === "metricas" && (
              <div className="space-y-4">
                {/* Weight evolution */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base">Evolución de Peso</CardTitle>
                    <Badge variant="accent">Historial Real</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {measurements.length === 0 ? (
                      <div className="py-10 text-center text-xs text-zinc-500">
                        No hay datos todavía. Registrá tu primer peso arriba para empezar a ver tu evolución.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {measurements.map((m, idx) => (
                          <div key={m.id} className="flex justify-between items-center p-3 rounded-xl bg-surface-elevated/50 border border-subtle/40 text-xs">
                            <div>
                              <span className="font-bold text-white text-sm">{m.weight ? `${m.weight} kg` : "--"}</span>
                              <p className="text-[11px] text-zinc-500 mt-0.5">
                                {new Date(m.date).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                              </p>
                            </div>
                            {idx === 0 && <Badge variant="accent">Último</Badge>}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Analytics charts */}
                <LiftShiftAnalytics data={weeklyData} />

                {/* Streak & Adherence */}
                <CollapsibleSection
                  title="Logros y constancia"
                  subtitle="XP, racha y predicción de continuidad"
                  icon={<Trophy size={18} />}
                >
                  <Achievements data={{workouts: totalWorkouts, streak, adherence, prs, checkins: checkinsCount}} />
                  <StreakPrediction />
                </CollapsibleSection>

                {/* Community */}
                <CollapsibleSection
                  title="Comunidad"
                  subtitle="Compartir avances y desafíos"
                  icon={<Users size={18} />}
                >
                  <SocialShare />
                  <Challenges />
                </CollapsibleSection>
              </div>
            )}

            {/* ── Tab 2: Fuerza & Récords ───────────────────── */}
            {active === "fuerza" && (
              <div className="space-y-4">
                {/* Best lifts */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base">Mejores Marcas</CardTitle>
                    <Badge variant="accent">PRs</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.keys(exerciseMaxes).length === 0 ? (
                      <div className="py-10 text-center text-xs text-zinc-500">
                        No hay datos todavía. Completá entrenamientos registrando tus series para ver tus cargas máximas.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(exerciseMaxes).map(([name, data]) => (
                          <div key={name} className="flex justify-between items-center p-3 rounded-xl bg-surface-elevated/50 border border-subtle/40 text-xs">
                            <div>
                              <p className="font-bold text-white text-sm">{name}</p>
                              <p className="text-[11px] text-zinc-500 mt-0.5">Registrado el {data.date}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-base font-black text-primary">{data.maxWeight} kg</span>
                              <p className="text-[10px] text-zinc-400">× {data.reps} reps</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* PR Tracker */}
                <PrTracker sets={workoutLogs.flatMap(w=> w.sets.map(s=> ({exerciseName: s.exerciseName, weight: s.weight, reps: s.reps, date: w.date, rir: s.rir})))} />

                {/* Progression */}
                <CollapsibleSection
                  title="Progresión y predicción"
                  subtitle="Tendencias de carga y detección de mesetas"
                  icon={<TrendingUp size={18} />}
                >
                  <OptiLiftsProgression logs={workoutLogs.flatMap(w=> w.sets.map(s=> ({exercise: s.exerciseName, weight: s.weight||0, reps: s.reps||0, rir: s.rir, date: w.date})))} />
                  <PredictivePlateau logs={workoutLogs.flatMap(w=> w.sets.map(s=> ({exercise: s.exerciseName, weight: s.weight||0, reps: s.reps||0, rir: s.rir, date: w.date})))} />
                </CollapsibleSection>

                {/* Body composition */}
                <CollapsibleSection
                  title="Composición corporal"
                  subtitle="Evolución de peso y composición"
                  icon={<Scale size={18} />}
                >
                  <AkiloTracker />
                </CollapsibleSection>

                {/* Timeline */}
                <CollapsibleSection
                  title="Historial de sesiones"
                  subtitle="Línea de tiempo de tus entrenamientos"
                  icon={<Activity size={18} />}
                >
                  <WorkoutTimeline items={workoutLogs.map(w=>({id:w.id, date:w.date, name:w.workout?.name || w.workoutName || "Sesión", durationMin:w.durationMin, sets:w.sets.length, volume: w.sets.reduce((a,s)=>a+((s.weight||0)*(s.reps||0)),0), completed:true}))} />
                </CollapsibleSection>
              </div>
            )}

            {/* ── Tab 3: Cuerpo & Fotos ──────────────────────── */}
            {active === "cuerpo" && (
              <div className="space-y-5">
                {/* Body measurements */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base">Medidas Corporales (cm)</CardTitle>
                    <Badge variant="muted">Historial</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {measurements.filter(m => m.waist || m.chest || m.arm || m.leg).length === 0 ? (
                      <div className="py-10 text-center text-xs text-zinc-500">
                        No hay medidas registradas todavía. Presioná &quot;Registrar Medidas&quot; para cargar tus perímetros.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {measurements
                          .filter(m => m.waist || m.chest || m.arm || m.leg)
                          .map(m => (
                            <div key={m.id} className="p-3.5 rounded-xl bg-surface-elevated/50 border border-subtle/40 text-xs space-y-2">
                              <span className="font-bold text-zinc-400 text-[11px] block">
                                {new Date(m.date).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                              <div className="grid grid-cols-4 gap-2 text-center">
                                <div className="bg-surface/60 p-2 rounded-lg">
                                  <span className="text-[10px] text-zinc-500 block">Cintura</span>
                                  <span className="font-bold text-white text-sm">{m.waist ? `${m.waist} cm` : "—"}</span>
                                </div>
                                <div className="bg-surface/60 p-2 rounded-lg">
                                  <span className="text-[10px] text-zinc-500 block">Pecho</span>
                                  <span className="font-bold text-white text-sm">{m.chest ? `${m.chest} cm` : "—"}</span>
                                </div>
                                <div className="bg-surface/60 p-2 rounded-lg">
                                  <span className="text-[10px] text-zinc-500 block">Brazo</span>
                                  <span className="font-bold text-white text-sm">{m.arm ? `${m.arm} cm` : "—"}</span>
                                </div>
                                <div className="bg-surface/60 p-2 rounded-lg">
                                  <span className="text-[10px] text-zinc-500 block">Pierna</span>
                                  <span className="font-bold text-white text-sm">{m.leg ? `${m.leg} cm` : "—"}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Photo compare */}
                <Card className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Camera size={18} className="text-primary" /> Comparador Antes vs Actual
                    </CardTitle>
                    <Badge variant="muted">Privado</Badge>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <PhotoCompare
                      beforeUrl={beforePhoto?.url}
                      afterUrl={currentPhoto?.url || beforePhoto?.url}
                      beforeLabel={beforePhoto ? `Inicio (${new Date(beforePhoto.date).toLocaleDateString("es-AR", { day: "numeric", month: "short" })})` : "Antes"}
                      afterLabel={currentPhoto ? `Actual (${new Date(currentPhoto.date).toLocaleDateString("es-AR", { day: "numeric", month: "short" })})` : "Actual"}
                    />
                    <div className="pt-2">
                      <FileUpload type="progress" onUploaded={() => loadData()} label="Subir nueva foto de progreso (privada)" />
                      <p className="text-[11px] text-zinc-500 text-center mt-2">
                        Tus fotos son estrictamente confidenciales. Solo vos y KinetixFitt tienen acceso a ellas.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Photo gallery */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Historial de Fotos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {photos.length === 0 ? (
                      <p className="text-xs text-zinc-500 text-center py-8">
                        No hay fotos de progreso cargadas todavía. Subí tu primera foto arriba.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {photos.map(p => (
                          <div key={p.id} className="space-y-1.5 group">
                            <div className="aspect-[3/4] bg-surface-elevated rounded-xl border border-subtle/40 overflow-hidden relative">
                              <Image src={p.url} alt="Progreso" fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition" unoptimized />
                              <span className="absolute top-2 right-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[10px] text-zinc-300">
                                Privada
                              </span>
                            </div>
                            <p className="text-xs text-center font-semibold text-white">
                              {new Date(p.date).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                            {p.note && <p className="text-[11px] text-center text-zinc-400 truncate">{p.note}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ── Tab 4: Músculos & Salud ────────────────────── */}
            {active === "salud" && (
              <div className="space-y-4">
                {/* Muscle map */}
                <MuscleMap volumeByMuscle={volumeByMuscle} />

                {/* Health trackers */}
                <CollapsibleSection
                  title="Salud y sueño"
                  subtitle="Métricas de descanso y salud general"
                  icon={<HeartPulse size={18} />}
                >
                  <SleepTracker />
                  <HealthBox />
                  <FitTrackeePro />
                </CollapsibleSection>

                {/* Wearables & data */}
                <CollapsibleSection
                  title="Wearables y dispositivos"
                  subtitle="Sincronizá tus relojes y balanzas"
                  icon={<Activity size={18} />}
                >
                  <WearablesHub />
                  <OpenScaleSync />
                </CollapsibleSection>

                {/* Data import/export */}
                <CollapsibleSection
                  title="Datos e importación"
                  subtitle="Importá historial, exportá tu progreso"
                  icon={<TrendingUp size={18} />}
                >
                  <HevyImportPro />
                  <ExportCenter type="client" />
                  <RunTracker />
                  <GpxTracker />
                  <GraniteOffline />
                </CollapsibleSection>
              </div>
            )}
          </>
        )}
      </Tabs>

      {/* Export actions */}
      <ExportActions />
    </div>
  );
}

export default ProgressClient;
