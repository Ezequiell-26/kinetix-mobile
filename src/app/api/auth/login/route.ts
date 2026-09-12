import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createAuthSession, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(req:Request){
  try{
    const body = await req.json();
    const {email,password}= loginSchema.parse(body);
    
    const user = await prisma.user.findUnique({where:{email}});
    if(!user) {
      // Anti-enumeración: mismo mensaje para usuario no encontrado o password incorrecto
      return NextResponse.json({error:"Credenciales inválidas"}, {status:401});
    }
    
    const ok = await verifyPassword(password, user.password);
    if(!ok) {
      return NextResponse.json({error:"Credenciales inválidas"}, {status:401});
    }

    // Obtener headers para userAgent y IP
    const headersList = await import("next/headers").then(m => m.headers());
    const userAgent = headersList.get("user-agent") || undefined;
    
    // Intentar obtener IP (funciona en producción, en dev puede ser localhost)
    let ipAddress: string | undefined;
    const forwarded = headersList.get("x-forwarded-for");
    if (forwarded) {
      ipAddress = forwarded.split(",")[0].trim();
    } else {
      // Fallback para desarrollo local
      ipAddress = "127.0.0.1";
    }
    
    // Crear JWT + sesión en DB
    const token = await createAuthSession(
      {id:user.id, email:user.email, role:user.role as "TRAINER"|"CLIENT", name:user.name},
      userAgent,
      ipAddress
    );
    
    await setAuthCookie(token);
    
    return NextResponse.json({ok:true, role:user.role});
  }catch(e:unknown){
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({error:msg},{status:400});
  }
}
