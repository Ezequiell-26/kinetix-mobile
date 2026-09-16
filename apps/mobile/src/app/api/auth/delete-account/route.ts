import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { clearAuthCookie, getSession, verifyPassword } from "@/lib/auth";

/**
 * Eliminación definitiva de cuenta.
 * Requiere la contraseña actual para evitar que una sesión robada pueda borrar
 * todos los datos sin una segunda comprobación.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const body = await request.json().catch(() => null) as { password?: unknown; confirmation?: unknown } | null;
    const password = typeof body?.password === "string" ? body.password : "";
    const confirmation = typeof body?.confirmation === "string" ? body.confirmation : "";
    if (!password || confirmation !== "ELIMINAR") {
      return NextResponse.json({ error: "Confirmación inválida" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.id }, select: { id: true, password: true, role: true } });
    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 403 });
    }

    await prisma.$transaction(async (tx) => {
      if (user.role === "CLIENT") {
        const client = await tx.client.findFirst({ where: { userId: user.id }, select: { id: true } });
        if (client) await tx.client.delete({ where: { id: client.id } });
        await tx.workoutLog.deleteMany({ where: { userId: user.id } });
        await tx.checkIn.deleteMany({ where: { userId: user.id } });
        await tx.progressMeasurement.deleteMany({ where: { userId: user.id } });
        await tx.progressPhoto.deleteMany({ where: { userId: user.id } });
        await tx.privateAsset.deleteMany({ where: { userId: user.id } });
      } else {
        await tx.client.updateMany({ where: { trainerId: user.id }, data: { trainerId: null } });
      }
      await tx.user.delete({ where: { id: user.id } });
    });

    await clearAuthCookie();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE-ACCOUNT] failed", error);
    return NextResponse.json({ error: "No se pudo eliminar la cuenta" }, { status: 500 });
  }
}
