import { NextResponse } from "next/server";
import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

function constantTimeHexEqual(a: string, b: string) {
  const aa = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

function verifyMpSignature(req: Request, dataId: string | null, secret: string) {
  const signature = req.headers.get("x-signature");
  const requestId = req.headers.get("x-request-id");
  if (!signature || !secret) return false;
  const parts = Object.fromEntries(signature.split(",").map((part) => {
    const index = part.indexOf("=");
    return index >= 0 ? [part.slice(0, index).trim(), part.slice(index + 1).trim()] : [part.trim(), ""];
  }));
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!v1 || !ts) return false;
  const manifestParts: string[] = [];
  if (dataId) manifestParts.push(`id:${dataId};`);
  if (requestId) manifestParts.push(`request-id:${requestId};`);
  manifestParts.push(`ts:${ts};`);
  const manifest = manifestParts.join("");
  const digest = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
  return constantTimeHexEqual(digest, v1);
}

async function claimEvent(provider: "stripe" | "mercadopago", eventId: string) {
  const inserted = await prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`
    INSERT INTO "PaymentWebhookEvent" ("id", "provider", "eventId")
    VALUES (${crypto.randomUUID()}, ${provider}, ${eventId})
    ON CONFLICT ("provider", "eventId") DO NOTHING
    RETURNING "id"
  `);
  return inserted.length > 0;
}

function subscriptionStatus(status: string) {
  if (status === "active" || status === "trialing") return "ACTIVA" as const;
  if (status === "canceled") return "CANCELADA" as const;
  if (status === "past_due" || status === "unpaid" || status === "incomplete_expired") return "VENCIDA" as const;
  return "PENDIENTE" as const;
}

async function settlePayment(input: {
  paymentId?: string | null;
  clientId?: string | null;
  status: "PAGADO" | "PENDIENTE" | "VENCIDO";
  method: string;
  externalDescription: string;
  amount?: number | null;
}) {
  const where = input.paymentId
    ? { id: input.paymentId }
    : input.clientId
      ? { clientId: input.clientId, status: "PENDIENTE" as const }
      : null;
  if (!where) return;

  await prisma.payment.updateMany({
    where,
    data: {
      status: input.status,
      method: input.method,
      ...(input.amount && Number.isFinite(input.amount) && input.amount > 0 ? { amount: input.amount } : {}),
      description: input.externalDescription.slice(0, 500),
    },
  });

  if (input.status === "PAGADO" && input.clientId) {
    const subscription = await prisma.subscription.findUnique({ where: { clientId: input.clientId } });
    if (subscription) {
      const nextPayment = new Date();
      nextPayment.setDate(nextPayment.getDate() + 30);
      await prisma.subscription.update({
        where: { clientId: input.clientId },
        data: { status: "ACTIVA", nextPayment, ...(input.amount ? { price: input.amount } : {}) },
      });
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const url = new URL(req.url);
    const stripeSignature = req.headers.get("stripe-signature");
    const mpSignature = req.headers.get("x-signature");

    if (stripeSignature) {
      if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Stripe no configurado" }, { status: 500 });
      }
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      let event: import("stripe").default.Event;
      try {
        event = stripe.webhooks.constructEvent(body, stripeSignature, process.env.STRIPE_WEBHOOK_SECRET);
      } catch {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }

      if (!(await claimEvent("stripe", event.id))) {
        return NextResponse.json({ received: true, duplicate: true });
      }

      const payload = event.data.object as unknown as Record<string, any>;
      switch (event.type) {
        case "checkout.session.completed":
        case "checkout.session.async_payment_succeeded": {
          const clientId = typeof payload.metadata?.clientId === "string" ? payload.metadata.clientId : null;
          const paymentId = typeof payload.metadata?.paymentId === "string" ? payload.metadata.paymentId : null;
          await settlePayment({
            paymentId,
            clientId,
            status: "PAGADO",
            method: "STRIPE",
            externalDescription: `Pago vía Stripe · ${event.id}`,
            amount: typeof payload.amount_total === "number" ? payload.amount_total / 100 : null,
          });
          break;
        }
        case "payment_intent.succeeded": {
          const clientId = typeof payload.metadata?.clientId === "string" ? payload.metadata.clientId : null;
          const paymentId = typeof payload.metadata?.paymentId === "string" ? payload.metadata.paymentId : null;
          await settlePayment({
            paymentId,
            clientId,
            status: "PAGADO",
            method: "STRIPE",
            externalDescription: `PaymentIntent · ${event.id}`,
            amount: typeof payload.amount_received === "number" ? payload.amount_received / 100 : null,
          });
          break;
        }
        case "payment_intent.payment_failed": {
          const clientId = typeof payload.metadata?.clientId === "string" ? payload.metadata.clientId : null;
          const paymentId = typeof payload.metadata?.paymentId === "string" ? payload.metadata.paymentId : null;
          await settlePayment({ paymentId, clientId, status: "VENCIDO", method: "STRIPE", externalDescription: `Pago rechazado · ${event.id}` });
          break;
        }
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const clientId = typeof payload.metadata?.clientId === "string" ? payload.metadata.clientId : null;
          if (clientId) {
            await prisma.subscription.updateMany({
              where: { clientId },
              data: {
                status: subscriptionStatus(String(payload.status || (event.type.endsWith("deleted") ? "canceled" : "unknown"))),
                ...(typeof payload.current_period_end === "number" ? { nextPayment: new Date(payload.current_period_end * 1000) } : {}),
              },
            });
          }
          break;
        }
        default:
          break;
      }
      return NextResponse.json({ received: true });
    }

    if (mpSignature) {
      const secret = process.env.MP_WEBHOOK_SECRET;
      if (!secret) return NextResponse.json({ error: "MP no configurado" }, { status: 500 });
      const dataId = url.searchParams.get("data.id") || url.searchParams.get("data_id");
      if (!verifyMpSignature(req, dataId, secret)) {
        return NextResponse.json({ error: "Invalid MP signature" }, { status: 401 });
      }
      let data: Record<string, any>;
      try { data = JSON.parse(body); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
      const eventId = data.id != null ? String(data.id) : `${data.type || "unknown"}:${dataId || "unknown"}:${data.action || "unknown"}`;
      if (!(await claimEvent("mercadopago", eventId))) {
        return NextResponse.json({ received: true, duplicate: true });
      }

      if (data.type === "payment" && dataId && process.env.MP_ACCESS_TOKEN) {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(dataId)}`, {
          headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
          cache: "no-store",
        });
        if (response.ok) {
          const payment = await response.json() as Record<string, any>;
          const externalReference = typeof payment.external_reference === "string" ? payment.external_reference : null;
          const status = payment.status === "approved" ? "PAGADO" : payment.status === "pending" || payment.status === "in_process" ? "PENDIENTE" : "VENCIDO";
          await settlePayment({
            paymentId: externalReference,
            status,
            method: "MERCADOPAGO",
            externalDescription: `Mercado Pago · ${dataId}`,
            amount: typeof payment.transaction_amount === "number" ? payment.transaction_amount : null,
          });
        }
      }
      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK] processing failed", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", providers: ["stripe", "mercadopago"] });
}
