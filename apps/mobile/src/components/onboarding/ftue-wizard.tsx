'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Check, Dumbbell, Flame, Home, Sparkles, Target, Trophy, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STORAGE_KEY = "kinetixfitt_ftue_v2";
const TOTAL_STEPS = 4;

type Goal = "PERDIDA_GRASA" | "HIPERTROFIA" | "FUERZA" | "RECOMPOSICION";
type Experience = "Principiante" | "Intermedio" | "Avanzado";
type Equipment = "Casa" | "Gym" | "Mixto";

type WizardData = {
  goal: Goal | null;
  experience: Experience | null;
  availability: number | null;
  equipment: Equipment | null;
  onboardingStep: number;
  onboardingCompleted: boolean;
  xp: number;
};

const INITIAL: WizardData = {
  goal: null,
  experience: null,
  availability: null,
  equipment: null,
  onboardingStep: 0,
  onboardingCompleted: false,
  xp: 0,
};

const goals: Array<{ value: Goal; label: string; desc: string; icon: typeof Target }> = [
  { value: "PERDIDA_GRASA", label: "Pérdida de grasa", desc: "Definición y control de peso", icon: Flame },
  { value: "HIPERTROFIA", label: "Hipertrofia", desc: "Ganar músculo y volumen", icon: Dumbbell },
  { value: "FUERZA", label: "Fuerza", desc: "Mejorar rendimiento en básicos", icon: Trophy },
  { value: "RECOMPOSICION", label: "Recomposición", desc: "Músculo + definición", icon: Sparkles },
];
const experiences: Array<{ value: Experience; label: string; desc: string }> = [
  { value: "Principiante", label: "Principiante", desc: "Hasta 1 año entrenando" },
  { value: "Intermedio", label: "Intermedio", desc: "1 a 3 años" },
  { value: "Avanzado", label: "Avanzado", desc: "Más de 3 años" },
];
const equipment: Array<{ value: Equipment; label: string; desc: string; icon: typeof Home }> = [
  { value: "Casa", label: "Casa", desc: "Peso corporal, bandas y mancuernas", icon: Home },
  { value: "Gym", label: "Gym", desc: "Máquinas y pesos libres", icon: Building2 },
  { value: "Mixto", label: "Mixto", desc: "Casa + gimnasio", icon: Dumbbell },
];

function readLocal(): Partial<WizardData> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
function writeLocal(data: WizardData) {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

async function persist(patch: Partial<WizardData>) {
  await fetch("/api/onboarding", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  }).catch(() => undefined);
}

