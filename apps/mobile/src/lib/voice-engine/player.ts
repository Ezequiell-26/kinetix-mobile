/**
 * voice-engine/player.ts — splicer/mixer: une los audios con gaps y fades.
 * Web Audio (buffers decodificados, crossfade corto anti-click) con
 * fallback a <audio> secuencial. Preload + caché de buffers. No bloquea la UI.
 */
import type { PlannedPhrase, VoiceToken } from "./types";

export const TOKEN_GAP_MS = 90;
const FADE_MS = 25;

type Done = () => void;

export class VoicePlayer {
  private ctx: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private sources: AudioBufferSourceNode[] = [];
  private volume = 1;
  private fallbackEl: HTMLAudioElement | null = null;
  private stopped = false;
  private currentOnDone: Done | null = null;

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
  }

  /** Desbloqueo iOS: llamar desde un gesto del usuario. */
  unlock(): void {
    try {
      if (typeof window === "undefined") return;
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AC && !this.ctx) this.ctx = new AC();
      if (this.ctx?.state === "suspended") void this.ctx.resume();
    } catch {}
  }

  private ensureCtx(): AudioContext | null {
    if (this.ctx) return this.ctx;
    try {
      if (typeof window === "undefined") return null;
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      return this.ctx;
    } catch {
      return null;
    }
  }

  async preload(srcs: string[]): Promise<void> {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    await Promise.all(
      srcs.slice(0, 12).map(async (src) => {
        if (this.buffers.has(src)) return;
        try {
          const res = await fetch(src);
          const ab = await res.arrayBuffer();
          const buf = await ctx.decodeAudioData(ab);
          if (this.buffers.size > 60) this.buffers.clear();
          this.buffers.set(src, buf);
        } catch {}
      })
    );
  }

  stop(): void {
    this.stopped = true;
    try {
      for (const s of this.sources) {
        try {
          s.stop();
        } catch {}
      }
      this.sources = [];
      this.fallbackEl?.pause();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch {}
    const done = this.currentOnDone;
    this.currentOnDone = null;
    if (done) done();
  }

  async play(phrase: PlannedPhrase, onDone?: Done): Promise<void> {
    this.stop();
    this.stopped = false;
    this.currentOnDone = onDone ?? null;
    const ctx = this.ensureCtx();
    if (!ctx) {
      await this.playFallback(phrase);
      this.finish();
      return;
    }
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {}
    }
    const fileTokens = phrase.tokens.filter((t) => t.kind === "file");
    await this.preload(fileTokens.map((t) => (t as { src: string }).src));
    if (this.stopped) return;

    let t = ctx.currentTime + 0.03;
    const master = ctx.createGain();
    master.gain.value = this.volume;
    master.connect(ctx.destination);
    let lastEnd = t;

    for (const tok of phrase.tokens) {
      if (this.stopped) return;
      if (tok.kind === "silence") {
        t += tok.ms / 1000;
        continue;
      }
      if (tok.kind === "tts") {
        const dur = this.speakSync(tok.text);
        t += dur;
        continue;
      }
      const buf = this.buffers.get(tok.src);
      if (!buf) continue;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const g = ctx.createGain();
      const fade = Math.min(FADE_MS / 1000, buf.duration / 3);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(1, t + fade);
      g.gain.setValueAtTime(1, t + buf.duration - fade);
      g.gain.linearRampToValueAtTime(0.0001, t + buf.duration);
      src.connect(g);
      g.connect(master);
      src.start(t);
      this.sources.push(src);
      t += buf.duration + TOKEN_GAP_MS / 1000;
      lastEnd = t;
    }

    const waitMs = Math.max(0, (lastEnd - ctx.currentTime) * 1000 + 80);
    window.setTimeout(() => {
      if (!this.stopped) this.finish();
    }, waitMs);
  }

  /** TTS bloqueante aproximado: estima duración por caracteres. */
  private speakSync(text: string): number {
    try {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return 0;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "es-AR";
      u.rate = 1.0;
      u.volume = this.volume;
      window.speechSynthesis.speak(u);
    } catch {}
    return Math.min(12, 0.6 + text.length * 0.075);
  }

  private async playFallback(phrase: PlannedPhrase): Promise<void> {
    for (const tok of phrase.tokens) {
      if (this.stopped) return;
      if (tok.kind === "silence") {
        await new Promise((r) => setTimeout(r, tok.ms));
        continue;
      }
      if (tok.kind === "tts") {
        this.speakSync(tok.text);
        await new Promise((r) => setTimeout(r, Math.min(12000, 600 + tok.text.length * 75)));
        continue;
      }
      await new Promise<void>((resolve) => {
        try {
          if (!this.fallbackEl) this.fallbackEl = new Audio();
          const el = this.fallbackEl;
          el.pause();
          el.src = tok.src;
          el.volume = this.volume;
          el.onended = () => resolve();
          el.onerror = () => resolve();
          void el.play().catch(() => resolve());
          window.setTimeout(resolve, 15000);
        } catch {
          resolve();
        }
      });
      await new Promise((r) => setTimeout(r, TOKEN_GAP_MS));
    }
  }

  private finish(): void {
    const done = this.currentOnDone;
    this.currentOnDone = null;
    this.sources = [];
    if (done) done();
  }
}
