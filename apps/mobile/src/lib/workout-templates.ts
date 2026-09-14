/**
 * Workout Templates & Quick-Start Programs
 * Pre-designed workout programs ready to use
 */

export type WorkoutGoal =
  | "muscle-building"
  | "strength"
  | "fat-loss"
  | "endurance"
  | "athletic-performance"
  | "beginner-fitness";

export type WorkoutSplit =
  | "full-body"
  | "upper-lower"
  | "push-pull-legs"
  | "bro-split"
  | "bodypart-split";

export interface TemplateExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: string; // "8-12", "12-15", "AMRAP", etc.
  rest: number; // seconds
  notes?: string;
  tempo?: string; // "3-0-1-0" (eccentric-pause-concentric-pause)
  rpe?: number; // Rate of perceived exertion (1-10)
}

export interface TemplateWorkout {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  exercises: TemplateExercise[];
  warmup?: string[];
  cooldown?: string[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  nameES: string;
  description: string;
  goal: WorkoutGoal;
  level: "beginner" | "intermediate" | "advanced";
  duration: string; // "4 weeks", "8 weeks", etc.
  frequency: string; // "3x/week", "4x/week", etc.
  split: WorkoutSplit;
  workouts: TemplateWorkout[];
  equipment: string[];
  benefits: string[];
  idealFor: string[];
  tags: string[];
}

/**
 * Complete library of workout templates
 */
export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  // BEGINNER TEMPLATES
  {
    id: "beginner-full-body",
    name: "Beginner Full Body 3x/Week",
    nameES: "Principiante Cuerpo Completo 3x/Semana",
    description: "Programa perfecto para comenzar en el gym. 3 entrenamientos de cuerpo completo por semana enfocados en aprender la técnica y construir base.",
    goal: "beginner-fitness",
    level: "beginner",
    duration: "8 semanas",
    frequency: "3x/semana",
    split: "full-body",
    equipment: ["barbell", "dumbbell", "machine", "bodyweight"],
    benefits: [
      "Aprende técnica correcta de ejercicios básicos",
      "Construye base de fuerza",
      "Frecuencia óptima para principiantes",
      "Bajo riesgo de sobreentrenamiento"
    ],
    idealFor: [
      "Personas que nunca entrenaron o vuelven después de años",
      "Quieren aprender los fundamentos",
      "Buscan rutina simple y efectiva"
    ],
    tags: ["beginner", "full-body", "technique", "base-building"],
    workouts: [
      {
        id: "beginner-workout-a",
        name: "Workout A - Full Body",
        description: "Enfoque en press y squat",
        duration: 60,
        warmup: [
          "5 min cardio ligero",
          "Movilidad de hombros y caderas",
          "Series de activación glúteos"
        ],
        exercises: [
          {
            exerciseId: "barbell-squat",
            exerciseName: "Sentadilla con Barra",
            sets: 3,
            reps: "8-10",
            rest: 120,
            notes: "Enfócate en técnica, no en peso",
            rpe: 7
          },
          {
            exerciseId: "bench-press",
            exerciseName: "Press de Banca",
            sets: 3,
            reps: "8-10",
            rest: 120,
            notes: "Agarre medio, baja controlado",
            rpe: 7
          },
          {
            exerciseId: "barbell-row",
            exerciseName: "Remo con Barra",
            sets: 3,
            reps: "10-12",
            rest: 90,
            notes: "Mantén espalda recta",
            rpe: 7
          },
          {
            exerciseId: "overhead-press",
            exerciseName: "Press Militar con Mancuernas",
            sets: 3,
            reps: "8-10",
            rest: 90,
            rpe: 7
          },
          {
            exerciseId: "plank",
            exerciseName: "Plancha",
            sets: 3,
            reps: "30-60 seg",
            rest: 60,
            notes: "Mantén core activado"
          }
        ],
        cooldown: [
          "Estiramiento de piernas",
          "Estiramiento de pecho y hombros",
          "5 min caminata ligera"
        ]
      },
      {
        id: "beginner-workout-b",
        name: "Workout B - Full Body",
        description: "Enfoque en deadlift y tracción",
        duration: 60,
        exercises: [
          {
            exerciseId: "deadlift",
            exerciseName: "Peso Muerto",
            sets: 3,
            reps: "6-8",
            rest: 150,
            notes: "Prioridad máxima: técnica perfecta",
            rpe: 7
          },
          {
            exerciseId: "dumbbell-press",
            exerciseName: "Press con Mancuernas",
            sets: 3,
            reps: "10-12",
            rest: 90,
            rpe: 7
          },
          {
            exerciseId: "pull-ups",
            exerciseName: "Dominadas Asistidas",
            sets: 3,
            reps: "5-8",
            rest: 120,
            notes: "Usa banda o máquina asistida si es necesario"
          },
          {
            exerciseId: "lunges",
            exerciseName: "Zancadas",
            sets: 3,
            reps: "10 por pierna",
            rest: 90,
            rpe: 7
          },
          {
            exerciseId: "barbell-curl",
            exerciseName: "Curl de Bíceps",
            sets: 3,
            reps: "10-12",
            rest: 60
          },
          {
            exerciseId: "tricep-dips",
            exerciseName: "Fondos en Banco",
            sets: 3,
            reps: "8-10",
            rest: 60
          }
        ]
      }
    ]
  },

