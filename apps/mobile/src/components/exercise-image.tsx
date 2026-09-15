"use client";
import { useState } from "react";
import Image from "next/image";
import { Dumbbell } from "lucide-react";

// Inspirado en Workout Guide MIT + Free Exercise DB + hasaneyldrm
// Maneja fallback robusto: intenta foto real → si falla muestra ilustración SVG por músculo → si no, icono
const MUSCLE_COLORS: Record<string, {bg:string; accent:string; label:string}> = {
  Chest: {bg:"bg-red-500/10", accent:"text-red-400", label:"Pecho"},
  chest: {bg:"bg-red-500/10", accent:"text-red-400", label:"Pecho"},
  Pectoral: {bg:"bg-red-500/10", accent:"text-red-400", label:"Pecho"},
  Back: {bg:"bg-blue-500/10", accent:"text-blue-400", label:"Espalda"},
  back: {bg:"bg-blue-500/10", accent:"text-blue-400", label:"Espalda"},
  waist: {bg:"bg-amber-500/10", accent:"text-amber-400", label:"Core"},
  Waist: {bg:"bg-amber-500/10", accent:"text-amber-400", label:"Core"},
  Legs: {bg:"bg-emerald-500/10", accent:"text-emerald-400", label:"Piernas"},
  legs: {bg:"bg-emerald-500/10", accent:"text-emerald-400", label:"Piernas"},
  "Upper Legs": {bg:"bg-emerald-500/10", accent:"text-emerald-400", label:"Piernas"},
  Shoulders: {bg:"bg-violet-500/10", accent:"text-violet-400", label:"Hombros"},
  shoulders: {bg:"bg-violet-500/10", accent:"text-violet-400", label:"Hombros"},
  "Upper Arms": {bg:"bg-orange-500/10", accent:"text-orange-400", label:"Brazos"},
  Biceps: {bg:"bg-orange-500/10", accent:"text-orange-400", label:"Brazos"},
  Triceps: {bg:"bg-orange-500/10", accent:"text-orange-400", label:"Brazos"},
  Glutes: {bg:"bg-pink-500/10", accent:"text-pink-400", label:"Glúteos"},
  glutes: {bg:"bg-pink-500/10", accent:"text-pink-400", label:"Glúteos"},
  Abdominals: {bg:"bg-amber-500/10", accent:"text-amber-400", label:"Core"},
  Cardio: {bg:"bg-sky-500/10", accent:"text-sky-400", label:"Cardio"},
};

function Illustration({ muscleGroup, name }:{ muscleGroup:string; name:string }){
  const c = MUSCLE_COLORS[muscleGroup] || {bg:"bg-zinc-800", accent:"text-zinc-400", label: muscleGroup};
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center p-4 ${c.bg}`}>
      <div className={`w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center ${c.accent}`}>
        <Dumbbell size={20} />
      </div>
      <p className="text-xs font-bold mt-2 text-white text-center line-clamp-1">{c.label}</p>
      <p className="text-[11px] text-zinc-500 text-center line-clamp-1">{name}</p>
    </div>
  );
}

export function ExerciseImage({ src, videoSrc, alt, muscleGroup, name, className, priority }:{
  src: string | null;
  /** Video del ejercicio (campo `video` de la DB). Opcional: si no hay, se muestra la foto. */
  videoSrc?: string | null;
  alt: string;
  muscleGroup: string;
  name: string;
  className?: string;
  priority?: boolean;
}){
  const [failed,setFailed]=useState(false);
  const [videoFailed,setVideoFailed]=useState(false);
  const [loaded,setLoaded]=useState(false);

  const showVideo = !!videoSrc && !videoFailed;
  const hasImage = !!src && !failed;

  // Sin media disponible → ilustración por grupo muscular.
  if(!showVideo && !hasImage){
    return <div className={className}><Illustration muscleGroup={muscleGroup} name={name} /></div>;
  }

  // El video es EXPLÍCITO (campo `video` del ejercicio). Antes se deducía un `.mp4`
  // junto a la foto, lo que disparaba ~100 requests 404 por página porque el repo
  // no incluye videos. Ahora solo se pide si el ejercicio realmente tiene uno.
  if(showVideo){
    return (
      <div className={`relative overflow-hidden bg-zinc-900 ${className}`}>
        <video
          src={videoSrc as string}
          poster={src ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
          onCanPlay={()=>setLoaded(true)}
          onError={()=>setVideoFailed(true)}
          className={`w-full h-full object-cover transition-opacity ${loaded?"opacity-100":"opacity-0"}`}
        />
        {!loaded && <div className="absolute inset-0 animate-pulse bg-zinc-800" />}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-zinc-900 ${className}`}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-zinc-800" />}
      <Image
        src={src as string}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
        quality={80}
        unoptimized={src?.startsWith("blob:") || src?.startsWith("data:") || false}
        onLoad={()=>setLoaded(true)}
        onError={()=>setFailed(true)}
        className={`object-cover transition-opacity ${loaded?"opacity-100":"opacity-0"}`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
