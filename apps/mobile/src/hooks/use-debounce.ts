"use client";
import { useState, useEffect, useRef } from "react";

/**
 * Hook optimizado para debounce de valores
 * Usa useRef para evitar re-renders innecesarios y cleanup eficiente
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const valueRef = useRef<T>(value);

  // Actualizar ref del valor actual sin trigger re-render
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // Cleanup effect optimizado
  useEffect(() => {
    // Limpiar timeout anterior si existe
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Crear nuevo timeout
    timerRef.current = setTimeout(() => {
      setDebouncedValue(valueRef.current);
    }, delay);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
