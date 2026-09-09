/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { PhotoCompare } from "@/components/photo-compare";
import { FileUpload } from "@/components/file-upload";
import { ExportActions } from "@/components/export-actions";
import { 
  TrendingUp, 
  Dumbbell, 
  Scale, 
  Camera, 
  Calendar, 
  Plus, 
  Check, 
  ArrowDown, 
  ArrowUp, 
  Activity 
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
  workout: { name: string };
  sets: Array<{
    id: string;
    exerciseName: string;
    setNumber: number;
    weight: number | null;
    reps: number | null;
    rir: number | null;
  }>;
};

export default function ProgressPage(){
  const [tab, setTab] = useState<"peso" | "cargas" | "medidas" | "fotos">("peso");

  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [photos, setPhotos] = useState<ProgressPhotoItem[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New measurement form modal/state
  const [showMeasureForm, setShowMeasureForm] = useState(false);
  const [formWeight, setFormWeight] = useState("");
  const [formWaist, setFormWaist] = useState("");
  const [formChest, setFormChest] = useState("");
  const [formArm, setFormArm] = useState("");
  const [savingMeasure, setSavingMeasure] = useState(false);

  async function loadData(){
    setLoading(true);
    try {
      const [mRes, pRes, wRes] = await Promise.all([
        fetch("/api/measurements"),
        fetch("/api/progress-photos"),
        fetch("/api/workout-logs")
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
    } catch {}
    setLoading(false);
  }

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

  // Photos: Before (oldest), Current (newest), History (all)
  const sortedPhotosAsc = [...photos].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const beforePhoto = sortedPhotosAsc[0] || null;
  const currentPhoto = sortedPhotosAsc.length > 1 ? sortedPhotosAsc[sortedPhotosAsc.length - 1] : null;

  // Best lifts progress from workoutLogs sets
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold">Mi Progreso</h1>
          <p className="text-sm text-zinc-500">Métricas reales • Privado entre vos y Ezequiel</p>
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

      {/* Record Measurement Modal / Card */}
      {showMeasureForm && (
        <Card className="border-[#D6FF2A]/30 bg-zinc-950 animate-in fade-in">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Scale size={18} className="text-[#D6FF2A]" /> Nuevo Registro de Medidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMeasurement} className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Peso (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formWeight}
                    onChange={e => setFormWeight(e.target.value)}
                    placeholder="Ej: 84.5"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Cintura (cm)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formWaist}
                    onChange={e => setFormWaist(e.target.value)}
                    placeholder="Ej: 86"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Pecho (cm)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formChest}
                    onChange={e => setFormChest(e.target.value)}
                    placeholder="Ej: 102"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Brazo (cm)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formArm}
                    onChange={e => setFormArm(e.target.value)}
                    placeholder="Ej: 36"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowMeasureForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="accent" size="sm" disabled={savingMeasure} className="font-bold">
                  {savingMeasure ? "Guardando..." : "Guardar Registro ✓"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Metric KPI Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="p-3.5 text-center">
            <span className="text-[11px] text-zinc-500 uppercase font-bold block">Peso Actual</span>
            <p className="text-xl font-black text-white mt-0.5">
              {latestWeight !== null ? `${latestWeight} kg` : "--"}
            </p>
            {weightChange !== null && (
              <p className={`text-[11px] font-bold mt-0.5 flex items-center justify-center gap-0.5 ${weightChange <= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                {weightChange <= 0 ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
                {Math.abs(weightChange)} kg
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="p-3.5 text-center">
            <span className="text-[11px] text-zinc-500 uppercase font-bold block">Entrenos</span>
            <p className="text-xl font-black text-white mt-0.5">{workoutLogs.length}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">completados</p>
          </CardContent>
        </Card>

        <Card className="border-[#D6FF2A]/20 bg-[#D6FF2A]/[0.03]">
          <CardContent className="p-3.5 text-center">
            <span className="text-[11px] text-zinc-500 uppercase font-bold block">Fotos</span>
            <p className="text-xl font-black text-[#D6FF2A] mt-0.5">{photos.length}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">privadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "peso", label: "Peso Corporal", icon: Scale },
          { id: "cargas", label: "Fuerza y Cargas", icon: Dumbbell },
          { id: "medidas", label: "Medidas", icon: Activity },
          { id: "fotos", label: "Fotos de Progreso", icon: Camera },
        ].map(t => {
          const isActive = tab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? "bg-white text-black border-white"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Peso Corporal */}
      {tab === "peso" && (
        <div className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/90">
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
                    <div
                      key={m.id}
                      className="flex justify-between items-center p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs"
                    >
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
        </div>
      )}

      {/* Tab 2: Fuerza y Cargas */}
      {tab === "cargas" && (
        <div className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/90">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">¿Estoy levantando más peso?</CardTitle>
              <Badge variant="accent">Mejores Marcas</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.keys(exerciseMaxes).length === 0 ? (
                <div className="py-10 text-center text-xs text-zinc-500">
                  No hay datos todavía. Completá entrenamientos registrando tus series para ver tus cargas máximas.
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(exerciseMaxes).map(([name, data]) => (
                    <div
                      key={name}
                      className="flex justify-between items-center p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs"
                    >
                      <div>
                        <p className="font-bold text-white text-sm">{name}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Registrado el {data.date}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-[#D6FF2A]">{data.maxWeight} kg</span>
                        <p className="text-[10px] text-zinc-400">× {data.reps} reps</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Medidas */}
      {tab === "medidas" && (
        <div className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/90">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Medidas Corporales (cm)</CardTitle>
              <Badge variant="muted">Historial</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {measurements.filter(m => m.waist || m.chest || m.arm || m.leg).length === 0 ? (
                <div className="py-10 text-center text-xs text-zinc-500">
                  No hay medidas registradas todavía. Presioná &quot;Registrar Medidas&quot; para cargar tu perímetro de cintura, pecho y brazos.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {measurements
                    .filter(m => m.waist || m.chest || m.arm || m.leg)
                    .map(m => (
                      <div key={m.id} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-2">
                        <span className="font-bold text-zinc-400 text-[11px] block">
                          {new Date(m.date).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="bg-zinc-900 p-2 rounded-lg">
                            <span className="text-[10px] text-zinc-500 block">Cintura</span>
                            <span className="font-bold text-white text-sm">{m.waist ? `${m.waist} cm` : "—"}</span>
                          </div>
                          <div className="bg-zinc-900 p-2 rounded-lg">
                            <span className="text-[10px] text-zinc-500 block">Pecho</span>
                            <span className="font-bold text-white text-sm">{m.chest ? `${m.chest} cm` : "—"}</span>
                          </div>
                          <div className="bg-zinc-900 p-2 rounded-lg">
                            <span className="text-[10px] text-zinc-500 block">Brazo</span>
                            <span className="font-bold text-white text-sm">{m.arm ? `${m.arm} cm` : "—"}</span>
                          </div>
                          <div className="bg-zinc-900 p-2 rounded-lg">
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
        </div>
      )}

      {/* Tab 4: Fotos de Progreso */}
      {tab === "fotos" && (
        <div className="space-y-5">
          {/* Compare slider */}
          <Card className="border-zinc-800 bg-zinc-900/90 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Camera size={18} className="text-[#D6FF2A]" /> Comparador Antes vs Actual
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

              {/* Upload photo */}
              <div className="pt-2">
                <FileUpload
                  type="progress"
                  onUploaded={() => loadData()}
                  label="Subir nueva foto de progreso (privada)"
                />
                <p className="text-[11px] text-zinc-500 text-center mt-2">
                  🔒 Tus fotos son estrictamente confidenciales. Solo vos y Ezequiel tienen acceso a ellas.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Chronological Photo Gallery */}
          <Card className="border-zinc-800 bg-zinc-900/90">
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
                      <div className="aspect-[3/4] bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden relative">
                        <img src={p.url} alt="Progreso" className="w-full h-full object-cover group-hover:scale-105 transition" />
                        <span className="absolute top-2 right-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[10px] text-zinc-300">
                          🔒 Privada
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

      {/* Export actions */}
      <ExportActions />
    </div>
  );
}
