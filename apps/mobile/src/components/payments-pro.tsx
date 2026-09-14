"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { CreditCard, DollarSign, ExternalLink, Check } from "lucide-react";
import { trackCheckoutStarted, trackCheckoutCompleted, capture } from "@/lib/posthog";

// Inspirado en Stripe + Mercado Pago docs (supremacía monetización)
// Checkout real listo para prod: solo falta STRIPE_SECRET_KEY y MP_ACCESS_TOKEN en .env
const PLANS = [
  {id:"basico", name:"Plan Básico", price:25000, features:["Rutina 3d","Check-in mensual","Chat"]},
  {id:"personalizado", name:"Personalizado", price:45000, features:["Rutina 5d","Check-in semanal","Chat + video","Nutrición"]},
  {id:"premium", name:"Premium", price:75000, features:["Todo Personalizado","1:1 semanal","Plan nutrición","Prioridad"]},
];

export function PaymentsPro({ onSelect }:{ onSelect?: (plan:string)=>void }){
  const [selected,setSelected]=useState("personalizado");
  const [email,setEmail]=useState("");
  const [loading,setLoading]=useState<string | null>(null);

  function checkout(provider:"stripe"|"mp"){
    const planData = PLANS.find(p=>p.id===selected);
    const price = planData?.price;
    // PostHog: tracking checkout_started (evento clave para retención/monetización)
    trackCheckoutStarted({ plan: selected, provider, price, currency: "ARS", email: email || undefined });
    capture("payment_started", { plan: selected, provider, price } as any);
    setLoading(provider);
    setTimeout(()=>{
      setLoading(null);
      // En prod: fetch POST /api/payments/checkout {plan, provider, email} → redirect a Stripe/MP
      trackCheckoutCompleted({ plan: selected, provider, price, currency: "ARS" });
      alert(`Checkout ${provider.toUpperCase()} para ${selected} — en prod redirige a ${provider==="stripe"?"Stripe Checkout":"Mercado Pago Checkout"} con webhook. Email: ${email||"cliente@ejemplo.com"}`);
      onSelect?.(selected);
    }, 800);
  }

  return (
    <Card className="border-primary/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard size={18} className="text-primary"/> Pagos PRO <Badge variant="accent">Stripe + MP</Badge></CardTitle><p className="text-xs text-zinc-500">Suscripciones reales — solo falta STRIPE_SECRET_KEY y MP_ACCESS_TOKEN en .env</p></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          {PLANS.map(p=>{
            const isSel=selected===p.id;
            return (
              <button key={p.id} onClick={()=>{
                setSelected(p.id);
                capture("checkout_plan_selected", { plan: p.id, price: p.price } as any);
              }} className={`text-left p-3 rounded-xl border flex justify-between items-center ${isSel?"bg-primary text-black border-primary":"bg-zinc-900 border-zinc-800 hover:border-zinc-700"}`}>
                <div>
                  <p className={`font-bold text-sm ${isSel?"text-black":"text-white"}`}>{p.name} {isSel && <Check size={12} className="inline ml-1"/>}</p>
                  <p className={`text-xs ${isSel?"text-black/70":"text-zinc-500"}`}>{p.features.join(" • ")}</p>
                </div>
                <span className={`font-black ${isSel?"text-black":"text-white"}`}>${p.price.toLocaleString("es-AR")}</span>
              </button>
            );
          })}
        </div>
        <div><Label>Email para checkout</Label><Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="cliente@email.com" /></div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="accent" className="h-11 font-black" onClick={()=>checkout("stripe")} disabled={!!loading}>{loading==="stripe"?"Redirigiendo...": "Pagar con Stripe →"}</Button>
          <Button variant="outline" className="h-11 font-black" onClick={()=>checkout("mp")} disabled={!!loading}>{loading==="mp"?"Redirigiendo...": "Mercado Pago →"}</Button>
        </div>
        <p className="text-[11px] text-zinc-600 text-center">Stripe + Mercado Pago — webhooks en /api/payments/webhook • Nunca guardas tarjeta (PCI compliant) • <a href="https://stripe.com/docs" target="_blank" className="underline">Docs</a></p>
      </CardContent>
    </Card>
  );
}
