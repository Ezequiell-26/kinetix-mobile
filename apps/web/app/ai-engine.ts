/**
 * KINETIXFIT AI ENGINE v3.0
 * Sistema de Inteligencia Artificial Adaptativa
 * 
 * Basado en patrones de:
 * - TensorFlow.js (ML client-side)
 * - Brain.js (Redes neuronales)
 * - ML5.js (Machine learning accesible)
 * - OpenAI GPT (Generación de contenido)
 */

import { AIAPIs } from './integration-hub';

// ============================================
// 🧠 TIPOS Y INTERFACES
// ============================================

export interface WorkoutData {
  exercises: string[];
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  targetMuscles: string[];
  userLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface UserData {
  age: number;
  gender: string;
  weight: number;
  height: number;
  fitnessLevel: string;
  goals: string[];
  preferences: string[];
  limitations: string[];
  progressHistory: ProgressEntry[];
}

export interface ProgressEntry {
  date: string;
  workoutCompleted: boolean;
  performance: number;
  mood: number;
  energy: number;
  notes?: string;
}

export interface AIRecommendation {
  type: 'workout' | 'nutrition' | 'rest' | 'motivation';
  title: string;
  description: string;
  confidence: number;
  reasoning: string[];
  actions: string[];
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  emotions: {
    joy?: number;
    sadness?: number;
    anger?: number;
    fear?: number;
    surprise?: number;
    disgust?: number;
  };
  keywords: string[];
}

// ============================================
// 🤖 MOTOR DE RECOMENDACIÓN ADAPTATIVA
// ============================================

export class AdaptiveRecommendationEngine {
  private userPatterns: Map<string, number[]> = new Map();
  private successRates: Map<string, number> = new Map();
  private readonly LEARNING_RATE = 0.1;

  /**
   * Analiza patrones de comportamiento del usuario
   */
  analyzeUserPatterns(userData: UserData): Map<string, number> {
    const patterns = new Map<string, number>();
    
    // Analizar consistencia por día de semana
    const dayConsistency = this.calculateDayConsistency(userData.progressHistory);
    patterns.set('consistency', dayConsistency);

    // Analizar progreso por tipo de ejercicio
    const exerciseProgress = this.calculateExerciseProgress(userData.progressHistory);
    patterns.set('exerciseImprovement', exerciseProgress);

    // Analizar correlación humor-rendimiento
    const moodCorrelation = this.calculateMoodPerformanceCorrelation(userData.progressHistory);
    patterns.set('moodImpact', moodCorrelation);

    // Analizar mejor horario
    const optimalTime = this.findOptimalWorkoutTime(userData.progressHistory);
    patterns.set('optimalTime', optimalTime);

    return patterns;
  }

  /**
   * Genera recomendaciones personalizadas
   */
  generateRecommendations(
    userData: UserData,
    currentContext: { timeOfDay: string; dayOfWeek: string; weather?: string }
  ): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    const patterns = this.analyzeUserPatterns(userData);

    // Recomendación de workout
    const workoutRec = this.generateWorkoutRecommendation(userData, patterns, currentContext);
    if (workoutRec) recommendations.push(workoutRec);

    // Recomendación nutricional
    const nutritionRec = this.generateNutritionRecommendation(userData, patterns);
    if (nutritionRec) recommendations.push(nutritionRec);

    // Recomendación de descanso
    const restRec = this.generateRestRecommendation(userData, patterns);
    if (restRec) recommendations.push(restRec);

    // Recomendación motivacional
    const motivationRec = this.generateMotivationRecommendation(userData, patterns);
    if (motivationRec) recommendations.push(motivationRec);

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Genera rutina personalizada basada en IA
   */
  generatePersonalizedWorkout(userData: UserData): WorkoutData {
    const patterns = this.analyzeUserPatterns(userData);
    
    // Seleccionar ejercicios basados en historial y preferencias
    const preferredExercises = this.selectOptimalExercises(userData, patterns);
    
    // Calcular intensidad óptima
    const optimalIntensity = this.calculateOptimalIntensity(userData, patterns);
    
    // Determinar duración ideal
    const optimalDuration = this.calculateOptimalDuration(userData, patterns);

    return {
      exercises: preferredExercises,
      duration: optimalDuration,
      intensity: optimalIntensity,
      targetMuscles: this.identifyTargetMuscles(preferredExercises),
      userLevel: userData.fitnessLevel as any
    };
  }

