import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ user: null }, { status: 401 });

  // Un CLIENT necesita conocer su propio clientId para pedir su ficha:
  // `/api/clients/[id]` permite al atleta leer su perfil, pero exige el id.
  let clientId: string | null = null;
  if (s.role === "CLIENT") {
    const client = await prisma.client.findFirst({
      where: { OR: [{ userId: s.id }, { email: s.email }] },
      select: { id: true },
    });
    clientId = client?.id ?? null;
  }

  return NextResponse.json({ user: { ...s, clientId } });
}
