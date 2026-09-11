import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card system — radio 20px consistente, borde sutil, jerarquía por elevación.
 * En móvil: padding 16px (p-4). En desktop: 20px (sm:p-5).
 */
export function Card({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-[#111111] border border-zinc-800/80 rounded-[20px] overflow-hidden",
        "shadow-[0_8px_32px_rgba(0,0,0,0.18)]",
        className
      )}
      {...p}
    />
  );
}
export function CardHeader({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 sm:p-5 pb-3", className)} {...p} />;
}
export function CardContent({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 sm:p-5 pt-0", className)} {...p} />;
}
export function CardTitle({ className, ...p }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display font-semibold text-white text-[15px] text-balance", className)}
      {...p}
    />
  );
}
export function CardDesc({ className, ...p }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-zinc-500 leading-relaxed", className)} {...p} />;
}
