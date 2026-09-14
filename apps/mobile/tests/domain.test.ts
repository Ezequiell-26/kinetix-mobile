/**
 * Tests del dominio canónico @kinetix/shared (sin base de datos).
 *
 * Cubren: modelo muscular (16 grupos), registro de ejercicios (metadata
 * estructurada + búsquedas) y utilidades de cálculo (BMI/BMR/1RM/progreso).
 * Regla V8 §19: nada de name.includes("press") como lógica canónica —
 * estos tests fijan el contrato tipado.
 *
 *   npm run test:domain
 */
import {
  MuscleId,
  MUSCLE_DEFINITIONS,
  getMuscleById,
  getAllMuscles,
  COMMON_EXERCISES,
  getExerciseBySlug,
  getExerciseById,
  searchExercises,
  getExercisesByMuscle,
  MovementPattern,
} from "../../../packages/shared/src/domain/fitness/index";
import {
  cn,
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateOneRepMax,
  calculateProgress,
  calculateLevel,
} from "../../../packages/shared/src/utils/index";

let passed = 0;
let failed = 0;

function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}`, detail ?? "");
  }
}

console.log("\nDominio muscular canónico\n");

// 16 grupos exactos, sin strings sueltos
const muscleIds = Object.values(MuscleId);
check("16 MuscleId canónicos", muscleIds.length === 16, muscleIds.length);
check(
  "MUSCLE_DEFINITIONS cubre los 16",
  Object.keys(MUSCLE_DEFINITIONS).length === 16
);
check(
  "cada definición tiene nombre y región no vacíos",
  Object.entries(MUSCLE_DEFINITIONS).every(
    ([id, def]) =>
      def.id === id && def.name.length > 0 && def.bodyRegion.length > 0
  )
);
check(
  "getMuscleById(Chest) = Pectorales",
  getMuscleById(MuscleId.Chest)?.name === "Pectorales"
);
check("getAllMuscles() = 16", getAllMuscles().length === 16);

console.log("\nRegistro de ejercicios\n");

const registry = Object.entries(COMMON_EXERCISES);
check("registro con al menos 6 ejercicios", registry.length >= 6);
check(
  "todo ejercicio tiene id/slug/nombre y primarios no vacíos",
  registry.every(
    ([slug, ex]) =>
      ex.id.length > 0 &&
      ex.slug === slug &&
      ex.name.length > 0 &&
      ex.primaryMuscles.length > 0
  )
);
check(
  "todo músculo referenciado existe en MuscleId",
  registry.every(([, ex]) =>
    [...ex.primaryMuscles, ...(ex.secondaryMuscles ?? [])].every((m) =>
      muscleIds.includes(m)
    )
  )
);
check(
  "getExerciseBySlug('barbell-row')",
  getExerciseBySlug("barbell-row")?.name === "Barbell Row"
);
check(
  "slug inexistente → undefined",
  getExerciseBySlug("no-existe") === undefined
);
check(
  "getExerciseById coherente con slug",
  getExerciseById("barbell-row")?.slug === "barbell-row"
);
check(
  "searchExercises encuentra por alias en español",
  searchExercises("remo").some((ex) => ex.slug === "barbell-row")
);
check(
  "getExercisesByMuscle(Lats) no vacío",
  getExercisesByMuscle(MuscleId.Lats).length > 0
);
check(
  "Remo con Barra es PULL",
  getExerciseBySlug("barbell-row")?.movementPattern === MovementPattern.PULL
);

console.log("\nUtilidades de cálculo\n");

check("cn une y filtra falsy", cn("a", false, null, "b") === "a b");
const bmi = calculateBMI(88, 178);
check("BMI 88kg/178cm ≈ 27.8", Math.abs(bmi - 27.77) < 0.05, bmi);
check(
  "BMR Mifflin hombre 88/178/28",
  calculateBMR(88, 178, 28, "male") === 10 * 88 + 6.25 * 178 - 5 * 28 + 5
);
check(
  "BMR mujer resta 161",
  calculateBMR(62, 168, 26, "female") ===
    10 * 62 + 6.25 * 168 - 5 * 26 - 161
);
check(
  "TDEE = BMR × factor",
  calculateTDEE(1800, 1.55) === 1800 * 1.55
);
check(
  "1RM Epley 100kg×5 = 117",
  calculateOneRepMax(100, 5) === Math.round(100 * (1 + 5 / 30))
);
check("progreso +10%", calculateProgress(110, 100) === 10);
check("progreso base 0 → 0 (sin NaN)", calculateProgress(50, 0) === 0);
check("nivel inicial = 1", calculateLevel(0) === 1);
check("más XP ⇒ nivel no menor", calculateLevel(500) >= calculateLevel(100));

console.log(`\nResultado: ${passed} pass, ${failed} fail\n`);
process.exit(failed === 0 ? 0 : 1);
