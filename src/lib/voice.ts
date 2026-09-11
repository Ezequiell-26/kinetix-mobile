/**
 * voice.ts — motor de voz del entreno.
 * - Narrador real (MP3 del usuario) para la cuenta regresiva 3-2-1-¡vamos!
 * - Web Speech API (es-AR) para avisos dinámicos (nombres de ejercicios, etc.)
 * - Preferencia persistida en localStorage ("ec-voice").
 * - Todo falla en silencio: sin voz nunca se rompe el entreno.
 */

export const NARRATOR_COUNTDOWN_SRC = "/audio/narrador-cuenta-regresiva.mp3";
const VOICE_KEY = "ec-voice";

let audioEl: HTMLAudioElement | null = null;

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

/** Reproduce el narrador real. Llamar desde un gesto o después de uno (iOS). */
export function playNarratorCountdown(): void {
  try {
    if (typeof window === "undefined") return;
    if (!audioEl) {
      audioEl = new Audio(NARRATOR_COUNTDOWN_SRC);
      audioEl.preload = "auto";
    } else {
      audioEl.pause();
      audioEl.currentTime = 0;
    }
    void audioEl.play().catch(() => {});
  } catch {}
}

/** Voz sintética solo para frases dinámicas (el narrador cubre la cuenta). */
export function speakCue(text: string): void {
  try {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
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
