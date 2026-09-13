'use client';

import React, { useState, useEffect } from 'react';
import { supabaseAuth } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, Chrome } from 'lucide-react';

interface User {
  email: string;
  id: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Escuchar cambios de autenticación de Supabase
    const { data: { subscription } } = supabaseAuth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email || '', id: session.user.id });
        setSuccess(`¡Bienvenido ${session.user.email}!`);
        setError(null);
      } else {
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabaseAuth.signInWithGoogle();
      
      if (error) throw error;
      
      // El usuario será redirigido a Google
      setSuccess('Redirigiendo a Google...');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar con Google');
    } finally {
      setLoading(false);
    }
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

    // Validar que sea @gmail.com
    if (!email.endsWith('@gmail.com')) {
      setError('Solo se permiten correos electrónicos @gmail.com oficiales de Google.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { data, error } = await supabaseAuth.signInWithEmail(email, password);
        if (error) throw error;
        setSuccess('Inicio de sesión exitoso.');
        setEmail('');
        setPassword('');
      } else {
        const { data, error } = await supabaseAuth.signUpWithEmail(email, password);
        if (error) throw error;
        setSuccess('Cuenta creada exitosamente. Verifica tu correo.');
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Error en la operación');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabaseAuth.signOut();
      setSuccess('Sesión cerrada correctamente.');
      setUser(null);
    } catch (err: any) {
      setError('Error al cerrar sesión');
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-cyan-900 p-4">
        <Card className="w-full max-w-md glass-card border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">¡Hola, {user.email.split('@')[0]}!</CardTitle>
            <CardDescription className="text-gray-300">Has iniciado sesión correctamente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm text-center">Estado: Autenticado</p>
            </div>
            <Button 
              onClick={handleSignOut}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-cyan-900 p-4">
      <Card className="w-full max-w-md glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white text-center">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </CardTitle>
          <CardDescription className="text-gray-300 text-center">
            Solo se permiten cuentas @gmail.com
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

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

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isLogin ? (
                'Iniciar Sesión'
              ) : (
                'Crear Cuenta'
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-gray-400">O continúa con</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
