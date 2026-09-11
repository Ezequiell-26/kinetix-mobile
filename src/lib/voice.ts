/**
 * voice.ts — motor de voz del entreno.
 * - Narrador real (MP3 del usuario) en cada momento clave del entreno.
 * - Web Speech API (es-AR) solo para frases dinámicas (nombres de ejercicios).
 * - Preferencia persistida en localStorage ("ec-voice").
 * - Todo falla en silencio: sin voz nunca se rompe el entreno.
 */

export const NARRATOR_COUNTDOWN_SRC = "/audio/narrador-cuenta-regresiva.mp3";

export const TRACKS = {
  arranque: "/audio/narrador-arranque.mp3",
  siguiente: "/audio/narrador-siguiente.mp3",
  descanso: "/audio/narrador-descanso.mp3",
  mitad: "/audio/narrador-mitad.mp3",
  ultimo: "/audio/narrador-ultimo.mp3",
  cierre: "/audio/narrador-cierre.mp3",
  hiitTrabaja: "/audio/narrador-hiit-trabaja.mp3",
  hiitDescansa: "/audio/narrador-hiit-descansa.mp3",
  hiitUltima: "/audio/narrador-hiit-ultima.mp3",
  hiitFin: "/audio/narrador-hiit-fin.mp3",
  racha: "/audio/narrador-racha.mp3",
  checkin: "/audio/narrador-checkin.mp3",
} as const;

export type TrackName = keyof typeof TRACKS;

const VOICE_KEY = "ec-voice";

let audioEl: HTMLAudioElement | null = null;

function ensureAudio(): HTMLAudioElement | null {
  try {
    if (typeof window === "undefined") return null;
    if (!audioEl) {
      audioEl = new Audio();
      audioEl.preload = "auto";
    }
    return audioEl;
  } catch {
    return null;
  }
}

export function isVoiceEnabled(): boolean {
  try {
    return localStorage.getItem(VOICE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setVoiceEnabled(on: boolean): void {
  try {
    localStorage.setItem(VOICE_KEY, on ? "on" : "off");
  } catch {}
}

function playSrc(src: string): void {
  const el = ensureAudio();
  if (!el) return;
  try {
    el.pause();
    el.src = src;
    el.currentTime = 0;
    void el.play().catch(() => {});
  } catch {}
}

/** Reproduce una pista del narrador (corta la anterior si sonaba). */
export function playTrack(name: TrackName): void {
  try {
    if (!isVoiceEnabled()) return;
    playSrc(TRACKS[name]);
  } catch {}
}

/** Reproduce el narrador real. Llamar desde un gesto o después de uno (iOS). */
export function playNarratorCountdown(): void {
  try {
    if (!isVoiceEnabled()) return;
    playSrc(NARRATOR_COUNTDOWN_SRC);
  } catch {}
}

/** Voz sintética solo para frases dinámicas (el narrador cubre lo fijo). */
export function speakCue(text: string): void {
  try {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!isVoiceEnabled()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-AR";
    u.rate = 1.0;
    window.speechSynthesis.speak(u);
  } catch {}
}

export function stopVoice(): void {
  try {
    audioEl?.pause();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  } catch {}
}

/** true una sola vez por día por clave (rachas, check-ins). */
export function oncePerDay(key: string): boolean {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const k = `ec-voice-day-${key}`;
    if (localStorage.getItem(k) === today) return false;
    localStorage.setItem(k, today);
    return true;
  } catch {
    return true;
  }
}
