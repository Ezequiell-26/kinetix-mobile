import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { assertTrainerOwnsClient, validateClientIdForTrainer } from "@/lib/authorization";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const { id } = await params;

  // P0 Security: CLIENT can only view their own profile
  if(s.role === "CLIENT"){
    const client = await prisma.client.findFirst({
      where: { OR: [{userId: s.id}, {email: s.email}] }
    });
    if(!client || client.id !== id){
      return NextResponse.json({error: "No autorizado"}, {status: 403});
    }
  }
  
  // P0 Security: TRAINER solo puede ver clientes que le pertenecen
  if(s.role === "TRAINER"){
    const ownsClient = await assertTrainerOwnsClient(s.id, id);
    if(!ownsClient){
      // 404 para no revelar si el cliente existe o no
      return NextResponse.json({error: "Cliente no encontrado"}, {status: 404});
    }
  }

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
      assignedProgram: {
        include: {
          weeks: {
            orderBy: { weekNumber: "asc" },
            include: {
              workouts: {
                orderBy: { dayNumber: "asc" },
                include: {
                  exercises: {
                    orderBy: { order: "asc" },
                    include: { exercise: true }
                  }
                }
              }
            }
          }
        }
      },
      checkIns: {
        orderBy: { date: "desc" },
        take: 20
      },
      workoutLogs: {
        orderBy: { date: "desc" },
        take: 20,
        include: { sets: true, workout: true }
      },
      progressMeasurements: {
        orderBy: { date: "desc" },
        take: 20
      },
      progressPhotos: {
        orderBy: { date: "desc" },
        take: 20
      },
      subscription: true
    }
  });

  if(!client) return NextResponse.json({error: "Cliente no encontrado"}, {status: 404});

  return NextResponse.json(client);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const { id } = await params;

  // Only trainer can update other clients; client can update their own basic info
  if(s.role === "CLIENT"){
    const client = await prisma.client.findFirst({
      where: { OR: [{userId: s.id}, {email: s.email}] }
    });
    if(!client || client.id !== id){
      return NextResponse.json({error: "No autorizado"}, {status: 403});
    }
  }
  
  // P0 Security: TRAINER solo puede actualizar clientes que le pertenecen
  if(s.role === "TRAINER"){
    const ownsClient = await assertTrainerOwnsClient(s.id, id);
    if(!ownsClient){
      return NextResponse.json({error: "Cliente no encontrado"}, {status: 404});
    }
  }

  try {
    const body = await req.json();
    const updateData: Record<string, unknown> = {};

    // La asignación de programas es decisión del trainer: un CLIENT no puede
    // asignarse planes a sí mismo desde la API.
    if (body.assignedProgramId !== undefined && s.role === "TRAINER") updateData.assignedProgramId = body.assignedProgramId || null;
    if (body.status !== undefined && s.role === "TRAINER") updateData.status = body.status;
    if (body.plan !== undefined && s.role === "TRAINER") updateData.plan = body.plan;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.trainerNotes !== undefined && s.role === "TRAINER") updateData.trainerNotes = body.trainerNotes;
    if (body.goal !== undefined) updateData.goal = body.goal;
    if (body.weight !== undefined) updateData.weight = body.weight ? Number(body.weight) : null;
    if (body.height !== undefined) updateData.height = body.height ? Number(body.height) : null;
    if (body.age !== undefined) updateData.age = body.age ? Number(body.age) : null;
    if (body.availability !== undefined) updateData.availability = body.availability ? Number(body.availability) : null;
    if (body.equipment !== undefined) updateData.equipment = body.equipment || null;
    if (body.experience !== undefined) updateData.experience = body.experience || null;

    const updated = await prisma.client.update({
      where: { id },
      data: updateData,
      include: {
        assignedProgram: true
      }
    });

    // If a program was assigned, notify client
    if (body.assignedProgramId && updated.userId) {
      await prisma.notification.create({
        data: {
          userId: updated.userId,
          title: "Nuevo programa asignado",
          body: `Tu coach te asignó el programa ${updated.assignedProgram?.name || ""}`,
          type: "program",
          link: "/client/workout"
        }
      }).catch(()=>{});
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al actualizar cliente";
    return NextResponse.json({error: msg}, {status: 500});
  }
}
