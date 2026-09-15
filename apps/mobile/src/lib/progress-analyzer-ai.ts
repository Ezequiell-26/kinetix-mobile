/**
 * Sistema de Análisis de Progreso con IA
 * Detecta patrones, estancamientos y recomienda ajustes automáticos
 */

export interface ProgressData {
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  measurements?: {
    chest: number;
    waist: number;
    hips: number;
    arms: number;
    legs: number;
    neck: number;
  };
  photos?: string[];
  notes?: string;
}

export interface WorkoutLog {
  date: string;
  exerciseId: string;
  exerciseName: string;
  sets: Array<{
    reps: number;
    weight: number;
    rpe?: number;
    rir?: number;
  }>;
  duration?: number;
  notes?: string;
}

export interface ProgressAnalysis {
  trend: 'gaining' | 'losing' | 'stable';
  weeklyChange: number;
  monthlyChange: number;
  adherenceRate: number;
  strengthProgress: {
    improving: string[];
    stable: string[];
    declining: string[];
  };
  plateauDetected: boolean;
  plateauDetails?: {
    exercise: string;
    weeksStagnant: number;
    recommendation: string;
  }[];
  recommendations: string[];
  riskFactors: string[];
  achievements: string[];
}

// Calcular tendencia de peso
export function calculateWeightTrend(data: ProgressData[]): ProgressAnalysis['trend'] {
  if (data.length < 3) return 'stable';

  const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const recent = sorted.slice(-4); // Últimas 4 semanas
  
  const weights = recent.map(d => d.weight);
  const firstHalf = weights.slice(0, 2).reduce((a, b) => a + b, 0) / 2;
  const secondHalf = weights.slice(2).reduce((a, b) => a + b, 0) / 2;
  
  const change = secondHalf - firstHalf;
  
  if (change > 0.5) return 'gaining';
  if (change < -0.5) return 'losing';
  return 'stable';
}

// Calcular cambio semanal promedio
export function calculateWeeklyChange(data: ProgressData[]): number {
  if (data.length < 2) return 0;

  const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  
  const daysDiff = (new Date(last.date).getTime() - new Date(first.date).getTime()) / (1000 * 60 * 60 * 24);
  const weeksDiff = Math.max(daysDiff / 7, 1);
  
  return (last.weight - first.weight) / weeksDiff;
}

// Calcular cambio mensual
export function calculateMonthlyChange(data: ProgressData[]): number {
  return calculateWeeklyChange(data) * 4.33;
}

// Calcular tasa de adherencia
export function calculateAdherenceRate(workoutLogs: WorkoutLog[], expectedWorkouts: number): number {
  if (expectedWorkouts === 0) return 0;
  
  const completedWorkouts = new Set(workoutLogs.map(l => l.date.split('T')[0])).size;
  return Math.min((completedWorkouts / expectedWorkouts) * 100, 100);
}

// Analizar progreso de fuerza por ejercicio
export function analyzeStrengthProgress(workoutLogs: WorkoutLog[]): ProgressAnalysis['strengthProgress'] {
  const exerciseHistory: Record<string, number[]> = {};
  
  // Agrupar logs por ejercicio
  workoutLogs.forEach(log => {
    if (!exerciseHistory[log.exerciseId]) {
      exerciseHistory[log.exerciseId] = [];
    }
    
    // Calcular volumen total (series * reps * peso)
    const volume = log.sets.reduce((acc, set) => acc + (set.reps * set.weight), 0);
    exerciseHistory[log.exerciseId].push(volume);
  });
  
  const improving: string[] = [];
  const stable: string[] = [];
  const declining: string[] = [];
  
  Object.entries(exerciseHistory).forEach(([id, volumes]) => {
    if (volumes.length < 3) {
      stable.push(id);
      return;
    }
    
    const recent = volumes.slice(-3);
    const older = volumes.slice(0, 3);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (changePercent > 5) {
      improving.push(id);
    } else if (changePercent < -5) {
      declining.push(id);
    } else {
      stable.push(id);
    }
  });
  
  return { improving, stable, declining };
}

