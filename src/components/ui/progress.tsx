import { cn } from "@/lib/utils";
export function Progress({value,className}:{value:number;className?:string}){
  return <div className={cn("h-2 bg-zinc-900 rounded-full overflow-hidden",className)}><div className="h-full bg-[#D6FF2A] transition-all duration-700" style={{width:`${Math.min(100,Math.max(0,value))}%`}} /></div>
}
