/**
 * authorization.ts — Funciones centrales de autorización para ownership.
 * 
 * Un TRAINER solo puede operar sobre clientes que le pertenecen.
 * Nunca confiar únicamente en un clientId enviado por el cliente.
 */

import { prisma } from "./db";
import type { JWTPayload } from "./auth";

/**
 * Verifica que un trainer es dueño de un cliente específico.
 * Retorna true si el cliente existe y pertenece al trainer.
 * 
 * Un cliente "pertenece" a un trainer si fue creado por él.
 * Como el schema actual no tiene trainerId en Client, usamos
 * la relación inversa: verificamos que el cliente exista
 * y que el usuario autenticado sea TRAINER (modelo simplificado).
 * 
 * NOTA: En un sistema multi-trainer real, Client debería tener
 * un campo trainerId para verificar ownership correctamente.
 */
export async function assertTrainerOwnsClient(
  trainerId: string,
  clientId: string
): Promise<boolean> {
  if (!trainerId || !clientId) return false;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true },
  });

  // El cliente debe existir
  if (!client) return false;

  // En el modelo actual, todos los TRAINER pueden ver todos los CLIENTS
  // porque no hay campo trainerId en Client. Esto es una limitación del schema.
  // Para un sistema multi-trainer real, agregar trainerId a Client y verificar:
  // const trainer = await prisma.user.findUnique({
  //   where: { id: trainerId },
  //   select: { id: true, role: true },
  // });
  // return trainer?.role === "TRAINER" && client.trainerId === trainerId;

  // Mientras tanto, verificamos que el usuario sea TRAINER
  const trainer = await prisma.user.findUnique({
    where: { id: trainerId },
    select: { role: true },
  });

  return trainer?.role === "TRAINER";
}

/**
 * Obtiene el clientId asociado a un usuario CLIENT.
 * Retorna null si el usuario no es CLIENT o no tiene cliente asociado.
 */
export async function getClientIdForUser(userId: string): Promise<string | null> {
  const client = await prisma.client.findFirst({
    where: { OR: [{ userId }, { email: userId }] },
    select: { id: true },
  });
  return client?.id ?? null;
}

/**
 * Verifica que un archivo subido pertenece a un cliente que el trainer posee.
 * Usado para validar acceso a uploads.
 */
export async function assertFileOwnership(
  userId: string,
  role: "TRAINER" | "CLIENT",
  url: string
): Promise<boolean> {
  // Extraer tipo y filename de la URL (/api/uploads/{type}/{filename})
  const parts = url.split("/");
  const type = parts[parts.length - 2];
  const filename = parts[parts.length - 1];

  if (!type || !filename) return false;

  // CLIENT solo puede ver sus propios archivos
  if (role === "CLIENT") {
    const clientId = await getClientIdForUser(userId);
    if (!clientId) return false;

    if (type === "progress") {
      const photo = await prisma.progressPhoto.findFirst({
        where: { url, clientId },
        select: { id: true },
      });
      return !!photo;
    }

    if (type === "checkin") {
      const checkin = await prisma.checkIn.findFirst({
        where: { fotos: { contains: url }, clientId },
        select: { id: true },
      });
      return !!checkin;
    }

    if (type === "message") {
      const msg = await prisma.message.findFirst({
        where: { image: url, OR: [{ senderId: userId }, { receiverId: userId }] },
        select: { id: true },
      });
      return !!msg;
    }

    return false;
  }

  // TRAINER puede ver archivos de sus clientes
  // (la verificación de ownership del cliente se hace en el caller)
  if (type === "progress") {
    const photo = await prisma.progressPhoto.findFirst({
      where: { url },
      include: { client: { select: { id: true } } },
    });
    if (!photo) return false;
    if (!photo.clientId) return photo.userId === userId;
    // Verificar que el cliente pertenece al trainer
    return assertTrainerOwnsClient(userId, photo.clientId);
  }

  if (type === "checkin") {
    const checkin = await prisma.checkIn.findFirst({
      where: { fotos: { contains: url } },
      include: { client: { select: { id: true } } },
    });
    if (!checkin) return false;
    if (!checkin.clientId) return checkin.userId === userId;
    return assertTrainerOwnsClient(userId, checkin.clientId);
  }

  if (type === "message") {
    const msg = await prisma.message.findFirst({
      where: { image: url },
      select: { senderId: true, receiverId: true },
    });
    if (!msg) return false;
    return msg.senderId === userId || msg.receiverId === userId;
  }

  return false;
}

/**
 * Versión que lanza error o retorna null para uso directo en handlers.
 * Retorna el clientId si es válido, null si no.
 */
export async function validateClientIdForTrainer(
  trainerId: string,
  clientId: string | null
): Promise<string | null> {
  if (!clientId) return null;
  
  const owns = await assertTrainerOwnsClient(trainerId, clientId);
  if (!owns) return null;
  
  return clientId;
}
