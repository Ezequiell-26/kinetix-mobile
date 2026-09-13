"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Watch, Heart, Footprints, Moon, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartwatchWidgetProps {
  className?: string;
}

interface HealthMetric {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit: string;
  color: string;
}

export function SmartwatchWidget({ className }: SmartwatchWidgetProps) {
  // Métricas simuladas - en producción vendrían de wearables reales
  const metrics: HealthMetric[] = [
    {
      icon: <Heart className="w-4 h-4" />,
      label: "Ritmo Cardíaco",
      value: 72,
      unit: "bpm",
      color: "text-red-500",
    },
    {
      icon: <Footprints className="w-4 h-4" />,
      label: "Pasos",
      value: 8432,
      unit: "pasos",
      color: "text-[#D6FF2A]",
    },
    {
      icon: <Moon className="w-4 h-4" />,
      label: "Sueño",
      value: 7.5,
      unit: "hrs",
      color: "text-purple-400",
    },
    {
      icon: <Droplets className="w-4 h-4" />,
      label: "Hidratación",
      value: 1.8,
      unit: "L",
      color: "text-blue-400",
    },
  ];

  return (
    <Card className={cn("bg-gradient-to-br from-[#09090B] to-[#09090B]/80 border-white/10 overflow-hidden", className)}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Watch className="w-5 h-5 text-[#D6FF2A]" />
            <h3 className="text-sm font-semibold text-white">Wearables</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-white/50 hover:text-[#D6FF2A] hover:bg-white/5"
          >
            Conectar
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-px bg-white/10">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={cn(
                "relative p-4 bg-[#09090B]/90 backdrop-blur-sm transition-colors hover:bg-[#09090B]",
                index % 2 === 0 ? "" : "border-l border-white/10",
                index < 2 ? "border-b border-white/10" : ""
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={cn("p-1.5 rounded-lg bg-white/5", metric.color)}>
                  {metric.icon}
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-white/50">{metric.label}</p>
                <p className="text-lg font-bold text-white tabular-nums">
                  {typeof metric.value === "number" && metric.value % 1 !== 0
                    ? metric.value.toFixed(1)
                    : metric.value}
                  <span className="text-xs font-normal text-white/40 ml-0.5">{metric.unit}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white/[0.02] border-t border-white/10">
          <p className="text-xs text-center text-white/40">
            Sincroniza tu Apple Watch, Garmin o Fitbit para ver datos en tiempo real
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
