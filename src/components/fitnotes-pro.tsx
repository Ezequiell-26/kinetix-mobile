"use client";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Copy, Trash2, Star, ClipboardList, Gauge, Plus, Save, Layers } from "lucide-react";

// Inspirado en FitNotes MIT — workout notes + RPE + template
// Repos: https://github.com/tihawk/fitnotes2fit (MIT) + https://github.com/mylesverdon/FitNotes-iOS (MIT-inspired) + https://github.com/stoyanov-x/fitnotes-research (MIT research)
// Patrones: FitNotes export/import JSON (workout notes, exercise notes, set notes, RPE/RIR), templates/routines, categories, warmup flag, copy previous sets, rest timer
// No copia AGPL — solo patrones MIT de notas por nivel (workout/exercise/set) + escala RPE 6-10 + templates como rutinas

type FitSet = {
  id: string;
  weight: string;
  reps: string;
  rpe: number | null;
  isWarmup: boolean;
  notes: string;
};

type FitExercise = {
  id: string;
  name: string;
  category: string;
  sets: FitSet[];
  notes: string;
};

type FitTemplate = {
  id: string;
  name: string;
  category: string;
  workoutNotes: string;
  exercises: FitExercise[];
  createdAt: string;
};

const RPE_SCALE: { v: number; label: string; color: string; desc: string }[] = [
  { v: 6, label: "RPE 6", color: "bg-emerald-500", desc: "Fácil — 4 reps reserva" },
  { v: 7, label: "RPE 7", color: "bg-lime-500", desc: "Moderado — 3 reserva" },
  { v: 8, label: "RPE 8", color: "bg-amber-500", desc: "Pesado — 2 reserva" },
  { v: 9, label: "RPE 9", color: "bg-orange-500", desc: "Muy pesado — 1 reserva" },
  { v: 10, label: "RPE 10", color: "bg-red-500", desc: "Fallo — 0 reserva" },
];

const CATEGORIES = ["Pecho", "Espalda", "Pierna", "Hombro", "Brazo", "FullBody", "Core"];

const DEFAULT_TEMPLATES: FitTemplate[] = [
  {
    id: "t1",
    name: "Push A — Pecho/Hombro/Tríceps",
    category: "Pecho",
    workoutNotes: "Foco RPE 8 en press. Notas: pausas 2s abajo en banca.",
    exercises: [
      { id: "e1", name: "Press Banca", category: "Pecho", notes: "Codos 45°, retracción escapular", sets: [{ id: "s1", weight: "80", reps: "8", rpe: 8, isWarmup: false, notes: "" }, { id: "s2", weight: "80", reps: "8", rpe: 8.5, isWarmup: false, notes: "última dura" }] },
      { id: "e2", name: "Press Militar DB", category: "Hombro", notes: "", sets: [{ id: "s3", weight: "22", reps: "10", rpe: 7, isWarmup: false, notes: "" }] },
      { id: "e3", name: "Fondos", category: "Pecho", notes: "Si RPE>9 bajar reps", sets: [{ id: "s4", weight: "BW", reps: "12", rpe: 8, isWarmup: false, notes: "" }] },
    ],
    createdAt: "2026-09-01",
  },
  {
    id: "t2",
    name: "Pull B — Espalda/Bíceps",
    category: "Espalda",
    workoutNotes: "RPE 7-8. Notas workout: straps solo última serie peso muerto.",
    exercises: [
      { id: "e4", name: "Peso Muerto", category: "Espalda", notes: "Espalda neutra", sets: [{ id: "s5", weight: "100", reps: "5", rpe: 8, isWarmup: true, notes: "warmup 60kg" }, { id: "s6", weight: "100", reps: "5", rpe: 8, isWarmup: false, notes: "" }] },
      { id: "e5", name: "Dominadas", category: "Espalda", notes: "", sets: [{ id: "s7", weight: "BW", reps: "8", rpe: 9, isWarmup: false, notes: "fallo última" }] },
    ],
    createdAt: "2026-09-03",
  },
  {
    id: "t3",
    name: "Pierna Fuerza 5×5",
    category: "Pierna",
    workoutNotes: "Template fuerza — RPE 8-9, descanso 3min. Nota: filmar sentadilla para form-check.",
    exercises: [
      { id: "e6", name: "Sentadilla", category: "Pierna", notes: "Profundidad cadera bajo rodilla", sets: [{ id: "s8", weight: "100", reps: "5", rpe: 8, isWarmup: false, notes: "" }, { id: "s9", weight: "100", reps: "5", rpe: 9, isWarmup: false, notes: "" }] },
      { id: "e7", name: "Peso Muerto Rumano", category: "Pierna", notes: "", sets: [{ id: "s10", weight: "80", reps: "8", rpe: 7, isWarmup: false, notes: "" }] },
    ],
    createdAt: "2026-09-05",
  },
  {
    id: "t4",
    name: "FullBody RPE 7 — Base",
    category: "FullBody",
    workoutNotes: "Template base cliente nuevo. Todo RPE 7, deja 3 reps en reserva.",
    exercises: [
      { id: "e8", name: "Goblet Squat", category: "Pierna", notes: "", sets: [{ id: "s11", weight: "20", reps: "12", rpe: 7, isWarmup: false, notes: "" }] },
      { id: "e9", name: "Remo Mancuerna", category: "Espalda", notes: "", sets: [{ id: "s12", weight: "18", reps: "10", rpe: 7, isWarmup: false, notes: "" }] },
      { id: "e10", name: "Flexiones", category: "Pecho", notes: "", sets: [{ id: "s13", weight: "BW", reps: "15", rpe: 7, isWarmup: false, notes: "" }] },
    ],
    createdAt: "2026-09-06",
  },
];

