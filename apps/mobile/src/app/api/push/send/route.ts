/**
 * POST /api/push/send
 * Endpoint interno para envío de push.
 * Nunca debe aceptar una petición solo por presentar un Authorization header.
 */

import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

const sendNotificationSchema = z.object({
  userIds: z.array(z.string().uuid()).max(500).optional(),
  userRole: z.enum(["TRAINER", "CLIENT"]).optional(),
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(500),
  icon: z.string().url().optional(),
  badge: z.string().url().optional(),
  url: z.string().url().optional(),
  data: z.record(z.unknown()).optional(),
  ttl: z.number().int().min(60).max(604800).optional().default(86400),
});

function safeSecretEqual(received: string, expected: string) {
  const a = Buffer.from(received, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

function isAuthorizedInternalRequest(request: NextRequest) {
  const configured = process.env.KINETIX_INTERNAL_API_SECRET;
  if (!configured) return false;
  const auth = request.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return false;
  return safeSecretEqual(auth.slice(7), configured);
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedInternalRequest(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: "Servicio push no configurado" }, { status: 503 });
  }

  try {
    const body = await request.json().catch(() => null);
    const result = sendNotificationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const { userIds, userRole, title, body: messageBody, icon, badge, url, data } = result.data;
    if ((!userIds || userIds.length === 0) && !userRole) {
      return NextResponse.json({ error: "Debe indicar userIds o userRole" }, { status: 400 });
    }

    let query = supabase.from("push_subscriptions").select("*");
    if (userIds && userIds.length > 0) {
      query = query.in("user_id", userIds);
    } else if (userRole) {
      query = query.select("*, users:user_id ( role )").eq("users.role", userRole);
    }

    const { data: subscriptions, error: fetchError } = await query;
    if (fetchError) {
      console.error("[PUSH] Error obteniendo suscripciones", fetchError);
      return NextResponse.json({ error: "Error al obtener suscripciones" }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, sent: 0, failed: 0, total: 0 });
    }

    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json({ error: "Push no configurado" }, { status: 503 });
    }

    const webPush = await import("web-push");
    webPush.setVapidDetails("mailto:noreply@kinetixfitt.com", vapidPublicKey, vapidPrivateKey);

    const notificationPayload = {
      title,
      body: messageBody,
      icon: icon || "/icons/icon-192.png",
      badge: badge || "/icons/icon-192.png",
      url: url || "/client/dashboard",
      data: data || {},
      timestamp: Date.now(),
    };

    const results = await Promise.allSettled(
      subscriptions.map(async (sub: { endpoint: string; p256dh: string; auth: string }) => {
        try {
          await webPush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            JSON.stringify(notificationPayload),
          );
          return { success: true };
        } catch (error: unknown) {
          const statusCode = typeof error === "object" && error !== null && "statusCode" in error ? Number((error as { statusCode?: unknown }).statusCode) : 0;
          if (statusCode === 404 || statusCode === 410) {
            await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
          }
          console.error("[PUSH] subscription delivery failed", { statusCode });
          return { success: false };
        }
      }),
    );

    const sent = results.filter((r) => r.status === "fulfilled" && r.value.success).length;
    const failed = results.length - sent;
    return NextResponse.json({ success: true, sent, failed, total: results.length });
  } catch (error) {
    console.error("[PUSH] Error enviando notificación", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
