/**
 * POST /api/push/subscribe
 * Suscribe un dispositivo a notificaciones push Web
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const subscribeSchema = z.object({
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
  userId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = subscribeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.errors },
        { status: 400 }
      );
    }

    const { subscription, userId } = result.data;

    // Verificar autenticación si no se proporciona userId
    let currentUserId = userId;
    if (!currentUserId) {
      const authHeader = request.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'No autorizado. Proporcionar userId o token JWT' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user) {
        return NextResponse.json(
          { error: 'Token inválido o expirado' },
          { status: 401 }
        );
      }
      
      currentUserId = user.id;
    }

    // Guardar suscripción en la base de datos
    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: currentUserId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'endpoint'
      });

    if (error) {
      console.error('Error guardando suscripción push:', error);
      return NextResponse.json(
        { error: 'Error al guardar suscripción', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Suscripción guardada exitosamente',
      subscriptionId: data?.[0]?.id,
    });

  } catch (error) {
    console.error('Error en subscribe push:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/push/subscribe
 * Obtiene las suscripciones activas del usuario
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error obteniendo suscripciones:', error);
      return NextResponse.json(
        { error: 'Error al obtener suscripciones' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscriptions: data || [],
    });

  } catch (error) {
    console.error('Error en get push subscriptions:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/push/subscribe
 * Elimina una suscripción push
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint requerido' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error eliminando suscripción:', error);
      return NextResponse.json(
        { error: 'Error al eliminar suscripción' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Suscripción eliminada',
    });

  } catch (error) {
    console.error('Error en delete push subscription:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
