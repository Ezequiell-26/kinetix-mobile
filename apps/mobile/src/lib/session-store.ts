import { randomBytes } from "crypto";
import { prisma } from "./db";
import type { JWTPayload } from "./auth";

const TOKEN_LENGTH = 32;
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

/**
 * Genera un token de sesión criptográficamente seguro.
 */
export function generateSessionToken(): string {
  return randomBytes(TOKEN_LENGTH).toString("hex");
}

/**
 * Crea una nueva sesión en DB para un usuario.
 * `token` es el JWT de la cookie: así la validación (validateSession(jwt))
 * y la revocación (logout) encuentran la fila determinísticamente.
 */
export async function createSession(
  userId: string,
  token: string,
  userAgent?: string,
  ipAddress?: string
): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS);

  await prisma.session.create({
    data: {
      userId,
      token,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      expiresAt,
      revoked: false,
    },
  });


}

/**
 * Valida una sesión: verifica existencia, expiración y revocación.
 * Retorna el userId si es válida, null si no.
 */
export async function validateSession(token: string): Promise<string | null> {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: { select: { id: true } } },
  });

  if (!session) return null;
  if (session.revoked) return null;
  if (session.expiresAt < new Date()) return null;

  // Actualizar lastUsed para mantener sesión activa
  await prisma.session.update({
    where: { id: session.id },
    data: { lastUsed: new Date() },
  });

  return session.userId;
}

/**
 * Invalida una sesión específica (logout individual).
 */
export async function revokeSession(token: string): Promise<void> {
  await prisma.session.updateMany({
    where: { token },
    data: { revoked: true },
  });
}

/**
 * Invalida TODAS las sesiones de un usuario (logout global o post-rotación).
 */
export async function revokeAllUserSessions(userId: string): Promise<number> {
  const result = await prisma.session.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true },
  });
  return result.count;
}

/**
 * Limpia sesiones expiradas (llamar periódicamente).
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.session.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { revoked: true },
      ],
    },
  });
  return result.count;
}

/**
 * Obtiene todas las sesiones activas de un usuario (para UI de gestión de sesiones).
 */
export async function getUserSessions(userId: string) {
  return prisma.session.findMany({
    where: { userId, revoked: false, expiresAt: { gt: new Date() } },
    select: {
      id: true,
      userAgent: true,
      ipAddress: true,
      createdAt: true,
      lastUsed: true,
      expiresAt: true,
    },
    orderBy: { lastUsed: "desc" },
  });
}
