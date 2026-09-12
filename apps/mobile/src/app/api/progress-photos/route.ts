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
    const client = await prisma.client.findFirst({where:{OR:[{userId:s.id},{email:s.email}]}});
    if(!client) return NextResponse.json([]);
    const photos = await prisma.progressPhoto.findMany({
      where:{
        OR: [
          { clientId: client.id },
          { userId: s.id }
        ]
      },
      orderBy:{date:"desc"},
      take:50
    });
    return NextResponse.json(photos);
  }

  // Trainer
  if(clientId){
    // P0 Security: TRAINER solo puede ver fotos de sus propios clientes
    const ownsClient = await assertTrainerOwnsClient(s.id, clientId);
    if(!ownsClient){
      return NextResponse.json({error:"Cliente no encontrado"}, {status:404});
    }
    const photos = await prisma.progressPhoto.findMany({where:{clientId}, orderBy:{date:"desc"}, take:50});
    return NextResponse.json(photos);
  }
  // P0 Security: sin clientId explícito, el trainer solo ve las fotos de SUS
  // clientes. Antes devolvía las de todo el sistema.
  const photos = await prisma.progressPhoto.findMany({
    where: { client: { trainerId: s.id } },
    orderBy: { date: "desc" },
    take: 50,
  });
  return NextResponse.json(photos);
}

export async function POST(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});

  const body = await req.json().catch(() => null);
  if(!body) return NextResponse.json({error:"Cuerpo requerido"},{status:400});
  const { url, note, isPrivate, clientId } = body;

  // Validar la URL: solo se aceptan archivos servidos por el endpoint propio
  // de uploads. Antes se guardaba cualquier string, lo que permitía registrar
  // rutas arbitrarias (p. ej. las de otro usuario) como foto propia.
  if(typeof url !== "string" || !/^\/api\/uploads\/[a-z]+\/[A-Za-z0-9._-]+$/.test(url)){
    return NextResponse.json({error:"URL inválida"},{status:400});
  }
  if(note !== undefined && note !== null && (typeof note !== "string" || note.length > 500)){
    return NextResponse.json({error:"Nota inválida"},{status:400});
  }

  let targetClientId: string | null = null;
  if(s.role === "CLIENT"){
    const client = await prisma.client.findFirst({where:{OR:[{userId:s.id},{email:s.email}]}});
    targetClientId = client?.id || null;
  } else if(clientId){
    // P0 Security: un TRAINER solo puede asociar fotos a SUS clientes.
    const ownsClient = await assertTrainerOwnsClient(s.id, clientId);
    if(!ownsClient){
      return NextResponse.json({error:"Cliente no encontrado"}, {status:404});
    }
    targetClientId = clientId;
  }

  const photo = await prisma.progressPhoto.create({
    data: {
      userId: s.id,
      clientId: targetClientId || null,
      url,
      note: note || null,
      isPrivate: isPrivate ?? true,
    }
  });

  return NextResponse.json(photo);
}
