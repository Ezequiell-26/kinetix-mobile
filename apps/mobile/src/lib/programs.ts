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

const MAX_WEEKS = 52;
const MAX_DAYS_PER_WEEK = 7;
const MAX_EXERCISES_PER_DAY = 40;
const MAX_TEXT = 2000;

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

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim().slice(0, MAX_TEXT) : fallback;
}

function validateProgramPayload(weeks: unknown): asserts weeks is IncomingWeek[] {
  if (!Array.isArray(weeks)) throw new Error("El formato de semanas no es válido");
  if (weeks.length > MAX_WEEKS) throw new Error("El programa no puede superar 52 semanas");
  for (const week of weeks) {
    if (!week || typeof week !== "object") throw new Error("Semana inválida");
    const days = Array.isArray((week as IncomingWeek).days) ? (week as IncomingWeek).days! : [];
    if (days.length > MAX_DAYS_PER_WEEK) throw new Error("Cada semana puede tener hasta 7 días");
    for (const day of days) {
      if (!day || typeof day !== "object") throw new Error("Día inválido");
      const exercises = Array.isArray((day as IncomingDay).exercises) ? (day as IncomingDay).exercises! : [];
      if (exercises.length > MAX_EXERCISES_PER_DAY) throw new Error("Cada día puede tener hasta 40 ejercicios");
      for (const exercise of exercises) {
        if (!exercise || typeof exercise !== "object") throw new Error("Ejercicio inválido");
      }
    }
  }
}

/**
 * Reemplaza por completo las semanas de un programa.
 * El payload se valida y limita ANTES de borrar datos existentes.
 */
export async function replaceProgramWeeks(
  programId: string,
  weeks: IncomingWeek[],
  tx: Prisma.TransactionClient = prisma
) {
  validateProgramPayload(weeks);
  await tx.programWeek.deleteMany({ where: { programId } });

  const validExerciseIds = new Set(
    (await tx.exercise.findMany({ select: { id: true } })).map(e => e.id)
  );

  for (let wIdx = 0; wIdx < weeks.length; wIdx++) {
    const w = weeks[wIdx] ?? {};
    const week = await tx.programWeek.create({
      data: { programId, weekNumber: Math.min(MAX_WEEKS, Math.max(1, Math.round(toNum(w.weekNumber, wIdx + 1)))) },
    });

    const days = Array.isArray(w.days) ? w.days : [];
    for (let dIdx = 0; dIdx < days.length; dIdx++) {
      const d = days[dIdx] ?? {};
      const workout = await tx.workout.create({
        data: {
          weekId: week.id,
          dayNumber: Math.min(MAX_DAYS_PER_WEEK, Math.max(1, Math.round(toNum(d.dayNumber, dIdx + 1)))),
          name: text(d.name, `Día ${dIdx + 1}`).slice(0, 160),
          description: d.description == null ? null : text(d.description),
          estimatedMin: Math.min(600, Math.max(1, Math.round(toNum(d.estimatedMin, 60)))),
        },
      });

      const exercises = Array.isArray(d.exercises) ? d.exercises : [];
      for (let eIdx = 0; eIdx < exercises.length; eIdx++) {
        const ex = exercises[eIdx] ?? {};
        let exerciseId = typeof ex.exerciseId === "string" ? ex.exerciseId : undefined;
        if (!exerciseId || !validExerciseIds.has(exerciseId)) {
          const name = text(ex.name);
          const found = name ? await tx.exercise.findFirst({ where: { name: { contains: name } } }) : null;
          exerciseId = found?.id;
        }
        if (!exerciseId || !validExerciseIds.has(exerciseId)) continue;

        await tx.workoutExercise.create({
          data: {
            workoutId: workout.id,
            exerciseId,
            order: eIdx,
            sets: Math.min(30, Math.max(1, Math.round(toNum(ex.sets, 3)))),
            reps: text(ex.reps, "8-12").slice(0, 80),
            rir: toNullableNum(ex.rir),
            rpe: toNullableNum(ex.rpe),
            restSec: Math.min(3600, Math.max(0, Math.round(toNum(ex.restSec ?? ex.rest, 90)))),
            tempo: text(ex.tempo, "3-1-1-0").slice(0, 40),
            load: ex.load == null ? null : text(ex.load).slice(0, 80),
            notes: ex.notes == null ? null : text(ex.notes),
          },
        });
      }
    }
  }
}
