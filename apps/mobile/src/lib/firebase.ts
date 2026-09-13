import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Google Provider configured to only allow gmail accounts via logic in auth functions
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Strict Gmail Validation
const isValidGmail = (email: string | null): boolean => {
  if (!email) return false;
  return email.endsWith('@gmail.com');
};

export const authService = {
  // Sign in with Google - Firebase handles the domain, but we double check
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      if (!isValidGmail(user.email)) {
        await signOut(auth);
        throw new Error('Solo se permiten cuentas de Gmail oficiales (@gmail.com).');
      }
      
      return { user, error: null };
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      return { user: null, error: error.message };
    }
  },

  // Sign up with Email/Password - Strict Gmail Check
  async signUpWithEmail(email: string, password: string) {
    if (!isValidGmail(email)) {
      return { 
        user: null, 
        error: 'Error: Solo se permiten registros con correos @gmail.com oficiales.' 
      };
    }

    if (password.length < 6) {
      return { 
        user: null, 
        error: 'La contraseña debe tener al menos 6 caracteres.' 
      };
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error: any) {
      console.error('Sign Up Error:', error);
      return { user: null, error: error.message };
    }
  },

  // Sign in with Email/Password
  async signInWithEmail(email: string, password: string) {
    if (!isValidGmail(email)) {
      return { 
        user: null, 
        error: 'Error: Solo se permiten inicios de sesión con correos @gmail.com.' 
      };
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error: any) {
      console.error('Sign In Error:', error);
      let errorMessage = 'Credenciales inválidas.';
      if (error.code === 'auth/user-not-found') errorMessage = 'No existe una cuenta con este correo.';
      if (error.code === 'auth/wrong-password') errorMessage = 'Contraseña incorrecta.';
      if (error.code === 'auth/too-many-requests') errorMessage = 'Demasiados intentos. Intente más tarde.';
      
      return { user: null, error: errorMessage };
    }
  },

  // Sign Out
  async signOut() {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Auth State Observer
  onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  getCurrentUser() {
    return auth.currentUser;
  }
};

export { auth, db, googleProvider };
