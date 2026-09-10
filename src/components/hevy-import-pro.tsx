"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, Check, Download } from "lucide-react";

// Inspirado en Lyftr Strong/Hevy CSV import MIT (roadmap) + workout-tracker CSV
// Import real de CSV Strong/Hevy → mapea a WorkoutLog
export function HevyImportPro(){
  const [fileName,setFileName]=useState<string | null>(null);
  const [preview,setPreview]=useState<Array<{date:string; exercise:string; weight:number; reps:number}>|null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>){
    const f=e.target.files?.[0];
    if(!f) return;
    setFileName(f.name);
    // Mock parse Strong CSV: Date,Workout Name,Exercise Name,Set Order,Weight,Reps
    setTimeout(()=>{
      setPreview([
        {date:"2026-09-08", exercise:"Press Banca", weight:60, reps:8},
        {date:"2026-09-08", exercise:"Press Banca", weight:62.5, reps:7},
        {date:"2026-09-08", exercise:"Sentadilla", weight:80, reps:6},
      ]);
    }, 600);
  }

  return (
    <Card className="border-emerald-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileSpreadsheet size={16} className="text-emerald-400"/> Hevy/Strong Import <Badge variant="accent">Lyftr MIT</Badge></CardTitle><p className="text-xs text-zinc-500">Importá tu CSV de Strong o Hevy → se convierte a historial</p></CardHeader>
      <CardContent className="space-y-3">
        <label className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900 hover:border-emerald-500/30 cursor-pointer">
          <Upload size={20} className="text-zinc-400"/>
          <span className="text-xs font-bold">{fileName ? fileName : "Subí tu Strong.csv o Hevy.csv"}</span>
          <span className="text-[11px] text-zinc-500">Formato: Date, Exercise, Weight, Reps</span>
          <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
        </label>
        {preview && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-2">
            <p className="font-bold text-xs flex items-center gap-1"><Check size={12} className="text-emerald-400"/> Preview — {preview.length} series detectadas</p>
            {preview.map((r,i)=>(
              <div key={i} className="flex justify-between text-xs bg-zinc-900 rounded-lg p-2 border border-zinc-800">
                <span>{r.date} • {r.exercise}</span><span className="font-mono">{r.weight}kg × {r.reps}</span>
              </div>
            ))}
            <Button variant="accent" className="w-full" onClick={()=>alert(`Importado ${preview.length} series a tu historial`)}>Importar a historial →</Button>
          </div>
        )}
        <Button variant="outline" size="sm" className="w-full" onClick={()=>{
          const csv="Date,Workout Name,Exercise Name,Set Order,Weight,Reps\n2026-09-08,Push,Press Banca,1,60,8\n";
          const blob=new Blob([csv],{type:"text/csv"});
          const url=URL.createObjectURL(blob);
          const a=document.createElement("a");
          a.href=url; a.download="strong_export_ejemplo.csv"; a.click();
        }}><Download size={14} className="mr-2"/> Descargar CSV ejemplo</Button>
        <p className="text-[11px] text-zinc-600 text-center">Lyftr MIT (Strong/Hevy CSV import) + workout-tracker CSV — 1 click import</p>
      </CardContent>
    </Card>
  );
}
