"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
const commands = [
  {label:"Ir a Dashboard", href:"/trainer/dashboard", kbd:"D"},
  {label:"Clientes", href:"/trainer/clients", kbd:"C"},
  {label:"Crear cliente", href:"/trainer/clients/new", kbd:"N"},
  {label:"Entrenamientos", href:"/trainer/workouts", kbd:"E"},
  {label:"Check-ins", href:"/trainer/checkins", kbd:"K"},
  {label:"Mensajes", href:"/trainer/messages", kbd:"M"},
  {label:"Pagos", href:"/trainer/payments", kbd:"P"},
];

export function CommandPalette(){
  const [open,setOpen]=useState(false);
  const [q,setQ]=useState("");
  const r=useRouter();
  useEffect(()=>{
    const h = (e:KeyboardEvent)=>{
      if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==="k"){ e.preventDefault(); setOpen(!open); }
      if(e.key==="/") { e.preventDefault(); setOpen(true); }
      if(e.key==="Escape") setOpen(false);
    };
    window.addEventListener("keydown", h);
    return ()=>window.removeEventListener("keydown", h);
  },[open]);
  const filtered = commands.filter(c=> c.label.toLowerCase().includes(q.toLowerCase()));
  if(!open) return (
    <button onClick={()=>setOpen(true)} className="hidden lg:flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 hover:border-zinc-700">
      <Search size={14} /> Buscar... <span className="ml-2 text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded">⌘K</span>
    </button>
  );
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur" onClick={()=>setOpen(false)} />
      <div className="relative w-full max-w-[480px] mx-4 bg-[#111111] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
          <Search size={18} className="text-zinc-500" />
          <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar clientes, rutinas, check-ins..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-zinc-600" />
          <span className="text-xs text-zinc-600">ESC</span>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {filtered.length===0 && <p className="text-sm text-zinc-500 p-4 text-center">Sin resultados</p>}
          {filtered.map(c=>(
            <button key={c.href} onClick={()=>{r.push(c.href); setOpen(false);}} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-zinc-900 flex justify-between items-center">
              <span className="text-sm">{c.label}</span><span className="text-xs bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg">{c.kbd}</span>
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-zinc-800 text-xs text-zinc-600 text-center">↵ para seleccionar • / para abrir • ⌘K para cerrar</div>
      </div>
    </div>
  );
}
