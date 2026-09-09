import * as React from "react";
import { cn } from "@/lib/utils";
export function Card({className,...p}:React.HTMLAttributes<HTMLDivElement>){ return <div className={cn("bg-[#111111] border border-zinc-800 rounded-[20px] overflow-hidden",className)} {...p} /> }
export function CardHeader({className,...p}:React.HTMLAttributes<HTMLDivElement>){ return <div className={cn("p-5 pb-3",className)} {...p} /> }
export function CardContent({className,...p}:React.HTMLAttributes<HTMLDivElement>){ return <div className={cn("p-5 pt-0",className)} {...p} /> }
export function CardTitle({className,...p}:React.HTMLAttributes<HTMLHeadingElement>){ return <h3 className={cn("font-display font-semibold text-white text-[15px]",className)} {...p} /> }
export function CardDesc({className,...p}:React.HTMLAttributes<HTMLParagraphElement>){ return <p className={cn("text-sm text-zinc-500",className)} {...p} /> }
