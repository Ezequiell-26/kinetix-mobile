import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(req: Request, {params}:{params:Promise<{id:string}>}){
  const {id} = await params;
  const body = await req.json();
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
  const {id} = await params;
  await prisma.exercise.delete({where:{id}});
  return NextResponse.json({ok:true});
}
