"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Dumbbell,
  Home,
  Building2,
  Camera,
  Trophy,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Star,
  Zap,
  Flame,
  Upload,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ────────────────────────────────────────────────────────────────
// Tipos
// ────────────────────────────────────────────────────────────────
type Goal = "PERDIDA_GRASA" | "HIPERTROFIA" | "FUERZA" | "RECOMPOSICION";
type Experience = "Principiante" | "Intermedio" | "Avanzado";
type Equipment = "Casa" | "Gym" | "Mixto";

interface WizardData {
  goal: Goal | null;
  experience: Experience | null;
  availability: number | null;
  equipment: Equipment | null;
  photoUrl: string | null;
  onboardingStep: number;
  xp: number;
  onboardingCompleted: boolean;
}

const LS_KEY = "kinetix_ftue_v1";

const GOAL_OPTIONS: Array<{
  value: Goal;
  label: string;
  desc: string;
  icon: typeof Target;
  img: string;
}> = [
  {
    value: "PERDIDA_GRASA",
    label: "Pérdida de grasa",
    desc: "Definir y bajar % graso",
    icon: Flame,
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60",
  },
  {
    value: "HIPERTROFIA",
    label: "Hipertrofia",
    desc: "Ganar músculo y volumen",
    icon: Dumbbell,
    img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=60",
  },
  {
    value: "FUERZA",
    label: "Fuerza",
    desc: "Más kilos en básicos",
    icon: Trophy,
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60",
  },
  {
    value: "RECOMPOSICION",
    label: "Recomposición",
    desc: "Músculo + definición",
    icon: Sparkles,
    img: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&auto=format&fit=crop&q=60",
  },
];

const EXPERIENCE_OPTIONS: Array<{ value: Experience; label: string; desc: string }> = [
  { value: "Principiante", label: "Principiante", desc: "0–1 año entrenando" },
  { value: "Intermedio", label: "Intermedio", desc: "1–3 años" },
  { value: "Avanzado", label: "Avanzado", desc: "3+ años / competí" },
];

const AVAILABILITY_OPTIONS = [3, 4, 5, 6] as const;

const EQUIPMENT_OPTIONS: Array<{
  value: Equipment;
  label: string;
  desc: string;
  icon: typeof Home;
  img: string;
}> = [
  {
    value: "Casa",
    label: "Casa",
    desc: "Mancuernas, bandas, peso corporal",
    icon: Home,
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=60",
  },
  {
    value: "Gym",
    label: "Gym",
    desc: "Máquinas y barra completa",
    icon: Building2,
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60",
  },
  {
    value: "Mixto",
    label: "Mixto",
    desc: "Casa + gym según el día",
    icon: Dumbbell,
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60",
  },
];

