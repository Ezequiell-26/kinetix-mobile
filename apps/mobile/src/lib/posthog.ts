"use client";

import posthog from "posthog-js";

/**
 * PostHog Analytics — KinetixFitt Mobile
 * Centraliza init + capture para retención. No romper si no hay key / SSR.
 */

export type PostHogEvent =
  | "pageview"
  | "workout_started"
  | "workout_completed"
  | "workout_paused"
  | "workout_abandoned"
  | "exercise_completed"
  | "set_completed"
  | "checkin_completed"
  | "checkin_sent"
  | "onboarding_started"
  | "onboarding_step"
  | "onboarding_completed"
  | "checkout_started"
  | "checkout_completed"
  | "subscription_started"
  | "subscription_cancelled"
  | "payment_completed"
  | "payment_failed"
  | "achievement_unlocked"
  | "level_up"
  | "pr_achieved"
  | "cta_clicked"
  | "feature_discovered";

let _initialized = false;

export function initPostHog(): void {
  if (_initialized) return;
  if (typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_placeholder_posthog_key_replace_me";
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  // No inicializar si es placeholder en producción silencioso — log only dev
  // Igual inicializamos con placeholder para no romper calls, posthog lo ignora en host
  try {
    posthog.init(key, {
      api_host: host,
      // SPA pageviews manuales vía PostHogPageView
      capture_pageview: false,
      // Captura automática de pageleave para duración
      capture_pageleave: true,
      // Persistencia en localStorage (Next.js SPA)
      persistence: "localStorage",
      // Autocapture ligero, desactiva si ruido excesivo
      autocapture: false,
      // Opcional: en desarrollo no enviar a host si es placeholder
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") {
          // ph.debug() solo en dev si se desea
          // ph.debug();
        }
        // Si la key es placeholder, opt-out para no enviar basura a PostHog
        if (key.startsWith("phc_placeholder")) {
          ph.opt_out_capturing();
          if (process.env.NODE_ENV === "development") {
            console.info("[PostHog] Placeholder key — capturing opt-out (dev). Set NEXT_PUBLIC_POSTHOG_KEY to enable.");
          }
        }
      },
    });
    _initialized = true;
    if (process.env.NODE_ENV === "development") {
      console.info("[PostHog] Initialized", { host, keyPrefix: key.slice(0, 8) + "..." });
    }
  } catch (e) {
    console.warn("[PostHog] init failed", e);
  }
}

export function isPostHogReady(): boolean {
  return _initialized && typeof window !== "undefined" && !!posthog;
}

/** Captura genérica — no-ops en SSR / antes de init, log en dev */
export function capture(event: PostHogEvent | string, properties?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    if (isPostHogReady() && !posthog.has_opted_out_capturing()) {
      posthog.capture(event, {
        ...properties,
        source: "mobile",
        timestamp: new Date().toISOString(),
      });
    } else if (process.env.NODE_ENV === "development") {
      console.log(`[PostHog capture] ${event}`, properties);
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.warn("[PostHog] capture error", e);
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

export function setPersonProperties(properties: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    if (isPostHogReady()) posthog.setPersonProperties(properties as any);
  } catch {}
}

// ── Helpers específicos requeridos por TASK ──

export function trackPageView(url?: string, props?: Record<string, unknown>): void {
  const path = url || (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/");
  capture("pageview", {
    $current_url: typeof window !== "undefined" ? window.location.href : path,
    path,
    title: typeof document !== "undefined" ? document.title : undefined,
    ...props,
  });
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

export function trackWorkoutStarted(workoutId: string, workoutName?: string): void {
  capture("workout_started", { workout_id: workoutId, workout_name: workoutName });
}

export function trackCheckin(params: { mood: number; fatigue: number; notes?: string; type?: string }): void {
  // soporta tanto checkin_completed como checkin_sent (legacy)
  capture("checkin_completed", {
    mood_rating: params.mood,
    fatigue_rating: params.fatigue,
    notes: params.notes,
    checkin_type: params.type,
  });
  // alias legacy para dashboards existentes
  capture("checkin_sent", {
    mood_rating: params.mood,
    fatigue_rating: params.fatigue,
  });
}

export function trackOnboardingStarted(props?: Record<string, unknown>): void {
  capture("onboarding_started", props);
}

export function trackOnboardingStep(step: number | string, props?: Record<string, unknown>): void {
  capture("onboarding_step", { step, ...props });
}

export function trackOnboardingCompleted(data: {
  goal?: string;
  days?: number;
  place?: string;
  role?: string;
  [k: string]: unknown;
}): void {
  capture("onboarding_completed", {
    goal: data.goal,
    days: data.days,
    place: data.place,
    role: data.role,
    ...data,
  });
}

export function trackCheckoutStarted(params: {
  plan: string;
  provider: "stripe" | "mp" | string;
  price?: number;
  currency?: string;
  email?: string;
}): void {
  capture("checkout_started", {
    plan_id: params.plan,
    plan: params.plan,
    provider: params.provider,
    price: params.price,
    currency: params.currency || "ARS",
    email: params.email,
  });
}

export function trackCheckoutCompleted(params: {
  plan: string;
  provider: string;
  price?: number;
  currency?: string;
}): void {
  capture("checkout_completed", {
    plan_id: params.plan,
    plan: params.plan,
    provider: params.provider,
    price: params.price,
    currency: params.currency || "ARS",
  });
}

export function trackSubscriptionStarted(plan: string, price: number, currency = "ARS"): void {
  capture("subscription_started", { plan, plan_type: plan, price, currency });
  capture("payment_completed", { plan, price, currency });
}

export { posthog };
