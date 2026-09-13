/**
 * voice-engine/planner.ts — convierte eventos y texto en secuencias de audio.
 * Jerarquía: frase completa > palabra > número > sílaba > TTS.
 * Todo lo que falta se registra (para saber qué grabar) y sale por TTS.
 */
import type {
  PlannedPhrase, VoiceEvent, VoiceEventData, VoiceManifest, VoiceToken,
} from "./types";
import { numberToKeys, keyToWord, REQUIRED_NUMBER_KEYS } from "./numbers";

export const GAP_MS = 120;

const missingLog: string[] = [];
export function getMissingAudio(): string[] {
  return [...new Set(missingLog)];
}
export function clearMissingAudio(): void {
  missingLog.length = 0;
}
function missing(key: string): void {
  if (missingLog.length < 500) missingLog.push(key);
}

const phraseCache = new Map<string, PlannedPhrase>();
export function clearPhraseCache(): void {
  phraseCache.clear();
}
export function phraseCacheSize(): number {
  return phraseCache.size;
}

function fileToken(src: string, label: string): VoiceToken {
  return { kind: "file", src, label };
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

/** Parte de una frase: palabra, número, conector, sílaba o TTS directo. */
export type Part =
  | { t: "phrase"; key: string; text: string }
  | { t: "word"; key: string }
  | { t: "number"; value: number }
  | { t: "connector"; key: string }
  | { t: "tts"; text: string };

function resolveNumberKey(key: string, m: VoiceManifest, out: VoiceToken[], miss: string[]): string {
  const src = m.numbers[key] ?? m.connectors[key];
  if (src) {
    out.push(fileToken(src, key));
    return keyToWord(key);
  }
  miss.push(`numbers/${key}`);
  missing(`numbers/${key}`);
  return keyToWord(key);
}

/** Fallback silábico: calce greedy contra las sílabas grabadas. */
function resolveSyllables(word: string, m: VoiceManifest, out: VoiceToken[], miss: string[]): boolean {
  const keys = Object.keys(m.syllables);
  if (keys.length === 0) return false;
  const w = norm(word).replace(/ /g, "");
  let i = 0;
  const used: string[] = [];
  while (i < w.length) {
    let hit: string | null = null;
    for (let len = Math.min(4, w.length - i); len >= 1; len--) {
      const cand = w.slice(i, i + len);
      if (m.syllables[cand]) {
        hit = cand;
        break;
      }
    }
    if (!hit) return false;
    used.push(hit);
    i += hit.length;
  }
  for (const s of used) out.push(fileToken(m.syllables[s], s));
  return true;
}

function resolveWord(raw: string, m: VoiceManifest, out: VoiceToken[], miss: string[]): string {
  const key = norm(raw);
  if (!key) return "";
  if (m.words[key]) {
    out.push(fileToken(m.words[key], key));
    return raw;
  }
  // La palabra puede ser un número ("tres") o conector ("de", "y", "coma").
  if (m.numbers[key] || m.connectors[key]) {
    return resolveNumberKey(key, m, out, miss);
  }
  if (/^\d+(\.\d+)?$/.test(key)) {
    return numberToKeys(Number(key))
      .map((k) => resolveNumberKey(k, m, out, miss))
      .join(" ");
  }
  if (resolveSyllables(key, m, out, miss)) return raw;
  const missKey = REQUIRED_NUMBER_KEYS.includes(key) ? `numbers/${key}` : `words/${key}`;
  miss.push(missKey);
  missing(missKey);
  out.push({ kind: "tts", text: raw });
  return raw;
}

function buildParts(parts: Part[], m: VoiceManifest): { text: string; tokens: VoiceToken[]; missing: string[] } {
  const tokens: VoiceToken[] = [];
  const miss: string[] = [];
  const words: string[] = [];
  parts.forEach((p, i) => {
    if (i > 0) tokens.push({ kind: "silence", ms: GAP_MS });
    if (p.t === "phrase") {
      const src = m.phrases[p.key];
      if (src) {
        tokens.push(fileToken(src, p.key));
        words.push(p.text);
      } else {
        miss.push(`phrases/${p.key}`);
        missing(`phrases/${p.key}`);
        words.push(p.text);
        tokens.push({ kind: "tts", text: p.text });
      }
    } else if (p.t === "tts") {
      words.push(p.text);
      tokens.push({ kind: "tts", text: p.text });
    } else if (p.t === "number") {
      words.push(String(p.value));
      numberToKeys(p.value).forEach((k) => resolveNumberKey(k, m, tokens, miss));
    } else if (p.t === "connector") {
      const src = m.connectors[p.key];
      if (src) {
        tokens.push(fileToken(src, p.key));
        words.push(p.key);
      } else {
        miss.push(`connectors/${p.key}`);
        missing(`connectors/${p.key}`);
        words.push(p.key);
        tokens.push({ kind: "tts", text: p.key });
      }
    } else {
      words.push(resolveWord(p.key, m, tokens, miss));
    }
  });
  return { text: words.join(" ").replace(/\s+/g, " ").trim(), tokens, missing: miss };
}

function finish(text: string, built: { tokens: VoiceToken[]; missing: string[] }, cacheKey: string): PlannedPhrase {
  let tokens = built.tokens;
  // Sin ningún audio grabado: un solo TTS suena natural (no palabra por palabra).
  const hasFile = tokens.some((t) => t.kind === "file");
  if (!hasFile && text) {
    tokens = [{ kind: "tts", text }];
  }
  const planned: PlannedPhrase = {
    text,
    tokens,
    files: tokens.filter((t) => t.kind === "file").map((t) => (t as { src: string }).src),
    missing: [...new Set(built.missing)],
    cached: false,
  };
  if (phraseCache.size > 300) phraseCache.clear();
  phraseCache.set(cacheKey, { ...planned, cached: true });
  return planned;
}

type Template = (d: VoiceEventData) => { text: string; parts: Part[] };
const num = (v: number | string | boolean | undefined): number => {
  const n = typeof v === "number" ? v : parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : 0;
};

const TEMPLATES: Record<string, Template> = {
  WORKOUT_STARTED: () => ({ text: "Arranque", parts: [{ t: "phrase", key: "arranque", text: "¿Listo? Arrancamos." }] }),
  EXERCISE_STARTED: () => ({ text: "Siguiente", parts: [{ t: "phrase", key: "siguiente", text: "Siguiente ejercicio." }] }),
  SET_STARTED: (d) => {
    const set = num(d.set);
    const total = num(d.totalSets);
    const reps = num(d.reps);
    const weight = num(d.weight);
    const text = `Serie ${set} de ${total}. ${reps} repeticiones.${weight > 0 ? ` ${weight} kilos.` : ""}`;
    const parts: Part[] = [
      { t: "word", key: "serie" }, { t: "number", value: set },
      { t: "connector", key: "de" }, { t: "number", value: total },
      { t: "number", value: reps }, { t: "word", key: "repeticiones" },
    ];
    if (weight > 0) parts.push({ t: "number", value: weight }, { t: "word", key: "kilos" });
    return { text, parts };
  },
  REP_COUNT: (d) => {
    const n = num(d.n);
    return { text: String(n), parts: [{ t: "number", value: n }] };
  },
  LAST_REPS: (d) => {
    const una = String(d.kind ?? "dos") === "una";
    return una
      ? { text: "¡Una más!", parts: [{ t: "phrase", key: "una-mas", text: "¡Una más!" }] }
      : { text: "Últimas dos", parts: [{ t: "phrase", key: "ultimas-dos", text: "Últimas dos." }] };
  },
  REP_MILESTONE: (d) => {
    const key = String(d.key ?? "mitad");
    const text = String(d.text ?? key);
    return { text, parts: [{ t: "phrase", key, text }] };
  },
  SET_COMPLETED: () => ({ text: "Serie completada", parts: [{ t: "phrase", key: "serie-completada", text: "Serie completada." }] }),
  REST_STARTED: (d) => {
    const rest = num(d.rest);
    return {
      text: `Descansá ${rest} segundos.`,
      parts: [{ t: "word", key: "descansa" }, { t: "number", value: rest }, { t: "word", key: "segundos" }],
    };
  },
  REST_WARNING: (d) => {
    const remaining = num(d.remaining);
    return {
      text: `Quedan ${remaining} segundos.`,
      parts: [{ t: "word", key: "quedan" }, { t: "number", value: remaining }, { t: "word", key: "segundos" }],
    };
  },
  REST_COMPLETED: () => ({ text: "Cuenta regresiva", parts: [{ t: "phrase", key: "cuenta-regresiva", text: "¡Vamos!" }] }),
  EXERCISE_COMPLETED: () => ({ text: "Ejercicio completado", parts: [{ t: "phrase", key: "ejercicio-completado", text: "Ejercicio completado." }] }),
  PERSONAL_RECORD: () => ({ text: "Récord personal", parts: [{ t: "phrase", key: "record-personal", text: "¡Récord personal!" }] }),
  WORKOUT_COMPLETED: () => ({ text: "Cierre", parts: [{ t: "phrase", key: "cierre", text: "Entrenamiento completado." }] }),
  WORKOUT_PAUSED: () => ({ text: "Pausa", parts: [{ t: "tts", text: "Pausa." }] }),
  WORKOUT_RESUMED: () => ({ text: "Seguimos", parts: [{ t: "tts", text: "Seguimos." }] }),
};

export function planEvent(ev: VoiceEvent, m: VoiceManifest): PlannedPhrase {
  const cacheKey = `${m.id}|${ev.event}|${JSON.stringify(ev.data ?? {})}`;
  const hit = phraseCache.get(cacheKey);
  if (hit) return hit;
  const tpl = TEMPLATES[ev.event];
  if (!tpl) {
    return { text: "", tokens: [], files: [], missing: [], cached: false };
  }
  const { parts, text } = tpl(ev.data ?? {});
  const built = buildParts(parts, m);
  return finish(text || built.text, built, cacheKey);
}

/** Laboratorio: texto libre → tokens → archivos (palabra > número > sílaba > TTS). */
export function planText(text: string, m: VoiceManifest): PlannedPhrase {
  const cacheKey = `${m.id}|text|${text}`;
  const hit = phraseCache.get(cacheKey);
  if (hit) return hit;
  const parts: Part[] = text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (/^\d+(\.\d+)?$/.test(w) ? { t: "number", value: Number(w) } as Part : { t: "word", key: w } as Part));
  const built = buildParts(parts, m);
  return finish(built.text, built, cacheKey);
}
