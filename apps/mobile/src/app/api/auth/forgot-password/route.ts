import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { issueResetToken } from "@/lib/password-reset-store";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limiter";

/**
 * Inicia la recuperación de contraseña con envío transaccional real.
 *
 * Seguridad:
 * - Nunca devuelve el token en la respuesta (prevención de account takeover).
 * - Respuesta genérica para no enumerar emails existentes.
 * - Rate limiting por IP (5/15min) y por email (3/h) para mitigar abuso y enumeración.
 * - Token hasheado en DB, expira en 1h, one-time-use.
 * - Email vía Resend (si RESEND_API_KEY) o SMTP/nodemailer (si SMTP_HOST), con fallback a log solo en dev.
 */

function getClientIpFromRequest(req: Request): string {
  // Respeta TRUST_PROXY_HEADERS igual que el helper centralizado.
  if (process.env.TRUST_PROXY_HEADERS === "true") {
    const h = req.headers;
    const realIp = h.get("x-real-ip");
    if (realIp) return realIp;
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    const cf = h.get("cf-connecting-ip");
    if (cf) return cf;
  }
  // NextRequest.ip no está tipado en Request genérico; fallback a unknown bucket.
  // En runtime Vercel/Next el IP real llega vía x-forwarded-for con TRUST_PROXY_HEADERS=true.
  return "unknown";
}

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({} as { email?: string }));
  if (!email || !email.includes("@"))
    return NextResponse.json({ error: "Email válido requerido" }, { status: 400 });

  const normalizedEmail = email.toLowerCase().trim();

  // ── Rate limiting (Upstash Redis distribuido con fallback en memoria) ──
  const ip = getClientIpFromRequest(req);

  const rlIp = await checkRateLimit(ip, "forgot-password", { max: 5, windowMs: 15 * 60_000 });
  if (!rlIp.success) {
    const retryAfter = Math.ceil(rlIp.resetMs / 1000);
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfter), "X-RateLimit-Remaining": "0" } }
    );
  }

  const rlEmail = await checkRateLimit(normalizedEmail, "forgot-password:email", {
    max: 3,
    windowMs: 60 * 60_000,
  });
  if (!rlEmail.success) {
    const retryAfter = Math.ceil(rlEmail.resetMs / 1000);
    return NextResponse.json(
      { error: "Demasiadas solicitudes para este email. Intenta más tarde." },
      { status: 429, headers: { "Retry-After": String(retryAfter), "X-RateLimit-Remaining": "0" } }
    );
  }

  // Respuesta genérica siempre, para no filtrar si el email existe.
  const generic = { ok: true, message: "Si el email existe, recibirás instrucciones." };

  try {
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } }).catch(() => null);
    if (user) {
      const token = await issueResetToken(normalizedEmail);
      if (token) {
        // Envío transaccional real — Resend o SMTP. Nunca se loguea el token en producción.
        const result = await sendPasswordResetEmail(normalizedEmail, token).catch((err) => {
          console.error("[forgot-password] sendPasswordResetEmail error:", err);
          return { success: false, via: "skipped" as const, error: String(err) };
        });

        if (!result.success && process.env.NODE_ENV !== "production") {
          // En dev, si el proveedor no está configurado, dejamos rastro útil sin exponer token en prod
          console.warn(
            `[forgot-password] Email no enviado para ${normalizedEmail} (via=${result.via}): ${result.error || "unknown"} — token: http://localhost:3001/reset-password?token=${token}`
          );
        }
      }
    }
  } catch (err) {
    // No filtrar error al cliente; log interno y devolver genérico
    console.error("[forgot-password] error:", err);
  }

  // Headers informativos de rate limit (éxito)
  return NextResponse.json(generic, {
    headers: {
      "X-RateLimit-Remaining": String(rlIp.remaining),
      "X-RateLimit-Reset": String(Date.now() + rlIp.resetMs),
    },
  });
}
