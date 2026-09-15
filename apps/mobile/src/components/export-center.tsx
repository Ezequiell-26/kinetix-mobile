"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileSpreadsheet, Calendar, FileText, Loader2, AlertCircle } from "lucide-react";

type WorkoutLog = { id:string; date:string; workoutName?:string|null; durationMin?:number|null; comment?:string|null; sets?:Array<{exerciseName:string;weight?:number|null;reps?:number|null;rir?:number|null}> };
type Summary = { totalWorkouts:number; streak:number; prs:number; adherence:number; frequency:number };

function download(filename:string, content:string, mime:string){
  const blob=new Blob([content], {type:mime});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a"); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),500);
}
function csvCell(value:unknown){const text=String(value??"");return /[",\n]/.test(text)?`"${text.replace(/"/g,'""')}"`:text;}
function toIcsDate(value:string){return new Date(value).toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/, "Z");}

export function ExportCenter({ type="client" }:{ type?: "client"|"trainer"}){
  const [loading,setLoading]=useState<string|null>(null);
  const [error,setError]=useState<string|null>(null);

  async function load(){
    const [logsRes,summaryRes]=await Promise.all([fetch("/api/workout-logs",{cache:"no-store"}),fetch("/api/workout-logs/summary",{cache:"no-store"})]);
    const logsData=await logsRes.json().catch(()=>[]);
    const summaryData=await summaryRes.json().catch(()=>null);
    if(!logsRes.ok) throw new Error(logsData?.error||"No se pudo cargar el historial.");
    if(!summaryRes.ok) throw new Error(summaryData?.error||"No se pudo cargar el resumen.");
    return {logs:Array.isArray(logsData)?logsData as WorkoutLog[]:[],summary:summaryData as Summary};
  }

  async function exportCsv(){
    setLoading("csv");setError(null);try{const {logs}=await load();const rows:string[][]=[["fecha","entrenamiento","ejercicio","peso","reps","rir","duracion_min","comentario"]];for(const log of logs){for(const set of (log.sets||[])){rows.push([new Date(log.date).toLocaleDateString("es-AR"),log.workoutName||"Entrenamiento",set.exerciseName,String(set.weight??""),String(set.reps??""),String(set.rir??""),String(log.durationMin??""),log.comment||""]);}}download("kinetixfitt_historial.csv",rows.map(r=>r.map(csvCell).join(",")).join("\n"),"text/csv;charset=utf-8");}catch(e){setError(e instanceof Error?e.message:"No se pudo exportar.");}finally{setLoading(null);}}

  async function exportIcal(){
    setLoading("ical");setError(null);try{const {logs}=await load();const events=logs.slice(0,50).map((log,i)=>`BEGIN:VEVENT\nUID:kinetixfitt-${log.id||i}@kinetixfitt.com\nDTSTAMP:${toIcsDate(new Date().toISOString())}\nDTSTART:${toIcsDate(log.date)}\nDURATION:PT${Math.max(1,log.durationMin||60)}M\nSUMMARY:${(log.workoutName||"Entrenamiento KinetixFitt").replace(/[\n,;]/g," ")}\nEND:VEVENT`).join("\n");download("kinetixfitt_entrenamientos.ics",`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//KinetixFitt//Training Calendar//ES\nCALSCALE:GREGORIAN\n${events}\nEND:VCALENDAR`,"text/calendar;charset=utf-8");}catch(e){setError(e instanceof Error?e.message:"No se pudo exportar el calendario.");}finally{setLoading(null);}}

  async function exportReport(){
    setLoading("report");setError(null);try{const {summary}=await load();const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>KinetixFitt · Reporte</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#111}h1{margin-bottom:4px}p{color:#555}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:24px}.card{border:1px solid #ddd;border-radius:12px;padding:16px}.value{font-size:26px;font-weight:800;margin-top:8px}@media print{body{padding:20px}}</style></head><body><h1>KinetixFitt</h1><p>Reporte generado a partir de datos registrados en tu cuenta.</p><div class="grid"><div class="card">Sesiones<div class="value">${summary.totalWorkouts}</div></div><div class="card">Racha<div class="value">${summary.streak}d</div></div><div class="card">PRs<div class="value">${summary.prs}</div></div><div class="card">Adherencia<div class="value">${summary.adherence}%</div></div></div><p style="margin-top:32px">Frecuencia objetivo: ${summary.frequency} sesiones/semana.</p><script>window.print();</script></body></html>`;const win=window.open("","_blank","noopener,noreferrer,width=900,height=700");if(!win)throw new Error("El navegador bloqueó la ventana del reporte. Permití ventanas emergentes para exportar.");win.document.write(html);win.document.close();}catch(e){setError(e instanceof Error?e.message:"No se pudo generar el reporte.");}finally{setLoading(null);}}

  return <Card className="border-primary/20 bg-[#0B151E]"><CardHeader><CardTitle className="flex items-center gap-2"><Download size={16} className="text-primary"/> Export Center <Badge variant="accent">Datos reales</Badge></CardTitle><p className="text-xs text-[#8193A5]">Exportá el historial registrado. No se generan métricas ni sesiones ficticias.</p></CardHeader><CardContent className="space-y-3">{error&&<div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-200"><AlertCircle size={14}/>{error}</div>}<div className="grid gap-2 sm:grid-cols-2"><Button variant="outline" className="h-14 justify-start gap-3" onClick={exportCsv} disabled={!!loading}><FileSpreadsheet size={18} className="text-primary"/><div className="text-left"><p className="font-bold text-xs">CSV Historial</p><p className="text-[11px] text-zinc-500">Series y sesiones reales</p></div>{loading==="csv"&&<Loader2 className="ml-auto animate-spin" size={15}/>}</Button><Button variant="outline" className="h-14 justify-start gap-3" onClick={exportIcal} disabled={!!loading}><Calendar size={18} className="text-sky-400"/><div className="text-left"><p className="font-bold text-xs">iCal Entrenamientos</p><p className="text-[11px] text-zinc-500">Apple / Google Calendar</p></div>{loading==="ical"&&<Loader2 className="ml-auto animate-spin" size={15}/>}</Button><Button variant="outline" className="h-14 justify-start gap-3" onClick={exportReport} disabled={!!loading}><FileText size={18} className="text-amber-300"/><div className="text-left"><p className="font-bold text-xs">Reporte imprimible</p><p className="text-[11px] text-zinc-500">Sesiones + progreso</p></div>{loading==="report"&&<Loader2 className="ml-auto animate-spin" size={15}/>}</Button></div><p className="text-[11px] text-[#8193A5]">{type==="trainer"?"El alcance respeta los clientes asignados al trainer.":"El alcance corresponde a tu propio historial."}</p></CardContent></Card>;
}
