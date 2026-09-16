import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { exerciseSchema } from "@/lib/validations";

export async function GET(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() || "";
  const group = url.searchParams.get("group")?.trim();
  const take = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 100)));
  const where: Record<string, unknown> = {};
  if(q) where.name = { contains: q, mode: "insensitive" };
  if(group && group !== "Todos") where.muscleGroup = group;

  const exercises = await prisma.exercise.findMany({
    where,
    orderBy:{name:"asc"},
    take,
    select: {
      id:true,
      name:true,
      muscleGroup:true,
      pattern:true,
      equipment:true,
      level:true,
      image:true,
      video:true,
      instructions:true,
      errors:true,
      variants:true,
      substitutions:true,
      createdAt:true,
    },
  });
  return NextResponse.json(exercises);
}

export async function POST(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  if(s.role !== "TRAINER") return NextResponse.json({error:"Solo entrenador"},{status:403});
  const body = await req.json().catch(() => null);
  const parsed = exerciseSchema.safeParse(body);
  if(!parsed.success){
    return NextResponse.json({error:parsed.error.errors[0]?.message || "Datos inválidos"},{status:400});
  }
  const data = parsed.data;
  const ex = await prisma.exercise.create({data:{
    name:data.name,
    muscleGroup:data.muscleGroup,
    pattern:data.pattern || null,
    equipment:data.equipment || null,
    level:data.level,
    image:data.image || null,
    video:data.video || null,
    instructions:data.instructions || null,
    errors:data.errors || null,
    variants:data.variants || null,
    substitutions:data.substitutions || null,
  }});
  return NextResponse.json(ex,{status:201});
}
