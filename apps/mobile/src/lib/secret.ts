/**
 * secret.ts — única fuente del secreto JWT.
 * Producción sin JWT_SECRET = denegar todo (fail-closed), nunca fallback público.
 */
let warned = false;

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
  return new TextEncoder().encode("ezequiel-coaching-super-secret-jwt-32chars!");
}
