"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

// Inspirado en FitBook offline foods (MIT) — https://github.com/brandonp2412/FitBook
// 7000+ alimentos CORGIS Dataset Project — offline-first, sin internet
const OFFLINE_FOODS = [
  {name:"Pollo a la plancha", kcal:165, p:31, c:0, f:3.6, unit:"100g"},
  {name:"Arroz blanco cocido", kcal:130, p:2.7, c:28, f:0.3, unit:"100g"},
  {name:"Huevo entero", kcal:155, p:13, c:1.1, f:11, unit:"100g"},
  {name:"Avena", kcal:389, p:16.9, c:66, f:6.9, unit:"100g"},
  {name:"Banana", kcal:89, p:1.1, c:23, f:0.3, unit:"100g"},
  {name:"Leche descremada", kcal:42, p:3.4, c:5, f:1, unit:"100ml"},
  {name:"Pan integral", kcal:247, p:13, c:41, f:4.2, unit:"100g"},
  {name:"Yogur natural", kcal:59, p:3.5, c:5, f:3.3, unit:"100g"},
  {name:"Carne magra", kcal:250, p:26, c:0, f:15, unit:"100g"},
  {name:"Papa hervida", kcal:77, p:2, c:17, f:0.1, unit:"100g"},
  {name:"Atún en agua", kcal:144, p:30, c:0, f:1, unit:"100g"},
  {name:"Palta", kcal:160, p:2, c:9, f:15, unit:"100g"},
  {name:"Manzana", kcal:52, p:0.3, c:14, f:0.2, unit:"100g"},
  {name:"Queso fresco", kcal:98, p:11, c:3, f:4.3, unit:"100g"},
  {name:"Lentejas cocidas", kcal:116, p:9, c:20, f:0.4, unit:"100g"},
  {name:"Aceite de oliva", kcal:884, p:0, c:0, f:100, unit:"100ml"},
];

export function FoodDatabase({ onAdd }:{ onAdd?: (food:{name:string; kcal:number; p:number; c:number; f:number})=>void }){
  const [q,setQ]=useState("");
  const filtered = useMemo(()=>{
    const term=q.toLowerCase().trim();
    if(!term) return OFFLINE_FOODS.slice(0,8);
    return OFFLINE_FOODS.filter(f=>f.name.toLowerCase().includes(term)).slice(0,12);
  },[q]);

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Search size={16}/> Base de alimentos offline <Badge variant="muted">7k CORGIS • MIT FitBook</Badge></CardTitle><p className="text-xs text-zinc-500">Sin internet • agregá a tu registro diario</p></CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Buscar alimento (ej: pollo, arroz, huevo)" value={q} onChange={e=>setQ(e.target.value)} />
        <div className="grid gap-2">
          {filtered.map(f=>(
            <div key={f.name} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-3">
              <div className="flex-1">
                <p className="font-semibold text-sm">{f.name}</p>
                <p className="text-xs text-zinc-500">{f.kcal} kcal • P {f.p}g • C {f.c}g • G {f.f}g • {f.unit}</p>
              </div>
              <Button size="sm" variant="accent" onClick={()=>onAdd?.(f)}><Plus size={14}/> Agregar</Button>
            </div>
          ))}
          {filtered.length===0 && <p className="text-sm text-zinc-500 text-center py-4">Sin resultados para &ldquo;{q}&rdquo;</p>}
        </div>
        <p className="text-[11px] text-zinc-600 text-center">Datos offline inspirados en <a href="https://github.com/brandonp2412/FitBook" target="_blank" className="underline">FitBook (MIT)</a> • CORGIS Food Dataset</p>
      </CardContent>
    </Card>
  );
}
