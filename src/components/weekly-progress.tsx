"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WeeklyProgressProps {
  data?: Record<string, number>;
  className?: string;
}

const dayLabels = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const dayShort = ["D", "L", "M", "X", "J", "V", "S"];

export function WeeklyProgress({ data, className }: WeeklyProgressProps) {
  // Si no hay datos, mostrar estado vacío
  const hasData = data && Object.keys(data).length > 0;
  
  // Datos dummy para demostración si no hay datos reales
  const displayData = hasData ? data : {
    domingo: 0,
    lunes: 60,
    martes: 80,
    miércoles: 45,
    jueves: 90,
    viernes: 30,
    sábado: 0,
  };

  const maxValue = Math.max(...Object.values(displayData), 1);
  const today = new Date().getDay();

  return (
    <Card className={cn("bg-surface/40 border-white/10", className)}>
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-white/70 mb-4">Progreso Semanal</h3>
        
        <div className="flex items-end justify-between gap-2 h-32">
          {dayLabels.map((day, index) => {
            const value = displayData[day] || 0;
            const heightPercent = (value / maxValue) * 100;
            const isToday = index === today;
            const hasActivity = value > 0;

            return (
              <div key={day} className="flex flex-col items-center flex-1 gap-2">
                <div className="relative w-full flex justify-center">
                  <div
                    className={cn(
                      "w-full max-w-[24px] rounded-t-md transition-all duration-500 ease-out",
                      hasActivity
                        ? isToday
                          ? "bg-[#D6FF2A]"
                          : "bg-[#D6FF2A]/60"
                        : "bg-white/10",
                      isToday && "ring-2 ring-[#D6FF2A]/50"
                    )}
                    style={{
                      height: `${Math.max(heightPercent, 4)}px`,
                      minHeight: hasActivity ? "8px" : "4px",
                    }}
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isToday ? "text-[#D6FF2A]" : "text-white/40"
                  )}
                >
                  {dayShort[index]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Leyenda */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-white/40">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#D6FF2A]" />
            <span>Hoy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#D6FF2A]/60" />
            <span>Esta semana</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <span>Sin actividad</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
