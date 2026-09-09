"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDesc } from "@/components/ui/card";

export default function LoginPage(){
  const r = useRouter();
  const [email,setEmail]=useState("ezequiel@ezequielcoaching.com");
  const [password,setPassword]=useState("Admin123!");
  const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setErr("");
    const res = await fetch("/api/auth/login",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({email,password})});
    const j = await res.json();
    if(!res.ok){ setErr(j.error||"Error"); setLoading(false); return; }
    if(j.role==="TRAINER") r.push("/trainer/dashboard"); else r.push("/client/dashboard");
    r.refresh();
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#080808] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/30 to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#D6FF2A]/[0.03] rounded-full blur-[80px]" />
      <Card className="w-full max-w-[420px] relative">
        <CardHeader className="text-center space-y-3 pt-8">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#D6FF2A] flex items-center justify-center font-black text-black text-xl">E</div>
          <CardTitle className="text-2xl tracking-tight">EZEQUIEL COACHING</CardTitle>
          <CardDesc>Entrenamiento personalizado online</CardDesc>
          <div className="flex gap-2 justify-center pt-2">
            <button onClick={()=>{setEmail("ezequiel@ezequielcoaching.com"); setPassword("Admin123!");}} className="text-[11px] px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700">Trainer demo</button>
            <button onClick={()=>{setEmail("martin@demo.com"); setPassword("cliente123");}} className="text-[11px] px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700">Cliente demo</button>
          </div>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2"><Label>Email</Label><Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com" type="email" required /></div>
            <div className="space-y-2"><Label>Contraseña</Label><Input value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" type="password" required /></div>
            {err && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{err}</p>}
            <Button type="submit" variant="accent" className="w-full" disabled={loading}>{loading?"Ingresando...":"INGRESAR"}</Button>
            <div className="flex justify-between text-xs text-zinc-500 pt-2">
              <Link href="/register" className="hover:text-white">Crear cuenta</Link>
              <Link href="/forgot-password" className="hover:text-white">¿Olvidaste tu contraseña?</Link>
            </div>
            <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-500 leading-relaxed">
              <p className="font-semibold text-zinc-400 uppercase tracking-widest">Demos</p>
              <p>Trainer: ezequiel@ezequielcoaching.com / Admin123!</p>
              <p>Clientes: martin@demo.com / lucas@demo.com / sofia@demo.com / cliente123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
