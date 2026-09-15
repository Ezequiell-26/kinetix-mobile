'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Dumbbell, Users, TrendingUp, Zap, Activity, CheckCircle2, Play, Star, ArrowRight, Menu, X, Crown, Heart, ShieldCheck, Flame, Award, MessageCircle, BarChart3, Smartphone, Monitor, Clock, Target, Apple, UtensilsCrossed,
  ChevronDown, Shield, Timer, Gift, Lock, Globe
} from 'lucide-react';
import Link from 'next/link';
import { capture, trackCtaClicked, trackCheckoutStarted, trackOnboardingStarted } from '../lib/posthog';
import { dictionaries } from '../lib/i18n/dictionaries';
import type { Locale } from '../lib/i18n/config';

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

// Language switcher
const LangSwitcher = ({ locale }: { locale: Locale }) => {
  const other: Locale = locale === 'es' ? 'en' : 'es';
  const label = other === 'en' ? 'EN' : 'ES';
  const href = `/${other}`;
  return (
    <Link
      href={href}
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${other}; path=/; max-age=31536000; SameSite=Lax`;
        capture('cta_clicked', { cta: `switch_to_${other}`, location: 'navbar' } as any);
      }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-black tracking-widest text-zinc-400 hover:text-white hover:border-zinc-700 transition"
      aria-label={`Switch to ${other}`}
    >
      <Globe size={12} /> {label}
    </Link>
  );
};

// ScarcityBar
const ScarcityBar = ({ dict }: { dict: typeof dictionaries['es'] }) => {
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
        <span className="inline-flex items-center gap-1.5 font-black"><span className="w-2 h-2 rounded-full bg-black animate-pulse" /> {dict.scarcity.label}</span>
        <span className="text-black/80 font-bold">Quedan <b className="text-black underline decoration-black/20 underline-offset-4">{dict.scarcity.plazas}</b> a $19/mes — luego $29.</span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black text-[#D6FF2A] font-black tracking-widest text-[11px]">
          <Timer size={12} /> {String(left.h).padStart(2, '0')}:{String(left.m).padStart(2, '0')}:{String(left.s).padStart(2, '0')}
        </span>
        <a href="#pricing" className="hidden sm:inline-flex items-center gap-1 font-black underline decoration-black/20 underline-offset-4 hover:opacity-70">{dict.scarcity.reserve} <ArrowRight size={12} /></a>
      </div>
    </div>
  );
};

const Navbar = ({ dict, locale }: { dict: typeof dictionaries['es']; locale: Locale }) => {
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
        <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#D6FF2A] flex items-center justify-center group-hover:rotate-3 transition-transform">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <span className="text-[18px] font-black tracking-tight text-white">KINETIX<span className="text-[#D6FF2A]">FITT</span></span>
          <span className="hidden sm:inline text-[10px] font-bold tracking-[0.18em] text-zinc-500 ml-1">by KINETIXFITT</span>
        </Link>
        <div className="hidden lg:flex items-center gap-4 text-sm font-bold text-zinc-300">
          <a href="#funcionalidades" className="hover:text-white transition">{dict.nav.features}</a>
          <a href="#como-funciona" className="hover:text-white transition">{dict.nav.howItWorks}</a>
          <a href="#pricing" className="hover:text-white transition">{dict.nav.pricing}</a>
          <a href="#faq" className="hover:text-white transition">{dict.nav.faq}</a>
          <a href={`${APP_URL}/client/tools`} className="hover:text-white transition">{dict.nav.tools}</a>
          <LangSwitcher locale={locale} />
          <a href={APP_LOGIN} onClick={()=>trackCtaClicked("navbar_login", "navbar")} className="ml-1 text-white hover:text-[#D6FF2A]">{dict.nav.login}</a>
          <a href={APP_REGISTER} onClick={()=>{trackCtaClicked("navbar_empezar_gratis", "navbar"); trackOnboardingStarted({ source: "navbar", cta: "empezar_gratis" }); capture("onboarding_started", { source: "navbar" } as any);}} className="ml-1 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white text-black font-black text-sm hover:bg-zinc-100">{dict.nav.startFree}</a>
          <span className="hidden xl:inline-flex items-center gap-2 text-xs font-bold text-zinc-500"><Monitor size={14}/> Web + <Smartphone size={14}/> App</span>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <LangSwitcher locale={locale} />
          <button onClick={() => setOpen(!open)} className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">{open ? <X size={18}/> : <Menu size={18} />}</button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-[#09090B] border-b border-zinc-900 overflow-hidden">
            <div className="px-4 py-6 space-y-4">
              <a href="#funcionalidades" onClick={() => setOpen(false)} className="block text-white font-bold">{dict.nav.features}</a>
              <a href="#como-funciona" onClick={() => setOpen(false)} className="block text-white font-bold">{dict.nav.howItWorks}</a>
              <a href="#pricing" onClick={() => setOpen(false)} className="block text-white font-bold">{dict.nav.pricing}</a>
              <a href="#faq" onClick={() => setOpen(false)} className="block text-white font-bold">{dict.nav.faq}</a>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <a href={APP_LOGIN} className="py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center font-black text-white">{dict.nav.login}</a>
                <a href={APP_REGISTER} onClick={()=>{trackCtaClicked("mobile_nav_empezar", "mobile_nav"); trackOnboardingStarted({ source: "mobile_nav" });}} className="py-3 rounded-xl bg-[#D6FF2A] text-center font-black text-black">{dict.nav.startFree}</a>
              </div>
              <a href={APP_URL} onClick={()=>trackCtaClicked("mobile_nav_abrir_app", "mobile_nav")} className="flex items-center justify-center gap-2 text-xs font-bold text-[#D6FF2A]">→ {dict.nav.open}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default function Landing({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale];
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#09090B] text-white selection:bg-[#D6FF2A]/30 selection:text-[#D6FF2A]">
      <div className="fixed top-0 inset-x-0 z-[60]"><ScarcityBar dict={dict} /></div>
      <div className="h-[36px]" />
      <Navbar dict={dict} locale={locale} />

      {/* HERO */}
      <section className="relative pt-28 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#09090B]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(214,255,42,0.08),transparent_60%)]" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#D6FF2A]/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between max-w-5xl mx-auto mb-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
              <Star size={14} className="text-[#D6FF2A] fill-[#D6FF2A]" />
              <span className="text-xs font-black text-white">{dict.hero.reviews}</span>
              <span className="text-xs text-zinc-400">· {dict.hero.excelente}</span>
            </div>
            <Badge><Crown size={12}/> {dict.hero.badge}</Badge>
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-zinc-300">
              <Users size={14} /> {dict.hero.athletes}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <h1 className="text-[42px] md:text-[64px] lg:text-[72px] font-black tracking-[-0.04em] leading-[0.9] text-white">
              {dict.hero.titleLine1}<br />
              <span className="text-[#D6FF2A]">{dict.hero.titleHighlight}</span><br />
              {dict.hero.titleLine3}
            </h1>
            <p className="mt-6 text-[17px] md:text-[19px] leading-relaxed text-zinc-400 max-w-2xl mx-auto">
              {dict.hero.subtitle.split('KINETIXFITT')[0]}<span className="text-white font-bold">KINETIXFITT</span>{dict.hero.subtitle.split('KINETIXFITT')[1] || ''}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={APP_REGISTER} onClick={()=>{trackCtaClicked("hero_comenzar_transformacion", "hero"); trackOnboardingStarted({ source: "hero", cta: "comenzar_transformacion" });}} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#D6FF2A] text-black font-black text-[15px] hover:bg-[#E0FF5A] shadow-[0_10px_30px_rgba(214,255,42,0.25)] transition">
                {dict.hero.ctaPrimary} <ArrowRight size={18} />
              </a>
              <a href={APP_URL} onClick={()=>trackCtaClicked("hero_usar_en_web", "hero")} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-black text-[15px] hover:bg-zinc-800 transition">
                <Monitor size={18}/> {dict.hero.ctaWeb} <span className="text-zinc-500 font-bold">{dict.hero.ctaNoInstall}</span>
              </a>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <a href={APP_REGISTER} onClick={()=>trackCtaClicked("hero_appstore", "hero")} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-xs font-black">● App Store</a>
              <a href={APP_REGISTER} onClick={()=>trackCtaClicked("hero_googleplay", "hero")} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-xs font-black">▶ Google Play</a>
              <span className="text-xs text-zinc-500 font-bold">{dict.hero.downloadFree}</span>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {dict.hero.stats.map(s => (
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
                      <span className="text-xs font-black tracking-widest text-zinc-500 uppercase">{dict.mock.today}</span>
                      <span className="text-xs font-black px-2 py-1 rounded-full bg-[#D6FF2A] text-black">{dict.mock.streak}</span>
                    </div>
                    <div className="h-28 rounded-xl bg-zinc-950 border border-zinc-800 flex items-end gap-1 p-3">
                      {[40, 65, 45, 80, 60, 95, 70].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-lg bg-[#D6FF2A]" style={{ height: `${h}%`, opacity: 0.6 + i * 0.05 }} />
                      ))}
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-xl bg-zinc-950 border border-zinc-800 py-3"><div className="text-sm font-black text-white">3/4</div><div className="text-[10px] text-zinc-500 uppercase font-bold">{dict.mock.sessions}</div></div>
                      <div className="rounded-xl bg-zinc-950 border border-zinc-800 py-3"><div className="text-sm font-black text-white">82%</div><div className="text-[10px] text-zinc-500 uppercase font-bold">{dict.mock.adherence}</div></div>
                      <div className="rounded-xl bg-zinc-950 border border-zinc-800 py-3"><div className="text-sm font-black text-white">+2.1kg</div><div className="text-[10px] text-zinc-500 uppercase font-bold">{dict.mock.muscle}</div></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-2xl bg-[#D6FF2A] p-4 text-black">
                      <div className="text-xs font-black uppercase tracking-wide opacity-70">{dict.mock.todayWorkout}</div>
                      <div className="text-lg font-black leading-tight mt-1">{dict.mock.workoutTitle}</div>
                      <div className="text-xs font-bold opacity-70">{dict.mock.workoutMeta}</div>
                      <a href={APP_REGISTER} className="mt-3 inline-flex w-full justify-center py-2.5 rounded-xl bg-black text-white font-black text-xs">{dict.mock.start}</a>
                    </div>
                    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
                      <div className="text-xs font-bold text-zinc-400">{dict.mock.nextCheckin}</div>
                      <div className="text-sm font-black text-white">{dict.mock.energy}</div>
                      <div className="text-xs text-[#D6FF2A] font-bold">{dict.mock.review}</div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" /><span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" /><span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {dict.mock.sync}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3 PASOS */}
      <section id="como-funciona" className="py-20 bg-[#101012] border-y border-zinc-900">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <Badge>{dict.steps.badge}</Badge>
            <h2 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-white">{dict.steps.title}<br /><span className="text-zinc-500">{dict.steps.titleMuted}</span></h2>
            <p className="mt-4 text-zinc-400">{dict.steps.subtitle}</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {dict.steps.cards.map((s, idx) => {
              const icons = [Flame, TrendingUp, ShieldCheck];
              const Icon = icons[idx] || Flame;
              const gradients = ["from-[#D6FF2A] to-emerald-400", "from-violet-500 to-fuchsia-500", "from-cyan-400 to-blue-500"];
              return (
                <div key={s.n} className="group relative rounded-[24px] bg-[#0A0A0B] border border-zinc-800 p-7 overflow-hidden hover:border-zinc-700 transition">
                  <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradients[idx]} opacity-[0.08] rounded-full blur-2xl`} />
                  <div className="text-[12px] font-black tracking-[0.2em] text-zinc-500">{s.n}</div>
                  <div className={`mt-3 w-12 h-12 rounded-2xl bg-gradient-to-br ${gradients[idx]} flex items-center justify-center text-white`}><Icon size={20} /></div>
                  <h3 className="mt-5 text-xl font-black text-white leading-tight">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.d}</p>
                  <div className="mt-6">
                    <a href={APP_REGISTER} className="inline-flex items-center gap-1 text-sm font-black text-white hover:text-[#D6FF2A]">{dict.steps.cta.split('→')[0].trim()} <ArrowRight size={14} /></a>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <a href={APP_REGISTER} className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-[#D6FF2A] text-black font-black hover:bg-[#E0FF5A]">{dict.steps.cta}</a>
            <p className="mt-3 text-xs font-bold tracking-wide text-zinc-500">{dict.steps.join}</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-20 bg-[#09090B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center">
            <Badge><Star size={12} className="fill-[#D6FF2A]" /> {dict.testimonials.badge}</Badge>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white">{dict.testimonials.title}</h2>
            <p className="mt-2 text-zinc-400">{dict.testimonials.subtitle}</p>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {dict.testimonials.cards.map(card => (
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

      {/* FUNCIONALIDADES */}
      <section id="funcionalidades" className="py-20 bg-[#101012] border-y border-zinc-900">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <Badge>{dict.features.badge}</Badge>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white">{dict.features.title}<br />{dict.features.title2}</h2>
            <p className="mt-3 text-zinc-400">{dict.features.subtitle}</p>
          </div>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dict.features.cards.map((f, i) => {
              const icons = [Target, BarChart3, Crown, Users];
              const Icon = icons[i] || Target;
              const grads = ["from-[#D6FF2A] to-emerald-400", "from-violet-500 to-purple-500", "from-amber-400 to-orange-500", "from-cyan-400 to-blue-500"];
              return (
                <div key={f.title} className="rounded-[24px] bg-[#0A0A0B] border border-zinc-800 p-7 hover:border-zinc-700 transition group">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${grads[i]} flex items-center justify-center text-white`}><Icon size={20} /></div>
                  <h3 className="mt-5 font-black text-white">{f.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 grid lg:grid-cols-2 gap-6 items-center">
            <div className="rounded-[24px] bg-zinc-900 border border-zinc-800 p-6">
              <div className="text-xs font-black tracking-widest text-zinc-500 uppercase">{dict.features.forTrainers}</div>
              <h3 className="mt-2 text-2xl font-black text-white">{dict.features.trainerTitle}</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                {dict.features.bullets.map(b => (
                  <li key={b} className="flex gap-2"><CheckCircle2 size={16} className="text-[#D6FF2A] mt-0.5" /> <span><b>{b.split(':')[0]}:</b> {b.split(':').slice(1).join(':')}</span></li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <a href={APP_REGISTER} className="px-5 py-3 rounded-xl bg-white text-black font-black text-sm">{dict.features.tryFree}</a>
                <a href={APP_URL} className="px-5 py-3 rounded-xl bg-zinc-800 text-white font-black text-sm border border-zinc-700">{dict.features.seeDemo}</a>
              </div>
            </div>
            <div className="rounded-[24px] bg-[#D6FF2A] p-7 text-black">
              <div className="text-xs font-black tracking-widest uppercase opacity-60">{dict.features.useWherever}</div>
              <h3 className="mt-1 text-2xl font-black">{dict.features.syncedTitle}</h3>
              <p className="mt-2 text-sm font-medium opacity-70">{dict.features.syncedDesc}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <a href={APP_URL} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-black text-white font-black text-sm"><Monitor size={16} /> {dict.features.openWeb}</a>
                <a href={APP_REGISTER} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-black text-sm border border-black/10"><Smartphone size={16} /> {dict.features.downloadApp}</a>
              </div>
              <div className="mt-4 text-xs font-bold opacity-60">{dict.features.tiktokHint}</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 bg-[#09090B]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <Badge><Award size={12} /> {dict.pricing.badge}</Badge>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white">{dict.pricing.title}<br />{dict.pricing.title2}</h2>
            <p className="mt-3 text-zinc-400">{dict.pricing.subtitle}</p>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {dict.pricing.plans.map(p => (
              <div key={p.name} className={`relative rounded-[24px] p-7 flex flex-col ${p.featured ? 'bg-white text-black border-2 border-[#D6FF2A] shadow-[0_20px_60px_rgba(214,255,42,0.15)] md:-translate-y-2' : 'bg-zinc-900 border border-zinc-800 text-white'}`}>
                {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#D6FF2A] text-black text-[11px] font-black tracking-widest uppercase">{dict.pricing.popular}</div>}
                <h3 className={`text-lg font-black ${p.featured ? 'text-black' : 'text-white'}`}>{p.name}</h3>
                <div className="mt-2 flex items-baseline gap-1"><span className={`text-4xl font-black ${p.featured ? 'text-black' : 'text-white'}`}>{p.price}</span><span className={`text-sm ${p.featured ? 'text-zinc-500' : 'text-zinc-500'}`}>{p.cad}</span></div>
                <p className={`text-sm ${p.featured ? 'text-zinc-600' : 'text-zinc-400'}`}>{p.desc}</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {p.feats.map(f => (
                    <li key={f} className={`flex items-center gap-2 text-sm font-bold ${p.featured ? 'text-black' : 'text-zinc-300'}`}><CheckCircle2 size={16} className={p.featured ? 'text-black' : 'text-[#D6FF2A]'} /> {f}</li>
                  ))}
                </ul>
                <a href={APP_REGISTER} onClick={()=>{
                  const priceMap: Record<string, number> = { "Básico": 0, "Basic": 0, "Pro Athlete": 19, "Elite Coach": 49 };
                  trackCheckoutStarted({ plan: p.name, provider: "stripe", price: priceMap[p.name] || 0, currency: "USD", location: "pricing" });
                  trackCtaClicked(`pricing_${p.name.toLowerCase().replace(/\s+/g, "_")}`, "pricing");
                }} className={`mt-7 inline-flex justify-center py-3 rounded-xl font-black ${p.featured ? 'bg-black text-white hover:bg-zinc-900' : 'bg-[#D6FF2A] text-black hover:bg-[#E0FF5A]'}`}>{p.cta}</a>
                {p.featured && <div className="mt-3 text-center text-xs font-bold text-zinc-500">{dict.pricing.freeTrial}</div>}
              </div>
            ))}
          </div>
          <div className="mt-8 max-w-3xl mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex gap-4 items-center shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <div className="w-12 h-12 rounded-xl bg-[#D6FF2A] flex items-center justify-center text-black shrink-0"><Shield size={20} /></div>
            <div className="flex-1"><div className="font-black text-white text-sm sm:text-base">{dict.pricing.guarantee}</div><div className="text-sm text-zinc-400 leading-relaxed">{dict.pricing.guaranteeDesc} <span className="inline-flex items-center gap-1 text-xs font-bold text-zinc-500 ml-1"><Lock size={12}/> Pago seguro Stripe</span></div></div>
            <div className="hidden sm:block text-xs font-black px-3 py-2 rounded-full bg-[#D6FF2A] text-black whitespace-nowrap">{dict.pricing.noRisk}</div>
          </div>
          <div className="mt-6 text-center text-xs font-bold text-zinc-500">{dict.pricing.footer}</div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 bg-[#101012] border-y border-zinc-900">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-2xl font-black text-white">{dict.finalCta.title}</h3>
          <p className="mt-2 text-zinc-400">{dict.finalCta.subtitle}</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <a href={APP_URL} onClick={()=>trackCtaClicked("final_abrir_navegador", "final_cta")} className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#D6FF2A] text-black font-black hover:bg-[#E0FF5A]"><Monitor size={18} /> {dict.finalCta.openBrowser}</a>
            <a href={APP_REGISTER} onClick={()=>{trackCtaClicked("final_crear_cuenta", "final_cta"); trackOnboardingStarted({ source: "final_cta" });}} className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white text-black font-black"><Zap size={18} /> {dict.finalCta.createFree}</a>
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-left max-w-xl mx-auto">
            <div className="text-xs font-black tracking-widest text-zinc-400 uppercase">{dict.finalCta.tiktokTitle}</div>
            <ol className="mt-2 text-sm text-zinc-300 list-decimal list-inside space-y-1">
              <li>{dict.finalCta.step1}</li>
              <li>{dict.finalCta.step2}</li>
              <li>{dict.finalCta.step3}</li>
            </ol>
            <button onClick={() => navigator.clipboard.writeText(APP_URL)} className="mt-3 text-xs font-black px-3 py-2 rounded-xl bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700">{dict.finalCta.copyLink}</button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs font-bold text-zinc-500">
            <span className="flex items-center gap-1.5"><Clock size={14} /> {dict.finalCta.months}</span>
            <span className="flex items-center gap-1.5"><Heart size={14} /> {dict.finalCta.support}</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> {dict.finalCta.protected}</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-[#09090B] border-t border-zinc-900">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <div className="text-center">
            <Badge><Shield size={12}/> {dict.faq.badge}</Badge>
            <h2 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-white">{dict.faq.title}</h2>
            <p className="mt-2 text-zinc-400">{dict.faq.subtitle}</p>
          </div>
          <div className="mt-8 space-y-3">
            {dict.faq.items.map((f, i) => (
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
          <div className="mt-6 text-center"><a href="mailto:ezequiel@kinetixfitt.com" className="inline-flex items-center gap-2 text-sm font-bold text-[#D6FF2A] hover:text-[#E0FF5A]">{dict.faq.contact} <ArrowRight size={14} /></a></div>
        </div>
      </section>

      <footer className="bg-[#09090B] border-t border-zinc-900 py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D6FF2A] flex items-center justify-center"><Zap size={16} className="text-black fill-black" /></div>
              <span className="font-black text-white">KINETIX<span className="text-[#D6FF2A]">FITT</span></span>
              <span className="text-xs text-zinc-500">{dict.footer.rights}</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-bold text-zinc-400">
              <Link href="/legal/privacidad" className="hover:text-white min-h-[44px] inline-flex items-center">{dict.footer.privacy}</Link>
              <Link href="/legal/terminos" className="hover:text-white min-h-[44px] inline-flex items-center">{dict.footer.terms}</Link>
              <Link href="/legal/cookies" className="hover:text-white min-h-[44px] inline-flex items-center">{dict.footer.cookies}</Link>
              <Link href="/licencia" className="hover:text-white min-h-[44px] inline-flex items-center">{dict.footer.license}</Link>
              <a href="mailto:ezequiel@kinetixfitt.com" className="hover:text-white min-h-[44px] inline-flex items-center">{dict.footer.contact}</a>
            </nav>
          </div>
          <div className="mt-6 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] leading-relaxed text-zinc-600">
            <span>{dict.footer.made}</span>
            <span className="flex items-center gap-3">
              <Link href="/legal/privacidad" className="underline decoration-zinc-800 hover:text-zinc-400">{dict.footer.privacy}</Link>
              <span className="text-zinc-800">·</span>
              <Link href="/sitemap.xml" className="underline decoration-zinc-800 hover:text-zinc-400">Sitemap</Link>
              <span className="text-zinc-800">·</span>
              <a href="/robots.txt" className="underline decoration-zinc-800 hover:text-zinc-400">Robots</a>
            </span>
          </div>
          <div className="mt-4 flex justify-center">
            <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-600">
              <Globe size={12} /> <a href="/es" className={`hover:text-white ${locale==='es' ? 'text-white underline' : ''}`}>ES</a> <span className="text-zinc-800">·</span> <a href="/en" className={`hover:text-white ${locale==='en' ? 'text-white underline' : ''}`}>EN</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
