import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { assertTrainerOwnsClient } from "@/lib/authorization";

const IMPORT_SOURCES = new Set(["hevy", "strong"]);

export async function POST(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const body = await req.json().catch(() => null);
  if(!body) return NextResponse.json({error:"Cuerpo requerido"},{status:400});

  let clientId: string | null = null;
  let assignedProgramId: string | null = null;
  if(s.role === "CLIENT"){
    const client = await prisma.client.findFirst({where:{OR:[{userId:s.id},{email:s.email}]}});
    clientId = client?.id || null;
    assignedProgramId = client?.assignedProgramId || null;
  } else if(body.clientId && s.role === "TRAINER"){
    const ownsClient = await assertTrainerOwnsClient(s.id, body.clientId);
    if(!ownsClient) return NextResponse.json({error:"Cliente no encontrado"}, {status:404});
    clientId = body.clientId;
  }

  const importSource = typeof body.importSource === "string" ? body.importSource.toLowerCase() : null;
  const isExternalImport = Boolean(importSource && IMPORT_SOURCES.has(importSource));
  const workoutId = typeof body.workoutId === "string" && body.workoutId.trim() ? body.workoutId : null;

  let workout: { id: string; name: string; week: { programId: string } } | null = null;
  if(workoutId){
    workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      include: { week: { select: { programId: true } } },
    });
    if(!workout) return NextResponse.json({error:"El entrenamiento no existe"}, {status:404});
    if(s.role === "CLIENT" && workout.week.programId !== assignedProgramId){
      return NextResponse.json({error:"Ese entrenamiento no pertenece a tu programa asignado"}, {status:403});
    }
  } else if(!isExternalImport){
    return NextResponse.json({error:"Falta el ID del entrenamiento"}, {status:400});
  }

  const setsData = Array.isArray(body.sets) ? body.sets.map((st: {
    exerciseName?: string;
    setNumber?: number;
    weight?: number | null;
    reps?: number | null;
    rir?: number | null;
    rpe?: number | null;
    completed?: boolean;
  })=>({
    exerciseName: String(st.exerciseName || "Ejercicio").slice(0, 200),
    setNumber: Math.max(1, Number(st.setNumber) || 1),
    weight: st.weight !== undefined && st.weight !== null ? Number(st.weight) : null,
    reps: st.reps !== undefined && st.reps !== null ? Number(st.reps) : null,
    rir: st.rir !== undefined && st.rir !== null ? Number(st.rir) : null,
    rpe: st.rpe !== undefined && st.rpe !== null ? Number(st.rpe) : null,
    completed: st.completed ?? true,
  })) : [];

  const rawDate = body.date ? new Date(body.date) : new Date();
  const date = Number.isNaN(rawDate.getTime()) ? new Date() : rawDate;
  const workoutName = workout?.name || (typeof body.workoutName === "string" && body.workoutName.trim() ? body.workoutName.trim().slice(0, 200) : `Importado desde ${importSource || "fuente externa"}`);

  const log = await prisma.workoutLog.create({
    data:{
      userId: s.id,
      clientId,
      workoutId,
      workoutName,
      date,
      durationMin: body.durationMin !== undefined && body.durationMin !== null ? Number(body.durationMin) : null,
      comment: body.comment ? String(body.comment).slice(0, 1000) : null,
      completed: body.completed ?? true,
      sets: setsData.length ? { create: setsData } : undefined
    },
    include: { sets: true, workout: true }
  });

  if(s.role === "CLIENT" && clientId){
    const client = await prisma.client.findUnique({ where: { id: clientId }, select: { trainerId: true } });
    if(client?.trainerId){
      await prisma.notification.create({
        data:{
          userId: client.trainerId,
          title: `${s.name} completó un entrenamiento`,
          body: `${workoutName} (${log.durationMin || 0} min)`,
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
      where: { OR: [{ userId: s.id }, ...(client?.id ? [{ clientId: client.id }] : [])] },
      include: { sets: true, workout: true },
      orderBy: { date: "desc" },
      take: 50
    });
    return NextResponse.json(logs);
  }

  if(targetClientId){
    const ownsClient = await assertTrainerOwnsClient(s.id, targetClientId);
    if(!ownsClient) return NextResponse.json({error:"Cliente no encontrado"}, {status:404});
    const logs = await prisma.workoutLog.findMany({
      where: { clientId: targetClientId },
      include: { sets: true, workout: true },
      orderBy: { date: "desc" },
      take: 50
    });
    return NextResponse.json(logs);
  }

  const logs = await prisma.workoutLog.findMany({
    where: { client: { trainerId: s.id } },
    include: { sets: true, workout: true, client: true, user: true },
    orderBy: { date: "desc" },
    take: 50
  });
  return NextResponse.json(logs);
}
