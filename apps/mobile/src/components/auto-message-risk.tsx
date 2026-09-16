"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, RefreshCw, Send } from "lucide-react";

type Risk = {
  id: string;
  name: string;
  userId: string | null;
  inactiveDays: number;
  reasons: string[];
  priority: "high" | "medium" | "low";
};

export function AutoMessageRisk() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  async function loadRisks() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/automation/risk", { credentials: "include", cache: "no-store" });
      if (!response.ok) throw new Error("No se pudieron cargar los riesgos");
      const data = await response.json() as { risks?: Risk[] };
      setRisks(Array.isArray(data.risks) ? data.risks : []);
    } catch (loadError) {
      console.error("[AutoMessageRisk] load failed", loadError);
      setError("No se pudieron cargar las alertas ahora.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRisks();
  }, []);

  async function sendMessage(risk: Risk) {
    if (!risk.userId) return;
    setSending(risk.id);
    setError(null);
    const content = risk.inactiveDays >= 5
      ? `Hola ${risk.name}, noté que llevás ${risk.inactiveDays} días sin registrar actividad. ¿Todo bien? Revisemos tu semana y ajustamos el plan si hace falta.`
      : `Hola ${risk.name}, tenés un check-in pendiente. ¿Podés completarlo cuando tengas un momento?`;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: risk.userId, clientId: risk.id, content }),
      });
      if (!response.ok) throw new Error("No se pudo enviar el mensaje");
      setSent((current) => new Set(current).add(risk.id));
    } catch (sendError) {
      console.error("[AutoMessageRisk] send failed", sendError);
      setError(`No se pudo enviar el mensaje a ${risk.name}.`);
    } finally {
      setSending(null);
    }
  }

  return (
    <Card className="border-amber-500/20">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" />
            Auto-Mensajes de riesgo
          </CardTitle>
          <p className="text-xs text-zinc-500">Detecta inactividad y check-ins pendientes a partir de actividad real.</p>
        </div>
        <Button size="sm" variant="outline" className="h-8" onClick={() => void loadRisks()} disabled={loading} aria-label="Actualizar alertas">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading && <p className="text-xs text-zinc-500 py-4 text-center">Analizando actividad…</p>}
        {!loading && !error && risks.length === 0 && <p className="text-xs text-zinc-500 py-4 text-center">No hay alertas activas para tu cartera.</p>}
        {!loading && risks.map((risk) => (
          <div key={risk.id} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/40 flex gap-3 items-center">
            <Clock size={14} className={risk.priority === "high" ? "text-red-400 shrink-0" : "text-amber-400 shrink-0"} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs truncate">{risk.name}</p>
              <p className="text-xs text-zinc-500 truncate">{risk.reasons.join(" · ")}</p>
            </div>
            <Button
              size="sm"
              variant={sent.has(risk.id) ? "accent" : "outline"}
              className="shrink-0 h-7 text-xs"
              disabled={!risk.userId || sending === risk.id || sent.has(risk.id)}
              onClick={() => void sendMessage(risk)}
            >
              {sent.has(risk.id) ? "Enviado" : <><Send size={12} className="mr-1" /> Enviar</>}
            </Button>
          </div>
        ))}
        {error && <p className="text-[11px] text-red-400 text-center pt-2">{error}</p>}
      </CardContent>
    </Card>
  );
}
