"use client";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { trackMRRViewed, capture } from "@/lib/posthog";

export function TrainerRevenuePro({
  mrr = 480000,
  arpu = 18000,
  churn = 1.8,
  ltv = 245000,
  currency = "ARS",
}: {
  mrr?: number;
  arpu?: number;
  churn?: number;
  ltv?: number;
  currency?: string;
}){
  useEffect(() => {
    trackMRRViewed({ mrr, currency, source: "trainer_revenue_pro" });
    capture("trainer_revenue_viewed", { mrr, arpu, churn, ltv, currency });
  }, [mrr, arpu, churn, ltv, currency]);

  return (
    <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-zinc-900 to-zinc-900">
      <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign size={16} className="text-emerald-400"/> Revenue PRO</CardTitle><p className="text-xs text-zinc-500">MRR, ARPU, churn, LTV, expansion — tu negocio</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center"><p className="text-[11px] text-zinc-500">MRR</p><p className="font-black text-emerald-400 text-lg">${(mrr/1000).toFixed(0)}k</p><p className="text-[11px] text-emerald-400">+12% vs mes pasado</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center"><p className="text-[11px] text-zinc-500">ARPU</p><p className="font-black text-lg">${(arpu/1000).toFixed(0)}k</p><p className="text-[11px] text-zinc-500">por cliente</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center"><p className="text-[11px] text-zinc-500">Churn</p><p className="font-black">{churn}%</p><p className="text-[11px] text-emerald-400">↓ bueno</p></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center"><p className="text-[11px] text-zinc-500">LTV</p><p className="font-black">${(ltv/1000).toFixed(0)}k</p><p className="text-[11px] text-zinc-500">14 meses</p></div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
          <p className="text-xs font-bold">Expansión este mes</p>
          <p className="text-xs text-zinc-500">3 upsells Personalizado → Premium (+$21k MRR) • 2 renovaciones anticipadas</p>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mt-2"><div className="h-full bg-emerald-400" style={{width:"68%"}} /></div>
        </div>
      </CardContent>
    </Card>
  );
}
