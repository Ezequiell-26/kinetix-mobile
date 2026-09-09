"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Adaptado de jessedelira/gym-tracker — MIT
// https://github.com/jessedelira/gym-tracker/blob/main/src/components/changelogNotification.tsx
export function ChangelogNotification(){
  const [show,setShow]=useState(false);
  const [hasSeen,setHasSeen]=useState(false);
  useEffect(()=>{
    const seen = localStorage.getItem("ec-changelog-seen");
    if(!seen) setShow(true);
    else setHasSeen(true);
  },[]);
  function dismiss(){
    localStorage.setItem("ec-changelog-seen","1.0.0");
    setShow(false);
    setHasSeen(true);
  }
  if(!show || hasSeen) return null;
  return (
    <Card className="border-[#D6FF2A]/20 bg-[#D6FF2A]/[0.06] mb-4">
      <CardContent className="pt-4 flex gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#D6FF2A] flex items-center justify-center font-black text-black shrink-0">!</div>
        <div className="flex-1">
          <p className="font-bold text-sm flex items-center gap-2">Novedades v1.0.0 <Badge variant="accent">Nuevo</Badge></p>
          <p className="text-xs text-zinc-400 mt-1">Fases, superseries, progresión inteligente y tema blanco/negro. Basado en patrones MIT de gym-tracker.</p>
          <div className="flex gap-2 mt-3">
            <Link href="/trainer/changelog"><Button variant="outline" size="sm" className="h-7 text-xs">Ver changelog</Button></Link>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={dismiss}>No mostrar más</Button>
          </div>
        </div>
        <button onClick={dismiss} className="text-zinc-500">✕</button>
      </CardContent>
    </Card>
  );
}
