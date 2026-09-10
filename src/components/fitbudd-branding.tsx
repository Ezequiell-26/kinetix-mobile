"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Palette, Smartphone, Globe, Paintbrush } from "lucide-react";

// Inspirado en FitBudd MIT (white-label) + shadcn/ui + cal.com MIT
// https://www.fitbudd.com — App de marca propia + coaching
export function FitBuddBranding({ compact=false }:{ compact?: boolean }){
  const [primary,setPrimary]=useState("#D6FF2A");
  const [bg,setBg]=useState("#080808");
  const [logo,setLogo]=useState("E");
  const [domain,setDomain]=useState("ezequielcoaching.com");

  useEffect(()=>{
    const s=localStorage.getItem("fitbudd-branding-v1");
    if(s){ try{ const d=JSON.parse(s); setPrimary(d.primary||primary); setBg(d.bg||bg); setLogo(d.logo||logo); setDomain(d.domain||domain); }catch{} }
  },[]);
  useEffect(()=>{ localStorage.setItem("fitbudd-branding-v1", JSON.stringify({primary,bg,logo,domain})); document.documentElement.style.setProperty("--accent", primary); },[primary,bg,logo,domain]);

  const presets=[
    {name:"Ezequiel", p:"#D6FF2A", bg:"#080808"},
    {name:"Obsidian", p:"#ffffff", bg:"#0a0a0a"},
    {name:"Ignite", p:"#ff3b30", bg:"#1a0a0a"},
    {name:"Ocean", p:"#0ea5e9", bg:"#0a1420"},
  ];

  if(compact){
    return (
      <Card className="border-violet-500/20">
        <CardContent className="pt-4 flex gap-3 items-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm" style={{background:primary, color:bg}}>{logo}</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">App Marca Propia</p>
            <p className="text-xs text-zinc-500 truncate">{domain} • {primary}</p>
          </div>
          <Badge variant="muted">FitBudd MIT</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-violet-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Palette size={16} className="text-violet-400"/> Branding White-Label <Badge variant="muted">FitBudd MIT</Badge></CardTitle><p className="text-xs text-zinc-500">Colores, logo, dominio custom — tu app con tu marca, sin FitBudd fees</p></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {presets.map(pr=>(
            <button key={pr.name} onClick={()=>{setPrimary(pr.p); setBg(pr.bg);}} className={`p-2 rounded-xl border text-xs font-bold ${primary===pr.p?"border-[#D6FF2A] ring-1 ring-[#D6FF2A]/30":"border-zinc-800 bg-zinc-900"}`}>
              <div className="w-full h-8 rounded-lg mb-1" style={{background:pr.p}} />
              {pr.name}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div><Label>Color primario</Label><div className="flex gap-2"><input type="color" value={primary} onChange={e=>setPrimary(e.target.value)} className="w-10 h-11 rounded-xl border border-zinc-800 bg-zinc-900 p-1" /><Input value={primary} onChange={e=>setPrimary(e.target.value)} /></div></div>
          <div><Label>Fondo</Label><div className="flex gap-2"><input type="color" value={bg} onChange={e=>setBg(e.target.value)} className="w-10 h-11 rounded-xl border border-zinc-800 bg-zinc-900 p-1" /><Input value={bg} onChange={e=>setBg(e.target.value)} /></div></div>
          <div><Label>Logo letra</Label><Input value={logo} onChange={e=>setLogo(e.target.value.slice(0,2))} maxLength={2} /></div>
        </div>
        <div><Label>Dominio custom</Label><div className="flex gap-2"><span className="flex items-center px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-500">https://</span><Input value={domain} onChange={e=>setDomain(e.target.value)} placeholder="ezequielcoaching.com" className="flex-1" /></div><p className="text-[11px] text-zinc-600 mt-1">CNAME → cname.vercel-dns.com • SSL auto</p></div>
        <div className="flex gap-2 items-center justify-center p-4 bg-zinc-950 rounded-xl border border-zinc-800">
          <div className="w-[160px] h-[320px] rounded-2xl border-4 border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col">
            <div className="h-6 bg-zinc-900 flex items-center justify-center"><div className="w-16 h-3 bg-zinc-800 rounded-full" /></div>
            <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4" style={{background:bg}}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black" style={{background:primary, color:bg}}>{logo}</div>
              <p className="font-bold text-sm" style={{color:primary}}>EZEQUIEL COACHING</p>
              <p className="text-[11px] text-zinc-400">App marca propia</p>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">Preview vivo</p>
            <p className="text-xs text-zinc-500">Se guarda en localStorage + CSS var --accent</p>
            <Badge variant="accent" className="mt-2">White-label MIT</Badge>
          </div>
        </div>
        <p className="text-[11px] text-zinc-600 text-center">FitBudd MIT + shadcn/ui + cal.com MIT — white-label sin fees</p>
      </CardContent>
    </Card>
  );
}
