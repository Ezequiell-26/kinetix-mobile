"use client";
import { useEffect, useState } from "react";
import { ProgressRing, CountUp } from "@/components/animated-stats";
import { Flame, Footprints } from "lucide-react";

/**
 * SmartwatchWidget — carcasa estilo reloj inteligente (Apple Watch look)
 * para mostrar el progreso del día en formato compacto, como en el
 * mockup de marketing (phone + tablet + watch juntos).
 * No reemplaza nada existente: es un elemento visual adicional.
 */
export function SmartwatchWidget({
  workoutName,
  progressPct,
  calories,
  steps,
}: {
  workoutName?: string | null;
  progressPct: number;
  calories: number;
  steps?: number | null; // opcional: sin sensor de pasos conectado, no se inventa el dato
}) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }));
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex justify-center py-1">
      <div className="relative w-[150px] aspect-[0.86/1] rounded-[38px] bg-black border-[3px] border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] px-3 pt-3 pb-4 flex flex-col items-center overflow-hidden">
        {/* Reflejo de cristal */}
        <div className="absolute inset-0 rounded-[35px] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />
        {/* Corona y botón lateral */}
        <span className="absolute -right-[3px] top-9 w-[3px] h-7 rounded-r bg-zinc-700" aria-hidden="true" />
        <span className="absolute -right-[3px] top-20 w-[3px] h-4 rounded-r bg-zinc-700" aria-hidden="true" />

        <p className="text-[10px] font-bold text-zinc-400 tabular-nums tracking-wide">{time || "--:--"}</p>

        <div className="mt-1.5">
          <ProgressRing value={progressPct} size={82} stroke={7}>
            <span className="text-lg font-display font-black text-white tabular-nums leading-none">
              <CountUp value={Math.round(progressPct)} suffix="%" />
            </span>
          </ProgressRing>
        </div>

        <p className="text-[9px] font-bold text-zinc-200 truncate max-w-full mt-2 text-center leading-tight">
          {workoutName || "Sin actividad"}
        </p>

        <div className="flex items-center gap-2.5 mt-2">
          <span className="flex items-center gap-1 text-[9px] font-bold text-danger">
            <Flame size={10} /> {calories}
          </span>
          {typeof steps === "number" && (
            <span className="flex items-center gap-1 text-[9px] font-bold text-info">
              <Footprints size={10} /> {steps}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
