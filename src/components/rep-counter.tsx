"use client";
import { useState } from "react";
import { Minus, Plus, RotateCcw, Ear } from "lucide-react";
import { voiceEngine } from "@/lib/voice-engine/engine";
import { repCountPlan } from "@/lib/voice-engine/motivation";

/**
 * Contador de reps en vivo con voz (FULL / SMART / OFF según ajustes).
 * Aditivo: no reemplaza el registro de series, lo acompaña.
 */
export function RepCounter({ targetReps, setKey, onFirstTap }: { targetReps: number; setKey: string; onFirstTap?: () => void }) {
  const [count, setCount] = useState(0);
  const mode = voiceEngine.settings.countMode;

  function announce(next: number) {
    try {
      voiceEngine.unlock();
      const plan = repCountPlan(next, targetReps, voiceEngine.settings.countMode);
      if (!plan?.say) return;
      if (plan.kind === "number") voiceEngine.emit("REP_COUNT", { n: plan.value ?? next });
      else voiceEngine.emit("LAST_REPS", { kind: plan.kind === "una-mas" ? "una" : "dos" });
    } catch {}
  }

  function tap() {
    const next = Math.min(targetReps + 2, count + 1);
    if (count === 0) {
      try {
        onFirstTap?.();
      } catch {}
    }
    setCount(next);
    announce(next);
    try {
      navigator.vibrate?.(15);
    } catch {}
  }

  if (mode === "off") return null;

  return (
    <div className="rounded-2xl border border-violet-500/25 bg-violet-500/[0.06] p-3 space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black tracking-[0.18em] text-violet-300 uppercase flex items-center gap-1.5">
          <Ear size={12} /> Conteo por voz
        </p>
        <span className="text-[11px] font-bold text-zinc-400 tabular-nums">
          {count}/{targetReps}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCount((c) => Math.max(0, c - 1))}
          aria-label="Quitar una repetición"
          className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0"
        >
          <Minus size={20} />
        </button>
        <button
          onClick={tap}
          aria-label="Contar repetición"
          className="h-14 flex-1 rounded-2xl bg-primary text-black font-black text-xl tabular-nums active:scale-[0.97] transition-transform"
        >
          {count === 0 ? "TAP · REP 1" : count}
        </button>
        <button
          onClick={() => setCount(0)}
          aria-label="Reiniciar conteo"
          className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0"
        >
          <RotateCcw size={18} />
        </button>
      </div>
      <p className="text-[11px] text-zinc-500 text-center">
        Tocá al completar cada repetición · <span className="font-bold text-zinc-400">{setKey}</span>
      </p>
    </div>
  );
}