  private calculateDayConsistency(history: ProgressEntry[]): number {
    if (history.length < 7) return 0.5;
    
    const last7Days = history.slice(-7);
    const completed = last7Days.filter(h => h.workoutCompleted).length;
    
    return completed / 7;
  }

  private calculateExerciseProgress(history: ProgressEntry[]): number {
    if (history.length < 2) return 0;
    
    const recent = history.slice(-5).reduce((sum, h) => sum + h.performance, 0) / 5;
    const older = history.slice(0, 5).reduce((sum, h) => sum + h.performance, 0) / Math.min(5, history.length);
    
    return ((recent - older) / older) * 100;
  }

  private calculateMoodPerformanceCorrelation(history: ProgressEntry[]): number {
    if (history.length < 5) return 0.5;
    
    let correlation = 0;
    for (let i = 1; i < history.length; i++) {
      const moodDiff = history[i].mood - history[i-1].mood;
      const perfDiff = history[i].performance - history[i-1].performance;
      
      if ((moodDiff > 0 && perfDiff > 0) || (moodDiff < 0 && perfDiff < 0)) {
        correlation += 1;
      }
    }
    
    return correlation / (history.length - 1);
  }

  private findOptimalWorkoutTime(history: ProgressEntry[]): string {
    // Implementación simplificada - en producción usar ML real
    const times = ['morning', 'afternoon', 'evening'];
    return times[Math.floor(Math.random() * times.length)];
  }

  private selectOptimalExercises(userData: UserData, patterns: Map<string, number>): string[] {
    const baseExercises = [
      'push-ups', 'squats', 'lunges', 'plank', 'burpees',
      'mountain-climbers', 'jumping-jacks', 'glute-bridge'
    ];

    // Filtrar según limitaciones
    let available = baseExercises;
    if (userData.limitations.includes('knees')) {
      available = available.filter(e => !e.includes('squat') && !e.includes('lunge'));
    }
    if (userData.limitations.includes('wrists')) {
      available = available.filter(e => !e.includes('push-up') && !e.includes('plank'));
    }

    // Seleccionar según nivel
    const count = userData.fitnessLevel === 'beginner' ? 4 : 
                  userData.fitnessLevel === 'intermediate' ? 6 : 8;

    return available.slice(0, count);
  }

  private calculateOptimalIntensity(userData: UserData, patterns: Map<string, number>): 'low' | 'medium' | 'high' {
    const consistency = patterns.get('consistency') || 0.5;
    const improvement = patterns.get('exerciseImprovement') || 0;

    if (consistency > 0.8 && improvement > 10) {
      return 'high';
    } else if (consistency > 0.5 || improvement > 0) {
      return 'medium';
    }
    return 'low';
  }

  private calculateOptimalDuration(userData: UserData, patterns: Map<string, number>): number {
    const baseDuration = userData.fitnessLevel === 'beginner' ? 15 : 
                        userData.fitnessLevel === 'intermediate' ? 30 : 45;
    
    const consistency = patterns.get('consistency') || 0.5;
    
    return Math.round(baseDuration * (0.8 + consistency * 0.4));
  }

  private identifyTargetMuscles(exercises: string[]): string[] {
    const muscleMap: Record<string, string[]> = {
      'push-ups': ['chest', 'triceps', 'shoulders'],
      'squats': ['quadriceps', 'glutes', 'hamstrings'],
      'lunges': ['quadriceps', 'glutes', 'calves'],
      'plank': ['core', 'shoulders', 'back'],
      'burpees': ['full-body', 'cardio'],
      'mountain-climbers': ['core', 'shoulders', 'cardio'],
      'jumping-jacks': ['cardio', 'shoulders', 'calves'],
      'glute-bridge': ['glutes', 'hamstrings', 'core']
    };

    const muscles = new Set<string>();
    exercises.forEach(ex => {
      Object.entries(muscleMap).forEach(([key, value]) => {
        if (ex.includes(key.split('-')[0])) {
          value.forEach(m => muscles.add(m));
        }
      });
    });

    return Array.from(muscles);
  }

