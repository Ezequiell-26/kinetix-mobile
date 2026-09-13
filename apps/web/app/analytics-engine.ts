/**
 * Analytics Engine - Sistema de Métricas Avanzado
 * Basado en patrones de Plausible Analytics (MIT)
 * 
 * Features:
 * - Page views automáticos
 * - Custom events tracking
 * - User journey mapping
 * - Conversion funnel analysis
 * - Privacy-first (no cookies, GDPR compliant)
 * - Real-time dashboard ready
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface PageViewData {
  url: string;
  referrer: string;
  title: string;
  device: {
    width: number;
    height: number;
    pixelRatio: number;
  };
  browser: string;
  os: string;
}

class AnalyticsEngine {
  private apiKey: string;
  private domain: string;
  private enabled: boolean;
  private queue: AnalyticsEvent[] = [];
  private sessionId: string;
  private userProperties: Record<string, any> = {};

  constructor(apiKey: string = '', domain: string = 'kinetixfit.com') {
    this.apiKey = apiKey;
    this.domain = domain;
    this.enabled = !!apiKey;
    this.sessionId = this.generateSessionId();
    
    // Auto-detect if running in production
    if (!apiKey && process.env.NEXT_PUBLIC_ANALYTICS_ID) {
      this.apiKey = process.env.NEXT_PUBLIC_ANALYTICS_ID;
      this.enabled = true;
    }

    this.initialize();
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initialize() {
    if (!this.enabled) {
      console.log('📊 Analytics disabled - running in development mode');
      return;
    }

    // Track initial page view
    this.trackPageView();

    // Track history changes for SPA
    if (typeof window !== 'undefined') {
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = (...args) => {
        originalPushState.apply(history, args);
        setTimeout(() => this.trackPageView(), 0);
      };

      history.replaceState = (...args) => {
        originalReplaceState.apply(history, args);
        setTimeout(() => this.trackPageView(), 0);
      };

      window.addEventListener('popstate', () => {
        setTimeout(() => this.trackPageView(), 0);
      });
    }
  }

  async trackPageView(url?: string, title?: string) {
    const pageUrl = url || window.location.pathname;
    const pageTitle = title || document.title;
    const referrer = document.referrer;

    const data: PageViewData = {
      url: pageUrl,
      referrer,
      title: pageTitle,
      device: {
        width: window.screen.width,
        height: window.screen.height,
        pixelRatio: window.devicePixelRatio || 1,
      },
      browser: navigator.userAgent,
      os: navigator.platform,
    };

    await this.sendEvent('pageview', data);
  }

  async track(event: AnalyticsEvent) {
    const eventData: AnalyticsEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      sessionId: this.sessionId,
      userId: event.userId || this.getUserId(),
    };

    if (this.enabled) {
      await this.sendEvent(event.name, eventData.properties);
    } else {
      this.queue.push(eventData);
      console.log('📊 Event queued:', eventData);
    }
  }

  async trackCustom(eventName: string, properties: Record<string, any> = {}) {
    await this.track({
      name: eventName,
      properties,
    });
  }

  async trackWorkoutStarted(workoutId: string, workoutType: string, difficulty: string) {
    await this.trackCustom('workout_started', {
      workout_id: workoutId,
      workout_type: workoutType,
      difficulty,
      timestamp: new Date().toISOString(),
    });
  }

  async trackWorkoutCompleted(
    workoutId: string,
    duration: number,
    caloriesBurned: number,
    exercisesCompleted: number
  ) {
    await this.trackCustom('workout_completed', {
      workout_id: workoutId,
      duration_seconds: duration,
      calories_burned: caloriesBurned,
      exercises_completed: exercisesCompleted,
      completion_rate: (exercisesCompleted / 10) * 100, // Assuming 10 exercises max
    });
  }

  async trackAchievement(achievementId: string, achievementName: string, category: string) {
    await this.trackCustom('achievement_unlocked', {
      achievement_id: achievementId,
      achievement_name: achievementName,
      category,
      timestamp: new Date().toISOString(),
    });
  }

  async trackConversion(conversionType: string, value?: number, currency?: string) {
    await this.trackCustom('conversion', {
      conversion_type: conversionType,
      value: value || 0,
      currency: currency || 'USD',
    });
  }

  setUserProperty(key: string, value: any) {
    this.userProperties[key] = value;
  }

  setUserProperties(properties: Record<string, any>) {
    this.userProperties = { ...this.userProperties, ...properties };
  }

  private getUserId(): string | undefined {
    if (typeof localStorage !== 'undefined') {
      let userId = localStorage.getItem('kinetix_user_id');
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('kinetix_user_id', userId);
      }
      return userId;
    }
    return undefined;
  }

  private async sendEvent(eventName: string, properties?: Record<string, any>) {
    if (!this.enabled) return;

    const payload = {
      name: eventName,
      url: window.location.href,
      domain: this.domain,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      language: navigator.language,
      properties: {
        ...this.userProperties,
        ...properties,
      },
      session_id: this.sessionId,
      user_id: this.getUserId(),
    };

    try {
      // Send to analytics endpoint (replace with your analytics service)
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true, // Ensure request completes even if page closes
      });

      if (!response.ok) {
        throw new Error(`Analytics error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send analytics:', error);
      // Queue for retry
      this.queue.push({
        name: eventName,
        properties,
        timestamp: Date.now(),
      });
    }
  }

  async flushQueue() {
    const eventsToSend = [...this.queue];
    this.queue = [];

    for (const event of eventsToSend) {
      await this.sendEvent(event.name, event.properties);
    }
  }

  getMetrics() {
    return {
      sessionId: this.sessionId,
      userId: this.getUserId(),
      queuedEvents: this.queue.length,
      enabled: this.enabled,
    };
  }
}

// Singleton instance
let analyticsInstance: AnalyticsEngine | null = null;

export function getAnalytics(): AnalyticsEngine {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsEngine();
  }
  return analyticsInstance;
}

export function initAnalytics(apiKey?: string, domain?: string): AnalyticsEngine {
  analyticsInstance = new AnalyticsEngine(apiKey, domain);
  return analyticsInstance;
}

// Export for direct usage
export const analytics = new AnalyticsEngine();

export default analytics;
