"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDesc } from "@/components/ui/card";

export default function ForgotPage(){
  const [email,setEmail]=useState(""); const [sent,setSent]=useState(false); const [token,setToken]=useState(""); const [error,setError]=useState("");
  async function submit(e:React.FormEvent){
    e.preventDefault(); setError("");
    const res = await fetch("/api/auth/forgot-password",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({email})});
    const data = await res.json();
    if(data.token) setToken(data.token);
    setSent(true);
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#080808]">
      <Card className="w-full max-w-[420px]">
        <CardHeader className="text-center pt-8"><CardTitle>Recuperar contraseña</CardTitle><CardDesc>Te enviaremos un enlace a tu email</CardDesc></CardHeader>
        <CardContent>
          {!sent ? (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2"><Label>Email</Label><Input value={email} onChange={e=>setEmail(e.target.value)} required type="email" placeholder="tu@email.com" /></div>
              {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</p>}
              <Button variant="accent" className="w-full" type="submit">ENVIAR ENLACE</Button>
              <p className="text-center text-xs text-zinc-500"><Link href="/login" className="text-white">Volver al login</Link></p>
              <p className="text-xs text-zinc-600 text-center">Demo: Ezequiel / cliente — usa el login con demo creds si no tienes email</p>
            </form>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">\u2713</div>
              <p className="text-sm text-white">Si el email existe, recibirás instrucciones.</p>
              {token && <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs break-all"><p className="text-zinc-500">Token demo (copia para probar):</p><p className="text-[#D6FF2A] font-mono mt-1">{token}</p><p className="text-zinc-500 mt-2">En producción se envía por email con Resend.</p></div>}
              <Link href="/login" className="text-xs text-zinc-400 hover:text-white">Volver</Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
