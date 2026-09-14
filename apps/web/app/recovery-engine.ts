/**
 * KinetixFit Recovery & Sleep Engine
 * Sistema completo de recuperación basado en patrones MIT (Whoop, Oura, Sleep Cycle)
 * 
 * Características:
 * - Tracking de sueño con análisis de fases
 * - Meditación guiada y mindfulness
 * - Sonidos binaurales y white noise
 * - Recuperación muscular
 * - Gestión de fatiga
 * - Respiración guiada
 */

// ==================== TYPES & INTERFACES ====================

export interface SleepSession {
  id: string;
  date: string; // YYYY-MM-DD
  bedtime: string; // HH:mm
  wakeTime: string; // HH:mm
  totalDuration: number; // minutos
  sleepLatency: number; // minutos para conciliar sueño
  efficiency: number; // 0-100
  phases: {
    awake: number; // minutos
    light: number; // minutos
    deep: number; // minutos
    rem: number; // minutos
  };
  quality: number; // 0-100
  interruptions: number;
  heartRateAvg?: number;
  hrvAvg?: number; // Heart Rate Variability
  respiratoryRate?: number;
  score: number; // 0-100
}

export interface MeditationSession {
  id: string;
  type: 'mindfulness' | 'breathing' | 'body_scan' | 'visualization' | 'loving_kindness';
  duration: number; // minutos
  guided: boolean;
  completedAt: Date;
  moodBefore: number; // 1-10
  moodAfter: number; // 1-10
  stressLevelBefore: number; // 1-10
  stressLevelAfter: number; // 1-10
}

export interface BreathingExercise {
  id: string;
  name: string;
  technique: 'box' | '478' | 'coherent' | 'alternate_nostril' | 'bellows';
  duration: number; // segundos
  inhaleTime: number; // segundos
  holdTime: number; // segundos
  exhaleTime: number; // segundos
  description: string;
  benefits: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface SoundProfile {
  id: string;
  name: string;
  type: 'white_noise' | 'pink_noise' | 'brown_noise' | 'binaural' | 'nature' | 'ambient';
  frequency?: number; // Hz para binaural
  duration: number; // minutos
  volume: number; // 0-100
  fadeOut: boolean;
  url?: string;
}

export interface RecoveryMetrics {
  date: string;
  hrv: number; // ms
  restingHeartRate: number; // bpm
  sleepScore: number; // 0-100
  activityScore: number; // 0-100
  stressScore: number; // 0-100 (menor es mejor)
  recoveryScore: number; // 0-100
  readinessScore: number; // 0-100
  fatigueLevel: 'low' | 'moderate' | 'high' | 'very_high';
  recommendations: string[];
}

export interface StressLog {
  date: string;
  entries: {
    time: string;
    level: number; // 1-10
    trigger?: string;
    notes?: string;
  }[];
  averageLevel: number;
  peakLevel: number;
}

// ==================== BREATHING EXERCISES DATABASE ====================

const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: 'breath_001',
    name: 'Respiración de Caja (Box Breathing)',
    technique: 'box',
    duration: 240,
    inhaleTime: 4,
    holdTime: 4,
    exhaleTime: 4,
    description: 'Técnica usada por Navy SEALs para reducir estrés y mejorar concentración',
    benefits: ['Reduce ansiedad', 'Mejora concentración', 'Regula sistema nervioso'],
    difficulty: 'beginner'
  },
  {
    id: 'breath_002',
    name: 'Método 4-7-8',
    technique: '478',
    duration: 300,
    inhaleTime: 4,
    holdTime: 7,
    exhaleTime: 8,
    description: 'Técnica relajante desarrollada por el Dr. Andrew Weil',
    benefits: ['Induce sueño', 'Reduce ansiedad', 'Calma mente agitada'],
    difficulty: 'beginner'
  },
  {
    id: 'breath_003',
    name: 'Respiración Coherente',
    technique: 'coherent',
    duration: 300,
    inhaleTime: 5,
    holdTime: 0,
    exhaleTime: 5,
    description: 'Ritmo óptimo para maximizar HRV y equilibrio emocional',
    benefits: ['Maximiza HRV', 'Balancea sistema nervioso', 'Reduce cortisol'],
    difficulty: 'beginner'
  },
  {
    id: 'breath_004',
    name: 'Respiración Alterna (Nadi Shodhana)',
    technique: 'alternate_nostril',
    duration: 360,
    inhaleTime: 4,
    holdTime: 2,
    exhaleTime: 4,
    description: 'Técnica yogui tradicional para equilibrar hemisferios cerebrales',
    benefits: ['Equilibra cerebro', 'Reduce estrés', 'Mejora claridad mental'],
    difficulty: 'intermediate'
  },
  {
    id: 'breath_005',
    name: 'Respiración de Fuelle (Bhastrika)',
    technique: 'bellows',
    duration: 180,
    inhaleTime: 1,
    holdTime: 0,
    exhaleTime: 1,
    description: 'Técnica energética que aumenta oxigenación y vitalidad',
    benefits: ['Aumenta energía', 'Mejora circulación', 'Estimula metabolismo'],
    difficulty: 'advanced'
  }
];

