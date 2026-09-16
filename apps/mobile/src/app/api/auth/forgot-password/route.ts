import { NextResponse } from "next/server";
import { issueResetToken } from "@/lib/password-reset-store";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

/**
 * Inicia la recuperación de contraseña con envío transaccional real.
 * Nunca devuelve el token ni revela si el email existe.
 */
export async function POST(req: Request) {
  const parsed = await req.json().catch(() => null) as { email?: unknown } | null;
  const email = typeof parsed?.email === "string" ? parsed.email : "";
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email válido requerido" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const ip = getClientIp({ headers: req.headers, ip: (req as Request & { ip?: string }).ip });

  const rlIp = await checkRateLimit(ip, "forgot-password", { max: 5, windowMs: 15 * 60_000 });
  if (!rlIp.success) {
    const retryAfter = Math.max(1, Math.ceil(rlIp.resetMs / 1000));
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfter), "X-RateLimit-Remaining": "0" } },
    );
  }

  const rlEmail = await checkRateLimit(normalizedEmail, "forgot-password:email", { max: 3, windowMs: 60 * 60_000 });
  if (!rlEmail.success) {
    const retryAfter = Math.max(1, Math.ceil(rlEmail.resetMs / 1000));
    return NextResponse.json(
      { error: "Demasiadas solicitudes para este email. Intenta más tarde." },
      { status: 429, headers: { "Retry-After": String(retryAfter), "X-RateLimit-Remaining": "0" } },
    );
  }

  const generic = { ok: true, message: "Si el email existe, recibirás instrucciones." };

  try {
    const token = await issueResetToken(normalizedEmail);
    if (token) {
      const result = await sendPasswordResetEmail(normalizedEmail, token).catch((error) => {
        console.error("[forgot-password] sendPasswordResetEmail failed", error);
        return { success: false, via: "skipped" as const };
      });
      if (!result.success && process.env.NODE_ENV !== "production") {
        console.warn("[forgot-password] Email no enviado en entorno de desarrollo");
      }
    }
  } catch (error) {
    console.error("[forgot-password] request failed", error);
  }

  return NextResponse.json(generic, {
    headers: {
      "X-RateLimit-Remaining": String(rlIp.remaining),
      "X-RateLimit-Reset": String(Date.now() + rlIp.resetMs),
    },
  });
}
