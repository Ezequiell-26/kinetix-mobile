"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * visual-system.tsx — piezas de psicología de uso y retención.
 *
 * - SectionEyebrow: escaneo en F (etiqueta → título → acción).
 * - HeroCTA: un solo primario dominante + microcopy de prueba social (retención).
 * - EmptyStatePremium: estados vacíos cálidos con UNA acción (evita abandono).
 * - CoachTip: consejo breve del coach → autoridad + cercanía.
 */

export function SectionEyebrow({
  children,
  actionHref,
  actionLabel,
  className,
}: {
  children: React.ReactNode;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between px-1", className)}>
      <p className="section-eyebrow">{children}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="text-xs font-black text-primary hover:underline whitespace-nowrap min-h-[44px] inline-flex items-center"
        >
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}

export function HeroCTA({
  href,
  children,
  subcopy,
  className,
}: {
  href: string;
  children: React.ReactNode;
  subcopy?: string;
  className?: string;
}) {
  return (
    <div className={cn("cta-sticky", className)}>
      <Link
        href={href}
        className="flex items-center justify-center gap-2 w-full min-h-[56px] rounded-2xl bg-primary text-black text-base font-black tracking-wide shadow-[0_8px_40px_rgba(52,211,153,0.35)] active:scale-[0.97] transition-transform px-6"
      >
        {children}
        <ArrowRight size={20} aria-hidden="true" />
      </Link>
      {subcopy && <p className="text-center text-[11px] text-zinc-500 mt-2">{subcopy}</p>}
    </div>
  );
}

export function EmptyStatePremium({
  icon,
  title,
  copy,
  ctaHref,
  ctaLabel,
  secondaryHref,
  secondaryLabel,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
  ctaHref: string;
  ctaLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 sm:p-10 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
        {icon}
      </div>
      <p className="font-display font-black text-xl text-white text-balance">{title}</p>
      <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">{copy}</p>
      <div className="pt-2 space-y-2">
        <Link
          href={ctaHref}
          className="flex items-center justify-center gap-2 w-full min-h-[52px] rounded-2xl bg-primary text-black text-[15px] font-black shadow-[0_8px_32px_rgba(52,211,153,0.35)] active:scale-[0.97] transition-transform px-6"
        >
          {ctaLabel} →
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center min-h-[44px] text-xs font-bold text-zinc-400 hover:text-white px-4"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

export function CoachTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/[0.05] px-4 py-3.5">
      <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center font-black text-black text-sm shrink-0">
        E
      </div>
      <p className="text-[13px] text-zinc-300 leading-relaxed">{children}</p>
    </div>
  );
}
