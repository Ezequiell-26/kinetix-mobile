"use client";
import { useEffect, useState } from "react";
import { CountUp, ProgressRing } from "@/components/animated-stats";
import { Flame } from "lucide-react";

/**
 * Rail de progreso semanal (referencia FitSync): porcentaje gigante, anillo
 * fino, sesiones X/Y y columnas L-M-X-J-V-S-D. Datos reales del dashboard.
 */
export function WeeklyProgress({
  days,
  weekSessions,
  frequency,
  streak,
}: {
  days: { label: string; count: number; isToday: boolean }[];
  weekSessions: number;
  frequency: number;
  streak: number;
}) {
  const pct = Math.min(100, Math.round((weekSessions / Math.max(1, frequency)) * 100));
  const maxCount = Math.max(1, ...days.map(d => d.count));

  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="rounded-3xl border border-subtle bg-surface/70 p-6 h-full flex flex-col surface-card">
      <p className="text-[10px] font-bold tracking-[0.18em] text-zinc-500 uppercase">Tu progreso semanal</p>

      <div className="flex items-center gap-5 mt-5">
        <ProgressRing value={pct} size={110} stroke={7}>
          <span className="text-4xl font-display font-black text-white tabular-nums leading-none">
            <CountUp value={pct} suffix="%" />
          </span>
        </ProgressRing>
        <div className="min-w-0">
          <p className="font-display text-3xl font-black text-white tabular-nums leading-none">
            {weekSessions}
            <span className="text-base text-zinc-500 font-bold"> / {frequency}</span>
          </p>
          <p className="text-[11px] text-zinc-400 mt-1.5">sesiones · objetivo semanal</p>
          <p className={`text-[11px] font-bold flex items-center gap-1 mt-2 ${streak > 0 ? "text-primary" : "text-zinc-500"}`}>
            <Flame size={12} />
            {streak > 0 ? `${streak} día${streak > 1 ? "s" : ""} de racha` : "arrancá tu racha hoy"}
          </p>
        </div>
      </div>

      <div
        className="flex items-end justify-between gap-2 mt-auto pt-8"
        role="img"
        aria-label={`Sesiones por día: ${days.map(d => `${d.label} ${d.count}`).join(", ")}; hoy resaltado`}
      >
        {days.map(d => {
          const h = grown ? Math.max(12, (d.count / maxCount) * 100) : 12;
          const active = d.count > 0;
          return (
            <div key={d.label} className="flex flex-col items-center gap-2 flex-1">
              <div className="h-20 w-full flex items-end">
                <div
                  className={`w-full rounded-full transition-[height] duration-1000 ease-out ${
                    d.isToday && active ? "bg-primary" : active ? "bg-primary/35" : "bg-zinc-800/80"
                  }`}
                  style={{ height: `${h}%` }}
                />
              </div>
              <span className={`text-[10px] font-bold ${d.isToday ? "text-primary" : "text-zinc-500"}`}>{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