  private generateWorkoutRecommendation(
    userData: UserData,
    patterns: Map<string, number>,
    context: any
  ): AIRecommendation | null {
    const consistency = patterns.get('consistency') || 0.5;
    
    if (consistency < 0.3) {
      return {
        type: 'workout',
        title: 'Comienza con rutinas cortas',
        description: 'Tu consistencia es baja. Te recomendamos sesiones de 10-15 minutos para crear el hábito.',
        confidence: 0.9,
        reasoning: ['Baja consistencia detectada', 'Mejor comenzar con metas alcanzables'],
        actions: ['Sesión de 10 min', 'Ejercicios básicos', 'Enfoque en técnica']
      };
    }

    return null;
  }

  private generateNutritionRecommendation(
    userData: UserData,
    patterns: Map<string, number>
  ): AIRecommendation | null {
    return {
      type: 'nutrition',
      title: 'Optimiza tu nutrición post-workout',
      description: 'Consume proteínas dentro de los 30 minutos después de entrenar para maximizar la recuperación.',
      confidence: 0.85,
      reasoning: ['Recuperación muscular óptima', 'Síntesis de proteínas maximizada'],
      actions: ['Batido de proteínas', 'Comida balanceada', 'Hidratación adecuada']
    };
  }

  private generateRestRecommendation(
    userData: UserData,
    patterns: Map<string, number>
  ): AIRecommendation | null {
    const avgEnergy = userData.progressHistory.slice(-7)
      .reduce((sum, h) => sum + h.energy, 0) / Math.min(7, userData.progressHistory.length);

    if (avgEnergy < 5) {
      return {
        type: 'rest',
        title: 'Prioriza el descanso',
        description: 'Tu nivel de energía ha sido bajo esta semana. Considera un día de descanso activo.',
        confidence: 0.88,
        reasoning: ['Energía promedio baja', 'Riesgo de sobreentrenamiento'],
        actions: ['Yoga suave', 'Caminata ligera', 'Estiramientos', 'Dormir 8+ horas']
      };
    }

    return null;
  }

  private generateMotivationRecommendation(
    userData: UserData,
    patterns: Map<string, number>
  ): AIRecommendation {
    const improvement = patterns.get('exerciseImprovement') || 0;
    
    if (improvement > 15) {
      return {
        type: 'motivation',
        title: '¡Excelente progreso!',
        description: `Has mejorado un ${improvement.toFixed(1)}% en las últimas semanas. ¡Sigue así!`,
        confidence: 0.95,
        reasoning: ['Progreso significativo detectado', 'Momento para celebrar logros'],
        actions: ['Comparte tu logro', 'Establece nueva meta', 'Prueba ejercicio avanzado']
      };
    }

    return {
      type: 'motivation',
      title: 'Cada cuenta',
      description: 'El progreso toma tiempo. Confía en el proceso y mantén la constancia.',
      confidence: 0.8,
      reasoning: ['Progreso gradual es normal', 'La consistencia es clave'],
      actions: ['Revisa tu historial', 'Celebra pequeñas victorias', 'Visualiza tus metas']
    };
  }
}

// ============================================
// 📊 ANALIZADOR DE SENTIMIENTO
// ============================================

export class SentimentAnalyzer {
  /**
   * Analiza sentimiento usando Hugging Face API
   */
  async analyzeWithAPI(text: string): Promise<SentimentAnalysis> {
    try {
      const response = await fetch(
        `${AIAPIs.HuggingFace.baseUrl}/${AIAPIs.HuggingFace.models.sentiment}`,
        {
          method: 'POST',
          headers: AIAPIs.HuggingFace.headers,
          body: JSON.stringify({ inputs: text })
        }
      );

      const result = await response.json();
      
      return {
        sentiment: result[0][0].label === 'POSITIVE' ? 'positive' : 'negative',
        score: result[0][0].score,
        emotions: {},
        keywords: this.extractKeywords(text)
      };
    } catch (error) {
      // Fallback a análisis básico
      return this.analyzeLocally(text);
    }
  }

  /**
   * Análisis de sentimiento local (fallback)
   */
  analyzeLocally(text: string): SentimentAnalysis {
    const positiveWords = [
      'excelente', 'genial', 'increíble', 'fantástico', 'mejor',
      'logré', 'conseguí', 'superé', 'feliz', 'motivado',
      'energía', 'fuerte', 'rápido', 'fácil', 'bien'
    ];

    const negativeWords = [
      'difícil', 'cansado', 'agotado', 'frustrado', 'mal',
      'no pude', 'fallé', 'dolor', 'lesión', 'aburrido',
      'lento', 'débil', 'imposible', 'nunca', 'odio'
    ];

    const lowerText = text.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;

    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveScore++;
    });

    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeScore++;
    });

    const total = positiveScore + negativeScore || 1;
    const normalizedScore = (positiveScore - negativeScore + total) / (2 * total);

    return {
      sentiment: normalizedScore > 0.5 ? 'positive' : normalizedScore < 0.4 ? 'negative' : 'neutral',
      score: normalizedScore,
      emotions: {
        joy: positiveScore / total,
        sadness: negativeScore / total
      },
      keywords: this.extractKeywords(text)
    };
  }

  /**
   * Extrae palabras clave del texto
   */
  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'al',
      'en', 'con', 'por', 'para', 'que', 'y', 'o', 'pero', 'si'
    ]);

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));

    const frequency = new Map<string, number>();
    words.forEach(word => {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    });

    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }
}

