/**
 * KinetixFitt Canonical Exercise Definition System
 * 
 * Defines structured exercise metadata to replace string-based parsing.
 * This provides a single source of truth for exercise visualization and domain logic.
 */

import { MuscleId, MuscleRole, MuscleActivation } from './muscle';

export enum MovementPattern {
  SQUAT = 'squat',
  HINGE = 'hinge',
  LUNGE = 'lunge',
  PUSH = 'push',
  PULL = 'pull',
  CARRY = 'carry',
  ROTATION = 'rotation',
}

export enum Equipment {
  BODYWEIGHT = 'bodyweight',
  BARBELL = 'barbell',
  DUMBBELL = 'dumbbell',
  KETTLEBELL = 'kettlebell',
  CABLE = 'cable',
  MACHINE = 'machine',
  RESISTANCE_BAND = 'resistance_band',
  MEDICINE_BALL = 'medicine_ball',
  FOAM_ROLLER = 'foam_roller',
}

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum Laterality {
  BILATERAL = 'bilateral',
  UNILATERAL_LEFT = 'unilateral_left',
  UNILATERAL_RIGHT = 'unilateral_right',
  UNILATERAL_ALTERNATING = 'unilateral_alternating',
}

export interface ExerciseVisualConfig {
  cameraPreset?: 'front' | 'rear' | 'side' | 'top' | 'default';
  showMuscles: boolean;
  showMovement: boolean;
  autoRotate?: boolean;
  muscleActivations: MuscleActivation[];
}

export interface ExerciseDefinition {
  id: string;
  slug: string;
  name: string;
  aliases?: string[];
  movementPattern: MovementPattern;
  primaryMuscles: MuscleId[];
  secondaryMuscles?: MuscleId[];
  stabilizerMuscles?: MuscleId[];
  equipment: Equipment[];
  difficulty: Difficulty;
  laterality: Laterality;
  instructions?: string[];
  cues?: string[];
  contraindications?: string[];
  visualConfig: ExerciseVisualConfig;
}

// Helper functions
export function createExerciseDefinition(
  config: Omit<ExerciseDefinition, 'visualConfig'> & {
    visualConfig?: Partial<ExerciseVisualConfig>;
  }
): ExerciseDefinition {
  const muscleActivations: MuscleActivation[] = [
    ...config.primaryMuscles.map((muscleId) => ({
      muscleId,
      role: MuscleRole.PRIMARY,
      intensity: 1.0,
    })),
    ...(config.secondaryMuscles?.map((muscleId) => ({
      muscleId,
      role: MuscleRole.SECONDARY,
      intensity: 0.6,
    })) || []),
    ...(config.stabilizerMuscles?.map((muscleId) => ({
      muscleId,
      role: MuscleRole.STABILIZER,
      intensity: 0.3,
    })) || []),
  ];

  return {
    ...config,
    secondaryMuscles: config.secondaryMuscles || [],
    stabilizerMuscles: config.stabilizerMuscles || [],
    visualConfig: {
      showMuscles: true,
      showMovement: true,
      autoRotate: false,
      muscleActivations,
      ...config.visualConfig,
    },
  };
}

export function getPrimaryMuscles(exercise: ExerciseDefinition): MuscleId[] {
  return exercise.primaryMuscles;
}

export function getAllActiveMuscles(exercise: ExerciseDefinition): MuscleActivation[] {
  return exercise.visualConfig.muscleActivations;
}

export function hasMuscle(
  exercise: ExerciseDefinition,
  muscleId: MuscleId
): boolean {
  return exercise.visualConfig.muscleActivations.some(
    (activation) => activation.muscleId === muscleId
  );
}

