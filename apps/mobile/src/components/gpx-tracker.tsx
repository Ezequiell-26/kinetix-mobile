"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, Upload, Route, Timer, Mountain, AlertTriangle } from "lucide-react";

function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(x)));
}

function parseTrack(xml: string) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("El archivo no contiene XML GPX/TCX válido.");
  const points = Array.from(doc.querySelectorAll("trkpt")).map((node) => ({
    lat: Number(node.getAttribute("lat")),
    lon: Number(node.getAttribute("lon")),
    ele: Number(node.querySelector("ele")?.textContent ?? "NaN"),
    time: node.querySelector("time")?.textContent ? new Date(node.querySelector("time")!.textContent).getTime() : NaN,
  })).filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon));
  const tcxPoints = Array.from(doc.querySelectorAll("Trackpoint")).map((node) => ({
    lat: Number(node.querySelector("LatitudeDegrees")?.textContent),
    lon: Number(node.querySelector("LongitudeDegrees")?.textContent),
    ele: Number(node.querySelector("AltitudeMeters")?.textContent ?? "NaN"),
    time: node.querySelector("Time")?.textContent ? new Date(node.querySelector("Time")!.textContent).getTime() : NaN,
  })).filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon));
  const track = points.length ? points : tcxPoints;
  if (track.length < 2) throw new Error("No encontré suficientes puntos de recorrido en el archivo.");
  let distance = 0;
  let elevationGain = 0;
  for (let i = 1; i < track.length; i++) {
    distance += haversineKm(track[i - 1].lat, track[i - 1].lon, track[i].lat, track[i].lon);
    if (Number.isFinite(track[i - 1].ele) && Number.isFinite(track[i].ele)) {
      const delta = track[i].ele - track[i - 1].ele;
      if (delta > 0) elevationGain += delta;
    }
  }
  const timed = track.map((p) => p.time).filter(Number.isFinite) as number[];
  const duration = timed.length >= 2 ? Math.max(0, Math.round((Math.max(...timed) - Math.min(...timed)) / 60000)) : null;
  return { dist: Number(distance.toFixed(2)), dur: duration, elev: Math.round(elevationGain) };
}

export function GpxTracker(){
  const [fileName,setFileName]=useState<string | null>(null);
  const [stats,setStats]=useState<{dist:number; dur:number|null; elev:number} | null>(null);
  const [error,setError]=useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>){
    const f=e.target.files?.[0];
    if(!f) return;
    setFileName(f.name);
    setStats(null);
    setError(null);
    try {
      const text = await f.text();
      setStats(parseTrack(text));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo leer el recorrido.");
    }
  }

  return (
    <Card className="border-primary/20 bg-[#0B151E]">
      <CardHeader><CardTitle className="flex items-center gap-2"><Map size={18} className="text-primary"/> GPX Tracker <Badge variant="accent">Real</Badge></CardTitle><p className="text-xs text-[#8193A5]">Leé archivos GPX/TCX de Garmin, Strava y relojes compatibles directamente en el navegador.</p></CardHeader>
      <CardContent className="space-y-4">
        <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#1C3142] bg-[#081119] p-6 transition hover:border-primary/30 cursor-pointer">
          <Upload size={20} className="text-[#8193A5]"/>
          <span className="text-xs font-bold text-zinc-300">{fileName ? fileName : "Elegí tu .gpx / .tcx"}</span>
          <span className="text-[11px] text-[#8193A5]">Se calcula distancia, duración y desnivel desde los puntos reales.</span>
          <input type="file" accept=".gpx,.tcx,application/gpx+xml,application/xml,text/xml" className="hidden" onChange={handleFile} />
        </label>
        {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-200"><AlertTriangle size={14} className="mt-0.5"/>{error}</div>}
        {stats && (
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-[#1C3142] bg-[#081119] p-3 text-center"><Route size={16} className="mx-auto text-primary"/><p className="mt-1 font-black">{stats.dist} km</p><p className="text-[11px] text-[#8193A5]">Distancia</p></div>
            <div className="rounded-xl border border-[#1C3142] bg-[#081119] p-3 text-center"><Timer size={16} className="mx-auto text-zinc-400"/><p className="mt-1 font-black">{stats.dur === null ? "—" : `${stats.dur}′`}</p><p className="text-[11px] text-[#8193A5]">Duración</p></div>
            <div className="rounded-xl border border-[#1C3142] bg-[#081119] p-3 text-center"><Mountain size={16} className="mx-auto text-amber-400"/><p className="mt-1 font-black">{stats.elev} m</p><p className="text-[11px] text-[#8193A5]">Desnivel +</p></div>
          </div>
        )}
        <div className="flex min-h-28 items-center justify-center rounded-xl border border-[#1C3142] bg-[#081119] px-4 text-center text-xs text-[#8193A5]">
          {stats ? "Ruta analizada localmente. El mapa interactivo puede añadirse sin enviar el archivo a un tercero." : "Subí un recorrido para ver sus métricas reales."}
        </div>
      </CardContent>
    </Card>
  );
}
