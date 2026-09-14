/**
 * Analytics tracking system
 * Supports Google Analytics 4 and custom events
 */

// Extend window type
declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Analytics event types
export type AnalyticsEvent =
  // User events
  | "signup"
  | "login"
  | "logout"
  | "profile_update"
  // Workout events
  | "workout_started"
  | "workout_completed"
  | "workout_paused"
  | "workout_abandoned"
  | "exercise_completed"
  | "set_completed"
  | "pr_achieved" // Personal record
  // Progress events
  | "weight_logged"
  | "measurement_logged"
  | "photo_uploaded"
  | "progress_viewed"
  // Achievement events
  | "achievement_unlocked"
  | "level_up"
  | "challenge_completed"
  | "streak_milestone"
  // Social events
  | "checkin_sent"
  | "message_sent"
  | "message_read"
  // Engagement
  | "tool_opened"
  | "page_viewed"
  | "search_performed"
  | "feature_discovered"
  // Monetization
  | "subscription_started"
  | "subscription_cancelled"
  | "payment_completed"
  | "payment_failed";

interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined;
}

class Analytics {
  private isInitialized = false;
  private userId: string | null = null;

  /**
   * Initialize analytics
   */
  init(measurementId: string) {
    if (this.isInitialized || typeof window === "undefined") return;

    // Load GA4
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer?.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: false, // We'll handle this manually
    });

    this.isInitialized = true;
  }

  /**
   * Set user ID for tracking
   */
  setUserId(userId: string) {
    this.userId = userId;
    if (window.gtag) {
      window.gtag("set", { user_id: userId });
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: AnalyticsProperties) {
    if (window.gtag) {
      window.gtag("set", "user_properties", properties);
    }
  }

  /**
   * Track an event
   */
  track(event: AnalyticsEvent, properties?: AnalyticsProperties) {
    if (!this.isInitialized && typeof window !== "undefined") {
      this.init(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "");
    }

    // Console log in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics]", event, properties);
    }

    // Send to GA4
    if (window.gtag) {
      window.gtag("event", event, {
        ...properties,
        user_id: this.userId,
      });
    }

    // Send to custom backend (optional)
    this.sendToBackend(event, properties);
  }

  /**
   * Track page view
   */
  pageView(path: string, title?: string) {
    this.track("page_viewed", {
      page_path: path,
      page_title: title || document.title,
    });
  }

  /**
   * Track conversion (payment, signup, etc)
   */
  conversion(event: string, value?: number, currency: string = "ARS") {
    if (window.gtag) {
      window.gtag("event", event, {
        value,
        currency,
      });
    }
  }

  /**
   * Send event to custom backend for advanced analytics
   */
  private async sendToBackend(
    event: AnalyticsEvent,
    properties?: AnalyticsProperties
  ) {
    // Only in production
    if (process.env.NODE_ENV !== "production") return;

    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event,
          properties,
          userId: this.userId,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      // Silent fail - don't break the app
      console.error("Failed to send analytics:", error);
    }
  }
}

// Singleton instance
export const analytics = new Analytics();

// Helper functions for common events

export const trackWorkoutStart = (workoutId: string, workoutName: string) => {
  analytics.track("workout_started", {
    workout_id: workoutId,
    workout_name: workoutName,
  });
};

export const trackWorkoutComplete = (
  workoutId: string,
  duration: number,
  exercises: number,
  volume: number
) => {
  analytics.track("workout_completed", {
    workout_id: workoutId,
    duration_minutes: duration,
    exercises_count: exercises,
    total_volume_kg: volume,
  });
};

export const trackAchievementUnlock = (
  achievementId: string,
  achievementName: string,
  xpGained: number
) => {
  analytics.track("achievement_unlocked", {
    achievement_id: achievementId,
    achievement_name: achievementName,
    xp_gained: xpGained,
  });
};

export const trackLevelUp = (newLevel: number, totalXP: number) => {
  analytics.track("level_up", {
    new_level: newLevel,
    total_xp: totalXP,
  });
};

export const trackPR = (
  exercise: string,
  weight: number,
  previousRecord: number
) => {
  analytics.track("pr_achieved", {
    exercise,
    new_weight: weight,
    previous_weight: previousRecord,
    improvement_kg: weight - previousRecord,
  });
};

export const trackCheckinSent = (mood: number, fatigue: number) => {
  analytics.track("checkin_sent", {
    mood_rating: mood,
    fatigue_rating: fatigue,
  });
};

export const trackSubscription = (plan: string, price: number) => {
  analytics.track("subscription_started", {
    plan_type: plan,
    plan_price: price,
  });
  analytics.conversion("purchase", price, "ARS");
};

export const trackFeatureDiscovery = (featureName: string) => {
  analytics.track("feature_discovered", {
    feature_name: featureName,
  });
};

// React hook for page view tracking
export const usePageView = (path: string) => {
  if (typeof window !== "undefined") {
    analytics.pageView(path);
  }
};
