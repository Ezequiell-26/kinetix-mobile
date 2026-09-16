import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getObject } from "@/lib/storage";
import { isUploadType, validateUploadSignature } from "@/lib/security";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  mp4: "video/mp4",
  pdf: "application/pdf",
};

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No auth" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const filename = searchParams.get("filename");
    if (!type || !filename || !isUploadType(type)) return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    if (!/^[a-z]+-\d+-[a-z0-9-]+\.(jpg|jpeg|png|gif|webp|mp4|pdf)$/.test(filename)) return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });

    const asset = await prisma.privateAsset.findUnique({
      where: { filename },
      select: { userId: true, clientId: true, type: true, contentType: true, sizeBytes: true },
    });
    if (!asset || asset.type !== type) return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });

    let allowed = asset.userId === session.id;
    if (!allowed && asset.clientId) {
      const client = await prisma.client.findUnique({ where: { id: asset.clientId }, select: { userId: true, trainerId: true } });
      allowed = client?.userId === session.id || client?.trainerId === session.id;
    }
    if (!allowed) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const object = await getObject({ type, filename });
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    const mime = asset.contentType || object.contentType || MIME_BY_EXT[ext] || "application/octet-stream";
    if (!(await Promise.resolve(validateUploadSignature(mime, object.body)))) return NextResponse.json({ error: "Archivo inválido" }, { status: 422 });

    const headers = new Headers({
      "Content-Type": mime,
      "Content-Length": String(object.body.byteLength),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": mime === "application/pdf" ? `inline; filename="${filename}"` : "inline",
    });
    if (mime.startsWith("image/")) headers.set("Content-Security-Policy", "default-src 'none'; img-src 'self' data:;");
    return new NextResponse(object.body, { status: 200, headers });
  } catch (error) {
    console.error("[UPLOAD-SERVE]", error);
    return NextResponse.json({ error: "Archivo no encontrado o no disponible" }, { status: 404 });
  }
}
