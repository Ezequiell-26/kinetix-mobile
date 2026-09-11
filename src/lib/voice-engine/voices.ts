/**
 * voice-engine/voices.ts — registro de voces y manifiesto de la voz por defecto.
 * Nuevas grabaciones van a /audio/voices/ezequiel/<categoria>/<clave>.mp3
 * y se declaran acá. Otra voz = otro manifiesto, cero cambios de lógica.
 */
import type { VoiceManifest } from "./types";

const LEGACY = "/audio";

export const DEFAULT_VOICE: VoiceManifest = {
  id: "ezequiel",
  label: "Ezequiel",
  phrases: {
    "cuenta-regresiva": `${LEGACY}/narrador-cuenta-regresiva.mp3`,
    arranque: `${LEGACY}/narrador-arranque.mp3`,
    siguiente: `${LEGACY}/narrador-siguiente.mp3`,
    descanso: `${LEGACY}/narrador-descanso.mp3`,
    mitad: `${LEGACY}/narrador-mitad.mp3`,
    ultimo: `${LEGACY}/narrador-ultimo.mp3`,
    cierre: `${LEGACY}/narrador-cierre.mp3`,
    // Nuevas frases completas se agregan acá (p. ej. "serie-completada").
  },
  words: {},
  numbers: {},
  connectors: {},
  motivation: {
    "hiit-trabaja": `${LEGACY}/narrador-hiit-trabaja.mp3`,
    "hiit-descansa": `${LEGACY}/narrador-hiit-descansa.mp3`,
    "hiit-ultima": `${LEGACY}/narrador-hiit-ultima.mp3`,
    "hiit-fin": `${LEGACY}/narrador-hiit-fin.mp3`,
  },
  countdown: {},
  syllables: {},
};

export const RachaTrack = `${LEGACY}/narrador-racha.mp3`;
export const CheckinTrack = `${LEGACY}/narrador-checkin.mp3`;

export const VOICES: Record<string, VoiceManifest> = {
  ezequiel: DEFAULT_VOICE,
};

export function getVoice(id: string): VoiceManifest {
  return VOICES[id] ?? DEFAULT_VOICE;
}
