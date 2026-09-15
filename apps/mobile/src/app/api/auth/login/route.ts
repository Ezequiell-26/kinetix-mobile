import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createAuthSession, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { isLoginLocked, recordFailedLogin, clearLoginAttempts } from "@/lib/login-guard";
import { getClientIp } from "@/lib/rate-limiter";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);
    const normalizedEmail = email.toLowerCase().trim();

    // Account-level lock complements the IP-level middleware limiter and
    // blocks distributed brute-force attempts against one account.
    const lock = isLoginLocked(normalizedEmail);
    if (lock.locked) {
      const retryAfterSec = Math.ceil(lock.retryAfterMs / 1000);
      return NextResponse.json(
        { error: `Demasiados intentos fallidos. Probá de nuevo en ${Math.ceil(retryAfterSec / 60)} min.` },
        { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      recordFailedLogin(normalizedEmail);
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const ok = await verifyPassword(password, user.password);
    if (!ok) {
      recordFailedLogin(normalizedEmail);
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }
    clearLoginAttempts(normalizedEmail);

    const userAgent = req.headers.get("user-agent") || undefined;
    const ipAddress = getClientIp(req);
    const token = await createAuthSession(
      { id: user.id, email: user.email, role: user.role as "TRAINER" | "CLIENT", name: user.name },
      userAgent,
      ipAddress
    );

    await setAuthCookie(token);
    return NextResponse.json({ ok: true, role: user.role });
  } catch (error: unknown) {
    // Do not expose Zod/database/internal error messages to clients.
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Solicitud de inicio de sesión inválida" }, { status: 400 });
  }
}
