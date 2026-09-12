"use client";

/**
 * lazy-charts.tsx — Carga diferida de los componentes que usan Recharts.
 *
 * Por qué existe: `recharts` es una dependencia pesada (~100 KB gzip) y sus
 * gráficos solo se ven al hacer scroll hasta ellos o al abrir la pestaña
 * correspondiente. Los dashboards importaban los charts de forma estática, así
 * que Recharts entraba en el bundle inicial de la ruta aunque el usuario nunca
 * llegara a ver un gráfico.
 *
 * `optimizePackageImports` (next.config.mjs) hace tree-shaking del paquete,
 * pero NO difiere su descarga: eso es lo que se resuelve acá con
 * `next/dynamic` + `ssr: false`.
 *
 * `ssr: false` es necesario además porque Recharts depende de
 * ResizeObserver/DOM, que no existen durante el render en servidor. Como
 * `ssr: false` no está permitido dentro de un Server Component, este archivo
 * es un Client Component que actúa de puente: los Server Components
 * (dashboard del trainer, progreso del cliente) importan desde acá.
 *
 * Mientras carga se muestra un skeleton con la altura reservada, para que no
 * haya salto de layout (CLS) cuando el gráfico aparece.
 */

import dynamic from "next/dynamic";

const ChartSkeleton = () => (
  <div
    className="h-64 w-full animate-pulse rounded-xl bg-zinc-900/60"
    role="status"
    aria-label="Cargando gráfico"
  />
);

export const AdherenceChart = dynamic(
  () => import("./analytics-charts").then((m) => m.AdherenceChart),
  { ssr: false, loading: ChartSkeleton }
);

export const RevenueChart = dynamic(
  () => import("./analytics-charts").then((m) => m.RevenueChart),
  { ssr: false, loading: ChartSkeleton }
);

export const CheckinDonut = dynamic(
  () => import("./analytics-charts").then((m) => m.CheckinDonut),
  { ssr: false, loading: ChartSkeleton }
);

export const LiftShiftAnalytics = dynamic(
  () => import("./liftshift-analytics").then((m) => m.LiftShiftAnalytics),
  { ssr: false, loading: ChartSkeleton }
);

export const AkiloTracker = dynamic(
  () => import("./akilo-tracker").then((m) => m.AkiloTracker),
  { ssr: false, loading: ChartSkeleton }
);

export const SleepTracker = dynamic(
  () => import("./sleep-tracker").then((m) => m.SleepTracker),
  { ssr: false, loading: ChartSkeleton }
);

export const RevenueAnalytics = dynamic(
  () => import("./revenue-analytics").then((m) => m.RevenueAnalytics),
  { ssr: false, loading: ChartSkeleton }
);
