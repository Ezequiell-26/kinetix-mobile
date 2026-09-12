/**
 * Almacén de tokens de recuperación de contraseña (solo desarrollo).
 *
 * Estado de la auditoría: antes, `reset-password` IGNORABA el token y
 * restablecía la contraseña de cualquier cuenta con solo conocer su email
 * (toma de cuenta). `forgot-password` además devolvía el token en la
 * respuesta JSON, de modo que cualquier llamador obtenía el token de la
 * víctima.
 *
 * Este almacén cierra la toma de cuenta: ahora `reset-password` EXIGE un
 * token válido, no expirado y emitido para ese email, de un solo uso.
 *
 * AVISO: es en memoria y se pierde al reiniciar el proceso. Es aceptable
 * para desarrollo local. Para producción hace falta una tabla en la base de
 * datos (PasswordReset con token, email, expiración, usado) + envío por
 * email. Queda como deuda explícita; no usar este mecanismo en producción.
 */

import { randomUUID } from "crypto";

type Entry = { email: string; expires: number };

const store = new Map<string, Entry>();

const TTL_MS = 1000 * 60 * 30; // 30 min

/** Crea y guarda un token para el email, limpiando tokens previos del mismo email. */
export function issueResetToken(email: string): string {
  // Limpiar tokens previos del mismo email para evitar reentradas.
  for (const [tok, entry] of store) {
    if (entry.email === email) store.delete(tok);
  }
  const token = cryptoRandomToken();
  store.set(token, { email, expires: Date.now() + TTL_MS });
  return token;
}

/** Valida el token contra el email. Devuelve true si es válido y no expirado. */
export function consumeResetToken(token: string, email: string): boolean {
  const entry = store.get(token);
  if (!entry) return false;
  if (entry.email !== email) return false;
  if (Date.now() > entry.expires) {
    store.delete(token);
    return false;
  }
  // De un solo uso.
  store.delete(token);
  return true;
}

function cryptoRandomToken(): string {
  // randomUUID está disponible en Node 18+ (el runtime del proyecto lo cumple).
  // No uses esto como secreto de sesión; es un token de un solo uso con TTL.
  return randomUUID();
}
