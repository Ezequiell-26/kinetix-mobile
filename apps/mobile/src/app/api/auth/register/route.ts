import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request){
  try{
    const body = await req.json();

    // Honeypot: si el campo trampa viene lleno, es un bot. Se responde
    // éxito falso (sin crear nada) para no enseñarle al script que fue
    // detectado — así no reintenta variando el payload.
    if(typeof body.company === "string" && body.company.trim() !== ""){
      return NextResponse.json({ok:true, role:"CLIENT"});
    }

    const data = registerSchema.parse(body);
    
    // Normalizar email a minúsculas para evitar duplicados
    const normalizedEmail = data.email.toLowerCase().trim();
    
    const exists = await prisma.user.findUnique({where:{email: normalizedEmail}});
    if(exists) return NextResponse.json({error:"Email ya registrado"}, {status:400});
    
    // Registro público SIEMPRE como CLIENTE: nadie puede auto-crearse TRAINER
    // (acceso total). Las cuentas de entrenador las crea otro entrenador o el seed.
    const hashed = await hashPassword(data.password);
    const user = await prisma.user.create({data:{email:normalizedEmail, password:hashed, name:data.name.trim(), role:"CLIENT"}});
    await prisma.profile.create({data:{userId:user.id}});
    
    const existingClient = await prisma.client.findUnique({where:{email:normalizedEmail}});
    if(existingClient){
      await prisma.client.update({
        where:{id:existingClient.id},
        data:{userId:user.id, name: data.name.trim() || existingClient.name}
      });
    } else {
      await prisma.client.create({data:{name:data.name.trim(), email:normalizedEmail, userId:user.id, goal:"HIPERTROFIA", status:"ACTIVO", plan:"PERSONALIZADO"}});
    }
    
    const token = await createToken({id:user.id, email:user.email, role:user.role as "TRAINER"|"CLIENT", name:user.name});
    await setAuthCookie(token);
    return NextResponse.json({ok:true, role:user.role});
  }catch(e:unknown){
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({error:msg},{status:400});
  }
}
