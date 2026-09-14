"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDesc } from "@/components/ui/card";

export default function RegisterPage(){
  const r = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent){
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const j = await res.json() as { ok?: boolean; role?: string; error?: string };
    if(!res.ok || !j.ok){
      setErr(j.error || "Error");
      setLoading(false);
      return;
    }
    if(j.role === "TRAINER") r.push("/trainer/dashboard");
    else r.push("/client/onboarding");
    r.refresh();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit(e);
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-[#080808] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/[0.04] rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <Card className="w-full border-subtle/50 shadow-[0_20px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]">
          <CardHeader className="text-center space-y-4 pt-8 pb-2">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="relative mx-auto"
            >
              <div className="absolute inset-0 w-14 h-14 mx-auto rounded-2xl bg-primary/20 blur-xl" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_32px_rgba(52,211,153,0.35)]">
                <UserPlus size={24} />
              </div>
            </motion.div>

            <div className="space-y-1">
              <CardTitle className="text-2xl tracking-tight">Crear cuenta</CardTitle>
              <CardDesc>Únete a KINETIXFITT</CardDesc>
            </div>
          </CardHeader>

          <CardContent className="pb-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre completo</Label>
                <Input
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="Tu nombre"
                  required
                  className="bg-zinc-950/50 border-zinc-800 focus:border-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="tu@email.com"
                  required
                  className="bg-zinc-950/50 border-zinc-800 focus:border-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Contraseña</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="••••••••"
                  required
                  className="bg-zinc-950/50 border-zinc-800 focus:border-primary/50"
                />
              </div>

              {/* Honeypot anti-bot: campo invisible para personas, tentador para
                  bots que autocompletan formularios. Nadie debería tocarlo nunca;
                  si llega lleno, el backend descarta el registro en silencio. */}
              <div style={{position:"absolute", left:"-9999px", width:1, height:1, overflow:"hidden"}} aria-hidden="true">
                <label htmlFor="company">No completar este campo</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={e => setForm({...form, company: e.target.value})}
                />
              </div>

              <p className="text-xs text-zinc-500 rounded-xl border border-subtle bg-surface/40 px-3 py-2.5">
                Tu cuenta es de <span className="font-bold text-zinc-200">atleta</span>. Si eres entrenador, escríbele a KinetixFitt para tu acceso.
              </p>

              {err && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3"
                >
                  {err}
                </motion.div>
              )}

              <Button
                type="submit"
                variant="accent"
                size="xl"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Creando...</>
                ) : (
                  <>CREAR CUENTA <ArrowRight size={18} /></>
                )}
              </Button>

              <p className="text-center text-xs text-zinc-500">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-primary hover:underline font-bold">Ingresar</Link>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-[11px] text-zinc-600 mt-4">
          KINETIXFITT © 2026 · Tu mejor versión, cada día
        </p>
      </motion.div>
    </div>
  );
}
