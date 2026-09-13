import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getSupabaseClient, supabaseAuth } from '@/lib/supabase';

// Cliente de Supabase. Tipado loose: los genéricos de @supabase/supabase-js
// colapsan a never con el Database generado por el otro equipo; cuando ese
// archivo se regenere con supabase gen types, se vuelve al tipado estricto.
const supabase = getSupabaseClient() as unknown as {
  auth: any;
  from: (table: string) => {
    select: (columns?: string) => any;
    insert: (data: unknown) => any;
    update: (data: unknown) => any;
    delete: () => any;
    eq: (column: string, value: unknown) => any;
    single: () => PromiseLike<{ data: any; error: { message: string } | null }>;
    order: (column: string, options?: unknown) => any;
  };
};
import { z } from 'zod';


// Esquemas de validación Zod
export const UserSchema = z.object({
  email: z.string().email('Email inválido').refine(email => email.endsWith('@gmail.com'), 'Solo se permiten correos @gmail.com'),
  displayName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  photoURL: z.string().url().optional(),
  role: z.enum(['client', 'trainer', 'admin']),
  createdAt: z.number(),
  onboardingCompleted: z.boolean().default(false),
});

export const WorkoutSchema = z.object({

  id: z.string().cuid(),
  name: z.string().min(1, 'El nombre es requerido'),
  exercises: z.array(z.object({
    name: z.string(),
    sets: z.number(),
    reps: z.number(),
    weight: z.number(),
    restTime: z.number(),
  })).min(1, 'Al menos un ejercicio es requerido'),
  duration: z.number(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  createdAt: z.number(),
});

export const NutritionLogSchema = z.object({

  id: z.string().cuid(),
  foodName: z.string().min(1, 'Nombre del alimento requerido'),
  calories: z.number().positive(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fats: z.number().nonnegative(),
  timestamp: z.number(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
});

// Tipos inferidos
export type User = z.infer<typeof UserSchema>;
export type Workout = z.infer<typeof WorkoutSchema>;
export type NutritionLog = z.infer<typeof NutritionLogSchema>;

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  checkOnboarding: () => Promise<boolean>;
  completeOnboarding: () => Promise<void>;
  clearError: () => void;
}

interface WorkoutState {
  workouts: Workout[];
  loading: boolean;
  error: string | null;
  fetchWorkouts: (userId: string) => Promise<void>;
  createWorkout: (userId: string, workout: Omit<Workout, 'createdAt'>) => Promise<void>;
  updateWorkout: (workoutId: string, data: Partial<Workout>) => Promise<void>;
  deleteWorkout: (workoutId: string) => Promise<void>;
  clearError: () => void;
}

interface NutritionState {
  logs: NutritionLog[];
  loading: boolean;
  error: string | null;
  fetchLogs: (userId: string, date: Date) => Promise<void>;
  addLog: (userId: string, log: Omit<NutritionLog, 'timestamp'>) => Promise<void>;
  deleteLog: (logId: string) => Promise<void>;
  getTotalMacros: () => { calories: number; protein: number; carbs: number; fats: number };
  clearError: () => void;
}

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Store de Autenticación
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      error: null,

      loginWithGoogle: async () => {
        try {
          set({ loading: true, error: null });
          
          // Usar autenticación con Google de Supabase
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            },
          });
          
          if (error) throw error;
          
          // El usuario será redirigido a Google y luego de vuelta al callback
          // El estado se actualizará automáticamente vía onAuthStateChange
        } catch (error: any) {
          set({
            error: error.message || 'Error al iniciar sesión con Google',
            loading: false
          });
        }
      },

      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, error: null });
        } catch (error: any) {
          set({ error: error.message || 'Error al cerrar sesión' });
        }
      },

      checkOnboarding: async () => {
        const { user } = get();
        if (!user) return false;
        
        // Obtener datos del usuario desde Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();
          
        if (error || !data) return false;
        
        set({ user: { ...user, onboardingCompleted: data.onboarding_completed } });
        return data.onboarding_completed;
      },

      completeOnboarding: async () => {
        const { user } = get();
        if (!user) return;

        const { error } = await supabase
          .from('users')
          .update({ onboarding_completed: true })
          .eq('email', user.email);
          
        if (error) throw error;
        
        set({ user: { ...user, onboardingCompleted: true } });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Store de Entrenamientos
export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: [],
  loading: false,
  error: null,
  
  fetchWorkouts: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ workouts: data as unknown as Workout[], loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al obtener entrenamientos', loading: false });
    }
  },
  
  createWorkout: async (userId: string, workoutData: Omit<Workout, 'createdAt'>) => {
    try {
      set({ loading: true, error: null });
      const validated = WorkoutSchema.parse({ ...workoutData, createdAt: Date.now() });
      
      const { error } = await supabase
        .from('workouts')
        .insert({ ...validated, user_id: userId });
      
      if (error) throw error;
      
      await get().fetchWorkouts(userId);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        set({ error: error.errors[0].message, loading: false });
      } else {
        set({ error: error.message || 'Error al crear entrenamiento', loading: false });
      }
    }
  },
  
  updateWorkout: async (workoutId: string, data: Partial<Workout>) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('workouts')
        .update(data)
        .eq('id', workoutId);
      
      if (error) throw error;
      
      const { workouts } = get();
      set({ 
        workouts: workouts.map(w => w.id === workoutId ? { ...w, ...data } : w),
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Error al actualizar entrenamiento', loading: false });
    }
  },
  
  deleteWorkout: async (workoutId: string) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId);
      
      if (error) throw error;
      
      const { workouts } = get();
      set({ 
        workouts: workouts.filter(w => w.id !== workoutId),
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Error al eliminar entrenamiento', loading: false });
    }
  },
  
  clearError: () => set({ error: null }),
}));

// Store de Nutrición
export const useNutritionStore = create<NutritionState>((set, get) => ({
  logs: [],
  loading: false,
  error: null,
  
  fetchLogs: async (userId: string, date: Date) => {
    try {
      set({ loading: true, error: null });
      const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString();
      
      const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startOfDay)
        .lte('date', endOfDay);
      
      if (error) throw error;
      
      set({ logs: data as unknown as NutritionLog[], loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al obtener registros nutricionales', loading: false });
    }
  },
  
  addLog: async (userId: string, logData: Omit<NutritionLog, 'timestamp'>) => {
    try {
      set({ loading: true, error: null });
      const validated = NutritionLogSchema.parse({ ...logData, timestamp: Date.now() });
      
      const { error } = await supabase
        .from('nutrition_logs')
        .insert({ ...validated, user_id: userId });
      
      if (error) throw error;
      
      await get().fetchLogs(userId, new Date());
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        set({ error: error.errors[0].message, loading: false });
      } else {
        set({ error: error.message || 'Error al agregar registro nutricional', loading: false });
      }
    }
  },
  
  deleteLog: async (logId: string) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('nutrition_logs')
        .delete()
        .eq('id', logId);
      
      if (error) throw error;
      
      const { logs } = get();
      set({ 
        logs: logs.filter(l => l.id !== logId),
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Error al eliminar registro', loading: false });
    }
  },
  
  getTotalMacros: () => {
    const { logs } = get();
    return logs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + log.protein,
        carbs: acc.carbs + log.carbs,
        fats: acc.fats + log.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  },
  
  clearError: () => set({ error: null }),
}));

// Store de UI
export const useUIStore = create<UIState>((set) => ({
  theme: 'light',
  sidebarOpen: false,
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark');
    return { theme: newTheme };
  }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setTheme: (theme: 'light' | 'dark') => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },
}));
