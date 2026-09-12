import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join, extname } from "path";
import { getSession, type JWTPayload } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertTrainerOwnsClient } from "@/lib/authorization";

/**
 * Lectura autenticada de archivos subidos.
 *
 * Antes los archivos vivían en `public/uploads/` y se servían como estáticos:
 * cualquiera con la URL podía leerlos sin sesión (las fotos de progreso
 * marcadas `isPrivate` eran, en la práctica, públicas). Ahora el archivo vive
 * fuera de `public/` y solo se entrega si hay sesión y el usuario tiene
 * derecho sobre ese recurso.
 */

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const s = await getSession();
  if (!s) return new NextResponse("No autorizado", { status: 401 });

  const { path } = await params;
  const type = path[0];
  const filename = path.slice(1).join("/");

  // Validación: tipo conocido y sin traversal.
  if (!type || !filename) return new NextResponse("Solicitud inválida", { status: 400 });
  if (!["progress", "checkin", "message"].includes(type)) {
    return new NextResponse("No encontrado", { status: 404 });
  }
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return new NextResponse("Solicitud inválida", { status: 400 });
  }

  const requestedUrl = `/api/uploads/${type}/${filename}`;
  const allowed = await canAccess(s, type, requestedUrl);
  // 404 (no 403) para no revelar la existencia del archivo.
  if (!allowed) return new NextResponse("No encontrado", { status: 404 });

  try {
    const filepath = join(process.cwd(), "uploads", type, filename);
    const buf = await readFile(filepath);
    const mime = MIME[extname(filename).toLowerCase()] || "application/octet-stream";
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": mime,
        // Contenido privado: nunca cachear en proxies/CDN.
        "Cache-Control": "private, max-age=0, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("No encontrado", { status: 404 });
  }
}

async function canAccess(s: JWTPayload, type: string, url: string): Promise<boolean> {
  // El trainer solo puede acceder a archivos de sus propios clientes
  if (s.role === "TRAINER") {
    // Extraer clientId del archivo y verificar ownership
    if (type === "progress") {
      const photo = await prisma.progressPhoto.findFirst({
        where: { url },
        select: { clientId: true },
      });
      if (!photo) return false;
      if (!photo.clientId) return false;
      return assertTrainerOwnsClient(s.id, photo.clientId);
    }

    if (type === "checkin") {
      const checkin = await prisma.checkIn.findFirst({
        where: { fotos: { contains: url } },
        select: { clientId: true },
      });
      if (!checkin) return false;
      if (!checkin.clientId) return false;
      return assertTrainerOwnsClient(s.id, checkin.clientId);
    }

    if (type === "message") {
      const msg = await prisma.message.findFirst({
        where: { image: url },
        select: { senderId: true, receiverId: true },
      });
      if (!msg) return false;
      return msg.senderId === s.id || msg.receiverId === s.id;
    }

    return false;
  }

  // CLIENT solo puede ver sus propios archivos
  const client = await prisma.client.findFirst({
    where: { OR: [{ userId: s.id }, { email: s.email }] },
    select: { id: true },
  });

  if (!client) return false;

  if (type === "progress") {
    const photo = await prisma.progressPhoto.findFirst({
      where: { url, clientId: client.id },
      select: { id: true },
    });
    return !!photo;
  }

  if (type === "checkin") {
    const checkin = await prisma.checkIn.findFirst({
      where: { fotos: { contains: url }, clientId: client.id },
      select: { id: true },
    });
    return !!checkin;
  }

  if (type === "message") {
    const msg = await prisma.message.findFirst({
      where: { image: url, OR: [{ senderId: s.id }, { receiverId: s.id }] },
      select: { id: true },
    });
    return !!msg;
  }

  return false;
}
