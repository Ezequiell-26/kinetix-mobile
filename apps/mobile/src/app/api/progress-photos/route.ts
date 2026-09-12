import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

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
    const photos = await prisma.progressPhoto.findMany({where:{clientId}, orderBy:{date:"desc"}, take:50});
    return NextResponse.json(photos);
  }
  const photos = await prisma.progressPhoto.findMany({orderBy:{date:"desc"}, take:50});
  return NextResponse.json(photos);
}

export async function POST(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});

  const body = await req.json();
  const { url, note, isPrivate, clientId } = body;
  if(!url) return NextResponse.json({error:"URL requerida"},{status:400});

  let targetClientId = clientId;
  if(s.role === "CLIENT"){
    const client = await prisma.client.findFirst({where:{OR:[{userId:s.id},{email:s.email}]}});
    targetClientId = client?.id || null;
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
