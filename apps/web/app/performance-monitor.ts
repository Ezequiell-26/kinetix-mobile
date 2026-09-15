/**
 * Performance Monitor - Sistema de Monitoreo de Rendimiento
 * Basado en patrones de Web Vitals (MIT) y Lighthouse
 * 
 * Features:
 * - Core Web Vitals tracking (LCP, FID, CLS, FCP, TTFB)
 * - Resource timing analysis
 * - Network quality detection
 * - Memory usage monitoring
 * - FPS tracking for animations
 * - Automatic performance reports
 */

export interface WebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

export interface PerformanceMetrics {
  timestamp: number;
  webVitals: WebVitals;
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  network: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
  fps: number;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

export interface ResourceTiming {
  name: string;
  duration: number;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
  initiatorType: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics | null = null;
  private observers: Map<string, Set<Function>> = new Map();
  private frameCount = 0;
  private lastFrameTime = performance.now();
  private fps = 60;
  private rafId: number | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    // Start FPS monitoring
    this.startFPSMonitoring();

    // Initialize Web Vitals
    this.observeWebVitals();

    // Monitor memory (Chrome only)
    this.observeMemory();

    // Monitor network quality
    this.observeNetwork();

    // Monitor resource timing
    this.observeResources();

    console.log('⚡ Performance Monitor initialized');
  }

  private startFPSMonitoring() {
    const measureFPS = () => {
      const now = performance.now();
      this.frameCount++;

      if (now - this.lastFrameTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFrameTime));
        this.frameCount = 0;
        this.lastFrameTime = now;
        this.notify('fps', this.fps);
      }

