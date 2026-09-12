import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { assertTrainerOwnsClient, resolveTrainerIdForClient } from "@/lib/authorization";

export async function GET(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const url = new URL(req.url);
  const withUserId = url.searchParams.get("with");
  if(s.role==="CLIENT"){
    // El cliente conversa con SU trainer (Client.trainerId), no con el primer
    // trainer de la base — con varios entrenadores eso cruzaba conversaciones.
    const client = await prisma.client.findFirst({
      where:{OR:[{userId:s.id},{email:s.email}]},
      select:{id:true}
    });
    const trainerId = await resolveTrainerIdForClient(client?.id);
    if(!trainerId) return NextResponse.json([]);
    const msgs = await prisma.message.findMany({
      where:{
        OR:[
          {senderId: s.id, receiverId: trainerId},
          {senderId: trainerId, receiverId: s.id},
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
        return NextResponse.json({error:"Cliente no encontrado"}, {status:404});
      }
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
    // P0 Security: `include: {sender: true}` serializaba TODOS los campos del
    // User, incluido el hash de password. Se usa un select explícito.
    include:{
      sender:{select:{id:true,name:true,email:true,avatar:true,role:true}},
      receiver:{select:{id:true,name:true,email:true,avatar:true,role:true}}
    }
  });
  return NextResponse.json(msgs);
}

export async function POST(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const body = await req.json().catch(() => null);
  if(!body) return NextResponse.json({error:"Cuerpo requerido"},{status:400});
  let { receiverId, content, clientId } = body;

  // Validación: el contenido iba a Prisma sin límite (payload arbitrario en
  // la DB y en la notificación).
  if(typeof content !== "string" || content.trim().length === 0){
    return NextResponse.json({error:"Faltan datos"},{status:400});
  }
  if(content.length > 4000){
    return NextResponse.json({error:"El mensaje es demasiado largo (máx 4000)"},{status:400});
  }

  if(s.role==="CLIENT"){
    const client = await prisma.client.findFirst({
      where:{OR:[{userId:s.id},{email:s.email}]},
      select:{id:true}
    });
    // El cliente solo puede escribir a SU trainer, no al primer trainer de la
    // base ni a cualquier userId arbitrario.
    const trainerId = await resolveTrainerIdForClient(client?.id);
    if(!trainerId) return NextResponse.json({error:"No autorizado"},{status:403});
    if(receiverId && receiverId !== trainerId){
      return NextResponse.json({error:"No autorizado"},{status:403});
    }
    receiverId = trainerId;
    clientId = client?.id || null;
  } else if(s.role === "TRAINER"){
    // El trainer solo puede escribir a sus propios clientes.
    if(!receiverId) return NextResponse.json({error:"Faltan datos"},{status:400});
    const targetClient = await prisma.client.findFirst({
      where:{userId: receiverId},
      select:{id:true}
    });
    if(targetClient){
      const owns = await assertTrainerOwnsClient(s.id, targetClient.id);
      if(!owns) return NextResponse.json({error:"No autorizado"},{status:403});
      clientId = targetClient.id;
    }
  }

  if(!receiverId) return NextResponse.json({error:"Faltan datos"},{status:400});
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
