import * as React from "react";
import { cn } from "@/lib/utils";
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input({className,...p}, ref){
  return <input ref={ref} className={cn("w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-[#D6FF2A]/10 transition",className)} {...p} />
});
export function Textarea({className,...p}:React.TextareaHTMLAttributes<HTMLTextAreaElement>){
  return <textarea className={cn("w-full min-h-[96px] p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-[#D6FF2A]/10 transition",className)} {...p} />
}
export function Label({className,...p}:React.LabelHTMLAttributes<HTMLLabelElement>){ return <label className={cn("text-xs font-semibold tracking-widest uppercase text-zinc-400",className)} {...p} /> }
