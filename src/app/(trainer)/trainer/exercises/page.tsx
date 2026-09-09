/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExerciseIllustrationGrid } from "@/components/exercise-illustration";
import { SearchableDropdown } from "@/components/searchable-dropdown";
import { useDebounce } from "@/hooks/use-debounce";

type Exercise = {
  id:string;
  name:string;
  muscleGroup:string;
  pattern?: string | null;
  level:string;
  equipment:string | null;
  image:string | null;
  video?: string | null;
  instructions:string | null;
};

const groups = ["Todos","Chest","Back","Legs","Shoulders","Biceps","Triceps","Abdominals","Glutes","Cardio","Piernas","Glúteos","Pecho","Espalda","Hombros","Bíceps","Tríceps","Core"];

export default function ExercisesPage(){
  const [exercises,setExercises]=useState<Exercise[]>([]);
  const [q,setQ]=useState(""); const [g,setG]=useState("Todos");
  const [showForm,setShowForm]=useState(false);
  const [selected,setSelected]=useState<Exercise | null>(null);
  const [editing,setEditing]=useState<Exercise | null>(null);
  const [newEx,setNewEx]=useState({name:"", muscleGroup:"Pecho", equipment:"Barra", level:"Intermedio"});
  const debouncedQ = useDebounce(q, 250);

  useEffect(()=>{
    fetch(`/api/exercises?q=${encodeURIComponent(debouncedQ)}&group=${encodeURIComponent(g)}`)
      .then(r=>r.json())
      .then(d=>{ if(Array.isArray(d)) setExercises(d); })
      .catch(()=>{});
  },[debouncedQ, g]);

  useEffect(()=>{
    if(exercises.length===0){
      fetch("/data/exercises_100.json").then(r=>r.json()).then((data: Array<{name:string; muscleGroup:string; equipment:string; level:string; instructions:string; image:string|null; id:string; pattern?:string}>)=>{
        if(Array.isArray(data) && data.length){
          const mapped = data.map(e=>({
            id:e.id,
            name:e.name,
            muscleGroup: e.muscleGroup || "General",
            pattern: e.pattern || null,
            level: e.level || "Intermedio",
            equipment: e.equipment,
            image: e.image,
            instructions: e.instructions || null,
          }));
          if(exercises.length===0) setExercises(mapped as Exercise[]);
        }
      }).catch(()=>{});
    }
  },[exercises.length]);

  const filtered = useMemo(()=> exercises, [exercises]);

  async function createExercise(){
    if(!newEx.name) return;
    const res = await fetch("/api/exercises",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(newEx)});
    if(res.ok){
      const created = await res.json();
      setExercises([created, ...exercises]);
      setShowForm(false);
      setNewEx({name:"", muscleGroup:"Pecho", equipment:"Barra", level:"Intermedio"});
    }
  }

  async function saveEdit(){
    if(!editing || !editing.name) return;
    const res = await fetch(`/api/exercises/${editing.id}`,{method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify(editing)});
    if(res.ok){
      const updated = await res.json();
      setExercises(exercises.map(e=> e.id===updated.id ? updated : e));
      setEditing(null);
      setSelected(updated);
    }
  }

  async function deleteExercise(id:string){
    if(!confirm("¿Eliminar ejercicio?")) return;
    const res = await fetch(`/api/exercises/${id}`,{method:"DELETE"});
    if(res.ok){
      setExercises(exercises.filter(e=>e.id!==id));
      setSelected(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-display font-bold">Biblioteca de ejercicios</h1><p className="text-sm text-zinc-500">{exercises.length} ejercicios • Free Exercise DB (Unlicense) + DB</p></div>
        <Button variant="accent" size="sm" onClick={()=>setShowForm(!showForm)}>{showForm?"Cerrar":"+ Nuevo ejercicio"}</Button>
      </div>
      {showForm && (
        <Card><CardContent className="pt-6 grid sm:grid-cols-2 gap-4">
          <Input placeholder="Nombre" value={newEx.name} onChange={e=>setNewEx({...newEx, name:e.target.value})} />
          <Input placeholder="Grupo muscular" value={newEx.muscleGroup} onChange={e=>setNewEx({...newEx, muscleGroup:e.target.value})} />
          <Input placeholder="Equipamiento" value={newEx.equipment} onChange={e=>setNewEx({...newEx, equipment:e.target.value})} />
          <Input placeholder="Nivel" value={newEx.level} onChange={e=>setNewEx({...newEx, level:e.target.value})} />
          <Button variant="accent" className="sm:col-span-2" onClick={createExercise}>Guardar ejercicio</Button>
        </CardContent></Card>
      )}
      <Card><CardContent className="pt-6 space-y-3">
        <Input placeholder="Buscar ejercicio..." value={q} onChange={e=>setQ(e.target.value)} />
        <div className="pb-2">
          <SearchableDropdown options={exercises.map(e=>e.name)} value={q} onChange={setQ} placeholder="Buscar por nombre (MIT SearchableDropdown)" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {groups.map(gr=>(
            <button key={gr} onClick={()=>setG(gr)} className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border font-semibold ${g===gr?"bg-white text-black border-white":"bg-zinc-900 text-zinc-400 border-zinc-800"}`}>{gr}</button>
          ))}
        </div>
      </CardContent></Card>
      <ExerciseIllustrationGrid exercises={exercises.slice(0,8).map(e=>({name:e.name, muscleGroup:e.muscleGroup}))} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(e=>(
          <Card key={e.id} className="overflow-hidden hover:border-zinc-700 transition group">
            <div className="h-36 bg-zinc-900 relative overflow-hidden cursor-pointer" onClick={()=>setSelected(e)}>
              {e.image ? <img src={e.image} alt={e.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600">Sin imagen</div>}
              <div className="absolute top-2 left-2 flex gap-1"><Badge variant="muted">{e.muscleGroup}</Badge><Badge variant="accent">{e.level}</Badge></div>
            </div>
            <CardContent className="pt-4">
              <p className="font-semibold text-white line-clamp-2 cursor-pointer" onClick={()=>setSelected(e)}>{e.name}</p>
              <p className="text-xs text-zinc-500">{e.equipment || "—"} • {e.muscleGroup}</p>
              <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{e.instructions || "Controla la técnica y progresa."}</p>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1" onClick={()=>setSelected(e)}>Ver detalle</Button>
                <Button variant="ghost" size="sm" onClick={()=>setEditing(e)}>Editar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length===0 && <Card className="sm:col-span-3"><CardContent className="py-12 text-center text-zinc-500">Sin resultados para &ldquo;{q}&rdquo;</CardContent></Card>}
      </div>
      <p className="text-xs text-zinc-500 text-center">Datos de <a href="https://github.com/yuhonas/free-exercise-db" target="_blank" className="underline">Free Exercise DB</a> (Unlicense, 800+ ejercicios) • Imágenes vía raw.githubusercontent • + DB local 100 ejercicios</p>

      {/* Detail Modal - PREMIUM */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={()=>setSelected(null)}>
          <div className="bg-zinc-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto border border-zinc-800" onClick={e=>e.stopPropagation()}>
            <div className="relative h-48 bg-zinc-800">
              {selected.image ? <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600">Sin imagen</div>}
              <button onClick={()=>setSelected(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-lg leading-none hover:bg-black/80">×</button>
              <div className="absolute bottom-3 left-3 flex gap-2"><Badge variant="muted">{selected.muscleGroup}</Badge><Badge variant="accent">{selected.level}</Badge></div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                <p className="text-sm text-zinc-400 mt-1">{selected.equipment || "Peso corporal"} • {selected.muscleGroup} • {selected.pattern || "General"}</p>
              </div>
              <div className="bg-zinc-800 rounded-xl p-4">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Instrucciones</p>
                <p className="text-sm text-zinc-200 leading-relaxed">{selected.instructions || "Controla la técnica, respira y progresa. Mantén el core activo y usa rango completo."}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-zinc-800 rounded-xl p-3"><p className="text-zinc-500">Equipamiento</p><p className="text-white font-semibold mt-1">{selected.equipment || "—"}</p></div>
                <div className="bg-zinc-800 rounded-xl p-3"><p className="text-zinc-500">Nivel</p><p className="text-white font-semibold mt-1">{selected.level}</p></div>
              </div>
              <div className="flex gap-2">
                <Button variant="accent" className="flex-1" onClick={()=>{ setEditing(selected); }}>Editar</Button>
                <Button variant="ghost" onClick={()=>deleteExercise(selected.id)} className="text-red-400">Eliminar</Button>
                <Button variant="outline" onClick={()=>setSelected(null)}>Cerrar</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={()=>setEditing(null)}>
          <div className="bg-zinc-900 rounded-2xl max-w-md w-full p-6 border border-zinc-800 space-y-4" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white">Editar ejercicio</h3>
            <Input placeholder="Nombre" value={editing.name} onChange={e=>setEditing({...editing, name:e.target.value})} />
            <Input placeholder="Grupo muscular" value={editing.muscleGroup} onChange={e=>setEditing({...editing, muscleGroup:e.target.value})} />
            <Input placeholder="Equipamiento" value={editing.equipment || ""} onChange={e=>setEditing({...editing, equipment:e.target.value})} />
            <Input placeholder="Nivel" value={editing.level} onChange={e=>setEditing({...editing, level:e.target.value})} />
            <textarea className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" rows={3} placeholder="Instrucciones" value={editing.instructions || ""} onChange={e=>setEditing({...editing, instructions:e.target.value})} />
            <div className="flex gap-2">
              <Button variant="accent" className="flex-1" onClick={saveEdit}>Guardar</Button>
              <Button variant="ghost" onClick={()=>setEditing(null)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
