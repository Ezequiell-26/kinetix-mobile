/**
 * Rate limiter simple para rutas de API en middleware.
 *
 * Estrategia: token bucket por IP en memoria. Funciona en un solo
 * proceso de Node (Edge runtime o Node server). Para múltiples
 * instancias reemplazar el store por Redis / KV.
 *
 * Uso:
 *   import { checkRateLimit } from "@/lib/rate-limiter";
 *   const result = checkRateLimit(ip, "login", { max: 5, windowMs: 60_000 });
 *   if (!result.success) return Response.json({ error: "Too many" }, { status: 429 });
 */

export interface RateLimitConfig {
  /** Peticiones máximas permitidas en la ventana */
  max: number;
  /** Duración de la ventana en milisegundos */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  /** Peticiones restantes en la ventana actual */
  remaining: number;
  /** Milisegundos hasta que se resetee la ventana */
  resetMs: number;
}

interface Bucket {
  tokens: number;
  /** Timestamp de la última petición (ms) */
  lastRefill: number;
}

// Store en memoria. Cada clave es `${namespace}:${ip}`.
const store = new Map<string, Bucket>();

// Limpieza periódica para evitar memory leaks.
const CLEANUP_INTERVAL_MS = 5 * 60_000;
const MAX_BUCKET_AGE_MS = 30 * 60_000;

let cleanupHandle: ReturnType<typeof setInterval> | null = null;

function scheduleCleanup() {
  if (cleanupHandle) return;
  if (typeof setInterval === "undefined") return;
  cleanupHandle = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store.entries()) {
      if (now - bucket.lastRefill > MAX_BUCKET_AGE_MS) {
        store.delete(key);
      }
    }
  }, CLEANUP_INTERVAL_MS);
  // Evitar que el cleanup mantenga el proceso vivo en serverless.
  if (cleanupHandle && typeof cleanupHandle === "object" && "unref" in cleanupHandle) {
    (cleanupHandle as NodeJS.Timeout).unref();
  }
}

export function checkRateLimit(
  ip: string,
  namespace: string,
  config: RateLimitConfig
): RateLimitResult {
  scheduleCleanup();

  const key = `${namespace}:${ip}`;
  const now = Date.now();
  let bucket = store.get(key);

  if (!bucket) {
    bucket = { tokens: config.max - 1, lastRefill: now };
    store.set(key, bucket);
    return { success: true, remaining: bucket.tokens, resetMs: config.windowMs };
  }

  // Re-llenar tokens según tiempo transcurrido (token bucket).
  const elapsed = now - bucket.lastRefill;
  if (elapsed >= config.windowMs) {
    bucket.tokens = config.max;
  } else {
    const refillRate = config.max / config.windowMs;
    const refill = Math.floor(elapsed * refillRate);
    if (refill > 0) {
      bucket.tokens = Math.min(config.max, bucket.tokens + refill);
      bucket.lastRefill = now;
    }
  }

  const resetMs = config.windowMs - (now - bucket.lastRefill);

  if (bucket.tokens <= 0) {
    return { success: false, remaining: 0, resetMs: Math.max(0, resetMs) };
  }

  bucket.tokens -= 1;
  bucket.lastRefill = now;

  return {
    success: true,
    remaining: bucket.tokens,
    resetMs: Math.max(0, resetMs),
  };
}

/**
 * Perfiles de rate-limit listos para usar en middleware.
 */
export const RATE_LIMIT_PROFILES = {
  /** Login / reset password: 5 intentos por minuto */
  auth: { max: 5, windowMs: 60_000 },
  /** Registro: 3 cuentas nuevas por IP por hora */
  register: { max: 3, windowMs: 60 * 60_000 },
  /** API genérica: 120 req/min (para usuarios autenticados) */
  api: { max: 120, windowMs: 60_000 },
  /** Subida de imágenes: 20 subidas por minuto */
  upload: { max: 20, windowMs: 60_000 },
  /** Mensajes: 30 mensajes por minuto */
  messages: { max: 30, windowMs: 60_000 },
} as const;

/**
 * Helper para leer headers de IP desde request.
 * Funciona con proxies comunes (Vercel, Cloudflare, Nginx).
 */
export function getClientIp(req: { headers: Headers }): string {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}
