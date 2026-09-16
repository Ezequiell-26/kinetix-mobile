/**
 * Recovery Engine — análisis de recuperación y sueño.
 */

export interface SleepSession {
  startTime: Date;
  endTime: Date;
  totalDuration: number;
  sleepLatency: number;
  efficiency: number;
  phases?: {
    deep: number;
    rem: number;
    light: number;
    awake: number;
  };
}

export class RecoveryEngine {
  static calculateSleepScore(session: SleepSession): number {
    const weights = { duration: 0.25, efficiency: 0.2, deepSleep: 0.2, remSleep: 0.2, latency: 0.15 };
    const durationHours = session.totalDuration / 60;
    const durationScore = durationHours >= 7 && durationHours <= 9 ? 100 : Math.max(0, 100 - Math.abs(durationHours - 8) * 20);
    const efficiencyScore = Math.max(0, Math.min(100, session.efficiency));

    const deepSleepPct = session.phases?.deep ? (session.phases.deep / Math.max(session.totalDuration, 1)) * 100 : 0;
    const deepScore = deepSleepPct >= 13 && deepSleepPct <= 23 ? 100 : Math.max(0, 100 - Math.abs(deepSleepPct - 18) * 5);

    const remPct = session.phases?.rem ? (session.phases.rem / Math.max(session.totalDuration, 1)) * 100 : 0;
    const remScore = remPct >= 20 && remPct <= 25 ? 100 : Math.max(0, 100 - Math.abs(remPct - 22.5) * 4);

    const latency = Number.isFinite(session.sleepLatency) ? Math.max(0, session.sleepLatency) : 0;
    const latencyScore = latency <= 15 ? 100 : Math.max(0, 100 - (latency - 15) * 3);

    return Math.round(
      durationScore * weights.duration +
      efficiencyScore * weights.efficiency +
      deepScore * weights.deepSleep +
      remScore * weights.remSleep +
      latencyScore * weights.latency,
    );
  }

  static generateRecommendations(session: SleepSession): string[] {
    const recommendations: string[] = [];
    const durationHours = session.totalDuration / 60;
    if (durationHours < 7) recommendations.push("Priorizá una ventana de sueño más larga esta noche.");
    if (session.efficiency < 85) recommendations.push("Reducí interrupciones y mantené horarios regulares de descanso.");
    if (session.sleepLatency > 20) recommendations.push("Probá una rutina de desaceleración sin pantallas antes de dormir.");
    if (recommendations.length === 0) recommendations.push("Tu patrón registrado no requiere ajustes básicos adicionales.");
    return recommendations;
  }
}
