import { z } from "zod";

// Login: email validado + password mínimo 6 caracteres
export const loginSchema = z.object({
  email: z.string().email("Email inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(128)
});

// Registro público: solo CLIENT; TRAINER requiere alta administrativa/invitación.
export const registerSchema = z.object({
  name: z.string().min(2, "Nombre requerido").max(100).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Nombre solo puede contener letras y espacios"),
  email: z.string().email("Email inválido").max(255),
  password: z.string()
    .min(8, "Mínimo 8 caracteres")
    .max(128)
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
  company: z.string().optional(),
  role: z.enum(["CLIENT","TRAINER"]).default("CLIENT")
});

export const clientSchema = z.object({
  name: z.string().min(2, "Nombre requerido").max(100),
  email: z.string().email("Email inválido").max(255),
  goal: z.enum(["PERDIDA_GRASA","HIPERTROFIA","FUERZA","RECOMPOSICION","OTRO"]).default("HIPERTROFIA"),
  status: z.enum(["ACTIVO","PAUSADO","PENDIENTE","FINALIZADO"]).default("ACTIVO"),
  plan: z.enum(["BASICO","PERSONALIZADO","PREMIUM"]).default("PERSONALIZADO"),
  age: z.number().int().min(14).max(100).optional().nullable(),
  weight: z.number().positive().max(300).optional().nullable(),
  height: z.number().positive().max(250).optional().nullable(),
  notes: z.string().max(1000).optional().nullable()
});

export const paymentSchema = z.object({
  clientId: z.string().cuid("ID de cliente inválido"),
  amount: z.number().positive("Monto debe ser positivo").max(1000000),
  method: z.enum(["EFECTIVO","TRANSFERENCIA","TARJETA","STRIPE","MERCADOPAGO","PAYPAL"]).default("EFECTIVO"),
  description: z.string().max(500).optional(),
  status: z.enum(["PAGADO","PENDIENTE","VENCIDO"]).default("PAGADO")
});

export const exerciseSchema = z.object({
  name: z.string().trim().min(2, "Nombre requerido").max(160),
  muscleGroup: z.string().trim().min(2).max(80).default("General"),
  pattern: z.string().trim().max(80).optional().nullable(),
  equipment: z.string().trim().max(120).optional().nullable(),
  level: z.string().trim().max(40).default("Intermedio"),
  image: z.string().url().max(1000).optional().nullable(),
  video: z.string().url().max(1000).optional().nullable(),
  instructions: z.string().trim().max(3000).optional().nullable(),
  errors: z.string().trim().max(3000).optional().nullable(),
  variants: z.string().trim().max(2000).optional().nullable(),
  substitutions: z.string().trim().max(2000).optional().nullable(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type ExerciseInput = z.infer<typeof exerciseSchema>;
