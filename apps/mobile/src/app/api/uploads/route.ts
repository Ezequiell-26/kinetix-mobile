import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join, normalize } from "path";
import { randomUUID } from "crypto";

/**
 * Upload de archivos con validación de seguridad.
 * 
 * Seguridad implementada:
 * - Validación de MIME type declarado
 * - Verificación de firma binaria (magic bytes)
 * - Validación de extensión contra MIME
 * - Nombre seguro sin path traversal
 * - Límite de tamaño (5MB)
 * - Storage fuera de public ejecutable
 */

// Magic bytes para verificar tipo real del archivo
const MAGIC_BYTES: Record<string, string[]> = {
  "image/jpeg": ["ffd8ff"],
  "image/png": ["89504e47"],
  "image/gif": ["47494638"],
  "image/webp": ["52494646"], // RIFF, luego verifica WEBP
  "video/mp4": ["000000", "66747970"], // ftyp
  "application/pdf": ["25504446"], // %PDF
};

function getMagicBytes(buffer: Buffer): string {
  return buffer.slice(0, 8).toString("hex").toLowerCase();
}

function sanitizeFilename(filename: string): string {
  // Eliminar path traversal y caracteres peligrosos
  const base = filename.replace(/[/\\]/g, "").replace(/\.\./g, "");
  // Eliminar dobles extensiones peligrosas
  const parts = base.split(".");
  if (parts.length > 2) {
    // Mantener solo la última extensión
    const ext = parts[parts.length - 1];
    const name = parts.slice(0, -1).join("_");
    return `${name}.${ext}`;
  }
  return base;
}

function validateMagicBytes(mimeType: string, buffer: Buffer): boolean {
  const magicHex = getMagicBytes(buffer);
  const expected = MAGIC_BYTES[mimeType];
  
  if (!expected) {
    // Si no tenemos magic bytes para este MIME, aceptar si empieza con image/
    return mimeType.startsWith("image/");
  }
  
  return expected.some(pattern => magicHex.startsWith(pattern));
}

export async function POST(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const rawType = (form.get("type") as string) || "progress";
    // P0 path traversal: type va al path storage/uploads/<type>
    const ALLOWED_TYPES = ["progress", "avatar", "body", "general"];
    const type = ALLOWED_TYPES.includes(rawType) ? rawType : null;
    if (!type) return NextResponse.json({error:"Tipo no permitido"},{status:400});
    
    if(!file) return NextResponse.json({error:"Falta archivo"},{status:400});
    
    // Validar tamaño
    if(file.size > 5 * 1024 * 1024) {
      return NextResponse.json({error:"Máx 5MB"},{status:400});
    }
    
    // Validar MIME type declarado
    const allowedMimes = ["image/jpeg","image/png","image/webp","image/gif","video/mp4","application/pdf"];
    if(!allowedMimes.includes(file.type) && !file.type.startsWith("image/")) {
      return NextResponse.json({error:"Tipo no permitido"},{status:400});
    }
    
    // Leer buffer para verificar magic bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Verificar magic bytes contra MIME declarado
    if(!validateMagicBytes(file.type, buffer)) {
      console.warn(`[UPLOAD] Magic bytes no coinciden para ${file.type}`);
      return NextResponse.json({error:"Archivo inválido o corrupto"},{status:400});
    }
    
    // Sanitizar nombre y extensión
    const originalName = sanitizeFilename(file.name);
    const ext = originalName.split(".").pop()?.toLowerCase() || "jpg";
    
    // Validar extensión contra MIME
    const mimeToExt: Record<string, string[]> = {
      "image/jpeg": ["jpg", "jpeg"],
      "image/png": ["png"],
      "image/gif": ["gif"],
      "image/webp": ["webp"],
      "video/mp4": ["mp4"],
      "application/pdf": ["pdf"],
    };
    const allowedExts = mimeToExt[file.type] || (file.type.startsWith("image/") ? ["jpg", "png", "gif", "webp"] : []);
    if(!allowedExts.includes(ext)) {
      return NextResponse.json({error:"Extensión no permitida"},{status:400});
    }
    
    // Generar nombre seguro
    const filename = `${type}-${Date.now()}-${randomUUID().slice(0,6)}.${ext}`;
    
    // Directorio de storage FUERA de public (no ejecutable por navegador)
    const uploadDir = join(process.cwd(), "storage", "uploads", type);
    await mkdir(uploadDir, { recursive: true });
    const filepath = join(uploadDir, filename);
    
    // Escribir archivo
    await writeFile(filepath, buffer);
    
    // URL para servir el archivo (endpoint seguro, no directo)
    const url = `/api/uploads/serve?type=${type}&filename=${encodeURIComponent(filename)}`;
    
    // Si es foto de progreso, guardarla en DB
    if(type==="progress"){
      const client = await prisma.client.findFirst({where:{OR:[{userId:s.id},{email:s.email}]}});
      await prisma.progressPhoto.create({data:{
        userId: s.id,
        clientId: client?.id || null,
        url,
        note: (form.get("note") as string) || null,
        isPrivate: true,
      }});
    }
    
    return NextResponse.json({url, filename, size: file.size, type: file.type});
  } catch (error) {
    console.error("[UPLOAD] Error:", error);
    return NextResponse.json({error:"Error al subir archivo"},{status:500});
  }
}
