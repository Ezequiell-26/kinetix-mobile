import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

type IncomingExercise = {
  exerciseId?: string;
  name?: string;
  sets?: number | string;
  reps?: string;
  rir?: number | string | null;
  rpe?: number | string | null;
  restSec?: number | string;
  rest?: number | string;
  tempo?: string;
  load?: string;
  notes?: string;
};

type IncomingDay = {
  name?: string;
  dayNumber?: number;
  description?: string | null;
  estimatedMin?: number | string;
  exercises?: IncomingExercise[];
};

type IncomingWeek = {
  weekNumber?: number;
  days?: IncomingDay[];
};

function toNum(value: unknown, fallback: number): number {
  if (value === undefined || value === null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toNullableNum(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * Reemplaza por completo las semanas de un programa: borra las existentes
 * (cascade a workouts y ejercicios) y vuelve a crearlas desde el payload.
 *
 * Corre en una transacción: si cualquier paso falla, el programa queda
 * exactamente como estaba. Los WorkoutLog que referenciaban los workouts
 * viejos NO se pierden: la FK es opcional con onDelete: SetNull y el nombre
 * de la sesión queda preservado en WorkoutLog.workoutName.
 */
export async function replaceProgramWeeks(
  programId: string,
  weeks: IncomingWeek[],
  tx: Prisma.TransactionClient = prisma
) {
  await tx.programWeek.deleteMany({ where: { programId } });

  const validExerciseIds = new Set(
    (await tx.exercise.findMany({ select: { id: true } })).map(e => e.id)
  );

  for (let wIdx = 0; wIdx < weeks.length; wIdx++) {
    const w = weeks[wIdx] ?? {};
    const week = await tx.programWeek.create({
      data: {
        programId,
        weekNumber: toNum(w.weekNumber, wIdx + 1),
      },
    });

    const days = Array.isArray(w.days) ? w.days : [];
    for (let dIdx = 0; dIdx < days.length; dIdx++) {
      const d = days[dIdx] ?? {};
      const workout = await tx.workout.create({
        data: {
          weekId: week.id,
          dayNumber: toNum(d.dayNumber, dIdx + 1),
          name: d.name || `Día ${dIdx + 1}`,
          description: d.description ?? null,
          estimatedMin: toNum(d.estimatedMin, 60),
        },
      });

      const exercises = Array.isArray(d.exercises) ? d.exercises : [];
      for (let eIdx = 0; eIdx < exercises.length; eIdx++) {
        const ex = exercises[eIdx] ?? {};

        let exerciseId = ex.exerciseId;
        if (!exerciseId || !validExerciseIds.has(exerciseId)) {
          const found = ex.name
            ? await tx.exercise.findFirst({ where: { name: { contains: ex.name } } })
            : null;
          exerciseId = found?.id;
        }
        if (!exerciseId || !validExerciseIds.has(exerciseId)) continue;

        await tx.workoutExercise.create({
          data: {
            workoutId: workout.id,
            exerciseId,
            order: eIdx,
            sets: toNum(ex.sets, 3),
            reps: String(ex.reps || "8-12"),
            rir: toNullableNum(ex.rir),
            rpe: toNullableNum(ex.rpe),
            restSec: toNum(ex.restSec ?? ex.rest, 90),
            tempo: ex.tempo || "3-1-1-0",
            load: ex.load || null,
            notes: ex.notes || null,
          },
        });
      }
    }
  }
}
