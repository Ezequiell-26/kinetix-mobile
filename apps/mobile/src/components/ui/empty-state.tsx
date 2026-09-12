import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/**
 * EmptyState — estados vacíos con acción, nunca un callejón sin salida.
 *
 * Psicología: un vacío sin CTA = abandono. Cada estado vacío ofrece
 * el "próximo paso obvio" (acción única) para mantener al atleta en flujo.
 * Estética: icono en halo suave, título claro, descripción breve, 1 CTA.
 * Theme-aware: se adapta al modo claro/oscuro usando clases semánticas.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-10 px-6 gap-3",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <Icon size={24} strokeWidth={2} />
      </div>
      <div className="space-y-1 max-w-[42ch]">
        <p className="font-display font-semibold text-white text-[15px] text-balance">{title}</p>
        {description && (
          <p className="text-[13px] text-zinc-500 leading-relaxed text-pretty">{description}</p>
        )}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}
