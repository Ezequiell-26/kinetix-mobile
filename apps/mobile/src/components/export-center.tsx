"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileSpreadsheet, Calendar, FileText, Share2 } from "lucide-react";

// Inspirado en workout-tracker CSV/GPX export + Simple + Lyftr export
// Export center: CSV, PDF, iCal, GPX ZIP
export function ExportCenter({ type="client" }:{ type?: "client"|"trainer"}){
  function download(filename:string, content:string, mime:string){
    const blob=new Blob([content], {type:mime});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url; a.download=filename; a.click();
    URL.revokeObjectURL(url);
  }

  function exportCsv(){
    const csv="fecha,ejercicio,peso,reps,rir\n2026-09-09,Press Banca,60,8,2\n2026-09-07,Sentadilla,80,6,1\n";
    download("kinetixfitt_historial.csv", csv, "text/csv");
  }

  function exportIcal(){
    const ical="BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Entreno - Tren Superior\nDTSTART:20260910T100000Z\nDURATION:PT60M\nEND:VEVENT\nEND:VCALENDAR";
    download("entrenos.ics", ical, "text/calendar");
  }

  function exportPdf(){
    // Mock: en prod sería jsPDF
    download("reporte_progreso.txt", "KINETIXFITT — Reporte de Progreso\n\nPeso: 81.2kg (-1.2kg)\nAdherencia: 88%\nVolumen: 42.000kg\n", "text/plain");
  }

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Download size={16} className="text-primary"/> Export Center</CardTitle><p className="text-xs text-zinc-500">CSV, PDF, iCal, GPX — {type==="trainer"?"para todos tus clientes":"tu historial"}</p></CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-2">
        <Button variant="outline" className="h-14 justify-start gap-3" onClick={exportCsv}><FileSpreadsheet size={18} className="text-emerald-400"/><div className="text-left"><p className="font-bold text-xs">CSV Historial</p><p className="text-[11px] text-zinc-500">Strong/Hevy compatible</p></div></Button>
        <Button variant="outline" className="h-14 justify-start gap-3" onClick={exportIcal}><Calendar size={18} className="text-blue-400"/><div className="text-left"><p className="font-bold text-xs">iCal Calendario</p><p className="text-[11px] text-zinc-500">Google/Apple Calendar</p></div></Button>
        <Button variant="outline" className="h-14 justify-start gap-3" onClick={exportPdf}><FileText size={18} className="text-amber-400"/><div className="text-left"><p className="font-bold text-xs">PDF Reporte</p><p className="text-[11px] text-zinc-500">Progreso + fotos</p></div></Button>
        <Button variant="outline" className="h-14 justify-start gap-3" onClick={()=>download("gpx_export.zip","mock zip","application/zip")}><Share2 size={18} className="text-violet-400"/><div className="text-left"><p className="font-bold text-xs">GPX ZIP</p><p className="text-[11px] text-zinc-500">Todas las rutas</p></div></Button>
      </CardContent>
    </Card>
  );
}
