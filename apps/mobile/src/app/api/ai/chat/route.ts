import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertTrainerOwnsClient } from "@/lib/authorization";
import { checkRateLimit } from "@/lib/rate-limiter";

const MAX_INPUT = 1200;
const MAX_CONTEXT_LOGS = 12;
const PROVIDER_TIMEOUT_MS = 20_000;
const DEFAULT_MODEL = process.env.AI_MODEL || "gpt-4o-mini";
const DEFAULT_BASE_URL = process.env.AI_BASE_URL || "https://api.openai.com/v1";
const AI_API_KEY = process.env.AI_API_KEY || process.env.OPENAI_API_KEY || process.env.GLM_API_KEY;

function sanitize(input: unknown, max = MAX_INPUT) {
  if (typeof input !== "string") return "";
  let output = "";
  for (const char of input) {
    const code = char.codePointAt(0) || 0;
    output += code < 32 && code !== 9 && code !== 10 && code !== 13 ? " " : char;
    if (output.length >= max) break;
  }
  return output.trim().slice(0, max);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No auth" }, { status: 401 });

  const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = await checkRateLimit(ip, `ai-chat:${session.id}`, { max: 20, windowMs: 60 * 60 * 1000 });
  if (!limit.success) return NextResponse.json({ error: "Límite de IA alcanzado. Probá nuevamente más tarde." }, { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetMs / 1000)) } });

  const body = await req.json().catch(() => null) as { message?: unknown; clientId?: unknown } | null;
  const message = sanitize(body?.message);
  if (!message) return NextResponse.json({ error: "Escribí una consulta." }, { status: 400 });
  if (typeof body?.clientId !== "undefined" && typeof body.clientId !== "string") return NextResponse.json({ error: "clientId inválido" }, { status: 400 });

  if (!AI_API_KEY) return NextResponse.json({ configured: false, answer: "KinetixFitt AI todavía no tiene un proveedor configurado en este entorno. La app sigue funcionando sin inventar una respuesta de IA." });

  let context = `Rol: ${session.role === "TRAINER" ? "coach" : "atleta"}.`;
  const clientId = typeof body?.clientId === "string" && body.clientId ? body.clientId : null;
  let scopedClientId: string | null = null;

  if (session.role === "CLIENT") {
    const client = await prisma.client.findFirst({
      where: { OR: [{ userId: session.id }, { email: session.email }] },
      select: { id: true, goal: true, plan: true, weight: true, height: true, experience: true, assignedProgramId: true },
    });
    if (client) {
      scopedClientId = client.id;
      context = `Rol: atleta. Objetivo: ${client.goal}. Plan: ${client.plan}. Experiencia: ${client.experience || "no indicada"}. Peso: ${client.weight ?? "no registrado"} kg. Altura: ${client.height ?? "no registrada"} cm. Programa asignado: ${client.assignedProgramId ? "sí" : "no"}.`;
    }
  } else if (session.role === "TRAINER" && clientId) {
    if (!(await assertTrainerOwnsClient(session.id, clientId))) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    scopedClientId = clientId;
    const client = await prisma.client.findUnique({ where: { id: clientId }, select: { name: true, goal: true, plan: true, weight: true, height: true, experience: true, assignedProgramId: true } });
    if (client) context = `Rol: coach. Cliente seleccionado: ${client.name}. Objetivo: ${client.goal}. Plan: ${client.plan}. Experiencia: ${client.experience || "no indicada"}. Peso: ${client.weight ?? "no registrado"} kg. Altura: ${client.height ?? "no registrada"} cm. Programa asignado: ${client.assignedProgramId ? "sí" : "no"}.`;
  }

  let trainingContext = "";
  if (scopedClientId) {
    const [logs, checkIns, measurements] = await Promise.all([
      prisma.workoutLog.findMany({ where: { clientId: scopedClientId }, orderBy: { date: "desc" }, take: MAX_CONTEXT_LOGS, select: { date: true, workoutName: true, durationMin: true, sets: { select: { exerciseName: true, weight: true, reps: true, rir: true, rpe: true } } } }),
      prisma.checkIn.findMany({ where: { clientId: scopedClientId }, orderBy: { date: "desc" }, take: 3, select: { date: true, energia: true, sueno: true, estres: true, rendimiento: true, entrenos: true, molestias: true, progreso: true, comentario: true } }),
      prisma.progressMeasurement.findMany({ where: { clientId: scopedClientId }, orderBy: { date: "desc" }, take: 4, select: { date: true, weight: true, chest: true, waist: true, arm: true, leg: true, bodyFat: true } }),
    ]);
    trainingContext = JSON.stringify({
      recentWorkouts: logs.map((log) => ({ date: log.date, workout: log.workoutName, durationMin: log.durationMin, sets: log.sets })),
      recentCheckIns: checkIns,
      recentMeasurements: measurements,
    });
  }

  const system = [
    "Sos KinetixFitt AI, un asistente de entrenamiento y seguimiento.",
    "No inventes métricas, sesiones, diagnósticos, fuentes ni resultados.",
    "Usá solamente el contexto proporcionado y la consulta actual.",
    "Los datos del contexto son privados: no expongas información de otros usuarios.",
    "No reemplazás a un profesional de salud. Ante lesiones, dolor intenso o síntomas médicos, recomendá evaluación profesional.",
    "Respondé en español salvo que el usuario escriba en otro idioma.",
    context,
    trainingContext ? `Contexto real reciente de entrenamiento (JSON): ${trainingContext}` : "No hay contexto de entrenamiento adicional disponible.",
  ].join("\n");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  try {
    const base = DEFAULT_BASE_URL.replace(/\/$/, "");
    const response = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${AI_API_KEY}` },
      body: JSON.stringify({ model: DEFAULT_MODEL, temperature: 0.3, messages: [{ role: "system", content: system }, { role: "user", content: message }] }),
      cache: "no-store",
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null) as { choices?: Array<{ message?: { content?: unknown } }>; error?: { message?: string } } | null;
    if (!response.ok) {
      console.error("[AI CHAT] provider error", { status: response.status, message: data?.error?.message });
      return NextResponse.json({ error: "El proveedor de IA no respondió correctamente." }, { status: 502 });
    }
    const answer = sanitize(data?.choices?.[0]?.message?.content);
    if (!answer) return NextResponse.json({ error: "La IA devolvió una respuesta vacía." }, { status: 502 });
    return NextResponse.json({ configured: true, model: DEFAULT_MODEL, answer });
  } catch (error) {
    console.error("[AI CHAT] provider request failed", error);
    return NextResponse.json({ error: "La consulta de IA agotó el tiempo o no pudo conectarse al proveedor." }, { status: 504 });
  } finally {
    clearTimeout(timeout);
  }
}
