"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Inspirado en onboarding premium + video bienvenida
export function OnboardingVideo(){
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-zinc-900 to-zinc-900">
      <CardHeader><CardTitle className="flex items-center gap-2"><Play size={16} className="text-primary"/> Bienvenida de Ezequiel <Badge variant="accent">Onboarding</Badge></CardTitle><p className="text-xs text-zinc-500">Video 45s + test de movimiento inicial</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="aspect-video rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black"><Play size={20} className="ml-0.5"/></div>
          <p className="text-xs font-bold">Video bienvenida — Ezequiel</p>
          <p className="text-[11px] text-zinc-500">Hola, soy Ezequiel. Bienvenido a tu transformación.</p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold">Test inicial (marca lo que podés hacer):</p>
          {["Sentadilla profunda sin dolor","Flexión completa","Plancha 30s","5 dominadas / 10 flexiones"].map(t=>(
            <label key={t} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs"><input type="checkbox" className="accent-primary"/> {t}</label>
          ))}
        </div>
        <Button variant="accent" className="w-full"><Check size={14} className="mr-2"/> Completar onboarding</Button>
      </CardContent>
    </Card>
  );
}
