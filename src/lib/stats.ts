import type { WorkoutLog } from "@prisma/client";

interface WorkoutLogWithDate extends Omit<WorkoutLog, "date"> {
  date: Date | string;
}

/**
 * Calcula la carga de entrenamiento de la última semana
 * usando un modelo simple: series × reps × peso (cuando disponible)
 */
export function lastSessionLoads(logs: WorkoutLogWithDate[]): Record<string, number> {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const recentLogs = logs.filter((log) => {
    const logDate = new Date(log.date);
    return logDate >= weekAgo && logDate <= now;
  });

  // Agrupar por día de la semana (0-6)
  const loadsByDay: Record<number, number> = {};
  
  for (let i = 0; i < 7; i++) {
    loadsByDay[i] = 0;
  }

  for (const log of recentLogs) {
    const logDate = new Date(log.date);
    const dayOfWeek = logDate.getDay();
    
    // Calcular carga aproximada
    let load = 0;
    if (log.setsCompleted && log.repsCompleted && log.weight) {
      load = log.setsCompleted * log.repsCompleted * (log.weight || 1);
    } else if (log.duration) {
      // Para cardio: usar duración como proxy
      load = log.duration * 10;
    } else {
      // Carga base mínima
      load = 100;
    }
    
    loadsByDay[dayOfWeek] += load;
  }

  // Convertir a formato legible
  const dayNames = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const result: Record<string, number> = {};
  
  for (let i = 0; i < 7; i++) {
    result[dayNames[i]] = loadsByDay[i];
  }

  return result;
}

/**
 * Calcula la racha actual de días consecutivos entrenando
 */
export function computeStreak(logDates: (Date | string)[]): number {
  if (logDates.length === 0) return 0;

  const uniqueDates = Array.from(
    new Set(
      logDates.map((d) => {
        const date = new Date(d);
        return date.toISOString().split("T")[0];
      })
    )
  ).sort((a, b) => b.localeCompare(a));

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // La racha debe incluir hoy o ayer
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = new Date(uniqueDates[i - 1]);
    const prevDate = new Date(uniqueDates[i]);
    const diffDays = Math.round(
      (currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calcula el porcentaje de adherencia semanal
 * @param logDates Fechas de los logs
 * @param weeklyFrequency Frecuencia objetivo por semana
 */
export function computeAdherence(logDates: (Date | string)[], weeklyFrequency: number = 3): number {
  if (weeklyFrequency <= 0) return 0;
  if (logDates.length === 0) return 0;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const recentCount = logDates.filter((d) => {
    const logDate = new Date(d);
    return logDate >= weekAgo && logDate <= now;
  }).length;

  const adherence = Math.min((recentCount / weeklyFrequency) * 100, 100);
  return Math.round(adherence);
}

/**
 * Obtiene las métricas principales del usuario
 */
export interface UserStats {
  totalWorkouts: number;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  currentStreak: number;
  longestStreak: number;
  adherenceRate: number;
  workoutsThisWeek: number;
  workoutsThisMonth: number;
}

export function computeUserStats(logs: WorkoutLogWithDate[]): UserStats {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const logDates = logs.map((l) => l.date);
  
  const workoutsThisWeek = logs.filter((l) => {
    const d = new Date(l.date);
    return d >= weekAgo && d <= now;
  }).length;

  const workoutsThisMonth = logs.filter((l) => {
    const d = new Date(l.date);
    return d >= monthAgo && d <= now;
  }).length;

  let totalSets = 0;
  let totalReps = 0;
  let totalVolume = 0;

  for (const log of logs) {
    if (log.setsCompleted) totalSets += log.setsCompleted;
    if (log.repsCompleted) totalReps += log.repsCompleted;
    if (log.setsCompleted && log.repsCompleted && log.weight) {
      totalVolume += log.setsCompleted * log.repsCompleted * log.weight;
    }
  }

  const currentStreak = computeStreak(logDates);
  const adherence = computeAdherence(logDates, 3);

  return {
    totalWorkouts: logs.length,
    totalSets,
    totalReps,
    totalVolume,
    currentStreak,
    longestStreak: currentStreak, // Simplificado: debería calcularse históricamente
    adherenceRate: adherence,
    workoutsThisWeek,
    workoutsThisMonth,
  };
}
