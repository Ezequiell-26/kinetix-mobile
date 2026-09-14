'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Photo {
  id: string;
  url: string;
  date: string;
  type: 'before' | 'after' | 'progress';
  notes?: string;
}

interface PhotoComparatorProps {
  photos: Photo[];
  onClose?: () => void;
}

export function PhotoComparator({ photos, onClose }: PhotoComparatorProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBefore, setSelectedBefore] = useState<Photo | null>(null);
  const [selectedAfter, setSelectedAfter] = useState<Photo | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filtrar fotos
  const beforePhotos = photos.filter(p => p.type === 'before' || p.type === 'progress');
  const afterPhotos = photos.filter(p => p.type === 'after' || p.type === 'progress');

  // Seleccionar automáticamente las más recientes si no hay selección
  useEffect(() => {
    if (beforePhotos.length > 0 && !selectedBefore) {
      setSelectedBefore(beforePhotos[0]);
    }
    if (afterPhotos.length > 0 && !selectedAfter) {
      setSelectedAfter(afterPhotos[0]);
    }
  }, [photos, selectedBefore, selectedAfter, beforePhotos, afterPhotos]);

  // Medir el contenedor
  useEffect(() => {
    const measureContainer = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    measureContainer();
    window.addEventListener('resize', measureContainer);
    return () => window.removeEventListener('resize', measureContainer);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'clientX' in e ? e.clientX : 0;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, position)));
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const position = ((touch.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, position)));
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging]);

  if (!selectedBefore || !selectedAfter) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-muted-foreground">No hay fotos para comparar</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Comparador de Progreso</h3>
        <div className="flex items-center gap-2">
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Selectores de fotos */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Antes</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const idx = beforePhotos.findIndex(p => p.id === selectedBefore.id);
                const prev = beforePhotos[Math.max(0, idx - 1)];
                if (prev) setSelectedBefore(prev);
              }}
              disabled={beforePhotos.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm flex-1 text-center">
              {new Date(selectedBefore.date).toLocaleDateString()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const idx = beforePhotos.findIndex(p => p.id === selectedBefore.id);
                const next = beforePhotos[Math.min(beforePhotos.length - 1, idx + 1)];
                if (next) setSelectedBefore(next);
              }}
              disabled={beforePhotos.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Después</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const idx = afterPhotos.findIndex(p => p.id === selectedAfter.id);
                const prev = afterPhotos[Math.max(0, idx - 1)];
                if (prev) setSelectedAfter(prev);
              }}
              disabled={afterPhotos.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm flex-1 text-center">
              {new Date(selectedAfter.date).toLocaleDateString()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const idx = afterPhotos.findIndex(p => p.id === selectedAfter.id);
                const next = afterPhotos[Math.min(afterPhotos.length - 1, idx + 1)];
                if (next) setSelectedAfter(next);
              }}
              disabled={afterPhotos.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Comparador visual */}
      <div
        ref={containerRef as any}
        className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden cursor-ew-resize select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Foto Después (fondo completo) */}
        <div className="absolute inset-0">
          <Image
            src={selectedAfter.url}
            alt="Después"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
            Después: {new Date(selectedAfter.date).toLocaleDateString()}
          </div>
        </div>

        {/* Foto Antes (recortada con clip-path) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={selectedBefore.url}
            alt="Antes"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
            Antes: {new Date(selectedBefore.date).toLocaleDateString()}
          </div>
        </div>

        {/* Slider */}
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg"
          style={{ left: `${sliderPosition}%` }}
          initial={false}
          animate={{ left: `${sliderPosition}%` }}
          transition={{ type: 'tween', ease: 'linear' }}
        >
          {/* Handle circular */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </motion.div>

        {/* Overlay de porcentaje */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          {Math.round(sliderPosition)}% / {100 - Math.round(sliderPosition)}%
        </div>
      </div>

      {/* Notas */}
      {(selectedBefore.notes || selectedAfter.notes) && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {selectedBefore.notes && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs font-medium mb-1">Notas - Antes:</p>
              <p className="text-sm text-muted-foreground">{selectedBefore.notes}</p>
            </div>
          )}
          {selectedAfter.notes && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs font-medium mb-1">Notas - Después:</p>
              <p className="text-sm text-muted-foreground">{selectedAfter.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Instrucciones */}
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Arrastra el slider o usa gestos táctiles para comparar
        </p>
      </div>
    </motion.div>
  );
}

// Hook para usar el comparador como modal
export function usePhotoComparator() {
  const [isOpen, setIsOpen] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const open = (photoList: Photo[]) => {
    setPhotos(photoList);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, photos, open, close };
}
