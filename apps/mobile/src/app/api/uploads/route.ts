/**
 * Upload de archivos con validación de seguridad — handler unificado PR3.
 *
 * Fuente única: @/lib/security (UPLOAD_TYPES, ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS)
 * + @/lib/file-signature (verifyFileSignature magic-bytes estricto, sin wildcard image/*, sin SVG).
 *
 * Hardening PR3:
 * - Rechaza image/svg+xml (no está en ALLOWED_MIME_TYPES) y cualquier image/* fuera de allowlist.
 * - verifyFileSignature estricto: si MIME no tiene firma conocida -> false (no fallback a image/*).
 * - WebP verifica RIFF + WEBP (bytes 0-4 y 8-12).
 * - Directorio canónico `storage/uploads/<type>` (unificado con GET handlers).
 * - Extensión derivada via sanitizeExtension (nunca svg/php/html).
 * - URL canónica `/api/uploads/<type>/<filename>` (legible por ambos GET handlers).
 */
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import {
  UPLOAD_TYPES,
  ALLOWED_MIME_TYPES,
  isUploadType,
  sanitizeExtension,
  buildSafeFilename,
  getUploadDir,
  type UploadType,
} from "@/lib/security";
import { verifyFileSignature } from "@/lib/file-signature";

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "No auth" }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const rawType = (form.get("type") as string) || "progress";

    if (!isUploadType(rawType)) {
      return NextResponse.json({ error: "Tipo no permitido" }, { status: 400 });
    }
    const type: UploadType = rawType;

    if (!file) return NextResponse.json({ error: "Falta archivo" }, { status: 400 });

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Máx 5MB" }, { status: 400 });
    }

    // Strict MIME allowlist: sin wildcard image/* (cierra bypass svg)
    if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
      return NextResponse.json({ error: "Tipo no permitido" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Magic-bytes estricto: verifica firma real del archivo
    if (!verifyFileSignature(buffer, file.type)) {
      console.warn(`[UPLOAD] Magic bytes no coinciden para ${file.type}`);
      return NextResponse.json({ error: "Archivo inválido o corrupto" }, { status: 400 });
    }

    const ext = sanitizeExtension(file.name, file.type);
    // Defensa extra: si sanitizeExtension devolviera algo fuera de allowlist (no debería), rechazar
    // (ALLOWED_EXTENSIONS ya la valida internamente)

    const filename = buildSafeFilename(type, randomUUID(), ext);

    const uploadDir = getUploadDir(type);
    await mkdir(uploadDir, { recursive: true });
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // URL canónica unificada (coincide con [...path] handler y es legible por serve handler via contains)
    const url = `/api/uploads/${type}/${filename}`;

    // Persistencias por tipo
    if (type === "progress") {
      const client = await prisma.client.findFirst({
        where: { OR: [{ userId: s.id }, { email: s.email }] },
      });
      await prisma.progressPhoto.create({
        data: {
          userId: s.id,
          clientId: client?.id || null,
          url,
          note: (form.get("note") as string) || null,
          isPrivate: true,
        },
      });
    }
    if (type === "checkin") {
      // No se crea DB aquí; el caller hace POST /api/checkins con fotos: [url]
      // Se deja stub para futuro ownership check uniforme
    }
    if (type === "message") {
      // Similar: mensaje con imagen se crea en /api/messages
    }
    // avatar: perfil del usuario (no DB aquí, el caller actualiza Profile/User)

    return NextResponse.json({ url, filename, size: file.size, type: file.type });
  } catch (error) {
    console.error("[UPLOAD] Error:", error);
    return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 });
  }
}
