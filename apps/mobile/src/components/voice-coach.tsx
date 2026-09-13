"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2, Pause, SkipForward, Play, Settings2 } from "lucide-react";
import { speakCue } from "@/lib/voice";
import { voiceEngine } from "@/lib/voice-engine/engine";
import type { VoiceSettings, CountMode, Intensity, RestVerbosity } from "@/lib/voice-engine/types";

// Voz en entreno: narrador real + Voice Engine (eventos, cola, motivación).
// Ajustes persistidos: volumen, intensidad, conteo, motivación, avisos.
export function VoiceCoach({
  exerciseName,
  nextExercise,
}: {
  exerciseName: string;
  nextExercise?: string;
}) {
  const [speaking, setSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [s, setS] = useState<VoiceSettings>(() => ({ ...voiceEngine.settings }));

  useEffect(() => {
    setS({ ...voiceEngine.settings });
  }, []);

  function save(patch: Partial<VoiceSettings>) {
    setS(voiceEngine.saveSettings(patch));
  }

  function preview() {
    if (speaking) {
      voiceEngine.stop();
      setSpeaking(false);
      return;
    }
    if (!s.enabled) return;
    voiceEngine.unlock();
    voiceEngine.emit("REST_COMPLETED");
    setSpeaking(true);
    window.setTimeout(() => setSpeaking(false), 6500);
  }

  return (
    <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 via-zinc-900 to-zinc-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic size={16} className="text-violet-400" /> Voz Coach{" "}
          <Badge variant={s.enabled ? "accent" : "muted"}>{s.enabled ? "Activa" : "Silenciada"}</Badge>
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
          <Button
            size="sm"
            variant="ghost"
            className="min-h-[48px]"
            onClick={() => save({ enabled: !s.enabled })}
          >
            {s.enabled ? "Silenciar" : "Activar"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="min-h-[48px] px-3"
            aria-label="Ajustes de voz"
            onClick={() => setShowSettings((v) => !v)}
          >
            <Settings2 size={16} />
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
            onClick={() => voiceEngine.motivate("manual")}
          >
            Motivar
          </Button>
        </div>

        {showSettings && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-4">
            <div>
              <div className="flex justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                <span>Volumen</span>
                <span className="tabular-nums">{Math.round(s.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(s.volume * 100)}
                onChange={(e) => save({ volume: Number(e.target.value) / 100 })}
                className="w-full accent-primary"
                aria-label="Volumen de voz"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1.5 block">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Intensidad</span>
                <select
                  value={s.intensity}
                  onChange={(e) => save({ intensity: e.target.value as Intensity })}
                  className="w-full h-11 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white"
                >
                  <option value="low">Suave</option>
                  <option value="medium">Media</option>
                  <option value="high">Fuerte</option>
                </select>
              </label>
              <label className="space-y-1.5 block">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Conteo reps</span>
                <select
                  value={s.countMode}
                  onChange={(e) => save({ countMode: e.target.value as CountMode })}
                  className="w-full h-11 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white"
                >
                  <option value="smart">Inteligente</option>
                  <option value="full">Completo</option>
                  <option value="off">Sin conteo</option>
                </select>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1.5 block">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Avisos descanso</span>
                <select
                  value={s.restVerbosity}
                  onChange={(e) => save({ restVerbosity: e.target.value as RestVerbosity })}
                  className="w-full h-11 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white"
                >
                  <option value="full">Detallado</option>
                  <option value="standard">Normal</option>
                  <option value="minimal">Mínimo</option>
                </select>
              </label>
              <div className="flex items-end gap-2 pb-0.5">
                <Button
                  size="sm"
                  variant={s.motivation ? "accent" : "outline"}
                  className="flex-1 h-11 text-xs"
                  onClick={() => save({ motivation: !s.motivation })}
                >
                  Motivación {s.motivation ? "ON" : "OFF"}
                </Button>
              </div>
            </div>
            <Button
              size="sm"
              variant={s.restAlerts ? "accent" : "outline"}
              className="w-full h-11 text-xs"
              onClick={() => save({ restAlerts: !s.restAlerts })}
            >
              Avisos de descanso {s.restAlerts ? "activados" : "silenciados"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
