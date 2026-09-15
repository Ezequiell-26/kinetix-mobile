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

function generateNonce(): string {
  try {
    const c = globalThis.crypto as unknown as Crypto;
    if (c && typeof c.getRandomValues === "function") {
      const arr = new Uint8Array(16);
      c.getRandomValues(arr);
      // btoa está disponible en Edge/Workers y navegadores; en Node usamos Buffer
      if (typeof btoa === "function") {
        let binary = "";
        arr.forEach((b) => (binary += String.fromCharCode(b)));
        return btoa(binary);
      } else {
        // Node fallback
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return Buffer.from(arr).toString("base64");
      }
    }
  } catch {}
  try {
    const gCrypto = globalThis.crypto as unknown as { randomUUID?: () => string };
    const uuid = gCrypto?.randomUUID?.();
    if (uuid) {
      if (typeof btoa === "function") return btoa(uuid);
      return Buffer.from(uuid).toString("base64");
    }
  } catch {}
  // último fallback no criptográfico (solo para no romper)
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://us.i.posthog.com",
    "https://us-assets.i.posthog.com",
    "https://eu.i.posthog.com",
    "https://app.posthog.com",
    isDev ? "'unsafe-eval'" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const csp = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://fonts.gstatic.com https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.sentry.io https://www.google-analytics.com https://us.i.posthog.com https://us.posthog.com https://eu.i.posthog.com https://app.posthog.com https://*.posthog.com https://*.supabase.co wss://*.supabase.co",
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
  return csp;
}

function applyCsp(response: NextResponse, nonce: string): NextResponse {
  response.headers.set("Content-Security-Policy", buildCsp(nonce));
  response.headers.set("x-nonce", nonce);
  response.headers.set("x-csp-nonce", nonce);
  return response;
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const nonce = generateNonce();

  // Propagar nonce al Server Components vía header de request
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("x-csp-nonce", nonce);

  // ────────────────────────────────────────────────────────────────
  // 1. Rate limiting en rutas públicas sensibles (auth + API).
  //    Se ejecuta antes del auth-check para ahorrar trabajo cuando
  //    el cliente está abusando del endpoint. Usa Upstash Redis distribuido
  //    con fallback en memoria (ver lib/rate-limiter.ts).
  // ────────────────────────────────────────────────────────────────
  const ip = getClientIp(req);

  if (path.startsWith("/api/auth/login")) {
    const r = await checkRateLimit(ip, "auth", RATE_LIMIT_PROFILES.auth);
    if (!r.success) return applyCsp(rateLimitResponse(r.resetMs), nonce);
  } else if (path.startsWith("/api/auth/register")) {
    const r = await checkRateLimit(ip, "register", RATE_LIMIT_PROFILES.register);
    if (!r.success) return applyCsp(rateLimitResponse(r.resetMs), nonce);
  } else if (path.startsWith("/api/auth/forgot-password")) {
    const r = await checkRateLimit(ip, "auth", RATE_LIMIT_PROFILES.auth);
    if (!r.success) return applyCsp(rateLimitResponse(r.resetMs), nonce);
  } else if (path.startsWith("/api/auth/reset-password")) {
    const r = await checkRateLimit(ip, "auth", RATE_LIMIT_PROFILES.auth);
    if (!r.success) return applyCsp(rateLimitResponse(r.resetMs), nonce);
  } else if (path.startsWith("/api/uploads")) {
    const r = await checkRateLimit(ip, "upload", RATE_LIMIT_PROFILES.upload);
    if (!r.success) return applyCsp(rateLimitResponse(r.resetMs), nonce);
  } else if (path.startsWith("/api/messages")) {
    const r = await checkRateLimit(ip, "messages", RATE_LIMIT_PROFILES.messages);
    if (!r.success) return applyCsp(rateLimitResponse(r.resetMs), nonce);
  } else if (path.startsWith("/api/")) {
    // Rate limit genérico para el resto de la API.
    const r = await checkRateLimit(ip, "api", RATE_LIMIT_PROFILES.api);
    if (!r.success) return applyCsp(rateLimitResponse(r.resetMs), nonce);
  }

  // ────────────────────────────────────────────────────────────────
  // 2. Raíz "/" session-aware: con sesión válida va al panel (evita el
  //    flash de landing). Se hace AQUÍ y no con redirect() en page.tsx:
  //    el redirect del Server Component llegaba serializado como error
  //    (digest NEXT_REDIRECT en el stream RSC) en vez de 307.
  // ────────────────────────────────────────────────────────────────
  if (path === "/") {
    const token = req.cookies.get("ec_token")?.value;
    if (token) {
      try {
        const { payload } = await jose.jwtVerify(token, SECRET);
        const role = (payload as unknown as { role: string }).role;
        if (role === "TRAINER") {
          const res = NextResponse.redirect(new URL("/trainer/dashboard", req.url));
          return applyCsp(res, nonce);
        }
        if (role === "CLIENT") {
          const res = NextResponse.redirect(new URL("/client/dashboard", req.url));
          return applyCsp(res, nonce);
        }
      } catch {
        // Token inválido: se muestra la landing (el login la reemplaza).
      }
    }
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    return applyCsp(res, nonce);
  }

  // ────────────────────────────────────────────────────────────────
  // 2b. /login y /register con sesión válida van al panel (no al formulario).
  // ────────────────────────────────────────────────────────────────
  if (path === "/login" || path === "/register") {
    const token = req.cookies.get("ec_token")?.value;
    if (token) {
      try {
        const { payload } = await jose.jwtVerify(token, SECRET);
        const role = (payload as unknown as { role: string }).role;
        const res = NextResponse.redirect(
          new URL(role === "TRAINER" ? "/trainer/dashboard" : "/client/dashboard", req.url)
        );
        return applyCsp(res, nonce);
      } catch {
        const res = NextResponse.next({ request: { headers: requestHeaders } });
        return applyCsp(res, nonce);
      }
    }
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    return applyCsp(res, nonce);
  }

  // ────────────────────────────────────────────────────────────────
  // 3. Auth + verificación de rol para rutas protegidas.
  // ────────────────────────────────────────────────────────────────
  const isTrainer = path.startsWith("/trainer");
  const isClient = path.startsWith("/client");
  if (!isTrainer && !isClient) {
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    return applyCsp(res, nonce);
  }

  const token = req.cookies.get("ec_token")?.value;
  if (!token) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    return applyCsp(res, nonce);
  }

  try {
    const { payload } = await jose.jwtVerify(token, SECRET);
    const role = (payload as unknown as { role: string }).role;
    if (isTrainer && role !== "TRAINER") {
      const res = NextResponse.redirect(new URL("/client/dashboard", req.url));
      return applyCsp(res, nonce);
    }
    if (isClient && role !== "CLIENT") {
      const res = NextResponse.redirect(new URL("/trainer/dashboard", req.url));
      return applyCsp(res, nonce);
    }
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    return applyCsp(res, nonce);
  } catch {
    const res = NextResponse.redirect(new URL("/login", req.url));
    return applyCsp(res, nonce);
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
    // Raíz session-aware (landing vs panel) + rutas protegidas + API.
    "/",
    "/login",
    "/register",
    "/trainer/:path*",
    "/client/:path*",
    "/api/:path*",
  ],
};