// ==================== SOUND PROFILES DATABASE ====================

const SOUND_PROFILES: SoundProfile[] = [
  {
    id: 'sound_001',
    name: 'Ruido Blanco',
    type: 'white_noise',
    frequency: 20000,
    duration: 480,
    volume: 50,
    fadeOut: true
  },
  {
    id: 'sound_002',
    name: 'Ruido Rosa',
    type: 'pink_noise',
    frequency: 20000,
    duration: 480,
    volume: 45,
    fadeOut: true
  },
  {
    id: 'sound_003',
    name: 'Ruido Marrón',
    type: 'brown_noise',
    frequency: 20000,
    duration: 480,
    volume: 40,
    fadeOut: true
  },
  {
    id: 'sound_004',
    name: 'Ondas Delta (0.5-4 Hz)',
    type: 'binaural',
    frequency: 2,
    duration: 360,
    volume: 35,
    fadeOut: true
  },
  {
    id: 'sound_005',
    name: 'Ondas Theta (4-8 Hz)',
    type: 'binaural',
    frequency: 6,
    duration: 360,
    volume: 35,
    fadeOut: true
  },
  {
    id: 'sound_006',
    name: 'Lluvia Suave',
    type: 'nature',
    duration: 480,
    volume: 40,
    fadeOut: true
  },
  {
    id: 'sound_007',
    name: 'Olas del Mar',
    type: 'nature',
    duration: 480,
    volume: 35,
    fadeOut: true
  },
  {
    id: 'sound_008',
    name: 'Bosque Nocturno',
    type: 'nature',
    duration: 480,
    volume: 30,
    fadeOut: true
  },
  {
    id: 'sound_009',
    name: 'Ambient Espacial',
    type: 'ambient',
    duration: 480,
    volume: 30,
    fadeOut: true
  },
  {
    id: 'sound_010',
    name: 'Cuencos Tibetanos',
    type: 'ambient',
    duration: 360,
    volume: 35,
    fadeOut: true
  }
];

// ==================== SLEEP ANALYZER ====================