  // MUSCLE BUILDING - PUSH PULL LEGS
  {
    id: "ppl-hypertrophy",
    name: "Push Pull Legs - Hypertrophy",
    nameES: "Empuje Tracción Piernas - Hipertrofia",
    description: "Programa clásico de 6 días para máximo crecimiento muscular. Split óptimo para volumen e intensidad.",
    goal: "muscle-building",
    level: "intermediate",
    duration: "12 semanas",
    frequency: "6x/semana (2 ciclos PPL)",
    split: "push-pull-legs",
    equipment: ["barbell", "dumbbell", "cable", "machine"],
    benefits: [
      "Alta frecuencia de entrenamiento por músculo (2x/semana)",
      "Volumen óptimo para hipertrofia",
      "Recuperación adecuada entre grupos musculares",
      "Máxima eficiencia de tiempo en el gym"
    ],
    idealFor: [
      "Intermedios con 1+ año de experiencia",
      "Objetivo principal: ganar masa muscular",
      "Pueden entrenar 6 días por semana",
      "Buena recuperación y nutrición"
    ],
    tags: ["hypertrophy", "ppl", "6-days", "intermediate", "mass-building"],
    workouts: [
      {
        id: "ppl-push-1",
        name: "Push Day 1 - Chest Focus",
        description: "Enfoque en pecho, hombros y tríceps - volumen pesado",
        duration: 75,
        exercises: [
          {
            exerciseId: "bench-press",
            exerciseName: "Press de Banca con Barra",
            sets: 4,
            reps: "6-8",
            rest: 180,
            notes: "Ejercicio principal pesado",
            rpe: 8
          },
          {
            exerciseId: "dumbbell-press",
            exerciseName: "Press Inclinado con Mancuernas",
            sets: 4,
            reps: "8-10",
            rest: 120,
            rpe: 8
          },
          {
            exerciseId: "dumbbell-flyes",
            exerciseName: "Aperturas con Mancuernas",
            sets: 3,
            reps: "10-12",
            rest: 90,
            notes: "Enfócate en stretch del pecho"
          },
          {
            exerciseId: "overhead-press",
            exerciseName: "Press Militar",
            sets: 4,
            reps: "8-10",
            rest: 120,
            rpe: 8
          },
          {
            exerciseId: "lateral-raises",
            exerciseName: "Elevaciones Laterales",
            sets: 4,
            reps: "12-15",
            rest: 60,
            notes: "Control total, sin momentum"
          },
          {
            exerciseId: "tricep-pushdown",
            exerciseName: "Extensiones de Tríceps en Polea",
            sets: 3,
            reps: "12-15",
            rest: 60
          },
          {
            exerciseId: "overhead-extension",
            exerciseName: "Extensión sobre Cabeza",
            sets: 3,
            reps: "10-12",
            rest: 60,
            notes: "Stretch completo del tríceps"
          }
        ]
      },
      {
        id: "ppl-pull-1",
        name: "Pull Day 1 - Back Width",
        description: "Enfoque en espalda, bíceps - ancho y grosor",
        duration: 75,
        exercises: [
          {
            exerciseId: "deadlift",
            exerciseName: "Peso Muerto",
            sets: 4,
            reps: "5-6",
            rest: 180,
            notes: "Pesado, técnica perfecta",
            rpe: 8
          },
          {
            exerciseId: "pull-ups",
            exerciseName: "Dominadas",
            sets: 4,
            reps: "8-10",
            rest: 120,
            notes: "Agrega peso si es fácil",
            rpe: 8
          },
          {
            exerciseId: "barbell-row",
            exerciseName: "Remo con Barra",
            sets: 4,
            reps: "8-10",
            rest: 120,
            rpe: 8
          },
          {
            exerciseId: "cable-row",
            exerciseName: "Remo en Polea Baja",
            sets: 3,
            reps: "10-12",
            rest: 90,
            notes: "Aprieta omóplatos"
          },
          {
            exerciseId: "face-pulls",
            exerciseName: "Face Pulls",
            sets: 4,
            reps: "15-20",
            rest: 60,
            notes: "Salud de hombros"
          },
          {
            exerciseId: "barbell-curl",
            exerciseName: "Curl con Barra",
            sets: 3,
            reps: "8-10",
            rest: 90,
            rpe: 8
          },
          {
            exerciseId: "hammer-curl",
            exerciseName: "Curl Martillo",
            sets: 3,
            reps: "10-12",
            rest: 60
          }
        ]
      },
      {
        id: "ppl-legs-1",
        name: "Legs Day 1 - Quad Focus",
        description: "Enfoque en cuádriceps, glúteos, isquios",
        duration: 80,
        exercises: [
          {
            exerciseId: "barbell-squat",
            exerciseName: "Sentadilla con Barra",
            sets: 5,
            reps: "6-8",
            rest: 180,
            notes: "Ejercicio rey de piernas",
            rpe: 9
          },
          {
            exerciseId: "front-squat",
            exerciseName: "Sentadilla Frontal",
            sets: 3,
            reps: "8-10",
            rest: 150,
            notes: "Más énfasis en cuádriceps"
          },
          {
            exerciseId: "leg-press",
            exerciseName: "Prensa",
            sets: 4,
            reps: "10-12",
            rest: 120,
            rpe: 8
          },
          {
            exerciseId: "leg-extension",
            exerciseName: "Extensiones de Cuádriceps",
            sets: 3,
            reps: "12-15",
            rest: 60,
            notes: "Aislamiento de cuádriceps"
          },
          {
            exerciseId: "romanian-deadlift",
            exerciseName: "Peso Muerto Rumano",
            sets: 4,
            reps: "10-12",
            rest: 90,
            notes: "Stretch de isquios"
          },
          {
            exerciseId: "leg-curl",
            exerciseName: "Curl de Isquios",
            sets: 3,
            reps: "12-15",
            rest: 60
          },
          {
            exerciseId: "calf-raises",
            exerciseName: "Elevaciones de Pantorrillas",
            sets: 5,
            reps: "15-20",
            rest: 60,
            notes: "Pausa en contracción"
          }
        ]
      }
    ]
  },

