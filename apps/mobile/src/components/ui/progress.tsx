import { cn } from "@/lib/utils";

/**
 * Barra de progreso accesible: expone el valor a lectores de pantalla
 * (WCAG 4.1.2) y clampea 0–100. `label` opcional describe qué mide.
 */
export function Progress({
  value,
  className,
  label,
}: {
  value: number;
  className?: string;
  label?: string;
}) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-2 bg-zinc-900 rounded-full overflow-hidden", className)}
    >
      <div className="h-full bg-primary transition-all duration-700" style={{ width: `${v}%` }} />
    </div>
  );
}