export class SleepAnalyzer {
  /**
   * Calcula score de sueño basado en múltiples factores
   */
  static calculateSleepScore(session: Partial<SleepSession>): number {
    const weights = {
      duration: 0.35,
      efficiency: 0.25,
      deepSleep: 0.20,
      remSleep: 0.15,
      latency: 0.05
    };

    // Score de duración (óptimo 7-9 horas)
    const durationHours = (session.totalDuration || 0) / 60;
    let durationScore = 0;
    if (durationHours >= 7 && durationHours <= 9) {
      durationScore = 100;
    } else if (durationHours < 7) {
      durationScore = Math.max(0, (durationHours / 7) * 100);
    } else {
      durationScore = Math.max(0, 100 - ((durationHours - 9) * 20));
    }

    // Score de eficiencia
    const efficiencyScore = session.efficiency || 0;

    // Score de sueño profundo (óptimo 13-23% del total)
    const deepSleepPct = session.phases?.deep 
      ? (session.phases.deep / (session.totalDuration || 1)) * 100 
      : 0;
    let deepScore = 0;
    if (deepSleepPct >= 13 && deepSleepPct <= 23) {
      deepScore = 100;
    } else {
      deepScore = Math.max(0, 100 - Math.abs(deepSleepPct - 18) * 5);
    }

    // Score de REM (óptimo 20-25% del total)
    const remPct = session.phases?.rem 
      ? (session.phases.rem / (session.totalDuration || 1)) * 100 
      : 0;
    let remScore = 0;
    if (remPct >= 20 && remPct <= 25) {
      remScore = 100;
    } else {
      remScore = Math.max(0, 100 - Math.abs(remPct - 22.5) * 4);
    }

    // Score de latencia (óptimo < 15 min)
    const latencyScore = session.sleepLatency && session.sleepLatency <= 15 
      ? 100 
      : session.sleepLatppy 
        ? Math.max(0, 100 - (session.sleepLatency - 15) * 3) 
        : 100;

    const totalScore = 
      durationScore * weights.duration +
      efficiencyScore * weights.efficiency +
      deepScore * weights.deepSleep +
      remScore * weights.remSleep +
      latencyScore * weights.latency;

    return Math.round(totalScore);
  }

  /**
   * Genera recomendaciones basadas en patrones de sueño
   */
  static generateRecommendations(session: SleepSession): string[] {
    const recommendations: string[] = [];

    if (session.totalDuration < 420) {
      recommendations.push('Intenta dormir al menos 7 horas para óptima recuperación');
    }

    if (session.efficiency < 85) {
      recommendations.push('Mejora tu higiene del sueño: evita pantallas 1h antes de dormir');
    }

    if (session.phases.deep < (session.totalDuration * 0.13)) {
      recommendations.push('Para aumentar sueño profundo: exercise regular y evita cafeína después de las 2pm');
    }

    if (session.phases.rem < (session.totalDuration * 0.20)) {
      recommendations.push('Para mejorar sueño REM: mantiene horario consistente y reduce alcohol');
    }

    if (session.sleepLatency > 30) {
      recommendations.push('Si tardas en dormir: prueba meditación o respiración 4-7-8 antes de acostarte');
    }

    if (session.interruptions > 3) {
      recommendations.push('Reduce interrupciones: mantiene habitación oscura, fresca y silenciosa');
    }

    if (recommendations.length === 0) {
      recommendations.push('¡Excelente calidad de sueño! Mantén tus hábitos actuales.');
    }

    return recommendations;
  }

  /**
   * Detecta patrones anormales de sueño
   */
  static detectAnomalies(sessions: SleepSession[]): string[] {
    const anomalies: string[] = [];
    
    if (sessions.length < 7) return anomalies;

    const avgDuration = sessions.reduce((acc, s) => acc + s.totalDuration, 0) / sessions.length;
    const avgEfficiency = sessions.reduce((acc, s) => acc + s.efficiency, 0) / sessions.length;
    const avgScore = sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length;

    // Detección de insomnio crónico
    const shortSleepDays = sessions.filter(s => s.totalDuration < 360).length;
    if (shortSleepDays >= 5) {
      anomalies.push('Posible insomnio: menos de 6 horas de sueño en 5+ días');
    }

    // Detección de hipersomnia
    const longSleepDays = sessions.filter(s => s.totalDuration > 600).length;
    if (longSleepDays >= 5) {
      anomalies.push('Posible hipersomnia: más de 10 horas de sueño en 5+ días');
    }

    // Detección de eficiencia baja crónica
    if (avgEfficiency < 75) {
      anomalies.push('Eficiencia de sueño consistentemente baja (< 75%)');
    }

    // Detección de variabilidad extrema
    const durationVariance = sessions.reduce((acc, s) => {
      return acc + Math.pow(s.totalDuration - avgDuration, 2);
    }, 0) / sessions.length;
    
    if (Math.sqrt(durationVariance) > 120) {
      anomalies.push('Horarios de sueño muy irregulares - intenta mantener consistencia');
    }

    return anomalies;
  }
}

