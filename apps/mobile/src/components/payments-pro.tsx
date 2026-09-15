"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { CreditCard, Check, AlertTriangle } from "lucide-react";
import { capture } from "@/lib/posthog";

const PLANS = [
  { id: "basico", name: "Plan Básico", price: 25000, features: ["Rutina 3D", "Check-in mensual", "Chat"] },
  { id: "personalizado", name: "Personalizado", price: 45000, features: ["Rutina 5D", "Check-in semanal", "Chat + video", "Nutrición"] },
  { id: "premium", name: "Premium", price: 75000, features: ["Todo Personalizado", "1:1 semanal", "Plan nutrición", "Prioridad"] },
];

export function PaymentsPro({ onSelect }: { onSelect?: (plan: string) => void }) {
  const [selected, setSelected] = useState("personalizado");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function requestCheckout() {
    const plan = PLANS.find((item) => item.id === selected);
    if (!plan) return;

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setMessage("Ingresá un email válido para solicitar el checkout.");
      return;
    }

    capture("checkout_requested", {
      plan: selected,
      price: plan.price,
      currency: "ARS",
    } as Record<string, unknown>);
    setMessage("El checkout online todavía no está conectado a un proveedor de pago real. No se simuló ningún cobro.");
    onSelect?.(selected);
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard size={18} className="text-primary" />
          Pagos
          <Badge variant="warn">Integración pendiente</Badge>
        </CardTitle>
        <p className="text-xs text-zinc-500">Los planes están preparados, pero el cobro real debe pasar por el backend y su webhook verificado.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          {PLANS.map((plan) => {
            const isSelected = selected === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => {
                  setSelected(plan.id);
                  capture("checkout_plan_selected", { plan: plan.id, price: plan.price } as Record<string, unknown>);
                  setMessage(null);
                }}
                className={`text-left p-3 rounded-xl border flex justify-between items-center transition-colors ${isSelected ? "bg-primary text-black border-primary" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"}`}
              >
                <div>
                  <p className={`font-bold text-sm ${isSelected ? "text-black" : "text-white"}`}>
                    {plan.name} {isSelected && <Check size={12} className="inline ml-1" />}
                  </p>
                  <p className={`text-xs ${isSelected ? "text-black/70" : "text-zinc-500"}`}>{plan.features.join(" • ")}</p>
                </div>
                <span className={`font-black ${isSelected ? "text-black" : "text-white"}`}>${plan.price.toLocaleString("es-AR")}</span>
              </button>
            );
          })}
        </div>
        <div>
          <Label htmlFor="checkout-email">Email para checkout</Label>
          <Input id="checkout-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setMessage(null); }} placeholder="cliente@email.com" autoComplete="email" />
        </div>
        {message && (
          <div role="status" className="flex gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs text-amber-200">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <span>{message}</span>
          </div>
        )}
        <Button variant="accent" className="h-11 w-full font-black" onClick={requestCheckout}>
          Solicitar checkout seguro →
        </Button>
        <p className="text-[11px] text-zinc-600 text-center">No se simulan pagos ni se marcan como completados desde el cliente.</p>
      </CardContent>
    </Card>
  );
}
