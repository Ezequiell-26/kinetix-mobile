"use client";
import Image from "next/image";
import { Camera } from "lucide-react";
import { useState } from "react";

export function PhotoCompare({
  beforeUrl,
  afterUrl,
  beforeLabel = "Antes",
  afterLabel = "Actual"
}: {
  beforeUrl?: string | null;
  afterUrl?: string | null;
  beforeLabel?: string;
  afterLabel?: string;
}){
  const [pos, setPos] = useState(50);

  // If no photos exist yet
  if (!beforeUrl && !afterUrl) {
    return (
      <div className="aspect-[4/3] bg-zinc-950 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center p-6 text-center space-y-2">
        <Camera size={30} className="text-zinc-500" />
        <p className="font-bold text-sm text-white">Comparador de Fotos</p>
        <p className="text-xs text-zinc-500 max-w-xs">
          Subí al menos dos fotos de progreso para activar la comparación interactiva de tu transformación.
        </p>
      </div>
    );
  }

  // If only one photo exists
  if (beforeUrl && !afterUrl) {
    return (
      <div className="relative aspect-[4/3] bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800">
        <Image src={beforeUrl} alt={beforeLabel} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" unoptimized={beforeUrl.startsWith("blob:") || beforeUrl.startsWith("data:") || beforeUrl.startsWith("/uploads/") || beforeUrl.startsWith("/api/uploads/")} />
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white">
          {beforeLabel}
        </div>
      </div>
    );
  }

  const imgBefore = beforeUrl || afterUrl!;
  const imgAfter = afterUrl || beforeUrl!;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 select-none">
        {/* Before photo (base) */}
        <div className="absolute inset-0">
          <Image src={imgBefore} alt={beforeLabel} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" unoptimized={imgBefore.startsWith("blob:") || imgBefore.startsWith("data:") || imgBefore.startsWith("/uploads/") || imgBefore.startsWith("/api/uploads/")} />
          <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-bold text-white z-10">
            {beforeLabel}
          </span>
        </div>

        {/* After photo (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Image src={imgAfter} alt={afterLabel} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" unoptimized={imgAfter.startsWith("blob:") || imgAfter.startsWith("data:") || imgAfter.startsWith("/uploads/") || imgAfter.startsWith("/api/uploads/")} />
          <span className="absolute bottom-3 right-3 bg-primary text-black px-2.5 py-1 rounded-full text-[11px] font-black z-10">
            {afterLabel}
          </span>
        </div>

        {/* Divider line & handle */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-[0_0_10px_rgba(214,255,42,0.8)]" style={{ left: `${pos}%` }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-black rounded-full flex items-center justify-center text-xs font-black -translate-x-1/2 shadow-lg cursor-ew-resize"
          style={{ left: `${pos}%` }}
        >
          ↔
        </div>

        {/* Slider input */}
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={e => setPos(Number(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
          aria-label="Deslizar para comparar fotos"
        />
      </div>

      <div className="flex justify-between text-xs text-zinc-400 px-1">
        <span>Deslizá hacia los lados para comparar</span>
        <span className="text-primary font-bold">{pos}%</span>
      </div>
    </div>
  );
}