  // STRENGTH TRAINING
  {
    id: "strength-531",
    name: "5/3/1 Strength Program",
    nameES: "Programa de Fuerza 5/3/1",
    description: "Programa periodizado de Jim Wendler para desarrollo de fuerza máxima en los 4 grandes levantamientos.",
    goal: "strength",
    level: "intermediate",
    duration: "16 semanas (4 ciclos)",
    frequency: "4x/semana",
    split: "upper-lower",
    equipment: ["barbell", "dumbbell"],
    benefits: [
      "Ganancias consistentes de fuerza",
      "Periodización probada",
      "Evita estancamientos",
      "Balance entre volumen e intensidad"
    ],
    idealFor: [
      "Buscan aumentar fuerza en big 3 (squat, bench, deadlift)",
      "Tienen buena técnica en básicos",
      "Quieren programa estructurado a largo plazo"
    ],
    tags: ["strength", "531", "powerlifting", "periodization"],
    workouts: [
      {
        id: "531-week1-squat",
        name: "Week 1 - Squat Day (5x5)",
        description: "Semana 1: Sets de 5 reps",
        duration: 70,
        exercises: [
          {
            exerciseId: "barbell-squat",
            exerciseName: "Sentadilla - 5/3/1",
            sets: 3,
            reps: "5, 5, 5+",
            rest: 180,
            notes: "65%, 75%, 85% del 1RM. Última serie AMRAP",
            rpe: 9
          },
          {
            exerciseId: "front-squat",
            exerciseName: "Sentadilla Frontal",
            sets: 5,
            reps: "5",
            rest: 120,
            notes: "FSL: 5x5 al 65%"
          },
          {
            exerciseId: "leg-press",
            exerciseName: "Prensa",
            sets: 3,
            reps: "10-12",
            rest: 90,
            notes: "Trabajo accesorio"
          },
          {
            exerciseId: "leg-curl",
            exerciseName: "Curl de Isquios",
            sets: 3,
            reps: "12-15",
            rest: 60
          }
        ]
      },
      {
        id: "531-week1-bench",
        name: "Week 1 - Bench Day (5x5)",
        description: "Semana 1: Sets de 5 reps",
        duration: 70,
        exercises: [
          {
            exerciseId: "bench-press",
            exerciseName: "Press de Banca - 5/3/1",
            sets: 3,
            reps: "5, 5, 5+",
            rest: 180,
            notes: "65%, 75%, 85% del 1RM. Última serie AMRAP",
            rpe: 9
          },
          {
            exerciseId: "dumbbell-press",
            exerciseName: "Press con Mancuernas",
            sets: 5,
            reps: "8-10",
            rest: 120,
            notes: "Trabajo accesorio"
          },
          {
            exerciseId: "barbell-row",
            exerciseName: "Remo con Barra",
            sets: 5,
            reps: "8",
            rest: 90,
            notes: "Balance push-pull"
          },
          {
            exerciseId: "tricep-dips",
            exerciseName: "Fondos",
            sets: 3,
            reps: "10-12",
            rest: 90
          }
        ]
      }
    ]
  },

