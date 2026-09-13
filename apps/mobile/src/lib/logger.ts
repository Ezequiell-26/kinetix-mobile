/**
 * Sistema de Logging Estructurado para EZEQUIEL COACHING
 * Logs con niveles, contexto, formato JSON y envío a servicios externos
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  environment: 'development' | 'production' | 'test';
  version: string;
}

export interface LogTransport {
  send(entry: LogEntry): Promise<void> | void;
}

interface LogConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableRemote: boolean;
  transports: LogTransport[];
  sampleRate: number; // Para muestreo en producción (0-1)
}

export class StructuredLogger {
  private config: LogConfig;
  private defaultContext: LogContext;
  private levelPriority: Record<LogLevel, number>;
  private buffer: LogEntry[];
  private flushInterval: NodeJS.Timeout | null;

  constructor(config?: Partial<LogConfig>) {
    this.levelPriority = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      fatal: 4,
    };

    this.config = {
      minLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      enableConsole: true,
      enableFile: false,
      enableRemote: process.env.NODE_ENV === 'production',
      transports: [],
      sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1, // 10% en prod
      ...config,
    };

    this.defaultContext = {};
    this.buffer = [];
    this.flushInterval = null;

    // Auto-flush cada 30 segundos
    if (this.config.enableRemote) {
      this.startFlushInterval();
    }
  }

  /**
   * Establecer contexto por defecto
   */
  setDefaultContext(context: LogContext): void {
    this.defaultContext = { ...this.defaultContext, ...context };
  }

  /**
   * Crear logger hijo con contexto adicional
   */
  child(context: LogContext): StructuredLogger {
    const childLogger = new StructuredLogger(this.config);
    childLogger.setDefaultContext({ ...this.defaultContext, ...context });
    return childLogger;
  }

  /**
   * Log debug
   */
  debug(message: string, context: LogContext = {}): void {
    this.log('debug', message, context);
  }

  /**
   * Log info
   */
  info(message: string, context: LogContext = {}): void {
    this.log('info', message, context);
  }

  /**
   * Log warning
   */
  warn(message: string, context: LogContext = {}): void {
    this.log('warn', message, context);
  }

  /**
   * Log error
   */
  error(message: string, error?: Error, context: LogContext = {}): void {
    const logContext = { ...context };
    if (error) {
      logContext.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }
    this.log('error', message, logContext);
  }

  /**
   * Log fatal
   */
  fatal(message: string, error?: Error, context: LogContext = {}): void {
    const logContext = { ...context };
    if (error) {
      logContext.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }
    this.log('fatal', message, logContext);
  }

  /**
   * Método principal de logging
   */
  private log(level: LogLevel, message: string, context: LogContext = {}): void {
    // Verificar nivel mínimo
    if (this.levelPriority[level] < this.levelPriority[this.config.minLevel]) {
      return;
    }

    // Muestreo en producción
    if (process.env.NODE_ENV === 'production' && Math.random() > this.config.sampleRate) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: { ...this.defaultContext, ...context },
      environment: process.env.NODE_ENV as 'development' | 'production' | 'test',
      version: process.env.APP_VERSION || '1.0.0',
    };

    // Console output
    if (this.config.enableConsole) {
      this.writeToConsole(entry);
    }

    // Remote transport
    if (this.config.enableRemote && (level === 'error' || level === 'fatal')) {
      this.buffer.push(entry);
      
      // Flush inmediato para errores críticos
      if (level === 'fatal' || this.buffer.length >= 10) {
        this.flush();
      }
    }
  }

  /**
   * Escribir en consola con formato
   */
  private writeToConsole(entry: LogEntry): void {
    const colorCodes = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m', // Red
      fatal: '\x1b[35m', // Magenta
      reset: '\x1b[0m',
    };

    const color = colorCodes[entry.level];
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;

    if (entry.level === 'error' || entry.level === 'fatal') {
      console.error(`${color}${prefix}${colorCodes.reset} ${entry.message}`, entry.context);
    } else if (entry.level === 'warn') {
      console.warn(`${color}${prefix}${colorCodes.reset} ${entry.message}`, entry.context);
    } else {
      console.log(`${color}${prefix}${colorCodes.reset} ${entry.message}`, entry.context);
    }
  }

  /**
   * Agregar transporte custom
   */
  addTransport(transport: LogTransport): void {
    this.config.transports.push(transport);
  }

  /**
   * Enviar logs a servicios remotos
   */
  private async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const logsToSend = [...this.buffer];
    this.buffer = [];

    // Enviar a todos los transports
    for (const transport of this.config.transports) {
      try {
        await Promise.all(logsToSend.map(entry => transport.send(entry)));
      } catch (error) {
        console.error('Failed to send logs to transport:', error);
      }
    }

    // También enviar a Sentry si está disponible
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      logsToSend.forEach(entry => {
        if (entry.level === 'error' || entry.level === 'fatal') {
          (window as any).Sentry.captureException({
            message: entry.message,
            ...entry.context,
          });
        }
      });
    }
  }

  /**
   * Iniciar intervalo de flush automático
   */
  private startFlushInterval(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }

    this.flushInterval = setInterval(() => {
      this.flush();
    }, 30000); // 30 segundos
  }

  /**
   * Detener logger
   */
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.flush(); // Flush final
  }

  /**
   * Obtener estadísticas de logs
   */
  getStats(): {
    bufferSize: number;
    totalLogs: number;
    byLevel: Record<LogLevel, number>;
  } {
    // Esta es una implementación básica
    // En producción podrías llevar contadores reales
    return {
      bufferSize: this.buffer.length,
      totalLogs: 0,
      byLevel: {
        debug: 0,
        info: 0,
        warn: 0,
        error: 0,
        fatal: 0,
      },
    };
  }
}

