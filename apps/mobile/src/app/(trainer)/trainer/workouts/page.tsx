/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Stronk531 } from "@/components/stronk-531";
import { AiRoutineGenerator } from "@/components/ai-routine-generator";
import { FitNotesPro } from "@/components/fitnotes-pro";
import { X, Dumbbell, Plus, Trash2, ArrowUp, ArrowDown, Check, Copy } from "lucide-react";

type ExerciseOption = {
  id: string;
  name: string;
  muscleGroup: string;
  equipment?: string | null;
  image?: string | null;
};

type WorkoutEx = {
  id: string;
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  rir?: number | null;
  rpe?: number | null;
  restSec: number;
  tempo?: string;
  load?: string;
  notes?: string;
};

type WorkoutDay = {
  id: string;
  name: string;
  estimatedMin: number;
  exercises: WorkoutEx[];
};

type ProgramWeekData = {
  id: string;
  weekNumber: number;
  name: string;
  days: WorkoutDay[];
};

type ExistingProgram = {
  id: string;
  name: string;
  description?: string | null;
  durationWeeks: number;
  frequency: number;
  weeks: Array<{
    id: string;
    weekNumber: number;
    workouts: Array<{
      id: string;
      dayNumber: number;
      name: string;
      estimatedMin: number;
      exercises: Array<{
        id: string;
        exerciseId: string;
        order: number;
        sets: number;
        reps: string;
        rir?: number | null;
        rpe?: number | null;
        restSec: number;
        tempo?: string | null;
        load?: string | null;
        notes?: string | null;
        exercise: { name: string };
      }>;
    }>;
  }>;
};

