import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { verifyFileSignature } from "@/lib/file-signature";
import {
  isUploadType,
  sanitizeExtension,
  buildSafeFilename,
  ALLOWED_MIME_TYPES,
} from "@/lib/security";

export async function POST(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const form = await req.formData();
  const file = form.get("file") as File | null;
  // Fuente única: @/lib/security (mismo módulo que testean los tests E2E).
  // `type` iba directo a join(process.cwd(),"uploads",type) permitiendo
  // path traversal de escritura (type=../..). Ver GET en [...path].
  const rawType = (form.get("type") as string) || "progress";
  if(!isUploadType(rawType)) return NextResponse.json({error:"Tipo no permitido"},{status:400});
  const type = rawType;
  if(!file) return NextResponse.json({error:"Falta archivo"},{status:400});
  if(file.size > 5 * 1024 * 1024) return NextResponse.json({error:"Máx 5MB"},{status:400});
  if(!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type) && !file.type.startsWith("image/")) return NextResponse.json({error:"Tipo no permitido"},{status:400});

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Verificación de contenido real (magic bytes): el Content-Type que manda
  // el navegador lo declara el cliente y se puede falsificar. Si el archivo
  // no empieza con la firma binaria real de su tipo declarado, se rechaza
  // acá aunque haya pasado el chequeo de MIME/extensión de arriba.
  if(!verifyFileSignature(buffer, file.type)){
    return NextResponse.json({error:"El archivo no coincide con su tipo declarado"},{status:400});
  }
  // Extensión y nombre desde @/lib/security (allowlist, sin ejecutables).
  const ext = sanitizeExtension(file.name, file.type);
  const filename = buildSafeFilename(type, randomUUID().slice(0,6), ext);
  // Fuera de public/: el archivo NO se sirve estático. Se entrega solo por
  // /api/uploads/[...path], que exige sesión y verifica la propiedad.
  const uploadDir = join(process.cwd(), "uploads", type);
  await mkdir(uploadDir, { recursive: true });
  const filepath = join(uploadDir, filename);
  await writeFile(filepath, buffer);
  const url = `/api/uploads/${type}/${filename}`;

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
}
