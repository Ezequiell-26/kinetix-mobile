"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Números y barras animadas para KPIs.
 * Respeta prefers-reduced-motion (muestra el valor final sin animar).
 */

export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 900,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const lastRef = useRef(0);

  useEffect(() => {
    const from = lastRef.current;
    const to = value;
    if (from === to) { setDisplay(to); return; }

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lastRef.current = to;
      setDisplay(to);
      return;
    }

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = from + (to - from) * eased;
      lastRef.current = v;
      setDisplay(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function ProgressBar({
  value,
  color = "var(--primary)",
  className,
}: {
  value: number;
  color?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  // Arranca colapsada y se llena al montar: micro-progreso visible, no un salto seco.
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);
  return (
    <div
      className={`h-1.5 rounded-full overflow-hidden bg-subtle ${className ?? ""}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-[width] duration-1000 ease-out"
        style={{ width: `${width}%`, background: color }}
      />
    </div>
  );
}

export function ProgressRing({
  value,
  size = 84,
  stroke = 8,
  color = "var(--primary)",
  trackColor = "rgb(var(--subtle))",
  className,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const pct = Math.max(0, Math.min(100, value));
  // El anillo se dibuja desde 0 al montar: es el "círculo de progreso que se va subiendo".
  const [drawn, setDrawn] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(pct);
      return;
    }
    const id = requestAnimationFrame(() => setDrawn(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className={`relative inline-flex items-center justify-center ${className ?? ""}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} stroke={trackColor} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} stroke={color} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (drawn / 100) * c}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}
