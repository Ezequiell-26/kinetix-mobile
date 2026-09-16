/**
 * Performance Monitor - Sistema de Monitoreo de Rendimiento
 * Basado en patrones de Web Vitals y Lighthouse.
 */

export interface WebVitals {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
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

type ObserverCallback = (data: unknown) => void;
type FirstInputEntry = PerformanceEntry & { processingStart: number };
type LayoutShiftEntry = PerformanceEntry & { hadRecentInput?: boolean; value?: number };
type ResourceTimingEntry = PerformanceResourceTiming;
type MemoryInfo = { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number };
type NetworkInformation = {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

class PerformanceMonitor {
  private metrics: PerformanceMetrics | null = null;
  private observers: Map<string, Set<ObserverCallback>> = new Map();
  private frameCount = 0;
  private lastFrameTime = typeof performance !== "undefined" ? performance.now() : 0;
  private fps = 60;
  private rafId: number | null = null;
  private memoryInterval: number | null = null;
  private networkConnection: NetworkInformation | null = null;
  private readonly networkChangeHandler = () => this.updateNetworkInfo();

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window === "undefined") return;
    this.startFPSMonitoring();
    this.observeWebVitals();
    this.observeMemory();
    this.observeNetwork();
    this.observeResources();
    if (process.env.NODE_ENV === "development") console.log("Performance Monitor initialized");
  }

