import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limiter";

const MAX_INPUT = 1200;
const DEFAULT_MODEL = process.env.AI_MODEL || "gpt-4o-mini";
const DEFAULT_BASE_URL = process.env.AI_BASE_URL || "https://api.openai.com/v1";
const AI_API_KEY = process.env.AI_API_KEY || process.env.OPENAI_API_KEY || process.env.GLM_API_KEY;

function sanitize(input: unknown) {
  return typeof input === "string" ? input.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, MAX_INPUT) : "";
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No auth" }, { status: 401 });

  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || req.headers.get("x-real-ip") || "unknown";
  const limit = await checkRateLimit(ip, `ai-chat:${session.id}`, { max: 20, windowMs: 60 * 60 * 1000 });
  if (!limit.success) {
    return NextResponse.json({ error: "Límite de IA alcanzado. Probá nuevamente más tarde." }, { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetMs / 1000)) } });
  }

  const body = await req.json().catch(() => null) as { message?: unknown } | null;
  const message = sanitize(body?.message);
  if (!message) return NextResponse.json({ error: "Escribí una consulta." }, { status: 400 });

  if (!AI_API_KEY) {
    return NextResponse.json({
      configured: false,
      answer: "KinetixFitt AI todavía no tiene un proveedor configurado en este entorno. La app sigue funcionando sin inventar una respuesta de IA.",
    });
  }

  const client = session.role === "CLIENT"
    ? await prisma.client.findFirst({
        where: { OR: [{ userId: session.id }, { email: session.email }] },
        select: { goal: true, plan: true, assignedProgramId: true },
      })
    : null;

  const context = client
    ? `Rol: atleta. Objetivo: ${client.goal}. Plan: ${client.plan}. Programa asignado: ${client.assignedProgramId ? "sí" : "no"}.`
    : `Rol: ${session.role === "TRAINER" ? "coach" : "usuario"}.`;

  const system = [
    "Sos KinetixFitt AI, un asistente de entrenamiento y seguimiento.",
    "No inventes métricas, sesiones, diagnósticos, fuentes ni resultados del usuario.",
    "Usá solamente el contexto entregado y la consulta actual.",
    "No reemplazás a un profesional de salud. Ante lesiones, dolor intenso o síntomas médicos, recomendá evaluación profesional.",
    "Respondé en español salvo que el usuario escriba en otro idioma.",
    context,
  ].join("\n");

  const base = DEFAULT_BASE_URL.replace(/\/$/, "");
  const response = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature: 0.3,
      messages: [
        { role: "system", content: system },
        { role: "user", content: message },
      ],
    }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null) as {
    choices?: Array<{ message?: { content?: unknown } }>;
    error?: { message?: string };
  } | null;

  if (!response.ok) {
    console.error("[AI CHAT] provider error", { status: response.status, message: data?.error?.message });
    return NextResponse.json({ error: "El proveedor de IA no respondió correctamente." }, { status: 502 });
  }

  const answer = sanitize(data?.choices?.[0]?.message?.content);
  if (!answer) return NextResponse.json({ error: "La IA devolvió una respuesta vacía." }, { status: 502 });

  return NextResponse.json({ configured: true, model: DEFAULT_MODEL, answer });
}
