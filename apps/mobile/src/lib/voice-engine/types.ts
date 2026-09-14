/**
 * voice-engine/types.ts — tipos del motor de voz. Sin DOM, testeable con tsx.
 */

export type VoicePriority = "CRITICAL" | "HIGH" | "NORMAL" | "LOW";

export type VoiceEventName =
  | "WORKOUT_STARTED"
  | "EXERCISE_STARTED"
  | "SET_STARTED"
  | "REP_COUNT"
  | "REP_MILESTONE"
  | "LAST_REPS"
  | "SET_COMPLETED"
  | "REST_STARTED"
  | "REST_WARNING"
  | "REST_COMPLETED"
  | "EXERCISE_COMPLETED"
  | "PERSONAL_RECORD"
  | "WORKOUT_COMPLETED"
  | "WORKOUT_PAUSED"
  | "WORKOUT_RESUMED";

export type VoiceEventData = Record<string, number | string | boolean | undefined>;

export interface VoiceEvent {
  event: VoiceEventName;
  priority?: VoicePriority;
  data?: VoiceEventData;
}

export type CountMode = "full" | "smart" | "off";
export type Intensity = "low" | "medium" | "high";
export type RestVerbosity = "full" | "standard" | "minimal";

export interface VoiceSettings {
  enabled: boolean;
  volume: number;
  intensity: Intensity;
  countMode: CountMode;
  motivation: boolean;
  restAlerts: boolean;
  restVerbosity: RestVerbosity;
  voiceId: string;
}

export const DEFAULT_SETTINGS: VoiceSettings = {
  enabled: true,
  volume: 1,
  intensity: "medium",
  countMode: "smart",
  motivation: true,
  restAlerts: true,
  restVerbosity: "standard",
  voiceId: "ezequiel",
};

/** Unidad mínima reproducible. */
export type VoiceToken =
  | { kind: "file"; src: string; label: string }
  | { kind: "tts"; text: string }
  | { kind: "silence"; ms: number };

export interface PlannedPhrase {
  /** Texto legible (para el laboratorio y debug). */
  text: string;
  tokens: VoiceToken[];
  /** Archivos en orden (para el laboratorio). */
  files: string[];
  /** Claves sin audio (para saber qué grabar). */
  missing: string[];
  cached: boolean;
}

/** Manifiesto de una voz. La lógica nunca depende del id: multi-voice ready. */
export interface VoiceManifest {
  id: string;
  label: string;
  phrases: Record<string, string>;
  words: Record<string, string>;
  numbers: Record<string, string>;
  connectors: Record<string, string>;
  motivation: Record<string, string>;
  countdown: Record<string, string>;
  syllables: Record<string, string>;
}
