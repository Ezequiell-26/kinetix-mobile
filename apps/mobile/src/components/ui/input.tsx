import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Input system — 48px height + 16px font en móvil para evitar auto-zoom en iOS Safari.
 * Theme-aware: adapta fondos, bordes y colores al modo claro/oscuro.
 * Focus state con ring sutil del color primario para feedback visual claro.
 */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...p }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full h-12 px-4 rounded-xl",
          "bg-zinc-950/50 border border-zinc-800",
          "text-[16px] sm:text-sm text-white placeholder:text-zinc-500",
          "focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 focus:bg-zinc-950",
          "transition-all duration-200",
          "min-h-[48px]",
          className
        )}
        {...p}
      />
    );
  }
);

export function Textarea({
  className,
  ...p
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full min-h-[96px] p-4 rounded-xl",
        "bg-zinc-950/50 border border-zinc-800",
        "text-[16px] sm:text-sm text-white placeholder:text-zinc-500",
        "focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 focus:bg-zinc-950",
        "transition-all duration-200",
        className
      )}
      {...p}
    />
  );
}

export function Label({ className, ...p }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-[11px] font-bold tracking-[0.14em] uppercase text-zinc-400",
        className
      )}
      {...p}
    />
  );
}
