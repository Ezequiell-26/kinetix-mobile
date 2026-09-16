"use client";
import { useEffect } from "react";
import { capture, trackRevenueDashboardViewed, trackTrainerPaymentsViewed } from "@/lib/posthog";

export function TrainerAnalyticsTracker({ mrr, currency = "ARS" }: { mrr?: number; currency?: string }) {
  useEffect(() => {
    capture("trainer_analytics_viewed", { source: "trainer_analytics_page", mrr, currency });
    trackRevenueDashboardViewed({ mrr, currency, source: "trainer_analytics_page" });
  }, [mrr, currency]);
  return null;
}

export function TrainerPaymentsTracker({ mrr, totalPayments }: { mrr?: number; totalPayments?: number }) {
  useEffect(() => {
    trackTrainerPaymentsViewed({ mrr, total_payments: totalPayments, source: "trainer_payments_page" });
    capture("trainer_payments_page_viewed", { mrr, total_payments: totalPayments });
  }, [mrr, totalPayments]);
  return null;
}

export function PostHogPageTracker({ event, properties }: { event: string; properties?: Record<string, unknown> }) {
  useEffect(() => {
    capture(event, properties);
  }, [event, JSON.stringify(properties)]);
  return null;
}
