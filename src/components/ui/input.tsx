import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Inputs 48px + 16px en móvil.
 * iOS Safari hace auto-zoom si el input mide <16px → fijamos 16px en móvil
 * y 14px desde sm. Esto evita el zoom que rompe el layout en iPhone.
 */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...p }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full h-12 px-4 bg-zinc-900 border border-zinc-800 rounded-xl",
          "text-[16px] sm:text-sm text-white placeholder:text-zinc-500",
          "focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition",
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
        "w-full min-h-[96px] p-4 bg-zinc-900 border border-zinc-800 rounded-xl",
        "text-[16px] sm:text-sm text-white placeholder:text-zinc-500",
        "focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition",
        className
      )}
      {...p}
    />
  );
}
export function Label({ className, ...p }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-[11px] font-bold tracking-[0.14em] uppercase text-zinc-400", className)}
      {...p}
    />
  );
}
