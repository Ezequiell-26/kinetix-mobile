"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Heart, Moon, Smartphone } from "lucide-react";

/**
 * HealthBox muestra únicamente datos provenientes de conectores reales.
 * Mientras HealthKit / Android Health Connect / wearables no estén conectados,
 * no se presentan números de ejemplo como si fueran mediciones del usuario.
 */
export function HealthBox() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart size={16} className="text-red-400" />
          HealthBox
        </CardTitle>
        <p className="text-xs text-zinc-500">FC, HRV, pasos y sueño desde tus dispositivos conectados.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 flex items-start gap-3">
          <Smartphone className="text-zinc-400 mt-0.5" size={18} />
          <div>
            <p className="font-semibold text-sm">Sin fuente de salud conectada</p>
            <p className="text-xs text-zinc-500 mt-1">
              Conectá un proveedor compatible para importar métricas. KinetixFitt no mostrará valores estimados como si fueran datos reales.
            </p>
          </div>
          <Badge variant="outline" className="ml-auto shrink-0">No conectado</Badge>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-zinc-800 p-3">
            <Heart size={14} className="mx-auto text-red-400 mb-1" />
            <p className="text-xs text-zinc-500">FC</p>
            <p className="text-sm font-semibold">—</p>
          </div>
          <div className="rounded-lg border border-zinc-800 p-3">
            <Activity size={14} className="mx-auto text-violet-400 mb-1" />
            <p className="text-xs text-zinc-500">HRV</p>
            <p className="text-sm font-semibold">—</p>
          </div>
          <div className="rounded-lg border border-zinc-800 p-3">
            <Moon size={14} className="mx-auto text-sky-400 mb-1" />
            <p className="text-xs text-zinc-500">Sueño</p>
            <p className="text-sm font-semibold">—</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