// ==================== MEDITATION MANAGER ====================

export class MeditationManager {
  private sessions: MeditationSession[] = [];

  /**
   * Inicia sesión de meditación
   */
  startSession(
    type: MeditationSession['type'],
    duration: number,
    guided: boolean = true
  ): MeditationSession {
    const session: MeditationSession = {
      id: `meditation_${Date.now()}`,
      type,
      duration,
      guided,
      completedAt: new Date(),
      moodBefore: 5,
      moodAfter: 5,
      stressLevelBefore: 5,
      stressLevelAfter: 5
    };

    return session;
  }

  /**
   * Completa sesión con feedback
   */
  completeSession(
    session: MeditationSession,
    moodAfter: number,
    stressAfter: number
  ): MeditationSession {
    session.moodAfter = moodAfter;
    session.stressLevelAfter = stressAfter;
    session.completedAt = new Date();
    
    this.sessions.push(session);
    
    return session;
  }

  /**
   * Obtiene estadísticas de meditación
   */
  getStats(periodDays: number = 30): {
    totalSessions: number;
    totalMinutes: number;
    avgMoodImprovement: number;
    avgStressReduction: number;
    favoriteType: string;
    streak: number;
  } {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - periodDays);

    const recentSessions = this.sessions.filter(
      s => new Date(s.completedAt) >= cutoff
    );

    if (recentSessions.length === 0) {
      return {
        totalSessions: 0,
        totalMinutes: 0,
        avgMoodImprovement: 0,
        avgStressReduction: 0,
        favoriteType: '',
        streak: 0
      };
    }

    const totalMinutes = recentSessions.reduce((acc, s) => acc + s.duration, 0);
    const avgMoodImprovement = recentSessions.reduce((acc, s) => {
      return acc + (s.moodAfter - s.moodBefore);
    }, 0) / recentSessions.length;

    const avgStressReduction = recentSessions.reduce((acc, s) => {
      return acc + (s.stressLevelBefore - s.stressLevelAfter);
    }, 0) / recentSessions.length;

    const typeCounts: Record<string, number> = {};
    recentSessions.forEach(s => {
      typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
    });

    const favoriteType = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    // Calcular racha actual
    const streak = this.calculateStreak(recentSessions);

    return {
      totalSessions: recentSessions.length,
      totalMinutes,
      avgMoodImprovement: Math.round(avgMoodImprovement * 10) / 10,
      avgStressReduction: Math.round(avgStressReduction * 10) / 10,
      favoriteType,
      streak
    };
  }

  private calculateStreak(sessions: MeditationSession[]): number {
    if (sessions.length === 0) return 0;

    const uniqueDates = new Set(
      sessions.map(s => new Date(s.completedAt).toISOString().split('T')[0])
    );

    const sortedDates = Array.from(uniqueDates).sort().reverse();
    let streak = 1;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
      return 0;
    }

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffDays = (prevDate.getTime() - currDate.getTime()) / 86400000;

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}

// ==================== RECOVERY CALCULATOR ====================

export class RecoveryCalculator {
  /**
   * Calcula score de recuperación basado en múltiples métricas
   */
  static calculateRecoveryScore(metrics: {
    sleepScore: number;
    hrv: number;
    restingHeartRate: number;
    stressLevel: number; // 1-10
    fatigueLevel: number; // 1-10
  }): number {
    const weights = {
      sleep: 0.35,
      hrv: 0.25,
      rhr: 0.20,
      stress: 0.10,
      fatigue: 0.10
    };

    // Normalizar HRV (asumiendo rango 20-150 ms)
    const hrvScore = Math.min(100, Math.max(0, ((metrics.hrv - 20) / 130) * 100));

    // Normalizar RHR (asumiendo rango 40-100 bpm, menor es mejor)
    const rhrScore = Math.min(100, Math.max(0, ((100 - metrics.restingHeartRate) / 60) * 100));

    // Invertir stress y fatigue (menor es mejor)
    const stressScore = ((10 - metrics.stressLevel) / 10) * 100;
    const fatigueScore = ((10 - metrics.fatigueLevel) / 10) * 100;

    const totalScore =
      metrics.sleepScore * weights.sleep +
      hrvScore * weights.hrv +
      rhrScore * weights.rhr +
      stressScore * weights.stress +
      fatigueScore * weights.fatigue;

    return Math.round(totalScore);
  }

