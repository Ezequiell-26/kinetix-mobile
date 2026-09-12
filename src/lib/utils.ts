import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind de forma optimizada
 * Usa cache interno para evitar cálculos repetidos
 */
const cnCache = new Map<string, string>();

export function cn(...inputs: ClassValue[]): string {
  const key = inputs.map(i => JSON.stringify(i)).join('|');
  
  // Check cache first
  if (cnCache.has(key)) {
    return cnCache.get(key)!;
  }
  
  const result = twMerge(clsx(inputs));
  cnCache.set(key, result);
  
  // Limit cache size to prevent memory leaks
  if (cnCache.size > 1000) {
    const firstKey = cnCache.keys().next().value;
    if (firstKey) cnCache.delete(firstKey);
  }
  
  return result;
}

// Formatter memoizado para currency
const currencyFormatterCache = new Map<string, Intl.NumberFormat>();

export function formatCurrency(v: number, cur = "ARS"): string {
  const cacheKey = `${cur}`;
  
  if (!currencyFormatterCache.has(cacheKey)) {
    currencyFormatterCache.set(
      cacheKey,
      new Intl.NumberFormat("es-AR", { style: "currency", currency: cur })
    );
  }
  
  return currencyFormatterCache.get(cacheKey)!.format(v);
}

// Formatter memoizado para fechas
const dateFormatterCache = new Map<string, Intl.DateTimeFormat>();

export function formatDate(d: Date | string): string {
  const cacheKey = "es-AR-date";
  
  if (!dateFormatterCache.has(cacheKey)) {
    dateFormatterCache.set(
      cacheKey,
      new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short", year: "numeric" })
    );
  }
  
  return dateFormatterCache.get(cacheKey)!.format(new Date(d));
}

/**
 * Formatea números con separadores de miles
 */
export function formatNumber(v: number): string {
  return new Intl.NumberFormat("es-AR").format(v);
}

/**
 * Convierte string a slug seguro para URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