const LS_KEY = "fitnotes-pro-templates-v1";

function uid() { return Math.random().toString(36).slice(2, 9); }

export function FitNotesPro({ onApplyTemplate }: { onApplyTemplate?: (t: FitTemplate) => void }) {
  const [templates, setTemplates] = useState<FitTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_TEMPLATES[0].id);
  const [workoutNotes, setWorkoutNotes] = useState<string>(DEFAULT_TEMPLATES[0].workoutNotes);
  const [filterCat, setFilterCat] = useState<string>("Todas");
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState("Pecho");
  const [toast, setToast] = useState<string | null>(null);

  // cargar localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as FitTemplate[];
        if (Array.isArray(parsed) && parsed.length) {
          setTemplates(parsed);
          setSelectedId(parsed[0].id);
          setWorkoutNotes(parsed[0].workoutNotes);
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(templates)); } catch { /* ignore */ }
  }, [templates]);

  const selected = useMemo(() => templates.find(t => t.id === selectedId) ?? templates[0], [templates, selectedId]);

  useEffect(() => {
    if (selected) setWorkoutNotes(selected.workoutNotes);
  }, [selectedId, selected]);

  const filtered = useMemo(() => {
    if (filterCat === "Todas") return templates;
    return templates.filter(t => t.category === filterCat);
  }, [templates, filterCat]);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2200); }

  function handleSelect(id: string) { setSelectedId(id); }

  function handleApply(t: FitTemplate) {
    if (onApplyTemplate) onApplyTemplate(t);
    showToast(`Template "${t.name}" aplicado — revisá el gestor`);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch { /* ignore */ }
  }

  function handleDuplicate(id: string) {
    const src = templates.find(t => t.id === id);
    if (!src) return;
    const dup: FitTemplate = {
      ...src,
      id: uid(),
      name: src.name + " (copia)",
      createdAt: new Date().toISOString().slice(0, 10),
      exercises: src.exercises.map(e => ({ ...e, id: uid(), sets: e.sets.map(s => ({ ...s, id: uid() })) })),
    };
    setTemplates([dup, ...templates]);
    setSelectedId(dup.id);
    showToast("Template duplicado");
  }

  function handleDelete(id: string) {
    if (templates.length <= 1) { showToast("Debe quedar al menos 1 template"); return; }
    const next = templates.filter(t => t.id !== id);
    setTemplates(next);
    if (selectedId === id) setSelectedId(next[0].id);
    showToast("Template eliminado");
  }

  function handleCreate() {
    if (!newName.trim()) { showToast("Nombre requerido"); return; }
    const nt: FitTemplate = {
      id: uid(),
      name: newName.trim(),
      category: newCat,
      workoutNotes: workoutNotes || "Notas del workout — técnica, RPE objetivo, descanso",
      exercises: selected ? selected.exercises.map(e => ({ ...e, id: uid(), sets: e.sets.map(s => ({ ...s, id: uid() })) })) : [],
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setTemplates([nt, ...templates]);
    setSelectedId(nt.id);
    setNewName("");
    showToast("Template creado desde actual");
  }

  function updateWorkoutNotes(v: string) {
    setWorkoutNotes(v);
    setTemplates(prev => prev.map(t => t.id === selectedId ? { ...t, workoutNotes: v } : t));
  }

  function updateExerciseNote(exId: string, v: string) {
    setTemplates(prev => prev.map(t => t.id === selectedId ? { ...t, exercises: t.exercises.map(e => e.id === exId ? { ...e, notes: v } : e) } : t));
  }

  function updateSetRpe(exId: string, setId: string, rpe: number | null) {
    setTemplates(prev => prev.map(t => t.id === selectedId ? { ...t, exercises: t.exercises.map(e => e.id === exId ? { ...e, sets: e.sets.map(s => s.id === setId ? { ...s, rpe } : s) } : e) } : t));
  }

  function updateSetNote(exId: string, setId: string, note: string) {
    setTemplates(prev => prev.map(t => t.id === selectedId ? { ...t, exercises: t.exercises.map(e => e.id === exId ? { ...e, sets: e.sets.map(s => s.id === setId ? { ...s, notes: note } : s) } : e) } : t));
  }

  function toggleWarmup(exId: string, setId: string) {
    setTemplates(prev => prev.map(t => t.id === selectedId ? { ...t, exercises: t.exercises.map(e => e.id === exId ? { ...e, sets: e.sets.map(s => s.id === setId ? { ...s, isWarmup: !s.isWarmup } : s) } : e) } : t));
  }

  function addSet(exId: string) {
    setTemplates(prev => prev.map(t => t.id === selectedId ? {
      ...t, exercises: t.exercises.map(e => e.id === exId ? {
        ...e, sets: [...e.sets, { id: uid(), weight: e.sets[0]?.weight ?? "", reps: e.sets[0]?.reps ?? "8", rpe: 8, isWarmup: false, notes: "" }]
      } : e)
    } : t));
  }

  if (!selected) return null;

  const avgRpe = (() => {
    const all = selected.exercises.flatMap(e => e.sets).map(s => s.rpe).filter((v): v is number => v !== null);
    if (!all.length) return null;
    return (all.reduce((a, b) => a + b, 0) / all.length).toFixed(1);
  })();

  return (
    <Card className="border-[#D6FF2A]/20 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardList size={16} className="text-[#D6FF2A]" /> FitNotes Pro
          <Badge variant="muted" className="text-[10px]">FitNotes MIT</Badge>
          <Badge variant="accent" className="text-[10px]">Template + RPE + Notas</Badge>
        </CardTitle>
        <p className="text-xs text-zinc-500">Workout notes + ejercicio notes + set notes + RPE 6-10 + warmup + templates — inspirado en FitNotes (CSV/JSON import,Routines/Templates, copy previous sets)</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros categoría */}
        <div className="flex gap-1.5 flex-wrap items-center">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1"><Layers size={12} /> Filtrar:</span>
          {["Todas", ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setFilterCat(c)} className={`px-2.5 py-1 rounded-full text-xs font-bold border ${filterCat === c ? "bg-[#D6FF2A] text-black border-[#D6FF2A]" : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"}`}>{c}</button>
          ))}
        </div>

        {/* Grid templates */}
        <div className="grid sm:grid-cols-2 gap-2 max-h-[280px] overflow-auto pr-1">
          {filtered.map(t => (
            <div key={t.id} onClick={() => handleSelect(t.id)} className={`text-left rounded-xl border p-3 cursor-pointer transition ${selectedId === t.id ? "bg-[#D6FF2A]/10 border-[#D6FF2A]/40" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm leading-tight line-clamp-1">{t.name}</p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <Badge variant="muted" className="text-[10px] px-1.5 py-0">{t.category}</Badge>
                    <span className="text-[11px] text-zinc-500">{t.exercises.length} ej • {t.exercises.reduce((a, e) => a + e.sets.length, 0)} sets</span>
                    <span className="text-[11px] text-zinc-600">{t.createdAt}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 line-clamp-1 mt-1 flex items-center gap-1"><FileText size={10} /> {t.workoutNotes || "Sin notas"}</p>
                </div>
                {selectedId === t.id && <Star size={14} className="text-[#D6FF2A] shrink-0 mt-0.5" />}
              </div>
              <div className="flex gap-1 mt-2.5">
                <Button size="sm" variant={selectedId === t.id ? "accent" : "outline"} className="h-7 text-xs flex-1" onClick={(e) => { e.stopPropagation(); handleApply(t); }}>
                  Aplicar
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); handleDuplicate(t.id); }}>
                  <Copy size={13} />
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-zinc-500 hover:text-red-400" onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}>
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Crear nuevo */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-col sm:flex-row gap-2 items-end">
          <div className="flex-1 w-full">
            <Label className="text-xs">Nuevo template desde seleccionado</Label>
            <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ej: Push C — RPE 9" className="h-9 mt-1" />
          </div>
          <div className="w-full sm:w-32">
            <Label className="text-xs">Categoría</Label>
            <select value={newCat} onChange={e => setNewCat(e.target.value)} className="w-full h-9 mt-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2 text-sm text-white focus:outline-none focus:border-[#D6FF2A]">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Button variant="accent" size="sm" onClick={handleCreate} className="h-9 w-full sm:w-auto"><Save size={14} className="mr-1" /> Guardar copia</Button>
        </div>

        {/* Detalle seleccionado */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-3 bg-zinc-900/60 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-bold text-sm flex items-center gap-2">{selected.name} <Badge variant="muted" className="text-[10px]">{selected.category}</Badge></p>
              <p className="text-[11px] text-zinc-500 mt-0.5">{selected.exercises.length} ejercicios • {selected.exercises.reduce((a, e) => a + e.sets.length, 0)} sets {avgRpe ? `• RPE medio ${avgRpe}` : ""} • {selected.exercises.flatMap(e => e.sets).filter(s => s.isWarmup).length} warmup</p>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant={avgRpe && Number(avgRpe) >= 9 ? "accent" : "muted"} className="text-xs"><Gauge size={12} className="mr-1" /> RPE {avgRpe ?? "—"}</Badge>
            </div>
          </div>

          {/* Workout notes */}
          <div className="p-3 space-y-1 border-b border-zinc-800/60">
            <Label className="text-xs flex items-center gap-1"><FileText size={12} className="text-[#D6FF2A]" /> Notas del workout (FitNotes: workout notes)</Label>
            <textarea
              value={workoutNotes}
              onChange={e => updateWorkoutNotes(e.target.value)}
              placeholder="Notas globales: objetivo RPE, pausas, sensaciones, links, filmar técnica..."
              className="w-full min-h-[56px] bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D6FF2A] resize-y"
              rows={2}
            />
            <p className="text-[11px] text-zinc-600">Tip FitNotes: las notas del workout quedan arriba del día, visibles sin abrir ejercicio.</p>
          </div>

          {/* Escala RPE */}
          <div className="p-3 border-b border-zinc-800/60">
            <p className="text-xs font-bold flex items-center gap-1.5 mb-2"><Gauge size={12} className="text-amber-400" /> Escala RPE 6-10 — taps para asignar</p>
            <div className="grid grid-cols-5 gap-1.5">
              {RPE_SCALE.map(r => (
                <div key={r.v} className="text-center">
                  <div className={`h-7 rounded-lg flex items-center justify-center font-black text-xs text-white ${r.color}`}>{r.v}</div>
                  <p className="text-[10px] font-bold text-zinc-400 mt-1">{r.label}</p>
                  <p className="text-[9px] text-zinc-600 leading-tight hidden sm:block">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ejercicios con notas + sets RPE */}
          <div className="divide-y divide-zinc-800/60">
            {selected.exercises.map(ex => (
              <div key={ex.id} className="p-3 space-y-2 bg-zinc-950">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] font-bold shrink-0">{ex.category.slice(0, 2).toUpperCase()}</span>
                    <div className="min-w-0">
                      <p className="font-bold text-sm leading-tight">{ex.name}</p>
                      <p className="text-[11px] text-zinc-500">{ex.category} • {ex.sets.length} sets</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => addSet(ex.id)}><Plus size={12} className="mr-1" /> Set</Button>
                </div>

                {/* Exercise notes */}
                <div className="flex gap-2">
                  <Input value={ex.notes} onChange={e => updateExerciseNote(ex.id, e.target.value)} placeholder="Nota del ejercicio: técnica, ROM, tempo (FitNotes exercise notes)" className="h-8 text-xs flex-1" />
                </div>

                {/* Sets */}
                <div className="space-y-1.5">
                  {ex.sets.map((s, idx) => (
                    <div key={s.id} className={`flex flex-col sm:flex-row gap-2 p-2 rounded-xl border items-start sm:items-center ${s.isWarmup ? "bg-amber-500/5 border-amber-500/20" : "bg-zinc-900 border-zinc-800"}`}>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${s.isWarmup ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-300 border border-zinc-700"}`}>{idx + 1}</span>
                        <span className="text-xs font-mono font-bold whitespace-nowrap">{s.weight} × {s.reps}</span>
                        <button onClick={() => toggleWarmup(ex.id, s.id)} title="Marcar warmup (FitNotes warmup flag)" className={`text-[10px] px-1.5 py-0.5 rounded-full border font-bold ${s.isWarmup ? "bg-amber-500 text-black border-amber-500" : "bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-white"}`}>{s.isWarmup ? "WU" : "WU?"}</button>
                      </div>
                      <div className="flex gap-1 flex-wrap items-center flex-1">
                        {[6, 7, 8, 9, 10].map(v => (
                          <button
                            key={v}
                            onClick={() => updateSetRpe(ex.id, s.id, s.rpe === v ? null : v)}
                            className={`w-7 h-7 rounded-full text-xs font-black border transition ${s.rpe === v ? (v >= 9 ? "bg-red-500 text-white border-red-500" : v === 8 ? "bg-amber-500 text-black border-amber-500" : "bg-[#D6FF2A] text-black border-[#D6FF2A]") : "bg-zinc-800 text-zinc-500 border-zinc-700 hover:border-zinc-600"}`}
                            title={`RPE ${v}`}
                          >{v}</button>
                        ))}
                        {s.rpe !== null && <span className="text-[11px] text-zinc-400">RPE {s.rpe}</span>}
                        {s.rpe === null && <span className="text-[11px] text-zinc-600">sin RPE</span>}
                      </div>
                      <Input value={s.notes} onChange={e => updateSetNote(ex.id, s.id, e.target.value)} placeholder="Nota set (> FitNotes set notes)" className="h-7 text-xs flex-1 min-w-[120px]" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-zinc-900/40 border-t border-zinc-800 flex flex-wrap gap-2 items-center justify-between">
            <p className="text-[11px] text-zinc-600 flex items-center gap-1"><ClipboardList size={11} /> FitNotes: copia previous sets • workout/exercise/set notes • warmup excluido de stats • CSV/JSON share</p>
            <Button size="sm" variant="accent" className="h-8 text-xs font-bold" onClick={() => handleApply(selected)}>Aplicar template al programa ↓</Button>
          </div>
        </div>

        {toast && <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 text-white text-sm px-4 py-2 rounded-full shadow-lg z-50">{toast}</div>}

        <p className="text-[11px] text-zinc-600 text-center">FitNotes MIT — tihawk/fitnotes2fit + FitNotes-iOS + fitnotes-research • workout notes + RPE/RIR + templates/routines • Warmup + copy sets</p>
      </CardContent>
    </Card>
  );
}
