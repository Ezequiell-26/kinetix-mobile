"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageFileButton } from "@/components/file-upload";
import { Search, Send, MessageCircle, User, Check, CheckCheck } from "lucide-react";

const quickReplies = [
  "Excelente trabajo esta semana 💪",
  "Subamos 2.5kg en la próxima sesión.",
  "Mantené el RIR controlado y descansá 90s.",
  "Grabate un video de la serie pesada y enviamelo."
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

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

          // If URL has ?with=userId, select that client
          if (targetWithUserId) {
            const found = clientsData.find(c => c.userId === targetWithUserId);
            if (found) setActiveClient(found);
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

  useEffect(() => {
    loadInitial();
  }, [targetWithUserId]);

  useEffect(() => {
    if (activeClient?.userId) {
      loadMsgs();
      const interval = setInterval(loadMsgs, 3000);
      return () => clearInterval(interval);
    } else {
      setMsgs([]);
    }
  }, [activeClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  async function handleSend(textToSend?: string){
    const messageContent = (textToSend || input).trim();
    if (!messageContent || !activeClient?.userId || loading) return;

    setLoading(true);
    setInput("");

    // Optimistic message
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
        body: JSON.stringify({
          receiverId: activeClient.userId,
          clientId: activeClient.id,
          content: messageContent
        })
      });

      if (!res.ok) {
        setMsgs(prev => prev.filter(m => m.id !== tempMsg.id));
        alert("Error al enviar mensaje");
      } else {
        loadMsgs();
      }
    } catch {
      setMsgs(prev => prev.filter(m => m.id !== tempMsg.id));
    } finally {
      setLoading(false);
    }
  }

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold">Mensajería con Clientes</h1>
        <p className="text-sm text-zinc-400">Canal directo 1:1 con cada cliente</p>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-4 h-[72vh] min-h-[500px]">
        {/* Sidebar Clients List */}
        <Card className="border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-zinc-800">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Buscar cliente..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs bg-zinc-900 border-zinc-800"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
            {loadingClients ? (
              <p className="p-6 text-center text-xs text-zinc-500">Cargando clientes...</p>
            ) : filteredClients.length === 0 ? (
              <p className="p-6 text-center text-xs text-zinc-500">No se encontraron clientes.</p>
            ) : (
              filteredClients.map(c => {
                const isSelected = activeClient?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveClient(c)}
                    className={`w-full text-left p-3 flex items-center gap-3 transition ${
                      isSelected ? "bg-zinc-900 border-l-4 border-l-[#D6FF2A]" : "hover:bg-zinc-900/50"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-black text-sm shrink-0">
                      {c.name?.[0]?.toUpperCase() || "C"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold truncate ${isSelected ? "text-[#D6FF2A]" : "text-white"}`}>
                        {c.name}
                      </p>
                      <p className="text-[11px] text-zinc-500 truncate">{c.email}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden">
          {activeClient ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D6FF2A] text-black flex items-center justify-center font-black text-sm">
                    {activeClient.name?.[0]?.toUpperCase() || "C"}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{activeClient.name}</p>
                    <p className="text-[11px] text-zinc-400">{activeClient.email}</p>
                  </div>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#080808]">
                {!activeClient.userId ? (
                  <div className="py-12 text-center text-xs text-zinc-500 space-y-1">
                    <p className="font-bold text-zinc-400">Este cliente aún no ha creado su cuenta de usuario.</p>
                    <p>Cuando se registre con el email {activeClient.email}, podrán intercambiar mensajes aquí.</p>
                  </div>
                ) : msgs.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-500">
                    Aún no hay mensajes en esta conversación. Escribí el primero para comenzar el seguimiento.
                  </div>
                ) : (
                  msgs.map(m => {
                    const isMe = m.senderId === meId;
                    return (
                      <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs space-y-1 ${
                            isMe
                              ? "bg-[#D6FF2A] text-black rounded-br-none font-medium"
                              : "bg-zinc-900 text-white border border-zinc-800 rounded-bl-none"
                          }`}
                        >
                          {m.content.startsWith("/uploads/") ? (
                            /\.(jpg|jpeg|png|webp|gif)$/i.test(m.content) ? (
                              <img src={m.content} alt="Adjunto" className="rounded-xl max-w-[220px] max-h-[220px] object-cover" />
                            ) : (
                              <a href={m.content} target="_blank" rel="noreferrer" className="underline font-bold block">
                                Ver archivo adjunto ↗
                              </a>
                            )
                          ) : (
                            <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                          )}
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
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies & Input */}
              {activeClient.userId && (
                <div className="p-3 border-t border-zinc-800 bg-zinc-950 space-y-2">
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {quickReplies.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 items-center">
                    <MessageFileButton onFile={url => handleSend(url)} />
                    <Input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder={`Escribir a ${activeClient.name}...`}
                      onKeyDown={e => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      className="h-11 text-xs bg-zinc-900 border-zinc-800 text-white"
                      disabled={loading}
                    />
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => handleSend()}
                      disabled={loading || !input.trim()}
                      className="h-11 px-4 font-bold"
                    >
                      <Send size={15} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center p-6 space-y-2 text-zinc-500">
              <MessageCircle size={32} />
              <p className="text-sm font-bold text-zinc-400">Seleccioná un cliente</p>
              <p className="text-xs">Elegí un cliente de la lista para ver su conversación.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
