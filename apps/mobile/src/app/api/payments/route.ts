import { NextResponse } from "next/server";
import type { PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { assertTrainerOwnsClient } from "@/lib/authorization";
import { paymentSchema } from "@/lib/validations";

/**
 * API de Pagos - gestión de pagos y suscripciones.
 *
 * Las lecturas de trainer siempre están acotadas por Client.trainerId.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (session.role !== "TRAINER") {
    return NextResponse.json({ error: "Solo trainers pueden registrar pagos" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = paymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || "Datos inválidos" }, { status: 400 });
    }
    const data = parsed.data;

    const ownsClient = await assertTrainerOwnsClient(session.id, data.clientId);
    if (!ownsClient) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

    const client = await prisma.client.findUnique({
      where: { id: data.clientId },
      include: { subscription: true },
    });
    if (!client) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

    const payment = await prisma.payment.create({
      data: {
        clientId: data.clientId,
        email: client.email,
        amount: data.amount,
        currency: "ARS",
        status: data.status,
        method: data.method,
        description: data.description || `Pago de ${client.plan || "servicio"}`,
      },
      include: {
        client: { select: { id: true, name: true, email: true, plan: true } },
      },
    });

    if (data.status === "PAGADO" && client.subscription) {
      const nextPayment = new Date();
      nextPayment.setDate(nextPayment.getDate() + 30);
      await prisma.subscription.update({
        where: { clientId: data.clientId },
        data: { status: "ACTIVA", nextPayment, price: data.amount },
      });
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("[PAYMENTS] Error al crear pago:", error);
    return NextResponse.json({ error: "Error al registrar pago" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId");
  const statusParam = url.searchParams.get("status");
  const status = statusParam as PaymentStatus | null;

  try {
    if (session.role === "CLIENT") {
      const client = await prisma.client.findFirst({
        where: { OR: [{ userId: session.id }, { email: session.email }] },
      });
      if (!client) return NextResponse.json([]);

      const payments = await prisma.payment.findMany({
        where: { clientId: client.id, ...(status ? { status } : {}) },
        orderBy: { date: "desc" },
        take: 50,
      });
      return NextResponse.json(payments);
    }

    if (session.role !== "TRAINER") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    if (clientId) {
      const ownsClient = await assertTrainerOwnsClient(session.id, clientId);
      if (!ownsClient) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

      const whereClause: { clientId: string; status?: PaymentStatus } = { clientId };
      if (status) whereClause.status = status;

      const payments = await prisma.payment.findMany({
        where: whereClause,
        orderBy: { date: "desc" },
        take: 50,
        include: { client: { select: { name: true, email: true } } },
      });
      return NextResponse.json(payments);
    }

    // P0 security: jamás devolver pagos de otros trainers.
    const payments = await prisma.payment.findMany({
      where: {
        client: { trainerId: session.id },
        ...(status ? { status } : {}),
      },
      orderBy: { date: "desc" },
      take: 100,
      include: { client: { select: { name: true, email: true, plan: true } } },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("[PAYMENTS] Error al obtener pagos:", error);
    return NextResponse.json({ error: "Error al obtener pagos" }, { status: 500 });
  }
}
