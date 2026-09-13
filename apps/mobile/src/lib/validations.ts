import { z } from "zod";

// Login: email validado + password mínimo 6 caracteres
export const loginSchema = z.object({ 
  email: z.string().email("Email inválido").max(255), 
  password: z.string().min(6, "Mínimo 6 caracteres").max(128)
});

// Registro: nombre requerido, email único, password fuerte, role solo CLIENT por defecto
export const registerSchema = z.object({ 
  name: z.string().min(2, "Nombre requerido").max(100).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Nombre solo puede contener letras y espacios"), 
  email: z.string().email("Email inválido").max(255), 
  password: z.string()
    .min(8, "Mínimo 8 caracteres")
    .max(128)
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
  company: z.string().optional(), // Honeypot para bots
  role: z.enum(["CLIENT","TRAINER"]).default("CLIENT") // Solo CLIENT por registro público
});

// Cliente: todos los campos validados con enums estrictos
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

// Pago: montos validados, métodos permitidos
export const paymentSchema = z.object({
  clientId: z.string().cuid("ID de cliente inválido"),
  amount: z.number().positive("Monto debe ser positivo").max(1000000),
  method: z.enum(["EFECTIVO","TRANSFERENCIA","TARJETA","STRIPE","MERCADOPAGO","PAYPAL"]).default("EFECTIVO"),
  description: z.string().max(500).optional(),
  status: z.enum(["PAGADO","PENDIENTE","VENCIDO"]).default("PAGADO")
});

// Tipos para inferencia
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
