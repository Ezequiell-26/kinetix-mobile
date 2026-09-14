import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { assertTrainerOwnsClient, validateClientIdForTrainer } from "@/lib/authorization";
import { clientSchema } from "@/lib/validations";

export async function GET(){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  if(s.role!=="TRAINER") return NextResponse.json({error:"Solo trainer"},{status:403});
  
  // P0: solo los clientes de ESTE trainer (ownership real por trainerId).
  const clients = await prisma.client.findMany({
    where:{trainerId:s.id},
    orderBy:{createdAt:"desc"}, 
    include:{assignedProgram:true}
  });
  return NextResponse.json(clients);
}

function fin(v: unknown): number | null {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : null;
}

export async function POST(req:Request){
  const s = await getSession();
  if(!s || s.role!=="TRAINER") return NextResponse.json({error:"No auth"},{status:401});
  const body = await req.json().catch(() => null);
  if(!body) return NextResponse.json({error:"Datos inválidos"},{status:400});
  
  // Validar con schema Zod
  const parsed = clientSchema.safeParse(body);
  if(!parsed.success){
    return NextResponse.json({error: parsed.error.errors[0]?.message || "Datos inválidos"},{status:400});
  }
  const data = parsed.data;
  
  // Normalizar email
  const normalizedEmail = data.email.toLowerCase().trim();
  
  // Verificar que el email no exista ya en otro cliente del mismo trainer
  const existing = await prisma.client.findUnique({where:{email: normalizedEmail}});
  if(existing && existing.trainerId !== s.id){
    return NextResponse.json({error:"Email ya registrado"},{status:400});
  }
  
  // Transacción atómica: sin cliente huérfano ni suscripción huérfana.
  const c = await prisma.$transaction(async (tx) => {
    const created = await tx.client.create({data:{
      name: data.name.trim(), 
      email: normalizedEmail, 
      goal: data.goal || "HIPERTROFIA",
      status: data.status || "ACTIVO", 
      plan: data.plan || "PERSONALIZADO",
      age: data.age ?? fin(data.age), 
      weight: data.weight ?? fin(data.weight),
      height: data.height ?? fin(data.height),
      notes: data.notes?.slice(0, 1000) || null, 
      trainerId: s.id
    }});
    
    const prices: Record<string, number> = { BASICO: 12000, PERSONALIZADO: 18000, PREMIUM: 25000 };
    await tx.subscription.create({
      data:{
        clientId: created.id, 
        plan: created.plan, 
        status: "ACTIVA", 
        nextPayment: new Date(Date.now()+30*24*60*60*1000), 
        price: prices[created.plan] || 18000
      }
    });
    return created;
  });
  return NextResponse.json(c);
}
