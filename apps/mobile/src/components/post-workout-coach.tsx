import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Capa de Coach IA post-entreno.
 *
 * Se muestra cuando el atleta ya registró su sesión de hoy. Resume lo que
 * realmente pasó (series completadas sobre las planificadas, volumen y
 * duración tomados del WorkoutLog real) y adelanta el foco de la próxima
 * sesión. No inventa datos: si falta un valor, no se muestra.
 */
export function PostWorkoutCoach({
  doneSets,
  plannedSets,
  volume,
  durationMin,
  nextWorkoutName,
  nextFocus,
  nextHref,
}: {
  doneSets: number;
  plannedSets: number;
  volume: number;
  durationMin?: number | null;
  nextWorkoutName?: string | null;
  nextFocus?: string | null;
  nextHref?: string;
}) {
  const pct = plannedSets > 0 ? Math.min(100, Math.round((doneSets / plannedSets) * 100)) : 0;

  const message =
    plannedSets === 0
      ? "Sesión registrada. Buen trabajo por aparecer."
      : pct >= 100
        ? "Completaste el 100% de lo planificado. Trabajo impecable."
        : pct >= 70
          ? "Sesión sólida: casi todo el plan quedó cubierto."
          : pct > 0
            ? "Sesión parcial. Lo importante es no cortar el ritmo."
            : "Sesión registrada. Buen trabajo por aparecer.";

  return (
    <div className="rounded-[20px] border border-primary/25 bg-primary/[0.05] p-5 space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Sparkles size={16} aria-hidden="true" />
        <span className="text-[10px] font-black tracking-[0.2em] uppercase">Coach IA · post-entreno</span>
      </div>

      <p className="text-sm text-zinc-200 leading-relaxed">{message}</p>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl bg-zinc-950/70 border border-zinc-800 px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">Sesión</p>
          <p className="text-xl font-black text-primary tabular-nums mt-0.5">{pct}%</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            {doneSets}/{plannedSets} series
          </p>
        </div>
        <div className="rounded-2xl bg-zinc-950/70 border border-zinc-800 px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">Volumen</p>
          <p className="text-xl font-black text-white tabular-nums mt-0.5">
            {volume.toLocaleString("es-AR")}
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">kg levantados</p>
        </div>
        <div className="rounded-2xl bg-zinc-950/70 border border-zinc-800 px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">Duración</p>
          <p className="text-xl font-black text-white tabular-nums mt-0.5">
            {durationMin ? durationMin : "—"}
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">{durationMin ? "minutos" : "sin registro"}</p>
        </div>
      </div>

      {nextWorkoutName && (
        <div className="border-t border-primary/15 pt-3.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Próxima sesión</p>
            <p className="text-sm font-bold text-white truncate">{nextWorkoutName}</p>
            {nextFocus && <p className="text-[11px] text-zinc-500 truncate">{nextFocus}</p>}
          </div>
          {nextHref && (
            <Link href={nextHref} className="shrink-0">
              <Button variant="outline" size="sm" className="font-bold">
                Ver <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
