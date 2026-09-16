"use client";
export function ChartSkeleton({ height = 160 }: { height?: number }) {
  return (
    <div
      className="rounded-xl bg-zinc-900 border border-zinc-800 animate-pulse flex items-center justify-center"
      style={{ height }}
      role="status"
      aria-label="Cargando gráfico"
    >
      <span className="text-[11px] text-zinc-600">Cargando gráfico…</span>
    </div>
  );
}
export function CardSkeleton() {
  return <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 h-[120px] animate-pulse" />;
}
