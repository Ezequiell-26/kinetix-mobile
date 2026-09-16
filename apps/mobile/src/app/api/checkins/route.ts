import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { assertTrainerOwnsClient } from "@/lib/authorization";

export async function GET(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId");

  if(s.role==="CLIENT"){
    const client = await prisma.client.findFirst({where:{OR:[{userId:s.id},{email:s.email}]} });
    const checkins = await prisma.checkIn.findMany({
      where:{ OR:[{userId:s.id}, ...(client?.id ? [{clientId:client.id}] : [])] },
      orderBy:{date:"desc"}, take:50
    });
    return NextResponse.json(checkins);
  }

  if(clientId){
    if(!(await assertTrainerOwnsClient(s.id,clientId))) return NextResponse.json({error:"Cliente no encontrado"},{status:404});
    const checkins=await prisma.checkIn.findMany({where:{clientId},include:{client:true},orderBy:{date:"desc"}});
    return NextResponse.json(checkins);
  }

  const checkins=await prisma.checkIn.findMany({where:{client:{trainerId:s.id}},include:{client:true,user:true},orderBy:{date:"desc"},take:50});
  return NextResponse.json(checkins);
}

function fin(v:unknown):number|null{const n=typeof v==="number"?v:parseFloat(String(v??""));return Number.isFinite(n)?n:null;}

export async function POST(req:Request){
  const s=await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const body=await req.json().catch(()=>null);
  if(!body) return NextResponse.json({error:"Cuerpo requerido"},{status:400});
  let clientId:string|null=null;
  if(s.role==="CLIENT"){
    const client=await prisma.client.findFirst({where:{OR:[{userId:s.id},{email:s.email}]},select:{id:true}});
    clientId=client?.id||null;
  }else if(body.clientId&&s.role==="TRAINER"){
    if(!(await assertTrainerOwnsClient(s.id,body.clientId))) return NextResponse.json({error:"Cliente no encontrado"},{status:404});
    clientId=body.clientId;
  }

  const checkin=await prisma.checkIn.create({data:{userId:s.id,clientId,energia:body.energia?fin(body.energia):null,sueno:body.sueno?fin(body.sueno):null,estres:body.estres?fin(body.estres):null,entrenos:body.entrenos?fin(body.entrenos):null,rendimiento:body.rendimiento?fin(body.rendimiento):null,molestias:body.molestias||null,alimentacion:body.alimentacion||null,progreso:body.progreso?fin(body.progreso):null,comentario:body.comentario||null,fotos:body.fotos||null,reviewed:false}});

  if(clientId){
    const owner=await prisma.client.findUnique({where:{id:clientId},select:{trainerId:true}});
    if(owner?.trainerId){
      await prisma.notification.create({data:{userId:owner.trainerId,title:`Nuevo check-in: ${s.name}`,body:body.comentario?.slice(0,80)||"Check-in semanal recibido",type:"checkin",link:"/trainer/checkins"}}).catch(()=>{});
    }
  }
  return NextResponse.json(checkin);
}

export async function PATCH(req:Request){
  const s=await getSession();
  if(!s||s.role!=="TRAINER") return NextResponse.json({error:"Solo trainer"},{status:403});
  try{
    const body=await req.json();
    const {id,trainerReply,reviewed}=body;
    if(!id) return NextResponse.json({error:"ID requerido"},{status:400});
    const existing=await prisma.checkIn.findUnique({where:{id},select:{clientId:true,userId:true}});
    if(!existing) return NextResponse.json({error:"No encontrado"},{status:404});
    if(existing.clientId){
      if(!(await assertTrainerOwnsClient(s.id,existing.clientId))) return NextResponse.json({error:"No encontrado"},{status:404});
    }else if(existing.userId!==s.id){
      return NextResponse.json({error:"No encontrado"},{status:404});
    }
    const updated=await prisma.checkIn.update({where:{id},data:{...(trainerReply!==undefined?{trainerReply}:{}),...(reviewed!==undefined?{reviewed:Boolean(reviewed)}:{reviewed:true})},include:{client:true,user:true}});
    const clientUserId=updated.client?.userId|| (updated.clientId? (await prisma.client.findUnique({where:{id:updated.clientId},select:{userId:true}}))?.userId : null) || null;
    if(clientUserId&&trainerReply){
      await prisma.notification.create({data:{userId:clientUserId,title:"Tu coach respondió tu check-in",body:String(trainerReply).slice(0,80),type:"checkin_reply",link:"/client/checkins"}}).catch(()=>{});
    }
    return NextResponse.json(updated);
  }catch(error:unknown){
    console.error("[checkins PATCH] failed", error);
    return NextResponse.json({error:"No se pudo actualizar el check-in"},{status:500});
  }
}
