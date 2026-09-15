import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { randomUUID } from "crypto";
import { ALLOWED_MIME_TYPES, sanitizeExtension, buildSafeFilename, isUploadType, validateUploadSignature, type UploadType } from "@/lib/security";
import { putObject } from "@/lib/storage";

const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(req: Request){
  const session = await getSession();
  if(!session) return NextResponse.json({error:"No auth"},{status:401});

  try{
    const form = await req.formData();
    const fileValue = form.get("file");
    const file = fileValue instanceof File ? fileValue : null;
    const rawType = typeof form.get("type")==="string" ? String(form.get("type")) : "";
    if(!file) return NextResponse.json({error:"Falta archivo"},{status:400});
    if(!isUploadType(rawType)) return NextResponse.json({error:"Tipo no permitido"},{status:400});
    if(file.size<=0 || file.size>MAX_SIZE) return NextResponse.json({error:"El archivo debe pesar entre 1 byte y 5MB"},{status:400});
    if(!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) return NextResponse.json({error:"Tipo MIME no permitido"},{status:400});

    const buffer=Buffer.from(await file.arrayBuffer());
    if(!validateUploadSignature(file.type,buffer)) return NextResponse.json({error:"Archivo inválido o corrupto"},{status:400});
    const ext=sanitizeExtension(file.name,file.type);
    const filename=buildSafeFilename(rawType as UploadType,randomUUID(),ext);
    await putObject({type:rawType,filename,body:buffer,contentType:file.type});
    const url=`/api/uploads/serve?type=${encodeURIComponent(rawType)}&filename=${encodeURIComponent(filename)}`;

    if(rawType==="progress"){
      const client=await prisma.client.findFirst({where:{OR:[{userId:session.id},{email:session.email}]},select:{id:true}});
      if(!client&&session.role==="CLIENT") return NextResponse.json({error:"Perfil de cliente no encontrado"},{status:404});
      await prisma.progressPhoto.create({data:{userId:session.id,clientId:client?.id||null,url,note:typeof form.get("note")==="string"?String(form.get("note")).slice(0,500):null,isPrivate:true}});
    }
    return NextResponse.json({url,filename,size:file.size,type:file.type},{status:201});
  }catch(error){
    console.error("[UPLOAD]",error);
    const message=error instanceof Error ? error.message : "Error al subir archivo";
    return NextResponse.json({error:message.includes("Persistent object storage")?"El almacenamiento de archivos no está configurado en producción.":"Error al subir archivo"},{status:500});
  }
}
