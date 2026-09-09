import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
export async function POST(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const body = await req.json();

  // Resolve client
  let clientId: string | null = null;
  if(s.role === "CLIENT"){
    const client = await prisma.client.findFirst({where:{OR:[{userId:s.id},{email:s.email}]}});
    clientId = client?.id || null;
  } else if(body.clientId){
    clientId = body.clientId;
  }

  // Resolve valid workout ID
  let workoutId = body.workoutId;
  if(workoutId){
    const exists = await prisma.workout.findUnique({where:{id: workoutId}});
    if(!exists) workoutId = (await prisma.workout.findFirst())?.id;
  } else {
    workoutId = (await prisma.workout.findFirst())?.id;
  }
  if(!workoutId) return NextResponse.json({error:"No hay entrenamientos en la base de datos"}, {status:400});

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
    const trainer = await prisma.user.findFirst({where:{role:"TRAINER"}});
    if(trainer){
      await prisma.notification.create({
        data:{
          userId: trainer.id,
          title: `${s.name} completó un entrenamiento`,
          body: `${log.workout.name} (${log.durationMin || 0} min)`,
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
    const logs = await prisma.workoutLog.findMany({
      where: { clientId: targetClientId },
      include: { sets: true, workout: true },
      orderBy: { date: "desc" },
      take: 50
    });
    return NextResponse.json(logs);
  }

  // All recent workouts for trainer
  const logs = await prisma.workoutLog.findMany({
    include: { sets: true, workout: true, client: true, user: true },
    orderBy: { date: "desc" },
    take: 50
  });
  return NextResponse.json(logs);
}
