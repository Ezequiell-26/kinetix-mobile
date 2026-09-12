import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { consumeResetToken } from "@/lib/password-reset-store";

/**
 * Restablece la contraseña.
 *
 * Corrección de seguridad (P0): antes se aceptaba `email` y se restablecía la
 * contraseña de esa cuenta SIN validar el token -> toma de cuenta conociendo
 * solo el email. Ahora se EXIGE un token válido, no expirado, emitido para
 * ese email y de un solo uso.
 */
export async function POST(req: Request){
  const { token, password, email } = await req.json().catch(() => ({} as { token?: string; password?: string; email?: string }));

  if(!password || password.length < 6) return NextResponse.json({error:"Mínimo 6 caracteres"},{status:400});
  if(!token || typeof token !== "string") return NextResponse.json({error:"Token requerido"},{status:400});
  if(!email || typeof email !== "string") return NextResponse.json({error:"Email requerido"},{status:400});

  // Validar el token antes de tocar la base de datos.
  if(!(await consumeResetToken(token, email))){
    return NextResponse.json({error:"Token inválido o expirado"},{status:403});
  }

  const user = await prisma.user.findUnique({where:{email}});
  if(!user) return NextResponse.json({error:"Usuario no encontrado"},{status:404});

  const hashed = await hashPassword(password);
  await prisma.user.update({where:{email}, data:{password: hashed}});
  return NextResponse.json({ok:true, message:"Contraseña actualizada"});
}
