"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Apple, Scan, Loader2, AlertCircle } from "lucide-react";

type Food = { name: string; brand: string; kcal: number | null; nutriscore: string | null; barcode?: string };

function normalizeProduct(product: Record<string, any>, barcode?: string): Food | null {
  const name = String(product.product_name || product.product_name_en || "").trim();
  if (!name) return null;
  const kcal = Number(product.nutriments?.["energy-kcal_100g"] ?? product.nutriments?.energy_kcal_100g);
  const grade = String(product.nutriscore_grade || "").toUpperCase();
  return { name, brand: String(product.brands || "Sin marca").split(",")[0].trim() || "Sin marca", kcal: Number.isFinite(kcal) ? Math.round(kcal) : null, nutriscore: grade || null, barcode };
}

export function OpenFoodFactsPro(){
  const [query,setQuery]=useState("");
  const [result,setResult]=useState<Food | null>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);

  async function search(value = query){
    const q = value.trim();
    if (!q) { setError("Escribí un alimento o código de barras."); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const isBarcode = /^\d{8,14}$/.test(q);
      const url = isBarcode
        ? `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(q)}.json?fields=product_name,product_name_en,brands,nutriments,nutriscore_grade`
        : `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(q)}&page_size=1&fields=product_name,product_name_en,brands,nutriments,nutriscore_grade,code`;
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      const data = await response.json();
      if (!response.ok) throw new Error("OpenFoodFacts no respondió correctamente.");
      const product = isBarcode ? data.product : data.products?.[0];
      const food = normalizeProduct(product || {}, isBarcode ? q : product?.code);
      if (!food) throw new Error("No encontré un alimento con esos datos.");
      setResult(food);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo consultar OpenFoodFacts.");
    } finally { setLoading(false); }
  }

  return (
    <Card className="border-primary/20 bg-[#0B151E]">
      <CardHeader><CardTitle className="flex items-center gap-2"><Apple size={16} className="text-primary"/> OpenFoodFacts <Badge variant="success">Datos externos</Badge></CardTitle><p className="text-xs text-[#8193A5]">Buscá productos o pegá un código de barras para consultar datos nutricionales publicados por OpenFoodFacts.</p></CardHeader>
      <CardContent className="space-y-3">
        <form onSubmit={(e)=>{e.preventDefault();void search();}} className="flex gap-2"><div className="relative flex-1"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Alimento o código de barras..." className="h-10 w-full rounded-xl border border-[#1C3142] bg-[#081119] pl-9 pr-3 text-sm text-white outline-none focus:border-primary/40" /></div><Button type="submit" variant="accent" disabled={loading}>{loading?<Loader2 size={14} className="animate-spin"/>:<><Search size={14} className="mr-1"/> Buscar</>}</Button></form>
        {error&&<div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-200"><AlertCircle size={14} className="mt-0.5"/>{error}</div>}
        {result&&<div className="rounded-xl border border-[#1C3142] bg-[#081119] p-3"><div className="flex items-start justify-between gap-4"><div><p className="font-bold text-sm text-white">{result.name} <span className="text-xs font-normal text-[#8193A5]">({result.brand})</span></p><p className="mt-1 text-xs text-[#8193A5]">{result.kcal===null?"Kcal no disponible":`${result.kcal} kcal/100g`}{result.barcode?` · ${result.barcode}`:""}</p></div>{result.nutriscore&&<Badge variant={/[DE]/.test(result.nutriscore)?"warn":"accent"}>Nutri-Score {result.nutriscore}</Badge>}</div></div>}
        <Button variant="outline" className="w-full" onClick={()=>void search()} disabled={loading || !query.trim()}><Scan size={14} className="mr-2"/> Consultar código / producto</Button>
      </CardContent>
    </Card>
  );
}
