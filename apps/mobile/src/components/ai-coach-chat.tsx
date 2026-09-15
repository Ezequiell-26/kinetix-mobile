"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Loader2, Send, User } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const INITIAL_MESSAGE = "Soy KinetixFitt AI. Puedo ayudarte a interpretar tus entrenamientos, progresión, recuperación y objetivos. Las recomendaciones deben basarse en datos reales de tu cuenta; no invento métricas.";

export function AiCoachChat() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: INITIAL_MESSAGE }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, thinking]);

  async function send(message?: string) {
    const q = (message ?? input).trim();
    if (!q || thinking) return;

    setMsgs((current) => [...current, { role: "user", content: q }]);
    setInput("");
    setError(null);
    setThinking(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = await response.json().catch(() => null) as { answer?: string; error?: string } | null;
      if (!response.ok) throw new Error(data?.error || "No se pudo consultar KinetixFitt AI.");
      if (!data?.answer) throw new Error("La respuesta de IA llegó vacía.");
      setMsgs((current) => [...current, { role: "assistant", content: data.answer! }]);
    } catch (sendError) {
      const messageText = sendError instanceof Error ? sendError.message : "No se pudo consultar KinetixFitt AI.";
      setError(messageText);
      setMsgs((current) => [...current, { role: "assistant", content: "No pude procesar la consulta. Revisá la configuración del proveedor de IA o intentá nuevamente." }]);
    } finally {
      setThinking(false);
    }
  }

  return (
    <Card className="overflow-hidden border-primary/20 bg-[#0B151E] shadow-[0_20px_80px_rgba(0,0,0,0.22)]">
      <CardHeader className="border-b border-white/[0.06] bg-white/[0.015]">
        <CardTitle className="flex items-center gap-2 text-white">
          <Bot size={18} className="text-primary" />
          KinetixFitt AI
          <span className="ml-auto rounded-full border border-primary/20 bg-primary/[0.06] px-2 py-1 text-[10px] font-black uppercase tracking-wider text-primary">Asistente</span>
        </CardTitle>
        <p className="text-xs text-zinc-500">Asistente conectado a un proveedor compatible con OpenAI cuando está configurado.</p>
      </CardHeader>
      <CardContent className="space-y-3 pt-5">
        <div className="h-[280px] overflow-y-auto space-y-2 rounded-2xl border border-white/[0.06] bg-[#081119] p-3">
          {msgs.map((msg, index) => (
            <div key={`${msg.role}-${index}`} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[86%] rounded-2xl px-3 py-2 text-xs ${msg.role === "user" ? "rounded-br-md bg-primary text-[#081119]" : "rounded-bl-md border border-white/[0.06] bg-[#0B151E] text-white"}`}>
                <div className="mb-1 flex items-center gap-1 opacity-60">
                  {msg.role === "user" ? <User size={10} /> : <Bot size={10} />}
                  {msg.role === "user" ? "Vos" : "KinetixFitt AI"}
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {thinking && <div className="flex items-center gap-2 px-2 py-1 text-xs text-zinc-500"><Loader2 size={13} className="animate-spin" /> Procesando consulta...</div>}
          <div ref={bottomRef} />
        </div>

        {error && <div role="alert" className="rounded-xl border border-red-400/20 bg-red-400/[0.05] px-3 py-2 text-xs text-red-200">{error}</div>}

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Preguntá sobre tu entrenamiento..."
            maxLength={1200}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send();
              }
            }}
            className="h-11 flex-1 border-white/[0.08] bg-[#081119]"
          />
          <Button variant="accent" onClick={() => void send()} disabled={!input.trim() || thinking} className="h-11 px-4">
            {thinking ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </Button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {["¿Cómo puedo progresar en press banca?", "¿Cómo interpreto mi adherencia?", "¿Qué debería revisar antes de entrenar?"] .map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => void send(question)}
              disabled={thinking}
              className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-xs font-semibold text-zinc-400 transition hover:border-primary/30 hover:text-primary disabled:opacity-50"
            >
              {question}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
