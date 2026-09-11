/**
 * voice-engine/voices.ts — registro de voces y manifiesto de la voz por defecto.
 * Nuevas grabaciones van a /audio/voices/ezequiel/<categoria>/<clave>.mp3
 * y se declaran acá. Otra voz = otro manifiesto, cero cambios de lógica.
 */
import type { VoiceManifest } from "./types";

const LEGACY = "/audio";
const V = "/audio/voices/ezequiel";

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
    "serie-completada": `${V}/phrases/serie-completada.mp3`,
    "ejercicio-completado": `${V}/phrases/ejercicio-completado.mp3`,
    "record-personal": `${V}/phrases/record-personal.mp3`,
    "ultimas-dos": `${V}/phrases/ultimas-dos.mp3`,
  },
  words: {
    serie: `${V}/words/serie.mp3`,
    repeticion: `${V}/words/repeticion.mp3`,
    repeticiones: `${V}/words/repeticiones.mp3`,
    descanso: `${V}/words/descanso.mp3`,
    descansa: `${V}/words/descansa.mp3`,
    quedan: `${V}/words/quedan.mp3`,
    segundo: `${V}/words/segundo.mp3`,
    segundos: `${V}/words/segundos.mp3`,
    kilo: `${V}/words/kilo.mp3`,
    kilos: `${V}/words/kilos.mp3`,
    minuto: `${V}/words/minuto.mp3`,
    minutos: `${V}/words/minutos.mp3`,
    ejercicio: `${V}/words/ejercicio.mp3`,
    ronda: `${V}/words/ronda.mp3`,
    peso: `${V}/words/peso.mp3`,
    tiempo: `${V}/words/tiempo.mp3`,
    marca: `${V}/words/marca.mp3`,
    trabajo: `${V}/words/trabajo.mp3`,
  },
  numbers: {},
  connectors: {
    de: `${V}/connectors/de.mp3`,
    y: `${V}/connectors/y.mp3`,
    con: `${V}/connectors/conn.mp3`,
    para: `${V}/connectors/para.mp3`,
    tu: `${V}/connectors/tu.mp3`,
    una: `${V}/connectors/una.mp3`,
    ultimas: `${V}/connectors/ultimas.mp3`,
    el: `${V}/connectors/el.mp3`,
    la: `${V}/connectors/la.mp3`,
    en: `${V}/connectors/en.mp3`,
    mas: `${V}/connectors/mas.mp3`,
  },
  motivation: {
    "hiit-trabaja": `${LEGACY}/narrador-hiit-trabaja.mp3`,
    "hiit-descansa": `${LEGACY}/narrador-hiit-descansa.mp3`,
    "hiit-ultima": `${LEGACY}/narrador-hiit-ultima.mp3`,
    "hiit-fin": `${LEGACY}/narrador-hiit-fin.mp3`,
    "vamos-suave": `${V}/motivation/vamos-suave.mp3`,
    "muy-bien": `${V}/motivation/muy-bien.mp3`,
    "buen-trabajo": `${V}/motivation/buen-trabajo.mp3`,
    "manten-ritmo": `${V}/motivation/manten-ritmo.mp3`,
    seguimos: `${V}/motivation/seguimos.mp3`,
    "vamos-fuerte": `${V}/motivation/vamos-fuerte.mp3`,
    "una-mas": `${V}/motivation/una-mas.mp3`,
    dale: `${V}/motivation/dale.mp3`,
    "no-aflojes": `${V}/motivation/no-aflojes.mp3`,
    ultima: `${V}/motivation/ultima.mp3`,
    "ultima-vamos": `${V}/motivation/ultima-vamos.mp3`,
  },
  countdown: {
    preparate: `${V}/countdown/preparate.mp3`,
    tiempo: `${V}/countdown/tiempo.mp3`,
  },
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
