"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { X, ArrowRight, ArrowLeft, Volume2 } from "lucide-react";
import { speakCue, playTrack, stopVoice, type TrackName } from "@/lib/voice";

export type TourStep = {
  target?: string;
  title: string;
  text: string;
  /** Audio del narrador (cuando exista la grabación). */
  track?: TrackName;
  /** Texto que se habla hasta que llegue la grabación. */
  tts: string;
};

/**
 * Tour guiado con voz: spotlight sobre cada zona + tarjeta abajo (zona pulgar).
 * Skippable siempre (botón Saltar, X y Escape). Persiste en localStorage.
 */
export function GuidedTour({
  steps,
  storageKey,
  tourName,
}: {
  steps: TourStep[];
  storageKey: string;
  tourName: string;
}) {
  const [idx, setIdx] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = steps[idx];

  const speak = useCallback((s: TourStep) => {
    try {
      stopVoice();
      if (s.track) playTrack(s.track);
      else speakCue(s.tts);
    } catch {}
  }, []);

  const measure = useCallback(() => {
    const s = steps[idx];
    if (!s?.target) {
      setRect(null);
      return;
    }
    try {
      const el = document.querySelector(s.target);
      if (!el) {
        setRect(null);
        return;
      }
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      window.setTimeout(() => {
        const r = el.getBoundingClientRect();
        setRect(r);
      }, 350);
    } catch {
      setRect(null);
    }
  }, [idx, steps]);

  useEffect(() => {
    speak(step);
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  useEffect(() => () => stopVoice(), []);

  function finish() {
    try {
      stopVoice();
      localStorage.setItem(storageKey, "done");
    } catch {}
    window.dispatchEvent(new Event("ec-tour-done"));
  }

  const last = idx === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-label={`Tour: ${tourName}`}>
      {/* Veladura + spotlight */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={finish}
        aria-hidden="true"
        style={
          rect
            ? {
                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${rect.left - 8}px 0, ${rect.left - 8}px ${rect.bottom + 8}px, ${rect.right + 8}px ${rect.bottom + 8}px, ${rect.right + 8}px ${rect.top - 8}px, ${rect.left - 8}px ${rect.top - 8}px, ${rect.left - 8}px 0)`,
              }
            : undefined
        }
      />
      {rect && (
        <div
          className="absolute rounded-2xl border-2 border-primary pointer-events-none"
          aria-hidden="true"
          style={{
            left: rect.left - 8,
            top: rect.top - 8,
            width: rect.width + 16,
            height: rect.height + 16,
            boxShadow: "0 0 24px rgba(52,211,153,0.5)",
          }}
        />
      )}

      {/* Tarjeta abajo: zona pulgar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="max-w-[560px] mx-auto rounded-3xl bg-[#111111] border border-primary/30 p-5 space-y-3 shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">
              {tourName} • {idx + 1} de {steps.length}
            </p>
            <button
              onClick={finish}
              aria-label="Saltar tour"
              className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 min-h-[36px]"
            >
              <X size={15} />
            </button>
          </div>
          {/* Progreso */}
          <div className="flex gap-1" aria-hidden="true">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full ${i <= idx ? "bg-primary" : "bg-zinc-800"}`}
              />
            ))}
          </div>
          <p className="font-display font-black text-lg text-white">{step.title}</p>
          <p className="text-sm text-zinc-400 leading-relaxed">{step.text}</p>
          <div className="flex gap-2 pt-1">
            {idx > 0 && (
              <button
                onClick={() => setIdx((i) => i - 1)}
                className="h-12 px-4 rounded-2xl border border-zinc-700 text-zinc-200 text-sm font-bold flex items-center gap-1 min-h-[48px]"
              >
                <ArrowLeft size={15} /> Atrás
              </button>
            )}
            <button
              onClick={() => speak(step)}
              aria-label="Escuchar de nuevo"
              className="h-12 w-12 rounded-2xl border border-zinc-700 text-zinc-200 flex items-center justify-center shrink-0 min-h-[48px]"
            >
              <Volume2 size={16} />
            </button>
            {!last ? (
              <button
                onClick={() => setIdx((i) => i + 1)}
                className="h-12 px-6 rounded-2xl bg-primary text-black text-sm font-black flex-1 flex items-center justify-center gap-1 min-h-[48px]"
              >
                Siguiente <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={finish}
                className="h-12 px-6 rounded-2xl bg-primary text-black text-sm font-black flex-1 min-h-[48px]"
              >
                ¡A entrenar! →
              </button>
            )}
          </div>
          <button
            onClick={finish}
            className="w-full text-center text-xs font-bold text-zinc-500 hover:text-white min-h-[44px]"
          >
            Saltar tour
          </button>
        </div>
      </div>
    </div>
  );
}

/** Lanza el tour solo la primera vez (hasta que se completa o se salta). */
export function TourLauncher({
  steps,
  storageKey,
  tourName,
}: {
  steps: TourStep[];
  storageKey: string;
  tourName: string;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    try {
      if (!localStorage.getItem(storageKey)) {
        t = setTimeout(() => setShow(true), 1200);
      }
    } catch {}
    const hide = () => setShow(false);
    window.addEventListener("ec-tour-done", hide);
    return () => {
      clearTimeout(t);
      window.removeEventListener("ec-tour-done", hide);
    };
  }, [storageKey]);
  if (!show) return null;
  return <GuidedTour steps={steps} storageKey={storageKey} tourName={tourName} />;
}