// ============================================
| 🎯 PREDICTOR DE PROGRESO
// ============================================

export class ProgressPredictor {
  private modelWeights: number[] = [];

  /**
   * Entrena modelo predictivo simple
   */
  train(history: ProgressEntry[]): void {
    if (history.length < 10) {
      this.modelWeights = [0.3, 0.3, 0.4]; // Pesos por defecto
      return;
    }

    // Regresión lineal simple
    const performances = history.map(h => h.performance);
    const moods = history.map(h => h.mood);
    const energies = history.map(h => h.energy);

    // Calcular tendencias
    const perfTrend = this.calculateTrend(performances);
    const moodTrend = this.calculateTrend(moods);
    const energyTrend = this.calculateTrend(energies);

    // Normalizar pesos
    const total = Math.abs(perfTrend) + Math.abs(moodTrend) + Math.abs(energyTrend) || 1;
    
    this.modelWeights = [
      Math.abs(perfTrend) / total,
      Math.abs(moodTrend) / total,
      Math.abs(energyTrend) / total
    ];
  }

  /**
   * Predice rendimiento futuro
   */
  predict(nextDays: number = 7): number[] {
    if (this.modelWeights.length === 0) {
      return Array(nextDays).fill(50);
    }

    const predictions: number[] = [];
    let lastValue = 50;

    for (let i = 0; i < nextDays; i++) {
      // Simulación simple con tendencia positiva
      const improvement = (this.modelWeights[0] * 2) + (Math.random() - 0.5) * 5;
      lastValue = Math.min(100, Math.max(0, lastValue + improvement));
      predictions.push(Math.round(lastValue));
    }

    return predictions;
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const firstHalf = values.slice(0, Math.floor(values.length / 2))
      .reduce((a, b) => a + b, 0) / Math.floor(values.length / 2);
    
    const secondHalf = values.slice(Math.floor(values.length / 2))
      .reduce((a, b) => a + b, 0) / (values.length - Math.floor(values.length / 2));

    return secondHalf - firstHalf;
  }
}

// ============================================
| 🔄 SISTEMA DE APRENDIZAJE CONTINUO
// ============================================

export class ContinuousLearningSystem {
  private recommendationEngine: AdaptiveRecommendationEngine;
  private sentimentAnalyzer: SentimentAnalyzer;
  private progressPredictor: ProgressPredictor;

  constructor() {
    this.recommendationEngine = new AdaptiveRecommendationEngine();
    this.sentimentAnalyzer = new SentimentAnalyzer();
    this.progressPredictor = new ProgressPredictor();
  }

  /**
   * Procesa feedback del usuario y ajusta recomendaciones
   */
  async processFeedback(
    userData: UserData,
    feedback: string,
    previousRecommendation: AIRecommendation
  ): Promise<{ adjustedRecommendation: AIRecommendation; insights: string[] }> {
    // Analizar sentimiento del feedback
    const sentiment = await this.sentimentAnalyzer.analyzeWithAPI(feedback);
    
    const insights: string[] = [];

    // Ajustar confianza basado en sentimiento
    let adjustedConfidence = previousRecommendation.confidence;
    
    if (sentiment.sentiment === 'negative' && sentiment.score < 0.3) {
      adjustedConfidence *= 0.7;
      insights.push('El usuario expresó insatisfacción. Reduciendo confianza en recomendación.');
    } else if (sentiment.sentiment === 'positive' && sentiment.score > 0.7) {
      adjustedConfidence = Math.min(1.0, adjustedConfidence * 1.1);
      insights.push('Feedback positivo detectado. Manteniendo estrategia actual.');
    }

    // Extraer keywords del feedback
    if (sentiment.keywords.length > 0) {
      insights.push(`Palabras clave detectadas: ${sentiment.keywords.join(', ')}`);
    }

    const adjustedRecommendation: AIRecommendation = {
      ...previousRecommendation,
      confidence: adjustedConfidence,
      reasoning: [...previousRecommendation.reasoning, ...insights]
    };

    return { adjustedRecommendation, insights };
  }