export function FtueWizard({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(INITIAL);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const local = { ...INITIAL, ...readLocal() } as WizardData;
    setData(local);
    setStep(Math.min(TOTAL_STEPS - 1, Math.max(0, Number(local.onboardingStep) || 0)));
    fetch("/api/onboarding", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (cancelled || !payload?.profile) return;
        const p = payload.profile as Partial<WizardData>;
        const next = { ...local, ...p };
        setData(next);
        writeLocal(next);
        if (!next.onboardingCompleted) setStep(Math.min(TOTAL_STEPS - 1, Math.max(0, Number(next.onboardingStep) || 0)));
      })
      .catch(() => undefined)
      .finally(() => { if (!cancelled) setHydrated(true); });
    return () => { cancelled = true; };
  }, []);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(data.goal);
    if (step === 1) return Boolean(data.experience && data.availability);
    if (step === 2) return Boolean(data.equipment);
    return true;
  }, [step, data.goal, data.experience, data.availability, data.equipment]);

  const update = useCallback(async (patch: Partial<WizardData>) => {
    const next = { ...data, ...patch };
    setData(next);
    writeLocal(next);
    await persist(patch);
  }, [data]);

  async function next() {
    if (!canContinue || saving) return;
    setSaving(true);
    try {
      const final = step === TOTAL_STEPS - 1;
      const patch: Partial<WizardData> = final
        ? { onboardingStep: TOTAL_STEPS, onboardingCompleted: true, xp: data.xp + 25 }
        : { onboardingStep: step + 1, xp: data.xp + 25 };
      await update(patch);
      if (final) onComplete?.();
      else setStep(step + 1);
    } finally { setSaving(false); }
  }

  async function back() {
    if (step > 0 && !saving) setStep(step - 1);
  }

  async function skip() {
    if (saving) return;
    setSaving(true);
    try {
      const final = step === TOTAL_STEPS - 1;
      const patch: Partial<WizardData> = final
        ? { onboardingStep: TOTAL_STEPS, onboardingCompleted: true }
        : { onboardingStep: step + 1 };
      await update(patch);
      if (final) onComplete?.();
      else setStep(step + 1);
    } finally { setSaving(false); }
  }

  if (!hydrated) return <div className="min-h-[50dvh] grid place-items-center text-sm text-[#8193A5]">Preparando tu perfil…</div>;

  if (data.onboardingCompleted) {
    return (
      <Card className="mx-auto max-w-lg border-primary/20 bg-[#0B151E]">
        <CardContent className="space-y-5 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-black shadow-[0_14px_40px_rgba(198,249,30,0.18)]"><Check size={30} strokeWidth={3} /></div>
          <div><h2 className="text-2xl font-black">Perfil listo</h2><p className="mt-2 text-sm text-[#8193A5]">Tus preferencias ya están guardadas. Tu coach y KinetixFitt pueden usarlas para personalizar tu experiencia.</p></div>
          <Button variant="accent" className="w-full font-black" onClick={() => onComplete?.()}>Ir al dashboard <ArrowRight size={17} /></Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Badge variant="accent"><Target size={12} /> Paso {step + 1} de {TOTAL_STEPS}</Badge>
        <span className="text-xs font-semibold text-[#8193A5]">{data.xp} XP</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]"><div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} /></div>

      {step === 0 && (
        <Card className="border-white/[0.07] bg-[#0B151E]"><CardHeader><CardTitle className="text-2xl font-black">¿Qué querés conseguir?</CardTitle><p className="text-sm text-[#8193A5]">Elegí el objetivo que mejor represente tu etapa actual.</p></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{goals.map((item) => { const Icon = item.icon; const selected = data.goal === item.value; return <button key={item.value} type="button" onClick={() => void update({ goal: item.value })} className={`rounded-2xl border p-4 text-left transition ${selected ? "border-primary bg-primary/[0.07]" : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14]"}`}><div className="flex items-start gap-3"><div className={`rounded-xl p-2 ${selected ? "bg-primary text-black" : "bg-white/[0.06] text-[#8193A5]"}`}><Icon size={18} /></div><div><p className="font-bold">{item.label}</p><p className="mt-1 text-xs text-[#8193A5]">{item.desc}</p></div></div></button>; })}</CardContent></Card>
      )}

      {step === 1 && (
        <Card className="border-white/[0.07] bg-[#0B151E]"><CardHeader><CardTitle className="text-2xl font-black">Contanos tu experiencia</CardTitle><p className="text-sm text-[#8193A5]">También elegí cuántos días reales podés entrenar.</p></CardHeader><CardContent className="space-y-5"><div className="grid gap-3 sm:grid-cols-3">{experiences.map((item) => { const selected = data.experience === item.value; return <button key={item.value} type="button" onClick={() => void update({ experience: item.value })} className={`rounded-2xl border p-4 text-left ${selected ? "border-primary bg-primary/[0.07]" : "border-white/[0.07] bg-white/[0.02]"}`}><p className="font-bold">{item.label}</p><p className="mt-1 text-xs text-[#8193A5]">{item.desc}</p></button>; })}</div><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#8193A5]">Días por semana</p><div className="grid grid-cols-4 gap-2">{[3,4,5,6].map((days) => <button key={days} type="button" onClick={() => void update({ availability: days })} className={`rounded-xl border py-3 text-sm font-black ${data.availability === days ? "border-primary bg-primary text-black" : "border-white/[0.07] bg-white/[0.02] text-white"}`}>{days}</button>)}</div></div></CardContent></Card>
      )}

      {step === 2 && (
        <Card className="border-white/[0.07] bg-[#0B151E]"><CardHeader><CardTitle className="text-2xl font-black">¿Dónde entrenás?</CardTitle><p className="text-sm text-[#8193A5]">Esto permite adaptar ejercicios y equipamiento.</p></CardHeader><CardContent className="grid gap-3 sm:grid-cols-3">{equipment.map((item) => { const Icon = item.icon; const selected = data.equipment === item.value; return <button key={item.value} type="button" onClick={() => void update({ equipment: item.value })} className={`rounded-2xl border p-4 text-left ${selected ? "border-primary bg-primary/[0.07]" : "border-white/[0.07] bg-white/[0.02]"}`}><Icon size={20} className={selected ? "text-primary" : "text-[#8193A5]"}/><p className="mt-3 font-bold">{item.label}</p><p className="mt-1 text-xs text-[#8193A5]">{item.desc}</p></button>; })}</CardContent></Card>
      )}

      {step === 3 && (
        <Card className="border-white/[0.07] bg-[#0B151E]"><CardHeader className="text-center"><div className="mx-auto rounded-2xl bg-primary/[0.07] p-3 text-primary w-fit"><UserRound size={22} /></div><CardTitle className="text-2xl font-black">Último paso</CardTitle><p className="text-sm text-[#8193A5]">Tu foto es opcional. Podés agregarla después desde tu perfil.</p></CardHeader><CardContent className="text-center"><p className="text-sm text-[#9AAABB]">Objetivo <span className="font-bold text-white">{data.goal?.replaceAll("_", " ") || "—"}</span> · {data.availability || "—"} días/semana · {data.experience || "—"}</p><div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 text-left"><p className="text-sm font-bold">Todo queda guardado</p><p className="mt-1 text-xs leading-5 text-[#8193A5]">Podés modificar estos datos más adelante. No necesitás completar una foto para comenzar.</p></div></CardContent></Card>
      )}

      <div className="flex items-center justify-between gap-3"><Button type="button" variant="outline" onClick={() => void back()} disabled={step === 0 || saving}><ArrowLeft size={16} /> Atrás</Button><div className="flex gap-2"><Button type="button" variant="ghost" onClick={() => void skip()} disabled={saving}>Omitir</Button><Button type="button" variant="accent" onClick={() => void next()} disabled={!canContinue || saving}>{saving ? "Guardando…" : step === TOTAL_STEPS - 1 ? "Finalizar" : "Continuar"} <ArrowRight size={16} /></Button></div></div>
    </div>
  );
}
