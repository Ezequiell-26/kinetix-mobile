import { cn } from "@/lib/utils";

/**
 * Badge system — estados semánticos con el acento KinetixFitt como identidad.
 */
export function Badge({
  variant = "default",
  className,
  ...p
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "accent" | "success" | "warn" | "danger" | "muted";
}) {
  const v = {
    default: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
    accent: "bg-[#C6F91E]/10 text-[#C6F91E] border-[#C6F91E]/25",
    success: "bg-[#C6F91E]/10 text-[#C6F91E] border-[#C6F91E]/20",
    warn: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    danger: "bg-red-500/10 text-red-300 border-red-500/20",
    muted: "bg-zinc-800/60 text-zinc-500 border-zinc-700/50",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[11px] font-bold tracking-widest uppercase rounded-full border",
        v[variant],
        className
      )}
      {...p}
    />
  );
}
