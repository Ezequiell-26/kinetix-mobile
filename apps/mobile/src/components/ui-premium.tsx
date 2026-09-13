"use client";
/**
 * ui-premium.tsx — Microinteractions + Skeletons premium
 * Inspirado en patrones MIT de:
 * - shadcn/ui (MIT) https://github.com/shadcn-ui/ui — sistema de componentes accesibles, skeletons, card, badge, skeleton + animate-pulse
 * - radix-ui/primitives (MIT) https://github.com/radix-ui/primitives — primitivas accesibles sin estilo (tooltip, dialog, tabs primitives)
 * Licencias MIT respetadas. Código original adaptado, no copia literal.
 * Atribución completa en docs/MIT_ATTRIBUTION.md #70
 */
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ---------- SKELETONS PREMIUM (shadcn/ui MIT) ----------
export function PremiumSkeleton({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-zinc-900 relative overflow-hidden",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.06] before:to-transparent",
        className
      )}
      {...p}
    />
  );
}

export function SkeletonCard() {
  return (
    <Card className="border-zinc-800 bg-zinc-900/80">
      <CardContent className="p-4 space-y-3">
        <PremiumSkeleton className="h-3 w-24" />
        <PremiumSkeleton className="h-7 w-20" />
        <PremiumSkeleton className="h-2 w-32" />
      </CardContent>
    </Card>
  );
}

export function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
          <PremiumSkeleton className="h-10 w-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <PremiumSkeleton className="h-3 w-32" />
            <PremiumSkeleton className="h-2 w-48" />
          </div>
          <PremiumSkeleton className="h-5 w-12 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <SkeletonList rows={3} />
    </div>
  );
}

// Shimmer wrapper (shadcn skeleton + radix tooltip idea)
export function Shimmer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("relative overflow-hidden rounded-xl", className)}>{children}</div>;
}

// ---------- MICROINTERACTIONS (framer-motion + radix primitives MIT) ----------
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.06,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Pressable card with scale + shadow microinteraction (radix-like focus + hover)
export function PressableCard({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      onClick={onClick}
      className={cn(
        "rounded-[20px] border border-zinc-800 bg-[#111111] overflow-hidden cursor-pointer",
        "shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] hover:border-zinc-700 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function HoverLift({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

export function PulseDot({ color = "bg-emerald-500" }: { color?: string }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", color)} />
      <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", color)} />
    </span>
  );
}

export function AnimatedBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success";
}) {
  const bg =
    variant === "accent"
      ? "bg-primary text-black border-primary"
      : variant === "success"
      ? "bg-emerald-500 text-black border-emerald-500"
      : "bg-zinc-900 text-zinc-400 border-zinc-800";
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border", bg)}
    >
      {children}
    </motion.span>
  );
}

// Quick peek strip para dashboards — muestra que ui-premium está integrado sin romper tabs
export function UiPremiumStrip() {
  // Créditos técnicos removidos de la UI a pedido del producto.
  // La atribución de licencias vive en docs/MIT_ATTRIBUTION.md.
  return null;
}

// Shimmer button (shadcn + radix inspired)
export function ShimmerButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl bg-primary text-black font-bold text-sm px-4 py-2.5 overflow-hidden",
        "before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-0 before:transition-transform before:duration-700 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
        className
      )}
      {...(props as unknown as React.ComponentProps<typeof motion.button>)}
    >
      <span className="relative">{children}</span>
    </motion.button>
  );
}
