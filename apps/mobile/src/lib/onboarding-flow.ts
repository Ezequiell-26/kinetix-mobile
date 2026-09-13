/**
 * EZEQUIEL COACHING - Premium Onboarding System
 * Onboarding interactivo multi-step para capturar info del usuario
 * y personalizar su experiencia desde el día 1
 */

export type UserRole = "client" | "trainer";

export type FitnessGoal =
  | "lose-weight"
  | "build-muscle"
  | "get-stronger"
  | "improve-endurance"
  | "general-fitness"
  | "compete";

export type FitnessLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type WorkoutFrequency = "1-2" | "3-4" | "5-6" | "7+";

export type WorkoutLocation = "gym" | "home" | "both" | "outdoor";

export interface OnboardingData {
  // Step 1: Role Selection
  role: UserRole;

  // Step 2: Personal Info (Client)
  firstName?: string;
  age?: number;
  gender?: "male" | "female" | "other";

  // Step 3: Fitness Profile
  fitnessGoal?: FitnessGoal;
  fitnessLevel?: FitnessLevel;
  workoutFrequency?: WorkoutFrequency;
  workoutLocation?: WorkoutLocation;

  // Step 4: Current Stats
  currentWeight?: number;
  targetWeight?: number;
  height?: number;

  // Step 5: Experience
  yearsTraining?: number;
  injuries?: string[];
  equipment?: string[];

  // Step 6: Preferences
  preferredWorkoutTime?: "morning" | "afternoon" | "evening" | "flexible";
  notificationsEnabled?: boolean;

  // Completion
  completedAt?: Date;
  hasSeenTour?: boolean;
}

export interface OnboardingStep {
  id: string;
  title: string;
  titleES: string;
  description: string;
  descriptionES: string;
  icon: string;
  optional?: boolean;
}

/**
 * Onboarding Steps for Clients
 */
export const CLIENT_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "role",
    title: "Welcome to EZEQUIEL COACHING",
    titleES: "Bienvenido a EZEQUIEL COACHING",
    description: "Are you here as a client or trainer?",
    descriptionES: "¿Estás aquí como cliente o entrenador?",
    icon: "👋",
  },
  {
    id: "personal",
    title: "Tell us about you",
    titleES: "Cuéntanos sobre ti",
    description: "Help us personalize your experience",
    descriptionES: "Ayúdanos a personalizar tu experiencia",
    icon: "👤",
  },
  {
    id: "fitness-profile",
    title: "Your fitness goals",
    titleES: "Tus objetivos fitness",
    description: "What do you want to achieve?",
    descriptionES: "¿Qué querés lograr?",
    icon: "🎯",
  },
  {
    id: "current-stats",
    title: "Current stats",
    titleES: "Stats actuales",
    description: "Where are you starting from?",
    descriptionES: "¿Desde dónde partís?",
    icon: "📊",
    optional: true,
  },
  {
    id: "experience",
    title: "Training experience",
    titleES: "Experiencia de entrenamiento",
    description: "Help us match your level",
    descriptionES: "Ayúdanos a ajustar tu nivel",
    icon: "💪",
  },
  {
    id: "preferences",
    title: "Preferences",
    titleES: "Preferencias",
    description: "Customize your experience",
    descriptionES: "Personalizá tu experiencia",
    icon: "⚙️",
  },
  {
    id: "complete",
    title: "You're all set!",
    titleES: "¡Todo listo!",
    description: "Let's start your fitness journey",
    descriptionES: "Comencemos tu viaje fitness",
    icon: "🎉",
  },
];

/**
 * Onboarding Steps for Trainers
 */
export const TRAINER_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "role",
    title: "Welcome to EZEQUIEL COACHING",
    titleES: "Bienvenido a EZEQUIEL COACHING",
    description: "Are you here as a client or trainer?",
    descriptionES: "¿Estás aquí como cliente o entrenador?",
    icon: "👋",
  },
  {
    id: "trainer-profile",
    title: "Your trainer profile",
    titleES: "Tu perfil de entrenador",
    description: "Tell us about your expertise",
    descriptionES: "Cuéntanos sobre tu experiencia",
    icon: "🏋️",
  },
  {
    id: "certifications",
    title: "Certifications & credentials",
    titleES: "Certificaciones y credenciales",
    description: "Showcase your qualifications",
    descriptionES: "Muestra tus calificaciones",
    icon: "🎓",
    optional: true,
  },
  {
    id: "services",
    title: "Your services",
    titleES: "Tus servicios",
    description: "What do you offer?",
    descriptionES: "¿Qué ofrecés?",
    icon: "💼",
  },
  {
    id: "pricing",
    title: "Pricing",
    titleES: "Precios",
    description: "Set your rates",
    descriptionES: "Establece tus tarifas",
    icon: "💰",
  },
  {
    id: "complete",
    title: "Ready to coach!",
    titleES: "¡Listo para entrenar!",
    description: "Start building your client base",
    descriptionES: "Comienza a construir tu base de clientes",
    icon: "🚀",
  },
];

/**
 * Fitness Goal Options
 */
