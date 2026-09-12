import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { assertTrainerOwnsClient, resolveTrainerIdForClient } from "@/lib/authorization";

export async function POST(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const body = await req.json().catch(() => null);
  if(!body) return NextResponse.json({error:"Cuerpo requerido"},{status:400});

  // Resolve client
  let clientId: string | null = null;
  let assignedProgramId: string | null = null;
  if(s.role === "CLIENT"){
    const client = await prisma.client.findFirst({where:{OR:[{userId:s.id},{email:s.email}]}});
    clientId = client?.id || null;
    assignedProgramId = client?.assignedProgramId || null;
  } else if(body.clientId && s.role === "TRAINER"){
    // P0 Security: TRAINER solo puede crear logs para sus propios clientes
    const ownsClient = await assertTrainerOwnsClient(s.id, body.clientId);
    if(!ownsClient){
      return NextResponse.json({error:"Cliente no encontrado"}, {status:404});
    }
    clientId = body.clientId;
  }

  // Validar el workoutId SIN sustituirlo: si no existe o no pertenece al
  // programa asignado del atleta, se rechaza el guardado (antes se guardaba
  // contra el primer workout de la base, atribuyendo el entrenamiento a un
  // plan que el atleta nunca recibió).
  const workoutId = body.workoutId;
  if(!workoutId || typeof workoutId !== "string"){
    return NextResponse.json({error:"Falta el ID del entrenamiento"}, {status:400});
  }
  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
    include: { week: { select: { programId: true } } },
  });
  if(!workout){
    return NextResponse.json({error:"El entrenamiento no existe"}, {status:404});
  }
  if(s.role === "CLIENT" && workout.week.programId !== assignedProgramId){
    return NextResponse.json({error:"Ese entrenamiento no pertenece a tu programa asignado"}, {status:403});
  }

  // Prepare sets if provided
  const setsData = Array.isArray(body.sets) ? body.sets.map((st: {
    exerciseName: string;
    setNumber: number;
    weight?: number;
    reps?: number;
    rir?: number;
    rpe?: number;
    completed?: boolean;
  })=>({
    exerciseName: st.exerciseName || "Ejercicio",
    setNumber: Number(st.setNumber) || 1,
    weight: st.weight !== undefined && st.weight !== null ? Number(st.weight) : null,
    reps: st.reps !== undefined && st.reps !== null ? Number(st.reps) : null,
    rir: st.rir !== undefined && st.rir !== null ? Number(st.rir) : null,
    rpe: st.rpe !== undefined && st.rpe !== null ? Number(st.rpe) : null,
    completed: st.completed ?? true,
  })) : [];

  const log = await prisma.workoutLog.create({
    data:{
      userId: s.id,
      clientId: clientId,
      workoutId: workoutId,
      workoutName: workout.name,
      durationMin: body.durationMin ? Number(body.durationMin) : null,
      comment: body.comment || null,
      completed: body.completed ?? true,
      sets: setsData.length ? {
        create: setsData
      } : undefined
    },
    include: {
      sets: true,
      workout: true
    }
  });

  // If client finished a workout, create a notification for trainer
  if(s.role === "CLIENT"){
    // Al trainer dueño de la ficha, no al primer trainer de la base.
    const trainerId = await resolveTrainerIdForClient(clientId);
    if(trainerId){
      await prisma.notification.create({
        data:{
          userId: trainerId,
          title: `${s.name} completó un entrenamiento`,
          body: `${workout.name} (${log.durationMin || 0} min)`,
          type: "workout",
          link: `/trainer/clients/${clientId}`
        }
      }).catch(()=>{});
    }
  }

  return NextResponse.json(log);
}

export async function GET(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const url = new URL(req.url);
  const targetClientId = url.searchParams.get("clientId");

  if(s.role === "CLIENT"){
    const client = await prisma.client.findFirst({where:{OR:[{userId:s.id},{email:s.email}]}});
    const logs = await prisma.workoutLog.findMany({
      where: {
        OR: [
          { userId: s.id },
          ...(client?.id ? [{ clientId: client.id }] : [])
        ]
      },
      include: { sets: true, workout: true },
      orderBy: { date: "desc" },
      take: 50
    });
    return NextResponse.json(logs);
  }

  // Trainer
  if(targetClientId){
    // P0 Security: TRAINER solo puede ver logs de sus propios clientes
    const ownsClient = await assertTrainerOwnsClient(s.id, targetClientId);
    if(!ownsClient){
      return NextResponse.json({error:"Cliente no encontrado"}, {status:404});
    }
    const logs = await prisma.workoutLog.findMany({
      where: { clientId: targetClientId },
      include: { sets: true, workout: true },
      orderBy: { date: "desc" },
      take: 50
    });
    return NextResponse.json(logs);
  }

  // All recent workouts for trainer — P0 Security: acotado a SUS clientes.
  // Antes devolvía los logs de todo el sistema, incluyendo el objeto `user`
  // completo (con el hash de password).
  const logs = await prisma.workoutLog.findMany({
    where: { client: { trainerId: s.id } },
    include: {
      sets: true,
      workout: true,
      client: { select: { id: true, name: true, email: true, avatar: true } },
      user: { select: { id: true, name: true, email: true, avatar: true } },
    },
    orderBy: { date: "desc" },
    take: 50
  });
  return NextResponse.json(logs);
}
