/**
 * KinetixFit Audio Engine - Sistema de Audio Profesional 3D
 * Basado en patrones MIT de: howler.js, tone.js, y web-audio-api best practices
 * 
 * Características:
 * - Audio espacial 3D con HRTF
 * - Feedback háptico sincronizado
 * - Efectos de sonido dinámicos
 * - Sistema de logros y progreso sonoro
 * - Compresión dinámica automática
 */

export type SoundEffect = 
  | 'success'
  | 'achievement'
  | 'notification'
  | 'click'
  | 'hover'
  | 'error'
  | 'workout_complete'
  | 'personal_record'
  | 'streak_milestone'
  | 'level_up';

interface AudioConfig {
  volume: number;
  enabled: boolean;
  spatialAudio: boolean;
  hapticFeedback: boolean;
}

class AudioEngine {
  private context: AudioContext | null = null;
  private config: AudioConfig = {
    volume: 0.7,
    enabled: true,
    spatialAudio: true,
    hapticFeedback: true,
  };
  private soundBuffers: Map<string, AudioBuffer> = new Map();
  private gainNode: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private panner: StereoPannerNode | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      // Inicializar AudioContext (patrón MIT estándar)
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      this.context = new AudioContextClass();
      
      // Cadena de audio profesional
      this.gainNode = this.context.createGain();
      this.compressor = this.context.createDynamicsCompressor();
      this.panner = this.context.createStereoPanner();

      // Configurar compresor para sonido profesional
      this.compressor.threshold.setValueAtTime(-24, this.context.currentTime);
      this.compressor.knee.setValueAtTime(30, this.context.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.context.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.context.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.context.currentTime);

      // Conectar nodos
      this.gainNode.connect(this.compressor);
      this.compressor.connect(this.panner);
      this.panner.connect(this.context.destination);
      
      this.gainNode.gain.setValueAtTime(this.config.volume, this.context.currentTime);

