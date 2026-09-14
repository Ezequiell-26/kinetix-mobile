"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Clock, Battery, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { chartAxisTick, chartTooltipStyle, chartTooltipItemStyle } from "@/lib/chart-theme";

// Inspirado en Sleep as Android MIT + Oura + open-wearables MIT
// Sleep stages: despierto, ligero, profundo, REM
export function SleepTracker(){
  const data=[
    {night:"Lun", horas:7.2, deep:1.4, rem:1.8, score:82},
    {night:"Mar", horas:6.8, deep:1.1, rem:1.5, score:68},
    {night:"Mié", horas:7.8, deep:1.8, rem:2.1, score:91},
    {night:"Jue", horas:7.2, deep:1.4, rem:1.8, score:84},
  ];
  return (
    <Card className="border-violet-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Moon size={16} className="text-violet-400"/> Sleep Pro</CardTitle><p className="text-xs text-zinc-500">Horas, profundo, REM, score — Oura/Whoop style</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="night" tick={chartAxisTick} axisLine={false} tickLine={false} />
              <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} domain={[5,9]} />
              <Tooltip contentStyle={chartTooltipStyle} itemStyle={chartTooltipItemStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Line type="monotone" dataKey="horas" stroke="var(--primary)" strokeWidth={2} dot={{r:3}} />
              <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={1.5} dot={{r:2}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-center"><Clock size={14} className="mx-auto text-zinc-400"/><p className="font-black">7.2h</p><p className="text-[11px] text-zinc-500">Promedio</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-center"><Battery size={14} className="mx-auto text-violet-400"/><p className="font-black">84/100</p><p className="text-[11px] text-zinc-500">Score</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-center"><TrendingUp size={14} className="mx-auto text-emerald-400"/><p className="font-black">1.4h</p><p className="text-[11px] text-zinc-500">Profundo</p></div>
        </div>
      </CardContent>
    </Card>
  );
}
