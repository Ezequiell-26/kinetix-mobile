import { NextResponse } from "next/server";
import { verifyPassword, createAuthSession, setAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validations";
import { getClientIp } from "@/lib/rate-limiter";
import { isLoginLocked, recordFailedLogin, clearLoginAttempts } from "@/lib/login-guard";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();
    const lock = await isLoginLocked(normalizedEmail);
    if (lock.locked) {
      const retryAfterSec = Math.max(1, Math.ceil(lock.retryAfterMs / 1000));
      return NextResponse.json(
        { error: "Demasiados intentos fallidos. Probá de nuevo más tarde." },
        { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
      );
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !(await verifyPassword(password, user.password))) {
      await recordFailedLogin(normalizedEmail);
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }
    await clearLoginAttempts(normalizedEmail);

    const userAgent = req.headers.get("user-agent") || undefined;
    const ipAddress = getClientIp({ headers: req.headers, ip: (req as Request & { ip?: string }).ip });
    const token = await createAuthSession(
      { id: user.id, email: user.email, role: user.role as "TRAINER" | "CLIENT", name: user.name },
      userAgent,
      ipAddress,
    );
    await setAuthCookie(token);
    return NextResponse.json({ ok: true, role: user.role });
  } catch (error) {
    console.error("[auth/login] request failed", error);
    return NextResponse.json({ error: "No se pudo iniciar sesión" }, { status: 500 });
  }
}
