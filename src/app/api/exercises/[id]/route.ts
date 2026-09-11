import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request, {params}:{params:Promise<{id:string}>}){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  if(s.role !== "TRAINER") return NextResponse.json({error:"Solo entrenador"},{status:403});
  const {id} = await params;
  const body = await req.json().catch(() => null);
  if(!body) return NextResponse.json({error:"Cuerpo requerido"},{status:400});
  if(body.name !== undefined && (typeof body.name !== "string" || !body.name.trim())){
    return NextResponse.json({error:"Nombre inválido"},{status:400});
  }
  const ex = await prisma.exercise.update({
    where:{id},
    data:{
      name: body.name,
      muscleGroup: body.muscleGroup,
      pattern: body.pattern ?? undefined,
      equipment: body.equipment,
      level: body.level,
      instructions: body.instructions ?? undefined,
      image: body.image ?? undefined,
      video: body.video ?? undefined,
    }
  });
  return NextResponse.json(ex);
}

export async function DELETE(_req: Request, {params}:{params:Promise<{id:string}>}){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  if(s.role !== "TRAINER") return NextResponse.json({error:"Solo entrenador"},{status:403});
  const {id} = await params;
  await prisma.exercise.delete({where:{id}});
  return NextResponse.json({ok:true});
}
