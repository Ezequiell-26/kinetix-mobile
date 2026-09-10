"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, Clock, Flame, Plus } from "lucide-react";

// Inspirado en Mealie MIT (recipe manager) + VitaFlex meal planner — https://github.com/mealie-recipes/mealie
// Gestor de recetas + plan semanal
export function MealieKitchen(){
  const [meals]=useState([
    {name:"Pollo al horno + boniato", kcal:520, time:"35′", protein:42},
    {name:"Overnight oats + frutos rojos", kcal:380, time:"5′", protein:18},
    {name:"Lentejas + ensalada", kcal:440, time:"25′", protein:22},
  ]);
  return (
    <Card className="border-orange-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><ChefHat size={16} className="text-orange-400"/> Mealie Kitchen <Badge variant="muted">Mealie MIT</Badge></CardTitle><p className="text-xs text-zinc-500">Recetas + plan semanal — Python + Vue, self-hosted</p></CardHeader>
      <CardContent className="space-y-3">
        {meals.map(m=>(
          <div key={m.name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="font-bold text-sm">{m.name}</p>
              <p className="text-xs text-zinc-500 flex gap-2"><span className="flex items-center gap-1"><Flame size={10}/>{m.kcal} kcal</span><span className="flex items-center gap-1"><Clock size={10}/>{m.time}</span><span>{m.protein}g P</span></p>
            </div>
            <Button size="sm" variant="outline" className="h-7 text-xs"><Plus size={12} className="mr-1"/> Plan</Button>
          </div>
        ))}
        <Button variant="accent" className="w-full"><ChefHat size={14} className="mr-2"/> Ver recetario completo</Button>
        <p className="text-[11px] text-zinc-600 text-center">Mealie MIT (Python+Vue) — recetas + plan + lista compras</p>
      </CardContent>
    </Card>
  );
}
