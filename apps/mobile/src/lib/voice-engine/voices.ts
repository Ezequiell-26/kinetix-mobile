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
  numbers: {
    // Números básicos 0-29
    cero: `${V}/numbers/cero.mp3`,
    uno: `${V}/numbers/uno.mp3`,
    dos: `${V}/numbers/dos.mp3`,
    tres: `${V}/numbers/tres.mp3`,
    cuatro: `${V}/numbers/cuatro.mp3`,
    cinco: `${V}/numbers/cinco.mp3`,
    seis: `${V}/numbers/seis.mp3`,
    siete: `${V}/numbers/siete.mp3`,
    ocho: `${V}/numbers/ocho.mp3`,
    nueve: `${V}/numbers/nueve.mp3`,
    diez: `${V}/numbers/diez.mp3`,
    once: `${V}/numbers/once.mp3`,
    doce: `${V}/numbers/doce.mp3`,
    trece: `${V}/numbers/trece.mp3`,
    catorce: `${V}/numbers/catorce.mp3`,
    quince: `${V}/numbers/quince.mp3`,
    dieciseis: `${V}/numbers/dieciseis.mp3`,
    diecisiete: `${V}/numbers/diecisiete.mp3`,
    dieciocho: `${V}/numbers/dieciocho.mp3`,
    diecinueve: `${V}/numbers/diecinueve.mp3`,
    veinte: `${V}/numbers/veinte.mp3`,
    veintiuno: `${V}/numbers/veintiuno.mp3`,
    veintidos: `${V}/numbers/veintidos.mp3`,
    veintitres: `${V}/numbers/veintitres.mp3`,
    veinticuatro: `${V}/numbers/veinticuatro.mp3`,
    veinticinco: `${V}/numbers/veinticinco.mp3`,
    veintiseis: `${V}/numbers/veintiseis.mp3`,
    veintisiete: `${V}/numbers/veintisiete.mp3`,
    veintiocho: `${V}/numbers/veintiocho.mp3`,
    veintinueve: `${V}/numbers/veintinueve.mp3`,
    // Decenas 30-90
    treinta: `${V}/numbers/treinta.mp3`,
    cuarenta: `${V}/numbers/cuarenta.mp3`,
    cincuenta: `${V}/numbers/cincuenta.mp3`,
    sesenta: `${V}/numbers/sesenta.mp3`,
    setenta: `${V}/numbers/setenta.mp3`,
    ochenta: `${V}/numbers/ochenta.mp3`,
    noventa: `${V}/numbers/noventa.mp3`,
    // Especiales
    cien: `${V}/numbers/cien.mp3`,
    coma: `${V}/numbers/coma.mp3`,
  },
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
