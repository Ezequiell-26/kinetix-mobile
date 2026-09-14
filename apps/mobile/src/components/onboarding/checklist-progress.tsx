"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Trophy, Target, Dumbbell, Camera, Users, Bell, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ChecklistItem = {
  id: string;
  label: string;
  desc: string;
  xp: number;
  icon: typeof Check;
  href: string;
  done: boolean;
};

const STORAGE_DISMISS = "kinetix_checklist_dismissed";

function getChecklistItems(opts: {
  onboardingDone: boolean;
  hasWorkout: boolean;
  hasWeight: boolean;
  hasInvite: boolean;
  hasNotifications: boolean;
}): ChecklistItem[] {
  return [
    {
      id: "profile",
      label: "Completa tu perfil",
      desc: "Objetivo, nivel y equipo",
      xp: 20,
      icon: Target,
      href: "/client/onboarding",
      done: opts.onboardingDone,
    },
    {
      id: "workout",
      label: "Crea tu primer workout",
      desc: "Registrá tu entreno inicial",
      xp: 30,
      icon: Dumbbell,
      href: "/client/workout",
      done: opts.hasWorkout,
    },
    {
      id: "weight",
      label: "Registra tu peso",
      desc: "Medición inicial para progreso",
      xp: 15,
      icon: Trophy,
      href: "/client/progress",
      done: opts.hasWeight,
    },
    {
      id: "invite",
      label: "Invita a un amigo",
      desc: "Compartí tu progreso",
      xp: 50,
      icon: Users,
      href: "/client/settings",
      done: opts.hasInvite,
    },
    {
      id: "notifications",
      label: "Activa notificaciones",
      desc: "No te pierdas recordatorios",
      xp: 10,
      icon: Bell,
      href: "/client/settings",
      done: opts.hasNotifications,
    },
  ];
}

export function ChecklistProgress({
  onboardingDone = false,
  hasWorkout = false,
  hasWeight = false,
  hasInvite = false,
  hasNotifications = false,
  onDismiss,
}: {
  onboardingDone?: boolean;
  hasWorkout?: boolean;
  hasWeight?: boolean;
  hasInvite?: boolean;
  hasNotifications?: boolean;
  onDismiss?: () => void;
}) {
  const [dismissed, setDismissed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = localStorage.getItem(STORAGE_DISMISS);
    if (v === "1") setDismissed(true);
  }, []);

  const items = getChecklistItems({
    onboardingDone,
    hasWorkout,
    hasWeight,
    hasInvite,
    hasNotifications,
  });
  const doneCount = items.filter((i) => i.done).length;
  const total = items.length;
  const progress = (doneCount / total) * 100;
  const totalXp = items.filter((i) => i.done).reduce((acc, i) => acc + i.xp, 0);
  const maxXp = items.reduce((acc, i) => acc + i.xp, 0);
  const allDone = doneCount === total;

  useEffect(() => {
    if (allDone) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 3200);
      return () => clearTimeout(t);
    }
  }, [allDone]);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_DISMISS, "1");
    onDismiss?.();
  };

  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-900/60 backdrop-blur relative">
      {/* Progress accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-900">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-black text-white flex items-center gap-2 text-sm">
              <Sparkles size={16} className="text-primary" />
              Checklist de inicio
              <Badge variant={allDone ? "success" : "accent"} className="ml-1">
                {doneCount}/{total}
              </Badge>
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              {allDone ? (
                <span className="text-emerald-400 font-bold">¡Todo completo! +{totalXp} XP desbloqueados 🎉</span>
              ) : (
                <>
                  Completa los pasos y gana <span className="font-bold text-primary">{maxXp} XP</span> · Llevas {totalXp} XP
                </>
              )}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            aria-label="Descartar checklist"
            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-700 transition"
          >
            <X size={14} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>

        <div className="mt-4 grid gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group flex items-center gap-3 p-3 rounded-2xl border transition ${
                  item.done
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-zinc-950 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    item.done
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-zinc-900 border-zinc-800 text-zinc-500 group-hover:text-white"
                  }`}
                >
                  {item.done ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-bold leading-none ${item.done ? "text-emerald-300 line-through decoration-emerald-500/40" : "text-white"}`}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-xs font-black ${item.done ? "text-emerald-400" : "text-primary"}`}>+{item.xp} XP</p>
                  {!item.done && <ChevronRight size={14} className="text-zinc-600 ml-auto mt-1 group-hover:text-zinc-400" />}
                </div>
              </Link>
            );
          })}
        </div>

        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl bg-emerald-500 text-black p-4 text-center font-black flex items-center justify-center gap-2"
          >
            <Trophy size={18} /> ¡Checklist 100% — sos crack!
          </motion.div>
        )}

        <AnimatePresence>
          {showConfetti && allDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-emerald-500 text-black font-black px-5 py-2 rounded-full shadow-[0_12px_32px_rgba(16,185,129,0.45)] flex items-center gap-2">
                <Sparkles size={16} /> ¡{maxXp} XP totales!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