// ────────────────────────────────────────────────────────────────
// Helpers persistencia dual
// ────────────────────────────────────────────────────────────────
function loadLocal(): Partial<WizardData> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Partial<WizardData>) : null;
  } catch {
    return null;
  }
}
function saveLocal(data: WizardData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}
async function persistDB(patch: Partial<WizardData>) {
  try {
    await fetch("/api/onboarding", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  } catch {
    // offline / error: localStorage ya guardó el estado
  }
}

// ────────────────────────────────────────────────────────────────
// Componente principal
// ────────────────────────────────────────────────────────────────
export function FtueWizard({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    goal: null,
    experience: null,
    availability: null,
    equipment: null,
    photoUrl: null,
    onboardingStep: 0,
    xp: 0,
    onboardingCompleted: false,
  });
  const [showSkipNudge, setShowSkipNudge] = useState(false);
  const [pendingSkipStep, setPendingSkipStep] = useState<number | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Hydrate: localStorage + DB (DB gana si tiene onboardingCompleted)
  useEffect(() => {
    const local = loadLocal();
    if (local) {
      setData((prev) => ({ ...prev, ...local }));
      if (typeof local.onboardingStep === "number") setStep(local.onboardingStep);
      if (local.photoUrl) setUploadPreview(local.photoUrl);
    }
    // DB fetch en background: sobrescribe si hay datos más frescos
    fetch("/api/onboarding")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!json || json.profile == null) {
          setHydrated(true);
          return;
        }
        const p = json.profile as {
          goal?: Goal | null;
          experience?: string | null;
          availability?: number | null;
          equipment?: string | null;
          photoUrl?: string | null;
          onboardingCompleted?: boolean;
          onboardingStep?: number;
          xp?: number;
        };
        setData((prev) => {
          const merged: WizardData = {
            ...prev,
            goal: (p.goal as Goal) ?? prev.goal,
            experience: (p.experience as Experience) ?? prev.experience,
            availability: p.availability ?? prev.availability,
            equipment: (p.equipment as Equipment) ?? prev.equipment,
            photoUrl: p.photoUrl ?? prev.photoUrl,
            onboardingCompleted: p.onboardingCompleted ?? prev.onboardingCompleted,
            onboardingStep: p.onboardingStep ?? prev.onboardingStep,
            xp: p.xp ?? prev.xp,
          };
          saveLocal(merged);
          return merged;
        });
        if (typeof p.onboardingStep === "number" && p.onboardingStep < 4 && !p.onboardingCompleted) {
          setStep(p.onboardingStep);
        }
        if (p.photoUrl) setUploadPreview(p.photoUrl);
        // si ya completado, no pisar step
        if (p.onboardingCompleted) {
          setShowConfetti(true);
        }
        setHydrated(true);
      })
      .catch(() => setHydrated(true));
  }, []);

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;
  const xpDisplay = data.xp;

  const updateData = useCallback(
    (patch: Partial<WizardData>) => {
      setData((prev) => {
        const next = { ...prev, ...patch };
        saveLocal(next);
        return next;
      });
      void persistDB(patch);
    },
    []
  );

  const goNext = useCallback(
    async (extraPatch?: Partial<WizardData>) => {
      const isLast = step === totalSteps - 1;
      const xpGain = extraPatch?.photoUrl ? 15 : 25;
      // Si es último paso y hay foto, bonus ya contado; si no, +25 por completar wizard
      const nextStep = isLast ? totalSteps : step + 1;
      const nextXp = isLast ? data.xp + 10 + (data.photoUrl || extraPatch?.photoUrl ? 0 : 0) : data.xp + 25;

      // patch base
      const patch: Partial<WizardData> = {
        onboardingStep: nextStep,
        xp: extraPatch?.xp ?? nextXp,
        ...extraPatch,
      };
      // sumar xpGain si no es último y no vino xp explícito
      if (!isLast && extraPatch?.xp == null) {
        patch.xp = data.xp + xpGain;
      }
      if (isLast) {
        patch.onboardingCompleted = true;
        patch.onboardingStep = totalSteps;
        // bonus final si subió foto: +15 ya aplicado si extraPatch.photoUrl, sino +0; +10 por completar
        const photoBonus = (data.photoUrl || extraPatch?.photoUrl) && !data.photoUrl ? 15 : 0;
        patch.xp = data.xp + 10 + photoBonus + (extraPatch?.photoUrl ? 0 : 0);
        // si ya tenía foto, solo +10
        if (data.photoUrl && !extraPatch?.photoUrl) patch.xp = data.xp + 10;
        if (extraPatch?.photoUrl && data.photoUrl) patch.xp = data.xp + 10; // foto ya existía, no doble bonus
        if (extraPatch?.photoUrl && !data.photoUrl) patch.xp = data.xp + 15 + 10;
      }

      setSaving(true);
      updateData(patch);
      // escritura DB asegurada antes de animar
      try {
        await fetch("/api/onboarding", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
      } catch {
        // ya persistido en localStorage
      }
      setSaving(false);

      if (isLast) {
        setShowConfetti(true);
        setTimeout(() => onComplete?.(), 800);
      } else {
        setStep((s) => s + 1);
      }
    },
    [step, data.xp, data.photoUrl, updateData, onComplete]
  );

  const handleSkip = (targetStep: number) => {
    setPendingSkipStep(targetStep);
    setShowSkipNudge(true);
  };
  const confirmSkip = async () => {
    setShowSkipNudge(false);
    if (pendingSkipStep != null) {
      // skip penaliza XP: no suma los 25 de ese paso
      const patch: Partial<WizardData> = { onboardingStep: pendingSkipStep, xp: data.xp };
      // si es último paso (foto) saltado, sin bonus
      if (pendingSkipStep === totalSteps) {
        patch.onboardingCompleted = true;
        patch.xp = data.xp + 5; // consuelo mínimo
        setShowConfetti(true);
        updateData(patch);
        try {
          await fetch("/api/onboarding", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
          });
        } catch {}
        setTimeout(() => onComplete?.(), 600);
        return;
      }
      updateData(patch);
      try {
        await fetch("/api/onboarding", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
      } catch {}
      setStep(pendingSkipStep);
    }
  };

  const canProceedStep = (() => {
    if (step === 0) return !!data.goal;
    if (step === 1) return !!data.experience && !!data.availability;
    if (step === 2) return !!data.equipment;
    if (step === 3) return true; // foto opcional
    return true;
  })();

  if (!hydrated) {
    return (
      <div className="min-h-[60dvh] flex items-center justify-center">
        <div className="animate-pulse text-zinc-500 text-sm">Cargando tu progreso…</div>
      </div>
    );
  }

  // Si ya completado, mostrar estado final sin wizard
  if (data.onboardingCompleted && step >= totalSteps) {
    return (
      <div className="max-w-lg mx-auto">
        <Card className="border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white mx-auto shadow-[0_8px_32px_rgba(16,185,129,0.4)]"
            >
              <Trophy size={28} />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">¡Onboarding completo!</h2>
              <p className="text-sm text-zinc-400 mt-1">Ya podés empezar a entrenar. Ganaste {data.xp} XP.</p>
            </div>
            <Button variant="accent" size="lg" className="w-full" onClick={() => onComplete?.()}>
              Ir al dashboard <ArrowRight size={18} />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Header XP + Progress */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
            <Badge variant="accent" className="gap-1.5">
              <Zap size={12} className="fill-current" /> {xpDisplay} XP
            </Badge>
            <span className="text-zinc-500">
              Paso {step + 1} de {totalSteps}
            </span>
          </div>
          <button
            onClick={() => handleSkip(step + 1)}
            className="text-[11px] font-bold tracking-widest uppercase text-zinc-500 hover:text-zinc-300 transition"
          >
            Omitir →
          </button>
        </div>
        <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <motion.div
            className="h-full bg-primary shadow-[0_0_12px_rgba(52,211,153,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-zinc-800"}`}
            />
          ))}
        </div>
      </div>

      {/* Step card */}
      <div className="relative min-h-[520px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && (
              <Card className="overflow-hidden border-zinc-800 bg-zinc-900/50 backdrop-blur">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={GOAL_OPTIONS.find((g) => g.value === data.goal)?.img ?? GOAL_OPTIONS[1].img}
                    alt="Objetivo fitness"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                      <Target size={12} /> Paso 1 · Objetivo
                    </p>
                    <h2 className="text-2xl font-black text-white mt-2">¿Cuál es tu objetivo?</h2>
                    <p className="text-sm text-zinc-300">Elegí tu foco — el plan se adapta 100% a vos.</p>
                  </div>
                </div>
                <CardContent className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GOAL_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const selected = data.goal === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => updateData({ goal: opt.value })}
                        className={`relative text-left p-4 rounded-2xl border-2 transition-all overflow-hidden group ${
                          selected
                            ? "bg-primary text-black border-primary shadow-[0_8px_32px_rgba(52,211,153,0.3)]"
                            : "bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              selected ? "bg-black/10" : "bg-zinc-900 border border-zinc-800"
                            }`}
                          >
                            <Icon size={18} className={selected ? "text-black" : "text-primary"} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-black text-sm leading-none ${selected ? "text-black" : "text-white"}`}>
                              {opt.label}
                            </p>
                            <p className={`text-xs mt-1 ${selected ? "text-black/70" : "text-zinc-500"}`}>{opt.desc}</p>
                          </div>
                          {selected && <Check size={18} className="text-black shrink-0 mt-1" />}
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {step === 1 && (
              <Card className="overflow-hidden border-zinc-800 bg-zinc-900/50">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?w=800&auto=format&fit=crop&q=60"
                    alt="Nivel y frecuencia"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                      <Star size={12} /> Paso 2 · Tu nivel
                    </p>
                    <h2 className="text-2xl font-black text-white mt-2">Nivel y frecuencia</h2>
                    <p className="text-sm text-zinc-300">Para ajustar volumen y progresión.</p>
                  </div>
                </div>
                <CardContent className="pt-5 space-y-6">
                  <div>
                    <p className="text-[11px] font-black tracking-widest uppercase text-zinc-500 mb-3">Experiencia</p>
                    <div className="grid grid-cols-1 gap-2">
                      {EXPERIENCE_OPTIONS.map((o) => {
                        const sel = data.experience === o.value;
                        return (
                          <button
                            key={o.value}
                            onClick={() => updateData({ experience: o.value })}
                            className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between transition ${
                              sel
                                ? "bg-primary border-primary text-black"
                                : "bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-white"
                            }`}
                          >
                            <div>
                              <p className="font-bold text-sm">{o.label}</p>
                              <p className={`text-xs ${sel ? "text-black/70" : "text-zinc-500"}`}>{o.desc}</p>
                            </div>
                            {sel && <Check size={18} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-black tracking-widest uppercase text-zinc-500 mb-3">
                      Días por semana
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {AVAILABILITY_OPTIONS.map((n) => {
                        const sel = data.availability === n;
                        return (
                          <button
                            key={n}
                            onClick={() => updateData({ availability: n })}
                            className={`h-20 rounded-2xl border-2 font-black text-2xl flex flex-col items-center justify-center gap-1 transition ${
                              sel
                                ? "bg-primary border-primary text-black shadow-[0_8px_24px_rgba(52,211,153,0.3)]"
                                : "bg-zinc-950 border-zinc-800 text-white hover:border-zinc-700"
                            }`}
                          >
                            {n}
                            <span className={`text-[10px] font-bold tracking-widest uppercase ${sel ? "text-black/70" : "text-zinc-500"}`}>
                              {n === 6 ? "6 días" : "días"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card className="overflow-hidden border-zinc-800 bg-zinc-900/50">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={
                      data.equipment
                        ? EQUIPMENT_OPTIONS.find((e) => e.value === data.equipment)?.img
                        : "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&auto=format&fit=crop&q=60"
                    }
                    alt="Equipamiento"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                      <Dumbbell size={12} /> Paso 3 · Equipamiento
                    </p>
                    <h2 className="text-2xl font-black text-white mt-2">¿Dónde entrenás?</h2>
                    <p className="text-sm text-zinc-300">Adaptamos ejercicios y sustituciones.</p>
                  </div>
                </div>
                <CardContent className="pt-5 grid gap-3">
                  {EQUIPMENT_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const sel = data.equipment === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => updateData({ equipment: opt.value })}
                        className={`p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition ${
                          sel
                            ? "bg-primary border-primary text-black shadow-[0_8px_24px_rgba(52,211,153,0.3)]"
                            : "bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-white"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ${
                            sel ? "bg-black/10" : "bg-zinc-900 border border-zinc-800"
                          }`}
                        >
                          <Icon size={20} className={sel ? "text-black" : "text-primary"} />
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-sm">{opt.label}</p>
                          <p className={`text-xs ${sel ? "text-black/70" : "text-zinc-500"}`}>{opt.desc}</p>
                        </div>
                        {sel && <Check size={20} className="text-black" />}
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card className="overflow-hidden border-zinc-800 bg-zinc-900/50">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=60"
                    alt="Foto inicial"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                      <Camera size={12} /> Paso 4 · Foto inicial <Badge variant="success" className="ml-1 text-[10px]">+15 XP</Badge>
                    </p>
                    <h2 className="text-2xl font-black text-white mt-2">Foto inicial (opcional)</h2>
                    <p className="text-sm text-zinc-300">Te da +15 XP y ayuda a medir progreso real.</p>
                  </div>
                </div>
                <CardContent className="pt-5 space-y-4">
                  <div className="rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-950/50 p-4 flex flex-col items-center gap-3">
                    {uploadPreview ? (
                      <div className="relative w-full">
                        <img
                          src={uploadPreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-xl border border-zinc-800"
                        />
                        <button
                          onClick={() => {
                            setUploadPreview(null);
                            updateData({ photoUrl: null });
                          }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
                          aria-label="Quitar foto"
                        >
                          <X size={16} />
                        </button>
                        <p className="text-center text-xs text-emerald-400 font-bold mt-2 flex items-center justify-center gap-1">
                          <Check size={14} /> ¡Foto lista! +15 XP bonus
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                          <Upload size={22} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-white">Subí tu foto inicial</p>
                          <p className="text-xs text-zinc-500 mt-1">Privada por defecto · Solo vos y tu coach la ven</p>
                        </div>
                        <label className="w-full">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const url = URL.createObjectURL(file);
                              setUploadPreview(url);
                              // En prod subiría a Supabase Storage; acá persistimos preview como photoUrl (data URL o blob)
                              // Para demo, usamos una Unsplash como placeholder + guardamos blob URL
                              // Mejor: usar un placeholder Unsplash si no hay backend de uploads
                              const placeholder = "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=60";
                              updateData({ photoUrl: placeholder, xp: data.xp + 0 });
                              // El bonus se aplica al finalizar
                            }}
                          />
                          <span className="inline-flex w-full items-center justify-center gap-2 h-11 px-6 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-sm hover:bg-zinc-800 cursor-pointer transition">
                            <Camera size={16} /> Elegir foto
                          </span>
                        </label>
                        <p className="text-[11px] text-zinc-600 text-center">
                          Podés omitir este paso y subirla después desde Progreso.
                        </p>
                      </>
                    )}
                  </div>
                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 flex gap-2">
                    <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      Tu foto es 100% privada y encriptada. Solo la ve tu coach asignado. Podés borrarla cuando quieras.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navegación */}
      <div className="mt-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="lg"
          className="min-w-[110px]"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ChevronLeft size={16} /> Atrás
        </Button>
        <div className="flex-1" />
        {step < totalSteps - 1 ? (
          <Button
            variant="accent"
            size="lg"
            className="min-w-[160px]"
            disabled={!canProceedStep || saving}
            onClick={() => void goNext()}
          >
            Siguiente <ChevronRight size={18} />
          </Button>
        ) : (
          <Button variant="accent" size="lg" className="min-w-[200px]" disabled={saving} onClick={() => void goNext()}>
            {saving ? "Guardando…" : uploadPreview ? "¡Completar y ganar XP! 🎉" : "Completar onboarding"}
            <ArrowRight size={18} />
          </Button>
        )}
      </div>

      <p className="text-center text-[11px] text-zinc-600 mt-4">
        Progreso guardado automáticamente · Podés cerrar y continuar después
      </p>

      {/* Skip nudge modal */}
      <AnimatePresence>
        {showSkipNudge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSkipNudge(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                <AlertTriangle size={22} />
              </div>
              <h3 className="text-center font-black text-white mt-4">¿Saltar este paso?</h3>
              <p className="text-center text-sm text-zinc-400 mt-2 leading-relaxed">
                Te perdés <span className="font-bold text-primary">+25 XP</span> y tu coach tendrá menos datos para personalizar tu plan. Podés completarlo después, pero arrancás con menos ventaja.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowSkipNudge(false)}>
                  Seguir acá
                </Button>
                <Button variant="accent" onClick={() => void confirmSkip()}>
                  Sí, omitir
                </Button>
              </div>
              <p className="text-center text-[11px] text-zinc-600 mt-3">Podés volver atrás y completarlo sin perder XP</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti */}
      {showConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-emerald-500 text-black font-black px-6 py-3 rounded-full shadow-[0_16px_40px_rgba(16,185,129,0.5)] flex items-center gap-2"
          >
            <Trophy size={18} /> ¡+{data.xp} XP ganados!
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
