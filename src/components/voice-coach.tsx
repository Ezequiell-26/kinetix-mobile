"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2, Pause, SkipForward, Play } from "lucide-react";
import {
  playNarratorCountdown,
  playTrack,
  speakCue,
  stopVoice,
  isVoiceEnabled,
  setVoiceEnabled,
  type TrackName,
} from "@/lib/voice";

// Aviso que manda la página: cuenta con narrador real o frase hablada.
export type VoiceCue =
  | { id: number; kind: "countdown" }
  | { id: number; kind: "track"; track: TrackName }
  | { id: number; kind: "say"; text: string };
export type VoiceCueInput =
  | { kind: "countdown" }
  | { kind: "track"; track: TrackName }
  | { kind: "say"; text: string };

// Voz en entreno: narrador real (3-2-1-¡vamos!) + avisos automáticos.
// Inspirado en Web Speech API + OpenHIIT audio cues (atribución en MIT_ATTRIBUTION).
export function VoiceCoach({
  exerciseName,
  nextExercise,
  cue,
}: {
  exerciseName: string;
  nextExercise?: string;
  cue?: VoiceCue | null;
}) {
  const [speaking, setSpeaking] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const lastCueRef = useRef(0);

  useEffect(() => {
    setEnabled(isVoiceEnabled());
  }, []);

  // Avisos automáticos que manda la página (fin de descanso, cambio, cierre).
  useEffect(() => {
    if (!cue || cue.id === lastCueRef.current) return;
    lastCueRef.current = cue.id;
    if (!isVoiceEnabled()) return;
    if (cue.kind === "countdown") {
      playNarratorCountdown();
      setSpeaking(true);
      window.setTimeout(() => setSpeaking(false), 6500);
    } else if (cue.kind === "track") {
      playTrack(cue.track);
      setSpeaking(true);
      window.setTimeout(() => setSpeaking(false), 6500);
    } else {
      speakCue(cue.text);
      setSpeaking(true);
      window.setTimeout(() => setSpeaking(false), 4000);
    }
  }, [cue]);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    setVoiceEnabled(next);
    if (!next) {
      stopVoice();
      setSpeaking(false);
    }
  }

  function preview() {
    if (speaking) {
      stopVoice();
      setSpeaking(false);
      return;
    }
    if (!enabled) return;
    playNarratorCountdown();
    setSpeaking(true);
    window.setTimeout(() => setSpeaking(false), 6500);
  }

  return (
    <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 via-zinc-900 to-zinc-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic size={16} className="text-violet-400" /> Voz Coach{" "}
          <Badge variant={enabled ? "accent" : "muted"}>{enabled ? "Activa" : "Silenciada"}</Badge>
        </CardTitle>
        <p className="text-xs text-zinc-500">
          Narrador real en la cuenta regresiva + avisos automáticos del entreno
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={speaking ? "outline" : "accent"}
            className="flex-1 min-h-[48px]"
            onClick={preview}
          >
            {speaking ? (
              <>
                <Pause size={14} className="mr-1" /> Pausar
              </>
            ) : (
              <>
                <Volume2 size={14} className="mr-1" /> Probar narrador
              </>
            )}
          </Button>
          <Button size="sm" variant="ghost" className="min-h-[48px]" onClick={toggle}>
            {enabled ? "Silenciar" : "Activar"}
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-11 text-xs"
            onClick={() => speakCue(`Siguiente: ${nextExercise || "descanso"}. Preparate.`)}
          >
            <SkipForward size={14} className="mr-1" /> Siguiente
          </Button>
          <Button size="sm" variant="outline" className="h-11 text-xs" onClick={preview}>
            <Play size={14} className="mr-1" /> Cuenta
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-11 text-xs"
            onClick={() => speakCue(`Vamos, ${exerciseName}. Controla la técnica. Respira.`)}
          >
            Motivar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
