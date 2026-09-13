/**
 * voice-engine/motivation.ts — motor de motivación con anti-spam.
 * Niveles LOW/MEDIUM/HIGH/LAST_REP + conteo FULL/SMART/OFF.
 */
import type { CountMode, Intensity, VoiceManifest, VoiceToken } from "./types";

export const MOTIVATION_POOLS: Record<Intensity | "last", { key: string; text: string }[]> = {
  low: [
    { key: "vamos-suave", text: "Vamos." },
    { key: "muy-bien", text: "Muy bien." },
    { key: "buen-trabajo", text: "Buen trabajo." },
  ],
  medium: [
    { key: "manten-ritmo", text: "Vamos, mantené el ritmo." },
    { key: "seguimos", text: "Seguimos." },
    { key: "controla", text: "Controlá el movimiento." },
  ],
  high: [
    { key: "vamos-fuerte", text: "¡Vamos!" },
    { key: "una-mas", text: "¡Una más!" },
    { key: "dale", text: "¡Dale!" },
    { key: "no-aflojes", text: "¡No aflojes!" },
  ],
  last: [
    { key: "ultima", text: "Última." },
    { key: "ultima-vamos", text: "¡Vamos con la última!" },
  ],
};

const COOLDOWN_MS = 25000;

export class MotivationEngine {
  private lastKey: string | null = null;
  private lastAt = Number.NEGATIVE_INFINITY;
  private perSetCount = new Map<string, number>();

  /** Elige frase sin repetir la última y con cooldown. null = mejor callar. */
  pick(intensity: Intensity, setId: string, now: number): { key: string; text: string } | null {
    const used = this.perSetCount.get(setId) ?? 0;
    if (used >= 1) return null;
    if (now - this.lastAt < COOLDOWN_MS) return null;
    const pool = MOTIVATION_POOLS[intensity];
    const options = pool.filter((p) => p.key !== this.lastKey);
    const pick = (options.length > 0 ? options : pool)[Math.floor(Math.random() * (options.length > 0 ? options.length : pool.length))];
    this.lastKey = pick.key;
    this.lastAt = now;
    this.perSetCount.set(setId, used + 1);
    if (this.perSetCount.size > 50) this.perSetCount.clear();
    return pick;
  }

  reset(): void {
    this.perSetCount.clear();
  }
}

/** Plan de conteo de una repetición concreta (SMART habla poco y al final). */
export function repCountPlan(
  current: number,
  total: number,
  mode: CountMode
): { say: boolean; kind: "number" | "ultimas-dos" | "una-mas"; value?: number } | null {
  if (mode === "off" || total <= 0 || current <= 0) return null;
  const remaining = total - current;
  if (remaining <= 1) return { say: true, kind: "una-mas" };
  if (remaining === 2) return { say: true, kind: "ultimas-dos" };
  if (mode === "full") return { say: true, kind: "number", value: current };
  if (current <= 5 && current % 2 === 1) return { say: true, kind: "number", value: current };
  return null;
}

/** Convierte un pick motivacional en token (audio si existe, TTS si no). */
export function motivationToken(pick: { key: string; text: string }, m: VoiceManifest): VoiceToken {
  const src = m.motivation[pick.key];
  if (src) return { kind: "file", src, label: pick.key };
  return { kind: "tts", text: pick.text };
}
