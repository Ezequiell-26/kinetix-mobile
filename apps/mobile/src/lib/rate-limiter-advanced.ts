/**
 * Sistema de Rate Limiting Avanzado para KINETIXFITT
 * Implementación tipo Express Rate Limit con ventanas deslizantes
 */

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
}

interface RateLimitOptions {
  windowMs: number; // Ventana de tiempo en milisegundos
  max: number; // Máximo de requests por ventana
  message?: string;
  statusCode?: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: any) => string;
}

interface RateLimitInfo {
  total: number;
  remaining: number;
  resetTime: number;
  isLimited: boolean;
}

export class AdvancedRateLimiter {
  private store: Map<string, RateLimitEntry>;
  private options: Required<RateLimitOptions>;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(options: RateLimitOptions) {
    this.store = new Map();
    this.options = {
      windowMs: options.windowMs || 60000, // 1 minuto por defecto
      max: options.max || 100,
      message: options.message || 'Too many requests, please try again later.',
      statusCode: options.statusCode || 429,
      skipSuccessfulRequests: options.skipSuccessfulRequests || false,
      skipFailedRequests: options.skipFailedRequests || false,
      keyGenerator: options.keyGenerator || ((req: any) => req.ip || 'unknown'),
    };

    // Limpieza periódica
    this.startCleanup();
  }

  /**
   * Verificar si un request está permitido
   */
  checkLimit(key: string): RateLimitInfo & { allowed: boolean } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry) {
      // Primer request
      this.store.set(key, {
        count: 1,
        firstRequest: now,
        lastRequest: now,
      });

      return {
        allowed: true,
        total: this.options.max,
        remaining: this.options.max - 1,
        resetTime: now + this.options.windowMs,
        isLimited: false,
      };
    }

    // Verificar si la ventana ha expirado
    if (now - entry.firstRequest >= this.options.windowMs) {
      // Reiniciar ventana
      this.store.set(key, {
        count: 1,
        firstRequest: now,
        lastRequest: now,
      });

      return {
        allowed: true,
        total: this.options.max,
        remaining: this.options.max - 1,
        resetTime: now + this.options.windowMs,
        isLimited: false,
      };
    }

    // Dentro de la ventana
    if (entry.count >= this.options.max) {
      return {
        allowed: false,
        total: this.options.max,
        remaining: 0,
        resetTime: entry.firstRequest + this.options.windowMs,
        isLimited: true,
      };
    }

    // Incrementar contador
    entry.count++;
    entry.lastRequest = now;
    this.store.set(key, entry);

    return {
      allowed: true,
      total: this.options.max,
      remaining: this.options.max - entry.count,
      resetTime: entry.firstRequest + this.options.windowMs,
      isLimited: false,
    };
  }

  /**
   * Middleware para Express/Next.js
   */
  middleware() {
    return async (req: any, res: any, next: () => void) => {
      const key = this.options.keyGenerator(req);
      const info = this.checkLimit(key);

      // Agregar headers de rate limit
      res.setHeader('X-RateLimit-Limit', info.total.toString());
      res.setHeader('X-RateLimit-Remaining', info.remaining.toString());
      res.setHeader('X-RateLimit-Reset', info.resetTime.toString());

      if (!info.allowed) {
        res.setHeader('Retry-After', Math.ceil((info.resetTime - Date.now()) / 1000).toString());
        return res.status(this.options.statusCode).json({
          error: this.options.message,
          retryAfter: Math.ceil((info.resetTime - Date.now()) / 1000),
        });
      }

      // Wrapper para response para contar éxitos/fallos
      if (this.options.skipSuccessfulRequests || this.options.skipFailedRequests) {
        const originalJson = res.json.bind(res);
        const originalSend = res.send.bind(res);

        const updateCount = (statusCode: number) => {
          const entry = this.store.get(key);
          if (!entry) return;

          const isSuccess = statusCode >= 200 && statusCode < 300;
          
          if (this.options.skipSuccessfulRequests && isSuccess) {
            entry.count = Math.max(0, entry.count - 1);
          } else if (this.options.skipFailedRequests && !isSuccess) {
            entry.count = Math.max(0, entry.count - 1);
          }
          
          this.store.set(key, entry);
        };

        res.json = function (data: any) {
          updateCount(res.statusCode);
          return originalJson(data);
        };

        res.send = function (data: any) {
          updateCount(res.statusCode);
          return originalSend(data);
        };
      }

      next();
    };
  }

  /**
   * Obtener información de rate limit para una key
   */
  getInfo(key: string): RateLimitInfo | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    const now = Date.now();
    const isExpired = now - entry.firstRequest >= this.options.windowMs;

    return {
      total: this.options.max,
      remaining: isExpired ? this.options.max : Math.max(0, this.options.max - entry.count),
      resetTime: entry.firstRequest + this.options.windowMs,
      isLimited: !isExpired && entry.count >= this.options.max,
    };
  }

  /**
   * Resetear rate limit para una key
   */
  reset(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Resetear todos los rate limits
   */
  resetAll(): void {
    this.store.clear();
  }

  /**
   * Obtener estadísticas del rate limiter
   */
  getStats(): { 
    totalKeys: number;
    limitedKeys: number;
    averageUsage: number;
  } {
    const now = Date.now();
    let limitedKeys = 0;
    let totalUsage = 0;

    for (const entry of this.store.values()) {
      if (now - entry.firstRequest < this.options.windowMs) {
        totalUsage += entry.count;
        if (entry.count >= this.options.max) {
          limitedKeys++;
        }
      }
    }

    const activeKeys = Array.from(this.store.entries()).filter(
      ([, entry]) => now - entry.firstRequest < this.options.windowMs
    ).length;

    return {
      totalKeys: activeKeys,
      limitedKeys,
      averageUsage: activeKeys > 0 ? totalUsage / activeKeys : 0,
    };
  }

  /**
   * Iniciar limpieza periódica
   */
  private startCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, Math.min(this.options.windowMs / 2, 60000)); // Cada 30s o la mitad de la ventana
  }

  /**
   * Limpiar entradas expiradas
   */
  private cleanup(): number {
    const now = Date.now();
    let count = 0;

    for (const [key, entry] of this.store.entries()) {
      if (now - entry.firstRequest >= this.options.windowMs) {
        this.store.delete(key);
        count++;
      }
    }

    return count;
  }

  /**
   * Detener el rate limiter
   */
  stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.resetAll();
  }
}

