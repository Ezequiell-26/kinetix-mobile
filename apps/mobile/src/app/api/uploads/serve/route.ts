import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { isUploadType } from "@/lib/security";

const MIME_BY_EXT: Record<string,string> = { jpg:"image/jpeg", jpeg:"image/jpeg", png:"image/png", gif:"image/gif", webp:"image/webp", mp4:"video/mp4", pdf:"application/pdf" };

export async function GET(req:Request){
  const session=await getSession(); if(!session) return NextResponse.json({error:"No auth"},{status:401});
  try{
    const {searchParams}=new URL(req.url); const type=searchParams.get("type"); const filename=searchParams.get("filename");
    if(!type||!filename||!isUploadType(type)) return NextResponse.json({error:"Parámetros inválidos"},{status:400});
    if(!/^[a-z]+-\d+-[a-z0-9-]+\.(jpg|jpeg|png|gif|webp|mp4|pdf)$/.test(filename)) return NextResponse.json({error:"Nombre inválido"},{status:400});
    const filePath=join(process.cwd(),"storage","uploads",type,filename);
    if(!existsSync(filePath)) return NextResponse.json({error:"Archivo no encontrado"},{status:404});

    let allowed=false;
    if(type==="progress"){
      const photo=await prisma.progressPhoto.findFirst({where:{url:{contains:filename}},select:{userId:true,clientId:true}});
      if(photo){
        allowed=photo.userId===session.id;
        if(!allowed && photo.clientId) allowed=await prisma.client.findFirst({where:{id:photo.clientId,OR:[{userId:session.id},{trainerId:session.id}]},select:{id:true}}).then(Boolean);
      }
    } else if(type==="checkin"){
      const checkin=await prisma.checkIn.findFirst({where:{fotos:{contains:filename}},select:{userId:true,clientId:true}});
      if(checkin){ allowed=checkin.userId===session.id; if(!allowed&&checkin.clientId) allowed=await prisma.client.findFirst({where:{id:checkin.clientId,OR:[{userId:session.id},{trainerId:session.id}]},select:{id:true}}).then(Boolean); }
    } else if(type==="message"){
      const message=await prisma.message.findFirst({where:{content:{contains:filename},OR:[{senderId:session.id},{receiverId:session.id}]},select:{id:true}}); allowed=Boolean(message);
    }
    if(!allowed) return NextResponse.json({error:"No autorizado"},{status:403});

    const buffer=await readFile(filePath); const ext=filename.split(".").pop()?.toLowerCase()||""; const mime=MIME_BY_EXT[ext]||"application/octet-stream";
    const headers=new Headers({"Content-Type":mime,"Cache-Control":"private, max-age=3600","X-Content-Type-Options":"nosniff","Content-Disposition":mime==="application/pdf"?`inline; filename="${filename}"`:"inline"});
    if(mime.startsWith("image/")) headers.set("Content-Security-Policy","default-src 'none'; img-src 'self' data:;");
    return new NextResponse(buffer,{status:200,headers});
  }catch(error){ console.error("[UPLOAD-SERVE]",error); return NextResponse.json({error:"Error al servir archivo"},{status:500}); }
}
