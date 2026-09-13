/**
 * Bloqueo de fuerza bruta por CUENTA (no por IP).
 *
 * El middleware ya limita intentos de login por IP (5/min), pero eso no
 * frena un ataque distribuido: alguien probando contraseñas contra UNA
 * cuenta desde muchas IPs distintas (botnet, proxies rotativos) pasa
 * el límite por IP sin problema. Esto agrega un segundo límite, por
 * email, independiente de desde dónde venga cada intento.
 *
 * En memoria, igual que rate-limiter.ts — funciona en un solo proceso;
 * para múltiples instancias hace falta un store compartido (Redis/KV).
 */

type Attempt = { count: number; firstAt: number; lockedUntil: number | null };

const store = new Map<string, Attempt>();

const WINDOW_MS = 15 * 60_000; // ventana de conteo: 15 min
const MAX_ATTEMPTS = 5;
// Bloqueo escalonado: más intentos fallidos = bloqueo más largo.
const LOCK_STEPS_MS = [5 * 60_000, 15 * 60_000, 60 * 60_000]; // 5min, 15min, 1h

function keyFor(email: string): string {
  return email.trim().toLowerCase();
}

export function isLoginLocked(email: string): { locked: boolean; retryAfterMs: number } {
  const entry = store.get(keyFor(email));
  if (!entry || !entry.lockedUntil) return { locked: false, retryAfterMs: 0 };
  const remaining = entry.lockedUntil - Date.now();
  if (remaining <= 0) return { locked: false, retryAfterMs: 0 };
  return { locked: true, retryAfterMs: remaining };
}

export function recordFailedLogin(email: string): void {
  const key = keyFor(email);
  const now = Date.now();
  let entry = store.get(key);

  if (!entry || now - entry.firstAt > WINDOW_MS) {
    entry = { count: 0, firstAt: now, lockedUntil: null };
  }

  entry.count += 1;

  if (entry.count > MAX_ATTEMPTS) {
    const step = Math.min(entry.count - MAX_ATTEMPTS - 1, LOCK_STEPS_MS.length - 1);
    entry.lockedUntil = now + LOCK_STEPS_MS[Math.max(0, step)];
  }

  store.set(key, entry);
}

/** Login exitoso: se limpia el historial de intentos de esa cuenta. */
export function clearLoginAttempts(email: string): void {
  store.delete(keyFor(email));
}
