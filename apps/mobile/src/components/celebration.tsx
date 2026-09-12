"use client";
import { useEffect, useMemo, useState } from "react";

/**
 * Celebration — ráfaga de confeti sin dependencias (CSS puro).
 *
 * Psicología: la recompensa inmediata tras un esfuerzo sostiene el hábito
 * (refuerzo positivo + recompensa variable). Se muestra ~3,8 s y desaparece
 * sola; `pointer-events-none` para no bloquear la interacción.
 * Respeta `prefers-reduced-motion` (las piezas se ocultan por CSS).
 */
const COLORS = ["#34D399", "#6EE7B7", "#10B981", "#A7F3D0", "#FBBF24", "#F472B6"];

type Piece = {
  left: number;
  dx: number;
  rot: number;
  delay: number;
  dur: number;
  size: number;
  color: string;
  round: boolean;
};

export function Celebration({
  show,
  pieces = 64,
  durationMs = 3800,
}: {
  show: boolean;
  pieces?: number;
  durationMs?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), durationMs);
    return () => clearTimeout(t);
  }, [show, durationMs]);

  // Semilla estable por montaje: no se regeneran las piezas en cada render.
  const parts = useMemo<Piece[]>(
    () =>
      Array.from({ length: pieces }).map((_, i) => ({
        left: Math.random() * 100,
        dx: (Math.random() * 2 - 1) * 130,
        rot: Math.random() * 900 - 450,
        delay: Math.random() * 0.6,
        dur: 2.2 + Math.random() * 1.5,
        size: 6 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
        round: Math.random() > 0.5,
      })),
    [pieces]
  );

  if (!visible) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {parts.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={
            {
              position: "absolute",
              top: "-6vh",
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.round ? "50%" : "2px",
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              "--dx": `${p.dx}px`,
              "--rot": `${p.rot}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
