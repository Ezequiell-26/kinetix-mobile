/**
 * secret.ts — única fuente del secreto JWT.
 * Producción sin JWT_SECRET = denegar todo (fail-closed), nunca fallback público.
 */
let warned = false;
let ephemeral: Uint8Array | null = null;

export function getJwtSecret(): Uint8Array {
  const fromEnv = process.env.JWT_SECRET;
  if (fromEnv && fromEnv.length >= 32) {
    return new TextEncoder().encode(fromEnv);
  }
  // Durante el build (NEXT_PHASE=phase-production-build) Next.js importa y
  // ejecuta parte del código para "collect page data". Ahí aún no hay runtime
  // secrets inyectados; no debemos tirar el build por falta de JWT_SECRET.
  // El check real de producción se hace en runtime (vercel: env producción).
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    if (!warned) {
      warned = true;
      console.warn('[auth] JWT_SECRET ausente durante build: usando secreto efímero solo para compilar.');
    }
    if (!ephemeral) {
      ephemeral = new Uint8Array(32);
      crypto.getRandomValues(ephemeral);
    }
    return ephemeral;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET ausente en producción: el servidor no arranca sin secreto.");
  }
  if (!warned) {
    warned = true;
    console.warn("[auth] JWT_SECRET ausente: usando secreto efímero SOLO para desarrollo local.");
  }
  // Aleatorio por arranque (nunca constante): tokens dev inválidos tras reiniciar.
  if (!ephemeral) {
    ephemeral = new Uint8Array(32);
    crypto.getRandomValues(ephemeral);
  }
  return ephemeral;
}
