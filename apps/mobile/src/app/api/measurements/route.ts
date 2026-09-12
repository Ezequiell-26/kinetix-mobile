import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { assertTrainerOwnsClient } from "@/lib/authorization";

export async function GET(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});

  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId");

  if(s.role === "CLIENT"){
    const client = await prisma.client.findFirst({
      where: { OR: [{userId: s.id}, {email: s.email}] }
    });
    const measurements = await prisma.progressMeasurement.findMany({
      where: {
        OR: [
          { userId: s.id },
          ...(client?.id ? [{ clientId: client.id }] : [])
        ]
      },
      orderBy: { date: "desc" },
      take: 50
    });
    return NextResponse.json(measurements);
  }

  // Trainer
  if(clientId){
    // P0 Security: TRAINER solo puede ver mediciones de sus propios clientes
    const ownsClient = await assertTrainerOwnsClient(s.id, clientId);
    if(!ownsClient){
      return NextResponse.json({error:"Cliente no encontrado"}, {status:404});
    }
    const measurements = await prisma.progressMeasurement.findMany({
      where: { clientId },
      orderBy: { date: "desc" },
      take: 50
    });
    return NextResponse.json(measurements);
  }

  // P0 Security: sin clientId explícito, el trainer solo ve las mediciones de
  // SUS clientes. Antes devolvía las de todo el sistema.
  const measurements = await prisma.progressMeasurement.findMany({
    where: { client: { trainerId: s.id } },
    include: { client: { select: { id: true, name: true, email: true, avatar: true } } },
    orderBy: { date: "desc" },
    take: 50
  });
  return NextResponse.json(measurements);
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
  let clientId = body.clientId;

  if(s.role === "CLIENT"){
    const client = await prisma.client.findFirst({
      where: { OR: [{userId: s.id}, {email: s.email}] }
    });
    clientId = client?.id || null;
  } else if(clientId && s.role === "TRAINER"){
    // P0 Security: TRAINER solo puede crear mediciones para sus propios clientes
    const ownsClient = await assertTrainerOwnsClient(s.id, clientId);
    if(!ownsClient){
      return NextResponse.json({error:"Cliente no encontrado"}, {status:404});
    }
  }

  const weight = body.weight !== undefined && body.weight !== null ? fin(body.weight) : null;
  const chest = body.chest !== undefined && body.chest !== null ? fin(body.chest) : null;
  const waist = body.waist !== undefined && body.waist !== null ? fin(body.waist) : null;
  const arm = body.arm !== undefined && body.arm !== null ? fin(body.arm) : null;
  const leg = body.leg !== undefined && body.leg !== null ? fin(body.leg) : null;
  const bodyFat = body.bodyFat !== undefined && body.bodyFat !== null ? fin(body.bodyFat) : null;

  const measurement = await prisma.progressMeasurement.create({
    data: {
      userId: s.id,
      clientId,
      weight,
      chest,
      waist,
      arm,
      leg,
      bodyFat,
      date: body.date ? new Date(body.date) : new Date()
    }
  });

  // Also update client's latest weight if available
  if (clientId && weight) {
    await prisma.client.update({
      where: { id: clientId },
      data: { weight }
    }).catch(()=>{});
  }

  return NextResponse.json(measurement);
}
