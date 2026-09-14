import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const { id } = await params;

  const workout = await prisma.workout.findUnique({
    where: { id },
    include: {
      week: {
        include: { program: true }
      },
      exercises: {
        orderBy: { order: "asc" },
        include: { exercise: true }
      }
    }
  });

  // Sin fallback silencioso: si el ID no existe, 404.
  // Antes se devolvía el primer entrenamiento de la base de datos, lo que
  // podía mostrarle al atleta un entrenamiento de otro programa.
  if (!workout) {
    return NextResponse.json({ error: "Entrenamiento no encontrado" }, { status: 404 });
  }

  // Control de acceso: un CLIENT solo puede ver entrenamientos de su
  // programa asignado. El trainer puede ver cualquiera.
  if (s.role === "CLIENT") {
    const client = await prisma.client.findFirst({
      where: { OR: [{ userId: s.id }, { email: s.email }] },
      select: { assignedProgramId: true },
    });
    if (!client || client.assignedProgramId !== workout.week.program.id) {
      // 404 (no 403) para no revelar la existencia del recurso.
      return NextResponse.json({ error: "Entrenamiento no encontrado" }, { status: 404 });
    }
  }

  return NextResponse.json(workout);
}
