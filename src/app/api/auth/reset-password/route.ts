import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { validateResetToken, consumeResetToken } from "@/lib/password-reset-store";

/**
 * Reset de contraseña con token válido.
 * 
 * Seguridad:
 * - Valida token contra DB (existencia, expiración, uso)
 * - Token one-time-use (se invalida después de usar)
 * - Password mínimo 6 caracteres
 * - No revela si el token es inválido vs email no existe
 */
export async function POST(req: Request){
  const { token, password } = await req.json().catch(()=>({}));
  
  // Validaciones básicas
  if(!token || typeof token !== "string") {
    return NextResponse.json({error:"Token requerido"},{status:400});
  }
  if(!password || password.length < 6) {
    return NextResponse.json({error:"Mínimo 6 caracteres"},{status:400});
  }

  try {
    // Validar token contra DB
    const email = await validateResetToken(token);
    
    if(!email) {
      // Token inválido, expirado o ya usado
      return NextResponse.json({error:"Token inválido o expirado"},{status:400});
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({where:{email}});
    if(!user) {
      return NextResponse.json({error:"Usuario no encontrado"},{status:404});
    }

    // Hashear nueva contraseña
    const hashed = await hashPassword(password);

    // Actualizar password y marcar token como usado (transaccional)
    await prisma.$transaction([
      prisma.user.update({
        where:{email},
        data:{password: hashed}
      }),
      prisma.passwordResetToken.updateMany({
        where:{token},
        data:{used: true}
      })
    ]);

    // Invalidar TODAS las sesiones del usuario (seguridad post-rotación)
    await prisma.session.updateMany({
      where:{userId: user.id},
      data:{revoked: true}
    });

    return NextResponse.json({ok:true, message:"Contraseña actualizada"});
  } catch (error) {
    console.error("[RESET-PASSWORD] Error:", error);
    return NextResponse.json({error:"Error al resetear contraseña"},{status:500});
  }
}