// Logger singleton global
export const logger = new StructuredLogger();

// Middleware para Next.js/Express
export function loggingMiddleware(loggerInstance: StructuredLogger) {
  return async (req: any, res: any, next: () => void) => {
    const start = Date.now();
    const requestId = Math.random().toString(36).substring(7);

    // Contexto base para este request
    const requestLogger = loggerInstance.child({
      requestId,
      endpoint: req.url,
      method: req.method,
      userAgent: req.headers?.['user-agent'],
      ip: req.ip || req.headers?.['x-forwarded-for'],
    });

    requestLogger.debug('Request started');

    // Wrapper para response
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    res.json = function (data: any) {
      const duration = Date.now() - start;
      requestLogger.info('Request completed', {
        statusCode: res.statusCode,
        duration,
      });
      return originalJson(data);
    };

    res.send = function (data: any) {
      const duration = Date.now() - start;
      requestLogger.info('Request completed', {
        statusCode: res.statusCode,
        duration,
      });
      return originalSend(data);
    };

    // Manejo de errores
    res.on('error', (error: Error) => {
      const duration = Date.now() - start;
      requestLogger.error('Request failed', error, {
        duration,
      });
    });

    next();
  };
}

// Hook para React
export function useLogger(componentName: string) {
  const componentLogger = logger.child({ component: componentName });

  const logDebug = (message: string, context?: LogContext) => {
    componentLogger.debug(message, context);
  };

  const logInfo = (message: string, context?: LogContext) => {
    componentLogger.info(message, context);
  };

  const logWarn = (message: string, context?: LogContext) => {
    componentLogger.warn(message, context);
  };

  const logError = (message: string, error?: Error, context?: LogContext) => {
    componentLogger.error(message, error, context);
  };

  return {
    debug: logDebug,
    info: logInfo,
    warn: logWarn,
    error: logError,
    child: (ctx: LogContext) => componentLogger.child(ctx),
  };
}

// Transportes preconfigurados
export class HttpTransport implements LogTransport {
  private endpoint: string;
  private apiKey?: string;

  constructor(endpoint: string, apiKey?: string) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
  }

  async send(entry: LogEntry): Promise<void> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      await fetch(this.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('HTTP transport failed:', error);
    }
  }
}

export class ConsoleTransport implements LogTransport {
  async send(entry: LogEntry): Promise<void> {
    console.log(JSON.stringify(entry));
  }
}

// Exportar tipos
export type { LogTransport, LogConfig };
