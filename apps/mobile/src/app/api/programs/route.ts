import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { replaceProgramWeeks } from "@/lib/programs";

export async function GET(){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});

  // Un CLIENT solo ve su propio programa asignado, nunca toda la biblioteca.
  if(s.role === "CLIENT"){
    const client = await prisma.client.findFirst({ where: { OR: [{ userId: s.id }, { email: s.email }] } });
    if(!client?.assignedProgramId) return NextResponse.json([]);
    const program = await prisma.program.findUnique({
      where: { id: client.assignedProgramId },
      include: {
        weeks: {
          orderBy: { weekNumber: "asc" },
          include: {
            workouts: {
              orderBy: { dayNumber: "asc" },
              include: {
                exercises: {
                  orderBy: { order: "asc" },
                  include: { exercise: true }
                }
              }
            }
          }
        },
        clients: { select: { id: true, name: true } }
      }
    });
    return NextResponse.json(program ? [program] : []);
  }

  const programs = await prisma.program.findMany({
    include: {
      weeks: {
        orderBy: { weekNumber: "asc" },
        include: {
          workouts: {
            orderBy: { dayNumber: "asc" },
            include: {
              exercises: {
                orderBy: { order: "asc" },
                include: { exercise: true }
              }
            }
          }
        }
      },
      clients: {
        select: { id: true, name: true }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json(programs);
}

export async function POST(req: Request){
  const s = await getSession();
  if(!s || s.role !== "TRAINER") return NextResponse.json({error:"Solo trainer"},{status:403});

  try {
    const body = await req.json();
    const { name, description, durationWeeks, frequency, weeks } = body;

    if(!name || typeof name !== "string") {
      return NextResponse.json({error: "El nombre del programa es requerido"}, {status: 400});
    }

    // Creación atómica: si el reemplazo de semanas falla, no queda un
    // programa vacío a medio crear.
    const created = await prisma.$transaction(async (tx) => {
      const program = await tx.program.create({
        data: {
          name,
          description: description || null,
          durationWeeks: Number(durationWeeks) || (Array.isArray(weeks) ? weeks.length : 4),
          frequency: Number(frequency) || 4,
        }
      });

      if (Array.isArray(weeks)) {
        await replaceProgramWeeks(program.id, weeks, tx);
      }

      return tx.program.findUnique({
        where: { id: program.id },
        include: {
          weeks: {
            orderBy: { weekNumber: "asc" },
            include: {
              workouts: {
                orderBy: { dayNumber: "asc" },
                include: {
                  exercises: {
                    orderBy: { order: "asc" },
                    include: { exercise: true }
                  }
                }
              }
            }
          }
        }
      });
    });

    return NextResponse.json(created);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al guardar programa";
    return NextResponse.json({error: msg}, {status: 500});
  }
}
