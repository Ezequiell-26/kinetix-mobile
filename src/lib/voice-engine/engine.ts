/**
 * voice-engine/engine.ts — fachada del Voice Engine.
 * WORKOUT ENGINE → emit(evento) → planner → cola → player → usuario.
 * Singleton `voiceEngine`. Todo DOM va con guards (import seguro en servidor/tests).
 */
import type {
  PlannedPhrase, VoiceEvent, VoiceEventData, VoicePriority, VoiceSettings,
} from "./types";
import { DEFAULT_SETTINGS } from "./types";
import { getVoice } from "./voices";
import { planEvent, planText, getMissingAudio } from "./planner";
import { VoiceQueue } from "./queue";
import { VoicePlayer } from "./player";
import { MotivationEngine, motivationToken } from "./motivation";

const SETTINGS_KEY = "ec-voice-settings";
const LEGACY_KEY = "ec-voice";

const EVENT_PRIORITY: Record<string, VoicePriority> = {
  PERSONAL_RECORD: "CRITICAL",
  REST_COMPLETED: "HIGH",
  WORKOUT_COMPLETED: "HIGH",
  SET_STARTED: "NORMAL",
  REST_STARTED: "NORMAL",
  EXERCISE_STARTED: "NORMAL",
  EXERCISE_COMPLETED: "NORMAL",
  WORKOUT_STARTED: "NORMAL",
  REST_WARNING: "NORMAL",
  SET_COMPLETED: "LOW",
  REP_COUNT: "LOW",
  REP_MILESTONE: "LOW",
  LAST_REPS: "HIGH",
  WORKOUT_PAUSED: "LOW",
  WORKOUT_RESUMED: "LOW",
};

function loadSettings(): VoiceSettings {
  const base = { ...DEFAULT_SETTINGS };
  try {
    if (typeof window === "undefined" || !("localStorage" in window)) return base;
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...base, ...(JSON.parse(raw) as Partial<VoiceSettings>) };
    if (window.localStorage.getItem(LEGACY_KEY) === "off") base.enabled = false;
  } catch {}
  return base;
}

class VoiceEngine {
  settings: VoiceSettings = { ...DEFAULT_SETTINGS };
  private queue = new VoiceQueue();
  private player = new VoicePlayer();
  private motivation = new MotivationEngine();
  private playing = false;
  private hydrated = false;

  private hydrate(): void {
    if (this.hydrated) return;
    this.hydrated = true;
    this.settings = loadSettings();
    this.player.setVolume(this.settings.volume);
  }

  saveSettings(patch: Partial<VoiceSettings>): VoiceSettings {
    this.hydrate();
    this.settings = { ...this.settings, ...patch };
    this.player.setVolume(this.settings.volume);
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
      window.localStorage.setItem(LEGACY_KEY, this.settings.enabled ? "on" : "off");
    } catch {}
    if (!this.settings.enabled) {
      this.queue.clear();
      this.player.stop();
    }
    return this.settings;
  }

  /** Llamar desde el primer gesto (iOS desbloquea el audio). */
  unlock(): void {
    this.hydrate();
    this.player.unlock();
  }

  preload(srcs: string[]): void {
    this.hydrate();
    if (!this.settings.enabled) return;
    void this.player.preload(srcs);
  }

  getMissing(): string[] {
    return getMissingAudio();
  }

  /** Evento del workout → habla (o encola). Retorna el texto planificado. */
  emit(event: VoiceEvent["event"], data?: VoiceEventData): string {
    this.hydrate();
    if (!this.settings.enabled) return "";
    if (typeof window === "undefined") return "";

    if (event === "REST_WARNING" && !this.settings.restAlerts) return "";
    if (event === "REP_MILESTONE" && !this.settings.motivation) return "";

    const priority = EVENT_PRIORITY[event] ?? "NORMAL";
    const manifest = getVoice(this.settings.voiceId);
    const phrase = planEvent({ event, data }, manifest);
    if (phrase.tokens.length === 0) return "";

    const key = `${event}|${JSON.stringify(data ?? {})}`;
    const now = Date.now();
    const decision = this.queue.decide(key, priority, now);
    if (decision === "drop") return phrase.text;
    if (decision === "queue" || this.playing) {
      this.queue.push(phrase, priority, now);
      return phrase.text;
    }
    this.speakNow(key, phrase, priority, now);
    return phrase.text;
  }

  private speakNow(key: string, phrase: PlannedPhrase, priority: VoicePriority, now: number): void {
    this.playing = true;
    this.queue.markPlayed(key, now);
    void this.player.play(phrase, () => {
      this.playing = false;
      if (priority === "CRITICAL") this.queue.clear();
      const next = this.queue.next();
      if (next && this.settings.enabled) {
        this.speakNow(`${next.phrase.text}|${next.id}`, next.phrase, next.priority, Date.now());
      }
    });
  }

  /** Motivación contextual (respeta intensidad, cooldown y 1 por serie). */
  motivate(setId: string): string {
    this.hydrate();
    if (!this.settings.enabled || !this.settings.motivation) return "";
    const pick = this.motivation.pick(this.settings.intensity, setId, Date.now());
    if (!pick) return "";
    const manifest = getVoice(this.settings.voiceId);
    const token = motivationToken(pick, manifest);
    const phrase: PlannedPhrase = {
      text: pick.text,
      tokens: [token],
      files: token.kind === "file" ? [token.src] : [],
      missing: token.kind === "file" ? [] : [`motivation/${pick.key}`],
      cached: false,
    };
    const key = `motivation|${pick.key}`;
    const now = Date.now();
    if (this.queue.decide(key, "LOW", now) !== "play" || this.playing) {
      if (this.queue.decide(key, "LOW", now) === "queue" || this.playing) {
        this.queue.push(phrase, "LOW", now);
      }
      return phrase.text;
    }
    this.speakNow(key, phrase, "LOW", now);
    return phrase.text;
  }

  /** Laboratorio: texto libre → habla + devuelve el plan (tokens/archivos). */
  speakText(text: string): PlannedPhrase {
    this.hydrate();
    const manifest = getVoice(this.settings.voiceId);
    const phrase = planText(text, manifest);
    if (this.settings.enabled && phrase.tokens.length > 0) {
      this.playing = true;
      void this.player.play(phrase, () => {
        this.playing = false;
      });
    }
    return phrase;
  }

  planOnly(text: string): PlannedPhrase {
    this.hydrate();
    return planText(text, getVoice(this.settings.voiceId));
  }

  stop(): void {
    this.queue.clear();
    this.player.stop();
    this.playing = false;
  }

  resetMotivation(): void {
    this.motivation.reset();
  }
}

export const voiceEngine = new VoiceEngine();
