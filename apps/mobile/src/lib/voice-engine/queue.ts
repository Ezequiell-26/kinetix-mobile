/**
 * voice-engine/queue.ts — cola de voz con prioridades, anti-duplicados y cooldowns.
 * Pura (sin DOM): testeable. El player ejecuta; la cola decide.
 */
import type { PlannedPhrase, VoicePriority } from "./types";

export interface QueuedSpeech {
  id: number;
  phrase: PlannedPhrase;
  priority: VoicePriority;
  at: number;
}

const RANK: Record<VoicePriority, number> = { CRITICAL: 0, HIGH: 1, NORMAL: 2, LOW: 3 };

export class VoiceQueue {
  private pending: QueuedSpeech[] = [];
  private seq = 0;
  private lastPlayByKey = new Map<string, number>();
  private lastPlayAt = 0;

  /** Ventanas anti-molestia (ms). */
  dedupeWindowMs = 8000;
  lowGapMs = 2500;

  decide(key: string, priority: VoicePriority, now: number): "play" | "queue" | "drop" {
    const last = this.lastPlayByKey.get(key);
    if (last !== undefined && now - last < this.dedupeWindowMs) return "drop";
    if (priority === "LOW" && now - this.lastPlayAt < this.lowGapMs) return "drop";
    if (priority === "CRITICAL") return "play";
    return this.pending.length === 0 ? "play" : "queue";
  }

  markPlayed(key: string, now: number): void {
    this.lastPlayByKey.set(key, now);
    this.lastPlayAt = now;
    if (this.lastPlayByKey.size > 200) {
      const first = this.lastPlayByKey.keys().next().value;
      if (first !== undefined) this.lastPlayByKey.delete(first);
    }
  }

  /** CRITICAL interrumpe: descarta pendientes NORMAL/LOW. */
  push(phrase: PlannedPhrase, priority: VoicePriority, now: number): QueuedSpeech {
    if (priority === "CRITICAL") {
      this.pending = this.pending.filter((q) => q.priority === "CRITICAL" || q.priority === "HIGH");
    }
    const item: QueuedSpeech = { id: ++this.seq, phrase, priority, at: now };
    this.pending.push(item);
    this.pending.sort((a, b) => RANK[a.priority] - RANK[b.priority] || a.at - b.at);
    return item;
  }

  next(): QueuedSpeech | null {
    return this.pending.shift() ?? null;
  }

  get size(): number {
    return this.pending.length;
  }

  clear(): void {
    this.pending = [];
  }
}