// Common exercise definitions - TODO: expand with real data
export const COMMON_EXERCISES: Record<string, ExerciseDefinition> = {
  'bench-press': createExerciseDefinition({
    id: 'bench-press',
    slug: 'bench-press',
    name: 'Bench Press',
    aliases: ['Press de Banca', 'Press Plano'],
    movementPattern: MovementPattern.PUSH,
    primaryMuscles: [MuscleId.Chest],
    secondaryMuscles: [MuscleId.FrontDeltoid, MuscleId.Triceps],
    equipment: [Equipment.BARBELL, Equipment.DUMBBELL],
    difficulty: Difficulty.INTERMEDIATE,
    laterality: Laterality.BILATERAL,
    visualConfig: {
      cameraPreset: 'front',
    },
  }),
  squat: createExerciseDefinition({
    id: 'squat',
    slug: 'squat',
    name: 'Squat',
    aliases: ['Sentadilla', 'Back Squat'],
    movementPattern: MovementPattern.SQUAT,
    primaryMuscles: [MuscleId.Quads, MuscleId.Glutes],
    secondaryMuscles: [MuscleId.Hamstrings],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.INTERMEDIATE,
    laterality: Laterality.BILATERAL,
    visualConfig: {
      cameraPreset: 'side',
    },
  }),
  deadlift: createExerciseDefinition({
    id: 'deadlift',
    slug: 'deadlift',
    name: 'Deadlift',
    aliases: ['Peso Muerto'],
    movementPattern: MovementPattern.HINGE,
    primaryMuscles: [MuscleId.ErectorSpinae, MuscleId.Hamstrings, MuscleId.Glutes],
    secondaryMuscles: [MuscleId.Lats, MuscleId.Traps],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.ADVANCED,
    laterality: Laterality.BILATERAL,
    visualConfig: {
      cameraPreset: 'side',
    },
  }),
  'shoulder-press': createExerciseDefinition({
    id: 'shoulder-press',
    slug: 'shoulder-press',
    name: 'Shoulder Press',
    aliases: ['Press Militar', 'Overhead Press'],
    movementPattern: MovementPattern.PUSH,
    primaryMuscles: [MuscleId.FrontDeltoid, MuscleId.LateralDeltoid],
    secondaryMuscles: [MuscleId.Triceps],
    stabilizerMuscles: [MuscleId.Abs, MuscleId.Obliques],
    equipment: [Equipment.BARBELL, Equipment.DUMBBELL],
    difficulty: Difficulty.INTERMEDIATE,
    laterality: Laterality.BILATERAL,
    visualConfig: {
      cameraPreset: 'front',
    },
  }),
  'bicep-curl': createExerciseDefinition({
    id: 'bicep-curl',
    slug: 'bicep-curl',
    name: 'Bicep Curl',
    aliases: ['Curl de Bíceps'],
    movementPattern: MovementPattern.PULL,
    primaryMuscles: [MuscleId.Biceps],
    equipment: [Equipment.DUMBBELL, Equipment.BARBELL, Equipment.CABLE],
    difficulty: Difficulty.BEGINNER,
    laterality: Laterality.UNILATERAL_ALTERNATING,
    visualConfig: {
      cameraPreset: 'front',
    },
  }),
  'barbell-row': createExerciseDefinition({
    id: 'barbell-row',
    slug: 'barbell-row',
    name: 'Barbell Row',
    aliases: ['Remo con Barra', 'Bent Over Row'],
    movementPattern: MovementPattern.PULL,
    primaryMuscles: [MuscleId.Lats, MuscleId.Rhomboids],
    secondaryMuscles: [MuscleId.Traps, MuscleId.RearDeltoid],
    stabilizerMuscles: [MuscleId.ErectorSpinae, MuscleId.Biceps],
    equipment: [Equipment.BARBELL],
    difficulty: Difficulty.INTERMEDIATE,
    laterality: Laterality.BILATERAL,
    visualConfig: {
      cameraPreset: 'side',
    },
  }),
};

export function getExerciseBySlug(slug: string): ExerciseDefinition | undefined {
  return COMMON_EXERCISES[slug];
}

export function getExerciseById(id: string): ExerciseDefinition | undefined {
  return Object.values(COMMON_EXERCISES).find((ex) => ex.id === id);
}

export function searchExercises(query: string): ExerciseDefinition[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(COMMON_EXERCISES).filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(lowerQuery) ||
      exercise.slug.includes(lowerQuery) ||
      exercise.aliases?.some((alias) => alias.toLowerCase().includes(lowerQuery))
  );
}

export function getExercisesByMovementPattern(
  pattern: MovementPattern
): ExerciseDefinition[] {
  return Object.values(COMMON_EXERCISES).filter(
    (exercise) => exercise.movementPattern === pattern
  );
}

export function getExercisesByMuscle(
  muscleId: MuscleId
): ExerciseDefinition[] {
  return Object.values(COMMON_EXERCISES).filter((exercise) =>
    hasMuscle(exercise, muscleId)
  );
}

export function getExercisesByDifficulty(
  difficulty: Difficulty
): ExerciseDefinition[] {
  return Object.values(COMMON_EXERCISES).filter(
    (exercise) => exercise.difficulty === difficulty
  );
}
