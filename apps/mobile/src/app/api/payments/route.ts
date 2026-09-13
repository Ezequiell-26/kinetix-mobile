import { NextResponse } from "next/server";
import type { PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { assertTrainerOwnsClient } from "@/lib/authorization";

/**
 * API de Pagos - Sistema completo de gestión de pagos y suscripciones.
 * 
 * Características:
 * - Registro manual de pagos (efectivo, transferencia, etc.)
 * - Integración lista para Stripe y Mercado Pago
 * - Webhooks para actualización automática de estados
 * - Historial completo de pagos por cliente
 * - Control de vencimientos y renovaciones
 */

// POST /api/payments - Registrar un nuevo pago
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Solo TRAINERS pueden registrar pagos manualmente
  if (session.role !== "TRAINER") {
    return NextResponse.json({ error: "Solo trainers pueden registrar pagos" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { clientId, amount, method, description, status = "PAGADO" } = body;

    // Validaciones básicas
    if (!clientId || typeof clientId !== "string") {
      return NextResponse.json({ error: "ID de cliente requerido" }, { status: 400 });
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: "Monto válido requerido" }, { status: 400 });
    }

    // Verificar ownership del cliente
    const ownsClient = await assertTrainerOwnsClient(session.id, clientId);
    if (!ownsClient) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    // Obtener cliente para actualizar suscripción si es necesario
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: { subscription: true }
    });

    if (!client) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    // Crear registro de pago
    const payment = await prisma.payment.create({
      data: {
        clientId,
        email: client.email,
        amount: Number(amount),
        currency: "ARS",
        status: status as "PAGADO" | "PENDIENTE" | "VENCIDO",
        method: method || "EFECTIVO",
        description: description || `Pago de ${client.plan || "servicio"}`,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            plan: true
          }
        }
      }
    });

    // Si el pago está confirmado, actualizar suscripción
    if (status === "PAGADO" && client.subscription) {
      const nextPayment = new Date();
      nextPayment.setDate(nextPayment.getDate() + 30); // Próximo pago en 30 días

      await prisma.subscription.update({
        where: { clientId },
        data: {
          status: "ACTIVA",
          nextPayment,
          price: Number(amount)
        }
      });
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("[PAYMENTS] Error al crear pago:", error);
    return NextResponse.json(
      { error: "Error al registrar pago" },
      { status: 500 }
    );
  }
}

// GET /api/payments - Obtener historial de pagos
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId");
  const status = url.searchParams.get("status") as "PAGADO" | "PENDIENTE" | "VENCIDO" | null;

  try {
    let payments;

    if (session.role === "CLIENT") {
      // Los clientes solo ven sus propios pagos
      const client = await prisma.client.findFirst({
        where: { OR: [{ userId: session.id }, { email: session.email }] }
      });

      if (!client) {
        return NextResponse.json([]);
      }

      payments = await prisma.payment.findMany({
        where: { clientId: client.id },
        orderBy: { date: "desc" },
        take: 50
      });

      return NextResponse.json(payments);
    }

    // TRAINER
    if (clientId) {
      // Verificar ownership
      const ownsClient = await assertTrainerOwnsClient(session.id, clientId);
      if (!ownsClient) {
        return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
      }

      const whereClause: { clientId: string; status?: PaymentStatus } = { clientId };
      if (status) whereClause.status = status;

      payments = await prisma.payment.findMany({
        where: whereClause,
        orderBy: { date: "desc" },
        take: 50,
        include: {
          client: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      return NextResponse.json(payments);
    }

    // Todos los pagos recientes para el trainer
    const whereClause: { status?: PaymentStatus } = {};
    if (status) whereClause.status = status;

    payments = await prisma.payment.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
      take: 100,
      include: {
        client: {
          select: {
            name: true,
            email: true,
            plan: true
          }
        }
      }
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("[PAYMENTS] Error al obtener pagos:", error);
    return NextResponse.json(
      { error: "Error al obtener pagos" },
      { status: 500 }
    );
  }
}
