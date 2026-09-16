import { randomBytes } from "crypto";
import { prisma } from "./db";

const TOKEN_LENGTH = 32;
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
const LAST_USED_TOUCH_INTERVAL_MS = 5 * 60 * 1000;

export function generateSessionToken(): string {
  return randomBytes(TOKEN_LENGTH).toString("hex");
}

export async function createSession(
  userId: string,
  token: string,
  userAgent?: string,
  ipAddress?: string,
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
 * Valida existencia, revocación y expiración. La actividad se toca como máximo
 * una vez cada cinco minutos para evitar una escritura DB por cada API request.
 */
export async function validateSession(token: string): Promise<string | null> {
  const session = await prisma.session.findUnique({
    where: { token },
    select: { id: true, userId: true, revoked: true, expiresAt: true, lastUsed: true },
  });
  if (!session || session.revoked || session.expiresAt <= new Date()) return null;

  if (Date.now() - session.lastUsed.getTime() >= LAST_USED_TOUCH_INTERVAL_MS) {
    await prisma.session.updateMany({
      where: { id: session.id, revoked: false, expiresAt: { gt: new Date() } },
      data: { lastUsed: new Date() },
    }).catch(() => {});
  }

  return session.userId;
}

export async function revokeSession(token: string): Promise<void> {
  await prisma.session.updateMany({ where: { token }, data: { revoked: true } });
}

export async function revokeAllUserSessions(userId: string): Promise<number> {
  const result = await prisma.session.updateMany({ where: { userId, revoked: false }, data: { revoked: true } });
  return result.count;
}

export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.session.deleteMany({
    where: { OR: [{ expiresAt: { lt: new Date() } }, { revoked: true }] },
  });
  return result.count;
}

export async function getUserSessions(userId: string) {
  return prisma.session.findMany({
    where: { userId, revoked: false, expiresAt: { gt: new Date() } },
    select: { id: true, userAgent: true, ipAddress: true, createdAt: true, lastUsed: true, expiresAt: true },
    orderBy: { lastUsed: "desc" },
  });
}
