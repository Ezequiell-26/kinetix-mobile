"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

export function VersionBadge(){
  const [info,setInfo]=useState<{hash:string; branch:string; date:string} | null>(null);
  useEffect(()=>{
    fetch("/api/version").then(r=>r.json()).then(setInfo).catch(()=>{});
  },[]);
  if(!info) return <Badge variant="muted">v1.0.0</Badge>;
  return (
    <div className="flex items-center gap-2 text-xs">
      <Badge variant="muted">v1.0.0</Badge>
      <span className="text-zinc-500 font-mono">{info.hash.slice(0,7)}</span>
      <span className="text-zinc-600">{info.branch}</span>
      <span className="text-zinc-500">{new Date(info.date).toLocaleDateString("es-AR")}</span>
    </div>
  );
}
