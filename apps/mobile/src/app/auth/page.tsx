'use client';

import React, { useState, useEffect } from 'react';
import { authService } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, Chrome } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setSuccess(`¡Bienvenido ${currentUser.email}!`);
        setError(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const result = await authService.signInWithGoogle();
    
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Inicio de sesión con Google exitoso.');
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      setLoading(false);
      return;
    }

    if (isLogin) {
      const result = await authService.signInWithEmail(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Inicio de sesión exitoso.');
        setEmail('');
        setPassword('');
      }
    } else {
      const result = await authService.signUpWithEmail(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Cuenta creada exitosamente. Verifica tu correo.');
        setEmail('');
        setPassword('');
      }
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setSuccess('Sesión cerrada correctamente.');
    setUser(null);
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-cyan-900 p-4">
        <Card className="w-full max-w-md glass-card border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">¡Hola, {user.email?.split('@')[0]}!</CardTitle>
            <CardDescription className="text-gray-300">Has iniciado sesión correctamente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm text-center">Estado: Autenticado</p>
            </div>
            <Button 
              onClick={handleSignOut} 
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Cerrar Sesión'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-cyan-900 p-4">
      <Card className="w-full max-w-md glass-card border-white/10">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            EZEQUIEL COACHING
          </CardTitle>
          <CardDescription className="text-gray-300">
            {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea una cuenta nueva'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-500/10 border-green-500/20">
              <AlertDescription className="text-green-400">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Correo Gmail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-400"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-400"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isLogin ? (
                'Iniciar Sesión'
              ) : (
                'Crear Cuenta'
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-gray-400">O continúa con</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full bg-white hover:bg-gray-100 text-gray-900 border-0"
            disabled={loading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continuar con Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccess(null);
            }}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
