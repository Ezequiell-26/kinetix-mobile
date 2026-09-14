/**
 * Test de regresión del lote 1 (persistencia de programas).
 *
 * Escenario que antes rompía: editar un programa que tiene WorkoutLogs
 * históricos. Antes, replaceProgramWeeks borraba las semanas en cascade y la
 * FK Restrict de WorkoutLog→Workout hacía fallar el PUT con un 500 (o, según
 * el orden de writes, dejaba el programa a medio editar).
 *
 * Ahora: FK opcional con SetNull + snapshot workoutName + transacción.
 * El log sobrevive a la edición con su nombre preservado.
 *
 * Corre contra Postgres (DATABASE_URL del .env o entorno). Crea fixtures
 * `TEST — ...` y las borra al final (ver Limpieza): nunca toca datos reales.
 *   npm run test:core
 */
import { config } from "dotenv";
config({ path: ".env" });

if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith("postgresql")) {
  console.error("ERROR FATAL: test:core requiere DATABASE_URL=postgresql (ver .env.example)");
  process.exit(2);
}

import { PrismaClient } from "@prisma/client";
import { replaceProgramWeeks } from "../src/lib/programs";

const prisma = new PrismaClient();

let passed = 0;
let failed = 0;

function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.error(`  FAIL  ${name}`, detail ?? "");
  }
}

async function main() {
  console.log("Test: editar un programa con logs históricos preserva el historial\n");

  // ---- Setup: programa con 1 semana / 1 día / 1 ejercicio, cliente asignado, 1 log
  const exercise = await prisma.exercise.findFirst();
  if (!exercise) throw new Error("No hay ejercicios en la base: corré npm run db:seed primero");

  const program = await prisma.program.create({
    data: {
      name: "TEST — Programa con historial",
      frequency: 3,
      durationWeeks: 1,
    },
  });
  const week = await prisma.programWeek.create({
    data: { programId: program.id, weekNumber: 1 },
  });
  const workoutV1 = await prisma.workout.create({
    data: { weekId: week.id, dayNumber: 1, name: "Push V1" },
  });
  await prisma.workoutExercise.create({
    data: { workoutId: workoutV1.id, exerciseId: exercise.id, order: 0, sets: 3, reps: "8-12" },
  });

  const client = await prisma.client.create({
    data: { name: "TEST Atleta", email: `test-${Date.now()}@demo.com`, assignedProgramId: program.id },
  });

  const log = await prisma.workoutLog.create({
    data: {
      clientId: client.id,
      workoutId: workoutV1.id,
      workoutName: workoutV1.name,
      completed: true,
      sets: { create: [{ exerciseName: exercise.name, setNumber: 1, weight: 60, reps: 8 }] },
    },
  });

  // ---- Acción bajo test: PUT equivalente (update + replaceProgramWeeks en una transacción)
  await prisma.$transaction(async (tx) => {
    await tx.program.update({ where: { id: program.id }, data: { name: "TEST — Programa editado" } });
    await replaceProgramWeeks(
      program.id,
      [{ weekNumber: 1, days: [{ dayNumber: 1, name: "Push V2", exercises: [{ exerciseId: exercise.id, sets: 4, reps: "6-8" }] }] }],
      tx
    );
  });

  // ---- Asserts
  const logAfter = await prisma.workoutLog.findUnique({
    where: { id: log.id },
    include: { sets: true },
  });
  check("el WorkoutLog sobrevive a la edición del programa", !!logAfter);
  check("las series del log sobreviven", (logAfter?.sets.length ?? 0) === 1);
  check("el nombre de la sesión queda preservado (snapshot)", logAfter?.workoutName === "Push V1", logAfter?.workoutName);
  check("workoutId queda en null (workout viejo eliminado, no en cascada al log)", logAfter?.workoutId === null, logAfter?.workoutId);

  const oldWorkout = await prisma.workout.findUnique({ where: { id: workoutV1.id } });
  check("el workout viejo fue reemplazado", oldWorkout === null);

  const newWorkouts = await prisma.workout.findMany({
    where: { week: { programId: program.id } },
  });
  check("el programa tiene su nueva estructura (1 workout 'Push V2')", newWorkouts.length === 1 && newWorkouts[0].name === "Push V2", newWorkouts.map(w => w.name));

  // ---- Transacción: un replace que falla no deja el programa a medio editar
  const beforeFailedTx = await prisma.program.findUnique({
    where: { id: program.id },
    include: { weeks: { include: { workouts: true } } },
  });
  let txFailed = false;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.program.update({ where: { id: program.id }, data: { name: "TEST — NO DEBE QUEDAR" } });
      await replaceProgramWeeks(program.id, [{ weekNumber: 1, days: [] }], tx);
      throw new Error("fallo simulado a mitad del guardado");
    });
  } catch {
    txFailed = true;
  }
  const afterFailedTx = await prisma.program.findUnique({
    where: { id: program.id },
    include: { weeks: { include: { workouts: true } } },
  });
  check("la transacción fallida propaga el error", txFailed);
  check("tras una transacción fallida el programa queda intacto", afterFailedTx?.name === "TEST — Programa editado" && afterFailedTx?.weeks.length === beforeFailedTx?.weeks.length, { name: afterFailedTx?.name, weeks: afterFailedTx?.weeks.length });
  const logStillThere = await prisma.workoutLog.findUnique({ where: { id: log.id } });
  check("tras una transacción fallida el log sigue intacto", !!logStillThere);

  // ---- Limpieza (solo datos creados por el test)
  await prisma.workoutLog.delete({ where: { id: log.id } });
  await prisma.client.delete({ where: { id: client.id } });
  await prisma.program.delete({ where: { id: program.id } });

  console.log(`\nResultado: ${passed} pass, ${failed} fail`);
  if (failed > 0) process.exitCode = 1;
}

main()
  .catch((e) => {
    console.error("ERROR FATAL:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
