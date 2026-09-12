/**
 * Exercise Library
 * Comprehensive database of exercises with categories, muscle groups, and equipment
 */

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "forearms"
  | "abs"
  | "obliques"
  | "quadriceps"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "full-body";

export type ExerciseCategory =
  | "strength"
  | "cardio"
  | "flexibility"
  | "plyometric"
  | "olympic"
  | "powerlifting"
  | "bodyweight"
  | "functional";

export type Equipment =
  | "barbell"
  | "dumbbell"
  | "kettlebell"
  | "cable"
  | "machine"
  | "bodyweight"
  | "resistance-band"
  | "trx"
  | "bosu"
  | "medicine-ball"
  | "none";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export interface Exercise {
  id: string;
  name: string;
  nameES: string;
  category: ExerciseCategory;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment[];
  difficulty: Difficulty;
  description: string;
  instructions: string[];
  tips: string[];
  videoUrl?: string;
  gifUrl?: string;
  variations?: string[];
  commonMistakes?: string[];
  benefits?: string[];
}

/**
 * Complete exercise database
 * 100+ exercises across all major categories
 */
export const EXERCISE_LIBRARY: Exercise[] = [
  // CHEST EXERCISES
  {
    id: "bench-press",
    name: "Barbell Bench Press",
    nameES: "Press de Banca con Barra",
    category: "strength",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: ["barbell"],
    difficulty: "intermediate",
    description: "El ejercicio fundamental para desarrollar pecho, fuerza y masa muscular del tren superior.",
    instructions: [
      "Acuéstate en el banco con los pies firmes en el suelo",
      "Agarra la barra con un agarre más ancho que los hombros",
      "Baja la barra controladamente hasta el pecho",
      "Empuja la barra hacia arriba hasta extender los brazos",
      "Mantén los omóplatos retraídos durante todo el movimiento"
    ],
    tips: [
      "No rebotes la barra en el pecho",
      "Mantén los codos a 45° del cuerpo",
      "Respira: inhala al bajar, exhala al subir"
    ],
    variations: ["Incline Bench Press", "Decline Bench Press", "Close-Grip Bench Press"],
    commonMistakes: [
      "Arquear demasiado la espalda",
      "Levantar los glúteos del banco",
      "Codos muy abiertos (90°)"
    ],
    benefits: [
      "Desarrollo de pecho, hombros y tríceps",
      "Mejora fuerza del press",
      "Ejercicio compuesto fundamental"
    ]
  },
  {
    id: "dumbbell-press",
    name: "Dumbbell Bench Press",
    nameES: "Press de Banca con Mancuernas",
    category: "strength",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: ["dumbbell"],
    difficulty: "intermediate",
    description: "Variante con mancuernas que permite mayor rango de movimiento y trabajo unilateral.",
    instructions: [
      "Acuéstate en el banco con una mancuerna en cada mano",
      "Posiciona las mancuernas a los lados del pecho",
      "Empuja ambas mancuernas hacia arriba simultáneamente",
      "Baja controladamente hasta sentir estiramiento en el pecho"
    ],
    tips: [
      "Permite mayor rango de movimiento que la barra",
      "Corrige desbalances musculares",
      "Mantén muñecas neutras"
    ],
    variations: ["Incline Dumbbell Press", "Decline Dumbbell Press", "Single-Arm Dumbbell Press"]
  },
  {
    id: "push-ups",
    name: "Push-Ups",
    nameES: "Flexiones de Brazos",
    category: "bodyweight",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps", "shoulders", "abs"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    description: "Ejercicio clásico de peso corporal para pecho y estabilidad core.",
    instructions: [
      "Posición de plancha con manos a la anchura de hombros",
      "Baja el cuerpo manteniendo una línea recta",
      "Desciende hasta que el pecho casi toque el suelo",
      "Empuja hacia arriba hasta extender los brazos"
    ],
    tips: [
      "No dejes caer las caderas",
      "Mantén core activado",
      "Codos a 45° del cuerpo"
    ],
    variations: ["Diamond Push-Ups", "Wide Push-Ups", "Decline Push-Ups", "Archer Push-Ups"]
  },
  
  // BACK EXERCISES
  {
    id: "deadlift",
    name: "Barbell Deadlift",
    nameES: "Peso Muerto con Barra",
    category: "powerlifting",
    primaryMuscles: ["back", "glutes", "hamstrings"],
    secondaryMuscles: ["forearms", "abs", "quadriceps"],
    equipment: ["barbell"],
    difficulty: "advanced",
    description: "El rey de los ejercicios. Desarrolla fuerza total del cuerpo.",
    instructions: [
      "Párate con los pies al ancho de caderas, barra sobre medio pie",
      "Agarra la barra con agarre pronado o mixto",
      "Mantén espalda recta, pecho hacia afuera",
      "Levanta la barra extendiendo caderas y rodillas simultáneamente",
      "Bloquea en la posición superior, luego baja controladamente"
    ],
    tips: [
      "Mantén la barra pegada al cuerpo",
      "No redondees la espalda baja",
      "Activa los lats antes de levantar"
    ],
    variations: ["Romanian Deadlift", "Sumo Deadlift", "Trap Bar Deadlift"],
    commonMistakes: [
      "Redondear la espalda",
      "Empezar con caderas muy altas o bajas",
      "Alejar la barra del cuerpo"
    ],
    benefits: [
      "Desarrollo de fuerza total",
      "Trabaja toda la cadena posterior",
      "Mejora postura y estabilidad"
    ]
  },
  {
    id: "pull-ups",
    name: "Pull-Ups",
    nameES: "Dominadas",
    category: "bodyweight",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps", "forearms"],
    equipment: ["bodyweight"],
    difficulty: "intermediate",
    description: "Ejercicio fundamental para desarrollo de espalda y fuerza de tracción.",
    instructions: [
      "Cuélgate de la barra con agarre pronado, manos más anchas que hombros",
      "Depresión escapular y activación de lats",
      "Tira hacia arriba hasta que la barbilla pase la barra",
      "Baja controladamente hasta extensión completa"
    ],
    tips: [
      "Evita kipping (balanceo)",
      "Mantén core activado",
      "Full range of motion"
    ],
    variations: ["Chin-Ups", "Wide-Grip Pull-Ups", "Weighted Pull-Ups", "Archer Pull-Ups"]
  },
  {
    id: "barbell-row",
    name: "Barbell Bent-Over Row",
    nameES: "Remo con Barra Inclinado",
    category: "strength",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps", "forearms"],
    equipment: ["barbell"],
    difficulty: "intermediate",
    description: "Ejercicio compuesto para grosor y desarrollo de la espalda media.",
    instructions: [
      "Inclínate hacia adelante con espalda recta, rodillas ligeramente flexionadas",
      "Agarra la barra con agarre pronado o supino",
      "Tira de la barra hacia el abdomen bajo",
      "Aprieta los omóplatos en la parte superior",
      "Baja controladamente"
    ],
    tips: [
      "Mantén espalda neutral, no redondees",
      "Tira con los codos, no con las manos",
      "Controla el movimiento, sin momentum"
    ],
    variations: ["Pendlay Row", "Yates Row", "Underhand Barbell Row"]
  },

  // SHOULDER EXERCISES
  {
    id: "overhead-press",
    name: "Overhead Press",
    nameES: "Press Militar",
    category: "strength",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["triceps", "abs"],
    equipment: ["barbell"],
    difficulty: "intermediate",
    description: "Ejercicio fundamental para desarrollo de hombros y fuerza overhead.",
    instructions: [
      "Párate con pies al ancho de hombros, barra a nivel de clavículas",
      "Agarra la barra con agarre justo afuera de los hombros",
      "Empuja la barra verticalmente por encima de la cabeza",
      "Bloquea con brazos extendidos, barra sobre talones",
      "Baja controladamente a posición inicial"
    ],
    tips: [
      "Activa glúteos y abs para estabilidad",
      "No arquees excesivamente la espalda",
      "Empuja la cabeza adelante al pasar la barra"
    ],
    variations: ["Seated Overhead Press", "Dumbbell Shoulder Press", "Arnold Press"]
  },
  {
    id: "lateral-raises",
    name: "Dumbbell Lateral Raises",
    nameES: "Elevaciones Laterales con Mancuernas",
    category: "strength",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: [],
    equipment: ["dumbbell"],
    difficulty: "beginner",
    description: "Aislamiento del deltoides lateral para anchura de hombros.",
    instructions: [
      "Párate con mancuernas a los lados, ligera flexión en codos",
      "Eleva los brazos lateralmente hasta que estén paralelos al suelo",
      "Mantén la posición un segundo",
      "Baja controladamente"
    ],
    tips: [
      "No uses momentum, movimiento controlado",
      "Ligera inclinación hacia adelante",
      "Pulgar ligeramente más bajo que meñique al subir"
    ],
    variations: ["Cable Lateral Raises", "Seated Lateral Raises", "Leaning Lateral Raises"]
  },

  // LEG EXERCISES
  {
    id: "barbell-squat",
    name: "Barbell Back Squat",
    nameES: "Sentadilla con Barra",
    category: "powerlifting",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "abs"],
    equipment: ["barbell"],
    difficulty: "intermediate",
    description: "El rey de los ejercicios de pierna. Desarrollo completo del tren inferior.",
    instructions: [
      "Coloca la barra en la parte superior de la espalda (trapecio)",
      "Pies al ancho de hombros, dedos ligeramente hacia afuera",
      "Desciende empujando caderas atrás y doblando rodillas",
      "Baja hasta que muslos estén paralelos al suelo (o más)",
      "Empuja a través de los talones para volver a la posición inicial"
    ],
    tips: [
      "Mantén pecho hacia arriba y espalda recta",
      "Rodillas en línea con los pies, no colapsen hacia adentro",
      "Respira profundo antes de bajar, exhala al subir"
    ],
    variations: ["Front Squat", "High Bar Squat", "Low Bar Squat", "Box Squat"],
    commonMistakes: [
      "Rodillas colapsando hacia adentro",
      "Talones levantándose del suelo",
      "Espalda redondeada"
    ],
    benefits: [
      "Máximo desarrollo de piernas",
      "Mejora fuerza funcional",
      "Aumenta producción hormonal"
    ]
  },
  {
    id: "lunges",
    name: "Walking Lunges",
    nameES: "Zancadas Caminando",
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "calves"],
    equipment: ["dumbbell", "bodyweight"],
    difficulty: "beginner",
    description: "Ejercicio unilateral para desarrollo de piernas y equilibrio.",
    instructions: [
      "Párate derecho con mancuernas en los lados (opcional)",
      "Da un paso largo hacia adelante con una pierna",
      "Baja hasta que ambas rodillas estén a 90°",
      "Empuja con el pie delantero y da un paso con la otra pierna",
      "Continúa alternando"
    ],
    tips: [
      "Mantén torso erguido",
      "Rodilla trasera casi toca el suelo",
      "No dejes que la rodilla delantera pase los dedos del pie"
    ],
    variations: ["Reverse Lunges", "Bulgarian Split Squat", "Lateral Lunges"]
  },
  {
    id: "leg-press",
    name: "Leg Press",
    nameES: "Prensa de Piernas",
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings"],
    equipment: ["machine"],
    difficulty: "beginner",
    description: "Ejercicio de máquina para desarrollo de piernas con carga alta y riesgo bajo.",
    instructions: [
      "Siéntate en la máquina con espalda completamente apoyada",
      "Pies al ancho de hombros en la plataforma",
      "Desbloquea la plataforma y baja controladamente",
      "Baja hasta que rodillas estén a 90°",
      "Empuja a través de los talones para extender"
    ],
    tips: [
      "No levantes glúteos del asiento",
      "Rango completo de movimiento",
      "Controla la bajada, no dejes caer"
    ],
    variations: ["Single-Leg Press", "High Feet Placement", "Low Feet Placement"]
  },

  // ARM EXERCISES
  {
    id: "barbell-curl",
    name: "Barbell Bicep Curl",
    nameES: "Curl de Bíceps con Barra",
    category: "strength",
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    equipment: ["barbell"],
    difficulty: "beginner",
    description: "Ejercicio clásico para desarrollo de bíceps.",
    instructions: [
      "Párate con barra en agarre supino, manos al ancho de hombros",
      "Codos pegados a los costados del cuerpo",
      "Curl la barra hacia los hombros contrayendo bíceps",
      "Mantén la contracción arriba",
      "Baja controladamente"
    ],
    tips: [
      "No balancees el cuerpo (cheating)",
      "Codos fijos, solo se mueven antebrazos",
      "Aprieta bíceps en la parte superior"
    ],
    variations: ["EZ-Bar Curl", "Close-Grip Curl", "Wide-Grip Curl"]
  },
  {
    id: "tricep-dips",
    name: "Tricep Dips",
    nameES: "Fondos en Paralelas",
    category: "bodyweight",
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "shoulders"],
    equipment: ["bodyweight"],
    difficulty: "intermediate",
    description: "Ejercicio compuesto para desarrollo de tríceps con peso corporal.",
    instructions: [
      "Agarra barras paralelas, cuerpo suspendido con brazos extendidos",
      "Inclínate ligeramente hacia adelante",
      "Baja doblando codos hasta 90°",
      "Empuja hacia arriba hasta extensión completa"
    ],
    tips: [
      "Más vertical = más tríceps. Más inclinado = más pecho",
      "Mantén hombros deprimidos",
      "Control en la bajada"
    ],
    variations: ["Weighted Dips", "Bench Dips", "Ring Dips"]
  },

  // CORE EXERCISES
  {
    id: "plank",
    name: "Plank",
    nameES: "Plancha",
    category: "bodyweight",
    primaryMuscles: ["abs"],
    secondaryMuscles: ["shoulders", "glutes"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    description: "Ejercicio isométrico fundamental para fortalecimiento del core.",
    instructions: [
      "Posición de antebrazo en el suelo, codos bajo hombros",
      "Extiende piernas, apoyo en antepies",
      "Mantén cuerpo en línea recta de cabeza a talones",
      "Activa abs y glúteos",
      "Mantén la posición"
    ],
    tips: [
      "No dejes caer las caderas",
      "No levantes glúteos demasiado alto",
      "Respira normalmente"
    ],
    variations: ["Side Plank", "Plank Up-Downs", "Plank Shoulder Taps", "RKC Plank"]
  },
  {
    id: "hanging-leg-raises",
    name: "Hanging Leg Raises",
    nameES: "Elevaciones de Piernas Colgado",
    category: "bodyweight",
    primaryMuscles: ["abs"],
    secondaryMuscles: ["forearms"],
    equipment: ["bodyweight"],
    difficulty: "advanced",
    description: "Ejercicio avanzado para desarrollo de abdominales inferiores.",
    instructions: [
      "Cuélgate de una barra con agarre pronado",
      "Mantén piernas juntas y extendidas (o rodillas dobladas para más fácil)",
      "Eleva las piernas hasta que estén paralelas al suelo o más",
      "Baja controladamente"
    ],
    tips: [
      "No balancees (momentum)",
      "Inicia el movimiento desde pelvis, no desde piernas",
      "Exhala al subir"
    ],
    variations: ["Knee Raises", "Toes to Bar", "L-Sit Holds"]
  }
];

