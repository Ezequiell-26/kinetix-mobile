import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { getUserSessions, revokeAllUserSessions } from "@/lib/session-store";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "ec_token";

async function currentToken() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No auth" }, { status: 401 });

  const token = await currentToken();
  const sessions = await getUserSessions(session.id);
  const current = token ? await prisma.session.findUnique({ where: { token }, select: { id: true } }) : null;

  return NextResponse.json({
    sessions: sessions.map((item) => ({ ...item, current: item.id === current?.id })),
  });
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No auth" }, { status: 401 });

  const body = await req.json().catch(() => null) as { sessionId?: unknown; all?: unknown } | null;
  if (body?.all === true) {
    const count = await revokeAllUserSessions(session.id);
    (await cookies()).delete(COOKIE_NAME);
    return NextResponse.json({ ok: true, revoked: count });
  }

  if (typeof body?.sessionId !== "string" || !body.sessionId) {
    return NextResponse.json({ error: "sessionId requerido" }, { status: 400 });
  }

  const target = await prisma.session.findUnique({
    where: { id: body.sessionId },
    select: { id: true, userId: true, token: true, revoked: true },
  });
  if (!target || target.userId !== session.id || target.revoked) {
    return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });
  }

  await prisma.session.update({ where: { id: target.id }, data: { revoked: true } });
  const token = await currentToken();
  const isCurrent = Boolean(token && token === target.token);
  if (isCurrent) (await cookies()).delete(COOKIE_NAME);

  return NextResponse.json({ ok: true, current: isCurrent });
}
