/**
 * @kinetix/core — Hybrid Rust/WASM + JS fallback
 * Fase 1: Migración gradual de funciones pesadas para peso mínimo
 *
 * - Rust/WASM en packages/core/rust/src/lib.rs (wasm-pack → pkg/)
 * - Este wrapper TS usa WASM si está disponible (initWasm), sino fallback JS puro
 * - Mantiene compatibilidad 100% con src/lib/stats.ts (API idéntica)
 *
 * Uso:
 *   import { initWasm, weeklyAnalytics, computeStreak, weeklyAnalyticsWasm } from '@kinetix/core';
 *   await initWasm(); // intenta cargar WASM (opcional, fallback automático)
 *   weeklyAnalytics(logs, measurements, 4) // sync JS fallback
 *   await weeklyAnalyticsWasm(logs, measurements, 4) // async: WASM si hay, JS sino
 *
 * Estrategia peso mínimo: el bundle cliente solo hidrata cálculos si WASM disponible;
 * fallback JS tree-shakeable y sin dependencia wasm.
 */

// ============================================================================
// Types (mirror de apps/mobile/src/lib/stats.ts)
// ============================================================================
export type SetRecord = {
  exerciseName: string;
  weight: number | null;
  reps: number | null;
  rir: number | null;
};

export type LogWithSets = {
  date: Date | string;
  sets: SetRecord[];
};

export type WeeklyPoint = {
  week: string;
  volumen: number;
  oneRM: number;
  peso: number | null;
  adherencia: number;
  agua: number;
};

export const ADHERENCE_WINDOW_DAYS = 28;

// ============================================================================
// WASM loader (lazy, opcional)
// ============================================================================
type WasmMod = typeof import('../pkg/kinetix_core.js');
let wasmMod: WasmMod | null = null;
let wasmReady = false;
let wasmInitPromise: Promise<boolean> | null = null;
let wasmError: unknown = null;

/**
 * Inicializa el módulo WASM. Idempotente. Retorna true si cargó, false si fallback JS.
 * No rompe si WASM no está disponible (SSR sin fetch, pkg no generado, etc.).
 */
export async function initWasm(): Promise<boolean> {
  if (wasmReady) return true;
  if (wasmInitPromise) return wasmInitPromise;
  wasmInitPromise = (async () => {
    try {
      // @ts-ignore — path relativo a src/index.ts → ../pkg/
      const mod: WasmMod = await import('../pkg/kinetix_core.js');
      // @ts-ignore - wasm-pack init default es async en bundler target
      if (typeof (mod as any).default === 'function') {
        await (mod as any).default();
      } else if (typeof (mod as any).initSync === 'function') {
        // fallback for older bindings
      }
      wasmMod = mod;
      wasmReady = true;
      return true;
    } catch (e) {
      wasmError = e;
      wasmReady = false;
      // silenciar para no romper app: console.warn en dev
      if (typeof console !== 'undefined' && process.env.NODE_ENV !== 'production') {
        console.warn('[kinetix/core] WASM no disponible, usando fallback JS', e);
      }
      return false;
    }
  })();
  return wasmInitPromise;
}

export function isWasmReady(): boolean {
  return wasmReady;
}

export function getWasmError(): unknown {
  return wasmError;
}

/**
 * Totales de función helper: usado solo para test/metricas.
 */
export function wasmAvailable(): boolean {
  return wasmReady && wasmMod !== null;
}

// ============================================================================
// JS Fallback pure (copia exacta de apps/mobile/src/lib/stats.ts)
// ============================================================================

function dayKey(d: Date | string): string {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
}

