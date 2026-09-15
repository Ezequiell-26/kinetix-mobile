'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseAuth } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, Chrome, ArrowRight, Star, Zap, Shield, CheckCircle, TrendingUp, Award, MessageCircle, Dumbbell, Users } from 'lucide-react';

interface User {
  email: string;
  id: string;
}

export default function AuthPage() {
  const r = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Testimonios rotativos para prueba social
  const testimonials = [
    { name: "Martín G.", result: "-12kg en 3 meses", text: "El mejor cambio que hice" },
    { name: "Sofía R.", result: "+8kg músculo", text: "Programa 100% personalizado" },
    { name: "Lucas P.", result: "Más energía que nunca", text: "Simple y efectivo" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabaseAuth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email || '', id: session.user.id });
        setSuccess(`¡Bienvenido ${session.user.email}!`);
        setError(null);
        setTimeout(() => r.push('/client/dashboard'), 1500);
      } else {
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [r]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabaseAuth.signInWithGoogle();
      
      if (error) throw error;
      
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

    if (!email.endsWith('@gmail.com') && !email.endsWith('@kinetixfitt.com')) {
      setError('Solo se permiten correos electrónicos @gmail.com o @kinetixfitt.com.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { data, error } = await supabaseAuth.signInWithEmail(email, password);
        if (error) throw error;
        setSuccess('Inicio de sesión exitoso. Redirigiendo...');
        setTimeout(() => r.push('/client/dashboard'), 1500);
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
    <div className="min-h-screen flex items-center justify-center bg-[#080808] p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <Card className="w-full border-subtle/50 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm bg-zinc-950/80">
          <CardHeader className="text-center space-y-4 pt-8 pb-2">
            {/* Logo animado */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="relative mx-auto"
            >
              <div className="absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-primary/20 blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-primary to-emerald-400 flex items-center justify-center font-black text-black text-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_32px_rgba(52,211,153,0.4)]">
                E
              </div>
            </motion.div>

            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent"
              >
                {isLogin ? '¡Bienvenido de vuelta!' : 'Únete hoy'}
              </motion.h1>
              <CardDescription className="text-zinc-400">
                {isLogin ? 'Tu transformación continúa' : 'Comienza tu mejor versión'}
              </CardDescription>
            </div>

            {/* Beneficios rápidos */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 justify-center pt-2"
            >
              {[
                { icon: Zap, text: "Entrena inteligente" },
                { icon: TrendingUp, text: "Progresá real" },
                { icon: Shield, text: "100% privado" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full bg-zinc-900/60 text-zinc-400 border border-zinc-800">
                  <item.icon size={10} className="text-primary" />
                  {item.text}
                </div>
              ))}
            </motion.div>

            {/* Prueba social rotativa */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-zinc-900/50 to-zinc-900/30 rounded-xl p-3 border border-zinc-800/50"
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className="text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-[11px] text-zinc-300 italic">"{testimonials[currentTestimonial].text}"</p>
                <p className="text-[10px] font-bold text-primary mt-0.5">{testimonials[currentTestimonial].result}</p>
                <p className="text-[9px] text-zinc-500">— {testimonials[currentTestimonial].name}</p>
              </motion.div>
            </AnimatePresence>

            {/* Demo accounts */}
            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("ezequiel@kinetixfitt.com");
                  setPassword("Admin123!");
                }}
                className="group text-[11px] font-bold px-4 py-2.5 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-300 hover:text-white hover:from-zinc-800 hover:to-zinc-900 border border-zinc-800 hover:border-primary/30 min-h-[40px] transition-all flex items-center gap-2 shadow-lg hover:shadow-primary/10"
              >
                <Dumbbell size={14} className="text-primary group-hover:scale-110 transition-transform" />
                <span>Trainer Demo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("martin@demo.com");
                  setPassword("cliente123");
                }}
                className="group text-[11px] font-bold px-4 py-2.5 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-300 hover:text-white hover:from-zinc-800 hover:to-zinc-900 border border-zinc-800 hover:border-primary/30 min-h-[40px] transition-all flex items-center gap-2 shadow-lg hover:shadow-primary/10"
              >
                <Users size={14} className="text-primary group-hover:scale-110 transition-transform" />
                <span>Cliente Demo</span>
              </button>
            </div>
          </CardHeader>

          <CardContent className="pb-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 bg-zinc-950/50 border-zinc-800 focus:border-primary/50 focus:bg-zinc-950 focus:ring-2 focus:ring-primary/10 transition-all h-12"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 bg-zinc-950/50 border-zinc-800 focus:border-primary/50 focus:bg-zinc-950 focus:ring-2 focus:ring-primary/10 transition-all h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-zinc-500 hover:text-primary rounded-xl transition-colors"
                  >
                    {showPw ? <Lock size={18} /> : <Lock size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <AlertDescription className="text-red-400 text-sm">{error}</AlertDescription>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
                >
                  <AlertDescription className="text-green-400 text-sm">{success}</AlertDescription>
                </motion.div>
              )}

              {/* Primary CTA */}
              <Button 
                type="submit" 
                variant="accent"
                size="xl"
                className="w-full mt-4 h-14 text-base font-black tracking-wide shadow-[0_4px_20px_rgba(52,211,153,0.3)] hover:shadow-[0_6px_30px_rgba(52,211,153,0.4)] hover:scale-[1.02] transition-all"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isLogin ? (
                  <>
                    <Zap size={20} className="mr-2" />
                    INGRESAR AHORA
                    <ArrowRight size={20} className="ml-2" />
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} className="mr-2" />
                    CREAR CUENTA GRATIS
                    <ArrowRight size={20} className="ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-950 px-2 text-zinc-500">O continúa con</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-zinc-950/50 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white h-12"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Chrome className="mr-2 h-5 w-5" />
                  Google
                </>
              )}
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pb-8 pt-4 border-t border-zinc-900">
            <div className="flex justify-between w-full">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs font-bold text-zinc-400 hover:text-primary transition-colors group inline-flex items-center gap-1"
              >
                {isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}
                <span className="group-hover:underline">{isLogin ? "Regístrate gratis" : "Inicia sesión"}</span>
              </button>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-zinc-400 hover:text-primary transition-colors hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            
            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500 pt-2">
              <div className="flex items-center gap-1">
                <Shield size={12} className="text-primary" />
                <span>SSL Seguro</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={12} className="text-primary" />
                <span>Datos protegidos</span>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Footer */}
        <p className="text-center text-[11px] text-zinc-600 mt-6">
          KINETIXFITT © 2026 · Tu mejor versión, cada día
        </p>
      </motion.div>
    </div>
  );
}
