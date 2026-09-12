"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { copyText, downloadFile } from "@/lib/clipboard";

export function CalorieCalculator(){
  const [copied,setCopied]=useState(false);
  const [copyFail,setCopyFail]=useState(false);
  const [sex,setSex]=useState<"M"|"F">("M");
  const [age,setAge]=useState(28);
  const [weight,setWeight]=useState(86.8);
  const [height,setHeight]=useState(178);
  const [activity,setActivity]=useState(1.55); // moderado
  const [goal,setGoal]=useState<"cut"|"maintain"|"bulk">("cut");

  const result = useMemo(()=>{
    // Mifflin-St Jeor
    const bmr = sex==="M" ? 10*weight + 6.25*height - 5*age + 5 : 10*weight + 6.25*height - 5*age - 161;
    const tdee = Math.round(bmr * activity);
    let target = tdee;
    if(goal==="cut") target = Math.round(tdee * 0.8); // -20%
    if(goal==="bulk") target = Math.round(tdee * 1.15); // +15%
    const protein = Math.round(weight * 2.0); // 2g/kg
    const fat = Math.round(weight * 0.85);
    const protKcal = protein*4;
    const fatKcal = fat*9;
    const carbs = Math.round((target - protKcal - fatKcal)/4);
    const water = Math.round(weight * 35); // ml
    const bmi = (weight / ((height/100)**2)).toFixed(1);
    return {bmr: Math.round(bmr), tdee, target, protein, fat, carbs, water, bmi};
  },[sex,age,weight,height,activity,goal]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2">Calculadora VIP <Badge variant="accent">Premium</Badge></CardTitle><p className="text-xs text-zinc-500">TDEE • Macros • Agua • IMC — todo para tu objetivo</p></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Sexo</Label><div className="flex gap-2"><button onClick={()=>setSex("M")} className={`flex-1 py-2.5 rounded-xl border font-semibold text-sm ${sex==="M"?"bg-white text-black border-white":"bg-zinc-900 border-zinc-800 text-zinc-400"}`}>Hombre</button><button onClick={()=>setSex("F")} className={`flex-1 py-2.5 rounded-xl border font-semibold text-sm ${sex==="F"?"bg-white text-black border-white":"bg-zinc-900 border-zinc-800 text-zinc-400"}`}>Mujer</button></div></div>
          <div className="space-y-2"><Label>Objetivo</Label><select value={goal} onChange={e=>setGoal(e.target.value as "cut"|"maintain"|"bulk")} className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white"><option value="cut">Perder grasa (-20%)</option><option value="maintain">Mantener</option><option value="bulk">Ganar músculo (+15%)</option></select></div>
          <div className="space-y-2"><Label>Edad</Label><Input type="number" value={age} onChange={e=>setAge(Number(e.target.value))} /></div>
          <div className="space-y-2"><Label>Peso (kg)</Label><Input type="number" step="0.1" value={weight} onChange={e=>setWeight(Number(e.target.value))} /></div>
          <div className="space-y-2"><Label>Altura (cm)</Label><Input type="number" value={height} onChange={e=>setHeight(Number(e.target.value))} /></div>
          <div className="space-y-2"><Label>Actividad</Label><select value={activity} onChange={e=>setActivity(Number(e.target.value))} className="w-full h-11 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white"><option value={1.2}>Sedentario</option><option value={1.375}>Ligero (1-3d/sem)</option><option value={1.55}>Moderado (3-5d)</option><option value={1.725}>Activo (6-7d)</option><option value={1.9}>Muy activo</option></select></div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-3 gap-3">
        <Card className="border-primary/20 bg-primary/[0.06]"><CardContent className="pt-4 text-center"><p className="text-xs text-zinc-500 uppercase tracking-widest">TMB</p><p className="text-2xl font-black">{result.bmr.toLocaleString("es-AR")}</p><p className="text-xs text-zinc-500">kcal/día</p></CardContent></Card>
        <Card className="border-primary/20 bg-primary/[0.06]"><CardContent className="pt-4 text-center"><p className="text-xs text-zinc-500 uppercase tracking-widest">TDEE</p><p className="text-2xl font-black">{result.tdee.toLocaleString("es-AR")}</p><p className="text-xs text-zinc-500">mantener</p></CardContent></Card>
        <Card className="bg-[#111111] border-zinc-800"><CardContent className="pt-4 text-center"><p className="text-xs text-zinc-500 uppercase tracking-widest">Objetivo</p><p className="text-2xl font-black text-primary">{result.target.toLocaleString("es-AR")}</p><p className="text-xs text-zinc-500">kcal/día</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Macros diarios</CardTitle><p className="text-xs text-zinc-500">Basado en {weight}kg • proteína 2g/kg, grasa 0.85g/kg</p></CardHeader>
        <CardContent className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center"><p className="text-xs text-zinc-500">Proteína</p><p className="text-xl font-black">{result.protein}g</p><p className="text-xs text-zinc-500">{result.protein*4} kcal</p><div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-primary" style={{width:"35%"}} /></div></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center"><p className="text-xs text-zinc-500">Carbos</p><p className="text-xl font-black">{result.carbs}g</p><p className="text-xs text-zinc-500">{result.carbs*4} kcal</p><div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-white" style={{width:"45%"}} /></div></div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center"><p className="text-xs text-zinc-500">Grasas</p><p className="text-xl font-black">{result.fat}g</p><p className="text-xs text-zinc-500">{result.fat*9} kcal</p><div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-zinc-500" style={{width:"20%"}} /></div></div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-3 gap-3">
        <Card><CardContent className="pt-4 text-center"><p className="text-xs text-zinc-500">Agua</p><p className="text-lg font-black">{(result.water/1000).toFixed(1)} L</p><p className="text-xs text-zinc-500">{result.water} ml/día</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-xs text-zinc-500">IMC</p><p className="text-lg font-black">{result.bmi}</p><p className="text-xs text-emerald-400">Saludable</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-xs text-zinc-500">Déficit</p><p className="text-lg font-black">{result.tdee - result.target} kcal</p><p className="text-xs text-zinc-500">para {goal==="cut"?"bajar":"subir"}</p></CardContent></Card>
      </div>

      <Card className="border-zinc-800">
        <CardContent className="pt-4 flex flex-wrap gap-2">
          <Button
            variant="accent"
            className="flex-1 min-h-[44px]"
            onClick={async ()=>{
              const ok = await copyText(`Objetivo ${result.target} kcal — P:${result.protein} C:${result.carbs} G:${result.fat}`);
              setCopied(ok);
              setCopyFail(!ok);
              if(ok) setTimeout(()=>setCopied(false),2000);
            }}
          >
            {copied ? "Copiado ✓" : "Copiar macros"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 min-h-[44px]"
            onClick={()=>{
              const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Mis macros — KinetiX</title><style>body{font-family:Arial,sans-serif;max-width:560px;margin:32px auto;padding:0 16px;color:#111}h1{font-size:22px}table{width:100%;border-collapse:collapse;margin:16px 0}td{padding:8px;border-bottom:1px solid #ddd;font-size:15px}td:last-child{text-align:right;font-weight:bold}@media print{button{display:none}}</style></head><body><h1>Mis macros — KinetiX</h1><table><tr><td>Objetivo</td><td>${result.target} kcal/día</td></tr><tr><td>TMB / TDEE</td><td>${result.bmr} / ${result.tdee} kcal</td></tr><tr><td>Proteína</td><td>${result.protein}g (${result.protein*4} kcal)</td></tr><tr><td>Carbos</td><td>${result.carbs}g (${result.carbs*4} kcal)</td></tr><tr><td>Grasas</td><td>${result.fat}g (${result.fat*9} kcal)</td></tr><tr><td>Agua</td><td>${result.water} ml/día</td></tr><tr><td>IMC</td><td>${result.bmi}</td></tr></table><p>Consulta con Ezequiel para el ajuste fino.</p><button onclick="window.print()">Imprimir / Guardar PDF</button></body></html>`;
              downloadFile("mis-macros.html", html, "text/html");
            }}
          >
            Exportar PDF
          </Button>
          {copyFail && (
            <p className="w-full text-xs text-zinc-300 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 select-all">
              Tu navegador bloqueó el copiado. Mantené presionado para copiar: Objetivo {result.target} kcal — P:{result.protein} C:{result.carbs} G:{result.fat}
            </p>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-zinc-500 text-center">Fórmula Mifflin-St Jeor • VIP — consulta con Ezequiel para ajuste fino. No reemplaza asesoría médica.</p>
    </div>
  );
}

export function OneRMCalculator(){
  const [weight,setWeight]=useState(80);
  const [reps,setReps]=useState(8);
  const epley = Math.round(weight * (1 + reps/30));
  const brzycki = Math.round(weight * 36/(37-reps));
  return (
    <Card>
      <CardHeader><CardTitle>Calculadora 1RM</CardTitle><p className="text-xs text-zinc-500">Epley & Brzycki</p></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Peso (kg)</Label><Input type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))} /></div>
          <div className="space-y-2"><Label>Reps</Label><Input type="number" value={reps} onChange={e=>setReps(Number(e.target.value))} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl text-center"><p className="text-xs text-zinc-500">Epley</p><p className="text-2xl font-black">{epley} kg</p></div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-center"><p className="text-xs text-zinc-500">Brzycki</p><p className="text-2xl font-black">{brzycki} kg</p></div>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {[95,90,85,80].map(p=>(
            <div key={p} className="bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-center"><p className="text-zinc-500">{p}%</p><p className="font-bold">{Math.round(epley*p/100)}kg</p></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
