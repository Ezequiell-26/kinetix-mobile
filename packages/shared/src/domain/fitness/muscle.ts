/**
 * KinetixFitt Canonical Muscle Model
 * 
 * Defines the canonical muscle groups used throughout the application.
 * Each muscle has a unique ID and belongs to a primary body region.
 */

export enum MuscleId {
  // Chest
  Chest = 'chest',
  
  // Shoulders
  FrontDeltoid = 'frontDeltoid',
  LateralDeltoid = 'lateralDeltoid',
  RearDeltoid = 'rearDeltoid',
  
  // Arms
  Biceps = 'biceps',
  Triceps = 'triceps',
  
  // Back
  Lats = 'lats',
  Traps = 'traps',
  Rhomboids = 'rhomboids',
  ErectorSpinae = 'erectorSpinae',
  
  // Core
  Abs = 'abs',
  Obliques = 'obliques',
  
  // Lower Body
  Glutes = 'glutes',
  Quads = 'quads',
  Hamstrings = 'hamstrings',
  Calves = 'calves',
}

export enum MuscleRole {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  STABILIZER = 'stabilizer',
}

export interface MuscleDefinition {
  id: MuscleId;
  name: string;
  bodyRegion: string;
  description?: string;
}

export const MUSCLE_DEFINITIONS: Record<MuscleId, MuscleDefinition> = {
  [MuscleId.Chest]: {
    id: MuscleId.Chest,
    name: 'Pectorales',
    bodyRegion: 'Torso',
    description: 'Músculos del pecho',
  },
  [MuscleId.FrontDeltoid]: {
    id: MuscleId.FrontDeltoid,
    name: 'Deltoides Frontal',
    bodyRegion: 'Hombros',
    description: 'Parte frontal del hombro',
  },
  [MuscleId.LateralDeltoid]: {
    id: MuscleId.LateralDeltoid,
    name: 'Deltoides Lateral',
    bodyRegion: 'Hombros',
    description: 'Parte lateral del hombro',
  },
  [MuscleId.RearDeltoid]: {
    id: MuscleId.RearDeltoid,
    name: 'Deltoides Posterior',
    bodyRegion: 'Hombros',
    description: 'Parte posterior del hombro',
  },
  [MuscleId.Biceps]: {
    id: MuscleId.Biceps,
    name: 'Bíceps',
    bodyRegion: 'Brazos',
    description: 'Músculo frontal del brazo',
  },
  [MuscleId.Triceps]: {
    id: MuscleId.Triceps,
    name: 'Tríceps',
    bodyRegion: 'Brazos',
    description: 'Músculo posterior del brazo',
  },
  [MuscleId.Lats]: {
    id: MuscleId.Lats,
    name: 'Dorsales',
    bodyRegion: 'Espalda',
    description: 'Músculos anchos de la espalda',
  },
  [MuscleId.Traps]: {
    id: MuscleId.Traps,
    name: 'Trapecios',
    bodyRegion: 'Espalda',
    description: 'Músculos superiores de la espalda',
  },
  [MuscleId.Rhomboids]: {
    id: MuscleId.Rhomboids,
    name: 'Romboides',
    bodyRegion: 'Espalda',
    description: 'Músculos entre los omóplatos',
  },
  [MuscleId.ErectorSpinae]: {
    id: MuscleId.ErectorSpinae,
    name: 'Erector Espinal',
    bodyRegion: 'Espalda',
    description: 'Músculos a lo largo de la columna',
  },
  [MuscleId.Abs]: {
    id: MuscleId.Abs,
    name: 'Abdominales',
    bodyRegion: 'Core',
    description: 'Músculos frontales del abdomen',
  },
  [MuscleId.Obliques]: {
    id: MuscleId.Obliques,
    name: 'Oblicuos',
    bodyRegion: 'Core',
    description: 'Músculos laterales del abdomen',
  },
  [MuscleId.Glutes]: {
    id: MuscleId.Glutes,
    name: 'Glúteos',
    bodyRegion: 'Piernas',
    description: 'Músculos de los glúteos',
  },
  [MuscleId.Quads]: {
    id: MuscleId.Quads,
    name: 'Cuádriceps',
    bodyRegion: 'Piernas',
    description: 'Músculos frontales del muslo',
  },
  [MuscleId.Hamstrings]: {
    id: MuscleId.Hamstrings,
    name: 'Isquiotibiales',
    bodyRegion: 'Piernas',
    description: 'Músculos posteriores del muslo',
  },
  [MuscleId.Calves]: {
    id: MuscleId.Calves,
    name: 'Gemelos',
    bodyRegion: 'Piernas',
    description: 'Músculos de la pantorrilla',
  },
};

export interface MuscleActivation {
  muscleId: MuscleId;
  role: MuscleRole;
  intensity?: number; // 0-1 normalized
}

export function getMuscleById(id: MuscleId): MuscleDefinition | undefined {
  return MUSCLE_DEFINITIONS[id];
}

export function getAllMuscles(): MuscleDefinition[] {
  return Object.values(MUSCLE_DEFINITIONS);
}

export function getMusclesByRegion(region: string): MuscleDefinition[] {
  return Object.values(MUSCLE_DEFINITIONS).filter(
    (muscle) => muscle.bodyRegion === region
  );
}
