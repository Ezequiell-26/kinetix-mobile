import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const MAX_NAME = 80;
const MAX_BIO = 500;
const MAX_SPECIALTY = 120;

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No auth" }, { status: 401 });
  if (session.role !== "TRAINER") return NextResponse.json({ error: "Solo trainer" }, { status: 403 });

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, avatar: true, trainerProfile: { select: { bio: true, specialty: true } } },
  });
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.trainerProfile?.bio || "",
    specialty: user.trainerProfile?.specialty || "",
  });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No auth" }, { status: 401 });
  if (session.role !== "TRAINER") return NextResponse.json({ error: "Solo trainer" }, { status: 403 });

  const body = await req.json().catch(() => null) as { name?: unknown; bio?: unknown; specialty?: unknown } | null;
  const name = text(body?.name, MAX_NAME);
  const bio = text(body?.bio, MAX_BIO);
  const specialty = text(body?.specialty, MAX_SPECIALTY);
  if (!name) return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });

  const [user, profile] = await prisma.$transaction([
    prisma.user.update({ where: { id: session.id }, data: { name }, select: { id: true, name: true, email: true, avatar: true } }),
    prisma.trainerProfile.upsert({
      where: { userId: session.id },
      create: { userId: session.id, bio: bio || null, specialty: specialty || null },
      update: { bio: bio || null, specialty: specialty || null },
      select: { bio: true, specialty: true },
    }),
  ]);

  return NextResponse.json({ ...user, ...profile });
}
