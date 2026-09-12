"use client";
import { Camera } from "lucide-react";
import { useState, useRef } from "react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Inspirado en FitBook (MIT) — barcode con Open Food Facts (OFF)
export function BarcodeScanner({ onFood }:{onFood:(food:{name:string; calories:number; protein:number; carbs:number; fat:number})=>void}){
  const [code,setCode]=useState("");
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState<{name:string; calories:number; protein:number; carbs:number; fat:number} | null>(null);
  const [error,setError]=useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function lookup(c:string){
    if(!c) return;
    setLoading(true); setError("");
    try{
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${c}.json`);
      const data = await res.json();
      if(data.status===1 && data.product){
        const p = data.product;
        const name = p.product_name || p.generic_name || "Producto";
        const nutriments = p.nutriments || {};
        const food = {
          name,
          calories: Math.round(nutriments["energy-kcal_100g"] || nutriments.energy_100g ? nutriments["energy-kcal_100g"] || nutriments.energy_100g/4.184 : 0),
          protein: Math.round((nutriments.proteins_100g || 0) * 10)/10,
          carbs: Math.round((nutriments.carbohydrates_100g || 0) * 10)/10,
          fat: Math.round((nutriments.fat_100g || 0) * 10)/10,
        };
        setResult(food);
        onFood(food);
      } else {
        setError("No encontrado en OFF. Probá otro código.");
      }
    }catch{
      setError("Error al consultar OFF");
    }
    setLoading(false);
  }

  return (
    <Card className="border-zinc-800">
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center gap-2"><p className="font-bold text-sm">Escanear código</p></div>
        <div className="flex gap-2">
          <Input value={code} onChange={e=>setCode(e.target.value)} placeholder="Código de barras (ej: 3017620422003)" className="flex-1" />
          <Button variant="accent" onClick={()=>lookup(code)} disabled={loading || !code}>{loading?"...":"Buscar"}</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={()=>fileRef.current?.click()}><Camera size={13} className="inline mr-1 -mt-0.5" />Escanear con cámara (próximamente)</Button>
          <Button variant="outline" size="sm" onClick={()=>lookup("3017620422003")}>Demo Nutella</Button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) lookup("3017620422003"); }} />
        {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-2">{error}</p>}
        {result && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            <p className="font-bold text-sm">{result.name}</p>
            <p className="text-xs text-zinc-400">100g • {result.calories} kcal • P {result.protein}g • C {result.carbs}g • G {result.fat}g</p>
            <p className="text-xs text-emerald-400 mt-1">Autocompletado en tu calculadora</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
