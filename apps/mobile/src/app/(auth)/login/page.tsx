"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, TriangleAlert, Star, ArrowRight, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDesc } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState("ezequiel@ezequielcoaching.com");
  const [password, setPassword] = useState("Admin123!");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const j = await res.json();
    if (!res.ok) {
      setErr(j.error || "Error");
      setLoading(false);
      return;
    }
    if (j.role === "TRAINER") r.push("/trainer/dashboard");
    else r.push("/client/dashboard");
    r.refresh();
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-[#080808] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <Card className="w-full border-subtle/50 shadow-[0_20px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]">
          <CardHeader className="text-center space-y-4 pt-8 pb-2">
            {/* Logo with glow */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="relative mx-auto"
            >
              <div className="absolute inset-0 w-16 h-16 mx-auto rounded-2xl bg-primary/20 blur-xl" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center font-black text-black text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_32px_rgba(52,211,153,0.35)]">
                E
              </div>
            </motion.div>

            <div className="space-y-1">
              <CardTitle className="text-2xl tracking-tight">KinetiX</CardTitle>
              <CardDesc>Entrenamiento personalizado online</CardDesc>
            </div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500"
            >
              <span className="flex text-primary" aria-hidden="true">
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
              </span>
              Atletas entrenando cada semana con Ezequiel
            </motion.div>

            {/* Demo accounts */}
            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("ezequiel@ezequielcoaching.com");
                  setPassword("Admin123!");
                }}
                className="group text-[11px] font-bold px-3.5 py-2 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 min-h-[36px] transition-all flex items-center gap-1.5"
              >
                <Dumbbell size={12} />
                Trainer demo
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("martin@demo.com");
                  setPassword("cliente123");
                }}
                className="group text-[11px] font-bold px-3.5 py-2 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 min-h-[36px] transition-all flex items-center gap-1.5"
              >
                <ArrowRight size={12} />
                Cliente demo
              </button>
            </div>
          </CardHeader>

          <CardContent className="pb-8 pt-4">
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoFocus
                  required
                  className="bg-zinc-950/50 border-zinc-800 focus:border-primary/50 focus:bg-zinc-950"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="pr-12 bg-zinc-950/50 border-zinc-800 focus:border-primary/50 focus:bg-zinc-950"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-zinc-500 hover:text-white rounded-xl transition-colors"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {err && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3"
                >
                  <TriangleAlert size={16} className="shrink-0 mt-0.5" />
                  {err}
                </motion.div>
              )}

              {/* Primary CTA */}
              <Button
                type="submit"
                variant="accent"
                size="xl"
                className="w-full mt-2"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  <>
                    INGRESAR
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>

              <div className="flex justify-between pt-2">
                <Link
                  href="/register"
                  className="text-xs font-bold text-zinc-400 hover:text-primary transition-colors min-h-[44px] inline-flex items-center px-1"
                >
                  Crear cuenta
                </Link>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-zinc-400 hover:text-primary transition-colors min-h-[44px] inline-flex items-center px-1"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-[11px] text-zinc-600 mt-4">
          KinetiX © 2026 · Tu mejor versión, cada día
        </p>
      </motion.div>
    </div>
  );
}
