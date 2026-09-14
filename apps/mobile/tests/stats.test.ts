/**
 * Tests unitarios de src/lib/stats.ts (sin base de datos).
 *
 * Cubren la definición de adherencia (ventana móvil de 4 semanas) y las reglas
 * de racha y PRs, que son la base de los KPIs del dashboard y de progreso.
 *
 *   npm run test:stats
 */
import {
  computeAdherence,
  sessionsInWindow,
  computeStreak,
  countPRs,
  ADHERENCE_WINDOW_DAYS,
} from "../src/lib/stats";

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

const DAY = 24 * 60 * 60 * 1000;

// `now` fijo para las funciones que lo aceptan (deterministas).
const NOW = new Date("2026-09-11T12:00:00-03:00");
const before = (n: number) => new Date(NOW.getTime() - n * DAY);

// `computeStreak` usa la fecha real del sistema, así que se prueba con ella.
const REAL_TODAY = new Date();
const ago = (n: number) => new Date(REAL_TODAY.getTime() - n * DAY);

function main() {
  console.log("Test: stats — adherencia, racha y PRs\n");

  // ---- Adherencia: ventana de 4 semanas (28 días), objetivo = frecuencia × 4
  check("ADHERENCE_WINDOW_DAYS es 28", ADHERENCE_WINDOW_DAYS === 28);
  check("sin sesiones -> 0", computeAdherence([], 4, 28, NOW) === 0);
  check(
    "16 sesiones con frecuencia 4 (objetivo 16) -> 100",
    computeAdherence(Array.from({ length: 16 }, (_, i) => before(i)), 4, 28, NOW) === 100
  );
  check(
    "4 sesiones con frecuencia 4 -> 25",
    computeAdherence(Array.from({ length: 4 }, (_, i) => before(i)), 4, 28, NOW) === 25
  );
  check(
    "20 sesiones -> 100 (se satura, no supera el 100%)",
    computeAdherence(Array.from({ length: 20 }, (_, i) => before(i)), 4, 28, NOW) === 100
  );
  check(
    "sesiones de hace 40 días NO cuentan (ventana móvil)",
    computeAdherence([before(40), before(45)], 4, 28, NOW) === 0
  );
  check(
    "frecuencia 0 se interpreta como 4",
    computeAdherence(Array.from({ length: 4 }, (_, i) => before(i)), 0, 28, NOW) === 25
  );
  check(
    "el numerador histórico ya no satura: 100 sesiones viejas -> 0",
    computeAdherence(Array.from({ length: 100 }, (_, i) => before(30 + i)), 4, 28, NOW) === 0
  );

  // ---- sessionsInWindow: bordes
  check("sesión justo en el borde (28 días) cuenta", sessionsInWindow([before(28)], 28, NOW) === 1);
  check("sesión de 29 días no cuenta", sessionsInWindow([before(29)], 28, NOW) === 0);

  // ---- Racha
  check("racha de 3 días consecutivos -> 3", computeStreak([ago(0), ago(1), ago(2)]) === 3);
  check("racha corta si hay hueco -> 1", computeStreak([ago(0), ago(3)]) === 1);
  check("sin fechas -> 0", computeStreak([]) === 0);

  // ---- PRs: regla de sesión (los calentamientos no inflan)
  check(
    "PR: solo cuenta cuando supera el máximo previo",
    countPRs([
      { exerciseName: "Press banca", weight: 60, date: ago(5) },
      { exerciseName: "Press banca", weight: 65, date: ago(3) },
      { exerciseName: "Press banca", weight: 62, date: ago(1) },
    ]) === 1
  );
  check(
    "PR: series de aproximación en la misma sesión no inflan",
    countPRs([
      { exerciseName: "Press banca", weight: 40, date: ago(2) },
      { exerciseName: "Press banca", weight: 60, date: ago(2) },
      { exerciseName: "Press banca", weight: 80, date: ago(2) },
    ]) === 0
  );
  check(
    "PR: un ejercicio nuevo es línea base, no récord",
    countPRs([{ exerciseName: "Sentadilla", weight: 100, date: ago(1) }]) === 0
  );

  console.log(`\nResultado: ${passed} pass, ${failed} fail`);
  if (failed > 0) process.exitCode = 1;
}

main();
