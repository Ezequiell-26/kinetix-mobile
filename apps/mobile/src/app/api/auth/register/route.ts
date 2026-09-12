import { NextResponse } from "next/server";
import { ZodError } from "zod";
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
    const exists = await prisma.user.findUnique({where:{email:data.email}});
    if(exists) return NextResponse.json({error:"Email ya registrado"}, {status:400});
    // Registro público SIEMPRE como CLIENTE: nadie puede auto-crearse TRAINER
    // (acceso total). Las cuentas de entrenador las crea otro entrenador o el seed.
    const hashed = await hashPassword(data.password);
    const user = await prisma.user.create({data:{email:data.email, password:hashed, name:data.name, role:"CLIENT"}});
    await prisma.profile.create({data:{userId:user.id}});
    const existingClient = await prisma.client.findUnique({where:{email:data.email}});
    if(existingClient){
      // Vinculación de una ficha que el trainer ya había creado.
      //
      // LIMITACIÓN CONOCIDA (mitigada, no eliminada): sin verificación de
      // email, cualquiera que se registre con el email de una ficha
      // pre-creada la adopta. El flujo de producto depende de esta
      // vinculación, así que en vez de bloquearla se AUDITA: se avisa al
      // trainer dueño de la ficha para que confirme o desvincule.
      // La solución definitiva es exigir verificación por email antes de
      // adoptar una ficha preexistente.
      await prisma.client.update({
        where:{id:existingClient.id},
        data:{userId:user.id, name: data.name || existingClient.name}
      });
      if(existingClient.trainerId){
        await prisma.notification.create({data:{
          userId: existingClient.trainerId,
          title: "Nuevo cliente vinculado",
          body: `${data.name || existingClient.name} activó su cuenta con ${data.email}. Verificá que sea tu cliente.`,
          type: "client_linked",
          link: `/trainer/clients/${existingClient.id}`
        }}).catch(()=>{});
      }
    } else {
      await prisma.client.create({data:{name:data.name, email:data.email, userId:user.id, goal:"HIPERTROFIA", status:"ACTIVO", plan:"PERSONALIZADO"}});
    }
    const token = await createToken({id:user.id, email:user.email, role:user.role as "TRAINER"|"CLIENT", name:user.name});
    await setAuthCookie(token);
    return NextResponse.json({ok:true, role:user.role});
  }catch(e:unknown){
    // No exponer mensajes internos de Prisma/zod (nombres de constraints,
    // rutas de campos, detalles del motor). Se loguean server-side.
    if(e instanceof ZodError){
      return NextResponse.json({error:"Datos inválidos"},{status:400});
    }
    console.error("[auth/register]", e);
    return NextResponse.json({error:"No se pudo completar el registro"},{status:400});
  }
}
