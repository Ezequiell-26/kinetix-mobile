"use client";

import { useEffect } from "react";
import { capture } from "../lib/posthog";

type WebVitalMetric = {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  navigationType: string;
};

function sendToPostHog(metric: WebVitalMetric) {
  const props = {
    metric_name: metric.name,
    metric_value: metric.value,
    metric_rating: metric.rating,
    metric_delta: metric.delta,
    metric_id: metric.id,
    navigation_type: metric.navigationType,
    // PostHog conventional keys
    $web_vitals_score: metric.value,
    $web_vitals_rating: metric.rating,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
  };

  // Capture under both $web_vitals (PostHog convention) and web_vitals for dashboards
  capture("$web_vitals", props as Record<string, unknown>);
  capture("web_vitals", props as Record<string, unknown>);

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(`[WebVitals] ${metric.name}: ${metric.value} (${metric.rating})`, metric);
  }
}

export function WebVitals() {
  useEffect(() => {
    let cancelled = false;

    // Dynamic import to keep bundle small and support web-vitals 3.x & 4.x
    import("web-vitals")
      .then((mod: unknown) => {
        if (cancelled) return;
        const m = mod as Record<string, (cb: (metric: WebVitalMetric) => void) => void>;
        try {
          // v4 / v3 API: named exports
          if (m.onCLS) m.onCLS(sendToPostHog);
          if (m.onLCP) m.onLCP(sendToPostHog);
          if (m.onFID) m.onFID(sendToPostHog); // fallback for v3
          if (m.onINP) m.onINP(sendToPostHog);
          if (m.onFCP) m.onFCP(sendToPostHog);
          if (m.onTTFB) m.onTTFB(sendToPostHog);
        } catch (e) {
          console.warn("[WebVitals] registration failed", e);
        }
      })
      .catch((e) => {
        console.warn("[WebVitals] import failed", e);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

export default WebVitals;
