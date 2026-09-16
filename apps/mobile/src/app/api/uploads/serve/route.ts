import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getObject } from "@/lib/storage";
import { isUploadType, validateUploadSignature } from "@/lib/security";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp", mp4: "video/mp4", pdf: "application/pdf",
};

const FILENAME_RE = /^[a-z]+-\d+-[a-z0-9-]+\.(jpg|jpeg|png|gif|webp|mp4|pdf)$/;

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No auth" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const filename = searchParams.get("filename");
    if (!type || !filename || !isUploadType(type)) return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    if (!FILENAME_RE.test(filename)) return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });

    let allowed = false;
    if (type === "progress") {
      const photo = await prisma.progressPhoto.findFirst({ where: { url: { contains: filename } }, select: { userId: true, clientId: true } });
      if (photo) {
        allowed = photo.userId === session.id;
        if (!allowed && photo.clientId) allowed = Boolean(await prisma.client.findFirst({ where: { id: photo.clientId, OR: [{ userId: session.id }, { trainerId: session.id }] }, select: { id: true } }));
      }
    } else if (type === "checkin") {
      const checkin = await prisma.checkIn.findFirst({ where: { fotos: { contains: filename } }, select: { userId: true, clientId: true } });
      if (checkin) {
        allowed = checkin.userId === session.id;
        if (!allowed && checkin.clientId) allowed = Boolean(await prisma.client.findFirst({ where: { id: checkin.clientId, OR: [{ userId: session.id }, { trainerId: session.id }] }, select: { id: true } }));
      }
    } else if (type === "message") {
      const message = await prisma.message.findFirst({ where: { image: { contains: filename }, OR: [{ senderId: session.id }, { receiverId: session.id }] }, select: { id: true } });
      allowed = Boolean(message);
    }
    if (!allowed) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const object = await getObject({ type, filename });
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    const mime = object.contentType || MIME_BY_EXT[ext] || "application/octet-stream";
    if (!validateUploadSignature(mime, object.body)) return NextResponse.json({ error: "Archivo inválido" }, { status: 422 });

    const headers = new Headers({
      "Content-Type": mime,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": mime === "application/pdf" ? `attachment; filename="${filename}"` : "inline",
    });
    if (mime.startsWith("image/")) headers.set("Content-Security-Policy", "default-src 'none'; img-src 'self' data:;");
    if (mime === "application/pdf") headers.set("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; sandbox;");
    return new NextResponse(object.body, { status: 200, headers });
  } catch (error) {
    console.error("[UPLOAD-SERVE]", error);
    return NextResponse.json({ error: "Archivo no encontrado o no disponible" }, { status: 404 });
  }
}