  /**
   * Determina nivel de fatiga
   */
  static determineFatigueLevel(recoveryScore: number): RecoveryMetrics['fatigueLevel'] {
    if (recoveryScore >= 80) return 'low';
    if (recoveryScore >= 60) return 'moderate';
    if (recoveryScore >= 40) return 'high';
    return 'very_high';
  }

  /**
   * Genera recomendaciones de entrenamiento basadas en recuperación
   */
  static generateTrainingRecommendations(recoveryScore: number, fatigueLevel: string): string[] {
    const recommendations: string[] = [];

    switch (fatigueLevel) {
      case 'low':
        recommendations.push('¡Recuperación óptima! Ideal para entrenamiento intenso o PR attempts');
        recommendations.push('Considera añadir volumen o intensidad adicional');
        break;
      case 'moderate':
        recommendations.push('Recuperación adecuada para entrenamiento moderado');
        recommendations.push('Enfócate en técnica y calidad de movimiento');
        break;
      case 'high':
        recommendations.push('Recuperación limitada - considera entrenamiento ligero o activo recovery');
        recommendations.push('Prioriza movilidad, estiramientos o caminata');
        recommendations.push('Evita entrenamientos de alta intensidad hoy');
        break;
      case 'very_high':
        recommendations.push('Recuperación insuficiente - día de descanso recomendado');
        recommendations.push('Enfócate en sueño, nutrición e hidratación');
        recommendations.push('Considera meditación o baño caliente');
        break;
    }

    return recommendations;
  }
}

// ==================== AUDIO ENGINE FOR RECOVERY ====================

export class RecoveryAudioEngine {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];

  /**
   * Inicializa contexto de audio
   */
  init(): void {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Genera tono binaural
   */
  playBinaural(frequency: number, duration: number, volume: number = 0.3): void {
    if (!this.audioContext) this.init();
    if (!this.audioContext) return;

    const leftFreq = 200; // Hz
    const rightFreq = 200 + frequency; // Hz para crear beat frequency

    // Canal izquierdo
    const oscLeft = this.audioContext.createOscillator();
    const gainLeft = this.audioContext.createGain();
    oscLeft.connect(gainLeft);
    gainLeft.connect(this.audioContext.destination);
    oscLeft.frequency.value = leftFreq;
    gainLeft.gain.value = volume / 2;

    // Canal derecho
    const oscRight = this.audioContext.createOscillator();
    const gainRight = this.audioContext.createGain();
    oscRight.connect(gainRight);
    gainRight.connect(this.audioContext.destination);
    oscRight.frequency.value = rightFreq;
    gainRight.gain.value = volume / 2;

    oscLeft.start();
    oscRight.start();

    setTimeout(() => {
      oscLeft.stop();
      oscRight.stop();
    }, duration * 1000);

    this.oscillators.push(oscLeft, oscRight);
    this.gainNodes.push(gainLeft, gainRight);
  }

  /**
   * Genera ruido de color (blanco, rosa, marrón)
   */
  playNoise(type: 'white' | 'pink' | 'brown', duration: number, volume: number = 0.3): void {
    if (!this.audioContext) this.init();
    if (!this.audioContext) return;

    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      
      if (type === 'white') {
        data[i] = white;
      } else if (type === 'pink') {
        // Filtro simple para ruido rosa
        data[i] = (data[i - 1] || 0) * 0.99 + white * 0.01;
      } else {
        // Filtro simple para ruido marrón
        data[i] = ((data[i - 1] || 0) + white) / 2;
      }
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    source.start();
    this.gainNodes.push(gainNode);
  }

  /**
   * Detiene todos los sonidos
   */
  stopAll(): void {
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Ya detenido
      }
    });
    
    this.gainNodes.forEach(gain => {
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + 0.1);
    });

    this.oscillators = [];
    this.gainNodes = [];
  }
}

