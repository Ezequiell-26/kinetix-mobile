import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { hashToken, validateResetToken } from "@/lib/password-reset-store";

function validPassword(value: unknown): value is string {
  return typeof value === "string"
    && value.length >= 8
    && value.length <= 128
    && /[A-Z]/.test(value)
    && /[a-z]/.test(value)
    && /[0-9]/.test(value);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { token?: unknown; password?: unknown } | null;
  const token = typeof body?.token === "string" ? body.token.trim() : "";
  const password = body?.password;

  if (!token || token.length > 128) {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 });
  }
  if (!validPassword(password)) {
    return NextResponse.json({ error: "La contraseña debe tener 8–128 caracteres, una mayúscula, una minúscula y un número" }, { status: 400 });
  }

  try {
    const email = await validateResetToken(token);
    if (!email) return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 });

    const hashed = await hashPassword(password);
    const consumed = await prisma.$transaction(async (tx) => {
      const tokenResult = await tx.passwordResetToken.updateMany({
        where: { token: hashToken(token), used: false, expiresAt: { gt: new Date() } },
        data: { used: true },
      });
      if (tokenResult.count !== 1) return false;

      await tx.user.update({ where: { id: user.id }, data: { password: hashed } });
      await tx.session.updateMany({ where: { userId: user.id }, data: { revoked: true } });
      return true;
    });

    if (!consumed) return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 });
    return NextResponse.json({ ok: true, message: "Contraseña actualizada" });
  } catch (error) {
    console.error("[RESET-PASSWORD] request failed", error);
    return NextResponse.json({ error: "Error al resetear contraseña" }, { status: 500 });
  }
}
