"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Play, ListTree, FileAudio, TriangleAlert } from "lucide-react";
import { voiceEngine } from "@/lib/voice-engine/engine";
import type { PlannedPhrase } from "@/lib/voice-engine/types";

/**
 * Laboratorio de voz (Studio → Voz): escribe una frase y ve exactamente
 * cómo la app la construye: TEXTO → TOKENS → ARCHIVOS → audio final.
 * Los faltantes se registran para saber qué grabar.
 */
const EXAMPLES = [
  "Serie 3 de 4. 10 repeticiones. 60 kilos.",
  "Descansá 90 segundos.",
  "Quedan 30 segundos.",
  "82.5 kilos.",
];

export function VoiceLab() {
  const [text, setText] = useState(EXAMPLES[0]);
  const [plan, setPlan] = useState<PlannedPhrase | null>(null);
  const [missing, setMissing] = useState<string[]>([]);

  function test(play: boolean) {
    voiceEngine.unlock();
    const p = play ? voiceEngine.speakText(text) : voiceEngine.planOnly(text);
    setPlan(p);
    setMissing(voiceEngine.getMissing());
  }

  return (
    <div className="space-y-4">
      <Card className="border-violet-500/25">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical size={16} className="text-violet-400" /> Laboratorio de voz
          </CardTitle>
          <p className="text-xs text-zinc-500">
            Probá cómo el engine construye cualquier frase con los audios disponibles.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-1.5 flex-wrap">
            {EXAMPLES.map((e) => (
              <button
                key={e}
                onClick={() => setText(e)}
                className="text-[11px] px-2.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white min-h-[36px]"
              >
                {e.slice(0, 28)}…
              </button>
            ))}
          </div>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} />
          <div className="flex gap-2">
            <Button variant="accent" className="flex-1 min-h-[48px]" onClick={() => test(true)}>
              <Play size={15} className="mr-1" /> Probar cómo suena
            </Button>
            <Button variant="outline" className="min-h-[48px]" onClick={() => test(false)}>
              <ListTree size={15} className="mr-1" /> Solo plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {plan && (
        <Card className="border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm">TEXTO → TOKENS → ARCHIVOS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase mb-1">Texto</p>
              <p className="text-sm text-white">{plan.text || "—"}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
              <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Tokens</p>
              {plan.tokens.length === 0 && <p className="text-zinc-600">Sin tokens.</p>}
              {plan.tokens.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Badge variant={t.kind === "file" ? "accent" : t.kind === "tts" ? "warn" : "muted"}>
                    {t.kind}
                  </Badge>
                  <span className="text-zinc-300 font-mono truncate">
                    {t.kind === "file" ? t.src : t.kind === "tts" ? `“${t.text}”` : `${t.ms}ms`}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase mb-1 flex items-center gap-1">
                <FileAudio size={11} /> Archivos finales ({plan.files.length}){" "}
                {plan.cached && <Badge variant="muted">cache</Badge>}
              </p>
              {plan.files.length === 0 ? (
                <p className="text-zinc-600">Todo por TTS (faltan audios).</p>
              ) : (
                <ul className="font-mono text-zinc-300 space-y-0.5">
                  {plan.files.map((f) => (
                    <li key={f} className="truncate">
                      → {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {missing.length > 0 && (
        <Card className="border-amber-500/25">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TriangleAlert size={15} className="text-amber-400" /> Faltan grabar ({missing.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="font-mono text-[11px] text-amber-300/90 space-y-0.5 max-h-48 overflow-y-auto">
              {missing.map((m) => (
                <li key={m}>MISSING_AUDIO: {m}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
