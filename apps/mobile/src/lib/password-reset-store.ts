import { createHash, randomBytes } from "crypto";
import { prisma } from "./db";

const TOKEN_LENGTH = 32;
const EXPIRY_MS = 60 * 60 * 1000; // 1 hora

/**
 * Genera un token criptográficamente seguro para reset de password.
 */
export function generateSecureToken(): string {
  return randomBytes(TOKEN_LENGTH).toString("hex");
}

/**
 * En DB solo vive el HASH (sha256): si la base se filtra, los tokens no sirven.
 * Exportado para el test de regresión (vector conocido).
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Crea un token de reseteo y lo guarda en DB.
 * Retorna el token plaintext (única vez que se ve).
 */
export async function issueResetToken(email: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Anti-enumeración: mismo comportamiento si existe o no
    return null;
  }

  // Invalidar tokens previos no usados
  await prisma.passwordResetToken.updateMany({
    where: { email, used: false },
    data: { used: true },
  });

  const token = generateSecureToken();
  const expiresAt = new Date(Date.now() + EXPIRY_MS);

  await prisma.passwordResetToken.create({
    data: {
      email,
      token: hashToken(token),
      expiresAt,
      used: false,
    },
  });

  return token;
}

/**
 * Valida un token: verifica existencia, expiración y uso.
 * Retorna el email asociado si es válido, null si no.
 */
export async function validateResetToken(token: string): Promise<string | null> {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token: hashToken(token) },
  });

  if (!record) return null;
  if (record.used) return null;
  if (record.expiresAt < new Date()) return null;

  return record.email;
}

/**
 * Marca un token como usado después de un reset exitoso.
 */
export async function consumeResetToken(token: string): Promise<void> {
  await prisma.passwordResetToken.updateMany({
    where: { token, used: false },
    data: { used: true },
  });
}

/**
 * Limpia tokens expirados o usados (llamar periódicamente).
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const result = await prisma.passwordResetToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { used: true },
      ],
    },
  });
  return result.count;
}
