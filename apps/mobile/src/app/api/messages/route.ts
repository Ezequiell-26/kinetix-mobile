import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { assertTrainerOwnsClient } from "@/lib/authorization";

export async function GET(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const url = new URL(req.url);
  const withUserId = url.searchParams.get("with");
  if(s.role==="CLIENT"){
    const trainer = await prisma.user.findFirst({where:{role:"TRAINER"}});
    if(!trainer) return NextResponse.json([]);
    const msgs = await prisma.message.findMany({
      where:{
        OR:[
          {senderId: s.id, receiverId: trainer.id},
          {senderId: trainer.id, receiverId: s.id},
        ]
      },
      orderBy:{createdAt:"asc"},
      take:100
    });
    // Mark trainer messages as read
    await prisma.message.updateMany({where:{receiverId: s.id, read:false}, data:{read:true}});
    return NextResponse.json(msgs);
  }
  // Trainer - if with param, get conversation with that client user
  if(withUserId){
    // P0 Security: TRAINER solo puede ver mensajes con sus propios clientes
    const clientUser = await prisma.client.findFirst({
      where: { userId: withUserId },
      select: { id: true }
    });
    if(clientUser){
      const ownsClient = await assertTrainerOwnsClient(s.id, clientUser.id);
      if(!ownsClient){
        return NextResponse.json({error:"Cliente no encontrado"},{status:404});
      }
    } else if (withUserId !== s.id) {
      // P0 fail-closed: sin fila Client no hay ownership que verificar
      return NextResponse.json({error:"Cliente no encontrado"},{status:404});
    }
    const msgs = await prisma.message.findMany({
      where:{
        OR:[
          {senderId: s.id, receiverId: withUserId},
          {senderId: withUserId, receiverId: s.id},
        ]
      },
      orderBy:{createdAt:"asc"},
      take:100
    });
    await prisma.message.updateMany({where:{receiverId: s.id, senderId: withUserId, read:false}, data:{read:true}});
    return NextResponse.json(msgs);
  }
  // All recent conversations
  const msgs = await prisma.message.findMany({
    where:{ OR:[{senderId: s.id}, {receiverId: s.id}]},
    orderBy:{createdAt:"desc"},
    take:50,
    include:{sender:true, receiver:true}
  });
  return NextResponse.json(msgs);
}

export async function POST(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const body = await req.json().catch(() => null);
  if(!body) return NextResponse.json({error:"Cuerpo requerido"},{status:400});
  const { content } = body;
  let { receiverId, clientId } = body;
  if(!content) return NextResponse.json({error:"Faltan datos"},{status:400});
  // Auto-resolve trainer for CLIENT if no receiverId
  if(s.role==="CLIENT" && !receiverId){
    const trainer = await prisma.user.findFirst({where:{role:"TRAINER"}});
    receiverId = trainer?.id;
  }
  if(!receiverId) return NextResponse.json({error:"Faltan datos"},{status:400});
  // Security: CLIENT can only message their trainer
  if(s.role==="CLIENT"){
    const trainer = await prisma.user.findFirst({where:{role:"TRAINER"}});
    if(receiverId !== trainer?.id) return NextResponse.json({error:"No autorizado"},{status:403});
    const client = await prisma.client.findFirst({where:{OR:[{userId:s.id},{email:s.email}]}});
    clientId = client?.id || null;
  }
  const msg = await prisma.message.create({data:{
    senderId: s.id,
    receiverId,
    clientId: clientId || null,
    content,
    read: false,
  }});
  // Notification for receiver
  await prisma.notification.create({data:{
    userId: receiverId,
    title: `Nuevo mensaje de ${s.name}`,
    body: content.slice(0,80),
    type: "message",
    link: s.role==="TRAINER" ? "/client/messages" : "/trainer/messages"
  }});
  return NextResponse.json(msg);
}
