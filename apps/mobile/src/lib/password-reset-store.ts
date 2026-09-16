import { createHash, randomBytes } from "crypto";
import { prisma } from "./db";

const TOKEN_LENGTH = 32;
const EXPIRY_MS = 60 * 60 * 1000; // 1 hora

export function generateSecureToken(): string {
  return randomBytes(TOKEN_LENGTH).toString("hex");
}

/** En DB solo vive el hash del token. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function issueResetToken(email: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

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

export async function validateResetToken(token: string): Promise<string | null> {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token: hashToken(token) },
  });

  if (!record || record.used || record.expiresAt < new Date()) return null;
  return record.email;
}

/**
 * Consume un token de forma atómica.
 * Devuelve false si el token ya fue consumido o expiró, evitando carreras.
 */
export async function consumeResetToken(token: string): Promise<boolean> {
  const result = await prisma.passwordResetToken.updateMany({
    where: {
      token: hashToken(token),
      used: false,
      expiresAt: { gt: new Date() },
    },
    data: { used: true },
  });
  return result.count === 1;
}

export async function cleanupExpiredTokens(): Promise<number> {
  const result = await prisma.passwordResetToken.deleteMany({
    where: {
      OR: [{ expiresAt: { lt: new Date() } }, { used: true }],
    },
  });
  return result.count;
}