export default function WorkoutsPage(){
  const [libraryExercises, setLibraryExercises] = useState<ExerciseOption[]>([]);
  const [existingPrograms, setExistingPrograms] = useState<ExistingProgram[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>("new");
  
  const [programName, setProgramName] = useState("Programa Hipertrofia 12 Semanas");
  const [description, setDescription] = useState("Programa personalizado KINETIXFITT");
  const [freq, setFreq] = useState(4);
  const [weeks, setWeeks] = useState<ProgramWeekData[]>([
    {
      id: "w1",
      weekNumber: 1,
      name: "Semana 1",
      days: [
        {
          id: "d1",
          name: "Día 1 — Tren Superior",
          estimatedMin: 60,
          exercises: []
        }
      ]
    }
  ]);

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Load programs and exercises
  async function loadData(){
    try {
      const [progRes, exRes] = await Promise.all([
        fetch("/api/programs"),
        fetch("/api/exercises")
      ]);
      if (progRes.ok) {
        const progs = await progRes.json();
        if (Array.isArray(progs)) {
          setExistingPrograms(progs);
          if (progs.length > 0 && selectedProgramId === "new") {
            loadProgramIntoEditor(progs[0]);
          }
        }
      }
      if (exRes.ok) {
        const exList = await exRes.json();
        if (Array.isArray(exList)) setLibraryExercises(exList);
      }
    } catch {
      // Keep existing defaults
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function loadProgramIntoEditor(p: ExistingProgram){
    setSelectedProgramId(p.id);
    setProgramName(p.name);
    setDescription(p.description || "");
    setFreq(p.frequency || 4);

    const mappedWeeks: ProgramWeekData[] = (p.weeks || []).map((w, wi) => ({
      id: w.id || `w-${wi}`,
      weekNumber: w.weekNumber || wi + 1,
      name: `Semana ${w.weekNumber || wi + 1}`,
      days: (w.workouts || []).map((d, di) => ({
        id: d.id || `d-${di}`,
        name: d.name || `Día ${di + 1}`,
        estimatedMin: d.estimatedMin || 60,
        exercises: (d.exercises || []).map((ex) => ({
          id: ex.id,
          exerciseId: ex.exerciseId,
          name: ex.exercise?.name || "Ejercicio",
          sets: ex.sets || 3,
          reps: ex.reps || "8-12",
          rir: ex.rir ?? 2,
          rpe: ex.rpe ?? null,
          restSec: ex.restSec || 90,
          tempo: ex.tempo || "3-1-1-0",
          load: ex.load || "",
          notes: ex.notes || ""
        }))
      }))
    }));

    setWeeks(mappedWeeks.length ? mappedWeeks : [
      { id: "w1", weekNumber: 1, name: "Semana 1", days: [{ id: "d1", name: "Día 1", estimatedMin: 60, exercises: [] }] }
    ]);
  }

  function startNewProgram(){
    setSelectedProgramId("new");
    setProgramName("Nuevo Programa de Entrenamiento");
    setDescription("");
    setFreq(4);
    setWeeks([
      {
        id: `w-${Date.now()}`,
        weekNumber: 1,
        name: "Semana 1",
        days: [
          { id: `d-${Date.now()}`, name: "Día 1 — Tren Superior", estimatedMin: 60, exercises: [] }
        ]
      }
    ]);
  }

  function addWeek(){
    setWeeks([
      ...weeks,
      {
        id: `w-${Date.now()}`,
        weekNumber: weeks.length + 1,
        name: `Semana ${weeks.length + 1}`,
        days: [
          { id: `d-${Date.now()}`, name: "Día 1", estimatedMin: 60, exercises: [] }
        ]
      }
    ]);
  }

  function duplicateWeek(weekIdx: number){
    const original = weeks[weekIdx];
    const duplicated: ProgramWeekData = {
      id: `w-${Date.now()}`,
      weekNumber: weeks.length + 1,
      name: `${original.name} (copia)`,
      days: original.days.map((d, di) => ({
        id: `d-${Date.now()}-${di}`,
        name: d.name,
        estimatedMin: d.estimatedMin,
        exercises: d.exercises.map(e => ({ ...e, id: `ex-${Date.now()}-${Math.random().toString(36).substring(7)}` }))
      }))
    };
    setWeeks([...weeks, duplicated]);
  }

  function addDay(weekIdx: number){
    const copy = [...weeks];
    copy[weekIdx].days.push({
      id: `d-${Date.now()}`,
      name: `Día ${copy[weekIdx].days.length + 1}`,
      estimatedMin: 60,
      exercises: []
    });
    setWeeks(copy);
  }

  function addExerciseToDay(weekIdx: number, dayIdx: number, exOption?: ExerciseOption){
    const copy = [...weeks];
    const defaultEx = exOption || libraryExercises[0];
    copy[weekIdx].days[dayIdx].exercises.push({
      id: `ex-${Date.now()}`,
      exerciseId: defaultEx?.id || "default",
      name: defaultEx?.name || "Nuevo ejercicio",
      sets: 4,
      reps: "8-12",
      rir: 2,
      rpe: null,
      restSec: 90,
      tempo: "3-1-1-0",
      load: "",
      notes: ""
    });
    setWeeks(copy);
  }

  function updateExercise(weekIdx: number, dayIdx: number, exIdx: number, field: keyof WorkoutEx, value: unknown){
    const copy = [...weeks];
    const target = copy[weekIdx].days[dayIdx].exercises[exIdx];
    if (field === "exerciseId") {
      target.exerciseId = value as string;
      const found = libraryExercises.find(e => e.id === value);
      if (found) target.name = found.name;
    } else {
      (target as Record<string, unknown>)[field] = value;
    }
    setWeeks(copy);
  }

  function moveExercise(weekIdx: number, dayIdx: number, exIdx: number, direction: "up" | "down"){
    const copy = [...weeks];
    const list = copy[weekIdx].days[dayIdx].exercises;
    const targetIdx = direction === "up" ? exIdx - 1 : exIdx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(exIdx, 1);
    list.splice(targetIdx, 0, moved);
    setWeeks(copy);
  }

  function removeExercise(weekIdx: number, dayIdx: number, exIdx: number){
    const copy = [...weeks];
    copy[weekIdx].days[dayIdx].exercises.splice(exIdx, 1);
    setWeeks(copy);
  }

  async function handleSaveProgram(){
    if (!programName.trim()) {
      setStatusMsg({ text: "El programa debe tener un nombre", type: "error" });
      return;
    }
    setSaving(true);
    setStatusMsg(null);

    try {
      const payload = {
        name: programName,
        description,
        frequency: freq,
        durationWeeks: weeks.length,
        weeks: weeks.map((w, wi) => ({
          weekNumber: wi + 1,
          days: w.days.map((d, di) => ({
            name: d.name,
            dayNumber: di + 1,
            estimatedMin: d.estimatedMin,
            exercises: d.exercises.map((e, ei) => ({
              order: ei,
              exerciseId: e.exerciseId !== "default" ? e.exerciseId : undefined,
              name: e.name,
              sets: Number(e.sets) || 3,
              reps: String(e.reps || "8-12"),
              rir: e.rir !== undefined && e.rir !== null ? Number(e.rir) : null,
              rpe: e.rpe !== undefined && e.rpe !== null ? Number(e.rpe) : null,
              restSec: Number(e.restSec) || 90,
              tempo: e.tempo || "3-1-1-0",
              load: e.load || null,
              notes: e.notes || null,
            }))
          }))
        }))
      };

      // Si estamos editando un programa existente, actualizamos (PUT).
      // Si es nuevo, creamos (POST). Antes siempre hacía POST y duplicaba.
      const isEditing = selectedProgramId !== "new";
      const res = await fetch(
        isEditing ? `/api/programs/${selectedProgramId}` : "/api/programs",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al guardar el programa");
      }

      const saved = await res.json();
      setSelectedProgramId(saved.id);
      setStatusMsg({
        text: isEditing
          ? `Programa "${saved.name}" actualizado correctamente`
          : `Programa "${saved.name}" creado exitosamente en la base de datos`,
        type: "success"
      });
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      setStatusMsg({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProgram(id: string, name: string){
    if(!window.confirm(`¿Eliminar el programa "${name}"?\n\nSe borrarán sus semanas, días y ejercicios. El historial de entrenamientos de los clientes no se pierde.`)) return;
    try {
      const res = await fetch(`/api/programs/${id}`, { method: "DELETE" });
      if(!res.ok){
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al eliminar el programa");
      }
      startNewProgram();
      setExistingPrograms(prev => prev.filter(p => p.id !== id));
      setStatusMsg({ text: `Programa "${name}" eliminado`, type: "success" });
    } catch (err: unknown) {
      setStatusMsg({ text: err instanceof Error ? err.message : "Error inesperado", type: "error" });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Gestor de Entrenamientos</h1>
          <p className="text-sm text-zinc-400">Creación, edición y estructuración de planes y rutinas para tus clientes</p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Button variant="outline" size="sm" onClick={startNewProgram}>
            <Plus size={16} className="mr-1" /> Nuevo Programa
          </Button>
          <Button variant="accent" size="sm" onClick={handleSaveProgram} disabled={saving} className="font-bold min-h-[44px]">
            {saving ? "Guardando..." : "GUARDAR PROGRAMA"}
          </Button>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl text-sm font-medium border flex items-center justify-between ${statusMsg.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="text-xs opacity-70 hover:opacity-100"><X size={14} /></button>
        </div>
      )}

      <Stronk531 />
      <FitNotesPro onApplyTemplate={(t)=>{
          // FitNotes template -> mapear a ProgramWeekData con notas+RPE
          const isFull = t.category==="FullBody" || t.exercises.length <=3;
          if(isFull){
            const newWeeks: ProgramWeekData[] = [{
              id: `w-${Date.now()}`,
              weekNumber: 1,
              name: t.name,
              days: [{
                id: `d-${Date.now()}`,
                name: t.name,
                estimatedMin: 60,
                exercises: t.exercises.map(ex=>{
                  const lib = libraryExercises.find(x=> x.name.toLowerCase()===ex.name.toLowerCase());
                  const mainSet = ex.sets.find(s=>!s.isWarmup) ?? ex.sets[0];
                  const setNotes = ex.sets.map(s=> s.notes ? `S${s.rpe ?? "?"}:${s.notes}` : "").filter(Boolean).join(" | ");
                  const combinedNotes = [ex.notes, setNotes, t.workoutNotes ? `W:${t.workoutNotes}` : ""].filter(Boolean).join(" • ");
                  return {
                    id: `ex-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
                    exerciseId: lib?.id || "default",
                    name: ex.name,
                    sets: ex.sets.filter(s=>!s.isWarmup).length || ex.sets.length,
                    reps: mainSet?.reps || "8-12",
                    rir: mainSet?.rpe ? Math.max(0, 10 - mainSet.rpe) : 2,
                    rpe: mainSet?.rpe ?? null,
                    restSec: 90,
                    tempo: "3-1-1-0",
                    load: mainSet?.weight || "",
                    notes: combinedNotes.slice(0, 200)
                  };
                })
              }]
            }];
            setWeeks(newWeeks as unknown as typeof weeks);
            setProgramName(t.name);
            setDescription(t.workoutNotes.slice(0,120));
            window.scrollTo({top:0, behavior:"smooth"});
          } else {
            // Split por push/pull style: cada ejercicio como bloque
            const newWeeks: ProgramWeekData[] = [{
              id: `w-${Date.now()}`,
              weekNumber: 1,
              name: t.name,
              days: [{
                id: `d-${Date.now()}`,
                name: t.name,
                estimatedMin: 60,
                exercises: t.exercises.map(ex=>{
                  const lib = libraryExercises.find(x=> x.name.toLowerCase()===ex.name.toLowerCase());
                  const mainSet = ex.sets.find(s=>!s.isWarmup) ?? ex.sets[0];
                  return {
                    id: `ex-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
                    exerciseId: lib?.id || "default",
                    name: ex.name,
                    sets: ex.sets.filter(s=>!s.isWarmup).length || 1,
                    reps: mainSet?.reps || "8-12",
                    rir: mainSet?.rpe ? Math.max(0, 10 - mainSet.rpe) : 2,
                    rpe: mainSet?.rpe ?? null,
                    restSec: 90,
                    tempo: "3-1-1-0",
                    load: mainSet?.weight || "",
                    notes: [ex.notes, t.workoutNotes].filter(Boolean).join(" • ").slice(0,200)
                  };
                })
              }]
            }];
            setWeeks(newWeeks as unknown as typeof weeks);
            setProgramName(t.name);
            setDescription(t.workoutNotes.slice(0,120));
            window.scrollTo({top:0, behavior:"smooth"});
          }
        }} />
      <AiRoutineGenerator onGenerate={(prog)=>{
          const newWeeks = prog.weeks.map((w: {weekNumber:number; name:string; days:Array<{name:string; exercises:Array<{name:string; sets:number; reps:string; rir:number; restSec:number}>}>})=>({
            id: Math.random().toString(36).slice(2),
            weekNumber: w.weekNumber,
            name: w.name,
            days: w.days.map((d: {name:string; exercises:Array<{name:string; sets:number; reps:string; rir:number; restSec:number}>}, di:number)=>({
              id: Math.random().toString(36).slice(2),
              name: d.name,
              dayNumber: di+1,
              estimatedMin: 60,
              exercises: d.exercises.map((e: {name:string; sets:number; reps:string; rir:number; restSec:number})=>{
                const lib = libraryExercises.find(x=> x.name.toLowerCase()===e.name.toLowerCase()) || libraryExercises[0];
                return {id: Math.random().toString(36).slice(2), exerciseId: lib?.id || "", name: e.name, sets: e.sets, reps: e.reps, rir: e.rir, rpe: null, restSec: e.restSec, tempo: "", load: "", notes: ""};
              })
            }))
          }));
          setWeeks(newWeeks as unknown as typeof weeks);
          setProgramName(prog.name);
          setDescription("Generado con IA • " + prog.durationWeeks + " semanas • " + prog.frequency + "d/sem");
          window.scrollTo({top:0, behavior:"smooth"});
        }} />

      {/* Program selector */}
      {existingPrograms.length > 0 && (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 flex items-center gap-3 overflow-x-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 shrink-0">Programas existentes:</span>
            {existingPrograms.map(p => (
              <div key={p.id} className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => loadProgramIntoEditor(p)}
                  className={`text-xs px-3.5 py-2 rounded-xl border transition font-medium ${selectedProgramId === p.id ? "bg-primary text-black border-primary font-bold" : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700"}`}
                >
                  {p.name} ({p.weeks?.length || p.durationWeeks} sem)
                </button>
                <button
                  onClick={() => handleDeleteProgram(p.id, p.name)}
                  title={`Eliminar "${p.name}"`}
                  className="text-zinc-500 hover:text-red-400 p-1.5 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Program General Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configuración General del Plan</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label>Nombre del programa</Label>
            <Input value={programName} onChange={e => setProgramName(e.target.value)} placeholder="Ej: Hipertrofia Avanzada 12 Semanas" />
          </div>
          <div className="space-y-2">
            <Label>Frecuencia semanal</Label>
            <select
              value={freq}
              onChange={e => setFreq(Number(e.target.value))}
              className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-primary"
            >
              <option value={2}>2 días por semana</option>
              <option value={3}>3 días por semana</option>
              <option value={4}>4 días por semana</option>
              <option value={5}>5 días por semana</option>
              <option value={6}>6 días por semana</option>
            </select>
          </div>
          <div className="space-y-2 sm:col-span-3">
            <Label>Instrucciones y objetivos generales</Label>
            <Input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Objetivos del bloque, foco en sobrecarga progresiva, deload previsto..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Weeks & Days */}
      <div className="space-y-6">
        {weeks.map((w, wi) => (
          <Card key={w.id} className="border-zinc-800 overflow-hidden">
            <CardHeader className="bg-zinc-900/40 py-3.5 px-4 flex flex-row items-center justify-between border-b border-zinc-800/60">
              <div className="flex items-center gap-3">
                <Badge variant="accent" className="font-bold">Semana {wi + 1}</Badge>
                <input
                  value={w.name}
                  onChange={e => {
                    const c = [...weeks];
                    c[wi].name = e.target.value;
                    setWeeks(c);
                  }}
                  className="bg-transparent text-white font-bold text-base border-b border-transparent hover:border-zinc-700 focus:border-primary outline-none px-1"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => duplicateWeek(wi)} title="Duplicar semana">
                  <Copy size={15} className="mr-1" /> Duplicar
                </Button>
                <Button variant="outline" size="sm" onClick={() => addDay(wi)}>
                  <Plus size={15} className="mr-1" /> Día
                </Button>
                {weeks.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-500 hover:text-red-400"
                    onClick={() => {
                      const c = [...weeks];
                      c.splice(wi, 1);
                      setWeeks(c);
                    }}
                  >
                    <Trash2 size={15} />
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-5">
              {w.days.length === 0 && (
                <div className="text-center py-6 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                  Sin días asignados en esta semana.
                  <Button variant="outline" size="sm" className="mt-2 block mx-auto" onClick={() => addDay(wi)}>
                    + Agregar Primer Día
                  </Button>
                </div>
              )}

              {w.days.map((d, di) => (
                <div key={d.id} className="border border-zinc-800 rounded-2xl bg-zinc-950 overflow-hidden">
                  {/* Day Header */}
                  <div className="p-3.5 bg-zinc-900/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Día {di + 1}:</span>
                      <input
                        value={d.name}
                        onChange={e => {
                          const c = [...weeks];
                          c[wi].days[di].name = e.target.value;
                          setWeeks(c);
                        }}
                        className="bg-transparent text-white font-semibold text-sm border-b border-transparent hover:border-zinc-700 focus:border-primary outline-none flex-1 px-1"
                        placeholder="Nombre de la sesión (ej: Empuje, Piernas...)"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <span>Duración:</span>
                        <input
                          type="number"
                          value={d.estimatedMin}
                          onChange={e => {
                            const c = [...weeks];
                            c[wi].days[di].estimatedMin = Number(e.target.value) || 60;
                            setWeeks(c);
                          }}
                          className="w-14 bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-center text-white text-xs"
                        />
                        <span>min</span>
                      </div>
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => addExerciseToDay(wi, di)}
                        className="h-8 text-xs font-bold"
                      >
                        + Ejercicio
                      </Button>
                      <button
                        onClick={() => {
                          const c = [...weeks];
                          c[wi].days.splice(di, 1);
                          setWeeks(c);
                        }}
                        className="text-zinc-500 hover:text-red-400 p-1"
                        title="Eliminar día"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Exercises List */}
                  <div className="divide-y divide-zinc-900">
                    {d.exercises.length === 0 ? (
                      <p className="p-5 text-center text-xs text-zinc-500">
                        No hay ejercicios en esta sesión. Presioná &quot;+ Ejercicio&quot; para añadir uno.
                      </p>
                    ) : (
                      d.exercises.map((ex, ei) => (
                        <div key={ex.id} className="p-3.5 bg-zinc-950 hover:bg-zinc-900/30 transition space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-xs font-bold text-zinc-600 w-5">{ei + 1}.</span>
                              <div className="flex-1 min-w-[200px]">
                                {libraryExercises.length > 0 ? (
                                  <select
                                    value={ex.exerciseId}
                                    onChange={e => updateExercise(wi, di, ei, "exerciseId", e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-white focus:outline-none focus:border-primary"
                                  >
                                    <option value="default">{ex.name}</option>
                                    {libraryExercises.map(opt => (
                                      <option key={opt.id} value={opt.id}>
                                        {opt.name} ({opt.muscleGroup})
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    value={ex.name}
                                    onChange={e => updateExercise(wi, di, ei, "name", e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-white"
                                    placeholder="Nombre del ejercicio"
                                  />
                                )}
                              </div>
                            </div>

                            {/* Reorder and Delete */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => moveExercise(wi, di, ei, "up")}
                                disabled={ei === 0}
                                className="p-1 text-zinc-500 hover:text-white disabled:opacity-30"
                                title="Mover arriba"
                              >
                                <ArrowUp size={15} />
                              </button>
                              <button
                                onClick={() => moveExercise(wi, di, ei, "down")}
                                disabled={ei === d.exercises.length - 1}
                                className="p-1 text-zinc-500 hover:text-white disabled:opacity-30"
                                title="Mover abajo"
                              >
                                <ArrowDown size={15} />
                              </button>
                              <button
                                onClick={() => removeExercise(wi, di, ei)}
                                className="p-1 text-zinc-500 hover:text-red-400 ml-1"
                                title="Quitar ejercicio"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          {/* Exercise parameters grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
                            <div>
                              <span className="text-zinc-500 block mb-1 text-[11px] uppercase font-bold">Series</span>
                              <input
                                type="number"
                                min={1}
                                max={20}
                                value={ex.sets}
                                onChange={e => updateExercise(wi, di, ei, "sets", Number(e.target.value) || 1)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-center text-white font-bold"
                              />
                            </div>
                            <div>
                              <span className="text-zinc-500 block mb-1 text-[11px] uppercase font-bold">Reps</span>
                              <input
                                value={ex.reps}
                                onChange={e => updateExercise(wi, di, ei, "reps", e.target.value)}
                                placeholder="8-12"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-center text-white font-bold"
                              />
                            </div>
                            <div>
                              <span className="text-zinc-500 block mb-1 text-[11px] uppercase font-bold">RIR / RPE</span>
                              <input
                                type="number"
                                min={0}
                                max={10}
                                value={ex.rir ?? ""}
                                onChange={e => updateExercise(wi, di, ei, "rir", e.target.value === "" ? null : Number(e.target.value))}
                                placeholder="2"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-center text-white font-bold"
                              />
                            </div>
                            <div>
                              <span className="text-zinc-500 block mb-1 text-[11px] uppercase font-bold">Descanso (s)</span>
                              <input
                                type="number"
                                step={15}
                                value={ex.restSec}
                                onChange={e => updateExercise(wi, di, ei, "restSec", Number(e.target.value) || 90)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-center text-white font-bold"
                              />
                            </div>
                            <div>
                              <span className="text-zinc-500 block mb-1 text-[11px] uppercase font-bold">Tempo</span>
                              <input
                                value={ex.tempo || ""}
                                onChange={e => updateExercise(wi, di, ei, "tempo", e.target.value)}
                                placeholder="3-1-1-0"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-center text-white font-mono"
                              />
                            </div>
                            <div>
                              <span className="text-zinc-500 block mb-1 text-[11px] uppercase font-bold">Carga sugerida</span>
                              <input
                                value={ex.load || ""}
                                onChange={e => updateExercise(wi, di, ei, "load", e.target.value)}
                                placeholder="75% 1RM"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-center text-white"
                              />
                            </div>
                          </div>

                          {/* Notes / Instructions */}
                          <div className="pt-1">
                            <input
                              value={ex.notes || ""}
                              onChange={e => updateExercise(wi, di, ei, "notes", e.target.value)}
                              placeholder="Notas técnicas: codos pegados, retracción escapular, pausa abajo..."
                              className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-lg px-3 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button variant="outline" onClick={addWeek} className="flex-1 border-dashed h-12">
          <Plus size={16} className="mr-1.5" /> Agregar Otra Semana
        </Button>
        <Button variant="accent" onClick={handleSaveProgram} disabled={saving} className="flex-1 h-12 font-bold text-base">
          {saving ? "Guardando..." : "GUARDAR PROGRAMA COMPLETO"}
        </Button>
      </div>
    </div>
  );
}
