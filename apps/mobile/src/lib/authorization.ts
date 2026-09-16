/**
 * authorization.ts — funciones centrales de autorización multi-trainer.
 */

import { prisma } from "./db";

export async function assertTrainerOwnsClient(trainerId: string, clientId: string): Promise<boolean> {
  if (!trainerId || !clientId) return false;
  const client = await prisma.client.findUnique({ where: { id: clientId }, select: { trainerId: true } });
  return client?.trainerId === trainerId;
}

/** Obtiene el clientId por la relación estable userId; email solo es fallback legacy. */
export async function getClientIdForUser(userId: string, email?: string): Promise<string | null> {
  if (!userId) return null;
  const client = await prisma.client.findFirst({
    where: {
      OR: [
        { userId },
        ...(email ? [{ email: email.toLowerCase().trim() }] : []),
      ],
    },
    select: { id: true },
  });
  return client?.id ?? null;
}

export async function assertFileOwnership(
  userId: string,
  role: "TRAINER" | "CLIENT",
  url: string,
): Promise<boolean> {
  const parts = url.split("/");
  const type = parts[parts.length - 2];
  const filename = parts[parts.length - 1];
  if (!type || !filename) return false;

  const asset = await prisma.privateAsset.findUnique({
    where: { filename },
    select: { userId: true, clientId: true, type: true },
  });
  if (!asset || asset.type !== type) return false;

  if (role === "CLIENT") return asset.userId === userId || Boolean(asset.clientId && await prisma.client.findFirst({ where: { id: asset.clientId, userId }, select: { id: true } }));
  if (asset.userId === userId) return true;
  return Boolean(asset.clientId && await assertTrainerOwnsClient(userId, asset.clientId));
}

export async function validateClientIdForTrainer(trainerId: string, clientId: string | null): Promise<string | null> {
  if (!clientId) return null;
  return await assertTrainerOwnsClient(trainerId, clientId) ? clientId : null;
}
