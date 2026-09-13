/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MessageFileButton } from "@/components/file-upload";
import { Send, Check, CheckCheck, Paperclip, ArrowLeft } from "lucide-react";

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
  const [loadError, setLoadError] = useState(false);
  const [sendError, setSendError] = useState(false);
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
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
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
    setSendError(false);
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
        setSendError(true);
      } else {
        load();
      }
    } catch {
      setMsgs(m => m.filter(x => x.id !== temp.id));
      setSendError(true);
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
    return <p className="whitespace-pre-wrap leading-relaxed">{c}</p>;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 flex flex-col overflow-hidden bg-[#080808] min-h-0">
        {/* Chat top bar - premium glass */}
        <div className="shrink-0 pl-1 pr-3 py-2 flex gap-2 items-center bg-zinc-950/90 backdrop-blur-md border-b border-white/[0.06]">
          <a href="/client/dashboard" aria-label="Volver" className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:bg-white/5 hover:text-white active:scale-95 transition shrink-0">
            <ArrowLeft size={20} />
          </a>
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-display font-black text-black text-sm ring-2 ring-primary/30">
              E
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-[15px] text-white leading-tight tracking-tight">Ezequiel</p>
            <p className="text-[11px] text-emerald-400/90 font-medium">En línea • responde en el día</p>
          </div>
        </div>

        {/* Messages - premium canvas */}
        {loadError && (
          <button
            role="alert"
            onClick={() => { setLoadError(false); load(); }}
            className="mx-3 mt-3 rounded-full bg-red-950/60 border border-red-900/50 text-zinc-300 text-xs font-bold px-4 py-2.5 min-h-[44px]"
          >
            Sin conexión — tocá para reintentar
          </button>
        )}
        <div
          className="chat-canvas flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-2.5 overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {msgs.length === 0 ? (
            <div className="text-center pt-14 pb-8 space-y-3 px-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto font-display font-black text-black text-2xl ring-4 ring-primary/20">E</div>
              <p className="font-display font-bold text-white text-lg tracking-tight">Ezequiel</p>
              <p className="text-[13px] text-zinc-400 max-w-[280px] mx-auto leading-relaxed">Tu canal privado con tu entrenador. Dudas, videos de técnica, cómo te sentiste — todo acá.</p>
              <p className="inline-block text-[11px] font-semibold text-zinc-500 bg-white/[0.05] border border-white/[0.07] rounded-full px-3 py-1.5">🔒 Solo entre ustedes dos</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center pb-1">
                <span className="text-[11px] font-semibold text-zinc-400 bg-white/[0.06] border border-white/[0.06] rounded-full px-3 py-1">Hoy</span>
              </div>
              {msgs.map(m => {
                const isMe = m.senderId === meId;
                return (
                  <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"} msg-in`}>
                    <div
                      className={`max-w-[80%] sm:max-w-[65%] px-3.5 pt-2.5 pb-1.5 text-[14px] ${
                        isMe
                          ? "bg-primary text-black rounded-[20px] rounded-br-[6px] font-medium shadow-[0_2px_12px_rgba(214,255,42,0.15)]"
                          : "bg-[#1c1c1e] text-zinc-100 rounded-[20px] rounded-bl-[6px] border border-white/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
                      }`}
                    >
                      {renderContent(m.content)}
                      <span className={`flex items-center justify-end gap-1 text-[10px] mt-0.5 ${isMe ? "text-black/55" : "text-zinc-500"}`}>
                        {new Date(m.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                        {isMe && (m.read ? <CheckCheck size={13} /> : <Check size={13} />)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        <div className="shrink-0 px-3 pt-1.5 pb-1">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" style={{ WebkitOverflowScrolling: "touch" }}>
            {quickRepliesClient.map((q,i)=>(
              <button
                key={i}
                onClick={()=>send(q)}
                className="shrink-0 text-xs px-3.5 py-2 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300 hover:border-primary/50 hover:text-white active:scale-95 transition whitespace-nowrap font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input pill - safe-area */}
        {sendError && (
          <p role="alert" className="px-4 pb-1 text-[11px] font-bold text-red-400">
            No se pudo enviar el mensaje. Reintentá.
          </p>
        )}
        <div className="shrink-0 px-3 pt-1.5 bg-zinc-950/90 backdrop-blur-md pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-3">
          <div className="flex gap-1.5 items-center bg-white/[0.05] border border-white/10 rounded-full pl-1 pr-1.5 py-1.5 focus-within:border-primary/50 transition">
            <MessageFileButton onFile={url => send(url)} />
            <Input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Mensaje..."
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              className="flex-1 min-h-[40px] h-10 text-[15px] bg-transparent border-0 text-white placeholder:text-zinc-500 rounded-full px-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={sending}
            />
            <button
              onClick={() => send()}
              disabled={sending || !input.trim()}
              aria-label="Enviar"
              className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center shrink-0 active:scale-90 transition disabled:opacity-30 disabled:active:scale-100"
            >
              <Send size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
