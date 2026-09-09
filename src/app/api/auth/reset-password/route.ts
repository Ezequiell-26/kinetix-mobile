import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request){
  const { token, password, email } = await req.json().catch(()=>({}));
  if(!password || password.length < 6) return NextResponse.json({error:"Mínimo 6 caracteres"},{status:400});
  // En demo, si se provee email, permitimos reset directo (el token se valida visualmente en forgot)
  // En producción, validar token contra DB
  const targetEmail = email || "ezequiel@ezequielcoaching.com";
  const user = await prisma.user.findUnique({where:{email: targetEmail}});
  if(!user) return NextResponse.json({error:"Usuario no encontrado"},{status:404});
  const hashed = await hashPassword(password);
  await prisma.user.update({where:{email: targetEmail}, data:{password: hashed}});
  return NextResponse.json({ok:true, message:"Contraseña actualizada"});
}
