import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
export async function GET(){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  if(s.role!=="TRAINER") return NextResponse.json({error:"Solo trainer"},{status:403});
  const clients = await prisma.client.findMany({orderBy:{createdAt:"desc"}, include:{assignedProgram:true}});
  return NextResponse.json(clients);
}
export async function POST(req:Request){
  const s = await getSession();
  if(!s || s.role!=="TRAINER") return NextResponse.json({error:"No auth"},{status:401});
  const body = await req.json();
  const c = await prisma.client.create({data:{
    name: body.name, email: body.email, goal: body.goal || "HIPERTROFIA",
    status: body.status || "ACTIVO", plan: body.plan || "PERSONALIZADO",
    age: body.age ? Number(body.age) : null, weight: body.weight ? Number(body.weight): null,
    notes: body.notes || null
  }});
  await prisma.subscription.create({data:{clientId:c.id, plan:c.plan, status:"ACTIVA", nextPayment: new Date(Date.now()+30*24*60*60*1000), price: c.plan==="PREMIUM"?25000: c.plan==="PERSONALIZADO"?18000:12000 }});
  return NextResponse.json(c);
}