      this.rafId = requestAnimationFrame(measureFPS);
    };

    this.rafId = requestAnimationFrame(measureFPS);
  }

  private observeWebVitals() {
    if (!window.PerformanceObserver) return;

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcp = lastEntry.startTime;
        
        this.updateMetric('lcp', lcp);
        this.notify('webvital', { type: 'LCP', value: lcp });
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          const fid = entry.processingStart - entry.startTime;
          this.updateMetric('fid', fid);
          this.notify('webvital', { type: 'FID', value: fid });
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observer not supported');
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.updateMetric('cls', clsValue);
            this.notify('webvital', { type: 'CLS', value: clsValue });
          }
        });
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer not supported');
    }

    // First Contentful Paint (FCP)
    try {
      const paintObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.updateMetric('fcp', entry.startTime);
            this.notify('webvital', { type: 'FCP', value: entry.startTime });
          }
        });
      });
      
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('Paint observer not supported');
    }

    // Time to First Byte (TTFB)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.startTime;
      this.updateMetric('ttfb', ttfb);
      this.notify('webvital', { type: 'TTFB', value: ttfb });
    }
  }

  private observeMemory() {
    if ('memory' in performance) {
      const memObserver = setInterval(() => {
        const mem = (performance as any).memory;
        if (mem) {
          this.metrics = {
            ...this.metrics!,
            memory: {
              usedJSHeapSize: mem.usedJSHeapSize,
              totalJSHeapSize: mem.totalJSHeapSize,
              jsHeapSizeLimit: mem.jsHeapSizeLimit,
            },
          };
          this.notify('memory', mem);
        }
      }, 5000); // Check every 5 seconds

      // Cleanup on page unload
      window.addEventListener('beforeunload', () => clearInterval(memObserver));
    }
  }

  private observeNetwork() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateNetworkInfo = () => {
        const networkInfo = {
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false,
        };
        
        this.metrics = {
          ...this.metrics!,
          network: networkInfo,
        };
        
        this.notify('network', networkInfo);
      };

      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);
    } else {
      // Default network info if not available
      this.metrics = {
        ...this.metrics!,
        network: {
          effectiveType: 'unknown',
          downlink: 0,
          rtt: 0,
          saveData: false,
        },
      };
    }
  }

  private observeResources() {
    if (!window.PerformanceObserver) return;

    try {
      const resourceObserver = new PerformanceObserver((entryList) => {
        const resources: ResourceTiming[] = entryList.getEntries().map((entry) => ({
          name: entry.name,
          duration: entry.duration,
          transferSize: (entry as any).transferSize || 0,
          encodedBodySize: (entry as any).encodedBodySize || 0,
          decodedBodySize: (entry as any).decodedBodySize || 0,
          initiatorType: entry.initiatorType,
        }));

        this.notify('resources', resources);
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.warn('Resource observer not supported');
    }
  }

  private updateMetric(key: string, value: number) {
    if (!this.metrics) {
      this.metrics = {
        timestamp: Date.now(),
        webVitals: { lcp: 0, fid: 0, cls: 0, fcp: 0, ttfb: 0 },
        network: { effectiveType: 'unknown', downlink: 0, rtt: 0, saveData: false },
        fps: 60,
      };
    }

    this.metrics.webVitals[key as keyof WebVitals] = value;
    this.metrics.timestamp = Date.now();
  }

  public subscribe(eventType: string, callback: Function) {
    if (!this.observers.has(eventType)) {
      this.observers.set(eventType, new Set());
    }
    this.observers.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.observers.get(eventType)?.delete(callback);
    };
  }

  private notify(eventType: string, data: any) {
    const callbacks = this.observers.get(eventType);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in performance observer callback for ${eventType}:`, error);
        }
      });
    }
  }

  public getMetrics(): PerformanceMetrics | null {
    if (!this.metrics) return null;

    return {
      ...this.metrics,
      fps: this.fps,
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
    };
  }

  public getPerformanceScore(): number {
    const metrics = this.getMetrics();
    if (!metrics) return 0;

    const { webVitals } = metrics;

    // Scoring based on Google's Web Vitals thresholds
    const scores = {
      lcp: webVitals.lcp < 2500 ? 100 : webVitals.lcp < 4000 ? 70 : 30,
      fid: webVitals.fid < 100 ? 100 : webVitals.fid < 300 ? 70 : 30,
      cls: webVitals.cls < 0.1 ? 100 : webVitals.cls < 0.25 ? 70 : 30,
      fcp: webVitals.fcp < 1800 ? 100 : webVitals.fcp < 3000 ? 70 : 30,
      ttfb: webVitals.ttfb < 800 ? 100 : webVitals.ttfb < 1800 ? 70 : 30,
    };

    // Weighted average (LCP and FID are most important)
    const weights = { lcp: 0.25, fid: 0.25, cls: 0.15, fcp: 0.15, ttfb: 0.2 };
    
    const weightedScore = 
      scores.lcp * weights.lcp +
      scores.fid * weights.fid +
      scores.cls * weights.cls +
      scores.fcp * weights.fcp +
      scores.ttfb * weights.ttfb;

    return Math.round(weightedScore);
  }

  public generateReport(): string {
    const metrics = this.getMetrics();
    if (!metrics) return 'No metrics available';

    const score = this.getPerformanceScore();
    const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

    return `
╔═══════════════════════════════════════════════════════════╗
║           KINETIXFIT PERFORMANCE REPORT                   ║
╠═══════════════════════════════════════════════════════════╣
║  Overall Score: ${score}/100 (Grade: ${grade})${' '.repeat(34 - score.toString().length - grade.length)}║
╠═══════════════════════════════════════════════════════════╣
║  CORE WEB VITALS:                                         ║
║  ├─ LCP: ${metrics.webVitals.lcp.toFixed(0)}ms ${this.getVitalStatus(metrics.webVitals.lcp, 2500, 4000)}${' '.repeat(35 - metrics.webVitals.lcp.toFixed(0).length)}║
║  ├─ FID: ${metrics.webVitals.fid.toFixed(0)}ms ${this.getVitalStatus(metrics.webVitals.fid, 100, 300)}${' '.repeat(35 - metrics.webVitals.fid.toFixed(0).length)}║
║  ├─ CLS: ${metrics.webVitals.cls.toFixed(3)} ${this.getVitalStatusCls(metrics.webVitals.cls, 0.1, 0.25)}${' '.repeat(36 - metrics.webVitals.cls.toFixed(3).length)}║
║  ├─ FCP: ${metrics.webVitals.fcp.toFixed(0)}ms ${this.getVitalStatus(metrics.webVitals.fcp, 1800, 3000)}${' '.repeat(35 - metrics.webVitals.fcp.toFixed(0).length)}║
║  └─ TTFB: ${metrics.webVitals.ttfb.toFixed(0)}ms ${this.getVitalStatus(metrics.webVitals.ttfb, 800, 1800)}${' '.repeat(34 - metrics.webVitals.ttfb.toFixed(0).length)}║
╠═══════════════════════════════════════════════════════════╣
║  SYSTEM METRICS:                                          ║
║  ├─ FPS: ${metrics.fps}${' '.repeat(40 - metrics.fps.toString().length)}║
║  ├─ Network: ${metrics.network.effectiveType.toUpperCase()} (${metrics.network.downlink}Mbps)${' '.repeat(20 - metrics.network.effectiveType.length - metrics.network.downlink.toString().length)}║
║  ├─ Memory: ${metrics.memory ? `${(metrics.memory.usedJSHeapSize / 1048576).toFixed(1)}MB / ${(metrics.memory.totalJSHeapSize / 1048576).toFixed(1)}MB` : 'N/A'}${' '.repeat(15)}║
║  └─ Device: ${metrics.deviceMemory || 'N/A'}GB RAM, ${metrics.hardwareConcurrency || 'N/A'} cores${' '.repeat(10)}║
╚═══════════════════════════════════════════════════════════╝
    `.trim();
  }

  private getVitalStatus(value: number, good: number, poor: number): string {
    if (value <= good) return '✅';
    if (value <= poor) return '⚠️';
    return '❌';
  }

  private getVitalStatusCls(value: number, good: number, poor: number): string {
    if (value <= good) return '✅';
    if (value <= poor) return '⚠️';
    return '❌';
  }

  public destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.observers.clear();
  }
}

// Singleton instance
let performanceInstance: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceInstance) {
    performanceInstance = new PerformanceMonitor();
  }
  return performanceInstance;
}

export const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;
