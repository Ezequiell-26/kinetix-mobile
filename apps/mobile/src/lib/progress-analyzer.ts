/**
 * KinetixFitt - AI Progress Analyzer
 * Sistema inteligente de análisis de progreso con comparaciones multi-período
 * y generación de insights personalizados
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type TimePeriod = '7d' | '14d' | '30d' | '90d' | '6m' | '1y' | 'all';
export type MetricType = 'volume' | 'strength' | 'consistency' | 'performance' | 'body';
export type TrendDirection = 'up' | 'down' | 'stable' | 'volatile';
export type InsightType = 'achievement' | 'warning' | 'recommendation' | 'milestone' | 'pattern';
export type ComparisonType = 'period-over-period' | 'baseline' | 'goal' | 'personal-best';

export interface WorkoutData {
  id: string;
  date: Date;
  exercises: ExerciseData[];
  duration: number; // minutes
  totalVolume: number; // kg
  avgIntensity: number; // 0-10 RPE
  completionRate: number; // 0-1
  notes?: string;
}

export interface ExerciseData {
  exerciseId: string;
  exerciseName: string;
  sets: SetData[];
  muscleGroup: string;
  totalVolume: number;
  bestSet: SetData;
  prAchieved: boolean;
}

export interface SetData {
  weight: number;
  reps: number;
  rpe?: number;
  volume: number; // weight * reps
}

export interface BodyMetrics {
  date: Date;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    legs?: number;
  };
}

export interface ProgressMetrics {
  period: TimePeriod;
  startDate: Date;
  endDate: Date;
  
  // Workout metrics
  totalWorkouts: number;
  avgWorkoutsPerWeek: number;
  totalVolume: number;
  avgVolumePerWorkout: number;
  totalDuration: number; // minutes
  avgDuration: number;
  
  // Consistency metrics
  longestStreak: number;
  currentStreak: number;
  adherenceRate: number; // 0-1
  missedWorkouts: number;
  
  // Strength metrics
  totalPRs: number;
  strengthGainsByMuscle: Record<string, number>;
  topExercises: Array<{
    name: string;
    volumeIncrease: number;
    prCount: number;
  }>;
  
  // Performance metrics
  avgIntensity: number;
  avgCompletionRate: number;
  performanceScore: number; // 0-100
  
  // Body metrics
  weightChange?: number;
  bodyFatChange?: number;
  muscleMassChange?: number;
}

export interface TrendAnalysis {
  metric: string;
  direction: TrendDirection;
  changePercent: number;
  confidence: number; // 0-1
  dataPoints: number;
  prediction?: {
    next7Days: number;
    next30Days: number;
    confidence: number;
  };
}

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  metric?: string;
  data?: Record<string, unknown>;
  recommendation?: string;
  confidence: number; // 0-1
  timestamp: Date;
}

export interface PeriodComparison {
  type: ComparisonType;
  currentPeriod: ProgressMetrics;
  comparisonPeriod: ProgressMetrics;
  differences: {
    metric: string;
    current: number;
    previous: number;
    change: number;
    changePercent: number;
    trend: TrendDirection;
  }[];
  summary: string;
  highlights: string[];
}

export interface ProgressReport {
  userId: string;
  generatedAt: Date;
  period: TimePeriod;
  
  // Core metrics
  metrics: ProgressMetrics;
  
  // Trends
  trends: TrendAnalysis[];
  
  // Comparisons
  comparisons: PeriodComparison[];
  
  // AI Insights
  insights: AIInsight[];
  
  // Recommendations
  recommendations: string[];
  
  // Overall score
  overallScore: number; // 0-100
  scoreBreakdown: {
    consistency: number;
    volume: number;
    strength: number;
    performance: number;
  };
  
  // Achievements during period
  achievementsUnlocked: number;
  milestonesReached: string[];
}

// ============================================================================
// PROGRESS ANALYZER CLASS
// ============================================================================

export class ProgressAnalyzer {
  /**
   * Analiza el progreso del usuario en un período específico
   */
  static async analyzeProgress(
    userId: string,
    period: TimePeriod,
    workouts: WorkoutData[],
    bodyMetrics: BodyMetrics[] = []
  ): Promise<ProgressReport> {
    const { startDate, endDate } = this.getPeriodDates(period);
    
    // Filtrar workouts del período
    const periodWorkouts = workouts.filter(
      w => w.date >= startDate && w.date <= endDate
    );
    
    // Calcular métricas
    const metrics = this.calculateMetrics(period, periodWorkouts, bodyMetrics, startDate, endDate);
    
    // Analizar tendencias
    const trends = this.analyzeTrends(periodWorkouts, bodyMetrics);
    
    // Generar comparaciones
    const comparisons = await this.generateComparisons(
      userId,
      period,
      metrics,
      workouts
    );
    
    // Generar insights con IA
    const insights = this.generateAIInsights(metrics, trends, comparisons);
    
    // Generar recomendaciones
    const recommendations = this.generateRecommendations(insights, metrics, trends);
    
    // Calcular score general
    const scoreBreakdown = this.calculateScoreBreakdown(metrics);
    const overallScore = Math.round(
      (scoreBreakdown.consistency * 0.3 +
       scoreBreakdown.volume * 0.25 +
       scoreBreakdown.strength * 0.25 +
       scoreBreakdown.performance * 0.2)
    );
    
    return {
      userId,
      generatedAt: new Date(),
      period,
      metrics,
      trends,
      comparisons,
      insights,
      recommendations,
      overallScore,
      scoreBreakdown,
      achievementsUnlocked: metrics.totalPRs, // Simplificado
      milestonesReached: this.identifyMilestones(metrics, insights),
    };
  }
  
  /**
   * Calcula métricas del período
   */
  private static calculateMetrics(
    period: TimePeriod,
    workouts: WorkoutData[],
    bodyMetrics: BodyMetrics[],
    startDate: Date,
    endDate: Date
  ): ProgressMetrics {
    const totalWorkouts = workouts.length;
    const weeks = this.getWeeksBetween(startDate, endDate);
    
    // Volume metrics
    const totalVolume = workouts.reduce((sum, w) => sum + w.totalVolume, 0);
    const avgVolumePerWorkout = totalWorkouts > 0 ? totalVolume / totalWorkouts : 0;
    
    // Duration metrics
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const avgDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;
    
    // Consistency metrics
    const { longestStreak, currentStreak } = this.calculateStreaks(workouts);
    const expectedWorkouts = weeks * 4; // Asumiendo 4x por semana
    const adherenceRate = expectedWorkouts > 0 ? totalWorkouts / expectedWorkouts : 0;
    
    // Strength metrics
    const totalPRs = workouts.reduce((sum, w) => {
      return sum + w.exercises.filter(e => e.prAchieved).length;
    }, 0);
    
    const strengthGainsByMuscle = this.calculateStrengthGains(workouts);
    const topExercises = this.getTopExercises(workouts);
    
    // Performance metrics
    const avgIntensity = totalWorkouts > 0
      ? workouts.reduce((sum, w) => sum + w.avgIntensity, 0) / totalWorkouts
      : 0;
    const avgCompletionRate = totalWorkouts > 0
      ? workouts.reduce((sum, w) => sum + w.completionRate, 0) / totalWorkouts
      : 0;
    const performanceScore = this.calculatePerformanceScore(
      avgIntensity,
      avgCompletionRate,
      adherenceRate
    );
    
    // Body metrics
    const sortedBodyMetrics = [...bodyMetrics].sort((a, b) => a.date.getTime() - b.date.getTime());
    const firstMetric = sortedBodyMetrics[0];
    const lastMetric = sortedBodyMetrics[sortedBodyMetrics.length - 1];
    
    return {
      period,
      startDate,
      endDate,
      totalWorkouts,
      avgWorkoutsPerWeek: weeks > 0 ? totalWorkouts / weeks : 0,
      totalVolume,
      avgVolumePerWorkout,
      totalDuration,
      avgDuration,
      longestStreak,
      currentStreak,
      adherenceRate: Math.min(adherenceRate, 1),
      missedWorkouts: Math.max(0, expectedWorkouts - totalWorkouts),
      totalPRs,
      strengthGainsByMuscle,
      topExercises,
      avgIntensity,
      avgCompletionRate,
      performanceScore,
      weightChange: firstMetric && lastMetric && firstMetric.weight && lastMetric.weight
        ? lastMetric.weight - firstMetric.weight
        : undefined,
      bodyFatChange: firstMetric && lastMetric && firstMetric.bodyFat && lastMetric.bodyFat
        ? lastMetric.bodyFat - firstMetric.bodyFat
        : undefined,
      muscleMassChange: firstMetric && lastMetric && firstMetric.muscleMass && lastMetric.muscleMass
        ? lastMetric.muscleMass - firstMetric.muscleMass
        : undefined,
    };
  }
  
  /**
   * Analiza tendencias en los datos
   */
  private static analyzeTrends(
    workouts: WorkoutData[],
    bodyMetrics: BodyMetrics[]
  ): TrendAnalysis[] {
    const trends: TrendAnalysis[] = [];
    
    // Tendencia de volumen
    const volumeTrend = this.calculateTrend(
      workouts.map(w => ({ date: w.date, value: w.totalVolume }))
    );
    trends.push({
      metric: 'Total Volume',
      ...volumeTrend,
    });
    
    // Tendencia de intensidad
    const intensityTrend = this.calculateTrend(
      workouts.map(w => ({ date: w.date, value: w.avgIntensity }))
    );
    trends.push({
      metric: 'Average Intensity',
      ...intensityTrend,
    });
    
    // Tendencia de duración
    const durationTrend = this.calculateTrend(
      workouts.map(w => ({ date: w.date, value: w.duration }))
    );
    trends.push({
      metric: 'Workout Duration',
      ...durationTrend,
    });
    
    // Tendencia de peso corporal (si disponible)
    if (bodyMetrics.length >= 3) {
      const weightData = bodyMetrics
        .filter(m => m.weight !== undefined)
        .map(m => ({ date: m.date, value: m.weight! }));
      
      if (weightData.length >= 3) {
        const weightTrend = this.calculateTrend(weightData);
        trends.push({
          metric: 'Body Weight',
          ...weightTrend,
        });
      }
    }
    
    return trends;
  }
  
  /**
   * Calcula tendencia para un conjunto de datos
   */
  private static calculateTrend(
    data: Array<{ date: Date; value: number }>
  ): Omit<TrendAnalysis, 'metric'> {
    if (data.length < 2) {
      return {
        direction: 'stable',
        changePercent: 0,
        confidence: 0,
        dataPoints: data.length,
      };
    }
    
    // Regresión lineal simple
    const sorted = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());
    const n = sorted.length;
    const x = sorted.map((_, i) => i);
    const y = sorted.map(d => d.value);
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calcular R²
    const yMean = sumY / n;
    const ssRes = y.reduce((sum, yi, i) => {
      const predicted = slope * i + intercept;
      return sum + Math.pow(yi - predicted, i);
    }, 0);
    const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const r2 = ssTot > 0 ? 1 - (ssRes / ssTot) : 0;
    
    // Determinar dirección
    const firstValue = y[0];
    const lastValue = y[n - 1];
    const changePercent = firstValue !== 0 ? ((lastValue - firstValue) / Math.abs(firstValue)) * 100 : 0;
    
    let direction: TrendDirection;
    const absSlope = Math.abs(slope);
    const avgValue = sumY / n;
    const volatility = this.calculateVolatility(y);
    
    if (volatility > avgValue * 0.3) {
      direction = 'volatile';
    } else if (absSlope < avgValue * 0.01) {
      direction = 'stable';
    } else if (slope > 0) {
      direction = 'up';
    } else {
      direction = 'down';
    }
    
    // Predicciones
    const prediction = {
      next7Days: slope * (n + 7) + intercept,
      next30Days: slope * (n + 30) + intercept,
      confidence: Math.abs(r2),
    };
    
    return {
      direction,
      changePercent,
      confidence: Math.abs(r2),
      dataPoints: n,
      prediction,
    };
  }
  
  /**
   * Calcula volatilidad (desviación estándar)
   */
  private static calculateVolatility(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }
  
  /**
   * Genera comparaciones entre períodos
   */
  private static async generateComparisons(
    userId: string,
    currentPeriod: TimePeriod,
    currentMetrics: ProgressMetrics,
    allWorkouts: WorkoutData[]
  ): Promise<PeriodComparison[]> {
    const comparisons: PeriodComparison[] = [];
    
    // Comparación con período anterior
    const previousPeriod = this.getPreviousPeriod(currentPeriod);
    if (previousPeriod) {
      const { startDate, endDate } = previousPeriod;
      const previousWorkouts = allWorkouts.filter(
        w => w.date >= startDate && w.date <= endDate
      );
      const previousMetrics = this.calculateMetrics(
        currentPeriod,
        previousWorkouts,
        [],
        startDate,
        endDate
      );
      
      comparisons.push(this.createComparison(
        'period-over-period',
        currentMetrics,
        previousMetrics
      ));
    }
    
    // Comparación con personal best
    const allTimeMetrics = this.calculateMetrics(
      'all',
      allWorkouts,
      [],
      new Date(0),
      new Date()
    );
    
    comparisons.push(this.createComparison(
      'personal-best',
      currentMetrics,
      allTimeMetrics
    ));
    
    return comparisons;
  }
  
  /**
   * Crea objeto de comparación
   */
  private static createComparison(
    type: ComparisonType,
    current: ProgressMetrics,
    previous: ProgressMetrics
  ): PeriodComparison {
    const differences = [
      {
        metric: 'Total Workouts',
        current: current.totalWorkouts,
        previous: previous.totalWorkouts,
        change: current.totalWorkouts - previous.totalWorkouts,
        changePercent: this.calculateChangePercent(current.totalWorkouts, previous.totalWorkouts),
        trend: this.getTrend(current.totalWorkouts, previous.totalWorkouts),
      },
      {
        metric: 'Total Volume',
        current: current.totalVolume,
        previous: previous.totalVolume,
        change: current.totalVolume - previous.totalVolume,
        changePercent: this.calculateChangePercent(current.totalVolume, previous.totalVolume),
        trend: this.getTrend(current.totalVolume, previous.totalVolume),
      },
      {
        metric: 'Average Intensity',
        current: current.avgIntensity,
        previous: previous.avgIntensity,
        change: current.avgIntensity - previous.avgIntensity,
        changePercent: this.calculateChangePercent(current.avgIntensity, previous.avgIntensity),
        trend: this.getTrend(current.avgIntensity, previous.avgIntensity),
      },
      {
        metric: 'Adherence Rate',
        current: current.adherenceRate,
        previous: previous.adherenceRate,
        change: current.adherenceRate - previous.adherenceRate,
        changePercent: this.calculateChangePercent(current.adherenceRate, previous.adherenceRate),
        trend: this.getTrend(current.adherenceRate, previous.adherenceRate),
      },
      {
        metric: 'Total PRs',
        current: current.totalPRs,
        previous: previous.totalPRs,
        change: current.totalPRs - previous.totalPRs,
        changePercent: this.calculateChangePercent(current.totalPRs, previous.totalPRs),
        trend: this.getTrend(current.totalPRs, previous.totalPRs),
      },
    ];
    
    const summary = this.generateComparisonSummary(type, differences);
    const highlights = this.generateHighlights(differences);
    
    return {
      type,
      currentPeriod: current,
      comparisonPeriod: previous,
      differences,
      summary,
      highlights,
    };
  }
  
  /**
   * Genera insights con IA
   */
  private static generateAIInsights(
    metrics: ProgressMetrics,
    trends: TrendAnalysis[],
    comparisons: PeriodComparison[]
  ): AIInsight[] {
    const insights: AIInsight[] = [];
    let insightId = 1;
    
    // Insight: Consistency
    if (metrics.adherenceRate >= 0.9) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'achievement',
        title: 'Exceptional Consistency',
        description: `You've maintained ${Math.round(metrics.adherenceRate * 100)}% adherence rate. Your dedication is outstanding!`,
        priority: 'high',
        metric: 'adherenceRate',
        confidence: 0.95,
        timestamp: new Date(),
      });
    } else if (metrics.adherenceRate < 0.5) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'warning',
        title: 'Consistency Needs Improvement',
        description: `Your adherence rate is ${Math.round(metrics.adherenceRate * 100)}%. Try to maintain a regular schedule.`,
        priority: 'high',
        metric: 'adherenceRate',
        recommendation: 'Set specific workout times and enable reminders to improve consistency.',
        confidence: 0.9,
        timestamp: new Date(),
      });
    }
    
    // Insight: Volume trend
    const volumeTrend = trends.find(t => t.metric === 'Total Volume');
    if (volumeTrend && volumeTrend.direction === 'up' && volumeTrend.changePercent > 15) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'achievement',
        title: 'Strong Volume Progression',
        description: `Your training volume increased by ${Math.round(volumeTrend.changePercent)}%. Great progressive overload!`,
        priority: 'high',
        metric: 'totalVolume',
        confidence: volumeTrend.confidence,
        timestamp: new Date(),
      });
    } else if (volumeTrend && volumeTrend.direction === 'down' && volumeTrend.changePercent < -15) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'warning',
        title: 'Volume Declining',
        description: `Your training volume decreased by ${Math.abs(Math.round(volumeTrend.changePercent))}%. This might affect your progress.`,
        priority: 'medium',
        metric: 'totalVolume',
        recommendation: 'Review your program and ensure adequate recovery. Consider adjusting volume gradually.',
        confidence: volumeTrend.confidence,
        timestamp: new Date(),
      });
    }
    
    // Insight: PRs
    if (metrics.totalPRs >= 5) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'milestone',
        title: 'Personal Records Achieved',
        description: `You set ${metrics.totalPRs} personal records this period! Your strength is improving consistently.`,
        priority: 'high',
        metric: 'totalPRs',
        confidence: 1.0,
        timestamp: new Date(),
      });
    } else if (metrics.totalPRs === 0 && metrics.totalWorkouts > 10) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'recommendation',
        title: 'Time to Push Harder',
        description: 'No PRs set this period. Consider progressive overload to continue improving strength.',
        priority: 'medium',
        metric: 'totalPRs',
        recommendation: 'Increase weight by 2.5-5% when you can complete all sets with good form.',
        confidence: 0.8,
        timestamp: new Date(),
      });
    }
    
    // Insight: Streak
    if (metrics.currentStreak >= 7) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'achievement',
        title: 'Impressive Streak',
        description: `You're on a ${metrics.currentStreak}-day workout streak! Keep the momentum going.`,
        priority: 'medium',
        metric: 'currentStreak',
        confidence: 1.0,
        timestamp: new Date(),
      });
    }
    
    // Insight: Intensity
    if (metrics.avgIntensity >= 8) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'pattern',
        title: 'High Training Intensity',
        description: `Average RPE of ${metrics.avgIntensity.toFixed(1)} indicates very intense training. Ensure adequate recovery.`,
        priority: 'medium',
        metric: 'avgIntensity',
        recommendation: 'Include deload weeks every 4-6 weeks to prevent overtraining.',
        confidence: 0.85,
        timestamp: new Date(),
      });
    } else if (metrics.avgIntensity < 6 && metrics.totalWorkouts > 5) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'recommendation',
        title: 'Consider Increasing Intensity',
        description: `Average RPE of ${metrics.avgIntensity.toFixed(1)} suggests room for more challenging workouts.`,
        priority: 'low',
        metric: 'avgIntensity',
        recommendation: 'Try increasing weights or reducing rest periods to raise training intensity.',
        confidence: 0.75,
        timestamp: new Date(),
      });
    }
    
    // Insight: Body composition (si disponible)
    if (metrics.weightChange !== undefined && Math.abs(metrics.weightChange) > 2) {
      const direction = metrics.weightChange > 0 ? 'gained' : 'lost';
      insights.push({
        id: `insight-${insightId++}`,
        type: 'milestone',
        title: 'Body Composition Change',
        description: `You ${direction} ${Math.abs(metrics.weightChange).toFixed(1)} kg this period.`,
        priority: 'medium',
        metric: 'weightChange',
        confidence: 0.9,
        timestamp: new Date(),
      });
    }
    
    // Insight: Performance score
    if (metrics.performanceScore >= 85) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'achievement',
        title: 'Elite Performance',
        description: `Performance score of ${metrics.performanceScore}/100. You're in the top tier of athletes!`,
        priority: 'high',
        metric: 'performanceScore',
        confidence: 0.95,
        timestamp: new Date(),
      });
    }
    
    return insights;
  }
  
  /**
   * Genera recomendaciones personalizadas
   */
  private static generateRecommendations(
    insights: AIInsight[],
    metrics: ProgressMetrics,
    trends: TrendAnalysis[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Extraer recomendaciones de insights
    insights
      .filter(i => i.recommendation)
      .forEach(i => recommendations.push(i.recommendation!));
    
    // Recomendaciones adicionales basadas en métricas
    if (metrics.avgWorkoutsPerWeek < 3) {
      recommendations.push('Aim for at least 3-4 workouts per week for optimal progress.');
    }
    
    if (metrics.longestStreak < 7) {
      recommendations.push('Build a 7-day streak to establish a strong habit and unlock achievements.');
    }
    
    const volumeTrend = trends.find(t => t.metric === 'Total Volume');
    if (volumeTrend && volumeTrend.direction === 'stable') {
      recommendations.push('Your volume has plateaued. Consider adding sets or exercises to continue progressing.');
    }
    
    if (metrics.topExercises.length > 0) {
      const topExercise = metrics.topExercises[0];
      recommendations.push(`Focus on ${topExercise.name} - it's showing the best progress with ${topExercise.volumeIncrease.toFixed(0)}% increase.`);
    }
    
    if (metrics.missedWorkouts > 5) {
      recommendations.push('Schedule your workouts in advance and set reminders to reduce missed sessions.');
    }
    
    return recommendations.slice(0, 5); // Limitar a top 5
  }
  
  /**
   * Calcula score breakdown
   */
  private static calculateScoreBreakdown(metrics: ProgressMetrics): {
    consistency: number;
    volume: number;
    strength: number;
    performance: number;
  } {
    // Consistency score (0-100)
    const consistency = Math.min(100, (
      metrics.adherenceRate * 40 +
      (metrics.currentStreak / 30) * 30 +
      (metrics.avgWorkoutsPerWeek / 5) * 30
    ));
    
    // Volume score (0-100)
    const expectedVolume = metrics.totalWorkouts * 5000; // 5000 kg por workout esperado
    const volume = Math.min(100, (metrics.totalVolume / expectedVolume) * 100);
    
    // Strength score (0-100)
    const expectedPRs = metrics.totalWorkouts * 0.2; // 0.2 PRs por workout esperado
    const strength = Math.min(100, (metrics.totalPRs / Math.max(1, expectedPRs)) * 100);
    
    // Performance score (ya calculado)
    const performance = metrics.performanceScore;
    
    return {
      consistency: Math.round(consistency),
      volume: Math.round(volume),
      strength: Math.round(strength),
      performance: Math.round(performance),
    };
  }
  
  /**
   * Calcula performance score
   */
  private static calculatePerformanceScore(
    avgIntensity: number,
    avgCompletionRate: number,
    adherenceRate: number
  ): number {
    return Math.round(
      (avgIntensity / 10) * 40 +
      avgCompletionRate * 30 +
      adherenceRate * 30
    );
  }
  
  /**
   * Identifica milestones alcanzados
   */
  private static identifyMilestones(
    metrics: ProgressMetrics,
    insights: AIInsight[]
  ): string[] {
    const milestones: string[] = [];
    
    if (metrics.totalWorkouts >= 100) {
      milestones.push('100 Workouts Completed');
    } else if (metrics.totalWorkouts >= 50) {
      milestones.push('50 Workouts Completed');
    }
    
    if (metrics.longestStreak >= 30) {
      milestones.push('30-Day Streak');
    } else if (metrics.longestStreak >= 14) {
      milestones.push('2-Week Streak');
    }
    
    if (metrics.totalVolume >= 100000) {
      milestones.push('100,000 kg Total Volume');
    } else if (metrics.totalVolume >= 50000) {
      milestones.push('50,000 kg Total Volume');
    }
    
    if (metrics.totalPRs >= 10) {
      milestones.push('10 Personal Records');
    }
    
    if (metrics.performanceScore >= 90) {
      milestones.push('Elite Performance Level');
    }
    
    // Milestones de insights
    insights
      .filter(i => i.type === 'milestone')
      .forEach(i => milestones.push(i.title));
    
    return Array.from(new Set(milestones)); // Eliminar duplicados
  }
  
  // ============================================================================
  // HELPER METHODS
  // ============================================================================
  
  private static getPeriodDates(period: TimePeriod): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '14d':
        startDate.setDate(endDate.getDate() - 14);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '6m':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case 'all':
        startDate.setFullYear(2000);
        break;
    }
    
    return { startDate, endDate };
  }
  
  private static getPreviousPeriod(period: TimePeriod): { startDate: Date; endDate: Date } | null {
    if (period === 'all') return null;
    
    const { startDate: currentStart, endDate: currentEnd } = this.getPeriodDates(period);
    const duration = currentEnd.getTime() - currentStart.getTime();
    
    const endDate = new Date(currentStart.getTime() - 1);
    const startDate = new Date(endDate.getTime() - duration);
    
    return { startDate, endDate };
  }
  
  private static getWeeksBetween(start: Date, end: Date): number {
    const diff = end.getTime() - start.getTime();
    return Math.max(1, diff / (1000 * 60 * 60 * 24 * 7));
  }
  
  private static calculateStreaks(workouts: WorkoutData[]): {
    longestStreak: number;
    currentStreak: number;
  } {
    if (workouts.length === 0) return { longestStreak: 0, currentStreak: 0 };
    
    const sorted = [...workouts].sort((a, b) => a.date.getTime() - b.date.getTime());
    const dates = sorted.map(w => this.getDateString(w.date));
    const uniqueDates = Array.from(new Set(dates));
    
    let longestStreak = 1;
    let currentStreak = 1;
    let tempStreak = 1;
    
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    
    // Calcular streak actual
    const today = this.getDateString(new Date());
    const lastWorkoutDate = uniqueDates[uniqueDates.length - 1];
    const daysSinceLastWorkout = Math.floor(
      (new Date(today).getTime() - new Date(lastWorkoutDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastWorkout <= 1) {
      // Contar hacia atrás
      currentStreak = 1;
      for (let i = uniqueDates.length - 2; i >= 0; i--) {
        const prevDate = new Date(uniqueDates[i]);
        const currDate = new Date(uniqueDates[i + 1]);
        const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    } else {
      currentStreak = 0;
    }
    
    return { longestStreak, currentStreak };
  }
  
  private static getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  private static calculateStrengthGains(workouts: WorkoutData[]): Record<string, number> {
    const gains: Record<string, number[]> = {};
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (!gains[exercise.muscleGroup]) {
          gains[exercise.muscleGroup] = [];
        }
        gains[exercise.muscleGroup].push(exercise.totalVolume);
      });
    });
    
    const result: Record<string, number> = {};
    Object.entries(gains).forEach(([muscle, volumes]) => {
      if (volumes.length >= 2) {
        const first = volumes[0];
        const last = volumes[volumes.length - 1];
        result[muscle] = first > 0 ? ((last - first) / first) * 100 : 0;
      }
    });
    
    return result;
  }
  
  private static getTopExercises(
    workouts: WorkoutData[]
  ): Array<{ name: string; volumeIncrease: number; prCount: number }> {
    const exerciseData: Record<string, { volumes: number[]; prCount: number }> = {};
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (!exerciseData[exercise.exerciseName]) {
          exerciseData[exercise.exerciseName] = { volumes: [], prCount: 0 };
        }
        exerciseData[exercise.exerciseName].volumes.push(exercise.totalVolume);
        if (exercise.prAchieved) {
          exerciseData[exercise.exerciseName].prCount++;
        }
      });
    });
    
    return Object.entries(exerciseData)
      .map(([name, data]) => {
        const volumes = data.volumes;
        const volumeIncrease = volumes.length >= 2
          ? ((volumes[volumes.length - 1] - volumes[0]) / volumes[0]) * 100
          : 0;
        return {
          name,
          volumeIncrease,
          prCount: data.prCount,
        };
      })
      .sort((a, b) => b.volumeIncrease - a.volumeIncrease)
      .slice(0, 5);
  }
  
  private static calculateChangePercent(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  }
  
  private static getTrend(current: number, previous: number): TrendDirection {
    const changePercent = this.calculateChangePercent(current, previous);
    if (Math.abs(changePercent) < 5) return 'stable';
    return changePercent > 0 ? 'up' : 'down';
  }
  
  private static generateComparisonSummary(
    type: ComparisonType,
    differences: PeriodComparison['differences']
  ): string {
    const improvements = differences.filter(d => d.trend === 'up').length;
    const declines = differences.filter(d => d.trend === 'down').length;
    
    if (improvements > declines) {
      return `Strong progress with ${improvements} metrics improving compared to the previous period.`;
    } else if (declines > improvements) {
      return `${declines} metrics declined compared to the previous period. Review your training and recovery.`;
    } else {
      return 'Performance is stable with balanced metrics compared to the previous period.';
    }
  }
  
  private static generateHighlights(differences: PeriodComparison['differences']): string[] {
    return differences
      .filter(d => Math.abs(d.changePercent) > 10)
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 3)
      .map(d => {
        const direction = d.change > 0 ? 'increased' : 'decreased';
        return `${d.metric} ${direction} by ${Math.abs(Math.round(d.changePercent))}%`;
      });
  }
}

// ============================================================================
// EXPORT HELPER FUNCTIONS
// ============================================================================

/**
 * Analiza el progreso del usuario
 */
export async function analyzeUserProgress(
  userId: string,
  period: TimePeriod = '30d',
  workouts: WorkoutData[],
  bodyMetrics: BodyMetrics[] = []
): Promise<ProgressReport> {
  return ProgressAnalyzer.analyzeProgress(userId, period, workouts, bodyMetrics);
}

/**
 * Obtiene insights rápidos sin análisis completo
 */
export function getQuickInsights(
  workouts: WorkoutData[],
  period: TimePeriod = '7d'
): Pick<ProgressReport, 'metrics' | 'insights'> {
  const { startDate, endDate } = ProgressAnalyzer['getPeriodDates'](period);
  const periodWorkouts = workouts.filter(
    w => w.date >= startDate && w.date <= endDate
  );
  
  const metrics = ProgressAnalyzer['calculateMetrics'](
    period,
    periodWorkouts,
    [],
    startDate,
    endDate
  );
  
  const trends = ProgressAnalyzer['analyzeTrends'](periodWorkouts, []);
  const insights = ProgressAnalyzer['generateAIInsights'](metrics, trends, []);
  
  return { metrics, insights };
}
