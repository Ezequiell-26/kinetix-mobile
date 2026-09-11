/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageFileButton } from "@/components/file-upload";
import { MessageCircle, Send, Check, CheckCheck, Paperclip, ArrowLeft } from "lucide-react";

type Msg = { 
  id: string; 
  senderId: string; 
  receiverId: string; 
  content: string; 
  createdAt: string; 
  read: boolean; 
};

const quickRepliesClient = [
  "¡Gracias Eze!",
  "Completé el entreno de hoy",
  "¿Podés revisar mi técnica?",
  "Me sentí muy bien hoy",
];

export default function ClientMessagesPage(){
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [meId, setMeId] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      } else {
        load();
      }
    } catch {
      setMsgs(m => m.filter(x => x.id !== temp.id));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function renderContent(c: string){
    if (c.startsWith("/uploads/") || c.startsWith("/api/uploads/")) {
      if (/\.(jpg|jpeg|png|webp|gif)$/i.test(c)) {
        return <img src={c} alt="Adjunto" className="rounded-2xl max-w-[220px] max-h-[220px] object-cover" />;
      }
      return (
        <a href={c} target="_blank" rel="noreferrer" className="underline font-bold text-xs flex items-center gap-1">
          <Paperclip size={12}/> Ver archivo ↗
        </a>
      );
    }
    return <p className="whitespace-pre-wrap leading-relaxed text-[13px]">{c}</p>;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 flex flex-col overflow-hidden bg-[#080808] min-h-0">
        {/* Chat top bar - slim */}
        <div className="shrink-0 px-2 py-2.5 border-b border-zinc-800/70 flex gap-1.5 items-center bg-zinc-950">
          <a href="/client/dashboard" aria-label="Volver" className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-300 hover:bg-zinc-900 active:scale-95 transition shrink-0">
            <ArrowLeft size={20} />
          </a>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-black text-black text-sm shrink-0">
            E
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-white leading-tight">Ezequiel</p>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/> En línea • responde en el día</p>
          </div>
        </div>

        {/* Messages - scrollable, with safe padding */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 bg-[#080808] overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
          {msgs.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500"><MessageCircle size={22} /></div>
              <p className="text-sm font-bold text-zinc-300">¡Hola! Soy Ezequiel</p>
              <p className="text-xs text-zinc-500 max-w-[260px] mx-auto leading-relaxed">Este es tu canal privado. Mandame dudas, videos de técnica o cómo te sentiste. Te respondo en el día.</p>
            </div>
          ) : (
            msgs.map(m => {
              const isMe = m.senderId === meId;
              return (
                <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[82%] sm:max-w-[68%] px-3.5 py-2.5 rounded-2xl text-xs shadow-sm ${
                      isMe
                        ? "bg-primary text-black rounded-br-md font-medium"
                        : "bg-zinc-900 text-white border border-zinc-800 rounded-bl-md"
                    }`}
                  >
                    {renderContent(m.content)}
                    <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${isMe ? "text-black/60" : "text-zinc-500"}`}>
                      <span>{new Date(m.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</span>
                      {isMe && (m.read ? <CheckCheck size={12} className="text-black" /> : <Check size={12} />)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick replies - horizontal scroll, touch-friendly */}
        <div className="shrink-0 px-3 py-2 border-t border-zinc-800/50 bg-zinc-950">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" style={{ WebkitOverflowScrolling: "touch" }}>
            {quickRepliesClient.map((q,i)=>(
              <button
                key={i}
                onClick={()=>send(q)}
                className="shrink-0 text-xs px-3 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white active:scale-95 transition whitespace-nowrap font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input - sticky, safe-area, 44px touch target */}
        <div className="shrink-0 p-3 border-t border-zinc-800 bg-zinc-950 flex gap-2 items-end pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-3">
          <MessageFileButton onFile={url => send(url)} />
          <Input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribí un mensaje..."
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            className="flex-1 min-h-[44px] h-11 text-[15px] sm:text-sm bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 rounded-xl"
            disabled={sending}
          />
          <Button
            variant="accent"
            onClick={() => send()}
            disabled={sending || !input.trim()}
            className="h-11 w-11 sm:w-auto sm:px-5 rounded-xl font-bold shrink-0"
          >
            <Send size={18} />
            <span className="hidden sm:inline ml-1.5">Enviar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
