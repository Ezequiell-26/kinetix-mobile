/**
 * Sistema de Monitoreo de Performance para EZEQUIEL COACHING
 * Web Vitals, timing de operaciones y detección de cuellos de botella
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  
  // Métricas adicionales
  domContentLoaded: number;
  loadComplete: number;
  memoryUsage?: MemoryInfo;
  
  // Custom metrics
  apiResponseTimes: Record<string, number>;
  componentRenders: Record<string, number[]>;
  longTasks: LongTaskInfo[];
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface LongTaskInfo {
  startTime: number;
  duration: number;
  name: string;
}

interface ApiTiming {
  endpoint: string;
  method: string;
  startTime: number;
  endTime: number;
  status: number;
  success: boolean;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private apiTimings: Map<string, ApiTiming>;
  private observers: PerformanceObserver[];
  private reportCallbacks: ((metrics: PerformanceMetrics) => void)[];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = typeof performance !== 'undefined';
    
    this.metrics = {
      fcp: 0,
      lcp: 0,
      fid: 0,
      cls: 0,
      ttfb: 0,
      domContentLoaded: 0,
      loadComplete: 0,
      apiResponseTimes: {},
      componentRenders: {},
      longTasks: [],
    };

    this.apiTimings = new Map();
    this.observers = [];
    this.reportCallbacks = [];

    if (this.isEnabled) {
      this.initObservers();
      this.initNavigationTiming();
    }
  }

  /**
   * Inicializar observers para Web Vitals
   */
  private initObservers(): void {
    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.notifyReport();
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'first-input') {
            const fi = entry as PerformanceEventTiming;
            this.metrics.fid = fi.processingStart - fi.startTime;
          }
        });
        this.notifyReport();
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      this.observers.push(fidObserver);
    } catch (e) {
      console.warn('FID observer not supported');
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          const ls = entry as unknown as { hadRecentInput: boolean; value: number };
          if (!ls.hadRecentInput) {
            clsValue += ls.value;
          }
        });
        this.metrics.cls = clsValue;
        this.notifyReport();
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(clsObserver);
    } catch (e) {
      console.warn('CLS observer not supported');
    }

    // Long Tasks
    try {
      const longTaskObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          this.metrics.longTasks.push({
            startTime: entry.startTime,
            duration: entry.duration,
            name: entry.name,
          });
        });
        this.notifyReport();
      });
      longTaskObserver.observe({ type: 'longtask', buffered: true });
      this.observers.push(longTaskObserver);
    } catch (e) {
      console.warn('Long Task observer not supported');
    }
  }

  /**
   * Inicializar timing de navegación
   */
  private initNavigationTiming(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      this.metrics.ttfb = timing.responseStart - timing.startTime;
      this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.startTime;
      this.metrics.loadComplete = timing.loadEventEnd - timing.startTime;
      
      // First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
      }

      this.notifyReport();
    });
  }

  /**
   * Medir tiempo de ejecución de una función
   */
  measure<T>(name: string, fn: () => T): T {
    if (!this.isEnabled) {
      return fn();
    }

    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (!this.metrics.componentRenders[name]) {
      this.metrics.componentRenders[name] = [];
    }
    this.metrics.componentRenders[name].push(duration);

    // Mantener solo los últimos 100 registros
    if (this.metrics.componentRenders[name].length > 100) {
      this.metrics.componentRenders[name].shift();
    }

    this.notifyReport();
    return result;
  }

  /**
   * Medir tiempo de ejecución de una función async
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (!this.isEnabled) {
      return fn();
    }

    const startTime = performance.now();
    const result = await fn();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (!this.metrics.componentRenders[name]) {
      this.metrics.componentRenders[name] = [];
    }
    this.metrics.componentRenders[name].push(duration);

    if (this.metrics.componentRenders[name].length > 100) {
      this.metrics.componentRenders[name].shift();
    }

    this.notifyReport();
    return result;
  }

  /**
   * Iniciar medición de API call
   */
  startApiTimer(endpoint: string, method: string = 'GET'): string {
    const id = `${method}:${endpoint}:${Date.now()}`;
    this.apiTimings.set(id, {
      endpoint,
      method,
      startTime: performance.now(),
      endTime: 0,
      status: 0,
      success: false,
    });
    return id;
  }

  /**
   * Finalizar medición de API call
   */
  endApiTimer(id: string, status: number, success: boolean): number {
    const timing = this.apiTimings.get(id);
    if (!timing) return 0;

    timing.endTime = performance.now();
    timing.status = status;
    timing.success = success;

    const duration = timing.endTime - timing.startTime;
    
    const key = `${timing.method}:${timing.endpoint}`;
    this.metrics.apiResponseTimes[key] = duration;

    this.apiTimings.delete(id);
    this.notifyReport();
    
    return duration;
  }

  /**
   * Wrapper para fetch con medición automática
   */
  async fetchWithTiming(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const endpoint = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
    const method = init?.method || 'GET';
    
    const timerId = this.startApiTimer(endpoint, method);
    
    try {
      const response = await fetch(input, init);
      const duration = this.endApiTimer(timerId, response.status, response.ok);
      
      console.log(`API ${method} ${endpoint}: ${duration.toFixed(2)}ms`);
      
      return response;
    } catch (error) {
      this.endApiTimer(timerId, 0, false);
      throw error;
    }
  }

  /**
   * Obtener información de memoria (Chrome only)
   */
  getMemoryInfo(): MemoryInfo | null {
    if (typeof performance === 'undefined' || !(performance as any).memory) {
      return null;
    }

    const mem = (performance as any).memory;
    return {
      usedJSHeapSize: mem.usedJSHeapSize,
      totalJSHeapSize: mem.totalJSHeapSize,
      jsHeapSizeLimit: mem.jsHeapSizeLimit,
    };
  }

  /**
   * Registrar callback para reportes
   */
  onReport(callback: (metrics: PerformanceMetrics) => void): void {
    this.reportCallbacks.push(callback);
  }

  /**
   * Notificar a todos los callbacks
   */
  private notifyReport(): void {
    this.reportCallbacks.forEach(callback => callback(this.getMetrics()));
  }

  /**
   * Obtener métricas actuales
   */
  getMetrics(): PerformanceMetrics {
    const memory = this.getMemoryInfo();
    return {
      ...this.metrics,
      memoryUsage: memory || undefined,
    };
  }

  /**
   * Obtener promedio de renderizado para un componente
   */
  getAverageRenderTime(componentName: string): number {
    const times = this.metrics.componentRenders[componentName];
    if (!times || times.length === 0) return 0;
    
    const sum = times.reduce((a, b) => a + b, 0);
    return sum / times.length;
  }

  /**
   * Obtener percentil 95 de renderizado
   */
  getP95RenderTime(componentName: string): number {
    const times = this.metrics.componentRenders[componentName];
    if (!times || times.length === 0) return 0;

    const sorted = [...times].sort((a, b) => a - b);
    const index = Math.floor(sorted.length * 0.95);
    return sorted[index] || sorted[sorted.length - 1];
  }

  /**
   * Calcular score de performance (0-100)
   */
  calculatePerformanceScore(): number {
    const weights = {
      fcp: 0.15,
      lcp: 0.25,
      fid: 0.25,
      cls: 0.25,
      ttfb: 0.10,
    };

    const scores = {
      fcp: this.scoreThreshold(this.metrics.fcp, 1800, 3000),
      lcp: this.scoreThreshold(this.metrics.lcp, 2500, 4000),
      fid: this.scoreThreshold(this.metrics.fid, 100, 300),
      cls: this.scoreThreshold(this.metrics.cls, 0.1, 0.25),
      ttfb: this.scoreThreshold(this.metrics.ttfb, 800, 1800),
    };

    const weightedScore = 
      scores.fcp * weights.fcp +
      scores.lcp * weights.lcp +
      scores.fid * weights.fid +
      scores.cls * weights.cls +
      scores.ttfb * weights.ttfb;

    return Math.round(weightedScore * 100);
  }

  /**
   * Convertir métrica a score 0-1
   */
  private scoreThreshold(value: number, good: number, poor: number): number {
    if (value <= good) return 1;
    if (value >= poor) return 0;
    return 1 - (value - good) / (poor - good);
  }

  /**
   * Generar reporte completo
   */
  generateReport(): {
    score: number;
    metrics: PerformanceMetrics;
    recommendations: string[];
    webVitalsStatus: {
      fcp: 'good' | 'needs-improvement' | 'poor';
      lcp: 'good' | 'needs-improvement' | 'poor';
      fid: 'good' | 'needs-improvement' | 'poor';
      cls: 'good' | 'needs-improvement' | 'poor';
    };
  } {
    const score = this.calculatePerformanceScore();
    
    const getStatus = (value: number, good: number, poor: number) => {
      if (value <= good) return 'good' as const;
      if (value <= poor) return 'needs-improvement' as const;
      return 'poor' as const;
    };

    const recommendations: string[] = [];

    if (this.metrics.lcp > 2500) {
      recommendations.push('Optimize LCP: preload critical resources, optimize images');
    }
    if (this.metrics.fid > 100) {
      recommendations.push('Reduce FID: break up long tasks, minimize main thread work');
    }
    if (this.metrics.cls > 0.1) {
      recommendations.push('Improve CLS: add size attributes to media, avoid layout shifts');
    }
    if (this.metrics.fcp > 1800) {
      recommendations.push('Improve FCP: reduce server response time, eliminate render-blocking resources');
    }
    if (this.metrics.longTasks.length > 0) {
      recommendations.push(`Found ${this.metrics.longTasks.length} long tasks, consider code splitting`);
    }

    return {
      score,
      metrics: this.getMetrics(),
      recommendations,
      webVitalsStatus: {
        fcp: getStatus(this.metrics.fcp, 1800, 3000),
        lcp: getStatus(this.metrics.lcp, 2500, 4000),
        fid: getStatus(this.metrics.fid, 100, 300),
        cls: getStatus(this.metrics.cls, 0.1, 0.25),
      },
    };
  }

  /**
   * Limpiar observadores
   */
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.reportCallbacks = [];
  }
}

// Singleton global
export const performanceMonitor = new PerformanceMonitor();

// Helper para medir componentes React
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function MonitoredComponent(props: P) {
    const result = performanceMonitor.measure(componentName, () => {
      return <WrappedComponent {...props} />;
    });
    return result;
  };
}

// Exportar tipos para uso en hooks
