import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AssignProgram } from "@/components/assign-program";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Dumbbell, 
  ClipboardCheck, 
  MessageSquare, 
  TrendingUp, 
  Calendar, 
  Clock, 
  User as UserIcon,
  Flame
} from "lucide-react";

export default async function ClientDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}){
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      user: true,
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
        take: 10
      },
      workoutLogs: {
        orderBy: { date: "desc" },
        take: 15,
        include: {
          workout: true,
          sets: true
        }
      },
      progressMeasurements: {
        orderBy: { date: "desc" },
        take: 10
      },
      subscription: true
    }
  });

  if (!client) return notFound();

  // Compute real metrics
  const latestMeasurement = client.progressMeasurements[0];
  const previousMeasurement = client.progressMeasurements[1];
  const currentWeight = latestMeasurement?.weight || client.weight || null;
  const weightDiff = (latestMeasurement?.weight && previousMeasurement?.weight)
    ? Number((latestMeasurement.weight - previousMeasurement.weight).toFixed(1))
    : null;

  // Real workouts count & adherence
  const totalWorkoutsLogged = client.workoutLogs.length;
  const programFrequency = client.assignedProgram?.frequency || 4;
  // Estimate adherence based on last 4 weeks (target = programFrequency * 4)
  const targetWorkoutsLastMonth = programFrequency * 4;
  const adherencePercent = Math.min(100, Math.round((totalWorkoutsLogged / Math.max(1, targetWorkoutsLastMonth)) * 100));

  return (
    <div className="space-y-6">
      <Link href="/trainer/clients" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition">
        <ArrowLeft size={16} /> Volver a clientes
      </Link>

      {/* Main Client Profile Header */}
      <Card className="border-zinc-800 bg-zinc-900/90">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary text-black flex items-center justify-center font-black text-2xl shrink-0">
                {client.name?.[0]?.toUpperCase() || "C"}
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-white">{client.name}</h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {client.email}
                  {client.age ? ` • ${client.age} años` : ""}
                  {currentWeight ? ` • ${currentWeight} kg` : ""}
                  {client.height ? ` • ${client.height} cm` : ""}
                </p>
                <div className="flex gap-2 mt-2.5 flex-wrap">
                  <Badge variant={client.status === "ACTIVO" ? "success" : client.status === "PAUSADO" ? "warn" : "muted"}>
                    {client.status}
                  </Badge>
                  <Badge variant="muted">{client.plan}</Badge>
                  <Badge variant="accent">{client.goal.replace("_", " ")}</Badge>
                  {client.subscription && (
                    <Badge variant="muted" className="border-zinc-700 text-zinc-300">
                      Suscripción {client.subscription.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Link href={`/trainer/messages?with=${client.userId || ""}`} className="flex-1 sm:flex-initial">
                <Button variant="accent" size="sm" className="w-full font-bold">
                  <MessageSquare size={16} className="mr-1.5" /> Enviar Mensaje
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview 3-column Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Profile Info */}
        <Card className="border-zinc-800 bg-zinc-900/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserIcon size={18} className="text-primary" /> Información del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80">
              <div>
                <span className="text-zinc-500 uppercase font-bold text-[10px] block">Objetivo Principal</span>
                <p className="font-semibold text-white text-sm mt-0.5">{client.goal.replace("_", " ")}</p>
              </div>
              <div>
                <span className="text-zinc-500 uppercase font-bold text-[10px] block">Experiencia</span>
                <p className="font-medium text-zinc-300 mt-0.5">{client.experience || "Intermedio"}</p>
              </div>
              <div>
                <span className="text-zinc-500 uppercase font-bold text-[10px] block">Disponibilidad</span>
                <p className="font-medium text-zinc-300 mt-0.5">{client.availability || programFrequency} días / semana</p>
              </div>
              <div>
                <span className="text-zinc-500 uppercase font-bold text-[10px] block">Equipamiento</span>
                <p className="font-medium text-zinc-300 mt-0.5">{client.equipment || "Gimnasio comercial"}</p>
              </div>
              <div>
                <span className="text-zinc-500 uppercase font-bold text-[10px] block">Fecha de Inicio</span>
                <p className="font-medium text-zinc-300 mt-0.5">
                  {new Date(client.startDate).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-zinc-500 uppercase font-bold text-[10px] block mb-1.5">Notas del Cliente</span>
                <p className="text-zinc-300 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 text-xs min-h-[70px]">
                  {client.notes || "No hay notas específicas del cliente todavía."}
                </p>
              </div>
              <div>
                <span className="text-zinc-500 uppercase font-bold text-[10px] block mb-1.5">Notas Privadas del Entrenador</span>
                <p className="text-zinc-400 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 text-xs min-h-[70px]">
                  {client.trainerNotes || "Solo visibles para vos. Agregá observaciones desde la edición de cliente."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real Progress Box */}
        <Card className="border-zinc-800 bg-zinc-900/60 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" /> Estado y Progreso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80">
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 text-[11px] font-bold uppercase">Peso Corporal</span>
                {weightDiff !== null && (
                  <span className={`text-xs font-bold ${weightDiff <= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                    {weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg
                  </span>
                )}
              </div>
              <p className="text-2xl font-black text-white mt-1">
                {currentWeight ? `${currentWeight} kg` : "--"}
              </p>
            </div>

            <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80">
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 text-[11px] font-bold uppercase">Adherencia Estimada</span>
                <span className="text-xs font-bold text-primary">{adherencePercent}%</span>
              </div>
              <Progress value={adherencePercent} className="mt-2 h-2" />
              <p className="text-[11px] text-zinc-500 mt-1.5">{totalWorkoutsLogged} entrenamientos registrados en total</p>
            </div>

            <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80">
              <span className="text-zinc-500 text-[11px] font-bold uppercase block">Programa Actual</span>
              <p className="font-bold text-white text-sm mt-0.5">
                {client.assignedProgram?.name || "Sin programa asignado"}
              </p>
              {client.assignedProgram && (
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {client.assignedProgram.weeks.length} semanas • {client.assignedProgram.frequency} días/sem
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workout program & Recent check-ins */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Current Program Exercises */}
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Dumbbell size={18} className="text-primary" /> Rutina Asignada
            </CardTitle>
            <Link href="/trainer/workouts" className="text-xs text-primary hover:underline font-bold">
              Ir al creador →
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.assignedProgram?.weeks?.[0]?.workouts?.length ? (
              <div className="space-y-2.5">
                {client.assignedProgram.weeks[0].workouts.map((w) => (
                  <div key={w.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold text-sm text-white">{w.name}</p>
                      <span className="text-zinc-500">{w.estimatedMin} min</span>
                    </div>
                    <div className="space-y-1">
                      {w.exercises.slice(0, 3).map((ex) => (
                        <p key={ex.id} className="text-zinc-400 text-[11px]">
                          • <span className="text-zinc-200">{ex.exercise.name}</span>: {ex.sets} × {ex.reps} (RIR {ex.rir ?? "—"})
                        </p>
                      ))}
                      {w.exercises.length > 3 && (
                        <p className="text-zinc-500 text-[10px] italic">+{w.exercises.length - 3} ejercicios más...</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-zinc-500">
                No hay programa asignado o la rutina está vacía. Asigná un programa abajo.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Check-ins */}
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardCheck size={18} className="text-primary" /> Check-ins Recientes
            </CardTitle>
            <Link href="/trainer/checkins" className="text-xs text-primary hover:underline font-bold">
              Ver todos →
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.checkIns.length > 0 ? (
              client.checkIns.map((ch) => (
                <div key={ch.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">
                      {new Date(ch.date).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                    </span>
                    <Badge variant={ch.reviewed ? "success" : "warn"} className="text-[10px]">
                      {ch.reviewed ? "Revisado" : "Pendiente"}
                    </Badge>
                  </div>
                  <div className="flex gap-3 text-zinc-400 text-[11px]">
                    <span>Energía: <b className="text-white">{ch.energia ?? "—"}/10</b></span>
                    <span>Sueño: <b className="text-white">{ch.sueno ?? "—"}/10</b></span>
                    <span>Estrés: <b className="text-white">{ch.estres ?? "—"}/10</b></span>
                  </div>
                  {ch.comentario && (
                    <p className="text-zinc-300 italic">&quot;{ch.comentario}&quot;</p>
                  )}
                  {ch.trainerReply && (
                    <p className="text-xs bg-primary/10 border border-primary/20 p-2 rounded-lg text-white">
                      <span className="font-bold text-primary">Tu respuesta:</span> {ch.trainerReply}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-zinc-500">
                No hay check-ins registrados todavía para este cliente.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Program Assignment Tool */}
      <AssignProgram
        clientId={client.id}
        clientName={client.name}
        currentProgramId={client.assignedProgramId}
      />
    </div>
  );
}
