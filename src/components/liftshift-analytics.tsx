"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Activity, Droplets, Weight, Flame } from "lucide-react";

// Inspirado en LiftShift MIT — https://github.com/search?q=liftshift
// Analytics premium: volumen, 1RM, peso, adherencia, agua
export function LiftShiftAnalytics({ data }:{ data: { week:string; volumen:number; oneRM:number; peso:number; adherencia:number; agua:number }[] }){
  const mock = data.length ? data : [
    {week:"S1", volumen: 8200, oneRM: 92, peso: 82.4, adherencia: 78, agua: 2.1},
    {week:"S2", volumen: 9600, oneRM: 95, peso: 81.8, adherencia: 85, agua: 2.4},
    {week:"S3", volumen: 11200, oneRM: 98, peso: 81.2, adherencia: 92, agua: 2.6},
    {week:"S4", volumen: 8900, oneRM: 97, peso: 80.9, adherencia: 88, agua: 2.3},
  ];
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Activity size={16} className="text-[#D6FF2A]"/> Volumen semanal (kg) <Badge variant="accent">LiftShift MIT</Badge></CardTitle></CardHeader>
        <CardContent className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mock}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
              <XAxis dataKey="week" tick={{fill:"#71717a", fontSize:11}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:"#71717a", fontSize:11}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{background:"#111", border:"1px solid #27272A", borderRadius:12}} />
              <Bar dataKey="volumen" fill="#D6FF2A" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Weight size={16}/> Peso (kg)</CardTitle></CardHeader>
          <CardContent className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mock}>
                <XAxis dataKey="week" tick={{fill:"#71717a", fontSize:11}} axisLine={false} tickLine={false} />
                <YAxis domain={["dataMin -1", "dataMax +1"]} tick={{fill:"#71717a", fontSize:11}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{background:"#111", border:"1px solid #27272A", borderRadius:12}} />
                <Line type="monotone" dataKey="peso" stroke="#D6FF2A" strokeWidth={2.5} dot={{fill:"#D6FF2A", r:3}} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Droplets size={16} className="text-sky-400"/> Agua (L/día)</CardTitle></CardHeader>
          <CardContent className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mock}>
                <XAxis dataKey="week" tick={{fill:"#71717a", fontSize:11}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill:"#71717a", fontSize:11}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{background:"#111", border:"1px solid #27272A", borderRadius:12}} />
                <Area type="monotone" dataKey="agua" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Flame size={16} className="text-orange-400"/> 1RM estimado (kg) + Adherencia %</CardTitle></CardHeader>
        <CardContent className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mock}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
              <XAxis dataKey="week" tick={{fill:"#71717a", fontSize:11}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:"#71717a", fontSize:11}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{background:"#111", border:"1px solid #27272A", borderRadius:12}} />
              <Line type="monotone" dataKey="oneRM" stroke="#D6FF2A" strokeWidth={2.5} dot={{r:3}} />
              <Line type="monotone" dataKey="adherencia" stroke="#71717a" strokeWidth={2} dot={{r:2}} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <p className="text-[11px] text-zinc-600 text-center">LiftShift + Akilo MIT inspiración — volumen, 1RM Epley, peso, agua, adherencia</p>
    </div>
  );
}
