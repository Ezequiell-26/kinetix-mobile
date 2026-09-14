import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Configuración de Supabase desde variables de entorno
// Fallback: Vercel integration crea vars con prefijo kinetixfitt_ (ej. NEXT_PUBLIC_kinetixfitt_SUPABASE_URL)
// y el código histórico espera sin prefijo. Soporta ambas + placeholder durante build.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_kinetixfitt_SUPABASE_URL ||
  (process.env.NEXT_PHASE === 'phase-production-build' ? 'https://placeholder.supabase.co' : undefined) as string | undefined;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_kinetixfitt_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_kinetixfitt_SUPABASE_PUBLISHABLE_KEY ||
  (process.env.NEXT_PHASE === 'phase-production-build' ? 'placeholder-anon-key-for-build' : undefined) as string | undefined;

// Cliente singleton para uso en cliente y servidor.
// ReturnType para no acoplar los genéricos internos (cambian entre versiones).
const createDefaultClient = () => {
  const url = supabaseUrl || (process.env.NEXT_PHASE === 'phase-production-build' ? 'https://placeholder.supabase.co' : undefined);
  const key = supabaseAnonKey || (process.env.NEXT_PHASE === 'phase-production-build' ? 'placeholder-anon-key-for-build' : undefined);
  if (!url || !key) {
    throw new Error('Supabase env faltante: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (o NEXT_PUBLIC_kinetixfitt_*) no configuradas');
  }
  return createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: {
        'X-Client-Info': 'kinetix-coaching-app',
      },
    },
    db: {
      schema: 'public',
    },
  });
};

let supabase: ReturnType<typeof createDefaultClient> | null = null;

export function getSupabaseClient(): ReturnType<typeof createDefaultClient> {
  if (!supabase) {
    supabase = createDefaultClient();
  }
  return supabase;
}

// Función para crear cliente con token personalizado (útil para SSR)
export function createServerClient(
  accessToken?: string
): ReturnType<typeof createDefaultClient> {
  const url = supabaseUrl || process.env.NEXT_PUBLIC_kinetixfitt_SUPABASE_URL || (process.env.NEXT_PHASE === 'phase-production-build' ? 'https://placeholder.supabase.co' : undefined);
  const key = supabaseAnonKey || process.env.NEXT_PUBLIC_kinetixfitt_SUPABASE_ANON_KEY || (process.env.NEXT_PHASE === 'phase-production-build' ? 'placeholder-anon-key-for-build' : undefined);
  if (!url || !key) throw new Error('Supabase env faltante para SSR');
  const client = createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    },
  });

  return client;
}

// Helpers para operaciones comunes
export const supabaseAuth = {
  async signInWithEmail(email: string, password: string) {
    const client = getSupabaseClient();
    return client.auth.signInWithPassword({ email, password });
  },

  async signUpWithEmail(email: string, password: string) {
    const client = getSupabaseClient();
    
    // Validar que sea correo @gmail.com
    if (!email.endsWith('@gmail.com')) {
      return {
        data: null,
        error: {
          message: 'Solo se permiten correos electrónicos @gmail.com oficiales de Google.',
          status: 400,
        },
      };
    }

    return client.auth.signUp({
      email,
      password,
      options: {
        data: {
          email_verified: false,
          signup_method: 'email',
        },
      },
    });
  },

  async signInWithGoogle() {
    const client = getSupabaseClient();
    return client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  },

  async signOut() {
    const client = getSupabaseClient();
    return client.auth.signOut();
  },

  async resetPassword(email: string) {
    const client = getSupabaseClient();
    return client.auth.resetPasswordForEmail(email, {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/reset-password`,
    });
  },

  getSession() {
    const client = getSupabaseClient();
    return client.auth.getSession();
  },

  getUser() {
    const client = getSupabaseClient();
    return client.auth.getUser();
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    const client = getSupabaseClient();
    return client.auth.onAuthStateChange(callback);
  },
};

// Helpers para Firestore -> Supabase
export const supabaseDB = {
  // Usuarios
  async getUser(userId: string) {
    const client = getSupabaseClient();
    return client.from('users').select('*').eq('id', userId).single();
  },

  async updateUser(userId: string, data: any) {
    const client = getSupabaseClient();
    return client.from('users').update(data as never).eq('id', userId).select().single();
  },

  async createUser(data: any) {
    const client = getSupabaseClient();
    return client.from('users').insert(data as never).select().single();
  },

  // Entrenamientos
  async getWorkouts(userId: string) {
    const client = getSupabaseClient();
    return client
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  async createWorkout(data: any) {
    const client = getSupabaseClient();
    return client.from('workouts').insert(data as never).select().single();
  },

  async updateWorkout(workoutId: string, data: any) {
    const client = getSupabaseClient();
    return client.from('workouts').update(data as never).eq('id', workoutId).select().single();
  },

  async deleteWorkout(workoutId: string) {
    const client = getSupabaseClient();
    return client.from('workouts').delete().eq('id', workoutId);
  },

  // Nutrición
  async getNutritionLogs(userId: string, date?: string) {
    const client = getSupabaseClient();
    let query = client.from('nutrition_logs').select('*').eq('user_id', userId);
    
    if (date) {
      query = query.eq('date', date);
    }
    
    return query.order('created_at', { ascending: false });
  },

  async createNutritionLog(data: any) {
    const client = getSupabaseClient();
    return client.from('nutrition_logs').insert(data).select().single();
  },

  // Progreso
  async getProgressPhotos(userId: string) {
    const client = getSupabaseClient();
    return client
      .from('progress_photos')
      .select('*')
      .eq('user_id', userId)
      .order('taken_at', { ascending: false });
  },

  async uploadProgressPhoto(data: any) {
    const client = getSupabaseClient();
    return client.from('progress_photos').insert(data).select().single();
  },

  // Mensajes
  async getMessages(conversationId: string) {
    const client = getSupabaseClient();
    return client
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
  },

  async sendMessage(data: any) {
    const client = getSupabaseClient();
    return client.from('messages').insert(data).select().single();
  },

  // Escuchar mensajes en tiempo real
  subscribeToMessages(conversationId: string, callback: (payload: any) => void) {
    const client = getSupabaseClient();
    return client
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        callback
      )
      .subscribe();
  },
};

export default getSupabaseClient;
