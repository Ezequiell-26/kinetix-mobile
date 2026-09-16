import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { existsSync } from "fs";
import { UPLOAD_TYPES, isUploadType, getUploadDir } from "@/lib/security";

/**
 * Serve archivos subidos — handler unificado PR3.
 * Usa fuente única UPLOAD_TYPES + directorio canónico storage/uploads.
 * Soporta URL canónica `/api/uploads/<type>/<filename>` generada por POST
 * y también query `?type=&filename=` para compatibilidad.
 *
 * Seguridad: auth + ownership (progress), path resuelto y prefijo check,
 * MIME allowlist sin svg, headers nosniff.
 */
export async function GET(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "No auth" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const typeRaw = searchParams.get("type");
    const filenameRaw = searchParams.get("filename");

    if (!typeRaw || !filenameRaw) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    if (!isUploadType(typeRaw)) {
      return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
    }
    const type = typeRaw;

    // Sanitizar filename (solo alfanumérico, guiones, puntos); sin path
    const sanitizedFilename = filenameRaw.replace(/[^a-zA-Z0-9._-]/g, "");
    if (!sanitizedFilename || sanitizedFilename !== filenameRaw) {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }
    if (sanitizedFilename.includes("..") || sanitizedFilename.includes("/") || sanitizedFilename.includes("\\")) {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }

    // Construir path seguro con prefijo check (unificado storage/uploads)
    const uploadDir = getUploadDir(type);
    const baseResolved = resolve(uploadDir);
    const filepath = resolve(join(uploadDir, sanitizedFilename));
    if (!filepath.startsWith(baseResolved + "/") && filepath !== baseResolved) {
      return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
    }

    if (!existsSync(filepath)) {
      return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
    }

    // Ownership para fotos de progreso (y futuros tipos)
    if (type === "progress") {
      const expectedUrl = `/api/uploads/${type}/${sanitizedFilename}`;
      // Compat: buscar por URL exacta canónica o por contains (legado serve URL)
      const photo = await prisma.progressPhoto.findFirst({
        where: { OR: [{ url: expectedUrl }, { url: { contains: sanitizedFilename } }] },
      });
      if (!photo) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      const isOwner = photo.userId === s.id;
      const isClientOwner = photo.clientId
        ? Boolean(await prisma.client.findFirst({ where: { id: photo.clientId, userId: s.id } }))
        : false;
      const isTrainerWithAccess =
        s.role === "TRAINER" && photo.clientId
          ? Boolean(await prisma.client.findFirst({ where: { id: photo.clientId, trainerId: s.id } }))
          : false;
      if (!isOwner && !isClientOwner && !isTrainerWithAccess) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }
    }

    const buffer = await readFile(filepath);

    const ext = sanitizedFilename.split(".").pop()?.toLowerCase() || "";
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      mp4: "video/mp4",
      pdf: "application/pdf",
    };
    const mimeType = mimeTypes[ext] || "application/octet-stream";

    const headers = new Headers();
    headers.set("Content-Type", mimeType);
    headers.set("Cache-Control", "private, max-age=3600");
    headers.set("X-Content-Type-Options", "nosniff");
    if (mimeType.startsWith("image/")) {
      headers.set("Content-Security-Policy", "default-src 'none'");
    }

    return new NextResponse(buffer, { status: 200, headers });
  } catch (error) {
    console.error("[UPLOAD-SERVE] Error:", error);
    return NextResponse.json({ error: "Error al servir archivo" }, { status: 500 });
  }
}
