import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Serve archivos subidos con validación de ownership.
 * 
 * Seguridad:
 * - Requiere autenticación
 * - Verifica ownership del archivo
 * - Path fijo sin interpolación peligrosa
 * - Headers seguros (no ejecución)
 */
export async function GET(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "No auth" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const filename = searchParams.get("filename");

    if (!type || !filename) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    // Validar tipo contra whitelist
    const allowedTypes = ["progress", "avatar", "document"];
    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
    }

    // Sanitizar filename (solo alphanumeric, guiones, puntos)
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "");
    if (!sanitizedFilename || sanitizedFilename !== filename) {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }

    // Construir path seguro
    const uploadDir = join(process.cwd(), "storage", "uploads", type);
    const filepath = join(uploadDir, sanitizedFilename);

    // Verificar que el archivo existe
    if (!existsSync(filepath)) {
      return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
    }

    // Verificar ownership en DB para fotos de progreso
    if (type === "progress") {
      const photo = await prisma.progressPhoto.findFirst({
        where: { url: { contains: filename } },
      });

      if (!photo) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }

      // Verificar que el usuario es dueño o tiene acceso
      const isOwner = photo.userId === s.id;
      const isClientOwner = photo.clientId && await prisma.client.findFirst({
        where: { id: photo.clientId, userId: s.id },
      });

      // Los trainers pueden ver fotos de sus clientes
      const isTrainerWithAccess = s.role === "TRAINER" && await prisma.client.findFirst({
        where: { id: photo.clientId },
      });

      if (!isOwner && !isClientOwner && !isTrainerWithAccess) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }
    }

    // Leer archivo
    const buffer = await readFile(filepath);

    // Determinar MIME type por extensión
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

    // Headers seguros
    const headers = new Headers();
    headers.set("Content-Type", mimeType);
    headers.set("Cache-Control", "private, max-age=3600");
    headers.set("X-Content-Type-Options", "nosniff");
    
    // Prevenir ejecución de scripts en imágenes
    if (mimeType.startsWith("image/")) {
      headers.set("Content-Security-Policy", "default-src 'none'");
    }

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("[UPLOAD-SERVE] Error:", error);
    return NextResponse.json({ error: "Error al servir archivo" }, { status: 500 });
  }
}
