"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FtueWizard } from "@/components/onboarding/ftue-wizard";

export default function OnboardingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // Si ya completado, redirigir a dashboard (evita loop FTUE)
  useEffect(() => {
    fetch("/api/onboarding")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json?.profile?.onboardingCompleted) {
          router.replace("/client/dashboard");
          return;
        }
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-[60dvh] flex items-center justify-center">
        <div className="animate-pulse text-zinc-500 text-sm">Preparando tu onboarding…</div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      <header className="max-w-2xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 text-[11px] font-black tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
          ✨ KINETIXFITT · Onboarding 60 segundos
        </div>
        <h1 className="text-3xl font-black text-white mt-4 tracking-tight">Armemos tu plan perfecto</h1>
        <p className="text-sm text-zinc-400 mt-2">4 pasos rápidos — tu coach recibe todo al instante y te asigna tu primer programa.</p>
      </header>
      <FtueWizard onComplete={() => router.push("/client/dashboard")} />
      <p className="text-center text-[11px] text-zinc-600 mt-6">
        ¿Ya tenés programa? <a href="/client/dashboard" className="text-primary hover:underline font-bold">Saltar al dashboard</a>
      </p>
    </div>
  );
}
