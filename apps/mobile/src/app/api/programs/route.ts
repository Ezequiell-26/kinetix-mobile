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

export async function GET(){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});

  if(s.role === "CLIENT"){
    const client = await prisma.client.findFirst({ where: { OR: [{ userId:s.id }, { email:s.email }] } });
    if(!client?.assignedProgramId) return NextResponse.json([]);
    const program = await prisma.program.findUnique({ where:{id:client.assignedProgramId}, include:FULL_INCLUDE });
    return NextResponse.json(program ? [program] : []);
  }

  const programs = await prisma.program.findMany({
    where: { OR: [{ trainerId: s.id }, { trainerId: null }] },
    include: FULL_INCLUDE,
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(programs);
}

export async function POST(req:Request){
  const s = await getSession();
  if(!s || s.role !== "TRAINER") return NextResponse.json({error:"Solo trainer"},{status:403});
  try{
    const body = await req.json();
    const {name,description,durationWeeks,frequency,weeks}=body;
    if(!name || typeof name !== "string") return NextResponse.json({error:"El nombre del programa es requerido"},{status:400});
    const created = await prisma.$transaction(async(tx)=>{
      const program = await tx.program.create({data:{trainerId:s.id,name:name.trim().slice(0,160),description:typeof description === "string" ? description.trim().slice(0,1000) : null,durationWeeks:Math.min(52,Math.max(1,Number(durationWeeks)|| (Array.isArray(weeks)?weeks.length:4))),frequency:Math.min(7,Math.max(1,Number(frequency)||4))}});
      if(Array.isArray(weeks)) await replaceProgramWeeks(program.id,weeks,tx);
      return tx.program.findUnique({where:{id:program.id},include:FULL_INCLUDE});
    });
    return NextResponse.json(created,{status:201});
  }catch(error:unknown){
    console.error("[PROGRAMS POST]",error);
    return NextResponse.json({error:error instanceof Error?error.message:"Error al guardar programa"},{status:500});
  }
}
