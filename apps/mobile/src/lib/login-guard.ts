import { Redis } from "@upstash/redis";

type Attempt = { count: number; firstAt: number; lockedUntil: number | null };

const store = new Map<string, Attempt>();
const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 5;
const REDIS_PREFIX = "kinetix:login-failures:";
let redis: Redis | null = null;

function keyFor(email: string) {
  return email.trim().toLowerCase();
}

function getRedis() {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    redis = new Redis({ url, token });
    return redis;
  } catch (error) {
    console.warn("[login-guard] Redis init failed, using local fallback", error);
    return null;
  }
}

export async function isLoginLocked(email: string): Promise<{ locked: boolean; retryAfterMs: number }> {
  const key = keyFor(email);
  const shared = getRedis();
  if (shared) {
    try {
      const count = Number(await shared.get<number>(`${REDIS_PREFIX}${key}`)) || 0;
      return count >= MAX_ATTEMPTS ? { locked: true, retryAfterMs: WINDOW_MS } : { locked: false, retryAfterMs: 0 };
    } catch (error) {
      console.warn("[login-guard] Redis read failed, using local fallback", error);
    }
  }

  const entry = store.get(key);
  if (!entry || !entry.lockedUntil) return { locked: false, retryAfterMs: 0 };
  const remaining = entry.lockedUntil - Date.now();
  if (remaining <= 0) {
    store.delete(key);
    return { locked: false, retryAfterMs: 0 };
  }
  return { locked: true, retryAfterMs: remaining };
}

export async function recordFailedLogin(email: string): Promise<void> {
  const key = keyFor(email);
  const shared = getRedis();
  if (shared) {
    try {
      const redisKey = `${REDIS_PREFIX}${key}`;
      const count = await shared.incr(redisKey);
      if (count === 1) await shared.expire(redisKey, Math.ceil(WINDOW_MS / 1000));
      return;
    } catch (error) {
      console.warn("[login-guard] Redis write failed, using local fallback", error);
    }
  }

  const now = Date.now();
  let entry = store.get(key);
  if (!entry || now - entry.firstAt > WINDOW_MS) entry = { count: 0, firstAt: now, lockedUntil: null };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) entry.lockedUntil = now + WINDOW_MS;
  store.set(key, entry);
}

export async function clearLoginAttempts(email: string): Promise<void> {
  const key = keyFor(email);
  const shared = getRedis();
  if (shared) {
    try {
      await shared.del(`${REDIS_PREFIX}${key}`);
      return;
    } catch (error) {
      console.warn("[login-guard] Redis delete failed, clearing local fallback", error);
    }
  }
  store.delete(key);
}
