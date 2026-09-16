import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join, extname, resolve } from "path";
import { getSession, type JWTPayload } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertTrainerOwnsClient } from "@/lib/authorization";
import { isUploadType, getUploadDir } from "@/lib/security";

/**
 * Lectura autenticada de archivos subidos — handler unificado PR3.
 * Directorio canónico storage/uploads (igual que POST y serve).
 * Tipos estrictos via @/lib/security (sin svg, sin document/genérico).
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
  const typeRaw = path[0];
  const filename = path.slice(1).join("/");

  if (!typeRaw || !filename) return new NextResponse("Solicitud inválida", { status: 400 });
  if (!isUploadType(typeRaw)) return new NextResponse("No encontrado", { status: 404 });
  const type = typeRaw;
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return new NextResponse("Solicitud inválida", { status: 400 });
  }
  if (filename.replace(/[^a-zA-Z0-9._-]/g, "") !== filename) {
    return new NextResponse("Solicitud inválida", { status: 400 });
  }

  const requestedUrl = `/api/uploads/${type}/${filename}`;
  const allowed = await canAccess(s, type, requestedUrl);
  if (!allowed) return new NextResponse("No encontrado", { status: 404 });

  try {
    const uploadDir = getUploadDir(type);
    const baseResolved = resolve(uploadDir);
    const filepath = resolve(join(uploadDir, filename));
    if (!filepath.startsWith(baseResolved + "/") && filepath !== baseResolved) {
      return new NextResponse("Solicitud inválida", { status: 400 });
    }
    const buf = await readFile(filepath);
    const mime = MIME[extname(filename).toLowerCase()] || "application/octet-stream";
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "private, max-age=0, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("No encontrado", { status: 404 });
  }
}

async function canAccess(s: JWTPayload, type: string, url: string): Promise<boolean> {
  const filename = url.split("/").pop() || "";
  if (s.role === "TRAINER") {
    if (type === "progress") {
      const photo = await prisma.progressPhoto.findFirst({
        where: { OR: [{ url }, { url: { contains: filename } }] },
        select: { clientId: true },
      });
      if (!photo) return false;
      if (!photo.clientId) return false;
      return assertTrainerOwnsClient(s.id, photo.clientId);
    }
    if (type === "checkin") {
      const checkin = await prisma.checkIn.findFirst({
        where: { OR: [{ fotos: { contains: url } }, { fotos: { contains: filename } }] },
        select: { clientId: true },
      });
      if (!checkin) return false;
      if (!checkin.clientId) return false;
      return assertTrainerOwnsClient(s.id, checkin.clientId);
    }
    if (type === "message") {
      const msg = await prisma.message.findFirst({
        where: { OR: [{ image: url }, { image: { contains: filename } }] },
        select: { senderId: true, receiverId: true },
      });
      if (!msg) return false;
      return msg.senderId === s.id || msg.receiverId === s.id;
    }
    if (type === "avatar") return true;
    return false;
  }

  const client = await prisma.client.findFirst({
    where: { OR: [{ userId: s.id }, { email: s.email }] },
    select: { id: true },
  });

  if (!client) {
    if (type === "message") {
      const msg = await prisma.message.findFirst({
        where: {
          image: { contains: filename },
          OR: [{ senderId: s.id }, { receiverId: s.id }],
        },
        select: { id: true },
      });
      return !!msg;
    }
    if (type === "avatar") return true;
    return false;
  }

  if (type === "progress") {
    const p1 = await prisma.progressPhoto.findFirst({
      where: { url, clientId: client.id },
      select: { id: true },
    });
    if (p1) return true;
    const p2 = await prisma.progressPhoto.findFirst({
      where: { url: { contains: filename }, clientId: client.id },
      select: { id: true },
    });
    return !!p2;
  }
  if (type === "checkin") {
    const c1 = await prisma.checkIn.findFirst({
      where: { fotos: { contains: url }, clientId: client.id },
      select: { id: true },
    });
    if (c1) return true;
    const c2 = await prisma.checkIn.findFirst({
      where: { fotos: { contains: filename }, clientId: client.id },
      select: { id: true },
    });
    return !!c2;
  }
  if (type === "message") {
    const m = await prisma.message.findFirst({
      where: { image: { contains: filename }, OR: [{ senderId: s.id }, { receiverId: s.id }] },
      select: { id: true },
    });
    return !!m;
  }
  if (type === "avatar") return true;
  return false;
}