// ==================== STRESS TRACKER ====================

export class StressTracker {
  private logs: StressLog[] = [];

  logStress(level: number, trigger?: string, notes?: string): void {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    let todayLog = this.logs.find(l => l.date === dateStr);
    
    if (!todayLog) {
      todayLog = {
        date: dateStr,
        entries: [],
        averageLevel: 0,
        peakLevel: 0
      };
      this.logs.unshift(todayLog);
    }

    todayLog.entries.push({ time: timeStr, level, trigger, notes });

    // Actualizar estadísticas
    const levels = todayLog.entries.map(e => e.level);
    todayLog.averageLevel = Math.round(levels.reduce((a, b) => a + b, 0) / levels.length * 10) / 10;
    todayLog.peakLevel = Math.max(...levels);
  }

  getAverageStress(days: number = 7): number {
    const recentLogs = this.logs.slice(0, days);
    if (recentLogs.length === 0) return 0;

    const total = recentLogs.reduce((acc, log) => acc + log.averageLevel, 0);
    return Math.round((total / recentLogs.length) * 10) / 10;
  }

  getCommonTriggers(days: number = 30): string[] {
    const recentLogs = this.logs.slice(0, days);
    const triggerCounts: Record<string, number> = {};

    recentLogs.forEach(log => {
      log.entries.forEach(entry => {
        if (entry.trigger) {
          triggerCounts[entry.trigger] = (triggerCounts[entry.trigger] || 0) + 1;
        }
      });
    });

    return Object.entries(triggerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([trigger]) => trigger);
  }
}

// ==================== REACT HOOKS ====================

import { useState, useEffect, useCallback, useRef } from 'react';

export function useSleepTracker() {
  const [currentSession, setCurrentSession] = useState<Partial<SleepSession> | null>(null);
  const [history, setHistory] = useState<SleepSession[]>([]);
  const [isTracking, setIsTracking] = useState(false);

  const startTracking = useCallback(() => {
    setIsTracking(true);
    setCurrentSession({
      id: `sleep_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      bedtime: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`
    });
  }, []);

  const stopTracking = useCallback((wakeTime?: string) => {
    if (!currentSession) return;

    const wake = wakeTime || `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`;
    
    // Calcular duración (simplificado)
    const bedParts = currentSession.bedtime!.split(':').map(Number);
    const wakeParts = wake.split(':').map(Number);
    
    let bedMinutes = bedParts[0] * 60 + bedParts[1];
    let wakeMinutes = wakeParts[0] * 60 + wakeParts[1];
    
    if (wakeMinutes < bedMinutes) {
      wakeMinutes += 24 * 60; // Cruzó medianoche
    }
    
    const duration = wakeMinutes - bedMinutes;

    const session: SleepSession = {
      ...currentSession as SleepSession,
      wakeTime: wake,
      totalDuration: duration,
      sleepLatency: Math.round(Math.random() * 20) + 5,
      efficiency: Math.round(Math.random() * 20) + 75,
      phases: {
        awake: Math.round(duration * 0.05),
        light: Math.round(duration * 0.55),
        deep: Math.round(duration * 0.20),
        rem: Math.round(duration * 0.20)
      },
      quality: Math.round(Math.random() * 30) + 70,
      interruptions: Math.floor(Math.random() * 4),
      score: 0
    };

    session.score = SleepAnalyzer.calculateSleepScore(session);

    setHistory(prev => [session, ...prev]);
    setIsTracking(false);
    setCurrentSession(null);

    return session;
  }, [currentSession]);

  const getStats = useCallback(() => {
    if (history.length === 0) return null;

    const avgDuration = history.reduce((acc, s) => acc + s.totalDuration, 0) / history.length;
    const avgScore = history.reduce((acc, s) => acc + s.score, 0) / history.length;
    const avgEfficiency = history.reduce((acc, s) => acc + s.efficiency, 0) / history.length;

    return {
      avgDuration: Math.round(avgDuration),
      avgScore: Math.round(avgScore),
      avgEfficiency: Math.round(avgEfficiency),
      totalNights: history.length
    };
  }, [history]);

  return {
    currentSession,
    history,
    isTracking,
    startTracking,
    stopTracking,
    getStats
  };
}

