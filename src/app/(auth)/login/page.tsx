"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, TriangleAlert, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDesc } from "@/components/ui/card";

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
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/30 to-transparent pointer-events-none" />
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary/[0.05] rounded-full blur-[80px] pointer-events-none"
        aria-hidden="true"
      />
      <Card className="w-full max-w-[420px] relative">
        <CardHeader className="text-center space-y-3 pt-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary flex items-center justify-center font-black text-black text-2xl shadow-[0_8px_32px_rgba(52,211,153,0.35)]">
            E
          </div>
          <CardTitle className="text-2xl tracking-tight">EZEQUIEL COACHING</CardTitle>
          <CardDesc>Entrenamiento personalizado online</CardDesc>
          {/* Prueba social: reduce fricción en el primer contacto */}
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
            <span className="flex text-primary" aria-hidden="true">
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
            </span>
            Atletas entrenando cada semana con Ezequiel
          </p>
          <div className="flex gap-2 justify-center pt-1">
            <button
              type="button"
              onClick={() => {
                setEmail("ezequiel@ezequielcoaching.com");
                setPassword("Admin123!");
              }}
              className="text-[11px] font-bold px-3 py-2 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 min-h-[36px]"
            >
              Trainer demo
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("martin@demo.com");
                setPassword("cliente123");
              }}
              className="text-[11px] font-bold px-3 py-2 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 min-h-[36px]"
            >
              Cliente demo
            </button>
          </div>
        </CardHeader>
        <CardContent className="pb-8">
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
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-zinc-500 hover:text-white rounded-xl"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {err && (
              <p
                role="alert"
                className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3"
              >
                <TriangleAlert size={16} className="shrink-0 mt-0.5" />
                {err}
              </p>
            )}
            {/* Único primario por pantalla → toda la atención va al ingreso */}
            <Button
              type="submit"
              variant="accent"
              size="xl"
              className="w-full"
              disabled={loading}
              aria-busy={loading}
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Ingresando..." : "INGRESAR →"}
            </Button>
            <div className="flex justify-between pt-1">
              <Link
                href="/register"
                className="text-xs font-bold text-zinc-400 hover:text-white min-h-[44px] inline-flex items-center px-1"
              >
                Crear cuenta
              </Link>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-zinc-400 hover:text-white min-h-[44px] inline-flex items-center px-1"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
