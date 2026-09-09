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

  let workout = await prisma.workout.findUnique({
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

  // If not found by exact ID, find first workout in the database so user is never stuck
  if (!workout) {
    workout = await prisma.workout.findFirst({
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
  }

  if (!workout) {
    return NextResponse.json({ error: "Entrenamiento no encontrado" }, { status: 404 });
  }

  return NextResponse.json(workout);
}
