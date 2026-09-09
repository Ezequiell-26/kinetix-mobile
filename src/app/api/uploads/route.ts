import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function POST(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const type = (form.get("type") as string) || "progress";
  if(!file) return NextResponse.json({error:"Falta archivo"},{status:400});
  if(file.size > 5 * 1024 * 1024) return NextResponse.json({error:"Máx 5MB"},{status:400});
  const allowed = ["image/jpeg","image/png","image/webp","image/gif","video/mp4","application/pdf"];
  if(!allowed.includes(file.type) && !file.type.startsWith("image/")) return NextResponse.json({error:"Tipo no permitido"},{status:400});

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${type}-${Date.now()}-${randomUUID().slice(0,6)}.${ext}`;
  const uploadDir = join(process.cwd(), "public", "uploads", type);
  await mkdir(uploadDir, { recursive: true });
  const filepath = join(uploadDir, filename);
  await writeFile(filepath, buffer);
  const url = `/uploads/${type}/${filename}`;

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
