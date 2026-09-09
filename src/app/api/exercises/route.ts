import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request){
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.toLowerCase() || "";
  const group = url.searchParams.get("group");
  const where: Record<string, unknown> = {};
  if(q){
    where["name"] = { contains: q, mode: "insensitive" };
  }
  if(group && group!=="Todos"){
    where["muscleGroup"] = group;
  }
  const exercises = await prisma.exercise.findMany({
    where,
    orderBy:{name:"asc"},
    take: 100,
  });
  return NextResponse.json(exercises);
}

export async function POST(req: Request){
  const body = await req.json();
  const ex = await prisma.exercise.create({data:{
    name: body.name,
    muscleGroup: body.muscleGroup || "General",
    pattern: body.pattern || null,
    equipment: body.equipment || null,
    level: body.level || "Intermedio",
    image: body.image || null,
    video: body.video || null,
    instructions: body.instructions || null,
  }});
  return NextResponse.json(ex);
}
