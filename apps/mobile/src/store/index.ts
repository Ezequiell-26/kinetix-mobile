import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { app } from '../lib/firebase';
import { z } from 'zod';

// Inicializar Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

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
          const result = await signInWithPopup(auth, googleProvider);
          const email = result.user.email!;
          
          // Validar que sea @gmail.com
          if (!email.endsWith('@gmail.com')) {
            await signOut(auth);
            throw new Error('Solo se permiten cuentas @gmail.com');
          }
          
          const userDoc = await getDoc(doc(db, 'users', result.user.uid));
          
          if (!userDoc.exists()) {
            // Crear nuevo usuario
            const newUser: User = {
              email,
              displayName: result.user.displayName || 'Usuario',
              photoURL: result.user.photoURL || undefined,
              role: 'client',
              createdAt: Date.now(),
              onboardingCompleted: false,
            };
            await setDoc(doc(db, 'users', result.user.uid), newUser);
            set({ user: newUser, loading: false });
          } else {
            const userData = userDoc.data() as User;
            set({ user: userData, loading: false });
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'Error al iniciar sesión con Google', 
            loading: false 
          });
        }
      },
      
      logout: async () => {
        try {
          await signOut(auth);
          set({ user: null, error: null });
        } catch (error: any) {
          set({ error: error.message || 'Error al cerrar sesión' });
        }
      },
      
      checkOnboarding: async () => {
        const { user } = get();
        if (!user) return false;
        
        const userDoc = await getDoc(doc(db, 'users', user.email.replace('@gmail.com', '')));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          set({ user: userData });
          return userData.onboardingCompleted;
        }
        return false;
      },
      
      completeOnboarding: async () => {
        const { user } = get();
        if (!user) return;
        
        await updateDoc(doc(db, 'users', user.email.replace('@gmail.com', '')), {
          onboardingCompleted: true,
        });
        
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
      const q = query(collection(db, 'workouts'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const workouts: Workout[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workout));
      set({ workouts, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al obtener entrenamientos', loading: false });
    }
  },
  
  createWorkout: async (userId: string, workoutData: Omit<Workout, 'createdAt'>) => {
    try {
      set({ loading: true, error: null });
      const validated = WorkoutSchema.parse({ ...workoutData, createdAt: Date.now() });
      await addDoc(collection(db, 'workouts'), { ...validated, userId });
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
      await updateDoc(doc(db, 'workouts', workoutId), data);
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
      await deleteDoc(doc(db, 'workouts', workoutId));
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
      const startOfDay = new Date(date.setHours(0, 0, 0, 0)).getTime();
      const endOfDay = new Date(date.setHours(23, 59, 59, 999)).getTime();
      
      const q = query(
        collection(db, 'nutrition_logs'),
        where('userId', '==', userId),
        where('timestamp', '>=', startOfDay),
        where('timestamp', '<=', endOfDay)
      );
      
      const snapshot = await getDocs(q);
      const logs: NutritionLog[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NutritionLog));
      set({ logs, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al obtener registros nutricionales', loading: false });
    }
  },
  
  addLog: async (userId: string, logData: Omit<NutritionLog, 'timestamp'>) => {
    try {
      set({ loading: true, error: null });
      const validated = NutritionLogSchema.parse({ ...logData, timestamp: Date.now() });
      await addDoc(collection(db, 'nutrition_logs'), { ...validated, userId });
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
      await deleteDoc(doc(db, 'nutrition_logs', logId));
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
