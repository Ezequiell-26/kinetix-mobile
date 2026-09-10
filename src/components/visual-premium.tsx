"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown, Gem, Zap } from "lucide-react";

// Inspirado en shadcn/ui premium + radix-ui + Linear + Stripe Dashboard MIT
// Glassmorphism, gradients, shimmer, microinteractions
export function VisualPremiumShowcase(){
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white">
          <CardContent className="pt-6">
            <Crown size={20} className="mb-2 opacity-80"/>
            <p className="font-black text-lg">VIP Glass</p>
            <p className="text-xs opacity-80">Glassmorphism + blur + gradient</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-zinc-800 bg-zinc-900">
          <CardContent className="pt-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D6FF2A] to-emerald-400 flex items-center justify-center mb-2">
              <Zap size={18} className="text-black"/>
            </div>
            <p className="font-black text-sm">Microinteractions</p>
            <p className="text-xs text-zinc-500">Hover, press, shimmer 400ms</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-[#D6FF2A]/20 bg-[#D6FF2A]/5">
          <CardContent className="pt-6">
            <Gem size={20} className="text-[#D6FF2A] mb-2"/>
            <p className="font-black text-sm">Tipografía Premium</p>
            <p className="text-xs text-zinc-500">Display 700 + Inter 400</p>
          </CardContent>
        </Card>
      </div>
      <Card className="border-zinc-800 bg-zinc-950 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-violet-500 via-[#D6FF2A] to-emerald-500" />
        <CardContent className="pt-4">
          <p className="font-bold text-sm flex items-center gap-2"><Sparkles size={14} className="text-[#D6FF2A]"/> Pulido VIP Alto Nivel</p>
          <p className="text-xs text-zinc-500 mt-1">Glassmorphism • Gradients • Shimmer • 44px touch • Inter + Display • 8px grid • Borde 20px • Sombra 0 8 32</p>
          <div className="flex gap-1.5 mt-3">
            <Badge variant="accent">Glass</Badge>
            <Badge variant="muted">Gradient</Badge>
            <Badge variant="muted">Shimmer</Badge>
            <Badge variant="muted">Spring 400/18</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