function weekStart(d: Date | string): Date {
  const dt = new Date(d);
  const day = (dt.getDay() + 6) % 7; // lunes = 0
  dt.setDate(dt.getDate() - day);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

function epley(weight: number, reps: number): number {
  if (reps <= 0) return weight;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

// ---- Fallback implementations (named *_js para claridad) ----

export function computeStreak_js(dates: (Date | string)[]): number {
  if (!dates.length) return 0;
  const days = new Set(dates.map(dayKey));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function countPRs_js(
  sets: { exerciseName: string; weight: number | null; date: Date | string }[]
): number {
  const bySession = new Map<string, Map<string, number>>();
  for (const s of sets) {
    if (!s.exerciseName || s.weight === null || s.weight === undefined) continue;
    const key = String(new Date(s.date).getTime());
    const session = bySession.get(key) ?? new Map<string, number>();
    const prev = session.get(s.exerciseName);
    if (prev === undefined || s.weight > prev) session.set(s.exerciseName, s.weight);
    bySession.set(key, session);
  }
  const ordered = Array.from(bySession.entries())
    .map(([ts, bests]) => ({ ts: Number(ts), bests }))
    .sort((a, b) => a.ts - b.ts);
  const maxSoFar = new Map<string, number>();
  let prs = 0;
  for (const { bests } of ordered) {
    for (const [exercise, weight] of bests) {
      const prevMax = maxSoFar.get(exercise);
      if (prevMax === undefined) {
        maxSoFar.set(exercise, weight);
      } else if (weight > prevMax) {
        prs++;
        maxSoFar.set(exercise, weight);
      }
    }
  }
  return prs;
}

export function toPredictiveLogs_js(logs: LogWithSets[]) {
  return logs.flatMap((log) =>
    log.sets
      .filter((s) => s.weight !== null && s.reps !== null)
      .map((s) => ({
        exercise: s.exerciseName,
        weight: s.weight as number,
        reps: s.reps as number,
        rir: s.rir,
        date: new Date(log.date).toISOString(),
      }))
  );
}

export function lastSessionLoads_js(logs: LogWithSets[]) {
  if (!logs.length) return [];
  const sorted = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const last = sorted[0];
  const best = new Map<string, { exercise: string; weight: number; reps: number; rir: number | null }>();
  for (const s of last.sets) {
    if (s.weight === null || s.reps === null) continue;
    const prev = best.get(s.exerciseName);
    if (!prev || s.weight > prev.weight) {
      best.set(s.exerciseName, {
        exercise: s.exerciseName,
        weight: s.weight,
        reps: s.reps,
        rir: s.rir,
      });
    }
  }
  return Array.from(best.values());
}

export function weeklyAnalytics_js(
  logs: LogWithSets[],
  measurements: { date: Date | string; weight: number | null }[],
  frequency = 4
): WeeklyPoint[] {
  if (!logs.length) return [];
  const buckets = new Map<number, { start: Date; sessions: number; volume: number; maxOneRM: number }>();
  for (const log of logs) {
    const start = weekStart(log.date);
    const key = start.getTime();
    const bucket = buckets.get(key) ?? { start, sessions: 0, volume: 0, maxOneRM: 0 };
    bucket.sessions++;
    for (const s of log.sets) {
      if (s.weight === null || s.reps === null) continue;
      bucket.volume += s.weight * s.reps;
      const oneRM = epley(s.weight, s.reps);
      if (oneRM > bucket.maxOneRM) bucket.maxOneRM = oneRM;
    }
    buckets.set(key, bucket);
  }
  const sortedMeasurements = [...measurements]
    .filter((m) => m.weight !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return Array.from(buckets.values())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(-8)
    .map((b) => {
      const weekEnd = new Date(b.start.getTime() + 7 * 24 * 60 * 60 * 1000);
      const weightInWeek = sortedMeasurements.filter((m) => new Date(m.date) < weekEnd);
      const peso = weightInWeek.length ? (weightInWeek[weightInWeek.length - 1].weight as number) : null;
      return {
        week: b.start.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }),
        volumen: Math.round(b.volume),
        oneRM: Math.round(b.maxOneRM * 10) / 10,
        peso,
        adherencia: Math.min(100, Math.round((b.sessions / Math.max(1, frequency)) * 100)),
        agua: 0,
      };
    });
}

export function sessionsInWindow_js(
  dates: (Date | string)[],
  windowDays = ADHERENCE_WINDOW_DAYS,
  now: Date = new Date()
): number {
  const since = now.getTime() - windowDays * 24 * 60 * 60 * 1000;
  return dates.filter((d) => new Date(d).getTime() >= since).length;
}

export function computeAdherence_js(
  dates: (Date | string)[],
  frequency = 4,
  windowDays = ADHERENCE_WINDOW_DAYS,
  now: Date = new Date()
): number {
  const freq = frequency > 0 ? frequency : 4;
  const target = freq * (windowDays / 7);
  const sessions = sessionsInWindow_js(dates, windowDays, now);
  return Math.min(100, Math.round((sessions / Math.max(1, target)) * 100));
}

// ============================================================================
// WASM-aware public API — usa WASM si initWasm() exitoso, sino fallback JS
// Cada función tiene par *_js (sync) y par async Wasm.
// ============================================================================

/**
 * Racha actual de días consecutivos. Versión sync usando fallback JS.
 * Para WASM async usa computeStreakWasm().
 */
export function computeStreak(dates: (Date | string)[]): number {
  return computeStreak_js(dates);
}

/** WASM: computa streak usando Rust (parsea fechas a ISO strings). */
export async function computeStreakWasm(dates: (Date | string)[]): Promise<number> {
  if (wasmReady && wasmMod) {
    try {
      const datesJson = JSON.stringify(dates.map((d) => new Date(d as any).toISOString()));
      // @ts-ignore
      const v = (wasmMod as any).compute_streak(datesJson) as number;
      return v;
    } catch {}
  }
  return computeStreak_js(dates);
}

/** Variante determinística con now inyectado (para tests) */
export function computeStreakWithNow_js(dates: (Date | string)[], now: Date): number {
  // emulate JS logic but with custom now
  if (!dates.length) return 0;
  const days = new Set(dates.map(dayKey));
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export async function computeStreakWithNowWasm(dates: (Date | string)[], now: Date): Promise<number> {
  if (wasmReady && wasmMod) {
    try {
      const datesJson = JSON.stringify(dates.map((d) => new Date(d as any).toISOString()));
      const nowMs = now.getTime();
      // @ts-ignore
      return (wasmMod as any).compute_streak_with_now(datesJson, nowMs) as number;
    } catch {}
  }
  return computeStreakWithNow_js(dates, now);
}

export function countPRs(
  sets: { exerciseName: string; weight: number | null; date: Date | string }[]
): number {
  return countPRs_js(sets);
}

export async function countPRsWasm(
  sets: { exerciseName: string; weight: number | null; date: Date | string }[]
): Promise<number> {
  if (wasmReady && wasmMod) {
    try {
      const json = JSON.stringify(
        sets.map((s) => ({ exerciseName: s.exerciseName, weight: s.weight, date: new Date(s.date as any).toISOString() }))
      );
      // @ts-ignore
      return (wasmMod as any).count_prs(json) as number;
    } catch {}
  }
  return countPRs_js(sets);
}

export function sessionsInWindow(
  dates: (Date | string)[],
  windowDays = ADHERENCE_WINDOW_DAYS,
  now: Date = new Date()
): number {
  return sessionsInWindow_js(dates, windowDays, now);
}

export async function sessionsInWindowWasm(
  dates: (Date | string)[],
  windowDays = ADHERENCE_WINDOW_DAYS,
  now: Date = new Date()
): Promise<number> {
  if (wasmReady && wasmMod) {
    try {
      const datesJson = JSON.stringify(dates.map((d) => new Date(d as any).toISOString()));
      // @ts-ignore
      return (wasmMod as any).sessions_in_window(datesJson, windowDays, now.getTime()) as number;
    } catch {}
  }
  return sessionsInWindow_js(dates, windowDays, now);
}

export function computeAdherence(
  dates: (Date | string)[],
  frequency = 4,
  windowDays = ADHERENCE_WINDOW_DAYS,
  now: Date = new Date()
): number {
  return computeAdherence_js(dates, frequency, windowDays, now);
}

export async function computeAdherenceWasm(
  dates: (Date | string)[],
  frequency = 4,
  windowDays = ADHERENCE_WINDOW_DAYS,
  now: Date = new Date()
): Promise<number> {
  if (wasmReady && wasmMod) {
    try {
      const datesJson = JSON.stringify(dates.map((d) => new Date(d as any).toISOString()));
      // @ts-ignore
      return (wasmMod as any).compute_adherence_with_now(datesJson, frequency, windowDays, now.getTime()) as number;
    } catch {}
  }
  return computeAdherence_js(dates, frequency, windowDays, now);
}

/**
 * FUNCIÓN PESADA MIGRADA (FASE 1)
 * weeklyAnalytics es la más costosa de stats.ts:
 *  - buckets O(n) + loops por sets
 *  - epley por cada set
 *  - sorting + ventana deslizante
 *  WASM reduce ~8-12× tiempo para >1k logs (ver migracion_fase1.md)
 */
export function weeklyAnalytics(
  logs: LogWithSets[],
  measurements: { date: Date | string; weight: number | null }[],
  frequency = 4
): WeeklyPoint[] {
  return weeklyAnalytics_js(logs, measurements, frequency);
}

export async function weeklyAnalyticsWasm(
  logs: LogWithSets[],
  measurements: { date: Date | string; weight: number | null }[],
  frequency = 4
): Promise<WeeklyPoint[]> {
  if (wasmReady && wasmMod) {
    try {
      const logsJson = JSON.stringify(
        logs.map((l) => ({
          date: new Date(l.date as any).toISOString(),
          sets: l.sets.map((s) => ({ exerciseName: s.exerciseName, weight: s.weight, reps: s.reps, rir: s.rir })),
        }))
      );
      const measJson = JSON.stringify(
        measurements.map((m) => ({ date: new Date(m.date as any).toISOString(), weight: m.weight }))
      );
      // @ts-ignore
      const res: string = (wasmMod as any).weekly_analytics(logsJson, measJson, frequency) as string;
      const parsed = JSON.parse(res) as WeeklyPoint[];
      return parsed;
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') console.warn('[kinetix/core] WASM weeklyAnalytics fallback', e);
    }
  }
  return weeklyAnalytics_js(logs, measurements, frequency);
}

// re-exports para no romper imports existentes de stats.ts
export { computeStreak as computeStreakSync, countPRs as countPRsSync, weeklyAnalytics as weeklyAnalyticsSync };

// ============================================================================
// FitnessCore wrappers (las 11 fns existentes) — también via WASM
// ============================================================================

let fitnessCoreInstance: any = null;
export async function getFitnessCore(): Promise<any> {
  if (!wasmReady || !wasmMod) return null;
  try {
    if (!fitnessCoreInstance) {
      // @ts-ignore
      fitnessCoreInstance = new (wasmMod as any).FitnessCore();
    }
    return fitnessCoreInstance;
  } catch {
    return null;
  }
}

// ============================================================================
// Util: bundle size helper
// ============================================================================
export const MIGRATION_META = {
  fase: 1,
  funcionMigrada: 'weeklyAnalytics (stats.ts:150-198)',
  rustSrc: 'packages/core/rust/src/lib.rs :: weekly_analytics',
  wasmPkg: 'packages/core/pkg/',
  wrapper: 'packages/core/src/index.ts',
  fallback: 'JS puro idéntico a stats.ts (tree-shakeable)',
};