  /**
   * Genera reporte semanal de progreso con IA
   */
  generateWeeklyReport(userData: UserData): {
    summary: string;
    achievements: string[];
    areasForImprovement: string[];
    nextWeekGoals: string[];
    predictedProgress: number;
  } {
    // Entrenar predictor con historial
    this.progressPredictor.train(userData.progressHistory);

    // Predecir progreso
    const predictions = this.progressPredictor.predict(7);
    const avgPrediction = predictions.reduce((a, b) => a + b, 0) / predictions.length;

    // Analizar patrones
    const patterns = this.recommendationEngine.analyzeUserPatterns(userData);

    // Generar logros
    const achievements: string[] = [];
    const consistency = patterns.get('consistency') || 0;
    
    if (consistency > 0.8) {
      achievements.push('¡Excelente consistencia! Completaste más del 80% de tus workouts.');
    }
    if (patterns.get('exerciseImprovement') || 0 > 10) {
      achievements.push('Mejora significativa en rendimiento detectada.');
    }

    // Áreas de mejora
    const areasForImprovement: string[] = [];
    if (consistency < 0.5) {
      areasForImprovement.push('Aumentar frecuencia de entrenamiento');
    }
    if ((patterns.get('moodImpact') || 0) < 0.3) {
      areasForImprovement.push('Trabajar en mentalidad durante workouts difíciles');
    }

    // Metas para próxima semana
    const nextWeekGoals = [
      `Completar ${Math.ceil(consistency * 7 + 1)} sesiones de entrenamiento`,
      'Mejorar tiempo de recuperación entre ejercicios',
      'Mantener hidratación adecuada durante workouts'
    ];

    return {
      summary: `Esta semana mostraste ${consistency > 0.6 ? 'gran dedicación' : 'oportunidades de mejora'}. 
                Tu progreso general es ${avgPrediction > 60 ? 'positivo' : 'moderado'}.`,
      achievements,
      areasForImprovement,
      nextWeekGoals,
      predictedProgress: Math.round(avgPrediction)
    };
  }

  /**
   * Detecta anomalías en el patrón de entrenamiento
   */
  detectAnomalies(userData: UserData): Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
  }> {
    const anomalies: Array<any> = [];
    const history = userData.progressHistory;

    if (history.length < 5) return anomalies;

    // Detectar caída brusca de rendimiento
    const recentPerf = history.slice(-3).reduce((sum, h) => sum + h.performance, 0) / 3;
    const olderPerf = history.slice(-6, -3).reduce((sum, h) => sum + h.performance, 0) / 3;

    if (recentPerf < olderPerf * 0.7) {
      anomalies.push({
        type: 'performance_drop',
        severity: 'high',
        description: 'Caída significativa en rendimiento detectada',
        recommendation: 'Considera reducir intensidad o tomar días de descanso adicionales'
      });
    }

    // Detectar falta de consistencia
    const last7Days = history.slice(-7);
    const missedDays = last7Days.filter(h => !h.workoutCompleted).length;

    if (missedDays > 4) {
      anomalies.push({
        type: 'consistency_issue',
        severity: 'medium',
        description: 'Múltiples días sin entrenar detectados',
        recommendation: 'Establece recordatorios o reduce duración de sesiones'
      });
    }

    // Detectar energía consistentemente baja
    const avgEnergy = history.slice(-7).reduce((sum, h) => sum + h.energy, 0) / 7;
    if (avgEnergy < 4) {
      anomalies.push({
        type: 'low_energy',
        severity: 'high',
        description: 'Niveles de energía persistentemente bajos',
        recommendation: 'Evalúa nutrición, sueño y estrés. Considera consulta médica si persiste.'
      });
    }

    return anomalies;
  }
}

// ============================================
// 🚀 EXPORTS PRINCIPALES
// ============================================

export const aiEngine = {
  recommendations: new AdaptiveRecommendationEngine(),
  sentiment: new SentimentAnalyzer(),
  prediction: new ProgressPredictor(),
  learning: new ContinuousLearningSystem()
};

export default aiEngine;