  // FAT LOSS
  {
    id: "fat-loss-circuit",
    name: "Fat Loss Circuit Training",
    nameES: "Circuitos para Pérdida de Grasa",
    description: "Programa de alta intensidad combinando fuerza y cardio para máxima quema de calorías.",
    goal: "fat-loss",
    level: "intermediate",
    duration: "8 semanas",
    frequency: "4-5x/semana",
    split: "full-body",
    equipment: ["dumbbell", "kettlebell", "bodyweight"],
    benefits: [
      "Alta quema calórica durante y después del entrenamiento",
      "Preserva masa muscular en déficit",
      "Mejora condicionamiento",
      "Entrenamientos cortos e intensos"
    ],
    idealFor: [
      "Objetivo primario: perder grasa",
      "Tiempo limitado (30-45 min)",
      "Disfrutan entrenamientos intensos",
      "Buena base cardiovascular"
    ],
    tags: ["fat-loss", "circuit", "hiit", "conditioning"],
    workouts: [
      {
        id: "circuit-upper",
        name: "Upper Body Circuit",
        description: "Circuito de tren superior",
        duration: 40,
        exercises: [
          {
            exerciseId: "push-ups",
            exerciseName: "Flexiones",
            sets: 4,
            reps: "15-20",
            rest: 30,
            notes: "Circuito: ejercicio tras ejercicio con descanso mínimo"
          },
          {
            exerciseId: "dumbbell-row",
            exerciseName: "Remo con Mancuerna",
            sets: 4,
            reps: "12 por brazo",
            rest: 30
          },
          {
            exerciseId: "overhead-press",
            exerciseName: "Press Militar",
            sets: 4,
            reps: "12-15",
            rest: 30
          },
          {
            exerciseId: "mountain-climbers",
            exerciseName: "Mountain Climbers",
            sets: 4,
            reps: "30 seg",
            rest: 30,
            notes: "Finisher cardio"
          }
        ]
      }
    ]
  }
];

/**
 * Get templates by goal
 */
export function getTemplatesByGoal(goal: WorkoutGoal): WorkoutTemplate[] {
  return WORKOUT_TEMPLATES.filter((t) => t.goal === goal);
}

/**
 * Get templates by level
 */
export function getTemplatesByLevel(
  level: "beginner" | "intermediate" | "advanced"
): WorkoutTemplate[] {
  return WORKOUT_TEMPLATES.filter((t) => t.level === level);
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): WorkoutTemplate | undefined {
  return WORKOUT_TEMPLATES.find((t) => t.id === id);
}

/**
 * Search templates
 */
export function searchTemplates(query: string): WorkoutTemplate[] {
  const lowerQuery = query.toLowerCase();
  return WORKOUT_TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.nameES.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some((tag) => tag.includes(lowerQuery))
  );
}

/**
 * Get recommended template based on user profile
 */
export function getRecommendedTemplate(profile: {
  level: "beginner" | "intermediate" | "advanced";
  goal: WorkoutGoal;
  daysPerWeek: number;
}): WorkoutTemplate | undefined {
  const templates = WORKOUT_TEMPLATES.filter(
    (t) => t.level === profile.level && t.goal === profile.goal
  );

  // Pick based on available days
  return templates[0]; // Simplificado, se puede mejorar con lógica
}
