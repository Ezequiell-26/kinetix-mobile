"use client";

import posthog from "posthog-js";

/**
 * PostHog Analytics — KinetixFitt Web
 * Centraliza init + capture para retención. No romper si no hay key / SSR.
 */

export type PostHogEvent =
  | "pageview"
  | "cta_clicked"
  | "checkout_started"
  | "checkout_completed"
  | "onboarding_started"
  | "onboarding_step"
  | "onboarding_completed"
  | "workout_completed"
  | "workout_started"
  | "checkin_completed"
  | "checkin_sent"
  | "subscription_started"
  | "payment_completed"
  | "payment_failed"
  | "feature_discovered"
  | "lead_captured"
  | "pricing_viewed"
  | "$web_vitals"
  | "web_vitals";

let _initialized = false;

export function initPostHog(): void {
  if (_initialized) return;
  if (typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_placeholder_posthog_key_replace_me";
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  try {
    posthog.init(key, {
      api_host: host,
      capture_pageview: false,
      capture_pageleave: true,
      persistence: "localStorage",
      autocapture: false,
      loaded: (ph) => {
        if (key.startsWith("phc_placeholder")) {
          ph.opt_out_capturing();
          if (process.env.NODE_ENV === "development") {
            console.info("[PostHog:web] Placeholder key — capturing opt-out. Set NEXT_PUBLIC_POSTHOG_KEY to enable.");
          }
        }
      },
    });
    _initialized = true;
    if (process.env.NODE_ENV === "development") {
      console.info("[PostHog:web] Initialized", { host, keyPrefix: key.slice(0, 8) + "..." });
    }
  } catch (e) {
    console.warn("[PostHog:web] init failed", e);
  }
}

export function isPostHogReady(): boolean {
  return _initialized && typeof window !== "undefined" && !!posthog;
}

export function capture(event: PostHogEvent | string, properties?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    if (isPostHogReady() && !posthog.has_opted_out_capturing()) {
      posthog.capture(event, {
        ...properties,
        source: "web",
        timestamp: new Date().toISOString(),
      });
    } else if (process.env.NODE_ENV === "development") {
      console.log(`[PostHog:web capture] ${event}`, properties);
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.warn("[PostHog:web] capture error", e);
  }
}

export function identify(userId: string, properties?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    if (isPostHogReady()) posthog.identify(userId, properties);
  } catch {}
}

export function reset(): void {
  if (typeof window === "undefined") return;
  try {
    if (isPostHogReady()) posthog.reset();
  } catch {}
}

// ── Helpers específicos ──

export function trackPageView(url?: string, props?: Record<string, unknown>): void {
  const path = url || (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/");
  capture("pageview", {
    $current_url: typeof window !== "undefined" ? window.location.href : path,
    path,
    title: typeof document !== "undefined" ? document.title : undefined,
    ...props,
  });
}

export function trackCtaClicked(cta: string, location?: string, props?: Record<string, unknown>): void {
  capture("cta_clicked", { cta, location, ...props });
}

export function trackCheckoutStarted(params: {
  plan: string;
  provider: "stripe" | "mp" | string;
  price?: number;
  currency?: string;
  location?: string;
}): void {
  capture("checkout_started", {
    plan_id: params.plan,
    plan: params.plan,
    provider: params.provider,
    price: params.price,
    currency: params.currency || "USD",
    location: params.location,
  });
}

export function trackCheckoutCompleted(params: { plan: string; provider: string; price?: number; currency?: string }): void {
  capture("checkout_completed", {
    plan_id: params.plan,
    plan: params.plan,
    provider: params.provider,
    price: params.price,
    currency: params.currency || "USD",
  });
}

export function trackOnboardingStarted(props?: Record<string, unknown>): void {
  capture("onboarding_started", props);
}

export function trackOnboardingStep(step: number | string, props?: Record<string, unknown>): void {
  capture("onboarding_step", { step, ...props });
}

export function trackOnboardingCompleted(data: Record<string, unknown>): void {
  capture("onboarding_completed", data);
}

export function trackWorkoutCompleted(params: {
  workoutId: string;
  workoutName?: string;
  durationMinutes: number;
  exercisesCount?: number;
  totalVolumeKg?: number;
}): void {
  capture("workout_completed", {
    workout_id: params.workoutId,
    workout_name: params.workoutName,
    duration_minutes: params.durationMinutes,
    exercises_count: params.exercisesCount,
    total_volume_kg: params.totalVolumeKg,
  });
}

export function trackCheckin(params: { mood: number; fatigue: number; notes?: string }): void {
  capture("checkin_completed", {
    mood_rating: params.mood,
    fatigue_rating: params.fatigue,
    notes: params.notes,
  });
  capture("checkin_sent", {
    mood_rating: params.mood,
    fatigue_rating: params.fatigue,
  });
}

// ── Web Vitals RUM ───────────────────────────────────────────────
export type WebVitalMetric = {
  name: "CLS" | "LCP" | "FCP" | "INP" | "TTFB" | string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  navigationType: string;
};

export function trackWebVital(metric: WebVitalMetric): void {
  const props = {
    metric_name: metric.name,
    metric_value: metric.value,
    metric_rating: metric.rating,
    metric_delta: metric.delta,
    metric_id: metric.id,
    navigation_type: metric.navigationType,
    $web_vitals_score: metric.value,
    $web_vitals_rating: metric.rating,
    value: metric.value,
    rating: metric.rating,
  };
  // PostHog recommends $web_vitals as event name for RUM dashboards
  capture("$web_vitals", props as Record<string, unknown>);
  capture("web_vitals", props as Record<string, unknown>);
}

export function initWebVitals(): void {
  if (typeof window === "undefined") return;
  // Lazy import web-vitals to avoid SSR issues
  import("web-vitals")
    .then((mod: unknown) => {
      const m = mod as Record<string, (cb: (metric: WebVitalMetric) => void) => void>;
      try {
        if (m.onCLS) m.onCLS(trackWebVital);
        if (m.onLCP) m.onLCP(trackWebVital);
        if (m.onFID) m.onFID(trackWebVital);
        if (m.onINP) m.onINP(trackWebVital);
        if (m.onFCP) m.onFCP(trackWebVital);
        if (m.onTTFB) m.onTTFB(trackWebVital);
      } catch (e) {
        if (process.env.NODE_ENV === "development") console.warn("[PostHog:web] WebVitals registration failed", e);
      }
    })
    .catch(() => {});
}

export { posthog };
