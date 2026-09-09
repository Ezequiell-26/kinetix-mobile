/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageFileButton } from "@/components/file-upload";
import { Send, Check, CheckCheck } from "lucide-react";

type Msg = { 
  id: string; 
  senderId: string; 
  receiverId: string; 
  content: string; 
  createdAt: string; 
  read: boolean; 
};

export default function ClientMessagesPage(){
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [meId, setMeId] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function load(){
    try {
      const [res, meRes] = await Promise.all([
        fetch("/api/messages"),
        fetch("/api/auth/me").then(r => r.json()).catch(() => null)
      ]);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setMsgs(data);
      }
      if (meRes?.user?.id) setMeId(meRes.user.id);
    } catch {}
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  async function send(customContent?: string){
    const contentToSend = (customContent || input).trim();
    if (!contentToSend || sending) return;

    setSending(true);
    setInput("");

    const temp: Msg = {
      id: "tmp" + Date.now(),
      senderId: meId,
      receiverId: "trainer",
      content: contentToSend,
      createdAt: new Date().toISOString(),
      read: false
    };
    setMsgs(m => [...m, temp]);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contentToSend })
      });
      if (!res.ok) {
        setMsgs(m => m.filter(x => x.id !== temp.id));
        alert("Error al enviar el mensaje");
      } else {
        load();
      }
    } catch {
      setMsgs(m => m.filter(x => x.id !== temp.id));
    } finally {
      setSending(false);
    }
  }

  function renderContent(c: string){
    if (c.startsWith("/uploads/")) {
      if (/\.(jpg|jpeg|png|webp|gif)$/i.test(c)) {
        return <img src={c} alt="Adjunto" className="rounded-xl max-w-[220px] max-h-[220px] object-cover" />;
      }
      return (
        <a href={c} target="_blank" rel="noreferrer" className="underline font-bold text-xs">
          Ver archivo adjunto ↗
        </a>
      );
    }
    return <p className="whitespace-pre-wrap leading-relaxed">{c}</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-display font-bold">Mensajes con Ezequiel</h1>
        <p className="text-sm text-zinc-400">Canal directo para dudas, videos de técnica y feedback</p>
      </div>

      <Card className="overflow-hidden flex flex-col h-[68vh] min-h-[480px] border-zinc-800 bg-zinc-950">
        {/* Chat top info bar */}
        <div className="p-3.5 border-b border-zinc-800 flex gap-3 items-center bg-zinc-900/60">
          <div className="w-10 h-10 rounded-xl bg-[#D6FF2A] flex items-center justify-center font-black text-black text-base shrink-0">
            E
          </div>
          <div>
            <p className="font-bold text-sm text-white">Ezequiel</p>
            <p className="text-xs text-emerald-400">● Tu Entrenador Online</p>
          </div>
        </div>

        {/* Message stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#080808]">
          {msgs.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm font-semibold text-zinc-400">Aún no hay mensajes en esta conversación.</p>
              <p className="text-xs text-zinc-600">¡Escribile a Ezequiel para comenzar!</p>
            </div>
          ) : (
            msgs.map(m => {
              const isMe = m.senderId === meId;
              return (
                <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[82%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs space-y-1 ${
                      isMe
                        ? "bg-[#D6FF2A] text-black rounded-br-none font-medium"
                        : "bg-zinc-900 text-white border border-zinc-800 rounded-bl-none"
                    }`}
                  >
                    {renderContent(m.content)}
                    <div className={`flex items-center justify-end gap-1 text-[10px] ${isMe ? "text-black/60" : "text-zinc-500"}`}>
                      <span>
                        {new Date(m.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {isMe && (
                        m.read ? <CheckCheck size={13} className="text-black" /> : <Check size={13} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Chat input controls */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex gap-2 items-center">
          <MessageFileButton onFile={url => send(url)} />
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribí un mensaje..."
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            className="flex-1 h-11 text-xs bg-zinc-900 border-zinc-800 text-white"
            disabled={sending}
          />
          <Button
            variant="accent"
            onClick={() => send()}
            disabled={sending || !input.trim()}
            className="h-11 px-4 font-bold"
          >
            <Send size={16} />
          </Button>
        </div>
      </Card>

      <p className="text-xs text-center text-zinc-500">
        🔒 Canal privado y seguro entre vos y Ezequiel Coaching
      </p>
    </div>
  );
}