// Rate limiters preconfigurados
export const rateLimiters = {
  // API general: 100 requests por minuto
  api: new AdvancedRateLimiter({
    windowMs: 60000,
    max: 100,
    message: 'Too many API requests, please slow down.',
  }),

  // Login: 5 intentos por 15 minutos
  login: new AdvancedRateLimiter({
    windowMs: 15 * 60000,
    max: 5,
    message: 'Too many login attempts, please try again in 15 minutes.',
    statusCode: 429,
  }),

  // Registro: 3 por hora
  register: new AdvancedRateLimiter({
    windowMs: 60 * 60000,
    max: 3,
    message: 'Too many registration attempts, please try again later.',
    statusCode: 429,
  }),

  // Reset password: 3 por hora
  passwordReset: new AdvancedRateLimiter({
    windowMs: 60 * 60000,
    max: 3,
    message: 'Too many password reset requests, please try again later.',
    statusCode: 429,
  }),

  // Uploads: 10 por minuto
  uploads: new AdvancedRateLimiter({
    windowMs: 60000,
    max: 10,
    message: 'Too many file uploads, please slow down.',
    statusCode: 429,
  }),

  // Mensajes: 30 por minuto
  messages: new AdvancedRateLimiter({
    windowMs: 60000,
    max: 30,
    message: 'Too many messages, please slow down.',
    statusCode: 429,
  }),

  // Búsquedas: 60 por minuto
  search: new AdvancedRateLimiter({
    windowMs: 60000,
    max: 60,
    message: 'Too many searches, please slow down.',
    statusCode: 429,
  }),

  // Exportaciones: 5 por hora
  exports: new AdvancedRateLimiter({
    windowMs: 60 * 60000,
    max: 5,
    message: 'Too many export requests, please try again later.',
    statusCode: 429,
  }),
};

// Helper para crear rate limiter personalizado
export function createRateLimiter(options: RateLimitOptions): AdvancedRateLimiter {
  return new AdvancedRateLimiter(options);
}

// Hook para React (uso en componentes)
export function useRateLimit(key: string, options: RateLimitOptions) {
  const limiter = new AdvancedRateLimiter(options);
  
  const check = () => {
    const info = limiter.getInfo(key) || {
      total: options.max || 100,
      remaining: options.max || 100,
      resetTime: Date.now() + (options.windowMs || 60000),
      isLimited: false,
    };
    
    return {
      ...info,
      canProceed: !info.isLimited,
      waitTime: info.isLimited ? Math.max(0, info.resetTime - Date.now()) : 0,
    };
  };

  const execute = async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    const status = check();
    if (!status.canProceed) {
      throw new Error('Rate limit exceeded');
    }
    return await fn();
  };

  return { check, execute, limiter };
}
