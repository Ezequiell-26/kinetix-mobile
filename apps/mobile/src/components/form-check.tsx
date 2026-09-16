"use client";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Video, Upload, AlertTriangle, CheckCircle2, FileVideo } from "lucide-react";

/**
 * Form Check prepara y valida el video para el motor de pose.
 * No muestra scores ni feedback inventados mientras el modelo de pose real
 * no esté cargado en el cliente.
 */
export function FormCheck(){
  const [fileName,setFileName]=useState<string | null>(null);
  const [metadata,setMetadata]=useState<{duration:number; width:number; height:number} | null>(null);
  const [error,setError]=useState<string | null>(null);
  const [ready,setReady]=useState(false);
  const inputRef=useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0];
    if(!file) return;
    setError(null);
    setReady(false);
    setMetadata(null);
    if (!file.type.startsWith("video/")) {
      setFileName(null);
      setError("Elegí un archivo de video válido.");
      return;
    }
    if (file.size > 60 * 1024 * 1024) {
      setFileName(null);
      setError("El video supera el límite de 60 MB.");
      return;
    }
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      if (duration > 60) {
        setError("El video supera el límite recomendado de 60 segundos.");
      }
      setMetadata({ duration, width: video.videoWidth, height: video.videoHeight });
      setReady(true);
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      setError("No se pudo leer la metadata del video.");
      URL.revokeObjectURL(url);
    };
    video.src = url;
  }

  return (
    <Card className="border-primary/20 bg-[#0B151E]">
      <CardHeader><CardTitle className="flex items-center gap-2"><Camera size={18} className="text-primary"/> Form Check <Badge variant="warn">Preparación</Badge></CardTitle><p className="text-xs text-[#8193A5]">Validá tu video antes de enviarlo al motor de análisis de técnica.</p></CardHeader>
      <CardContent className="space-y-4">
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[#1C3142] bg-[#081119] p-6 transition hover:border-primary/30">
          <Video size={22} className="text-[#8193A5]"/>
          <span className="text-xs font-bold text-zinc-200">{fileName || "Elegí un video .mp4 / .mov"}</span>
          <span className="text-[11px] text-[#8193A5]">Máx. 60 MB · idealmente 10–60 s · vista lateral o frontal estable</span>
          <input ref={inputRef} type="file" accept="video/mp4,video/quicktime,video/webm,video/*" className="hidden" onChange={handleFile} />
        </label>
        <Button variant="outline" className="w-full" onClick={()=>inputRef.current?.click()}><Upload size={14} className="mr-2"/> Elegir video</Button>
        {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-200"><AlertTriangle size={14} className="mt-0.5"/>{error}</div>}
        {ready && metadata && <div className="grid grid-cols-3 gap-2"><div className="rounded-xl border border-[#1C3142] bg-[#081119] p-3 text-center"><FileVideo size={15} className="mx-auto text-primary"/><p className="mt-1 text-sm font-black">{metadata.duration.toFixed(1)}s</p><p className="text-[10px] text-[#8193A5]">Duración</p></div><div className="rounded-xl border border-[#1C3142] bg-[#081119] p-3 text-center"><CheckCircle2 size={15} className="mx-auto text-primary"/><p className="mt-1 text-sm font-black">{metadata.width}×{metadata.height}</p><p className="text-[10px] text-[#8193A5]">Resolución</p></div><div className="rounded-xl border border-[#1C3142] bg-[#081119] p-3 text-center"><Badge variant="accent">LISTO</Badge><p className="mt-1 text-[10px] text-[#8193A5]">Validación</p></div></div>}
        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4 text-xs leading-5 text-[#B8C2CA]">
          <strong className="text-amber-300">Análisis de técnica:</strong> el selector y la validación del video están funcionando, pero no se muestra un score inventado. El resultado biomecánico requiere que el modelo de pose real esté desplegado.
        </div>
      </CardContent>
    </Card>
  );
}
