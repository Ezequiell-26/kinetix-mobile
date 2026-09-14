'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Dumbbell, Users, TrendingUp, Zap, Activity, CheckCircle2, Play, Star, ArrowRight, Menu, X, Crown, Heart, ShieldCheck, Flame, Award, MessageCircle, BarChart3, Smartphone, Monitor, Clock, Target, Apple, UtensilsCrossed,
  ChevronDown, Shield, Timer, Gift, Lock
} from 'lucide-react';
import Link from 'next/link';

const APP_URL = 'https://kinetixfitt-world-ia.vercel.app';
const APP_LOGIN = `${APP_URL}/login`;
const APP_REGISTER = `${APP_URL}/register`;

// UI helpers
const LimeButton = ({ children, variant = 'lime', className = '', href, ...props }: any) => {
  const base = "inline-flex items-center justify-center px-7 py-4 rounded-2xl font-black text-sm tracking-wide transition-all duration-200 active:scale-[0.98]";
  const styles: any = {
    lime: "bg-[#D6FF2A] text-black hover:bg-[#E0FF5A] shadow-[0_8px_24px_rgba(214,255,42,0.25)] hover:shadow-[0_12px_32px_rgba(214,255,42,0.3)]",
    dark: "bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
    white: "bg-white text-black hover:bg-zinc-100 shadow-lg"
  };
  const Comp: any = href ? 'a' : 'button';
  return <Comp href={href} className={`${base} ${styles[variant]} ${className}`} {...props}>{children}</Comp>;
};

const Badge = ({ children, className = "" }: any) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase bg-[#D6FF2A]/10 text-[#D6FF2A] border border-[#D6FF2A]/20 ${className}`}>{children}</span>
);

