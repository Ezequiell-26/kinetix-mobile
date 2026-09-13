"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDesc } from "@/components/ui/card";

export default function ForgotPage(){
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent){
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    if(!res.ok){
      try{
        const d = await res.json() as { error?: string };
        setError(d.error || "No se pudo procesar");
      } catch {
        setError("No se pudo procesar");
      }
      setLoading(false);
      return;
    }
    setLoading(false);
    setSent(true);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit(e);
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-[#080808] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px]"
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
              {sent ? (
                <>
                  <div className="absolute inset-0 w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 blur-xl" />
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_32px_rgba(16,185,129,0.35)]">
                    <CheckCircle2 size={28} />
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 w-14 h-14 mx-auto rounded-2xl bg-primary/20 blur-xl" />
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_32px_rgba(52,211,153,0.35)]">
                    <Mail size={24} />
                  </div>
                </>
              )}
            </motion.div>

            <div className="space-y-1">
              <CardTitle className="text-2xl tracking-tight">
                {sent ? "Email enviado" : "Recuperar contraseña"}
              </CardTitle>
              <CardDesc>
                {sent
                  ? "Revisa tu bandeja de entrada"
                  : "Te enviaremos un enlace a tu email"}
              </CardDesc>
            </div>
          </CardHeader>

          <CardContent className="pb-8 pt-4">
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    type="email"
                    placeholder="tu@email.com"
                    className="bg-zinc-950/50 border-zinc-800 focus:border-primary/50"
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3"
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  variant="accent"
                  size="xl"
                  className="w-full"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Enviando...</>
                  ) : (
                    "ENVIAR ENLACE"
                  )}
                </Button>

                <p className="text-center text-xs text-zinc-500">
                  <Link href="/login" className="text-primary hover:underline font-bold inline-flex items-center gap-1">
                    <ArrowLeft size={12} /> Volver al login
                  </Link>
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6 space-y-3"
              >
                <p className="text-sm text-zinc-300">
                  Si el email existe, recibirás instrucciones para restablecer tu contraseña.
                </p>
                <p className="text-xs text-zinc-500">
                  En desarrollo, el enlace de recuperación se imprime en la consola del servidor.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-bold"
                >
                  <ArrowLeft size={12} /> Volver al login
                </Link>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-[11px] text-zinc-600 mt-4">
          EZEQUIEL COACHING © 2026 · Tu mejor versión, cada día
        </p>
      </motion.div>
    </div>
  );
}
