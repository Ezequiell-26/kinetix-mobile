import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

/**
 * Webhook para Stripe y Mercado Pago
 * 
 * Este endpoint recibe notificaciones automáticas de las plataformas de pago
 * y actualiza el estado de pagos y suscripciones en la base de datos.
 * 
 * Configuración requerida en .env:
 * - STRIPE_WEBHOOK_SECRET: Firmado desde dashboard de Stripe
 * - MP_ACCESS_TOKEN: Token de acceso de Mercado Pago
 * - MP_WEBHOOK_SECRET: Secret de notificaciones de MP
 */

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    const mpSignature = req.headers.get("x-signature");
    
    // Determinar proveedor por headers o contenido
    const isStripe = !!signature;
    const isMercadoPago = !!mpSignature || req.headers.get("x-request-id")?.includes("MP");
    
    let event: any;
    
    // Verificar firma de Stripe
    if (isStripe) {
      if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Stripe no configurado" }, { status: 500 });
      }
      const { default: Stripe } = await import("stripe");
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      try {
        event = stripe.webhooks.constructEvent(
          body,
          signature!,
          process.env.STRIPE_WEBHOOK_SECRET!
        );
      } catch (err) {
        console.error("[WEBHOOK] Stripe signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
      
      // Procesar eventos de Stripe
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          const clientId = session.metadata?.clientId;
          const paymentId = session.metadata?.paymentId;
          
          if (clientId) {
            await prisma.payment.updateMany({
              where: { 
                clientId,
                status: "PENDIENTE"
              },
              data: {
                status: "PAGADO",
                method: "STRIPE",
                description: `Pago vía Stripe - ${session.id}`
              }
            });
            
            // Actualizar suscripción
            const client = await prisma.client.findUnique({
              where: { id: clientId },
              include: { subscription: true }
            });
            
            if (client?.subscription) {
              const nextPayment = new Date();
              nextPayment.setDate(nextPayment.getDate() + 30);
              
              await prisma.subscription.update({
                where: { clientId },
                data: {
                  status: "ACTIVA",
                  nextPayment,
                  price: session.amount_total / 100 // Convertir de centavos
                }
              });
            }
          }
          break;
        }
        
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object;
          // Similar lógica para payment intents
          break;
        }
        
        case "customer.subscription.updated": {
          const subscription = event.data.object;
          const clientId = subscription.metadata?.clientId;
          
          if (clientId) {
            await prisma.subscription.update({
              where: { clientId },
              data: {
                status: subscription.status === "active" ? "ACTIVA" : 
                       subscription.status === "canceled" ? "CANCELADA" : "VENCIDA"
              }
            });
          }
          break;
        }
      }
    }
    
    // Verificar firma de Mercado Pago
    if (isMercadoPago) {
      // Validar firma de MP (implementación simplificada)
      // En producción: verificar hash HMAC con MP_WEBHOOK_SECRET
      
      const data = JSON.parse(body);
      
      switch (data.type) {
        case "payment": {
          const payment = data.data?.id;
          // Fetch payment details from MP API
          // Update local payment record
          break;
        }
        
        case "subscription": {
          const subscription = data.data?.id;
          // Fetch subscription details and update local record
          break;
        }
      }
    }
    
    // Si no es ni Stripe ni MP, podría ser un ping de prueba
    if (!isStripe && !isMercadoPago) {
      console.log("[WEBHOOK] Received unknown webhook type");
      // Aceptar para evitar reintentos si es un ping de salud
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// GET para verificación de endpoint (usado por algunas plataformas)
export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "Webhook endpoint active",
    providers: ["stripe", "mercadopago"]
  });
}