  private startFPSMonitoring() {
    const measureFPS = () => {
      const now = performance.now();
      this.frameCount++;
      if (now - this.lastFrameTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFrameTime));
        this.frameCount = 0;
        this.lastFrameTime = now;
        this.notify("fps", this.fps);
      }
      this.rafId = requestAnimationFrame(measureFPS);
    };
    this.rafId = requestAnimationFrame(measureFPS);
  }

  private observeWebVitals() {
    if (!window.PerformanceObserver) return;

    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (!lastEntry) return;
        const lcp = lastEntry.startTime;
        this.updateMetric("lcp", lcp);
        this.notify("webvital", { type: "LCP", value: lcp });
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch {
      console.warn("LCP observer not supported");
    }

    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const rawEntry of entryList.getEntries()) {
          const entry = rawEntry as FirstInputEntry;
          const fid = Math.max(0, entry.processingStart - entry.startTime);
          this.updateMetric("fid", fid);
          this.notify("webvital", { type: "FID", value: fid });
        }
      });
      fidObserver.observe({ entryTypes: ["first-input"] });
    } catch {
      console.warn("FID observer not supported");
    }

    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const rawEntry of entryList.getEntries()) {
          const entry = rawEntry as LayoutShiftEntry;
          if (!entry.hadRecentInput) {
            clsValue += entry.value ?? 0;
            this.updateMetric("cls", clsValue);
            this.notify("webvital", { type: "CLS", value: clsValue });
          }
        }
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    } catch {
      console.warn("CLS observer not supported");
    }

    try {
      const paintObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            this.updateMetric("fcp", entry.startTime);
            this.notify("webvital", { type: "FCP", value: entry.startTime });
          }
        }
      });
      paintObserver.observe({ entryTypes: ["paint"] });
    } catch {
      console.warn("Paint observer not supported");
    }

    const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (navigationEntry) {
      const ttfb = Math.max(0, navigationEntry.responseStart - navigationEntry.startTime);
      this.updateMetric("ttfb", ttfb);
      this.notify("webvital", { type: "TTFB", value: ttfb });
    }
  }

  private observeMemory() {
    const perf = performance as Performance & { memory?: MemoryInfo };
    if (!perf.memory) return;
    this.memoryInterval = window.setInterval(() => {
      if (!this.metrics) this.ensureMetrics();
      const mem = perf.memory;
      if (!mem) return;
      this.metrics = {
        ...this.metrics!,
        memory: {
          usedJSHeapSize: mem.usedJSHeapSize,
          totalJSHeapSize: mem.totalJSHeapSize,
          jsHeapSizeLimit: mem.jsHeapSizeLimit,
        },
      };
      this.notify("memory", mem);
    }, 5000);
  }

  private observeNetwork() {
    const nav = navigator as Navigator & { connection?: NetworkInformation };
    this.networkConnection = nav.connection ?? null;
    if (this.networkConnection) {
      this.updateNetworkInfo();
      this.networkConnection.addEventListener?.("change", this.networkChangeHandler);
    } else {
      this.ensureMetrics();
    }
  }

  private updateNetworkInfo() {
    const connection = this.networkConnection;
    const networkInfo = {
      effectiveType: connection?.effectiveType || "unknown",
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false,
    };
    this.ensureMetrics();
    this.metrics = { ...this.metrics!, network: networkInfo };
    this.notify("network", networkInfo);
  }

  private observeResources() {
    if (!window.PerformanceObserver) return;
    try {
      const resourceObserver = new PerformanceObserver((entryList) => {
        const resources: ResourceTiming[] = entryList.getEntries().map((rawEntry) => {
          const entry = rawEntry as ResourceTimingEntry;
          return {
            name: entry.name,
            duration: entry.duration,
            transferSize: entry.transferSize || 0,
            encodedBodySize: entry.encodedBodySize || 0,
            decodedBodySize: entry.decodedBodySize || 0,
            initiatorType: entry.initiatorType || "unknown",
          };
        });
        this.notify("resources", resources);
      });
      resourceObserver.observe({ entryTypes: ["resource"] });
    } catch {
      console.warn("Resource observer not supported");
    }
  }

  private ensureMetrics() {
    if (this.metrics) return;
    this.metrics = {
      timestamp: Date.now(),
      webVitals: { lcp: 0, fid: 0, cls: 0, fcp: 0, ttfb: 0 },
      network: { effectiveType: "unknown", downlink: 0, rtt: 0, saveData: false },
      fps: this.fps,
    };
  }

  private updateMetric(key: keyof WebVitals, value: number) {
    this.ensureMetrics();
    this.metrics!.webVitals[key] = value;
    this.metrics!.timestamp = Date.now();
  }

  public subscribe(eventType: string, callback: ObserverCallback) {
    if (!this.observers.has(eventType)) this.observers.set(eventType, new Set());
    this.observers.get(eventType)!.add(callback);
    return () => this.observers.get(eventType)?.delete(callback);
  }

  private notify(eventType: string, data: unknown) {
    this.observers.get(eventType)?.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Performance observer callback failed for ${eventType}:`, error);
      }
    });
  }

  public getMetrics(): PerformanceMetrics | null {
    if (!this.metrics) return null;
    return {
      ...this.metrics,
      fps: this.fps,
      deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
    };
  }

  public getPerformanceScore(): number {
    const metrics = this.getMetrics();
    if (!metrics) return 0;
    const { webVitals } = metrics;
    const scores = {
      lcp: webVitals.lcp < 2500 ? 100 : webVitals.lcp < 4000 ? 70 : 30,
      fid: webVitals.fid < 100 ? 100 : webVitals.fid < 300 ? 70 : 30,
      cls: webVitals.cls < 0.1 ? 100 : webVitals.cls < 0.25 ? 70 : 30,
      fcp: webVitals.fcp < 1800 ? 100 : webVitals.fcp < 3000 ? 70 : 30,
      ttfb: webVitals.ttfb < 800 ? 100 : webVitals.ttfb < 1800 ? 70 : 30,
    };
    return Math.round(scores.lcp * 0.25 + scores.fid * 0.25 + scores.cls * 0.15 + scores.fcp * 0.15 + scores.ttfb * 0.2);
  }

  public generateReport(): string {
    const metrics = this.getMetrics();
    if (!metrics) return "No metrics available";
    const score = this.getPerformanceScore();
    const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";
    return `KinetixFitt Performance Report\nScore: ${score}/100 (${grade})\nLCP: ${metrics.webVitals.lcp.toFixed(0)}ms\nFID: ${metrics.webVitals.fid.toFixed(0)}ms\nCLS: ${metrics.webVitals.cls.toFixed(3)}\nFCP: ${metrics.webVitals.fcp.toFixed(0)}ms\nTTFB: ${metrics.webVitals.ttfb.toFixed(0)}ms\nFPS: ${metrics.fps}`;
  }

  public destroy() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    if (this.memoryInterval !== null) window.clearInterval(this.memoryInterval);
    this.networkConnection?.removeEventListener?.("change", this.networkChangeHandler);
    this.observers.clear();
    this.rafId = null;
    this.memoryInterval = null;
    this.networkConnection = null;
  }
}

let performanceInstance: PerformanceMonitor | null = null;
export function getPerformanceMonitor(): PerformanceMonitor {
  performanceInstance ??= new PerformanceMonitor();
  return performanceInstance;
}
export const performanceMonitor = getPerformanceMonitor();
export default performanceMonitor;
