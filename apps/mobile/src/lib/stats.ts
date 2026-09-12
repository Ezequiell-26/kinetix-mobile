/**
 * Cálculos reales de progreso del atleta.
 * Reemplaza los valores hardcodeados que antes se mostraban en los paneles.
 */

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

/** Racha actual de días consecutivos entrenando. Si hoy no entrenó, cuenta desde ayer. */
export function computeStreak(dates: (Date | string)[]): number {
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

/**
 * Cuenta récords personales con regla de sesión: por sesión se toma la mejor
 * marca de cada ejercicio y un PR solo cuenta si supera el máximo de las
 * sesiones ANTERIORES. Así las series de aproximación cada vez más pesadas
 * dentro de una misma sesión (calentamiento) no inflan el conteo.
 */
export function countPRs(
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

  // Sesiones en orden cronológico
  const ordered = Array.from(bySession.entries())
    .map(([ts, bests]) => ({ ts: Number(ts), bests }))
    .sort((a, b) => a.ts - b.ts);

  const maxSoFar = new Map<string, number>();
  let prs = 0;
  for (const { bests } of ordered) {
    for (const [exercise, weight] of bests) {
      const prevMax = maxSoFar.get(exercise);
      if (prevMax === undefined) {
        // Primer registro del ejercicio: línea de base, no es récord.
        maxSoFar.set(exercise, weight);
      } else if (weight > prevMax) {
        prs++;
        maxSoFar.set(exercise, weight);
      }
    }
  }
  return prs;
}

/** Aplana las series de los logs al formato que espera PredictivePlateau. */
export function toPredictiveLogs(logs: LogWithSets[]) {
  return logs.flatMap(log =>
    log.sets
      .filter(s => s.weight !== null && s.reps !== null)
      .map(s => ({
        exercise: s.exerciseName,
        weight: s.weight as number,
        reps: s.reps as number,
        rir: s.rir,
        date: new Date(log.date).toISOString(),
      }))
  );
}

/** Carga más alta por ejercicio del último entrenamiento, para la semana adaptativa. */
export function lastSessionLoads(logs: LogWithSets[]) {
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

export type WeeklyPoint = {
  week: string;
  volumen: number;
  oneRM: number;
  /** Último peso corporal medido de la semana. null = sin medición esa semana (no se grafica 0). */
  peso: number | null;
  adherencia: number;
  /** Siempre 0: no hay registro de agua en la DB. Se mantiene para no romper el chart. */
  agua: number;
};

/** 1RM estimado por fórmula de Epley. */
function epley(weight: number, reps: number): number {
  if (reps <= 0) return weight;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/**
 * Agregados semanales reales para LiftShiftAnalytics.
 * `frequency` es la meta de sesiones por semana del programa.
 * `measurements` aporta el peso corporal de cada semana.
 */
export function weeklyAnalytics(
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
    .filter(m => m.weight !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return Array.from(buckets.values())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(-8)
    .map(b => {
      const weekEnd = new Date(b.start.getTime() + 7 * 24 * 60 * 60 * 1000);
      const weightInWeek = sortedMeasurements.filter(
        m => new Date(m.date) < weekEnd
      );
      // Sin medición en la semana -> null (la chart muestra hueco, no un falso 0).
      const peso = weightInWeek.length ? (weightInWeek[weightInWeek.length - 1].weight as number) : null;

      return {
        week: b.start.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }),
        volumen: Math.round(b.volume),
        oneRM: Math.round(b.maxOneRM * 10) / 10,
        peso,
        adherencia: Math.min(100, Math.round((b.sessions / Math.max(1, frequency)) * 100)),
        agua: 0, // sin fuente de datos todavía: no hay registro de agua en la DB
      };
    });
}

/* ───────────────────────────── Adherencia ───────────────────────────── */

/**
 * Ventana estándar de adherencia: 4 semanas (28 días).
 * Se usa una ventana móvil para que la métrica sea comparable en el tiempo y
 * no se sature al 100% con el correr de los meses (antes el dashboard dividía
 * el total histórico por el objetivo de 4 semanas, lo que daba 100% siempre).
 */
export const ADHERENCE_WINDOW_DAYS = 28;

/**
 * Sesiones (logs) registradas dentro de la ventana de adherencia.
 * `dates` son las fechas de los entrenamientos; se cuentan por log, no por día.
 */
export function sessionsInWindow(
  dates: (Date | string)[],
  windowDays = ADHERENCE_WINDOW_DAYS,
  now: Date = new Date()
): number {
  const since = now.getTime() - windowDays * 24 * 60 * 60 * 1000;
  return dates.filter(d => new Date(d).getTime() >= since).length;
}

/**
 * Adherencia = sesiones de las últimas 4 semanas ÷ objetivo del período.
 *   numerador   = sesiones registradas en los últimos `windowDays` días
 *   denominador = frecuencia semanal del programa × (windowDays / 7)
 * Devuelve 0..100. Frecuencia <= 0 se interpreta como 4.
 *
 * Limitación explícita: es una estimación sobre sesiones *registradas*; no
 * descuenta sesiones planificadas que el atleta nunca cargó, por lo que puede
 * sobreestimar el cumplimiento real.
 */
export function computeAdherence(
  dates: (Date | string)[],
  frequency = 4,
  windowDays = ADHERENCE_WINDOW_DAYS,
  now: Date = new Date()
): number {
  const freq = frequency > 0 ? frequency : 4;
  const target = freq * (windowDays / 7);
  const sessions = sessionsInWindow(dates, windowDays, now);
  return Math.min(100, Math.round((sessions / Math.max(1, target)) * 100));
}
