"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Tabs({ tabs, defaultId, children }:{ tabs: Array<{id:string; label:string; badge?:string}>; defaultId?: string; children: (activeId:string)=>React.ReactNode }){
  const [active,setActive]=useState(defaultId || tabs[0]?.id);
  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" style={{ WebkitOverflowScrolling: "touch" }}>
        {tabs.map(t=>(
          <button
            key={t.id}
            onClick={()=>setActive(t.id)}
            className={cn(
              "shrink-0 px-3.5 py-2 rounded-full text-xs font-bold border whitespace-nowrap transition",
              active===t.id ? "bg-[#D6FF2A] text-black border-[#D6FF2A]" : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
            )}
          >
            {t.label} {t.badge && <span className="ml-1 text-[10px] bg-violet-500 text-white px-1.5 py-0.5 rounded-full">{t.badge}</span>}
          </button>
        ))}
      </div>
      <div>{children(active)}</div>
    </div>
  );
}
