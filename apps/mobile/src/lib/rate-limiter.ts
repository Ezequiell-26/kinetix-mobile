/**
 * Rate limiter distribuido para rutas de API en middleware y route handlers.
 *
 * Estrategia:
 *  - Primario: Upstash Redis (distribuido, funciona en Vercel serverless/Edge)
 *    via @upstash/redis + @upstash/ratelimit (slidingWindow). Requiere
 *    UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN en env.
 *  - Fallback: token bucket en memoria por proceso con TTL + cleanup periódico.
 *    Se usa en dev/local o cuando Redis no está configurado / falla.
 *    No es distribuido pero evita DoS local y mantiene compatibilidad.
 *
 * Uso:
 *   import { checkRateLimit } from "@/lib/rate-limiter";
 *   const result = await checkRateLimit(ip, "login", { max: 5, windowMs: 60_000 });
 *   if (!result.success) return Response.json({ error: "Too many" }, { status: 429 });
 */

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

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

function checkRateLimitMemory(
  ip: string,
  namespace: string,
  config: RateLimitConfig
): RateLimitResult {
  scheduleCleanup();

  const key = `${namespace}:${ip}`;
  const now = Date.now();
  let bucket = store.get(key);

  // Lazy TTL: si el bucket es muy viejo, descartarlo (evita leak si setInterval no corre en serverless)
  if (bucket && now - bucket.lastRefill > MAX_BUCKET_AGE_MS) {
    store.delete(key);
    bucket = undefined;
  }

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

// ──────────────────────────────────────────────────────────────────────────────
// Upstash Redis distribuido (Edge-compatible)
// ──────────────────────────────────────────────────────────────────────────────

let redisClient: Redis | null = null;
let redisInitFailed = false;
const limiterCache = new Map<string, Ratelimit>();

function getRedis(): Redis | null {
  if (redisClient) return redisClient;
  if (redisInitFailed) return null;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    // Redis.fromEnv() lee UPSTASH_REDIS_REST_URL/TOKEN automáticamente
    // Fallback a constructor explícito si fromEnv no está disponible
    if (typeof (Redis as unknown as { fromEnv?: () => Redis }).fromEnv === "function") {
      redisClient = (Redis as unknown as { fromEnv: () => Redis }).fromEnv();
    } else {
      redisClient = new Redis({ url, token });
    }
    return redisClient;
  } catch (e) {
    redisInitFailed = true;
    console.warn("[rate-limiter] Upstash Redis init failed, fallback a memoria:", e);
    return null;
  }
}

function getLimiter(namespace: string, config: RateLimitConfig): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  const cacheKey = `${namespace}:${config.max}:${config.windowMs}`;
  if (limiterCache.has(cacheKey)) return limiterCache.get(cacheKey)!;
  try {
    const windowSec = Math.max(1, Math.ceil(config.windowMs / 1000));
    // @upstash/ratelimit espera string tipo "60 s", "1 m", etc. Usamos segundos.
    const windowStr = `${windowSec} s`;
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.max, windowStr as `${number} s`),
      prefix: `kinetix:ratelimit:${namespace}`,
      analytics: false,
    });
    limiterCache.set(cacheKey, limiter);
    return limiter;
  } catch (e) {
    console.warn("[rate-limiter] Ratelimit init failed, fallback a memoria:", e);
    return null;
  }
}

/**
 * Verifica rate limit intentando primero Upstash Redis (distribuido).
 * Si Redis no está configurado o falla, cae a memoria con TTL.
 * SIEMPRE retorna un resultado válido — nunca lanza.
 */
export async function checkRateLimit(
  ip: string,
  namespace: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const limiter = getLimiter(namespace, config);
  if (limiter) {
    try {
      const identifier = `${namespace}:${ip}`;
      const { success, remaining, reset } = await limiter.limit(identifier);
      // `reset` es timestamp epoch ms según @upstash/ratelimit
      const resetMs = typeof reset === "number" ? Math.max(0, reset - Date.now()) : config.windowMs;
      return {
        success,
        remaining: typeof remaining === "number" ? remaining : success ? config.max - 1 : 0,
        resetMs,
      };
    } catch (e) {
      console.warn(`[rate-limiter] Upstash limit error ${namespace}:${ip}, fallback memoria:`, e);
      // caemos a memoria
    }
  }
  return checkRateLimitMemory(ip, namespace, config);
}

/**
 * Alias síncrono solo para fallback en memoria (deprecado, usar checkRateLimit async).
 * Se mantiene para compatibilidad si algún caller no puede ser async.
 */
export function checkRateLimitSync(
  ip: string,
  namespace: string,
  config: RateLimitConfig
): RateLimitResult {
  return checkRateLimitMemory(ip, namespace, config);
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
 * Helper para leer la IP del cliente desde el request.
 *
 * RIESGO DE SEGURIDAD (corregido acá): `X-Forwarded-For` / `X-Real-IP` /
 * `CF-Connecting-IP` son headers HTTP normales — cualquier cliente puede
 * enviarlos con el valor que quiera. Si la app no está detrás de un proxy
 * que los SOBREESCRIBE (no que los agrega) con la IP real de conexión,
 * confiar en ellos permite evadir el rate limiting entero con solo rotar
 * el header en cada request (login por fuerza bruta sin límite, spam de
 * registro, etc.).
 *
 * Por eso estos headers solo se usan si TRUST_PROXY_HEADERS=true está
 * seteado explícitamente en el entorno. Activarlo es correcto SOLO si:
 *  - Vercel/Cloudflare (ellos sobreescriben el header en su borde, no lo
 *    dejan pasar del cliente), o
 *  - un proxy propio (Caddy/Nginx/Ingress k8s) configurado para descartar
 *    cualquier X-Forwarded-For entrante del cliente y setear el suyo.
 * Sin esa variable, se usa `request.ip` (poblado por la plataforma en
 * Vercel, no spoofeable por el cliente) o "unknown" como último recurso.
 * "unknown" agrupa a todos los clientes sin proxy confiable en un mismo
 * balde de rate limit — no ideal, pero preferible a un límite evadible.
 */
export function getClientIp(req: { headers: Headers; ip?: string }): string {
  if (process.env.TRUST_PROXY_HEADERS === "true") {
    const forwarded =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip");
    if (forwarded) return forwarded;
  }
  return req.ip || "unknown";
}
