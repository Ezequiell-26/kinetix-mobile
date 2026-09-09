import * as React from "react";
import { cn } from "@/lib/utils";
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  variant?: "default"|"ghost"|"outline"|"accent";
  size?: "sm"|"md"|"lg"|"icon";
}
export function Button({className,variant="default",size="md",...props}:ButtonProps){
  const base = "inline-flex items-center justify-center font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  const variants={
    default:"bg-white text-black hover:bg-zinc-100 rounded-xl",
    accent:"bg-[#D6FF2A] text-black hover:bg-[#E0FF5A] rounded-xl shadow-[0_0_20px_rgba(214,255,42,0.15)]",
    ghost:"bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl",
    outline:"border border-zinc-800 text-white hover:bg-zinc-900 rounded-xl"
  };
  const sizes={ sm:"h-9 px-4 text-sm", md:"h-11 px-6 text-[13px] tracking-wide", lg:"h-[52px] px-8 text-sm", icon:"h-10 w-10" };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