// ── ScarcityBar lime retention (timer 47:12:33 countdown) ──
const ScarcityBar = () => {
  const [left, setLeft] = useState({ h: 47, m: 12, s: 33 });
  useEffect(() => {
    const id = setInterval(() => setLeft(p => {
      let s = p.s - 1, m = p.m, h = p.h;
      if (s < 0) { s = 59; m -= 1; }
      if (m < 0) { m = 59; h -= 1; }
      if (h < 0) return { h: 0, m: 0, s: 0 };
      return { h, m, s };
    }), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="w-full bg-[#D6FF2A] text-black text-xs font-bold tracking-wide border-b border-black/10">
      <div className="max-w-[1200px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-center">
        <span className="inline-flex items-center gap-1.5 font-black"><span className="w-2 h-2 rounded-full bg-black animate-pulse" /> ESCASEZ REAL:</span>
        <span className="text-black/80 font-bold">Quedan <b className="text-black underline decoration-black/20 underline-offset-4">17 plazas Pro</b> a $19/mes — luego $29.</span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black text-[#D6FF2A] font-black tracking-widest text-[11px]">
          <Timer size={12} /> {String(left.h).padStart(2, '0')}:{String(left.m).padStart(2, '0')}:{String(left.s).padStart(2, '0')}
        </span>
        <a href="#pricing" className="hidden sm:inline-flex items-center gap-1 font-black underline decoration-black/20 underline-offset-4 hover:opacity-70">Reservar mi plaza <ArrowRight size={12} /></a>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`fixed top-[36px] inset-x-0 z-50 transition-all ${scrolled ? 'bg-[#09090B]/80 backdrop-blur-xl border-b border-zinc-900 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#D6FF2A] flex items-center justify-center group-hover:rotate-3 transition-transform">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <span className="text-[18px] font-black tracking-tight text-white">KINETIX<span className="text-[#D6FF2A]">FITT</span></span>
          <span className="hidden sm:inline text-[10px] font-bold tracking-[0.18em] text-zinc-500 ml-1">by KINETIXFITT</span>
        </Link>
        <div className="hidden lg:flex items-center gap-7 text-sm font-bold text-zinc-300">
          <a href="#funcionalidades" className="hover:text-white transition">Funcionalidades</a>
          <a href="#como-funciona" className="hover:text-white transition">Cómo funciona</a>
          <a href="#pricing" className="hover:text-white transition">Planes</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
          <a href={`${APP_URL}/client/tools`} className="hover:text-white transition">Herramientas</a>
          <a href={APP_LOGIN} className="ml-2 text-white hover:text-[#D6FF2A]">Ingresar</a>
          <a href={APP_REGISTER} className="ml-1 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white text-black font-black text-sm hover:bg-zinc-100">Empezar gratis</a>
          <span className="hidden xl:inline-flex items-center gap-2 text-xs font-bold text-zinc-500"><Monitor size={14}/> Web + <Smartphone size={14}/> App</span>
        </div>
        <button onClick={() => setOpen(!open)} className="lg:hidden w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">{open ? <X size={18}/> : <Menu size={18} />}</button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-[#09090B] border-b border-zinc-900 overflow-hidden">
            <div className="px-4 py-6 space-y-4">
              <a href="#funcionalidades" onClick={() => setOpen(false)} className="block text-white font-bold">Funcionalidades</a>
              <a href="#como-funciona" onClick={() => setOpen(false)} className="block text-white font-bold">Cómo funciona</a>
              <a href="#pricing" onClick={() => setOpen(false)} className="block text-white font-bold">Planes</a>
              <a href="#faq" onClick={() => setOpen(false)} className="block text-white font-bold">FAQ</a>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <a href={APP_LOGIN} className="py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center font-black text-white">Ingresar</a>
                <a href={APP_REGISTER} className="py-3 rounded-xl bg-[#D6FF2A] text-center font-black text-black">Empezar</a>
              </div>
              <a href={APP_URL} className="flex items-center justify-center gap-2 text-xs font-bold text-[#D6FF2A]">→ Abrir app en navegador</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#09090B] text-white selection:bg-[#D6FF2A]/30 selection:text-[#D6FF2A]">
      <div className="fixed top-0 inset-x-0 z-[60]"><ScarcityBar /></div>
      <div className="h-[36px]" />
      <Navbar />

      {/* HERO - Symmetry style */}
      <section className="relative pt-28 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#09090B]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(214,255,42,0.08),transparent_60%)]" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#D6FF2A]/[0.03] rounded-full blur-[100px]" />
        </div>

        {/* Top badges like symmetry */}
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between max-w-5xl mx-auto mb-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
              <Star size={14} className="text-[#D6FF2A] fill-[#D6FF2A]" />
              <span className="text-xs font-black text-white">4.9</span>
              <span className="text-xs text-zinc-400">· Excelente · 2.400 reseñas</span>
            </div>
            <Badge><Crown size={12}/> #1 Coaching personalizado LATAM</Badge>
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-zinc-300">
              <Users size={14} /> +12k atletas
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <h1 className="text-[42px] md:text-[64px] lg:text-[72px] font-black tracking-[-0.04em] leading-[0.9] text-white">
              Consigue un físico<br />
              <span className="text-[#D6FF2A]">estético y fuerte</span><br />
              progresando con ciencia
            </h1>
            <p className="mt-6 text-[17px] md:text-[19px] leading-relaxed text-zinc-400 max-w-2xl mx-auto">
              La plataforma de <span className="text-white font-bold">KINETIXFITT</span> que une programación inteligente, nutrición precisa y seguimiento real. Sin humo, solo progresión.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={APP_REGISTER} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#D6FF2A] text-black font-black text-[15px] hover:bg-[#E0FF5A] shadow-[0_10px_30px_rgba(214,255,42,0.25)] transition">
                Comenzar mi transformación <ArrowRight size={18} />
              </a>
              <a href={APP_URL} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-black text-[15px] hover:bg-zinc-800 transition">
                <Monitor size={18}/> Usar en web <span className="text-zinc-500 font-bold">· sin instalar</span>
              </a>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <a href={APP_REGISTER} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-xs font-black">● App Store</a>
              <a href={APP_REGISTER} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-xs font-black">▶ Google Play</a>
              <span className="text-xs text-zinc-500 font-bold">Descarga gratuita · Cancela cuando quieras</span>
            </div>

            {/* Stats row like symmetry 3M+ */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { v: "12k+", l: "Atletas activos", sub: "transformando" },
                { v: "1.2M+", l: "Entrenamientos", sub: "completados" },
                { v: "4.9", l: "Valoración", sub: "App Store" },
                { v: "92%", l: "Retención", sub: "a 90 días" },
              ].map(s => (
                <div key={s.l} className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-5 text-center">
                  <div className="text-3xl font-black text-white tracking-tight">{s.v}</div>
                  <div className="text-xs font-black tracking-wide text-[#D6FF2A] uppercase mt-1">{s.l}</div>
                  <div className="text-xs text-zinc-500">{s.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mockup */}
          <motion.div style={{ y: heroY }} className="mt-12 relative max-w-[980px] mx-auto">
            <div className="relative rounded-[28px] overflow-hidden bg-zinc-900 border border-zinc-800 shadow-[0_30px_80px_rgba(0,0,0,0.6)] p-2">
              <div className="rounded-[20px] overflow-hidden bg-[#101012] aspect-[16/9] md:aspect-[16/8] flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(214,255,42,0.07),transparent_60%)]" />
                <div className="relative grid md:grid-cols-3 gap-4 p-6 md:p-10 w-full">
                  <div className="md:col-span-2 rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black tracking-widest text-zinc-500 uppercase">Dashboard · Hoy</span>
                      <span className="text-xs font-black px-2 py-1 rounded-full bg-[#D6FF2A] text-black">Racha 14 días 🔥</span>
                    </div>
                    <div className="h-28 rounded-xl bg-zinc-950 border border-zinc-800 flex items-end gap-1 p-3">
                      {[40, 65, 45, 80, 60, 95, 70].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-lg bg-[#D6FF2A]" style={{ height: `${h}%`, opacity: 0.6 + i * 0.05 }} />
                      ))}
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-xl bg-zinc-950 border border-zinc-800 py-3"><div className="text-sm font-black text-white">3/4</div><div className="text-[10px] text-zinc-500 uppercase font-bold">Sesiones</div></div>
                      <div className="rounded-xl bg-zinc-950 border border-zinc-800 py-3"><div className="text-sm font-black text-white">82%</div><div className="text-[10px] text-zinc-500 uppercase font-bold">Adherencia</div></div>
                      <div className="rounded-xl bg-zinc-950 border border-zinc-800 py-3"><div className="text-sm font-black text-white">+2.1kg</div><div className="text-[10px] text-zinc-500 uppercase font-bold">Músculo</div></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-2xl bg-[#D6FF2A] p-4 text-black">
                      <div className="text-xs font-black uppercase tracking-wide opacity-70">Entrenamiento de hoy</div>
                      <div className="text-lg font-black leading-tight mt-1">Pecho · Hombro · Tríceps</div>
                      <div className="text-xs font-bold opacity-70">5 ejercicios · 60 min · RIR 2</div>
                      <a href={APP_REGISTER} className="mt-3 inline-flex w-full justify-center py-2.5 rounded-xl bg-black text-white font-black text-xs">COMENZAR →</a>
                    </div>
                    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
                      <div className="text-xs font-bold text-zinc-400">Próximo check-in</div>
                      <div className="text-sm font-black text-white">En 2 días · Energía 8/10</div>
                      <div className="text-xs text-[#D6FF2A] font-bold">KinetixFitt revisa en 24h →</div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" /><span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" /><span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> App lista · Web y móvil sincronizados
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3 PASOS - symmetry guarantee */}
      <section id="como-funciona" className="py-20 bg-[#101012] border-y border-zinc-900">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <Badge>Garantizamos tu éxito en 3 pasos</Badge>
            <h2 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-white">Tres pilares que aseguran<br /><span className="text-zinc-500">tu progreso real</span></h2>
            <p className="mt-4 text-zinc-400">Sin motivación vacía. Ciencia + sistema + seguimiento humano.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { n: "01", t: "Motivación que no falla", d: "Rachas, XP, rangos y misiones. No dependés de ganas: el sistema te empuja.", icon: Flame, c: "from-[#D6FF2A] to-emerald-400" },
              { n: "02", t: "Transformación garantizada", d: "Programación 100% personalizada con sobrecarga progresiva automática. Basado en Schoenfeld, Israetel, Beardsley.", icon: TrendingUp, c: "from-violet-500 to-fuchsia-500" },
              { n: "03", t: "Cero lesiones", d: "Técnica guiada, RIR controlado y progresión segura. Tu cuerpo nunca paga el precio.", icon: ShieldCheck, c: "from-cyan-400 to-blue-500" },
            ].map(s => (
              <div key={s.n} className="group relative rounded-[24px] bg-[#0A0A0B] border border-zinc-800 p-7 overflow-hidden hover:border-zinc-700 transition">
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${s.c} opacity-[0.08] rounded-full blur-2xl`} />
                <div className="text-[12px] font-black tracking-[0.2em] text-zinc-500">{s.n}</div>
                <div className={`mt-3 w-12 h-12 rounded-2xl bg-gradient-to-br ${s.c} flex items-center justify-center text-white`}><s.icon size={20} /></div>
                <h3 className="mt-5 text-xl font-black text-white leading-tight">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.d}</p>
                <div className="mt-6">
                  <a href={APP_REGISTER} className="inline-flex items-center gap-1 text-sm font-black text-white hover:text-[#D6FF2A]">Comenzar <ArrowRight size={14} /></a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href={APP_REGISTER} className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-[#D6FF2A] text-black font-black hover:bg-[#E0FF5A]">Comenzar mi transformación →</a>
            <p className="mt-3 text-xs font-bold tracking-wide text-zinc-500">Únete a +12k atletas que ya transforman su vida</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS - symmetry */}
      <section className="py-20 bg-[#09090B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center">
            <Badge><Star size={12} className="fill-[#D6FF2A]" /> Historias reales</Badge>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white">Resultados que hablan</h2>
            <p className="mt-2 text-zinc-400">Aquí lideramos con ejemplo. Atletas reales, datos reales.</p>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              { name: "Toñete", change: "Perdió 15kg en 3 meses", quote: "Me estanqué años por no saber progresar. Con Kinetix no me preocupo más. 100% recomendado para ganar músculo.", gain: "-15kg", img: null },
              { name: "Sofía R.", change: "Ganó 8kg músculo", quote: "La racha y los rangos me hicieron constante por primera vez. Resultados en semanas.", gain: "+8kg", img: null },
              { name: "Lucas P.", change: "+40% composición", quote: "Progreso automático por planificación personalizada. Todo el que quiera estética debe probarlo.", gain: "+40%", img: null },
              { name: "Valentina M.", change: "Madre · Recuperó figura post-parto", quote: "Entreno 3×/semana en casa con mis bandas. El plan se adapta a mi tiempo. Volví a sentirme yo.", gain: "12 sem", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face" },
              { name: "Martín S.", change: "Emprendedor · -9kg sin cardio extremo", quote: "Nutrición precisa + entrenamiento inteligente. Bajé grasa manteniendo músculo. Nunca pasé hambre.", gain: "-9kg", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
            ].map(card => (
              <div key={card.name} className="rounded-[24px] bg-zinc-900/60 border border-zinc-800 p-6 hover:border-zinc-700 transition">
                <div className="flex items-center gap-3">
                  {card.img ? (
                    <img src={card.img} alt={card.name} className="w-10 h-10 rounded-full object-cover border border-zinc-700" loading="lazy" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#D6FF2A] flex items-center justify-center font-black text-black">{card.name[0]}</div>
                  )}
                  <div><div className="text-sm font-black text-white flex items-center gap-1">{card.name} {card.img && <CheckCircle2 size={12} className="text-emerald-500" />}</div><div className="text-xs font-bold text-[#D6FF2A]">{card.change}</div></div>
                  <div className="ml-auto text-xs font-black px-2 py-1 rounded-full bg-white text-black">{card.gain}</div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-zinc-300 italic">“{card.quote}”</p>
                <div className="mt-4 flex gap-1">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-[#D6FF2A] text-[#D6FF2A]" />)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES - truecoach + symmetry */}
      <section id="funcionalidades" className="py-20 bg-[#101012] border-y border-zinc-900">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <Badge>Funcionalidades principales</Badge>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white">Todo lo que necesitás,<br />en una sola app</h2>
            <p className="mt-3 text-zinc-400">Programación, nutrición, progreso y comunidad. Sin spreadsheets, sin WhatsApps perdidos.</p>
          </div>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Plan Personalizado", desc: "1 clic. Adaptado a tu cuerpo, objetivo y material.", icon: Target, grad: "from-[#D6FF2A] to-emerald-400" },
              { title: "Cálculo Automático", desc: "Sobrecarga progresiva: te dice cuánto levantar.", icon: BarChart3, grad: "from-violet-500 to-purple-500" },
              { title: "Rangos & Gamificación", desc: "Subí de rango según tu nivel real. XP, rachas, badges.", icon: Crown, grad: "from-amber-400 to-orange-500" },
              { title: "Red Social Privada", desc: "Compartí progreso con tu entrenador y amigos.", icon: Users, grad: "from-cyan-400 to-blue-500" },
            ].map(f => (
              <div key={f.title} className="rounded-[24px] bg-[#0A0A0B] border border-zinc-800 p-7 hover:border-zinc-700 transition group">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.grad} flex items-center justify-center text-white`}><f.icon size={20} /></div>
                <h3 className="mt-5 font-black text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid lg:grid-cols-2 gap-6 items-center">
            <div className="rounded-[24px] bg-zinc-900 border border-zinc-800 p-6">
              <div className="text-xs font-black tracking-widest text-zinc-500 uppercase">Para entrenadores — TrueCoach style</div>
              <h3 className="mt-2 text-2xl font-black text-white">Menos admin, más coaching</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#D6FF2A] mt-0.5" /> <span><b>Public Profiles:</b> web para captar clientes en tu link de bio</span></li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#D6FF2A] mt-0.5" /> <span><b>Program Builder:</b> escribí una vez, personalizá por cliente</span></li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#D6FF2A] mt-0.5" /> <span><b>Client Management:</b> todo en un lugar — check-ins, pagos, progreso</span></li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-[#D6FF2A] mt-0.5" /> <span><b>Compliance 7/30/90:</b> ves quién cumple y quién necesita atención</span></li>
              </ul>
              <div className="mt-6 flex gap-3">
                <a href={APP_REGISTER} className="px-5 py-3 rounded-xl bg-white text-black font-black text-sm">Probar 14 días gratis</a>
                <a href={APP_URL} className="px-5 py-3 rounded-xl bg-zinc-800 text-white font-black text-sm border border-zinc-700">Ver demo</a>
              </div>
            </div>
            <div className="rounded-[24px] bg-[#D6FF2A] p-7 text-black">
              <div className="text-xs font-black tracking-widest uppercase opacity-60">Usá donde quieras</div>
              <h3 className="mt-1 text-2xl font-black">Web + Móvil, sincronizados</h3>
              <p className="mt-2 text-sm font-medium opacity-70">Entrená en el gimnasio con el móvil, analizá en casa en la web. Progreso, check-ins y mensajes 100% sincronizados.</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <a href={APP_URL} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-black text-white font-black text-sm"><Monitor size={16} /> Abrir en web</a>
                <a href={APP_REGISTER} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-black text-sm border border-black/10"><Smartphone size={16} /> Descargar app</a>
              </div>
              <div className="mt-4 text-xs font-bold opacity-60">Si TikTok no deja abrir la tienda: ⋯ → Abrir en navegador</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING - truecoach */}
      <section id="pricing" className="py-20 bg-[#09090B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <Badge><Award size={12} /> Planes</Badge>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white">Invertí en tu salud,<br />sin letra chica</h2>
            <p className="mt-3 text-zinc-400">Cancelá cuando quieras. Sin contratos. 14 días de prueba, sin tarjeta.</p>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Básico", price: "$0", cad: "/mes", desc: "Para arrancar", feats: ["50+ ejercicios", "Seguimiento básico", "Comunidad"], cta: "Crear cuenta gratis", featured: false },
              { name: "Pro Athlete", price: "$19", cad: "/mes", desc: "Para resultados serios", feats: ["Todo Básico", "Rutinas con IA", "Nutrición + macros", "Analíticas avanzadas", "Soporte prioritario"], cta: "Comenzar prueba gratis", featured: true },
              { name: "Elite Coach", price: "$49", cad: "/mes", desc: "1 a 1 con tu coach", feats: ["Todo Pro", "Coach humano", "Ajustes semanales", "Eventos exclusivos"], cta: "Aplicar ahora", featured: false },
            ].map(p => (
              <div key={p.name} className={`relative rounded-[24px] p-7 flex flex-col ${p.featured ? 'bg-white text-black border-2 border-[#D6FF2A] shadow-[0_20px_60px_rgba(214,255,42,0.15)] md:-translate-y-2' : 'bg-zinc-900 border border-zinc-800 text-white'}`}>
                {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#D6FF2A] text-black text-[11px] font-black tracking-widest uppercase">Más popular</div>}
                <h3 className={`text-lg font-black ${p.featured ? 'text-black' : 'text-white'}`}>{p.name}</h3>
                <div className="mt-2 flex items-baseline gap-1"><span className={`text-4xl font-black ${p.featured ? 'text-black' : 'text-white'}`}>{p.price}</span><span className={`text-sm ${p.featured ? 'text-zinc-500' : 'text-zinc-500'}`}>{p.cad}</span></div>
                <p className={`text-sm ${p.featured ? 'text-zinc-600' : 'text-zinc-400'}`}>{p.desc}</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {p.feats.map(f => (
                    <li key={f} className={`flex items-center gap-2 text-sm font-bold ${p.featured ? 'text-black' : 'text-zinc-300'}`}><CheckCircle2 size={16} className={p.featured ? 'text-black' : 'text-[#D6FF2A]'} /> {f}</li>
                  ))}
                </ul>
                <a href={APP_REGISTER} className={`mt-7 inline-flex justify-center py-3 rounded-xl font-black ${p.featured ? 'bg-black text-white hover:bg-zinc-900' : 'bg-[#D6FF2A] text-black hover:bg-[#E0FF5A]'}`}>{p.cta}</a>
                {p.featured && <div className="mt-3 text-center text-xs font-bold text-zinc-500">7 días gratis, luego $19/mes</div>}
              </div>
            ))}
          </div>
          {/* Garantía 30 días — retención: aversión a la pérdida invertida, lime accent */}
          <div className="mt-8 max-w-3xl mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex gap-4 items-center shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <div className="w-12 h-12 rounded-xl bg-[#D6FF2A] flex items-center justify-center text-black shrink-0"><Shield size={20} /></div>
            <div className="flex-1"><div className="font-black text-white text-sm sm:text-base">Garantía 30 días sin preguntas</div><div className="text-sm text-zinc-400 leading-relaxed">Si no ves progreso, te devolvemos el 100%. Sin letra chica. El riesgo es nuestro. <span className="inline-flex items-center gap-1 text-xs font-bold text-zinc-500 ml-1"><Lock size={12}/> Pago seguro Stripe</span></div></div>
            <div className="hidden sm:block text-xs font-black px-3 py-2 rounded-full bg-[#D6FF2A] text-black whitespace-nowrap">Sin riesgo</div>
          </div>
          <div className="mt-6 text-center text-xs font-bold text-zinc-500">Precios en USD · Impuestos incluidos · Podés cambiar de plan en cualquier momento</div>
        </div>
      </section>

      {/* ABRE EN NAVEGADOR + FINAL CTA */}
      <section className="py-16 bg-[#101012] border-y border-zinc-900">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-2xl font-black text-white">Tu transformación comienza hoy</h3>
          <p className="mt-2 text-zinc-400">Usalo en web sin instalar, o descargá la app. Tu progreso vive en ambos.</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <a href={APP_URL} className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#D6FF2A] text-black font-black hover:bg-[#E0FF5A]"><Monitor size={18} /> Abrir en navegador</a>
            <a href={APP_REGISTER} className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white text-black font-black"><Zap size={18} /> Crear cuenta gratis</a>
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-left max-w-xl mx-auto">
            <div className="text-xs font-black tracking-widest text-zinc-400 uppercase">¿TikTok no te deja abrir la tienda?</div>
            <ol className="mt-2 text-sm text-zinc-300 list-decimal list-inside space-y-1">
              <li>Pulsá los tres puntos ⋯ arriba a la derecha</li>
              <li>Elegí “Abrir en el navegador”</li>
              <li>Volvé a pulsar descarga — o usá “Abrir en navegador” directo</li>
            </ol>
            <button onClick={() => navigator.clipboard.writeText(APP_URL)} className="mt-3 text-xs font-black px-3 py-2 rounded-xl bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700">Copiar enlace del app</button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs font-bold text-zinc-500">
            <span className="flex items-center gap-1.5"><Clock size={14} /> 3 meses transformación</span>
            <span className="flex items-center gap-1.5"><Heart size={14} /> Soporte humano</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Datos protegidos</span>
          </div>
        </div>
      </section>

      {/* FAQ — acordeón retención (dudas finales → conversión) lime */}
      <section id="faq" className="py-20 bg-[#09090B] border-t border-zinc-900">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <div className="text-center">
            <Badge><Shield size={12}/> FAQ</Badge>
            <h2 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-white">Preguntas frecuentes</h2>
            <p className="mt-2 text-zinc-400">Transparencia total. Si no está acá, escribinos y respondemos en 24h.</p>
          </div>
          <div className="mt-8 space-y-3">
            {[
              { q: '¿Necesito material o gimnasio?', a: 'No. El plan se adapta a tu material (bandas, mancuernas, peso corporal o gym completo). Elegís al onboarding y lo cambiás cuando quieras.' },
              { q: '¿Cómo funciona la prueba gratis de 14 días?', a: 'Acceso total a Pro sin tarjeta. Al día 14 elegís continuar a $19/mes o quedarte en Básico gratis. Te avisamos 2 días antes. Sin sorpresas.' },
              { q: '¿Qué pasa si me lesiono o me voy de viaje?', a: 'Pausás con 1 clic. La racha se congela 7 días y el plan se reajusta a tu vuelta. Progresión sin culpa, adherencia a largo plazo.' },
              { q: '¿Es para mujeres también?', a: 'Absolutamente. 43% de nuestras atletas son mujeres. Planes específicos para fuerza, glúteos, recomposición y post-parto. Misma ciencia, objetivos tuyos.' },
              { q: '¿En qué se diferencia de Symmetry / TrueCoach?', a: 'Symmetry es contenido + comunidad; TrueCoach es solo para entrenadores. Kinetix une ambos: IA que programa + humano que corrige + gamificación que retiene. Todo en una app web+móvil.' },
              { q: '¿Mis datos están protegidos? ¿Venden mis datos?', a: 'Nunca vendemos datos. Cifrado AES-256, RGPD + Ley 25.326 AR. Podés exportar o borrar todo con 1 clic. Ver Privacidad y Cookies.' },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-zinc-900 transition">
                  <span className="font-bold text-white text-sm">{f.q}</span>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center border shrink-0 transition ${faqOpen === i ? 'bg-[#D6FF2A] text-black border-[#D6FF2A]' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>{faqOpen === i ? <X size={14} /> : <ChevronDown size={14} />}</span>
                </button>
                <AnimatePresence>
                  {faqOpen === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-5 pb-4 text-sm leading-relaxed text-zinc-400 border-t border-zinc-800 pt-3 bg-zinc-950/50">{f.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center"><a href="mailto:ezequiel@kinetixfitt.com" className="inline-flex items-center gap-2 text-sm font-bold text-[#D6FF2A] hover:text-[#E0FF5A]">¿Otra duda? Escribinos — respondemos en 24h <ArrowRight size={14} /></a></div>
        </div>
      </section>

      <footer className="bg-[#09090B] border-t border-zinc-900 py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D6FF2A] flex items-center justify-center"><Zap size={16} className="text-black fill-black" /></div>
              <span className="font-black text-white">KINETIX<span className="text-[#D6FF2A]">FITT</span></span>
              <span className="text-xs text-zinc-500">© 2026 KINETIXFITT. Todos los derechos reservados.</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-bold text-zinc-400">
              <Link href="/legal/privacidad" className="hover:text-white min-h-[44px] inline-flex items-center">Privacidad</Link>
              <Link href="/legal/terminos" className="hover:text-white min-h-[44px] inline-flex items-center">Términos</Link>
              <Link href="/legal/cookies" className="hover:text-white min-h-[44px] inline-flex items-center">Cookies</Link>
              <Link href="/licencia" className="hover:text-white min-h-[44px] inline-flex items-center">Licencia</Link>
              <a href="mailto:ezequiel@kinetixfitt.com" className="hover:text-white min-h-[44px] inline-flex items-center">Contacto</a>
            </nav>
          </div>
          <div className="mt-6 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] leading-relaxed text-zinc-600">
            <span>Hecho con ♥ en Argentina · Cumplimos Ley 25.326, LGPD y GDPR. No vendemos tus datos.</span>
            <span className="flex items-center gap-3">
              <Link href="/legal/privacidad" className="underline decoration-zinc-800 hover:text-zinc-400">Privacidad</Link>
              <span className="text-zinc-800">·</span>
              <Link href="/sitemap.xml" className="underline decoration-zinc-800 hover:text-zinc-400">Sitemap</Link>
              <span className="text-zinc-800">·</span>
              <a href="/robots.txt" className="underline decoration-zinc-800 hover:text-zinc-400">Robots</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
