import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession, verifyToken } from "@/lib/auth";
import { getUserSessions, revokeAllUserSessions, revokeSession } from "@/lib/session-store";
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
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return NextResponse.json({ ok: true, revoked: count });
  }

  if (typeof body?.sessionId !== "string" || !body.sessionId) {
    return NextResponse.json({ error: "sessionId requerido" }, { status: 400 });
  }

  const token = await currentToken();
  const currentPayload = token ? await verifyToken(token) : null;
  const target = await prisma.session.findUnique({ where: { id: body.sessionId }, select: { id: true, userId: true } });
  if (!target || target.userId !== session.id) return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });

  await revokeSession(token && currentPayload?.id === session.id && target.id === (await prisma.session.findUnique({ where: { token }, select: { id: true } }))?.id ? token : "");
  if (!(token && currentPayload?.id === session.id && target.id === (await prisma.session.findUnique({ where: { token }, select: { id: true } }))?.id)) {
    await prisma.session.update({ where: { id: target.id }, data: { revoked: true } });
  }

  const isCurrent = token ? (await prisma.session.findUnique({ where: { id: target.id }, select: { id: true, token: true } }))?.token === token : false;
  if (isCurrent) (await cookies()).delete(COOKIE_NAME);

  return NextResponse.json({ ok: true, current: isCurrent });
}
