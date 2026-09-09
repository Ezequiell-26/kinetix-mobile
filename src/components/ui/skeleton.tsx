import { cn } from "@/lib/utils";
export function Skeleton({className,...p}:React.HTMLAttributes<HTMLDivElement>){ return <div className={cn("animate-pulse bg-zinc-900 rounded-xl",className)} {...p} /> }
