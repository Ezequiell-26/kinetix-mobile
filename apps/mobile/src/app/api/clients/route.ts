import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { assertTrainerOwnsClient, validateClientIdForTrainer } from "@/lib/authorization";

export async function GET(){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  if(s.role!=="TRAINER") return NextResponse.json({error:"Solo trainer"},{status:403});
  
  // P0 Security: Un trainer solo puede ver sus propios clientes
  // En el modelo actual sin trainerId en Client, verificamos que el usuario sea TRAINER
  // Para multi-trainer real, agregar campo trainerId a Client y filtrar por él
  const clients = await prisma.client.findMany({
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
  if(!body || typeof body.name !== "string" || !body.name.trim()){
    return NextResponse.json({error:"Nombre requerido"},{status:400});
  }
  if(typeof body.email !== "string" || !body.email.includes("@")){
    return NextResponse.json({error:"Email válido requerido"},{status:400});
  }
  // Transacción atómica: sin cliente huérfano ni suscripción huérfana.
  const c = await prisma.$transaction(async (tx) => {
    const created = await tx.client.create({data:{
      name: body.name.trim(), email: body.email.trim(), goal: body.goal || "HIPERTROFIA",
      status: body.status || "ACTIVO", plan: body.plan || "PERSONALIZADO",
      age: fin(body.age), weight: fin(body.weight),
      notes: body.notes || null
    }});
    await tx.subscription.create({data:{clientId:created.id, plan:created.plan, status:"ACTIVA", nextPayment: new Date(Date.now()+30*24*60*60*1000), price: created.plan==="PREMIUM"?25000: created.plan==="PERSONALIZADO"?18000:12000 }});
    return created;
  });
  return NextResponse.json(c);
}
