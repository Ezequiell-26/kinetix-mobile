/**
 * voice-engine/numbers.ts — números dinámicos en español (0-100 + decimales).
 * Estrategia: grabar 0-29 + decenas + cien + coma = 39 audios cubren todo.
 * Cada token es una CLAVE del diccionario (numbers/<clave>.mp3).
 */

const UNITS = [
  "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete",
  "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince",
];
const TEENS: Record<number, string> = {
  16: "dieciseis", 17: "diecisiete", 18: "dieciocho", 19: "diecinueve",
};
const TWENTIES: Record<number, string> = {
  20: "veinte", 21: "veintiuno", 22: "veintidos", 23: "veintitres",
  24: "veinticuatro", 25: "veinticinco", 26: "veintiseis",
  27: "veintisiete", 28: "veintiocho", 29: "veintinueve",
};
const TENS: Record<number, string> = {
  30: "treinta", 40: "cuarenta", 50: "cincuenta", 60: "sesenta",
  70: "setenta", 80: "ochenta", 90: "noventa",
};

/** Entero 0-100 → claves de audio en orden. */
export function intToKeys(n: number): string[] {
  const v = Math.max(0, Math.min(100, Math.round(n)));
  if (v <= 15) return [UNITS[v]];
  if (TEENS[v]) return [TEENS[v]];
  if (TWENTIES[v]) return [TWENTIES[v]];
  if (v === 100) return ["cien"];
  const ten = Math.floor(v / 10) * 10;
  const unit = v % 10;
  if (unit === 0) return [TENS[ten]];
  return [TENS[ten], "y", UNITS[unit]];
}

/** Número con decimales (60.5) → claves. "coma" es conector grabable. */
export function numberToKeys(n: number): string[] {
  if (!Number.isFinite(n)) return ["cero"];
  const rounded = Math.round(n * 10) / 10;
  const int = Math.trunc(rounded);
  const dec = Math.round((rounded - int) * 10);
  if (dec === 0) return intToKeys(int);
  return [...intToKeys(int), "coma", ...intToKeys(dec)];
}

/** Texto legible de las claves (laboratorio). */
const DISPLAY: Record<string, string> = {
  dieciseis: "dieciséis", diecisiete: "diecisiete", dieciocho: "dieciocho",
  diecinueve: "diecinueve", veintidos: "veintidós", veintitres: "veintitrés",
  veintiseis: "veintiséis", cien: "cien", coma: "coma", y: "y",
};
export function keyToWord(key: string): string {
  if (/^\d+$/.test(key)) return UNITS[Number(key)] ?? key;
  return DISPLAY[key] ?? key;
}

/** Lista exacta de archivos a grabar para cubrir 0-100 + decimales. */
export const REQUIRED_NUMBER_KEYS: string[] = [
  ...UNITS,
  ...Object.values(TEENS),
  ...Object.values(TWENTIES),
  ...Object.values(TENS),
  "cien",
  "coma",
];
