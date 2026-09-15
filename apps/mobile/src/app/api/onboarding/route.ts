import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const onboardingSchema = z.object({
  goal: z.enum(["PERDIDA_GRASA", "HIPERTROFIA", "FUERZA", "RECOMPOSICION", "OTRO"]).optional().nullable(),
  experience: z.string().max(50).optional().nullable(),
  availability: z.number().int().min(1).max(7).optional().nullable(),
  equipment: z.string().max(50).optional().nullable(),
  photoUrl: z.string().max(2048).optional().nullable(),
  onboardingCompleted: z.boolean().optional(),
  onboardingStep: z.number().int().min(0).max(10).optional(),
  xp: z.number().int().min(0).max(10000).optional(),
  bio: z.string().max(500).optional().nullable(),
  age: z.number().int().min(10).max(100).optional().nullable(),
  weight: z.number().min(20).max(400).optional().nullable(),
  height: z.number().min(100).max(250).optional().nullable(),
});

/**
 * GET /api/onboarding
 * Retorna el Profile del usuario autenticado (crea uno vacío si no existe).
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let profile = await prisma.profile.findUnique({ where: { userId: session.id } });
  if (!profile) {
    profile = await prisma.profile.create({ data: { userId: session.id } });
  }

  // Señales adicionales para checklist (workoutLogs, measurements, push)
  const [hasWorkout, hasWeight, hasPush] = await Promise.all([
    prisma.workoutLog.count({ where: { OR: [{ userId: session.id }] } }).then((c) => c > 0).catch(() => false),
    prisma.progressMeasurement.count({ where: { OR: [{ userId: session.id }] } }).then((c) => c > 0).catch(() => false),
    prisma.pushSubscription.count({ where: { userId: session.id, active: true } }).then((c) => c > 0).catch(() => false),
  ]);

  return NextResponse.json({
    profile,
    signals: { hasWorkout, hasWeight, hasPush },
  });
}

/**
 * PUT /api/onboarding
 * Actualiza campos del Profile + gamificación XP.
 * Persiste dual: el cliente también guarda en localStorage (ftue-wizard lo hace).
 */
export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;

  // Validación extra: si onboardingCompleted=true, forzar onboardingStep=4
  if (data.onboardingCompleted === true && (data.onboardingStep == null || data.onboardingStep < 4)) {
    data.onboardingStep = 4;
  }

  // Upsert perfil (si no existe lo crea)
  const profile = await prisma.profile.upsert({
    where: { userId: session.id },
    update: {
      ...(data.goal !== undefined ? { goal: data.goal as unknown as import("@prisma/client").Goal | null } : {}),
      ...(data.experience !== undefined ? { experience: data.experience } : {}),
      ...(data.availability !== undefined ? { availability: data.availability } : {}),
      ...(data.equipment !== undefined ? { equipment: data.equipment } : {}),
      ...(data.photoUrl !== undefined ? { photoUrl: data.photoUrl } : {}),
      ...(data.onboardingCompleted !== undefined ? { onboardingCompleted: data.onboardingCompleted } : {}),
      ...(data.onboardingStep !== undefined ? { onboardingStep: data.onboardingStep } : {}),
      ...(data.xp !== undefined ? { xp: data.xp } : {}),
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
      ...(data.age !== undefined ? { age: data.age } : {}),
      ...(data.weight !== undefined ? { weight: data.weight } : {}),
      ...(data.height !== undefined ? { height: data.height } : {}),
    },
    create: {
      userId: session.id,
      goal: (data.goal as unknown as import("@prisma/client").Goal | null) ?? undefined,
      experience: data.experience ?? undefined,
      availability: data.availability ?? undefined,
      equipment: data.equipment ?? undefined,
      photoUrl: data.photoUrl ?? undefined,
      onboardingCompleted: data.onboardingCompleted ?? false,
      onboardingStep: data.onboardingStep ?? 0,
      xp: data.xp ?? 0,
      bio: data.bio ?? undefined,
      age: data.age ?? undefined,
      weight: data.weight ?? undefined,
      height: data.height ?? undefined,
    },
  });

  return NextResponse.json({ ok: true, profile });
}