// Detectar estancamiento (plateau)
export function detectPlateau(workoutLogs: WorkoutLog[]): ProgressAnalysis['plateauDetails'] {
  const plateaus: NonNullable<ProgressAnalysis['plateauDetails']> = [];
  
  const exerciseHistory: Record<string, { date: string; volume: number }[]> = {};
  
  // Agrupar logs por ejercicio con fechas
  workoutLogs.forEach(log => {
    if (!exerciseHistory[log.exerciseId]) {
      exerciseHistory[log.exerciseId] = [];
    }
    
    const volume = log.sets.reduce((acc, set) => acc + (set.reps * set.weight), 0);
    exerciseHistory[log.exerciseId].push({ date: log.date, volume });
  });
  
  Object.entries(exerciseHistory).forEach(([id, history]) => {
    if (history.length < 6) return; // Necesita al menos 6 semanas
    
    const sorted = history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const recent = sorted.slice(-6); // Últimas 6 semanas
    
    // Calcular varianza
    const avg = recent.reduce((a, b) => a + b.volume, 0) / recent.length;
    const variance = recent.reduce((a, b) => a + Math.pow(b.volume - avg, 2), 0) / recent.length;
    const stdDev = Math.sqrt(variance);
    
    // Si la desviación estándar es muy baja (< 3% del promedio), hay estancamiento
    if (stdDev < avg * 0.03) {
      plateaus.push({
        exercise: id,
        weeksStagnant: 6,
        recommendation: generatePlateauRecommendation(id, avg),
      });
    }
  });
  
  return plateaus.length > 0 ? plateaus : undefined;
}

// Generar recomendación para superar estancamiento
function generatePlateauRecommendation(exerciseId: string, currentVolume: number): string {
  const recommendations = [
    'Aumentá el peso un 2-5% la próxima semana',
    'Probá una variante del ejercicio por 2 semanas',
    'Aumentá el volumen total en un 10%',
    'Incorporá técnicas de intensidad (drop sets, rest-pause)',
    'Tomá una semana de deload (reducí volumen 50%)',
    'Cambiar el rango de repeticiones (más pesado o más liviano)',
    'Mejorá la técnica y control excéntrico',
    'Aumentá la frecuencia a 2x por semana',
  ];
  
  return recommendations[Math.floor(Math.random() * recommendations.length)];
}

// Generar recomendaciones generales
export function generateRecommendations(analysis: ProgressAnalysis, goal: string): string[] {
  const recommendations: string[] = [];
  
  // Basado en la tendencia
  if (goal.includes('gain') && analysis.trend === 'losing') {
    recommendations.push('Estás perdiendo peso pero tu objetivo es ganar masa. Considerá aumentar 200-300 calorías diarias.');
  } else if (goal.includes('loss') && analysis.trend === 'gaining') {
    recommendations.push('El peso está subiendo pero querés perder grasa. Revisá tu déficit calórico.');
  }
  
  // Basado en adherencia
  if (analysis.adherenceRate < 70) {
    recommendations.push('Tu adherencia es baja (< 70%). Intentá reducir la frecuencia o duración de los entrenamientos.');
  } else if (analysis.adherenceRate > 95) {
    recommendations.push('¡Excelente adherencia! Podés considerar aumentar ligeramente la intensidad.');
  }
  
  // Basado en progreso de fuerza
  if (analysis.strengthProgress.declining.length > 0) {
    recommendations.push(`Atención: ${analysis.strengthProgress.declining.length} ejercicios muestran disminución de fuerza. Revisá recuperación y nutrición.`);
  }
  
  // Basado en estancamientos
  if (analysis.plateauDetected && analysis.plateauDetails) {
    analysis.plateauDetails.forEach(p => {
      recommendations.push(`${p.exercise}: ${p.recommendation}`);
    });
  }
  
  // Basado en factores de riesgo
  analysis.riskFactors.forEach(risk => {
    recommendations.push(`⚠️ ${risk}`);
  });
  
  return recommendations;
}

// Detectar factores de riesgo
export function detectRiskFactors(data: ProgressData[], workoutLogs: WorkoutLog[]): string[] {
  const risks: string[] = [];
  
  // Pérdida de peso muy rápida
  const weeklyChange = calculateWeeklyChange(data);
  if (weeklyChange < -1) {
    risks.push('Pérdida de peso muy rápida (> 1kg/semana). Puede causar pérdida muscular.');
  } else if (weeklyChange > 1) {
    risks.push('Ganancia de peso muy rápida (> 1kg/semana). Probablemente sea mayormente grasa.');
  }
  
  // Adherencia muy baja
  const adherence = calculateAdherenceRate(workoutLogs, 12); // Esperado 3x por semana x 4 semanas
  if (adherence < 50) {
    risks.push('Adherencia muy baja (< 50%). Riesgo de no alcanzar objetivos.');
  }
  
  // Sin registros recientes
  const lastLog = workoutLogs.length > 0 
    ? workoutLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;
  
  if (lastLog) {
    const daysSinceLastLog = (Date.now() - new Date(lastLog.date).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastLog > 14) {
      risks.push('Sin registros hace más de 2 semanas. Volvé a registrar tus entrenamientos.');
    }
  }
  
  return risks;
}

