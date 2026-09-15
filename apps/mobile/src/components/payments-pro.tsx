"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { Check, CreditCard, ExternalLink, Loader2, ReceiptText } from "lucide-react";
import { capture } from "@/lib/posthog";

type ClientOption = { id: string; name: string; email?: string | null; plan?: string | null };
type PaymentsProProps = { clients?: ClientOption[] };
const METHODS = [
  { value: "TRANSFERENCIA", label: "Transferencia", online: false },
  { value: "EFECTIVO", label: "Efectivo", online: false },
  { value: "TARJETA", label: "Tarjeta", online: false },
  { value: "MERCADOPAGO", label: "Mercado Pago", online: true },
  { value: "STRIPE", label: "Stripe", online: true },
] as const;
const PLANS = [
  { id: "BASICO", name: "Básico", price: 12000 },
  { id: "PERSONALIZADO", name: "Personalizado", price: 18000 },
  { id: "PREMIUM", name: "Premium", price: 25000 },
];
function formatARS(value: number) { return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(value); }

export function PaymentsPro({ clients = [] }: PaymentsProProps) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [amount, setAmount] = useState(String(PLANS[1].price));
  const [method, setMethod] = useState<(typeof METHODS)[number]["value"]>("TRANSFERENCIA");
  const [status, setStatus] = useState<"PAGADO" | "PENDIENTE">("PAGADO");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const selectedClient = useMemo(() => clients.find((client) => client.id === clientId), [clients, clientId]);
  const online = method === "STRIPE" || method === "MERCADOPAGO";
  function clearFeedback() { setMessage(null); setError(null); }

  async function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); clearFeedback();
    const numericAmount = Number(amount);
    if (!clientId) return setError("Seleccioná un cliente.");
    if (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > 1_000_000) return setError("Ingresá un importe válido entre $1 y $1.000.000 ARS.");
    setSubmitting(true);
    try {
      if (online) {
        const response = await fetch("/api/payments/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId, amount: Math.round(numericAmount), provider: method === "STRIPE" ? "stripe" : "mercadopago", description: description.trim() || undefined }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.error || "No se pudo iniciar el checkout online.");
        if (!data?.url) throw new Error("El proveedor no devolvió una URL de pago.");
        capture("payment_checkout_started", { provider: method, clientId, amount: Math.round(numericAmount) } as Record<string, unknown>);
        window.location.assign(data.url);
        return;
      }
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, amount: Math.round(numericAmount), method, status, description: description.trim() || undefined }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "No se pudo registrar el pago.");
      capture("payment_registered", { amount: Math.round(numericAmount), method, status, clientId } as Record<string, unknown>);
      setMessage(`Pago registrado para ${selectedClient?.name || "cliente"}`); setDescription("");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "No se pudo procesar el pago.");
    } finally { setSubmitting(false); }
  }

  return <Card className="overflow-hidden border-primary/20 bg-[#0B151E] shadow-[0_20px_80px_rgba(0,0,0,0.22)]">
    <CardHeader className="border-b border-white/[0.06] bg-white/[0.015]"><CardTitle className="flex items-center gap-2 text-white"><ReceiptText size={18} className="text-primary"/> Pagos <Badge variant="success" className="ml-auto">Conectado</Badge></CardTitle><p className="text-xs text-zinc-500">Registrá cobros manuales o abrí un checkout seguro con Stripe o Mercado Pago. La confirmación online llega por webhook.</p></CardHeader>
    <CardContent className="pt-5">
      {clients.length===0?<div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-4 text-sm text-amber-100">No hay clientes disponibles para registrar un cobro.</div>:
      <form onSubmit={submitPayment} className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div><Label htmlFor="payment-client">Cliente</Label><select id="payment-client" value={clientId} onChange={e=>{setClientId(e.target.value);clearFeedback()}} className="mt-1.5 h-11 w-full rounded-xl border border-white/[.08] bg-[#081119] px-3 text-sm text-white outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10">{clients.map(c=><option key={c.id} value={c.id}>{c.name}{c.plan?` · ${c.plan}`:""}</option>)}</select>{selectedClient?.email&&<p className="mt-1.5 text-[11px] text-zinc-600">{selectedClient.email}</p>}</div>
          <div><Label htmlFor="payment-amount">Importe (ARS)</Label><Input id="payment-amount" type="number" min="1" max="1000000" step="1" inputMode="numeric" value={amount} onChange={e=>{setAmount(e.target.value);clearFeedback()}} className="mt-1.5 h-11"/><div className="mt-2 flex flex-wrap gap-2">{PLANS.map(p=><button key={p.id} type="button" onClick={()=>{setAmount(String(p.price));clearFeedback()}} className="rounded-full border border-white/[.07] bg-white/[.025] px-3 py-1.5 text-[11px] font-semibold text-zinc-400 transition hover:border-primary/30 hover:text-primary">{p.name} · ${formatARS(p.price)}</button>)}</div></div>
          <div><Label htmlFor="payment-description">Descripción</Label><Input id="payment-description" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Mensualidad, renovación, plan premium..." maxLength={500} className="mt-1.5 h-11"/></div>
        </div>
        <div className="space-y-4 rounded-2xl border border-white/[.06] bg-white/[.02] p-4">
          <div><Label htmlFor="payment-method">Método</Label><select id="payment-method" value={method} onChange={e=>{setMethod(e.target.value as (typeof METHODS)[number]["value"]);clearFeedback()}} className="mt-1.5 h-11 w-full rounded-xl border border-white/[.08] bg-[#081119] px-3 text-sm text-white outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10">{METHODS.map(m=><option key={m.value} value={m.value}>{m.label}{m.online?" · online":" · manual"}</option>)}</select></div>
          {!online&&<div><Label htmlFor="payment-status">Estado</Label><select id="payment-status" value={status} onChange={e=>setStatus(e.target.value as "PAGADO"|"PENDIENTE")} className="mt-1.5 h-11 w-full rounded-xl border border-white/[.08] bg-[#081119] px-3 text-sm text-white outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"><option value="PAGADO">Pagado</option><option value="PENDIENTE">Pendiente</option></select></div>}
          <div className="rounded-xl border border-primary/15 bg-primary/[.035] p-3"><div className="flex items-center gap-2 text-xs font-bold text-white"><CreditCard size={14} className="text-primary"/>{online?"Checkout del proveedor":"Registro interno"}</div><p className="mt-1 text-[11px] leading-5 text-zinc-500">{online?"Se crea un pago pendiente y se abre el checkout del proveedor. Nunca se almacenan datos de tarjeta.":"El cobro queda registrado en la base de datos del cliente."}</p></div>
          {error&&<div role="alert" className="rounded-xl border border-red-400/20 bg-red-400/[.05] p-3 text-xs text-red-200">{error}</div>}{message&&<div role="status" className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/[.05] p-3 text-xs text-primary"><Check size={15}/>{message}</div>}
          <Button type="submit" variant="accent" className="h-11 w-full font-black" disabled={submitting}>{submitting?<><Loader2 size={16} className="animate-spin"/> {online?"Abriendo checkout...":"Guardando..."}</>:online?<><ExternalLink size={16}/> Pagar online</>:"Registrar pago"}</Button>
        </div>
      </form>}
    </CardContent>
  </Card>;
}
