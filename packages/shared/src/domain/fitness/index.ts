/**
 * KinetixFitt Fitness Domain - Public API
 * 
 * Canonical fitness domain models and utilities.
 * This is the single source of truth for fitness concepts.
 */

export type {
  MuscleDefinition,
  MuscleActivation,
} from './muscle';

export {
  MuscleId,
  MuscleRole,
  MUSCLE_DEFINITIONS,
  getMuscleById,
  getAllMuscles,
  getMusclesByRegion,
} from './muscle';

export type {
  ExerciseVisualConfig,
  ExerciseDefinition,
} from './exercise';

export {
  MovementPattern,
  Equipment,
  Difficulty,
  Laterality,
  createExerciseDefinition,
  getPrimaryMuscles,
  getAllActiveMuscles,
  hasMuscle,
  COMMON_EXERCISES,
  getExerciseBySlug,
  getExerciseById,
  searchExercises,
  getExercisesByMovementPattern,
  getExercisesByMuscle,
  getExercisesByDifficulty,
} from './exercise';
