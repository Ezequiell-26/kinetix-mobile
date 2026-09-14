import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentsPro } from "@/components/payments-pro";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export default async function PaymentsPage() {
  const subs = (await prisma.subscription.findMany({ include: { client: true } }).catch(() => [])) as Array<{
    id: string; client: { name: string } | null; plan: string; status: string; price: number | null; nextPayment: Date;
  }>;
  const pays = (await prisma.payment.findMany({ orderBy: { date: "desc" }, take: 20 }).catch(() => [])) as Array<{
    id: string; email: string | null; amount: number; status: string; method: string | null; date: Date;
  }>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold">Pagos y suscripciones</h1>
          <p className="text-sm text-zinc-500">Preparado para Stripe / Mercado Pago</p>
        </div>
        {subs.length === 0 && pays.length === 0 && (
          <Badge variant="warn">Sin datos de pagos</Badge>
        )}
      </div>

      <PaymentsPro />

      {/* Plan cards */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { plan: "BÁSICO", price: "$12.000 ARS", desc: "Seguimiento básico" },
          { plan: "PERSONALIZADO", price: "$18.000 ARS", desc: "Programa a medida", featured: true },
          { plan: "PREMIUM", price: "$25.000 ARS", desc: "Coaching 1:1 + ajustes semanales" },
        ].map((p) => (
          <Card key={p.plan} className={p.featured ? "border-primary/30 bg-primary/[0.04]" : ""}>
            <CardHeader>
              <CardTitle className="text-sm">{p.plan}</CardTitle>
              <p className="text-2xl font-black">{p.price}</p>
              <p className="text-xs text-zinc-500">{p.desc}</p>
            </CardHeader>
            <CardContent>
              <Button variant={p.featured ? "accent" : "outline"} size="sm" className="w-full">Gestionar</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real subscriptions */}
      <Card>
        <CardHeader><CardTitle>Suscripciones activas</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {subs.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-6">No hay suscripciones registradas todavía.</p>
          ) : (
            subs.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div>
                  <p className="font-semibold text-sm">{s.client?.name}</p>
                  <p className="text-xs text-zinc-500">{s.plan} • ${s.price?.toLocaleString("es-AR")}</p>
                </div>
                <div className="text-right">
                  <Badge variant="success">{s.status}</Badge>
                  <p className="text-xs text-zinc-500 mt-1">Vence {new Date(s.nextPayment).toLocaleDateString("es-AR")}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Real payment history */}
      <Card>
        <CardHeader><CardTitle>Historial de pagos</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {pays.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-6">No hay pagos registrados todavía.</p>
          ) : (
            pays.map((p) => (
              <div key={p.id} className="flex justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm">
                <span>{p.email} • {p.method}</span>
                <span className="font-bold">${p.amount?.toLocaleString("es-AR")}</span>
                <Badge variant="success">{p.status}</Badge>
              </div>
            ))
          )}
          <p className="text-xs text-zinc-500 text-center pt-2"><Lock size={11} className="inline mr-1 -mt-0.5" />No se almacenan datos de tarjeta. Integración vía backend seguro.</p>
        </CardContent>
      </Card>
    </div>
  );
}