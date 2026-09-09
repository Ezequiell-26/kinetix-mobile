import { cn } from "@/lib/utils";
export function Badge({variant="default",className,...p}:React.HTMLAttributes<HTMLSpanElement> & {variant?:"default"|"accent"|"success"|"warn"|"muted"}){
  const v={
    default:"bg-zinc-900 text-zinc-300 border-zinc-800",
    accent:"bg-[#D6FF2A] text-black border-[#D6FF2A]",
    success:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warn:"bg-amber-500/10 text-amber-400 border-amber-500/20",
    muted:"bg-zinc-800 text-zinc-400 border-zinc-700"
  };
  return <span className={cn("inline-flex items-center px-2.5 py-1 text-[11px] font-bold tracking-widest uppercase rounded-full border",v[variant],className)} {...p} />
}
