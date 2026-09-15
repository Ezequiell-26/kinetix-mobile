import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { replaceProgramWeeks } from "@/lib/programs";

const FULL_INCLUDE = {
  weeks: {
    orderBy: { weekNumber: "asc" as const },
    include: {
      workouts: {
        orderBy: { dayNumber: "asc" as const },
        include: { exercises: { orderBy: { order: "asc" as const }, include: { exercise: true } } },
      },
    },
  },
  clients: { select: { id: true, name: true } },
};

export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
  const s=await getSession(); if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const {id}=await params;
  if(s.role==="CLIENT"){
    const client=await prisma.client.findFirst({where:{OR:[{userId:s.id},{email:s.email}]},select:{assignedProgramId:true}});
    if(!client || client.assignedProgramId!==id) return NextResponse.json({error:"No autorizado"},{status:403});
  } else {
    const program=await prisma.program.findUnique({where:{id},select:{trainerId:true}});
    if(!program) return NextResponse.json({error:"Programa no encontrado"},{status:404});
    if(program.trainerId && program.trainerId!==s.id) return NextResponse.json({error:"Programa no encontrado"},{status:404});
  }
  const program=await prisma.program.findUnique({where:{id},include:FULL_INCLUDE});
  if(!program) return NextResponse.json({error:"Programa no encontrado"},{status:404});
  return NextResponse.json(program);
}

export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
  const s=await getSession(); if(!s || s.role!=="TRAINER") return NextResponse.json({error:"Solo trainer"},{status:403});
  const {id}=await params;
  const existing=await prisma.program.findUnique({where:{id},select:{trainerId:true,durationWeeks:true,frequency:true}});
  if(!existing) return NextResponse.json({error:"Programa no encontrado"},{status:404});
  if(existing.trainerId!==s.id) return NextResponse.json({error:"La plantilla global no se puede editar; duplicala para personalizarla."},{status:403});
  try{
    const body=await req.json(); const {name,description,durationWeeks,frequency,weeks}=body;
    if(!name || typeof name!=="string") return NextResponse.json({error:"El nombre del programa es requerido"},{status:400});
    await prisma.$transaction(async(tx)=>{
      await tx.program.update({where:{id},data:{name:name.trim().slice(0,160),description:typeof description==="string"?description.trim().slice(0,1000):null,durationWeeks:Math.min(52,Math.max(1,Number(durationWeeks)||existing.durationWeeks)),frequency:Math.min(7,Math.max(1,Number(frequency)||existing.frequency))}});
      if(Array.isArray(weeks)) await replaceProgramWeeks(id,weeks,tx);
    });
    return NextResponse.json(await prisma.program.findUnique({where:{id},include:FULL_INCLUDE}));
  }catch(error:unknown){ console.error("[PROGRAM PUT]",error); return NextResponse.json({error:error instanceof Error?error.message:"Error al actualizar el programa"},{status:500}); }
}

export async function DELETE(_req:Request,{params}:{params:Promise<{id:string}>}){
  const s=await getSession(); if(!s || s.role!=="TRAINER") return NextResponse.json({error:"Solo trainer"},{status:403});
  const {id}=await params;
  const existing=await prisma.program.findUnique({where:{id},select:{trainerId:true}});
  if(!existing) return NextResponse.json({error:"Programa no encontrado"},{status:404});
  if(existing.trainerId!==s.id) return NextResponse.json({error:"La plantilla global no se puede eliminar."},{status:403});
  await prisma.program.delete({where:{id}});
  return NextResponse.json({ok:true});
}
