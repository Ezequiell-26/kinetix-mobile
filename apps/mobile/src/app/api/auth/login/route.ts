import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(req:Request){
  try{
    const body = await req.json();
    const {email,password}= loginSchema.parse(body);
    const user = await prisma.user.findUnique({where:{email}});
    if(!user) return NextResponse.json({error:"Credenciales inválidas"}, {status:401});
    const ok = await verifyPassword(password, user.password);
    if(!ok) return NextResponse.json({error:"Credenciales inválidas"}, {status:401});
    const token = await createToken({id:user.id, email:user.email, role:user.role as "TRAINER"|"CLIENT", name:user.name});
    await setAuthCookie(token);
    return NextResponse.json({ok:true, role:user.role});
  }catch(e:unknown){
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({error:msg},{status:400});
  }
}
