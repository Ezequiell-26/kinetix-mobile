import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { assertTrainerOwnsClient } from "@/lib/authorization";

const MAX_MESSAGE_LENGTH = 500;

function stripHtml(input: string): string {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function sanitizeMessageContent(input: string): string {
  return stripHtml(input).slice(0, MAX_MESSAGE_LENGTH);
}

async function getClientForUser(userId: string, email: string) {
  return prisma.client.findFirst({
    where: { OR: [{ userId }, { email }] },
    select: { id: true, trainerId: true, userId: true },
  });
}

async function getTrainerForClient(clientId: string) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { trainerId: true },
  });
  if (!client?.trainerId) return null;
  return prisma.user.findUnique({
    where: { id: client.trainerId },
    select: { id: true, name: true },
  });
}

export async function GET(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "No auth" }, { status: 401 });
  const url = new URL(req.url);
  const withUserId = url.searchParams.get("with");

  if (s.role === "CLIENT") {
    const client = await getClientForUser(s.id, s.email);
    const trainer = client?.trainerId ? await getTrainerForClient(client.id) : null;
    if (!trainer) return NextResponse.json([]);
    const msgs = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: s.id, receiverId: trainer.id },
          { senderId: trainer.id, receiverId: s.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });
    await prisma.message.updateMany({
      where: { receiverId: s.id, senderId: trainer.id, read: false },
      data: { read: true },
    });
    return NextResponse.json(msgs);
  }

  if (withUserId) {
    const clientUser = await prisma.client.findFirst({
      where: { userId: withUserId },
      select: { id: true },
    });
    if (!clientUser) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    if (!(await assertTrainerOwnsClient(s.id, clientUser.id))) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }
    const msgs = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: s.id, receiverId: withUserId },
          { senderId: withUserId, receiverId: s.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });
    await prisma.message.updateMany({
      where: { receiverId: s.id, senderId: withUserId, read: false },
      data: { read: true },
    });
    return NextResponse.json(msgs);
  }

  const msgs = await prisma.message.findMany({
    where: { OR: [{ senderId: s.id }, { receiverId: s.id }] },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { sender: true, receiver: true },
  });
  return NextResponse.json(msgs);
}

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "No auth" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Cuerpo requerido" }, { status: 400 });

  const { content } = body;
  let { receiverId, clientId } = body;
  if (typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }
  const trimmed = content.trim();
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: `Mensaje demasiado largo (máx ${MAX_MESSAGE_LENGTH})` }, { status: 400 });
  }
  const safeContent = sanitizeMessageContent(trimmed);
  if (!safeContent) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

  if (s.role === "CLIENT") {
    const client = await getClientForUser(s.id, s.email);
    if (!client) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    const trainer = client.trainerId ? await getTrainerForClient(client.id) : null;
    if (!trainer || receiverId !== trainer.id) {
      return NextResponse.json({ error: "Solo podés escribirle a tu coach asignado" }, { status: 403 });
    }
    clientId = client.id;
  } else {
    if (typeof clientId !== "string") return NextResponse.json({ error: "Falta clientId" }, { status: 400 });
    if (!(await assertTrainerOwnsClient(s.id, clientId))) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }
    const client = await prisma.client.findUnique({ where: { id: clientId }, select: { userId: true } });
    if (!client?.userId || receiverId !== client.userId) {
      return NextResponse.json({ error: "Destinatario inválido" }, { status: 403 });
    }
  }

  const msg = await prisma.message.create({
    data: {
      senderId: s.id,
      receiverId,
      clientId: clientId || null,
      content: safeContent,
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: receiverId,
      title: `Nuevo mensaje de ${s.name}`,
      body: safeContent.slice(0, 80),
      type: "message",
      link: s.role === "TRAINER" ? "/client/messages" : "/trainer/messages",
    },
  });

  return NextResponse.json(msg);
}
