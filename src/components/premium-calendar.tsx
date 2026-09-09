"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

const dayLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function PremiumCalendar({
  completedDates = []
}: {
  completedDates?: string[];
}){
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [workoutsByDate, setWorkoutsByDate] = useState<Set<number>>(new Set());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Format Month Year in Spanish
  const monthName = currentDate.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // Days in this month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // First day of month (0 = Sunday, 1 = Monday, ... 6 = Saturday)
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Convert to Monday=0

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const currentDayNum = isCurrentMonth ? today.getDate() : -1;

  useEffect(() => {
    async function loadMonthLogs(){
      try {
        const res = await fetch("/api/workout-logs");
        if (res.ok) {
          const logs = await res.json();
          if (Array.isArray(logs)) {
            const daysSet = new Set<number>();
            logs.forEach((l: { date: string }) => {
              const d = new Date(l.date);
              if (d.getFullYear() === year && d.getMonth() === month) {
                daysSet.add(d.getDate());
              }
            });
            setWorkoutsByDate(daysSet);
          }
        }
      } catch {}
    }
    loadMonthLogs();
  }, [year, month]);

  function prevMonth(){
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth(){
    setCurrentDate(new Date(year, month + 1, 1));
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/90">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2 text-white">
          <CalendarIcon size={16} className="text-[#D6FF2A]" /> Calendario de Entrenamiento
        </CardTitle>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={prevMonth} className="h-8 w-8 p-0" aria-label="Mes anterior">
            <ChevronLeft size={16} />
          </Button>
          <span className="text-xs font-bold text-zinc-300 px-2 min-w-[110px] text-center">
            {formattedMonth}
          </span>
          <Button variant="outline" size="sm" onClick={nextMonth} className="h-8 w-8 p-0" aria-label="Mes siguiente">
            <ChevronRight size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {/* Day of week headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-zinc-500 uppercase">
          {dayLabels.map(d => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty spacer slots for offset before the 1st of month */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-xl bg-transparent" />
          ))}

          {/* Days of month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isToday = dayNum === currentDayNum;
            const hasWorkout = workoutsByDate.has(dayNum);

            return (
              <div
                key={`day-${dayNum}`}
                className={`aspect-square rounded-xl border p-1 flex flex-col items-center justify-between text-xs transition ${
                  isToday
                    ? "bg-[#D6FF2A] border-[#D6FF2A] text-black font-black shadow-[0_0_10px_rgba(214,255,42,0.3)]"
                    : hasWorkout
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold"
                    : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <span className="text-[11px]">{dayNum}</span>
                {hasWorkout ? (
                  <span className="text-[9px] font-bold">✓</span>
                ) : isToday ? (
                  <span className="text-[8px] uppercase tracking-tighter">Hoy</span>
                ) : (
                  <span className="h-2" />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#D6FF2A] rounded-full" /> Hoy
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full" /> Entreno completado
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
