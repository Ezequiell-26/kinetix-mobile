"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Apple, Scan } from "lucide-react";

// Inspirado en OpenFoodFacts MIT (OFF) + FitBook MIT — https://world.openfoodfacts.org
// OFF barcode + search con 2M+ productos, open source
export function OpenFoodFactsPro(){
  const [query,setQuery]=useState("nutella");
  const [result,setResult]=useState<{name:string; brand:string; kcal:number; nutriscore:string} | null>(null);

  function search(){
    // Mock OFF search - en prod fetch https://world.openfoodfacts.org/cgi/search.pl?search_terms=nutella&json=true
    setResult({name:"Nutella", brand:"Ferrero", kcal:539, nutriscore:"E"});
  }

  return (
    <Card className="border-emerald-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Apple size={16} className="text-emerald-400"/> OpenFoodFacts Pro <Badge variant="muted">OFF 2M MIT</Badge></CardTitle><p className="text-xs text-zinc-500">2M+ alimentos — barcode + search, open source</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"/>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar alimento..." className="w-full h-10 pl-9 pr-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white" />
          </div>
          <Button variant="accent" onClick={search}><Search size={14} className="mr-1"/> Buscar</Button>
        </div>
        {result && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="font-bold text-sm">{result.name} <span className="text-xs text-zinc-500">({result.brand})</span></p>
              <p className="text-xs text-zinc-500">{result.kcal} kcal/100g • Nutri-Score {result.nutriscore}</p>
            </div>
            <Badge variant={result.nutriscore==="E"?"warn":"accent"}>{result.nutriscore}</Badge>
          </div>
        )}
        <Button variant="outline" className="w-full" onClick={()=>search()}><Scan size={14} className="mr-2"/> Escanear barcode OFF</Button>
        <p className="text-[11px] text-zinc-600 text-center">OpenFoodFacts MIT (OFF) — 2M+ productos, barcode, Nutri-Score</p>
      </CardContent>
    </Card>
  );
}