// Detectar logros automáticos
export function detectAchievements(data: ProgressData[], workoutLogs: WorkoutLog[]): string[] {
  const achievements: string[] = [];
  
  // Peso récord
  const maxWeight = Math.max(...data.map(d => d.weight));
  const minWeight = Math.min(...data.map(d => d.weight));
  
  if (data.length > 1) {
    const firstWeight = data[0].weight;
    if (maxWeight > firstWeight + 5) {
      achievements.push(`🏆 Nuevo peso máximo: ${maxWeight.toFixed(1)}kg (+${(maxWeight - firstWeight).toFixed(1)}kg)`);
    }
    if (minWeight < firstWeight - 5) {
      achievements.push(`🎯 Nuevo peso mínimo: ${minWeight.toFixed(1)}kg (-${(firstWeight - minWeight).toFixed(1)}kg)`);
    }
  }
  
  // Racha de entrenamientos
  const uniqueDates = new Set(workoutLogs.map(l => l.date.split('T')[0]));
  if (uniqueDates.size >= 30) {
    achievements.push('🔥 30 días consecutivos entrenando');
  }
  if (uniqueDates.size >= 90) {
    achievements.push('💪 90 días de consistencia');
  }
  if (uniqueDates.size >= 365) {
    achievements.push('👑 1 año de transformación');
  }
  
  // PRs (Personal Records)
  const exerciseMaxes: Record<string, number> = {};
  workoutLogs.forEach(log => {
    log.sets.forEach(set => {
      if (!exerciseMaxes[log.exerciseId] || set.weight > exerciseMaxes[log.exerciseId]) {
        exerciseMaxes[log.exerciseId] = set.weight;
      }
    });
  });
  
  // Logro por cada nuevo PR (simplificado)
  const prCount = Object.keys(exerciseMaxes).length;
  if (prCount >= 5) {
    achievements.push(`⭐ ${prCount} ejercicios con récord personal`);
  }
  
  return achievements;
}

// Análisis completo
export function analyzeProgress(
  progressData: ProgressData[],
  workoutLogs: WorkoutLog[],
  goal: string = 'general',
  expectedWorkoutsPerWeek: number = 3
): ProgressAnalysis {
  const trend = calculateWeightTrend(progressData);
  const weeklyChange = calculateWeeklyChange(progressData);
  const monthlyChange = calculateMonthlyChange(progressData);
  const adherenceRate = calculateAdherenceRate(workoutLogs, expectedWorkoutsPerWeek * 4);
  const strengthProgress = analyzeStrengthProgress(workoutLogs);
  const plateauDetails = detectPlateau(workoutLogs);
  const riskFactors = detectRiskFactors(progressData, workoutLogs);
  const achievementsList = detectAchievements(progressData, workoutLogs);
  
  const analysis: ProgressAnalysis = {
    trend,
    weeklyChange,
    monthlyChange,
    adherenceRate,
    strengthProgress,
    plateauDetected: !!plateauDetails && plateauDetails.length > 0,
    plateauDetails,
    recommendations: [],
    riskFactors,
    achievements: achievementsList,
  };
  
  analysis.recommendations = generateRecommendations(analysis, goal);
  
  return analysis;
}

// Exportar análisis a JSON
export function exportProgressAnalysis(analysis: ProgressAnalysis): string {
  return JSON.stringify(analysis, null, 2);
}

// Comparar dos períodos
export function comparePeriods(
  period1: { data: ProgressData[]; logs: WorkoutLog[] },
  period2: { data: ProgressData[]; logs: WorkoutLog[] }
): {
  weightChange: number;
  adherenceChange: number;
  strengthImprovement: string[];
  summary: string;
} {
  const analysis1 = analyzeProgress(period1.data, period1.logs);
  const analysis2 = analyzeProgress(period2.data, period2.logs);
  
  const weightChange = analysis2.monthlyChange - analysis1.monthlyChange;
  const adherenceChange = analysis2.adherenceRate - analysis1.adherenceRate;
  
  const strengthImprovement = analysis2.strengthProgress.improving.filter(
    ex => analysis1.strengthProgress.stable.includes(ex) || analysis1.strengthProgress.declining.includes(ex)
  );
  
  let summary = '';
  if (weightChange > 0) {
    summary += 'La tasa de ganancia de peso mejoró. ';
  } else if (weightChange < 0) {
    summary += 'La tasa de ganancia de peso disminuyó. ';
  }
  
  if (adherenceChange > 5) {
    summary += 'Mayor adherencia a los entrenamientos. ';
  } else if (adherenceChange < -5) {
    summary += 'Menor adherencia a los entrenamientos. ';
  }
  
  if (strengthImprovement.length > 0) {
    summary += `${strengthImprovement.length} ejercicios mostraron mejora.`;
  }
  
  return { weightChange, adherenceChange, strengthImprovement, summary };
}
