"use client";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "./chart-skeleton";

// Recharts-heavy charts → split into async chunks (not in First Load JS)
// Cada uno se carga solo cuando su tab/categoría entra en viewport.
export const LazyLiftShiftAnalytics = dynamic(
  () => import("@/components/liftshift-analytics").then((m) => m.LiftShiftAnalytics),
  { ssr: false, loading: () => <ChartSkeleton height={220} /> }
);
export const LazyAkiloTracker = dynamic(
  () => import("@/components/akilo-tracker").then((m) => m.AkiloTracker),
  { ssr: false, loading: () => <ChartSkeleton height={180} /> }
);
export const LazySleepTracker = dynamic(
  () => import("@/components/sleep-tracker").then((m) => m.SleepTracker),
  { ssr: false, loading: () => <ChartSkeleton height={140} /> }
);
export const LazyAnalyticsCharts = dynamic(
  () => import("@/components/analytics-charts").then((m) => (m as unknown as { AdherenceChart: React.ComponentType }).AdherenceChart || (() => null)),
  { ssr: false, loading: () => <ChartSkeleton height={160} /> }
);
export const LazyInteractiveCharts = dynamic(
  () => import("@/components/interactive-charts").then((m) => (m as unknown as { InteractiveChart: React.ComponentType }).InteractiveChart),
  { ssr: false, loading: () => <ChartSkeleton height={160} /> }
);
export const LazyRevenueAnalytics = dynamic(
  () => import("@/components/revenue-analytics").then((m) => (m as unknown as { RevenueAnalytics: React.ComponentType }).RevenueAnalytics || (m as unknown as { default: React.ComponentType }).default),
  { ssr: false, loading: () => <ChartSkeleton height={160} /> }
);
