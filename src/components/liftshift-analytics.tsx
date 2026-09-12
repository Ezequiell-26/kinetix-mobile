"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Activity, Droplets, Weight, Flame } from "lucide-react";
import { CHART_GRID, CHART_AXIS, chartAxisTick, chartTooltipStyle, chartTooltipItemStyle } from "@/lib/chart-theme";

// Inspirado en LiftShift MIT — https://github.com/search?q=liftshift
// Analytics premium: volumen, 1RM, peso, adherencia, agua
// peso: number | null — null = semana sin medición corporal (la línea muestra hueco, no un falso 0).
export function LiftShiftAnalytics({ data }:{ data: { week:string; volumen:number; oneRM:number; peso:number|null; adherencia:number; agua:number }[] }){
  // Antes este componente inventaba 4 semanas de datos cuando no había registros.
  // Ahora muestra estado vacío: es preferible no graficar nada a graficar mentiras.
  const hasAnyWeight = data.some(d => d.peso !== null);
  if(!data.length) return (
    <Card className="border-dashed">
      <CardContent className="py-8 text-center text-xs text-zinc-500 space-y-1">
        <p className="font-bold text-zinc-400">Todavía no hay semanas registradas</p>
        <p>Cuando completes entrenamientos vas a ver volumen, 1RM estimado, peso y adherencia reales.</p>
      </CardContent>
    </Card>
  );
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Activity size={16} className="text-primary"/> Volumen semanal (kg)</CardTitle></CardHeader>
        <CardContent className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
              <XAxis dataKey="week" tick={chartAxisTick} axisLine={false} tickLine={false} />
              <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} itemStyle={chartTooltipItemStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar dataKey="volumen" fill="var(--primary)" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Weight size={16}/> Peso (kg)</CardTitle></CardHeader>
          <CardContent className="h-[140px]">
            {hasAnyWeight ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="week" tick={chartAxisTick} axisLine={false} tickLine={false} />
                  <YAxis domain={["dataMin -1", "dataMax +1"]} tick={chartAxisTick} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} itemStyle={chartTooltipItemStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Line type="monotone" dataKey="peso" stroke="var(--primary)" strokeWidth={2.5} dot={{fill:"var(--primary)", r:3}} connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[11px] text-zinc-600 text-center px-4">
                Sin registros de peso corporal todavía — cargá una medición y aparece acá.
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Droplets size={16} className="text-sky-400"/> Agua (L/día)</CardTitle></CardHeader>
          <CardContent className="h-[140px] flex items-center justify-center">
            <div className="text-[11px] text-zinc-600 text-center px-4">Sin registro de hidratación en la app todavía — cuando exista, se grafica acá.</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Flame size={16} className="text-orange-400"/> 1RM estimado (kg) + Adherencia %</CardTitle></CardHeader>
        <CardContent className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
              <XAxis dataKey="week" tick={chartAxisTick} axisLine={false} tickLine={false} />
              <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} itemStyle={chartTooltipItemStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Line type="monotone" dataKey="oneRM" stroke="var(--primary)" strokeWidth={2.5} dot={{r:3}} />
              <Line type="monotone" dataKey="adherencia" stroke={CHART_AXIS} strokeWidth={2} dot={{r:2}} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
