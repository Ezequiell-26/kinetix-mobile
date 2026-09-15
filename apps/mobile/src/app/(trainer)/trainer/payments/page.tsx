import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BRAND } from "@/constants/branding";
import { Button } from "@/components/ui/button";
import { Lock, Users } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PaymentsPage() {
  const session = await getSession();
  if (!session || session.role !== "TRAINER") {
    return (
      <div className="py-16 text-center text-sm text-zinc-500">No autorizado.</div>
    );
  }

  const [subs, pays] = await Promise.all([
    prisma.subscription
      .findMany({
        where: { client: { trainerId: session.id } },
        include: { client: { select: { id: true, name: true, trainerId: true } } },
        orderBy: { nextPayment: "asc" },
      })
      .catch(() => []),
    prisma.payment
      .findMany({
        where: { client: { trainerId: session.id } },
        orderBy: { date: "desc" },
        take: 50,
        include: { client: { select: { name: true, email: true, trainerId: true } } },
      })
      .catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Pagos y suscripciones</h1>
          <p className="text-sm text-zinc-500">Solo ves la información financiera de tus propios clientes.</p>
        </div>
        <Link href="/trainer/clients">
          <Button variant="outline" className="gap-2"><Users size={15} /> Ver clientes</Button>
        </Link>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Cobros online <Badge variant="warn">Backend de checkout pendiente</Badge></CardTitle>
          <p className="text-xs text-zinc-500">Stripe y Mercado Pago todavía no están conectados como checkout real. La interfaz no simula cobros.</p>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {[
            { plan: "BÁSICO", price: 12000, desc: "Seguimiento básico" },
            { plan: "PERSONALIZADO", price: 18000, desc: "Programa a medida", featured: true },
            { plan: "PREMIUM", price: 25000, desc: "Coaching 1:1 + ajustes semanales" },
          ].map((plan) => (
            <div key={plan.plan} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4" style={plan.featured ? { borderColor: BRAND.colors.lime, backgroundColor: `${BRAND.colors.lime}0A` } : undefined}>
              <p className="text-sm font-black">{plan.plan}</p>
              <p className="mt-1 text-2xl font-black">${plan.price.toLocaleString("es-AR")} ARS</p>
              <p className="mt-1 text-xs text-zinc-500">{plan.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Suscripciones de tus clientes</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {subs.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-500">No hay suscripciones registradas todavía.</p>
          ) : (
            subs.map((subscription) => (
              <div key={subscription.id} className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">{subscription.client?.name || "Cliente"}</p>
                  <p className="text-xs text-zinc-500">{subscription.plan} • ${subscription.price?.toLocaleString("es-AR") || "—"}</p>
                </div>
                <div className="text-left sm:text-right">
                  <Badge variant="success">{subscription.status}</Badge>
                  <p className="mt-1 text-xs text-zinc-500">
                    {subscription.nextPayment ? `Próximo pago ${new Date(subscription.nextPayment).toLocaleDateString("es-AR")}` : "Sin fecha de próximo pago"}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Historial de pagos</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {pays.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-500">No hay pagos registrados todavía.</p>
          ) : (
            pays.map((payment) => (
              <div key={payment.id} className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p>{payment.client?.name || payment.email || "Cliente"}</p>
                  <p className="text-xs text-zinc-500">{payment.method || "Método pendiente"} • {new Date(payment.date).toLocaleDateString("es-AR")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">${payment.amount.toLocaleString("es-AR")}</span>
                  <Badge variant={payment.status === "PAGADO" ? "success" : "warn"}>{payment.status}</Badge>
                </div>
              </div>
            ))
          )}
          <p className="pt-2 text-center text-xs text-zinc-500"><Lock size={11} className="mr-1 inline -mt-0.5" />No se almacenan datos de tarjeta.</p>
        </CardContent>
      </Card>
    </div>
  );
}
