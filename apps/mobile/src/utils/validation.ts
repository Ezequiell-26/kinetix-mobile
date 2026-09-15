import { z } from 'zod';

// Esquemas de validación para toda la aplicación
export const emailSchema = z.string()
  .email('Email inválido')
  .refine(email => email.endsWith('@gmail.com') || email.endsWith('@kinetixfitt.com'), 'Solo se permiten correos @gmail.com o @kinetixfitt.com');

export const passwordSchema = z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número');

export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Número de teléfono inválido');

export const workoutSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  description: z.string().max(500).optional(),
  exercises: z.array(z.object({
    name: z.string().min(1, 'Nombre del ejercicio requerido'),
    sets: z.number().int().positive('Las series deben ser positivas'),
    reps: z.number().int().positive('Las repeticiones deben ser positivas'),
    weight: z.number().nonnegative('El peso no puede ser negativo'),
    restTime: z.number().int().nonnegative('El tiempo de descanso no puede ser negativo'),
  })).min(1, 'Al menos un ejercicio es requerido'),
  duration: z.number().int().positive('La duración debe ser positiva'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  tags: z.array(z.string()).optional(),
});

export const nutritionLogSchema = z.object({
  foodName: z.string().min(1, 'Nombre del alimento requerido'),
  calories: z.number().positive('Las calorías deben ser positivas'),
  protein: z.number().nonnegative('La proteína no puede ser negativa'),
  carbs: z.number().nonnegative('Los carbohidratos no pueden ser negativos'),
  fats: z.number().nonnegative('Las grasas no pueden ser negativas'),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  notes: z.string().max(200).optional(),
});

export const progressPhotoSchema = z.object({
  url: z.string().url('URL de imagen inválida'),
  date: z.number(),
  type: z.enum(['front', 'side', 'back']),
  notes: z.string().max(300).optional(),
  weight: z.number().positive().optional(),
  bodyFatPercentage: z.number().positive().optional(),
});

export const messageSchema = z.object({
  content: z.string().min(1, 'El mensaje no puede estar vacío').max(1000),
  recipientId: z.string(),
  parentId: z.string().optional(),
});

export const appointmentSchema = z.object({
  date: z.number(),
  duration: z.number().int().positive(),
  type: z.enum(['consultation', 'check-in', 'emergency']),
  notes: z.string().max(500).optional(),
});

export const userSettingsSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }),
  privacy: z.object({
    profilePublic: z.boolean(),
    showProgress: z.boolean(),
  }),
  preferences: z.object({
    language: z.enum(['es', 'en', 'pt']),
    theme: z.enum(['light', 'dark', 'system']),
    units: z.enum(['metric', 'imperial']),
  }),
});

// Funciones de utilidad para validación
export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

export function validatePassword(password: string): boolean {
  return passwordSchema.safeParse(password).success;
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim();
}

export type Workout = z.infer<typeof workoutSchema>;
export type NutritionLog = z.infer<typeof nutritionLogSchema>;
export type ProgressPhoto = z.infer<typeof progressPhotoSchema>;
export type Message = z.infer<typeof messageSchema>;
export type Appointment = z.infer<typeof appointmentSchema>;
export type UserSettings = z.infer<typeof userSettingsSchema>;
