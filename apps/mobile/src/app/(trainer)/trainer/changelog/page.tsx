import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VersionBadge } from "@/components/version-badge";
import { Sparkles, Bug } from "lucide-react";

export default function ChangelogPage(){
  return (
    <div className="max-w-[640px] space-y-4">
      <div className="flex justify-between items-start">
        <div><h1 className="text-2xl font-display font-bold">Changelog</h1><p className="text-sm text-zinc-500">Historial profesional de Git</p></div>
        <VersionBadge />
      </div>

      <Card className="border-primary/20">
        <CardHeader><CardTitle className="flex items-center gap-2">v1.0.0 — 2026-09-09 <Badge variant="accent">Actual</Badge></CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="font-semibold"><Sparkles size={12} className="inline mr-1 -mt-0.5 text-primary" />Features</p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-300">
            <li>37 rutas, 18 modelos, 15 índices</li>
            <li>Auth TRAINER/CLIENT con RLS real</li>
            <li>Dashboard con charts + analíticas</li>
            <li>Programa → Fase → Semana con superseries</li>
            <li>Entrenar con timer, RIR y guardado real</li>
            <li>Fotos reales con upload + mensajes con archivos</li>
            <li>Nutrición VIP: TDEE, macros, 1RM</li>
            <li>PWA instalable + tema blanco/negro</li>
          </ul>
          <p className="font-semibold mt-4"><Bug size={12} className="inline mr-1 -mt-0.5 text-amber-400" />Fixes</p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-300">
            <li>Secure cookie en http</li>
            <li>.next corrupto 500</li>
            <li>Badge variant outline</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Cómo publicar tu Git público</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <pre className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs overflow-x-auto">{`git remote add origin https://github.com/ezequiel-coaching/ezequiel-coaching.git
git push -u origin main
# Ver en https://github.com/ezequiel-coaching/ezequiel-coaching`}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
