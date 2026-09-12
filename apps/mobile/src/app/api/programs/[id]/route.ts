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
        include: {
          exercises: {
            orderBy: { order: "asc" as const },
            include: { exercise: true },
          },
        },
      },
    },
  },
  clients: { select: { id: true, name: true } },
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const { id } = await params;

  // Un CLIENT solo puede leer el programa que Ezequiel le asignó.
  if(s.role === "CLIENT"){
    const client = await prisma.client.findFirst({ where: { OR: [{ userId: s.id }, { email: s.email }] } });
    if(!client || client.assignedProgramId !== id){
      return NextResponse.json({error:"No autorizado"},{status:403});
    }
  }

  const program = await prisma.program.findUnique({
    where: { id },
    include: FULL_INCLUDE,
  });

  if(!program) return NextResponse.json({error:"Programa no encontrado"},{status:404});
  return NextResponse.json(program);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
){
  const s = await getSession();
  if(!s || s.role !== "TRAINER") return NextResponse.json({error:"Solo trainer"},{status:403});
  const { id } = await params;

  const existing = await prisma.program.findUnique({ where: { id } });
  if(!existing) return NextResponse.json({error:"Programa no encontrado"},{status:404});

  try {
    const body = await req.json();
    const { name, description, durationWeeks, frequency, weeks } = body;

    if(!name || typeof name !== "string"){
      return NextResponse.json({error:"El nombre del programa es requerido"},{status:400});
    }

    // Atómico: la actualización de metadatos y el reemplazo de semanas
    // corren en una sola transacción. Si el reemplazo falla (por ejemplo,
    // un ejercicio inválido), el programa queda como estaba.
    await prisma.$transaction(async (tx) => {
      await tx.program.update({
        where: { id },
        data: {
          name,
          description: description || null,
          durationWeeks: Number(durationWeeks) || (Array.isArray(weeks) ? weeks.length : existing.durationWeeks),
          frequency: Number(frequency) || existing.frequency,
        },
      });

      if(Array.isArray(weeks)){
        await replaceProgramWeeks(id, weeks, tx);
      }
    });

    const updated = await prisma.program.findUnique({
      where: { id },
      include: FULL_INCLUDE,
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al actualizar el programa";
    return NextResponse.json({error: msg}, {status:500});
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
){
  const s = await getSession();
  if(!s || s.role !== "TRAINER") return NextResponse.json({error:"Solo trainer"},{status:403});
  const { id } = await params;

  const existing = await prisma.program.findUnique({ where: { id } });
  if(!existing) return NextResponse.json({error:"Programa no encontrado"},{status:404});

  await prisma.program.delete({ where: { id } });
  return NextResponse.json({ok:true});
}
