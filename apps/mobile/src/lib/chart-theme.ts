import type { CSSProperties } from "react";

/**
 * Tema de gráficos compartido (Recharts) — theme-aware vía CSS vars.
 *
 * Antes cada chart hardcodeaba `#111` / `#27272A` / `#71717a`, así que en modo
 * claro los tooltips y grillas quedaban oscuros sobre fondo blanco. Al usar las
 * variables de tema, oscuro y claro se resuelven solos.
 */
export const CHART_ACCENT = "rgb(var(--primary))";
export const CHART_GRID = "rgb(var(--subtle))";
export const CHART_AXIS = "#71717a";

/** Estilo de tooltip premium, consistente en toda la app y por tema. */
export const chartTooltipStyle: CSSProperties = {
  background: "rgb(var(--surface-elevated))",
  border: "1px solid rgb(var(--subtle))",
  borderRadius: 12,
  color: "hsl(var(--foreground))",
  fontSize: 12,
  padding: "8px 10px",
  boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
};

/** Estilo de ítem dentro del tooltip (texto legible por tema). */
export const chartTooltipItemStyle: CSSProperties = {
  color: "hsl(var(--foreground))",
};

/** Tick de eje por defecto. */
export const chartAxisTick = { fill: CHART_AXIS, fontSize: 11 } as const;
