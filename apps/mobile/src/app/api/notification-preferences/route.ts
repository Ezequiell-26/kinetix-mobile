/**
 * API para gestión de preferencias de notificaciones push
 * Soporta suscripción, desuscripción y sincronización con Firebase
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

// Schema de validación para preferencias
const preferencesSchema = z.object({
  enabled: z.boolean(),
  types: z.array(z.enum([
    'workout_reminder',
    'meal_reminder',
    'checkin_reminder',
    'achievement',
    'coach_message',
    'program_update',
    'payment_reminder',
  ])).optional(),
  schedule: z.object({
    startHour: z.number().min(0).max(23).optional(),
    endHour: z.number().min(0).max(23).optional(),
    timezone: z.string().optional(),
  }).optional(),
  channels: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    sms: z.boolean().optional(),
    whatsapp: z.boolean().optional(),
  }).optional(),
});

// GET - Obtener preferencias del usuario
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const prefs = await prisma.notificationPreference.findUnique({
      where: { userId: session.id },
    });

    if (!prefs) {
      // Devolver valores por defecto
      return NextResponse.json({
        enabled: true,
        types: ['workout_reminder', 'meal_reminder', 'achievement'],
        schedule: {
          startHour: 8,
          endHour: 21,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        channels: {
          email: true,
          push: true,
          sms: false,
          whatsapp: false,
        },
      });
    }

    return NextResponse.json(prefs);
  } catch (error) {
    console.error("Error al obtener preferencias:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST - Actualizar preferencias
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Cuerpo de solicitud requerido" },
        { status: 400 }
      );
    }

    // Validar con Zod
    const validatedData = preferencesSchema.parse(body);

    // Upsert de preferencias
    const prefs = await prisma.notificationPreference.upsert({
      where: { userId: session.id },
      create: {
        userId: session.id,
        enabled: validatedData.enabled,
        types: validatedData.types || [],
        scheduleStartHour: validatedData.schedule?.startHour ?? 8,
        scheduleEndHour: validatedData.schedule?.endHour ?? 21,
        timezone: validatedData.schedule?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        channelEmail: validatedData.channels?.email ?? true,
        channelPush: validatedData.channels?.push ?? true,
        channelSms: validatedData.channels?.sms ?? false,
        channelWhatsapp: validatedData.channels?.whatsapp ?? false,
      },
      update: {
        enabled: validatedData.enabled,
        ...(validatedData.types !== undefined && { types: validatedData.types }),
        ...(validatedData.schedule?.startHour !== undefined && { 
          scheduleStartHour: validatedData.schedule.startHour 
        }),
        ...(validatedData.schedule?.endHour !== undefined && { 
          scheduleEndHour: validatedData.schedule.endHour 
        }),
        ...(validatedData.schedule?.timezone !== undefined && { 
          timezone: validatedData.schedule.timezone 
        }),
        ...(validatedData.channels?.email !== undefined && { 
          channelEmail: validatedData.channels.email 
        }),
        ...(validatedData.channels?.push !== undefined && { 
          channelPush: validatedData.channels.push 
        }),
        ...(validatedData.channels?.sms !== undefined && { 
          channelSms: validatedData.channels.sms 
        }),
        ...(validatedData.channels?.whatsapp !== undefined && { 
          channelWhatsapp: validatedData.channels.whatsapp 
        }),
      },
    });

    // Si se desactivan notificaciones, limpiar tokens de Firebase
    if (!validatedData.enabled || !validatedData.channels?.push) {
      await prisma.pushSubscription.updateMany({
        where: { userId: session.id },
        data: { active: false },
      });
    }

    return NextResponse.json({
      success: true,
      data: prefs,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Datos inválidos",
          details: error.errors 
        },
        { status: 400 }
      );
    }

    console.error("Error al actualizar preferencias:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar preferencias y desuscribir
export async function DELETE() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Eliminar preferencias
    await prisma.notificationPreference.delete({
      where: { userId: session.id },
    }).catch(() => {}); // Ignorar si no existe

    // Desactivar todas las suscripciones push
    await prisma.pushSubscription.updateMany({
      where: { userId: session.id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar preferencias:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
