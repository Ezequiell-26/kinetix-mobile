import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { verifyFileSignature } from "@/lib/file-signature";

export async function POST(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const form = await req.formData();
  const file = form.get("file") as File | null;
  // Allowlist de tipo: antes `type` iba directo a join(process.cwd(),"uploads",type)
  // permitiendo path traversal de escritura (type=../..). Ver GET en [...path].
  const TYPE_ALLOW = ["progress", "checkin", "message"];
  const type = (form.get("type") as string) || "progress";
  if(!TYPE_ALLOW.includes(type)) return NextResponse.json({error:"Tipo no permitido"},{status:400});
  if(!file) return NextResponse.json({error:"Falta archivo"},{status:400});
  if(file.size > 5 * 1024 * 1024) return NextResponse.json({error:"Máx 5MB"},{status:400});
  const allowed = ["image/jpeg","image/png","image/webp","image/gif","video/mp4","application/pdf"];
  if(!allowed.includes(file.type) && !file.type.startsWith("image/")) return NextResponse.json({error:"Tipo no permitido"},{status:400});

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Verificación de contenido real (magic bytes): el Content-Type que manda
  // el navegador lo declara el cliente y se puede falsificar. Si el archivo
  // no empieza con la firma binaria real de su tipo declarado, se rechaza
  // acá aunque haya pasado el chequeo de MIME/extensión de arriba.
  if(!verifyFileSignature(buffer, file.type)){
    return NextResponse.json({error:"El archivo no coincide con su tipo declarado"},{status:400});
  }
  // Extensión sanitizada por allowlist: antes salía de file.name sin validar
  // (ej. ".exe" o con caracteres de ruta). Si no matchea, se deriva del MIME.
  const EXT_ALLOW = ["jpg","jpeg","png","webp","gif","mp4","pdf"];
  let ext = (file.name.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,5);
  if(!EXT_ALLOW.includes(ext)){
    ext = file.type === "image/png" ? "png"
      : file.type === "image/webp" ? "webp"
      : file.type === "image/gif" ? "gif"
      : file.type === "video/mp4" ? "mp4"
      : file.type === "application/pdf" ? "pdf" : "jpg";
  }
  const filename = `${type}-${Date.now()}-${randomUUID().slice(0,6)}.${ext}`;
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
