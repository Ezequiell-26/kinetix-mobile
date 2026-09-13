'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/firebase-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, Chrome, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Estado del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Validaciones en tiempo real
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Verificar si ya está logueado al montar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Auth check error:', err);
      }
    };
    checkAuth();
  }, [router]);

  // Validar email en tiempo real
  useEffect(() => {
    if (email && !email.endsWith('@gmail.com')) {
      setEmailError('Solo se permiten correos @gmail.com oficiales');
    } else {
      setEmailError('');
    }
  }, [email]);

  // Validar password en tiempo real
  useEffect(() => {
    if (password && password.length < 6) {
      setPasswordError('Mínimo 6 caracteres');
    } else {
      setPasswordError('');
    }
  }, [password]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.signInWithGoogle();
      setSuccessMessage('¡Inicio de sesión exitoso! Redirigiendo...');
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar con Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validaciones finales antes de enviar
    if (!email.endsWith('@gmail.com')) {
      setError('Solo se permiten correos @gmail.com');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    
    try {
      await authService.signInWithEmail(email, password);
      setSuccessMessage('¡Bienvenido de nuevo! Redirigiendo...');
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-cyan-900 p-4">
      <Card className="w-full max-w-md glass-card border-white/10 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 animate-float">
            <span className="text-3xl font-bold text-white">EC</span>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            EZEQUIEL COACHING
          </CardTitle>
          <CardDescription className="text-gray-300">
            Ingresa a tu cuenta para comenzar tu transformación
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Mensajes de estado */}
          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}
          
          {successMessage && (
            <Alert className="bg-green-500/10 border-green-500/50">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-200">{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Botón Google */}
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold transition-all duration-300 transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Chrome className="mr-2 h-4 w-4" />
            )}
            Continuar con Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-gray-400">O continúa con email</span>
            </div>
          </div>

          {/* Formulario Email/Password */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Correo Gmail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu.nombre@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 ${emailError ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                  required
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 ${passwordError ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {passwordError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <Link href="/forgot-password" className="text-purple-400 hover:text-purple-300 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !!emailError || !!passwordError}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-purple-500/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-gray-400 text-center">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Regístrate aquí
            </Link>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Solo se permiten cuentas oficiales de Gmail para mayor seguridad
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
