import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { validateResetToken, consumeResetToken } from "@/lib/password-reset-store";

export async function POST(req: Request) {
  const { token, password } = await req.json().catch(() => ({}));

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 });
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "Mínimo 8 caracteres" }, { status: 400 });
  }

  try {
    const email = await validateResetToken(token);
    if (!email) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    const consumed = await prisma.$transaction(async (tx) => {
      const tokenResult = await tx.passwordResetToken.updateMany({
        where: {
          token: (await import("@/lib/password-reset-store")).hashToken(token),
          used: false,
          expiresAt: { gt: new Date() },
        },
        data: { used: true },
      });

      if (tokenResult.count !== 1) return false;

      await tx.user.update({
        where: { id: user.id },
        data: { password: hashed },
      });
      await tx.session.updateMany({
        where: { userId: user.id },
        data: { revoked: true },
      });
      return true;
    });

    if (!consumed) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: "Contraseña actualizada" });
  } catch (error) {
    console.error("[RESET-PASSWORD] Error:", error);
    return NextResponse.json({ error: "Error al resetear contraseña" }, { status: 500 });
  }
}
