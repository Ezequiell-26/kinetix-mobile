import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { issueResetToken } from "@/lib/password-reset-store";

/**
 * Inicia la recuperación de contraseña.
 *
 * Seguridad:
 * - Token criptográficamente seguro (32 bytes hex)
 * - Anti-enumeración: misma respuesta exista o no el email
 * - Token NO se devuelve en la respuesta (solo por email en producción)
 * - En desarrollo: log del enlace para testing
 */
export async function POST(req: Request){
  const { email } = await req.json().catch(() => ({} as { email?: string }));
  if(!email || !email.includes("@")) {
    return NextResponse.json({error:"Email válido requerido"},{status:400});
  }

  // Respuesta genérica siempre, para no filtrar si el email existe.
  const generic = {ok:true, message:"Si el email existe, recibirás instrucciones."};

  try {
    const token = await issueResetToken(email);
    
    if(token){
      // Solo desarrollo local: log del enlace. En producción esto va por email
      // y JAMÁS se loguea (el token equivale a la contraseña).
      if(process.env.NODE_ENV !== "production"){
        console.log(`[FORGOT] Reset para ${email}: http://localhost:3001/reset-password?token=${token}`);
      }
      // TODO: En producción, enviar email con el token
      // await sendResetEmail(email, token);
    }
  } catch (error) {
    console.error("[FORGOT] Error:", error);
    // No revelar detalles del error
  }
  
  return NextResponse.json(generic);
}
