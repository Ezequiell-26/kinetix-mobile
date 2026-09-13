/**
 * Configuración de Firebase para Autenticación Real
 * 
 * INSTRUCCIONES PARA EL USUARIO:
 * 1. Ve a https://console.firebase.google.com/
 * 2. Crea un nuevo proyecto "Ezequiel Coaching"
 * 3. En "Authentication", habilita los proveedores:
 *    - Google (habilitar, poner nombre del proyecto y email de soporte)
 *    - Email/Password (habilitar)
 * 4. En "Project Settings" > "General", baja hasta "Your apps" y crea una app Web.
 * 5. Copia el objeto `firebaseConfig` y reemplaza abajo.
 * 6. EN LA CONSOLA DE FIREBASE > AUTHENTICATION > SETTINGS > AUTHORIZED DOMAINS:
 *    Agrega: localhost, tu-dominio-vercel.app, y tu-dominio-produccion.com
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  AuthError
} from 'firebase/auth';

// --- CONFIGURACIÓN ---
// ⚠️ REEMPLAZA ESTO CON TUS DATOS REALES DE FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "TU_API_KEY_AQUI",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "tu-proyecto.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tu-proyecto",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "tu-proyecto.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Inicializar Firebase (Singleton para evitar errores en hot-reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// --- VALIDACIÓN DE DOMINIO ---
// Solo permitimos correos oficiales de Gmail
const ALLOWED_DOMAINS = ['gmail.com'];

function validateEmailDomain(email: string): { valid: boolean; error?: string } {
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (!domain) {
    return { valid: false, error: 'Formato de correo inválido' };
  }

  if (!ALLOWED_DOMAINS.includes(domain)) {
    return { 
      valid: false, 
      error: `Solo se permiten cuentas oficiales de Gmail (@gmail.com). Tu dominio: @${domain}` 
    };
  }

  return { valid: true };
}

// --- SERVICIOS DE AUTENTICACIÓN ---

export const authService = {
  /**
   * Login con Google (Popup Real)
   * Valida automáticamente el dominio del correo recibido de Google
   */
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    // Forzar selección de cuenta si hay varias
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email || '';

      // Validación de seguridad post-login
      const validation = validateEmailDomain(email);
      
      if (!validation.valid) {
        // Si el correo de Google no es gmail.com, cerramos sesión inmediatamente
        await signOut(auth);
        throw new Error(validation.error);
      }

      return { success: true, user };
    } catch (error: any) {
      console.error('Error Google Sign-In:', error);
      
      // Manejo de errores específicos de Firebase
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Ventana cerrada por el usuario');
      }
      if (error.code === 'auth/account-exists-with-different-credential') {
        throw new Error('Este correo ya está registrado con otra contraseña');
      }
      
      throw new Error(error.message || 'Error al iniciar con Google');
    }
  },

  /**
   * Login con Email y Contraseña
   * Valida el dominio ANTES de intentar conectar con Firebase
   */
  async signInWithEmail(email: string, password: string) {
    // 1. Validación estricta de dominio
    const validation = validateEmailDomain(email);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('Error Email Sign-In:', error);
      
      if (error.code === 'auth/user-not-found') {
        throw new Error('No existe una cuenta con este correo');
      }
      if (error.code === 'auth/wrong-password') {
        throw new Error('Contraseña incorrecta');
      }
      if (error.code === 'auth/too-many-requests') {
        throw new Error('Demasiados intentos fallidos. Intente más tarde.');
      }
      
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  },

  /**
   * Registro con Email y Contraseña
   * Valida dominio antes de crear la cuenta
   */
  async signUpWithEmail(email: string, password: string) {
    // 1. Validación estricta de dominio
    const validation = validateEmailDomain(email);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 2. Validación de fortaleza de contraseña (mínimo 6 caracteres por Firebase)
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Opcional: Enviar verificación de email
      // await sendEmailVerification(result.user);
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('Error Sign Up:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Este correo ya está registrado');
      }
      if (error.code === 'auth/invalid-email') {
        throw new Error('Correo electrónico inválido');
      }
      
      throw new Error(error.message || 'Error al crear cuenta');
    }
  },

  /**
   * Cerrar Sesión
   */
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Error Logout:', error);
      throw new Error('Error al cerrar sesión');
    }
  },

  /**
   * Escuchar cambios de estado (Hook helper)
   * Retorna el usuario actual o null
   */
  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }
};

export { auth, validateEmailDomain };
