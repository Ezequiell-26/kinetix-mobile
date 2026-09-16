"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageFileButton } from "@/components/file-upload";
import { Search, Send, MessageCircle, ArrowLeft, Check, CheckCheck, Paperclip } from "lucide-react";

const quickReplies = ["Excelente trabajo esta semana", "Subamos 2.5kg en la próxima sesión.", "Mantené el RIR controlado y descansá 90s.", "Grabate un video de la serie pesada y enviamelo."];

type ClientWithUnread = { id: string; name: string; email: string; userId?: string | null; unreadCount?: number };
type Msg = { id: string; senderId: string; receiverId: string; content: string; createdAt: string; read: boolean };

export default function TrainerMessagesPage() {
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
  const [error, setError] = useState<string | null>(null);
  const [showListOnMobile, setShowListOnMobile] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function loadInitial() {
    setLoadingClients(true); setError(null);
    try {
      const [clientsRes, meRes] = await Promise.all([fetch("/api/clients", { cache: "no-store" }), fetch("/api/auth/me", { cache: "no-store" }).then(r => r.json()).catch(() => null)]);
      if (meRes?.user?.id) setMeId(meRes.user.id);
      const clientsData = await clientsRes.json().catch(() => null);
      if (!clientsRes.ok) throw new Error(clientsData?.error || "No se pudieron cargar los clientes.");
      const items = Array.isArray(clientsData) ? clientsData : Array.isArray(clientsData?.items) ? clientsData.items : [];
      setClients(items);
      const found = targetWithUserId ? items.find((c: ClientWithUnread) => c.userId === targetWithUserId) : null;
      const selected = found || items[0] || null;
      setActiveClient(selected);
      if (found) setShowListOnMobile(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudieron cargar los clientes.");
    } finally { setLoadingClients(false); }
  }

  async function loadMsgs() {
    if (!activeClient?.userId) return;
    try {
      const res = await fetch(`/api/messages?with=${encodeURIComponent(activeClient.userId)}`, { cache: "no-store" });
      const data = await res.json().catch(() => []);
      if (res.ok && Array.isArray(data)) setMsgs(data);
    } catch {}
  }

  useEffect(() => { void loadInitial(); }, [targetWithUserId]);
  useEffect(() => {
    if (!activeClient?.userId) { setMsgs([]); return; }
    void loadMsgs();
    const interval = setInterval(() => { void loadMsgs(); }, 5000);
    return () => clearInterval(interval);
  }, [activeClient?.userId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function handleSend(textToSend?: string) {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || !activeClient?.userId || loading) return;
    setLoading(true); setError(null); setInput("");
    const tempMsg: Msg = { id: `tmp-${Date.now()}`, senderId: meId, receiverId: activeClient.userId, content: messageContent, createdAt: new Date().toISOString(), read: false };
    setMsgs((prev) => [...prev, tempMsg]);
    try {
      const res = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ receiverId: activeClient.userId, clientId: activeClient.id, content: messageContent }) });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "No se pudo enviar el mensaje.");
      setMsgs((prev) => prev.filter((msg) => msg.id !== tempMsg.id).concat(data));
    } catch (cause) {
      setMsgs((prev) => prev.filter((msg) => msg.id !== tempMsg.id));
      setError(cause instanceof Error ? cause.message : "No se pudo enviar el mensaje.");
    } finally { setLoading(false); inputRef.current?.focus(); }
  }

  const filteredClients = clients.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-[calc(100dvh-56px)] flex-col -mx-4 -mt-4 lg:mx-0 lg:mt-0 lg:h-[calc(100dvh-56px-24px)]">
      <div className="shrink-0 px-4 pb-3 pt-4 lg:px-0 lg:pt-0"><h1 className="text-xl font-display font-bold lg:text-2xl">Mensajes</h1><p className="text-xs text-zinc-500">Chat 1:1 con cada cliente • toques rápidos</p></div>
      {error && <div role="alert" className="mx-4 mb-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-200 lg:mx-0">{error}</div>}
      <div className="grid min-h-0 flex-1 gap-4 overflow-hidden lg:grid-cols-[320px_1fr]">
        <Card className={`${showListOnMobile ? "flex" : "hidden lg:flex"} min-h-0 flex-col overflow-hidden rounded-none border-x-0 border-zinc-800 bg-zinc-950 lg:rounded-2xl lg:border`}>
          <div className="shrink-0 border-b border-zinc-800 p-3"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"/><Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar cliente..." className="h-10 border-zinc-800 bg-zinc-900 pl-9"/></div></div>
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
            {loadingClients ? <p className="p-8 text-center text-xs text-zinc-500">Cargando clientes...</p> : filteredClients.length === 0 ? <p className="p-8 text-center text-xs text-zinc-500">No se encontraron clientes.</p> : filteredClients.map((client) => <button key={client.id} onClick={() => { setActiveClient(client); setShowListOnMobile(false); }} className={`flex min-h-[64px] w-full items-center gap-3 p-3.5 text-left transition ${activeClient?.id === client.id ? "border-l-4 border-l-primary bg-zinc-900" : "hover:bg-zinc-900/50"}`}><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-black text-black">{client.name?.[0]?.toUpperCase() || "C"}</div><div className="min-w-0 flex-1"><p className={`truncate text-sm font-bold ${activeClient?.id === client.id ? "text-primary" : "text-white"}`}>{client.name}</p><p className="truncate text-xs text-zinc-500">{client.email}</p></div>{client.unreadCount ? <Badge variant="accent" className="shrink-0 px-2 text-[11px]">{client.unreadCount}</Badge> : null}</button>)}
          </div>
        </Card>
        <Card className={`${showListOnMobile ? "hidden lg:flex" : "flex"} min-h-0 flex-col overflow-hidden rounded-none border-x-0 border-zinc-800 bg-zinc-950 lg:rounded-2xl lg:border`}>
          {activeClient ? <>
            <div className="flex shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-900/80 p-3 backdrop-blur"><button onClick={() => setShowListOnMobile(true)} className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 lg:hidden"><ArrowLeft size={16}/></button><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-black text-black">{activeClient.name?.[0]?.toUpperCase() || "C"}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-white">{activeClient.name}</p><p className="truncate text-xs text-zinc-500">{activeClient.email}</p></div></div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-[#080808] px-3 py-4">
              {!activeClient.userId ? <div className="px-4 py-16 text-center text-xs text-zinc-500"><p className="font-bold text-zinc-400">Cliente aún sin cuenta</p><p className="mt-2">Cuando se registre con <span className="text-white">{activeClient.email}</span> podrán chatear aquí.</p></div> : msgs.length === 0 ? <div className="py-16 text-center text-xs text-zinc-500">Sin mensajes aún. ¡Escribí el primero!</div> : msgs.map((msg) => { const isMe = msg.senderId === meId; return <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}><div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs ${isMe ? "rounded-br-md bg-primary text-black" : "rounded-bl-md border border-zinc-800 bg-zinc-900 text-white"}`}><p className="whitespace-pre-wrap leading-relaxed text-[13px]">{msg.content}</p><div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isMe ? "text-black/60" : "text-zinc-500"}`}><span>{new Date(msg.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</span>{isMe && (msg.read ? <CheckCheck size={12} /> : <Check size={12} />)}</div></div></div>; })}
              <div ref={messagesEndRef}/>
            </div>
            {activeClient.userId && <div className="shrink-0 border-t border-zinc-800 bg-zinc-950"><div className="overflow-x-auto border-b border-zinc-800/50 px-3 py-2"><div className="flex gap-1.5">{quickReplies.map((reply) => <button key={reply} onClick={() => void handleSend(reply)} disabled={loading} className="shrink-0 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 disabled:opacity-50">{reply}</button>)}</div></div><div className="flex items-end gap-2 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:pb-3"><MessageFileButton onFile={(url) => void handleSend(url)} /><Input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder={`A ${activeClient.name}...`} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void handleSend(); } }} className="h-11 flex-1 rounded-xl border-zinc-800 bg-zinc-900 text-[15px]" disabled={loading}/><Button variant="accent" onClick={() => void handleSend()} disabled={loading || !input.trim()} className="h-11 w-11 shrink-0 rounded-xl lg:w-auto lg:px-5"><Send size={18}/><span className="ml-1.5 hidden lg:inline">Enviar</span></Button></div></div>}
          </> : <div className="flex flex-1 flex-col items-center justify-center space-y-3 p-8 text-center text-zinc-500"><MessageCircle size={32}/><p className="text-sm font-bold text-zinc-400">Seleccioná un cliente</p><Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowListOnMobile(true)}>Ver clientes</Button></div>}
        </Card>
      </div>
    </div>
  );
}