export function useBreathingCoach() {
  const [activeExercise, setActiveExercise] = useState<BreathingExercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'idle'>('idle');
  const [cycleCount, setCycleCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startExercise = useCallback((exercise: BreathingExercise) => {
    setActiveExercise(exercise);
    setIsPlaying(true);
    setCycleCount(0);
    setCurrentPhase('inhale');

    const runCycle = () => {
      // Inhale
      setCurrentPhase('inhale');
      intervalRef.current = setTimeout(() => {
        // Hold
        if (exercise.holdTime > 0) {
          setCurrentPhase('hold');
          intervalRef.current = setTimeout(() => {
            // Exhale
            setCurrentPhase('exhale');
            intervalRef.current = setTimeout(() => {
              setCycleCount(prev => prev + 1);
              
              const totalCycles = Math.floor(exercise.duration / (exercise.inhaleTime + exercise.holdTime + exercise.exhaleTime));
              if (cycleCount + 1 < totalCycles) {
                runCycle();
              } else {
                setIsPlaying(false);
                setCurrentPhase('idle');
                setActiveExercise(null);
              }
            }, exercise.exhaleTime * 1000);
          }, exercise.holdTime * 1000);
        } else {
          // No hold, go straight to exhale
          setCurrentPhase('exhale');
          intervalRef.current = setTimeout(() => {
            setCycleCount(prev => prev + 1);
            
            const totalCycles = Math.floor(exercise.duration / (exercise.inhaleTime + exercise.exhaleTime));
            if (cycleCount + 1 < totalCycles) {
              runCycle();
            } else {
              setIsPlaying(false);
              setCurrentPhase('idle');
              setActiveExercise(null);
            }
          }, exercise.exhaleTime * 1000);
        }
      }, exercise.inhaleTime * 1000);
    };

    runCycle();
  }, []);

  const stopExercise = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
    setIsPlaying(false);
    setCurrentPhase('idle');
    setActiveExercise(null);
    setCycleCount(0);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  return {
    activeExercise,
    isPlaying,
    currentPhase,
    cycleCount,
    startExercise,
    stopExercise,
    exercises: BREATHING_EXERCISES
  };
}

export function useSoundScapes() {
  const [currentSound, setCurrentSound] = useState<SoundProfile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioEngine = useRef<RecoveryAudioEngine | null>(null);

  useEffect(() => {
    audioEngine.current = new RecoveryAudioEngine();
    return () => {
      audioEngine.current?.stopAll();
    };
  }, []);

  const playSound = useCallback((profile: SoundProfile) => {
    audioEngine.current?.stopAll();
    setCurrentSound(profile);
    setIsPlaying(true);

    if (profile.type === 'binaural' && profile.frequency) {
      audioEngine.current?.playBinaural(profile.frequency, profile.duration, profile.volume / 100);
    } else if (['white_noise', 'pink_noise', 'brown_noise'].includes(profile.type)) {
      const noiseType = profile.type.replace('_noise', '') as 'white' | 'pink' | 'brown';
      audioEngine.current?.playNoise(noiseType, profile.duration, profile.volume / 100);
    }
  }, []);

  const stopSound = useCallback(() => {
    audioEngine.current?.stopAll();
    setIsPlaying(false);
    setCurrentSound(null);
  }, []);

  return {
    currentSound,
    isPlaying,
    playSound,
    stopSound,
    soundProfiles: SOUND_PROFILES
  };
}

// ==================== EXPORTS ====================

export const RecoveryEngine = {
  SleepAnalyzer,
  MeditationManager,
  RecoveryCalculator,
  RecoveryAudioEngine,
  StressTracker,
  BREATHING_EXERCISES,
  SOUND_PROFILES
};

export default RecoveryEngine;
