import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertTrainerOwnsClient } from "@/lib/authorization";

const PLAN_LABELS: Record<string, string> = {
  BASICO: "Básico",
  PERSONALIZADO: "Personalizado",
  PREMIUM: "Premium",
};

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "TRAINER") {
    return NextResponse.json({ error: "Solo un trainer puede iniciar un checkout" }, { status: 403 });
  }

  const body = await req.json().catch(() => null) as { clientId?: string; amount?: number; provider?: string; description?: string } | null;
  const clientId = typeof body?.clientId === "string" ? body.clientId : "";
  const amount = typeof body?.amount === "number" ? body.amount : Number(body?.amount);
  const provider = String(body?.provider || "").toLowerCase();
  const description = typeof body?.description === "string" ? body.description.trim().slice(0, 500) : "";

  if (!clientId || !Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) {
    return NextResponse.json({ error: "Cliente e importe válidos son obligatorios" }, { status: 400 });
  }
  if (provider !== "stripe" && provider !== "mercadopago") {
    return NextResponse.json({ error: "Proveedor de checkout inválido" }, { status: 400 });
  }
  if (!(await assertTrainerOwnsClient(session.id, clientId))) {
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  }

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true, name: true, email: true, plan: true },
  });
  if (!client) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

  const localPayment = await prisma.payment.create({
    data: {
      clientId: client.id,
      email: client.email,
      amount,
      currency: provider === "mercadopago" ? "ARS" : String(process.env.STRIPE_CHECKOUT_CURRENCY || "ARS").toUpperCase(),
      status: "PENDIENTE",
      method: provider === "stripe" ? "STRIPE" : "MERCADOPAGO",
      description: description || `${PLAN_LABELS[client.plan] || "Plan"} · checkout ${provider}`,
    },
  });

  const origin = new URL(req.url).origin;

  try {
    if (provider === "stripe") {
      if (!process.env.STRIPE_SECRET_KEY) {
        await prisma.payment.delete({ where: { id: localPayment.id } });
        return NextResponse.json({ error: "Stripe no está configurado" }, { status: 503 });
      }
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const currency = String(process.env.STRIPE_CHECKOUT_CURRENCY || "ARS").toLowerCase();
      const checkout = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: client.email || undefined,
        line_items: [{
          quantity: 1,
          price_data: {
            currency,
            product_data: { name: description || `${PLAN_LABELS[client.plan] || "Plan"} KinetixFitt` },
            unit_amount: Math.round(amount * 100),
          },
        }],
        metadata: { clientId: client.id, paymentId: localPayment.id },
        success_url: `${origin}/trainer/payments?checkout=success&payment=${localPayment.id}`,
        cancel_url: `${origin}/trainer/payments?checkout=cancel&payment=${localPayment.id}`,
      });
      return NextResponse.json({ provider, url: checkout.url, checkoutId: checkout.id, paymentId: localPayment.id });
    }

    if (!process.env.MP_ACCESS_TOKEN) {
      await prisma.payment.delete({ where: { id: localPayment.id } });
      return NextResponse.json({ error: "Mercado Pago no está configurado" }, { status: 503 });
    }

    const mp = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ title: description || `${PLAN_LABELS[client.plan] || "Plan"} KinetixFitt`, quantity: 1, currency_id: "ARS", unit_price: amount }],
        payer: client.email ? { email: client.email } : undefined,
        external_reference: localPayment.id,
        notification_url: `${origin}/api/payments/webhook`,
        back_urls: {
          success: `${origin}/trainer/payments?checkout=success&payment=${localPayment.id}`,
          failure: `${origin}/trainer/payments?checkout=failure&payment=${localPayment.id}`,
          pending: `${origin}/trainer/payments?checkout=pending&payment=${localPayment.id}`,
        },
        auto_return: "approved",
      }),
    });
    const data = await mp.json().catch(() => null) as { init_point?: string; id?: string; message?: string } | null;
    if (!mp.ok || !data?.init_point) {
      await prisma.payment.delete({ where: { id: localPayment.id } });
      return NextResponse.json({ error: data?.message || "Mercado Pago no pudo crear el checkout" }, { status: 502 });
    }
    return NextResponse.json({ provider, url: data.init_point, checkoutId: data.id, paymentId: localPayment.id });
  } catch (error) {
    await prisma.payment.delete({ where: { id: localPayment.id } }).catch(() => {});
    console.error("[PAYMENTS_CHECKOUT]", error);
    return NextResponse.json({ error: "No se pudo iniciar el checkout" }, { status: 502 });
  }
}
