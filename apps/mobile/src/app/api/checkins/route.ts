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
    // Client can only see own checkins
    const client = await prisma.client.findFirst({where:{OR:[{userId:s.id},{email:s.email}]}});
    const checkins = await prisma.checkIn.findMany({
      where: {
        OR: [
          { userId: s.id },
          ...(client?.id ? [{ clientId: client.id }] : [])
        ]
      },
      orderBy: { date: "desc" },
      take: 50
    });
    return NextResponse.json(checkins);
  }

  // Trainer
  if(clientId){
    // P0 Security: TRAINER solo puede ver checkins de sus propios clientes
    const ownsClient = await assertTrainerOwnsClient(s.id, clientId);
    if(!ownsClient){
      return NextResponse.json({error:"Cliente no encontrado"}, {status:404});
    }
    const checkins = await prisma.checkIn.findMany({
      where: { clientId },
      include: { client: true },
      orderBy: { date: "desc" }
    });
    return NextResponse.json(checkins);
  }

  const checkins = await prisma.checkIn.findMany({
    include: { client: true, user: true },
    orderBy: { date: "desc" },
    take: 50
  });
  return NextResponse.json(checkins);
}

function fin(v: unknown): number | null {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : null;
}

export async function POST(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const body = await req.json().catch(() => null);
  if(!body) return NextResponse.json({error:"Cuerpo requerido"},{status:400});

  // Find client for current user if CLIENT to prevent spoofing
  let clientId: string | null = null;
  if(s.role === "CLIENT"){
    const client = await prisma.client.findFirst({where:{OR:[{userId:s.id},{email:s.email}]}});
    clientId = client?.id || null;
  } else if(body.clientId && s.role === "TRAINER"){
    // P0 Security: TRAINER solo puede crear checkins para sus propios clientes
    const ownsClient = await assertTrainerOwnsClient(s.id, body.clientId);
    if(!ownsClient){
      return NextResponse.json({error:"Cliente no encontrado"}, {status:404});
    }
    clientId = body.clientId;
  }

  const checkin = await prisma.checkIn.create({
    data: {
      userId: s.id,
      clientId: clientId,
      energia: body.energia ? fin(body.energia) : null,
      sueno: body.sueno ? fin(body.sueno) : null,
      estres: body.estres ? fin(body.estres) : null,
      entrenos: body.entrenos ? fin(body.entrenos) : null,
      rendimiento: body.rendimiento ? fin(body.rendimiento) : null,
      molestias: body.molestias || null,
      alimentacion: body.alimentacion || null,
      progreso: body.progreso ? fin(body.progreso) : null,
      comentario: body.comentario || null,
      fotos: body.fotos || null,
      reviewed: false,
    }
  });

  // Notify trainer
  const trainer = await prisma.user.findFirst({where:{role:"TRAINER"}});
  if(trainer){
    await prisma.notification.create({
      data: {
        userId: trainer.id,
        title: `Nuevo check-in: ${s.name}`,
        body: body.comentario?.slice(0,80) || "Check-in semanal recibido",
        type: "checkin",
        link: "/trainer/checkins"
      }
    }).catch(()=>{});
  }

  return NextResponse.json(checkin);
}

export async function PATCH(req: Request){
  const s = await getSession();
  if(!s || s.role !== "TRAINER") return NextResponse.json({error:"Solo trainer"},{status:403});

  try {
    const body = await req.json();
    const { id, trainerReply, reviewed } = body;

    if(!id) return NextResponse.json({error:"ID requerido"},{status:400});

    const updated = await prisma.checkIn.update({
      where: { id },
      data: {
        ...(trainerReply !== undefined ? { trainerReply } : {}),
        ...(reviewed !== undefined ? { reviewed: Boolean(reviewed) } : { reviewed: true })
      },
      include: {
        client: true,
        user: true
      }
    });

    // Notify client about trainer feedback
    const clientUserId = updated.userId || updated.client?.userId;
    if(clientUserId && trainerReply){
      await prisma.notification.create({
        data: {
          userId: clientUserId,
          title: "Ezequiel respondió tu check-in",
          body: trainerReply.slice(0, 80),
          type: "checkin_reply",
          link: "/client/checkins"
        }
      }).catch(()=>{});
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al actualizar check-in";
    return NextResponse.json({error: msg}, {status: 500});
  }
}
