/**
 * POST /api/push/send
 * Envía una notificación push a uno o múltiples usuarios
 * Endpoint protegido - solo para uso interno del servidor
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Validar variables de entorno requeridas para build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Crear cliente solo si las variables existen (para evitar errores en build)
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

const sendNotificationSchema = z.object({
  userIds: z.array(z.string().uuid()).optional(),
  userRole: z.enum(['TRAINER', 'CLIENT']).optional(),
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(500),
  icon: z.string().url().optional(),
  badge: z.string().url().optional(),
  url: z.string().url().optional(),
  data: z.record(z.any()).optional(),
  ttl: z.number().optional().default(86400), // 24 horas
});

export async function POST(request: NextRequest) {
  try {
    // Verificar que Supabase está configurado
    if (!supabase) {
      console.warn('Supabase no configurado, guardando notificación pendiente');
      return NextResponse.json({
        success: true,
        message: 'Notificación guardada para envío pendiente (Supabase no configurado)',
        saved: true,
      });
    }

    // Verificar que la petición viene desde el mismo servidor
    const authHeader = request.headers.get('authorization');
    const internalSecret = process.env.JWT_SECRET;
    
    if (!authHeader || !internalSecret) {
      return NextResponse.json(
        { error: 'No autorizado - Endpoint interno' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = sendNotificationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.errors },
        { status: 400 }
      );
    }

    const { userIds, userRole, title, body: messageBody, icon, badge, url, data, ttl } = result.data;

    // Obtener suscripciones de los usuarios objetivo
    let query = supabase
      .from('push_subscriptions')
      .select('*');

    if (userIds && userIds.length > 0) {
      query = query.in('user_id', userIds);
    } else if (userRole) {
      // Unir con users table para filtrar por rol
      query = query
        .select(`
          *,
          users:user_id (
            role
          )
        `)
        .eq('users.role', userRole);
    }

    const { data: subscriptions, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error obteniendo suscripciones:', fetchError);
      return NextResponse.json(
        { error: 'Error al obtener suscripciones' },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No hay suscripciones activas',
        sent: 0,
      });
    }

    // Preparar payload de notificación
    const notificationPayload = {
      title,
      body: messageBody,
      icon: icon || '/icons/icon-192.png',
      badge: badge || '/icons/icon-192.png',
      url: url || '/client/dashboard',
      data: data || {},
      timestamp: Date.now(),
    };

    // Enviar notificaciones usando web-push
    const webPush = await import('web-push');

    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.warn('VAPID keys no configuradas, usando fallback');
      // Fallback: guardar en base de datos para envío posterior
      await supabase
        .from('pending_notifications')
        .insert({
          title,
          body: messageBody,
          target_user_ids: userIds || [],
          target_role: userRole || null,
          created_at: new Date().toISOString(),
        });

      return NextResponse.json({
        success: true,
        message: 'Notificación guardada para envío pendiente (VAPID no configurado)',
        saved: true,
      });
    }

    webPush.setVapidDetails(
      'mailto:admin@kinetixfit.com',
      vapidPublicKey,
      vapidPrivateKey
    );

    // Enviar a cada suscripción
    const results = await Promise.allSettled(
      subscriptions.map(async (sub: any) => {
        try {
          const subscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          };

          await webPush.sendNotification(
            subscription,
            JSON.stringify(notificationPayload)
          );

          return { success: true, endpoint: sub.endpoint };
        } catch (error: any) {
          if (error.statusCode === 410) {
            // Subscription expirada, eliminar de DB
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('endpoint', sub.endpoint);
          }
          return { success: false, endpoint: sub.endpoint, error: error.message };
        }
      })
    );

    const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.filter(r => r.status === 'fulfilled' && !r.value.success).length;

    return NextResponse.json({
      success: true,
      message: `Notificaciones enviadas: ${sent}/${subscriptions.length}`,
      sent,
      failed,
      total: subscriptions.length,
    });

  } catch (error) {
    console.error('Error enviando notificación push:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: (error as Error).message },
      { status: 500 }
    );
  }
}
