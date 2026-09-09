/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, Plus, Search, Check } from "lucide-react";

type ExerciseItem = {
  id: string;
  name: string;
  muscleGroup: string;
  pattern: string | null;
  equipment: string | null;
  level: string;
  image: string | null;
  video: string | null;
  instructions: string | null;
};

const muscleGroups = ["Todos", "Pecho", "Espalda", "Piernas", "Glúteos", "Hombros", "Bíceps", "Tríceps", "Core"];

export default function ExercisesPage(){
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("Todos");
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("Pecho");
  const [equipment, setEquipment] = useState("Barra");
  const [level, setLevel] = useState("Intermedio");
  const [image, setImage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadExercises(){
    setLoading(true);
    try {
      const res = await fetch("/api/exercises");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setExercises(data);
      }
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    loadExercises();
  }, []);

  async function handleCreateExercise(e: React.FormEvent){
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          muscleGroup,
          equipment,
          level,
          image: image.trim() || null,
          instructions: instructions.trim() || null
        })
      });

      if (res.ok) {
        setShowForm(false);
        setName("");
        setImage("");
        setInstructions("");
        loadExercises();
      } else {
        alert("Error al guardar ejercicio");
      }
    } catch {
      alert("Error al guardar ejercicio");
    } finally {
      setSaving(false);
    }
  }

  const filtered = exercises.filter(e => {
    const matchesGroup = selectedGroup === "Todos" || e.muscleGroup.toLowerCase() === selectedGroup.toLowerCase();
    const matchesSearch = e.name.toLowerCase().includes(q.toLowerCase()) || 
      (e.equipment && e.equipment.toLowerCase().includes(q.toLowerCase()));
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Biblioteca de Ejercicios</h1>
          <p className="text-sm text-zinc-400">
            {exercises.length} ejercicios registrados en la base de datos
          </p>
        </div>
        <Button
          variant="accent"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="font-bold min-h-[44px]"
        >
          {showForm ? "✕ Cerrar Formulario" : "+ Nuevo Ejercicio"}
        </Button>
      </div>

      {/* New Exercise Form */}
      {showForm && (
        <Card className="border-[#D6FF2A]/30 bg-zinc-950 animate-in fade-in">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Dumbbell size={18} className="text-[#D6FF2A]" /> Dar de Alta Nuevo Ejercicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateExercise} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nombre del Ejercicio</Label>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej: Press Francés con Barra Z"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Grupo Muscular</Label>
                  <select
                    value={muscleGroup}
                    onChange={e => setMuscleGroup(e.target.value)}
                    className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#D6FF2A]"
                  >
                    {muscleGroups.filter(g => g !== "Todos").map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Equipamiento</Label>
                  <select
                    value={equipment}
                    onChange={e => setEquipment(e.target.value)}
                    className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#D6FF2A]"
                  >
                    <option value="Barra">Barra</option>
                    <option value="Mancuernas">Mancuernas</option>
                    <option value="Polea">Polea</option>
                    <option value="Máquina">Máquina</option>
                    <option value="Peso corporal">Peso corporal</option>
                    <option value="Kettlebell">Kettlebell</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Nivel</Label>
                  <select
                    value={level}
                    onChange={e => setLevel(e.target.value)}
                    className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#D6FF2A]"
                  >
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>URL de Imagen o Video de Demostración (opcional)</Label>
                <Input
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-1.5">
                <Label>Instrucciones de Ejecución</Label>
                <Input
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="Posición de inicio, retracción escapular, respiración y ritmo..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="accent" size="sm" disabled={saving} className="font-bold">
                  {saving ? "Guardando..." : "Guardar en Base de Datos ✓"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter and Search */}
      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Buscar ejercicio por nombre o equipamiento..."
              value={q}
              onChange={e => setQ(e.target.value)}
              className="pl-9 bg-zinc-950 border-zinc-800 text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {muscleGroups.map(g => (
              <button
                key={g}
                onClick={() => setSelectedGroup(g)}
                className={`whitespace-nowrap text-xs px-3.5 py-1.5 rounded-full border transition font-medium ${
                  selectedGroup === g
                    ? "bg-white text-black border-white font-bold"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exercises Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-zinc-500">Cargando ejercicios...</div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed border-zinc-800 bg-zinc-900/40">
          <CardContent className="py-12 text-center space-y-2">
            <p className="font-bold text-sm text-white">No se encontraron ejercicios</p>
            <p className="text-xs text-zinc-500">Probá con otro término o agregá un nuevo ejercicio.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map(e => (
            <Card key={e.id} className="border-zinc-800 bg-zinc-900/90 overflow-hidden hover:border-zinc-700 transition flex flex-col justify-between">
              <div>
                {e.image && (
                  <div className="h-36 bg-zinc-950 relative overflow-hidden">
                    <img src={e.image} alt={e.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <Badge variant="muted" className="text-[10px] bg-black/70 backdrop-blur">{e.muscleGroup}</Badge>
                      <Badge variant="accent" className="text-[10px]">{e.level}</Badge>
                    </div>
                  </div>
                )}
                <CardContent className="p-4 space-y-2">
                  {!e.image && (
                    <div className="flex gap-1.5 mb-1">
                      <Badge variant="muted" className="text-[10px]">{e.muscleGroup}</Badge>
                      <Badge variant="accent" className="text-[10px]">{e.level}</Badge>
                    </div>
                  )}
                  <h3 className="font-bold text-sm text-white">{e.name}</h3>
                  <p className="text-xs text-zinc-400">Equipamiento: <span className="text-zinc-200">{e.equipment || "Libre"}</span></p>
                  {e.instructions && (
                    <p className="text-xs text-zinc-400 italic line-clamp-2 pt-1">{e.instructions}</p>
                  )}
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
