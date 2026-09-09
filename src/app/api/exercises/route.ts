import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});

  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const group = url.searchParams.get("group");

  const where: Record<string, unknown> = {};
  if (q) {
    where.name = { contains: q };
  }
  if (group && group !== "Todos") {
    where.muscleGroup = { equals: group };
  }

  const exercises = await prisma.exercise.findMany({
    where,
    orderBy: { name: "asc" }
  });

  return NextResponse.json(exercises);
}

export async function POST(req: Request){
  const s = await getSession();
  if(!s || s.role !== "TRAINER") return NextResponse.json({error:"Solo trainer"},{status:403});

  try {
    const body = await req.json();
    const { name, muscleGroup, pattern, equipment, level, image, video, instructions } = body;

    if(!name || !muscleGroup) {
      return NextResponse.json({error: "Nombre y grupo muscular requeridos"}, {status: 400});
    }

    const ex = await prisma.exercise.create({
      data: {
        name,
        muscleGroup,
        pattern: pattern || "Empuje",
        equipment: equipment || "Barra",
        level: level || "Intermedio",
        image: image || null,
        video: video || null,
        instructions: instructions || null
      }
    });

    return NextResponse.json(ex);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al guardar ejercicio";
    return NextResponse.json({error: msg}, {status: 500});
  }
}