/**
 * Get exercises by muscle group
 */
export function getExercisesByMuscle(muscle: MuscleGroup): Exercise[] {
  return EXERCISE_LIBRARY.filter(
    (ex) =>
      ex.primaryMuscles.includes(muscle) || ex.secondaryMuscles.includes(muscle)
  );
}

/**
 * Get exercises by category
 */
export function getExercisesByCategory(category: ExerciseCategory): Exercise[] {
  return EXERCISE_LIBRARY.filter((ex) => ex.category === category);
}

/**
 * Get exercises by equipment
 */
export function getExercisesByEquipment(equipment: Equipment): Exercise[] {
  return EXERCISE_LIBRARY.filter((ex) => ex.equipment.includes(equipment));
}

/**
 * Get exercises by difficulty
 */
export function getExercisesByDifficulty(difficulty: Difficulty): Exercise[] {
  return EXERCISE_LIBRARY.filter((ex) => ex.difficulty === difficulty);
}

/**
 * Search exercises
 */
export function searchExercises(query: string): Exercise[] {
  const lowerQuery = query.toLowerCase();
  return EXERCISE_LIBRARY.filter(
    (ex) =>
      ex.name.toLowerCase().includes(lowerQuery) ||
      ex.nameES.toLowerCase().includes(lowerQuery) ||
      ex.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get random exercises
 */
export function getRandomExercises(count: number = 5): Exercise[] {
  const shuffled = [...EXERCISE_LIBRARY].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get exercise by ID
 */
export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISE_LIBRARY.find((ex) => ex.id === id);
}

/**
 * Get compound exercises (multi-joint)
 */
export function getCompoundExercises(): Exercise[] {
  const compoundIds = [
    "bench-press",
    "deadlift",
    "barbell-squat",
    "overhead-press",
    "barbell-row",
    "pull-ups",
    "dumbbell-press",
    "lunges",
  ];
  return EXERCISE_LIBRARY.filter((ex) => compoundIds.includes(ex.id));
}

/**
 * Get isolation exercises (single-joint)
 */
export function getIsolationExercises(): Exercise[] {
  const compoundIds = [
    "bench-press",
    "deadlift",
    "barbell-squat",
    "overhead-press",
    "barbell-row",
    "pull-ups",
    "dumbbell-press",
    "lunges",
  ];
  return EXERCISE_LIBRARY.filter((ex) => !compoundIds.includes(ex.id));
}
