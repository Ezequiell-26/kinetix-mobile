import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BRAND } from "@/constants/branding";
import { Button } from "@/components/ui/button";
import { Lock, Users, WalletCards } from "lucide-react";
import { PaymentsPro } from "@/components/payments-pro";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PaymentsPage() {
  const session = await getSession();
  if (!session || session.role !== "TRAINER") {
    return <div className="py-16 text-center text-sm text-zinc-500">No autorizado.</div>;
  }

  const [clients, subs, pays] = await Promise.all([
    prisma.client.findMany({
      where: { trainerId: session.id },
      select: { id: true, name: true, email: true, plan: true },
      orderBy: { name: "asc" },
    }).catch(() => []),
    prisma.subscription.findMany({
      where: { client: { trainerId: session.id } },
      include: { client: { select: { id: true, name: true, trainerId: true } } },
      orderBy: { nextPayment: "asc" },
    }).catch(() => []),
    prisma.payment.findMany({
      where: { client: { trainerId: session.id } },
      orderBy: { date: "desc" },
      take: 50,
      include: { client: { select: { name: true, email: true, trainerId: true } } },
    }).catch(() => []),
  ]);

  const paidTotal = pays.filter((payment) => payment.status === "PAGADO").reduce((sum, payment) => sum + payment.amount, 0);
  const pendingTotal = pays.filter((payment) => payment.status === "PENDIENTE").reduce((sum, payment) => sum + payment.amount, 0);
  const activeSubscriptions = subs.filter((subscription) => subscription.status === "ACTIVA").length;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.06] bg-[#0B151E] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.2)] sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-primary/[0.08] blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">KinetixFitt Business</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Pagos y suscripciones</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Centralizá cobros, suscripciones y movimientos de tus clientes desde un único panel.</p>
          </div>
          <Link href="/trainer/clients"><Button variant="outline" className="gap-2 border-white/[0.08] bg-white/[0.02]"><Users size={15} /> Ver clientes</Button></Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0B151E] p-4"><p className="text-xs text-zinc-500">Cobrado registrado</p><p className="mt-1 text-2xl font-black text-white">${paidTotal.toLocaleString("es-AR")} <span className="text-xs font-semibold text-zinc-600">ARS</span></p></div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#0B151E] p-4"><p className="text-xs text-zinc-500">Pendiente</p><p className="mt-1 text-2xl font-black text-amber-200">${pendingTotal.toLocaleString("es-AR")} <span className="text-xs font-semibold text-zinc-600">ARS</span></p></div>
        <div className="rounded-2xl border border-primary/15 bg-primary/[0.035] p-4"><p className="text-xs text-zinc-500">Suscripciones activas</p><p className="mt-1 flex items-center gap-2 text-2xl font-black text-white"><WalletCards size={20} className="text-primary" />{activeSubscriptions}<span className="text-xs font-semibold text-zinc-600">clientes</span></p></div>
      </section>

      <PaymentsPro clients={clients} />

      <Card className="border-primary/20 bg-[#0B151E]">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2 text-white">Planes de referencia <Badge variant="success">Configuración actual</Badge></CardTitle>
          <p className="text-xs text-zinc-500">Estos importes sirven como referencia para registrar cobros. El checkout online requiere configuración de proveedor y webhook.</p>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {[
            { plan: "BÁSICO", price: 12000, desc: "Seguimiento básico" },
            { plan: "PERSONALIZADO", price: 18000, desc: "Programa a medida", featured: true },
            { plan: "PREMIUM", price: 25000, desc: "Coaching 1:1 + ajustes semanales" },
          ].map((plan) => (
            <div key={plan.plan} className="rounded-2xl border border-white/[0.06] bg-[#081119] p-4" style={plan.featured ? { borderColor: BRAND.colors.lime, backgroundColor: `${BRAND.colors.lime}0A` } : undefined}>
              <p className="text-sm font-black text-white">{plan.plan}</p>
              <p className="mt-1 text-2xl font-black text-white">${plan.price.toLocaleString("es-AR")} <span className="text-xs text-zinc-600">ARS</span></p>
              <p className="mt-1 text-xs text-zinc-500">{plan.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-[#0B151E]">
        <CardHeader><CardTitle className="text-white">Suscripciones de tus clientes</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {subs.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-500">No hay suscripciones registradas todavía.</p>
          ) : (
            subs.map((subscription) => (
              <div key={subscription.id} className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="text-sm font-semibold text-white">{subscription.client?.name || "Cliente"}</p><p className="text-xs text-zinc-500">{subscription.plan} • ${subscription.price?.toLocaleString("es-AR") || "—"}</p></div>
                <div className="text-left sm:text-right"><Badge variant="success">{subscription.status}</Badge><p className="mt-1 text-xs text-zinc-500">{subscription.nextPayment ? `Próximo pago ${new Date(subscription.nextPayment).toLocaleDateString("es-AR")}` : "Sin fecha de próximo pago"}</p></div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#0B151E]">
        <CardHeader><CardTitle className="text-white">Historial de pagos</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {pays.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-500">No hay pagos registrados todavía.</p>
          ) : (
            pays.map((payment) => (
              <div key={payment.id} className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div><p className="text-white">{payment.client?.name || payment.email || "Cliente"}</p><p className="text-xs text-zinc-500">{payment.method || "Método pendiente"} • {new Date(payment.date).toLocaleDateString("es-AR")}</p></div>
                <div className="flex items-center gap-3"><span className="font-bold text-white">${payment.amount.toLocaleString("es-AR")}</span><Badge variant={payment.status === "PAGADO" ? "success" : "warn"}>{payment.status}</Badge></div>
              </div>
            ))
          )}
          <p className="pt-2 text-center text-xs text-zinc-600"><Lock size={11} className="mr-1 inline -mt-0.5" />No se almacenan datos de tarjeta.</p>
        </CardContent>
      </Card>
    </div>
  );
}
