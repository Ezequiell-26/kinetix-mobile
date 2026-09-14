"use client";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";

// Adaptado de jessedelira/gym-tracker — MIT
// https://github.com/jessedelira/gym-tracker/blob/main/src/components/searchableDropdown.tsx
export function SearchableDropdown({ options, value, onChange, placeholder="Buscar..." }:{
  options: string[];
  value: string;
  onChange: (v:string)=>void;
  placeholder?:string;
}){
  const [q,setQ]=useState("");
  const [open,setOpen]=useState(false);
  const filtered = useMemo(()=> options.filter(o=> o.toLowerCase().includes(q.toLowerCase())).slice(0,8), [q, options]);
  return (
    <div className="relative">
      <Input value={value} onChange={e=>{onChange(e.target.value); setQ(e.target.value); setOpen(true);}} onFocus={()=>setOpen(true)} placeholder={placeholder} />
      {open && q && (
        <div className="absolute z-10 w-full mt-1 bg-[#111111] border border-zinc-800 rounded-xl shadow-xl max-h-[160px] overflow-y-auto">
          {filtered.length===0 && <p className="text-xs text-zinc-500 p-3">Sin resultados</p>}
          {filtered.map(o=>(
            <button key={o} onClick={()=>{onChange(o); setQ(""); setOpen(false);}} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-900">{o}</button>
          ))}
        </div>
      )}
      {open && <div className="fixed inset-0 z-0" onClick={()=>setOpen(false)} />}
    </div>
  );
}
