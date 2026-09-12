import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request){
  try{
    const body = await req.json();
    const data = registerSchema.parse(body);
    const exists = await prisma.user.findUnique({where:{email:data.email}});
    if(exists) return NextResponse.json({error:"Email ya registrado"}, {status:400});
    // Registro público SIEMPRE como CLIENTE: nadie puede auto-crearse TRAINER
    // (acceso total). Las cuentas de entrenador las crea otro entrenador o el seed.
    const hashed = await hashPassword(data.password);
    const user = await prisma.user.create({data:{email:data.email, password:hashed, name:data.name, role:"CLIENT"}});
    await prisma.profile.create({data:{userId:user.id}});
    const existingClient = await prisma.client.findUnique({where:{email:data.email}});
    if(existingClient){
      await prisma.client.update({
        where:{id:existingClient.id},
        data:{userId:user.id, name: data.name || existingClient.name}
      });
    } else {
      await prisma.client.create({data:{name:data.name, email:data.email, userId:user.id, goal:"HIPERTROFIA", status:"ACTIVO", plan:"PERSONALIZADO"}});
    }
    const token = await createToken({id:user.id, email:user.email, role:user.role as "TRAINER"|"CLIENT", name:user.name});
    await setAuthCookie(token);
    return NextResponse.json({ok:true, role:user.role});
  }catch(e:unknown){
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({error:msg},{status:400});
  }
}
