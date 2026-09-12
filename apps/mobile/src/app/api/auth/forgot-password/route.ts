import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { issueResetToken } from "@/lib/password-reset-store";

/**
 * Inicia la recuperación de contraseña.
 *
 * Corrección de seguridad: antes se devolvía el token en la respuesta JSON,
 * lo que permitía a cualquier llamador obtener el token de la víctima y
 * restablecer su contraseña (toma de cuenta). Ahora el token NO se devuelve;
 * solo se registra en consola para pruebas locales en desarrollo.
 */
export async function POST(req: Request){
  const { email } = await req.json().catch(() => ({} as { email?: string }));
  if(!email || !email.includes("@")) return NextResponse.json({error:"Email válido requerido"},{status:400});

  // Respuesta genérica siempre, para no filtrar si el email existe.
  const generic = {ok:true, message:"Si el email existe, recibirás instrucciones."};

  const user = await prisma.user.findUnique({where:{email}}).catch(() => null);
  if(user){
    const token = await issueResetToken(email);
    // Solo desarrollo local: log del enlace. En producción esto va por email
    // y JAMÁS se loguea (el token equivale a la contraseña).
    if(process.env.NODE_ENV !== "production"){
      console.log(`[FORGOT] Reset para ${email}: http://localhost:3001/reset-password?token=${token}`);
    }
  }
  return NextResponse.json(generic);
}
