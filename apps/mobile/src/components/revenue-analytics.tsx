"use client";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { chartAxisTick, chartTooltipStyle, chartTooltipItemStyle } from "@/lib/chart-theme";
import { trackMRRViewed, trackRevenueDashboardViewed, capture } from "@/lib/posthog";

const FALLBACK_MRR = 480000;

export function RevenueAnalytics({
  mrr,
  churn,
  ltv,
  currency = "ARS",
}: {
  mrr?: number;
  churn?: number;
  ltv?: number;
  currency?: string;
}){
  const currentMrr = mrr ?? FALLBACK_MRR;
  const data=[
    {month:"Ene", mrr:320000, churn:2.1},
    {month:"Feb", mrr:385000, churn:1.8},
    {month:"Mar", mrr:420000, churn:2.4},
    {month:"Abr", mrr:currentMrr, churn:1.2},
  ];

  useEffect(() => {
    trackMRRViewed({ mrr: currentMrr, currency, source: "revenue_analytics" });
    trackRevenueDashboardViewed({ mrr: currentMrr, currency, churn: churn ?? 1.2, ltv });
    capture("revenue_tracked", {
      mrr: currentMrr,
      currency,
      revenue: currentMrr,
      $revenue: currentMrr,
      source: "revenue_analytics_mount",
    });
  }, [currentMrr, currency, churn, ltv]);

  return (
    <Card className="border-emerald-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign size={16} className="text-emerald-400"/> Revenue PRO</CardTitle><p className="text-xs text-zinc-500">MRR, churn, LTV — tu negocio en 1 pantalla</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 text-center"><p className="text-[11px] text-zinc-500">MRR</p><p className="font-black text-emerald-400">${(currentMrr/1000).toFixed(0)}k</p><p className="text-[11px] text-emerald-400">+14% mes</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-center"><p className="text-[11px] text-zinc-500">Churn</p><p className="font-black">{churn ?? 1.2}%</p><p className="text-[11px] text-emerald-400">↓ óptimo</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-center"><p className="text-[11px] text-zinc-500">LTV</p><p className="font-black">${ltv ? `${(ltv/1000).toFixed(0)}k` : "210k"}</p><p className="text-[11px] text-zinc-500">12 meses</p></div>
        </div>
        <div className="h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="month" tick={chartAxisTick} axisLine={false} tickLine={false} />
              <YAxis tick={chartAxisTick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} itemStyle={chartTooltipItemStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} formatter={(v:number)=>[`$${(v/1000).toFixed(0)}k`,"MRR"]} />
              <Area type="monotone" dataKey="mrr" stroke="rgb(var(--primary))" fill="rgb(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
