import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Sistema de botones EZEQUIEL COACHING — jerarquía por psicología.
 *
 * - 1 solo primario (accent) por viewport → efecto Von Restorff: lo distinto se recuerda y se toca.
 * - Ley de Fitts: el CTA principal mide 52–56px (xl/lg), zona pulgar en móvil.
 * - Todos ≥44px (Apple HIG + Windows touch + WCAG 2.5.8).
 * - Press physics active:scale-[0.97] = feedback háptico visual → +confianza +retención.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "accent";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
}

export function Button({ className, variant = "default", size = "md", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 " +
    "active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808] " +
    "min-h-[44px] whitespace-nowrap";
  const variants = {
    // Secundario: superficie oscura, no compite con el primario.
    default: "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 rounded-xl",
    // PRIMARIO — único por pantalla: acento + glow + sombra de elevación (importancia = elevación).
    accent:
      "bg-primary text-black font-bold hover:bg-primary-hover rounded-2xl " +
      "shadow-[0_8px_32px_rgba(52,211,153,0.35)] hover:shadow-[0_8px_40px_rgba(52,211,153,0.45)]",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl",
    outline:
      "border border-zinc-700 text-zinc-100 hover:bg-zinc-900 hover:border-zinc-600 rounded-xl bg-transparent",
  };
  const sizes = {
    sm: "h-11 px-4 text-[13px] tracking-wide",
    md: "h-12 px-6 text-sm tracking-wide",
    // Ley de Fitts: hero CTA grande = más rápido de alcanzar + más clics.
    lg: "h-[52px] px-8 text-[15px] font-bold tracking-wide",
    xl: "h-14 px-8 text-base font-black tracking-wide",
    icon: "h-11 w-11",
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
