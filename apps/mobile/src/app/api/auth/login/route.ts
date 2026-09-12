import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { isLoginLocked, recordFailedLogin, clearLoginAttempts } from "@/lib/login-guard";

export async function POST(req:Request){
  try{
    const body = await req.json();
    const {email,password}= loginSchema.parse(body);

    // Bloqueo por cuenta: independiente del rate limit por IP del middleware,
    // frena fuerza bruta distribuida (misma cuenta, muchas IPs).
    const lock = isLoginLocked(email);
    if(lock.locked){
      const retryAfterSec = Math.ceil(lock.retryAfterMs / 1000);
      return NextResponse.json(
        {error:`Demasiados intentos fallidos. Probá de nuevo en ${Math.ceil(retryAfterSec/60)} min.`},
        {status:429, headers:{"Retry-After": String(retryAfterSec)}}
      );
    }

    const user = await prisma.user.findUnique({where:{email}});
    if(!user){ recordFailedLogin(email); return NextResponse.json({error:"Credenciales inválidas"}, {status:401}); }
    const ok = await verifyPassword(password, user.password);
    if(!ok){ recordFailedLogin(email); return NextResponse.json({error:"Credenciales inválidas"}, {status:401}); }
    clearLoginAttempts(email);
    const token = await createToken({id:user.id, email:user.email, role:user.role as "TRAINER"|"CLIENT", name:user.name});
    await setAuthCookie(token);
    return NextResponse.json({ok:true, role:user.role});
  }catch(e:unknown){
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({error:msg},{status:400});
  }
}
