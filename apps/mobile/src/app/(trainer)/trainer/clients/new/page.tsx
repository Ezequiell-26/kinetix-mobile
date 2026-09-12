"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function NewClient(){
  const r=useRouter(); const [loading,setLoading]=useState(false);
  const [form,setForm]=useState({name:"",email:"", goal:"HIPERTROFIA", plan:"PERSONALIZADO", status:"ACTIVO", age:"", weight:"", notes:""});
  async function submit(e:React.FormEvent){
    e.preventDefault(); setLoading(true);
    const res=await fetch("/api/clients",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form)});
    if(res.ok) r.push("/trainer/clients"); else alert("Error al crear");
    setLoading(false);
  }
  return (
    <div className="max-w-[640px] mx-auto space-y-4">
      <h1 className="text-2xl font-display font-bold">Nuevo cliente</h1>
      <Card><CardHeader><CardTitle>Datos del cliente</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nombre</Label><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Objetivo</Label><select value={form.goal} onChange={e=>setForm({...form,goal:e.target.value})} className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white"><option value="PERDIDA_GRASA">Pérdida de grasa</option><option value="HIPERTROFIA">Hipertrofia</option><option value="FUERZA">Fuerza</option><option value="RECOMPOSICION">Recomposición</option></select></div>
              <div className="space-y-2"><Label>Plan</Label><select value={form.plan} onChange={e=>setForm({...form,plan:e.target.value})} className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white"><option value="BASICO">Básico</option><option value="PERSONALIZADO">Personalizado</option><option value="PREMIUM">Premium</option></select></div>
              <div className="space-y-2"><Label>Estado</Label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white"><option value="ACTIVO">Activo</option><option value="PAUSADO">Pausado</option><option value="PENDIENTE">Pendiente</option></select></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Edad</Label><Input type="number" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} /></div>
              <div className="space-y-2"><Label>Peso (kg)</Label><Input type="number" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})} /></div>
            </div>
            <div className="space-y-2"><Label>Notas del entrenador (privadas)</Label><Textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Objetivos, limitaciones, observaciones..." /></div>
            <div className="flex gap-3"><Button type="button" variant="outline" onClick={()=>r.back()}>Cancelar</Button><Button type="submit" variant="accent" disabled={loading}>{loading?"Guardando...":"CREAR CLIENTE"}</Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
