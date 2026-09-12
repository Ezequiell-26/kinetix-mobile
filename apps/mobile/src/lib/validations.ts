import { z } from "zod";
export const loginSchema = z.object({ email: z.string().email("Email inválido"), password: z.string().min(6,"Mínimo 6 caracteres")});
export const registerSchema = z.object({ name: z.string().min(2,"Nombre requerido"), email: z.string().email(), password: z.string().min(6), role: z.enum(["CLIENT","TRAINER"]).default("CLIENT")});
export const clientSchema = z.object({ name: z.string().min(2), email: z.string().email(), goal: z.enum(["PERDIDA_GRASA","HIPERTROFIA","FUERZA","RECOMPOSICION","OTRO"]).default("HIPERTROFIA"), status: z.enum(["ACTIVO","PAUSADO","PENDIENTE","FINALIZADO"]).default("ACTIVO"), plan: z.enum(["BASICO","PERSONALIZADO","PREMIUM"]).default("PERSONALIZADO")});
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
