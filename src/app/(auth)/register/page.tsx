"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDesc } from "@/components/ui/card";
export default function RegisterPage(){
  const r=useRouter();
  const [form,setForm]=useState({name:"",email:"",password:"", role:"CLIENT"});
  const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setErr("");
    const res=await fetch("/api/auth/register",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form)});
    const j=await res.json();
    if(!res.ok){ setErr(j.error); setLoading(false); return;}
    if(j.role==="TRAINER") r.push("/trainer/dashboard"); else r.push("/client/dashboard");
    r.refresh();
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#080808]">
      <Card className="w-full max-w-[440px]">
        <CardHeader className="text-center pt-8">
          <CardTitle className="text-2xl">Crear cuenta</CardTitle><CardDesc>Únete a EZEQUIEL COACHING</CardDesc>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2"><Label>Nombre completo</Label><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
            <div className="space-y-2"><Label>Contraseña</Label><Input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required /></div>
            <div className="space-y-2"><Label>Rol</Label>
              <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white">
                <option value="CLIENT">Cliente</option><option value="TRAINER">Entrenador</option>
              </select>
            </div>
            {err && <p role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{err}</p>}
            <Button type="submit" variant="accent" className="w-full" disabled={loading}>{loading?"Creando...":"CREAR CUENTA"}</Button>
            <p className="text-center text-xs text-zinc-500">¿Ya tienes cuenta? <Link href="/login" className="text-white hover:underline">Ingresar</Link></p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