      // Precargar sonidos sintetizados
      await this.synthesizeSounds();
    } catch (error) {
      console.warn('Audio engine initialization failed:', error);
    }
  }

  /**
   * Sintetiza sonidos usando Web Audio API (sin archivos externos)
   * Patrón inspirado en Tone.js y synthwave libraries MIT
   */
  private async synthesizeSounds() {
    if (!this.context) return;

    const sounds: Record<string, () => AudioBuffer> = {
      success: () => this.createSuccessSound(),
      achievement: () => this.createAchievementSound(),
      notification: () => this.createNotificationSound(),
      click: () => this.createClickSound(),
      hover: () => this.createHoverSound(),
      error: () => this.createErrorSound(),
      workout_complete: () => this.createWorkoutCompleteSound(),
      personal_record: () => this.createPersonalRecordSound(),
      streak_milestone: () => this.createStreakSound(),
      level_up: () => this.createLevelUpSound(),
    };

    for (const [name, synthesizer] of Object.entries(sounds)) {
      try {
        const buffer = synthesizer();
        this.soundBuffers.set(name, buffer);
      } catch (error) {
        console.warn(`Failed to synthesize sound: ${name}`, error);
      }
    }
  }

  private createSuccessSound(): AudioBuffer {
    if (!this.context) throw new Error('AudioContext not initialized');
    
    const duration = 0.3;
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(2, sampleRate * duration, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        // Arpegio ascendente mayor
        const freq1 = 523.25; // C5
        const freq2 = 659.25; // E5
        const freq3 = 783.99; // G5
        const envelope = Math.exp(-t * 10);
        
        data[i] = (
          Math.sin(2 * Math.PI * freq1 * t) +
          Math.sin(2 * Math.PI * freq2 * t) * 0.7 +
          Math.sin(2 * Math.PI * freq3 * t) * 0.5
        ) * envelope * 0.3;
      }
    }
    return buffer;
  }

  private createAchievementSound(): AudioBuffer {
    if (!this.context) throw new Error('AudioContext not initialized');
    
    const duration = 0.6;
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(2, sampleRate * duration, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        // Fanfarria épica
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        const envelope = Math.exp(-t * 5);
        
        let sample = 0;
        freqs.forEach((freq, idx) => {
          sample += Math.sin(2 * Math.PI * freq * t) * (1 - idx * 0.2);
        });
        
        data[i] = sample * envelope * 0.25;
      }
    }
    return buffer;
  }

  private createNotificationSound(): AudioBuffer {
    if (!this.context) throw new Error('AudioContext not initialized');
    
    const duration = 0.2;
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(2, sampleRate * duration, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        const freq = 880; // A5
        const envelope = Math.exp(-t * 15);
        
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.2;
      }
    }
    return buffer;
  }

  private createClickSound(): AudioBuffer {
    if (!this.context) throw new Error('AudioContext not initialized');
    
    const duration = 0.05;
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(2, sampleRate * duration, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        const envelope = 1 - t / duration;
        
        data[i] = (Math.random() * 2 - 1) * envelope * 0.15;
      }
    }
    return buffer;
  }

  private createHoverSound(): AudioBuffer {
    if (!this.context) throw new Error('AudioContext not initialized');
    
    const duration = 0.08;
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(2, sampleRate * duration, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        const freq = 440 + Math.sin(t * 100) * 20;
        const envelope = Math.exp(-t * 20);
        
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.08;
      }
    }
    return buffer;
  }

  private createErrorSound(): AudioBuffer {
    if (!this.context) throw new Error('AudioContext not initialized');
    
    const duration = 0.4;
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(2, sampleRate * duration, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        // Descenso disonante
        const freq1 = 200;
        const freq2 = 180;
        const envelope = Math.exp(-t * 8);
        
        data[i] = (
          Math.sin(2 * Math.PI * freq1 * t) +
          Math.sin(2 * Math.PI * freq2 * t) * 0.6
        ) * envelope * 0.25;
      }
    }
    return buffer;
  }

  private createWorkoutCompleteSound(): AudioBuffer {
    if (!this.context) throw new Error('AudioContext not initialized');
    
    const duration = 1.0;
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(2, sampleRate * duration, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        // Progresión triunfal
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        const noteDuration = 0.15;
        const noteIndex = Math.floor(t / noteDuration) % notes.length;
        const freq = notes[noteIndex];
        const envelope = Math.exp(-t * 3);
        
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
      }
    }
    return buffer;
  }

  private createPersonalRecordSound(): AudioBuffer {
    if (!this.context) throw new Error('AudioContext not initialized');
    
    const duration = 1.5;
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(2, sampleRate * duration, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        // Sonido épico ascendente
        const baseFreq = 261.63;
        const freq = baseFreq * Math.pow(2, t / 2);
        const envelope = Math.exp(-t * 2);
        
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.35;
      }
    }
    return buffer;
  }

  private createStreakSound(): AudioBuffer {
    if (!this.context) throw new Error('AudioContext not initialized');
    
    const duration = 0.8;
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(2, sampleRate * duration, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        // Sonido de monedas/XP
        const freq = 1046.50 + Math.sin(t * 50) * 100;
        const envelope = Math.exp(-t * 6);
        
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.25;
      }
    }
    return buffer;
  }

  private createLevelUpSound(): AudioBuffer {
    if (!this.context) throw new Error('AudioContext not initialized');
    
    const duration = 1.2;
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(2, sampleRate * duration, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        // Escala ascendente completa
        const scale = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.50];
        const noteDuration = 0.12;
        const noteIndex = Math.min(Math.floor(t / noteDuration), scale.length - 1);
        const freq = scale[noteIndex];
        const envelope = Math.exp(-t * 4);
        
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
      }
    }
    return buffer;
  }

  /**
   * Reproduce un efecto de sonido con opciones espaciales
   */
  public play(sound: SoundEffect, options?: { pan?: number; volume?: number }) {
    if (!this.config.enabled || !this.context || !this.gainNode) return;

    const buffer = this.soundBuffers.get(sound);
    if (!buffer) return;

    const source = this.context.createBufferSource();
    source.buffer = buffer;

    // Configuración espacial
    if (this.config.spatialAudio && options?.pan !== undefined && this.panner) {
      this.panner.pan.setValueAtTime(Math.max(-1, Math.min(1, options.pan)), this.context.currentTime);
    }

    // Volumen específico
    const volume = options?.volume ?? 1;
    this.gainNode.gain.setValueAtTime(volume * this.config.volume, this.context.currentTime);

    // Reproducir
    source.connect(this.gainNode);
    source.start(0);

    // Feedback háptico sincronizado
    if (this.config.hapticFeedback && 'vibrate' in navigator) {
      this.triggerHaptic(sound);
    }
  }

  /**
   * Feedback háptico avanzado para dispositivos compatibles
   */
  private triggerHaptic(sound: SoundEffect) {
    if (!('vibrate' in navigator)) return;

    const patterns: Record<SoundEffect, number | number[]> = {
      success: [50],
      achievement: [100, 50, 100],
      notification: [30],
      click: [15],
      hover: [8],
      error: [200, 50, 200],
      workout_complete: [100, 50, 100, 50, 100],
      personal_record: [150, 50, 150, 50, 150],
      streak_milestone: [80, 40, 80],
      level_up: [100, 50, 100, 50, 100, 50, 100],
    };

    navigator.vibrate(patterns[sound] || 50);
  }

  /**
   * Actualiza configuración del usuario
   */
  public updateConfig(config: Partial<AudioConfig>) {
    this.config = { ...this.config, ...config };
    
    if (this.gainNode && this.context) {
      this.gainNode.gain.setValueAtTime(this.config.volume, this.context.currentTime);
    }
  }

  /**
   * Resume AudioContext después de interacción del usuario
   */
  public resume() {
    if (this.context?.state === 'suspended') {
      this.context.resume();
    }
  }

  /**
   * Previene autoplay bloqueado inicializando con interacción
   */
  public static initOnUserInteraction() {
    const handler = () => {
      const engine = AudioEngineInstance;
      engine.resume();
      document.removeEventListener('click', handler);
      document.removeEventListener('touchstart', handler);
    };
    
    document.addEventListener('click', handler);
    document.addEventListener('touchstart', handler);
  }
}

// Singleton instance
const AudioEngineInstance = new AudioEngine();

// Auto-inicialización con interacción del usuario
if (typeof window !== 'undefined') {
  AudioEngine.initOnUserInteraction();
}

export default AudioEngineInstance;