export const FITNESS_GOALS = [
  {
    id: "lose-weight" as FitnessGoal,
    label: "Lose Weight",
    labelES: "Perder Peso",
    icon: "⚖️",
    description: "Reduce body fat and get lean",
    descriptionES: "Reducir grasa corporal y definir",
  },
  {
    id: "build-muscle" as FitnessGoal,
    label: "Build Muscle",
    labelES: "Ganar Músculo",
    icon: "💪",
    description: "Gain size and strength",
    descriptionES: "Ganar tamaño y fuerza",
  },
  {
    id: "get-stronger" as FitnessGoal,
    label: "Get Stronger",
    labelES: "Más Fuerte",
    icon: "🏋️",
    description: "Increase raw strength",
    descriptionES: "Aumentar fuerza máxima",
  },
  {
    id: "improve-endurance" as FitnessGoal,
    label: "Improve Endurance",
    labelES: "Mejorar Resistencia",
    icon: "🏃",
    description: "Better cardio and stamina",
    descriptionES: "Mejor cardio y resistencia",
  },
  {
    id: "general-fitness" as FitnessGoal,
    label: "General Fitness",
    labelES: "Fitness General",
    icon: "✨",
    description: "Overall health and wellness",
    descriptionES: "Salud y bienestar general",
  },
  {
    id: "compete" as FitnessGoal,
    label: "Compete",
    labelES: "Competir",
    icon: "🏆",
    description: "Prepare for competition",
    descriptionES: "Prepararse para competir",
  },
];

/**
 * Fitness Level Options
 */
export const FITNESS_LEVELS = [
  {
    id: "beginner" as FitnessLevel,
    label: "Beginner",
    labelES: "Principiante",
    description: "New to training (0-1 years)",
    descriptionES: "Nuevo en entrenamiento (0-1 años)",
  },
  {
    id: "intermediate" as FitnessLevel,
    label: "Intermediate",
    labelES: "Intermedio",
    description: "Some experience (1-3 years)",
    descriptionES: "Algo de experiencia (1-3 años)",
  },
  {
    id: "advanced" as FitnessLevel,
    label: "Advanced",
    labelES: "Avanzado",
    description: "Experienced lifter (3-5 years)",
    descriptionES: "Levantador experimentado (3-5 años)",
  },
  {
    id: "expert" as FitnessLevel,
    label: "Expert",
    labelES: "Experto",
    description: "Elite athlete (5+ years)",
    descriptionES: "Atleta de elite (5+ años)",
  },
];

/**
 * Get recommended program based on onboarding data
 */
export function getRecommendedProgram(data: OnboardingData): {
  programName: string;
  reason: string;
} {
  const { fitnessGoal, fitnessLevel, workoutFrequency } = data;

  // Beginner
  if (fitnessLevel === "beginner") {
    return {
      programName: "Beginner Full Body 3x/Week",
      reason:
        "Perfect for building a solid foundation with proper technique and consistency",
    };
  }

  // Muscle building
  if (fitnessGoal === "build-muscle" && workoutFrequency === "5-6") {
    return {
      programName: "PPL Hypertrophy 6x/Week",
      reason: "Optimal frequency and volume for maximum muscle growth",
    };
  }

  // Strength focused
  if (
    fitnessGoal === "get-stronger" &&
    (fitnessLevel === "intermediate" || fitnessLevel === "advanced")
  ) {
    return {
      programName: "5/3/1 Strength Program",
      reason: "Proven periodization for consistent strength gains",
    };
  }

  // Fat loss
  if (fitnessGoal === "lose-weight") {
    return {
      programName: "Fat Loss Circuit Training",
      reason: "High-intensity circuits for maximum calorie burn",
    };
  }

  // Default
  return {
    programName: "Beginner Full Body 3x/Week",
    reason: "Great starting point for any fitness goal",
  };
}

/**
 * Calculate onboarding completion percentage
 */
export function getOnboardingProgress(data: OnboardingData): number {
  const requiredFields = [
    "role",
    "fitnessGoal",
    "fitnessLevel",
    "workoutFrequency",
    "workoutLocation",
  ];

  const completedFields = requiredFields.filter((field) => {
    return data[field as keyof OnboardingData] !== undefined;
  });

  return Math.round((completedFields.length / requiredFields.length) * 100);
}

/**
 * Validate step completion
 */
export function isStepComplete(stepId: string, data: OnboardingData): boolean {
  switch (stepId) {
    case "role":
      return !!data.role;
    case "personal":
      return !!data.firstName && !!data.age;
    case "fitness-profile":
      return !!(
        data.fitnessGoal &&
        data.fitnessLevel &&
        data.workoutFrequency &&
        data.workoutLocation
      );
    case "current-stats":
      return true; // Optional
    case "experience":
      return !!data.yearsTraining;
    case "preferences":
      return data.notificationsEnabled !== undefined;
    default:
      return false;
  }
}

/**
 * Get next incomplete step
 */
export function getNextStep(
  data: OnboardingData,
  currentStepId: string
): OnboardingStep | null {
  const steps =
    data.role === "trainer" ? TRAINER_ONBOARDING_STEPS : CLIENT_ONBOARDING_STEPS;
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);

  for (let i = currentIndex + 1; i < steps.length; i++) {
    const step = steps[i];
    if (!isStepComplete(step.id, data)) {
      return step;
    }
  }

  return null; // All complete
}
