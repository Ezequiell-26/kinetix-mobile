"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageFileButton } from "@/components/file-upload";
import { Search, Send, MessageCircle, ArrowLeft, Check, CheckCheck, Paperclip } from "lucide-react";

const quickReplies = [
  "Excelente trabajo esta semana",
  "Subamos 2.5kg en la próxima sesión.",
  "Mantené el RIR controlado y descansá 90s.",
  "Grabate un video de la serie pesada y enviamelo.",
];

type ClientWithUnread = {
  id: string;
  name: string;
  email: string;
  userId?: string | null;
  unreadCount?: number;
};

type Msg = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
};

export default function TrainerMessagesPage(){
  const searchParams = useSearchParams();
  const targetWithUserId = searchParams.get("with");

  const [clients, setClients] = useState<ClientWithUnread[]>([]);
  const [activeClient, setActiveClient] = useState<ClientWithUnread | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [meId, setMeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [showListOnMobile, setShowListOnMobile] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function loadInitial(){
    setLoadingClients(true);
    try {
      const [clientsRes, meRes] = await Promise.all([
        fetch("/api/clients"),
        fetch("/api/auth/me").then(r => r.json()).catch(() => null)
      ]);
      if (meRes?.user?.id) setMeId(meRes.user.id);
      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        if (Array.isArray(clientsData) && clientsData.length > 0) {
          setClients(clientsData);
          if (targetWithUserId) {
            const found = clientsData.find((c: ClientWithUnread) => c.userId === targetWithUserId);
            if (found) { setActiveClient(found); setShowListOnMobile(false); }
            else setActiveClient(clientsData[0]);
          } else {
            setActiveClient(clientsData[0]);
          }
        }
      }
    } catch {}
    setLoadingClients(false);
  }

  async function loadMsgs(){
    if (!activeClient?.userId) return;
    try {
      const res = await fetch(`/api/messages?with=${activeClient.userId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setMsgs(data);
      }
    } catch {}
  }

  useEffect(() => { loadInitial(); }, [targetWithUserId]);
  useEffect(() => {
    if (activeClient?.userId) {
      loadMsgs();
      const interval = setInterval(loadMsgs, 3000);
      return () => clearInterval(interval);
    } else {
      setMsgs([]);
    }
  }, [activeClient]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function handleSend(textToSend?: string){
    const messageContent = (textToSend || input).trim();
    if (!messageContent || !activeClient?.userId || loading) return;
    setLoading(true);
    setInput("");
    const tempMsg: Msg = {
      id: "tmp-" + Date.now(),
      senderId: meId,
      receiverId: activeClient.userId,
      content: messageContent,
      createdAt: new Date().toISOString(),
      read: false
    };
    setMsgs(prev => [...prev, tempMsg]);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: activeClient.userId, clientId: activeClient.id, content: messageContent })
      });
      if (!res.ok) {
        setMsgs(prev => prev.filter(m => m.id !== tempMsg.id));
      } else {
        loadMsgs();
      }
    } catch {
      setMsgs(prev => prev.filter(m => m.id !== tempMsg.id));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function selectClient(c: ClientWithUnread){
    setActiveClient(c);
    setShowListOnMobile(false);
  }

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100dvh-56px-0px)] lg:h-[calc(100dvh-56px-24px)] -mx-4 lg:mx-0 -mt-4 lg:mt-0">
      <div className="shrink-0 px-4 lg:px-0 pt-4 lg:pt-0 pb-3">
        <h1 className="text-xl lg:text-2xl font-display font-bold">Mensajes</h1>
        <p className="text-xs text-zinc-500">Chat 1:1 con cada cliente • toques rápidos</p>
      </div>

      <div className="flex-1 grid lg:grid-cols-[320px_1fr] gap-0 lg:gap-4 overflow-hidden min-h-0">
        {/* Sidebar - hidden on mobile when chat open */}
        <Card className={`border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden rounded-none lg:rounded-2xl border-x-0 lg:border shadow-[0_12px_40px_rgba(0,0,0,0.35)] ${showListOnMobile ? "flex" : "hidden lg:flex"}`}>
          <div className="p-3 border-b border-zinc-800 shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Buscar cliente..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-sm bg-zinc-900 border-zinc-800"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-900 overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
            {loadingClients ? (
              <p className="p-8 text-center text-xs text-zinc-500">Cargando clientes...</p>
            ) : filteredClients.length === 0 ? (
              <p className="p-8 text-center text-xs text-zinc-500">No se encontraron clientes.</p>
            ) : (
              filteredClients.map(c => {
                const isSelected = activeClient?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => selectClient(c)}
                    className={`w-full text-left p-3.5 flex items-center gap-3 transition min-h-[64px] ${isSelected ? "bg-zinc-900 border-l-4 border-l-primary" : "hover:bg-zinc-900/50 active:bg-zinc-900"}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-black text-sm shrink-0">
                      {c.name?.[0]?.toUpperCase() || "C"}
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className={`text-sm font-bold truncate ${isSelected ? "text-primary" : "text-white"}`}>{c.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{c.email}</p>
                    </div>
                    {c.unreadCount ? <Badge variant="accent" className="shrink-0 text-[11px] px-2">{c.unreadCount}</Badge> : null}
                  </button>
                );
              })
            )}
          </div>
        </Card>

        {/* Chat Area - full mobile */}
        <Card className={`border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden rounded-none lg:rounded-2xl border-x-0 lg:border shadow-[0_12px_40px_rgba(0,0,0,0.35)] min-h-0 ${showListOnMobile ? "hidden lg:flex" : "flex"}`}>
          {activeClient ? (
            <>
              {/* Header with back on mobile */}
              <div className="shrink-0 p-3 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900/80 backdrop-blur">
                <button
                  onClick={()=>setShowListOnMobile(true)}
                  className="lg:hidden w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 active:scale-95"
                >
                  <ArrowLeft size={16}/>
                </button>
                <div className="w-9 h-9 rounded-xl bg-primary text-black flex items-center justify-center font-black text-sm shrink-0">
                  {activeClient.name?.[0]?.toUpperCase() || "C"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white truncate">{activeClient.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{activeClient.email}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 bg-[#080808] overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
                {!activeClient.userId ? (
                  <div className="py-16 text-center text-xs text-zinc-500 space-y-2 px-4">
                    <p className="font-bold text-zinc-400">Cliente aún sin cuenta</p>
                    <p>Cuando se registre con <span className="text-white">{activeClient.email}</span> podrán chatear aquí.</p>
                  </div>
                ) : msgs.length === 0 ? (
                  <div className="py-16 text-center text-xs text-zinc-500">
                    Sin mensajes aún. ¡Escribí el primero!
                  </div>
                ) : (
                  msgs.map(m => {
                    const isMe = m.senderId === meId;
                    return (
                      <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[82%] sm:max-w-[70%] px-3.5 py-2.5 rounded-2xl text-xs shadow-sm ${isMe ? "bg-primary text-black rounded-br-md font-medium" : "bg-zinc-900 text-white border border-zinc-800 rounded-bl-md"}`}>
                          {m.content.startsWith("/uploads/") || m.content.startsWith("/api/uploads/") ? (
                            /\.(jpg|jpeg|png|webp|gif)$/i.test(m.content) ? (
                              <img src={m.content} alt="Adjunto" className="rounded-xl max-w-[220px] max-h-[220px] object-cover" />
                            ) : (
                              <a href={m.content} target="_blank" rel="noreferrer" className="underline font-bold flex items-center gap-1"><Paperclip size={12}/> Ver archivo ↗</a>
                            )
                          ) : (
                            <p className="whitespace-pre-wrap leading-relaxed text-[13px]">{m.content}</p>
                          )}
                          <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${isMe ? "text-black/60" : "text-zinc-500"}`}>
                            <span>{new Date(m.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</span>
                            {isMe && (m.read ? <CheckCheck size={12} className="text-black" /> : <Check size={12} />)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick replies + Input */}
              {activeClient.userId && (
                <div className="shrink-0 border-t border-zinc-800 bg-zinc-950">
                  <div className="px-3 py-2 border-b border-zinc-800/50">
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none" style={{ WebkitOverflowScrolling: "touch" }}>
                      {quickReplies.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(q)}
                          className="shrink-0 text-xs px-3 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white active:scale-95 transition whitespace-nowrap font-medium"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 flex gap-2 items-end pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:pb-3">
                    <MessageFileButton onFile={url => handleSend(url)} />
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder={`A ${activeClient.name}...`}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      className="flex-1 min-h-[44px] h-11 text-[15px] sm:text-sm bg-zinc-900 border-zinc-800 text-white rounded-xl"
                      disabled={loading}
                    />
                    <Button variant="accent" onClick={() => handleSend()} disabled={loading || !input.trim()} className="h-11 w-11 lg:w-auto lg:px-5 rounded-xl font-bold shrink-0">
                      <Send size={18} /><span className="hidden lg:inline ml-1.5">Enviar</span>
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center p-8 space-y-3 text-zinc-500">
              <MessageCircle size={32} />
              <p className="text-sm font-bold text-zinc-400">Seleccioná un cliente</p>
              <p className="text-xs">Elegí a quién escribir</p>
              <Button variant="outline" size="sm" className="lg:hidden mt-2" onClick={()=>setShowListOnMobile(true)}>Ver clientes</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
