/**
 * secret.ts — única fuente del secreto JWT.
 * Producción sin JWT_SECRET = denegar todo (fail-closed), nunca fallback público.
 */
import { randomBytes } from "crypto";

let warned = false;
/** Secreto efímero por proceso: se genera una sola vez y no persiste. */
let ephemeralSecret: Uint8Array | null = null;

export function getJwtSecret(): Uint8Array {
  const fromEnv = process.env.JWT_SECRET;
  if (fromEnv && fromEnv.length >= 32) {
    return new TextEncoder().encode(fromEnv);
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET ausente en producción: el servidor no arranca sin secreto.");
  }
  if (!warned) {
    warned = true;
    console.warn("[auth] JWT_SECRET ausente: usando secreto efímero SOLO para desarrollo local.");
  }
  // Secreto aleatorio por proceso en vez de una constante commiteada.
  // Una constante en el repo permitía forjar tokens de dev/staging a
  // cualquiera con acceso al código. El aleatorio invalida los tokens al
  // reiniciar el proceso, que es exactamente lo deseado fuera de producción.
  if (!ephemeralSecret) {
    ephemeralSecret = new Uint8Array(randomBytes(32));
  }
  return ephemeralSecret;
}
