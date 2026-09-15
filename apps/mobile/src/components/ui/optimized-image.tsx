"use client";

import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "./skeleton";

/**
 * OptimizedImage - Wrapper de next/image con loading state
 * 
 * Beneficios automáticos:
 * - WebP/AVIF automático
 * - Lazy loading
 * - Responsive sizes
 * - Blur placeholder
 */

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  /** Soporte next/image placeholder blur (el agente de funciones lo usa así) */
  placeholder?: "empty" | "blur";
  blurDataURL?: string;
  unoptimized?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  quality = 85,
  sizes,
  objectFit = "cover",
  unoptimized = false,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Si la imagen falla, mostrar placeholder
  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-600 text-xs ${className}`}
        style={{ width, height }}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className="opacity-40"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={!fill ? { width, height } : undefined}>
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"} ${
          objectFit === "cover" ? "object-cover" : 
          objectFit === "contain" ? "object-contain" : 
          objectFit === "fill" ? "object-fill" : 
          objectFit === "none" ? "object-none" : 
          "object-scale-down"
        }`}
        quality={quality}
        priority={priority}
        sizes={sizes}
        unoptimized={unoptimized || src.startsWith("blob:") || src.startsWith("data:")}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}

/**
 * AvatarImage - Avatar optimizado (cliente, trainer)
 */
export function AvatarImage({
  src,
  name,
  size = 40,
  className = "",
}: {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
}) {
  const initial = name.charAt(0).toUpperCase();

  if (!src) {
    return (
      <div 
        className={`flex items-center justify-center rounded-full bg-primary/10 border border-primary/25 text-primary font-black ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {initial}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={`Avatar de ${name}`}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      quality={90}
      objectFit="cover"
    />
  );
}

/**
 * ProgressPhoto - Foto de progreso/check-in
 */
export function ProgressPhoto({
  src,
  date,
  isPrivate = false,
  className = "",
  onClick,
}: {
  src: string;
  date: Date;
  isPrivate?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div 
      className={`relative group cursor-pointer ${className}`}
      onClick={onClick}
    >
      <OptimizedImage
        src={src}
        alt={`Foto de progreso del ${date.toLocaleDateString()}`}
        width={400}
        height={600}
        className="rounded-xl"
        quality={85}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
      />
      
      {/* Overlay con fecha */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-xs font-bold text-white">
            {date.toLocaleDateString("es-AR", { 
              day: "numeric", 
              month: "short", 
              year: "numeric" 
            })}
          </p>
          {isPrivate && (
            <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 mt-1">
              <svg width="10" height="10" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
              </svg>
              Privada
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ResourceThumbnail - Thumbnail de video/recurso
 */
export function ResourceThumbnail({
  src,
  title,
  duration,
  className = "",
}: {
  src: string;
  title: string;
  duration?: string;
  className?: string;
}) {
  return (
    <div className={`relative group ${className}`}>
      <OptimizedImage
        src={src}
        alt={title}
        width={320}
        height={180}
        className="rounded-xl"
        quality={80}
        sizes="(max-width: 640px) 100vw, 320px"
      />
      
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors rounded-xl">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-black ml-1">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
          </svg>
        </div>
      </div>
      
      {duration && (
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/80 text-white text-xs font-bold">
          {duration}
        </div>
      )}
    </div>
  );
}
