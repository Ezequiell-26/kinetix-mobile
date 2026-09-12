import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
import { getJwtSecret } from "@/lib/secret";
import {
  checkRateLimit,
  RATE_LIMIT_PROFILES,
  getClientIp,
} from "@/lib/rate-limiter";

const SECRET = getJwtSecret();

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ────────────────────────────────────────────────────────────────
  // 1. Rate limiting en rutas públicas sensibles (auth + API).
  //    Se ejecuta antes del auth-check para ahorrar trabajo cuando
  //    el cliente está abusando del endpoint.
  // ────────────────────────────────────────────────────────────────
  const ip = getClientIp(req);

  if (path.startsWith("/api/auth/login")) {
    const r = checkRateLimit(ip, "auth", RATE_LIMIT_PROFILES.auth);
    if (!r.success) return rateLimitResponse(r.resetMs);
  } else if (path.startsWith("/api/auth/register")) {
    const r = checkRateLimit(ip, "register", RATE_LIMIT_PROFILES.register);
    if (!r.success) return rateLimitResponse(r.resetMs);
  } else if (path.startsWith("/api/auth/forgot-password")) {
    const r = checkRateLimit(ip, "auth", RATE_LIMIT_PROFILES.auth);
    if (!r.success) return rateLimitResponse(r.resetMs);
  } else if (path.startsWith("/api/auth/reset-password")) {
    const r = checkRateLimit(ip, "auth", RATE_LIMIT_PROFILES.auth);
    if (!r.success) return rateLimitResponse(r.resetMs);
  } else if (path.startsWith("/api/uploads")) {
    const r = checkRateLimit(ip, "upload", RATE_LIMIT_PROFILES.upload);
    if (!r.success) return rateLimitResponse(r.resetMs);
  } else if (path.startsWith("/api/messages")) {
    const r = checkRateLimit(ip, "messages", RATE_LIMIT_PROFILES.messages);
    if (!r.success) return rateLimitResponse(r.resetMs);
  } else if (path.startsWith("/api/")) {
    // Rate limit genérico para el resto de la API.
    const r = checkRateLimit(ip, "api", RATE_LIMIT_PROFILES.api);
    if (!r.success) return rateLimitResponse(r.resetMs);
  }

  // ────────────────────────────────────────────────────────────────
  // 2. Auth + verificación de rol para rutas protegidas.
  // ────────────────────────────────────────────────────────────────
  const isTrainer = path.startsWith("/trainer");
  const isClient = path.startsWith("/client");
  if (!isTrainer && !isClient) return NextResponse.next();

  const token = req.cookies.get("ec_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jose.jwtVerify(token, SECRET);
    const role = (payload as unknown as { role: string }).role;
    if (isTrainer && role !== "TRAINER")
      return NextResponse.redirect(new URL("/client/dashboard", req.url));
    if (isClient && role !== "CLIENT")
      return NextResponse.redirect(new URL("/trainer/dashboard", req.url));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

/**
 * Respuesta estándar 429 con header Retry-After en segundos.
 */
function rateLimitResponse(resetMs: number) {
  const retryAfter = Math.max(1, Math.ceil(resetMs / 1000));
  return new NextResponse(
    JSON.stringify({
      error: "Too many requests",
      retryAfterSeconds: retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}

export const config = {
  matcher: [
    // Rutas protegidas (auth) + toda la API pública.
    "/trainer/:path*",
    "/client/:path*",
    "/api/:path*",
  ],
};
