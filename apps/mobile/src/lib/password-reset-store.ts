/**
 * Almacén de tokens de recuperación de contraseña — persistente en DB.
 *
 * Historial de la auditoría:
 *  - Antes, `reset-password` IGNORABA el token y restablecía la contraseña
 *    de cualquier cuenta con solo conocer su email (toma de cuenta).
 *  - Luego se agregó un Map en memoria para exigir un token válido, pero
 *    quedaba documentado como "no usar en producción": se perdía en cada
 *    reinicio del server y no funcionaba con más de una instancia corriendo
 *    (cada una tendría su propio Map, inconsistente entre sí).
 *
 * Ahora el token vive en la tabla PasswordReset (ver schema.prisma). Se
 * guarda únicamente el HASH sha256 del token, nunca el token en texto
 * plano, para que una filtración de la base de datos no equivalga a tener
 * las claves de recuperación de todos los usuarios.
 *
 * Pendiente real fuera del alcance de este archivo: el envío del link por
 * email todavía no existe (forgot-password solo lo loguea en desarrollo).
 * Para producción hace falta un proveedor de email (Resend, SendGrid, etc.)
 * con su propia API key configurada — no es algo que se pueda resolver solo
 * editando código, requiere una cuenta de servicio externa.
 */

import { randomUUID, createHash } from "crypto";
import { prisma } from "@/lib/db";

const TTL_MS = 1000 * 60 * 30; // 30 min

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Crea y guarda un token para el email, invalidando tokens previos del mismo email. */
export async function issueResetToken(email: string): Promise<string> {
  // Invalidar tokens previos del mismo email (evita acumular basura y
  // reentradas: si alguien pide "olvidé mi contraseña" varias veces,
  // solo el último link sirve).
  await prisma.passwordReset.updateMany({
    where: { email, used: false },
    data: { used: true },
  });

  const token = randomUUID();
  await prisma.passwordReset.create({
    data: {
      email,
      tokenHash: hashToken(token),
      expires: new Date(Date.now() + TTL_MS),
    },
  });
  return token;
}

/** Valida el token contra el email. Devuelve true si es válido, no usado y no expirado. */
export async function consumeResetToken(token: string, email: string): Promise<boolean> {
  const tokenHash = hashToken(token);
  const entry = await prisma.passwordReset.findUnique({ where: { tokenHash } });
  if (!entry) return false;
  if (entry.used) return false;
  if (entry.email !== email) return false;
  if (Date.now() > entry.expires.getTime()) return false;

  // Marcar como usado atómicamente antes de devolver true (de un solo uso).
  await prisma.passwordReset.update({
    where: { tokenHash },
    data: { used: true },
  });
  return true;
}
