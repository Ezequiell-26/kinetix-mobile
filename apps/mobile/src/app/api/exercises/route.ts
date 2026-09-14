import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.toLowerCase() || "";
  const group = url.searchParams.get("group");
  const where: Record<string, unknown> = {};
  if(q){
    // SQLite no soporta mode:insensitive (solo Postgres/MySQL) → LIKE ya es
    // case-insensitive para ASCII en SQLite.
    where["name"] = { contains: q };
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
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  if(s.role !== "TRAINER") return NextResponse.json({error:"Solo entrenador"},{status:403});
  const body = await req.json();
  if(!body.name || typeof body.name !== "string"){
    return NextResponse.json({error:"Nombre requerido"},{status:400});
  }
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
