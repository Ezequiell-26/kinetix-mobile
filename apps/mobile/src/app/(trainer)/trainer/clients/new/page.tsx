"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, Loader2 } from "lucide-react";

export default function NewClient(){
  const r=useRouter();
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [form,setForm]=useState({name:"",email:"", goal:"HIPERTROFIA", plan:"PERSONALIZADO", status:"ACTIVO", age:"", weight:"", notes:""});
  async function submit(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setError(null);
    try{
      const res=await fetch("/api/clients",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form)});
      const data=await res.json().catch(()=>null);
      if(!res.ok) throw new Error(data?.error||"No se pudo crear el cliente.");
      r.push("/trainer/clients"); r.refresh();
    }catch(cause){
      setError(cause instanceof Error?cause.message:"No se pudo crear el cliente.");
    }finally{setLoading(false);}
  }
  return (
    <div className="max-w-[640px] mx-auto space-y-4">
      <div><h1 className="text-2xl font-display font-bold text-white">Nuevo cliente</h1><p className="mt-1 text-sm text-[#8193A5]">Creá un perfil y asignale un plan de seguimiento.</p></div>
      {error&&<div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-200"><AlertTriangle size={15} className="mt-0.5 shrink-0"/>{error}</div>}
      <Card className="border-primary/15 bg-[#0B151E]"><CardHeader><CardTitle>Datos del cliente</CardTitle></CardHeader>
        <CardContent><form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Nombre</Label><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required maxLength={120}/></div><div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></div></div>
          <div className="grid gap-4 sm:grid-cols-3"><div className="space-y-2"><Label>Objetivo</Label><select value={form.goal} onChange={e=>setForm({...form,goal:e.target.value})} className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm text-white"><option value="PERDIDA_GRASA">Pérdida de grasa</option><option value="HIPERTROFIA">Hipertrofia</option><option value="FUERZA">Fuerza</option><option value="RECOMPOSICION">Recomposición</option></select></div><div className="space-y-2"><Label>Plan</Label><select value={form.plan} onChange={e=>setForm({...form,plan:e.target.value})} className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm text-white"><option value="BASICO">Básico</option><option value="PERSONALIZADO">Personalizado</option><option value="PREMIUM">Premium</option></select></div><div className="space-y-2"><Label>Estado</Label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm text-white"><option value="ACTIVO">Activo</option><option value="PAUSADO">Pausado</option><option value="PENDIENTE">Pendiente</option></select></div></div>
          <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Edad</Label><Input type="number" min="13" max="120" value={form.age} onChange={e=>setForm({...form,age:e.target.value})}/></div><div className="space-y-2"><Label>Peso (kg)</Label><Input type="number" min="20" max="400" step="0.1" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})}/></div></div>
          <div className="space-y-2"><Label>Notas del entrenador (privadas)</Label><Textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Objetivos, limitaciones, observaciones..." maxLength={1000}/></div>
          <div className="flex gap-3"><Button type="button" variant="outline" onClick={()=>r.back()} disabled={loading}>Cancelar</Button><Button type="submit" variant="accent" disabled={loading} className="gap-2">{loading?<><Loader2 size={15} className="animate-spin"/> Guardando...</>:<><Check size={15}/> CREAR CLIENTE</>}</Button></div>
        </form></CardContent>
      </Card>
    </div>
  );
}
