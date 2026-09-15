import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertTrainerOwnsClient } from "@/lib/authorization";

function numberOrNull(value: unknown, min: number, max: number) {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : undefined;
}

export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
  const s=await getSession(); if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const {id}=await params;
  if(s.role==="CLIENT"){
    const own=await prisma.client.findFirst({where:{OR:[{userId:s.id},{email:s.email}]},select:{id:true}});
    if(!own || own.id!==id) return NextResponse.json({error:"No autorizado"},{status:403});
  } else if(!(await assertTrainerOwnsClient(s.id,id))) return NextResponse.json({error:"Cliente no encontrado"},{status:404});

  const client=await prisma.client.findUnique({where:{id},include:{user:{select:{id:true,name:true,email:true,avatar:true}},assignedProgram:{include:{weeks:{orderBy:{weekNumber:"asc"},include:{workouts:{orderBy:{dayNumber:"asc"},include:{exercises:{orderBy:{order:"asc"},include:{exercise:true}}}}}}}},checkIns:{orderBy:{date:"desc"},take:20},workoutLogs:{orderBy:{date:"desc"},take:20,include:{sets:true,workout:true}},progressMeasurements:{orderBy:{date:"desc"},take:20},progressPhotos:{orderBy:{date:"desc"},take:20},subscription:true}});
  if(!client) return NextResponse.json({error:"Cliente no encontrado"},{status:404});
  return NextResponse.json(client);
}

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
  const s=await getSession(); if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const {id}=await params;
  const client=await prisma.client.findUnique({where:{id},select:{id:true,userId:true,trainerId:true}});
  if(!client) return NextResponse.json({error:"Cliente no encontrado"},{status:404});
  if(s.role==="CLIENT" && client.userId!==s.id) return NextResponse.json({error:"No autorizado"},{status:403});
  if(s.role!=="CLIENT" && !(await assertTrainerOwnsClient(s.id,id))) return NextResponse.json({error:"Cliente no encontrado"},{status:404});

  try{
    const body=await req.json(); const data:Record<string,unknown>={};
    if(typeof body.name==="string" && body.name.trim()) data.name=body.name.trim().slice(0,120);
    if(body.notes!==undefined && typeof body.notes==="string") data.notes=body.notes.trim().slice(0,1000);
    for(const [field,min,max] of [["weight",20,400],["height",100,250],["age",13,120],["availability",1,7]] as const){
      if(body[field]!==undefined){ const value=numberOrNull(body[field],min,max); if(value===undefined) return NextResponse.json({error:`${field} inválido`},{status:400}); data[field]=value; }
    }
    if(body.equipment!==undefined && typeof body.equipment==="string") data.equipment=body.equipment.trim().slice(0,200);
    if(body.experience!==undefined && typeof body.experience==="string") data.experience=body.experience.trim().slice(0,120);
    if(body.goal!==undefined){ if(!["PERDIDA_GRASA","HIPERTROFIA","FUERZA","RECOMPOSICION","OTRO"].includes(body.goal)) return NextResponse.json({error:"Objetivo inválido"},{status:400}); data.goal=body.goal; }

    if(s.role==="TRAINER"){
      if(body.status!==undefined){ if(!["ACTIVO","PAUSADO","PENDIENTE","FINALIZADO"].includes(body.status)) return NextResponse.json({error:"Estado inválido"},{status:400}); data.status=body.status; }
      if(body.plan!==undefined){ if(!["BASICO","PERSONALIZADO","PREMIUM"].includes(body.plan)) return NextResponse.json({error:"Plan inválido"},{status:400}); data.plan=body.plan; }
      if(body.trainerNotes!==undefined && typeof body.trainerNotes==="string") data.trainerNotes=body.trainerNotes.trim().slice(0,1500);
      if(body.assignedProgramId!==undefined){
        const programId=body.assignedProgramId||null;
        if(programId){
          const program=await prisma.program.findUnique({where:{id:programId},select:{id:true,trainerId:true}});
          if(!program) return NextResponse.json({error:"Programa no encontrado"},{status:404});
          if(program.trainerId && program.trainerId!==s.id) return NextResponse.json({error:"No podés asignar un programa de otro coach"},{status:403});
        }
        data.assignedProgramId=programId;
      }
    }

    const updated=await prisma.client.update({where:{id},data,include:{assignedProgram:true,subscription:true}});
    if(s.role==="TRAINER" && body.assignedProgramId && updated.userId){
      await prisma.notification.create({data:{userId:updated.userId,title:"Nuevo programa asignado",body:`Tu coach te asignó el programa ${updated.assignedProgram?.name||"seleccionado"}`,type:"program",link:"/client/workout"}}).catch(()=>{});
    }
    return NextResponse.json(updated);
  }catch(error:unknown){ console.error("[CLIENT PATCH]",error); return NextResponse.json({error:error instanceof Error?error.message:"Error al actualizar cliente"},{status:500}); }
}
