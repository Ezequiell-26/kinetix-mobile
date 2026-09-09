import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});

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

    // Create program
    const program = await prisma.program.create({
      data: {
        name,
        description: description || null,
        durationWeeks: Number(durationWeeks) || (Array.isArray(weeks) ? weeks.length : 4),
        frequency: Number(frequency) || 4,
      }
    });

    // If structured weeks are provided, create them
    if (Array.isArray(weeks)) {
      for (let wIdx = 0; wIdx < weeks.length; wIdx++) {
        const w = weeks[wIdx];
        const week = await prisma.programWeek.create({
          data: {
            programId: program.id,
            weekNumber: wIdx + 1,
          }
        });

        if (Array.isArray(w.days)) {
          for (let dIdx = 0; dIdx < w.days.length; dIdx++) {
            const d = w.days[dIdx];
            const workout = await prisma.workout.create({
              data: {
                weekId: week.id,
                dayNumber: dIdx + 1,
                name: d.name || `Día ${dIdx + 1}`,
                description: d.description || null,
                estimatedMin: Number(d.estimatedMin) || 60,
              }
            });

            if (Array.isArray(d.exercises)) {
              for (let eIdx = 0; eIdx < d.exercises.length; eIdx++) {
                const ex = d.exercises[eIdx];
                let exerciseId = ex.exerciseId;

                // If exerciseId is missing or doesn't exist, resolve or find an existing exercise
                if (!exerciseId) {
                  const found = await prisma.exercise.findFirst({
                    where: { name: { contains: ex.name || "" } }
                  });
                  exerciseId = found?.id || (await prisma.exercise.findFirst())?.id;
                }

                if (exerciseId) {
                  await prisma.workoutExercise.create({
                    data: {
                      workoutId: workout.id,
                      exerciseId: exerciseId,
                      order: eIdx,
                      sets: Number(ex.sets) || 3,
                      reps: String(ex.reps || "8-12"),
                      rir: ex.rir !== undefined && ex.rir !== null ? Number(ex.rir) : null,
                      rpe: ex.rpe !== undefined && ex.rpe !== null ? Number(ex.rpe) : null,
                      restSec: Number(ex.restSec || ex.rest) || 90,
                      tempo: ex.tempo || "3-1-1-0",
                      load: ex.load || null,
                      notes: ex.notes || null,
                    }
                  });
                }
              }
            }
          }
        }
      }
    }

    const created = await prisma.program.findUnique({
      where: { id: program.id },
      include: {
        weeks: {
          include: {
            workouts: {
              include: {
                exercises: {
                  include: { exercise: true }
                }
              }
            }
          }
        }
      }
    });

    return NextResponse.json(created);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al guardar programa";
    return NextResponse.json({error: msg}, {status: 500});
  }
}
