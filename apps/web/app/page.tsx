'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Dumbbell, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Activity, 
  CheckCircle2, 
  Play, 
  Star, 
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  Crown,
  Heart
} from 'lucide-react';
import Link from 'next/link';

// --- Componentes UI Reutilizables ---

const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${className}`}>
    {children}
  </span>
);

const Button = ({ 
  children, 
  variant = 'primary', 
  className = "", 
  icon: Icon,
  ...props 
}: any) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  const variants: any = {
    primary: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25 focus:ring-emerald-500",
    secondary: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 focus:ring-slate-500",
    outline: "bg-transparent border-2 border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-white focus:ring-emerald-500",
    ghost: "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white"
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.95 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {Icon && <Icon className="ml-2 w-5 h-5" />}
    </motion.button>
  );
};

// --- Secciones Principales ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-emerald-500/20">
            <Zap className="text-white w-6 h-6 fill-white" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Kinetix<span className="text-emerald-500">Fit</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {['Características', 'Programas', 'Precios', 'Comunidad'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
              {item}
            </a>
          ))}
          <Link href="/auth/login">
            <Button variant="ghost" className="!px-4 !py-2">Ingresar</Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="primary" className="!px-5 !py-2.5 !rounded-lg text-sm">Empezar Gratis</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-slate-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950 border-b border-slate-800 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {['Características', 'Programas', 'Precios', 'Comunidad'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  className="block text-base font-medium text-slate-300 hover:text-emerald-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 flex flex-col space-y-3">
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full justify-center">Ingresar</Button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">Empezar Gratis</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 animate-pulse">
            <Star className="w-3 h-3 mr-1 fill-current" />
            #1 App de Fitness Inteligente en Latinoamérica
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-8 leading-tight">
            Transforma tu cuerpo,<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              Domina tu mente
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            La plataforma todo-en-uno que combina ciencia del deporte, IA personalizada y comunidad para resultados que duran para siempre.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/auth/register">
              <Button variant="primary" icon={ArrowRight} className="w-full sm:w-auto text-lg px-8 py-4 shadow-emerald-500/30 shadow-xl">
                Comienza tu transformación
              </Button>
            </Link>
            <Button variant="secondary" icon={Play} className="w-full sm:w-auto text-lg px-8 py-4">
              Ver cómo funciona
            </Button>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-800/50 pt-10">
            {[
              { label: 'Usuarios Activos', value: '+50k', icon: Users },
              { label: 'Entrenamientos', value: '+1M', icon: Dumbbell },
              { label: 'Calificación', value: '4.9/5', icon: Star },
              { label: 'Retención', value: '92%', icon: TrendingUp },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="flex flex-col items-center"
              >
                <stat.icon className="w-6 h-6 text-emerald-500 mb-2" />
                <span className="text-3xl font-bold text-white">{stat.value}</span>
                <span className="text-sm text-slate-500">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Floating Dashboard Preview */}
        <motion.div 
          style={{ y: y1 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/10 border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
            <div className="aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
               <div className="relative z-10 text-center">
                 <Activity className="w-20 h-20 text-emerald-500/20 mx-auto mb-4 animate-pulse" />
                 <p className="text-slate-500 font-medium">Dashboard Interactivo en Tiempo Real</p>
               </div>
               <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
               <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      title: "IA Adaptativa",
      desc: "Algoritmos que ajustan tu rutina diariamente según tu progreso y fatiga.",
      icon: Zap,
      color: "from-yellow-400 to-orange-500"
    },
    {
      title: "Nutrición Precisa",
      desc: "Planes de comida macro-calculados que se adaptan a tus gustos y objetivos.",
      icon: Heart,
      color: "from-red-400 to-pink-500"
    },
    {
      title: "Comunidad Elite",
      desc: "Únete a grupos de entrenamiento, retos semanales y compite globalmente.",
      icon: Users,
      color: "from-blue-400 to-indigo-500"
    },
    {
      title: "Seguimiento 360°",
      desc: "Métricas avanzadas de sueño, recuperación y rendimiento deportivo.",
      icon: Activity,
      color: "from-emerald-400 to-teal-500"
    }
  ];

  return (
    <section id="características" className="py-32 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <Badge>Tecnología de Punta</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-6 mb-6">
            Todo lo que necesitas para <br/>
            <span className="text-emerald-400">superar tus límites</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            No es solo una app de ejercicios. Es tu entrenador, nutricionista y compañero de entrenamiento en tu bolsillo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 rounded-bl-full transition-opacity group-hover:opacity-10`}></div>
              
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                <feature.icon className="text-white w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const RetentionSection = () => {
  return (
    <section className="py-32 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-purple-500/10 text-purple-400 border-purple-500/20">Gamificación</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Convierte el esfuerzo en <br/>
              <span className="text-purple-400">recompensas reales</span>
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Nuestro sistema de niveles y rachas está diseñado psicológicamente para mantenerte motivado día tras día.
            </p>
            
            <ul className="space-y-6 mb-10">
              {[
                "Rachas diarias con multiplicadores de XP",
                "Desbloquea equipamiento virtual y badges exclusivos",
                "Compite en ligas semanales con premios reales",
                "Historial visual de tu evolución corporal"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-4 flex-shrink-0 mt-1" />
                  <span className="text-lg text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/auth/register">
              <Button variant="primary" className="bg-purple-600 hover:bg-purple-500 shadow-purple-500/25">
                Únete a la Liga Elite
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mt-16 lg:mt-0 relative"
          >
            <div className="relative rounded-3xl bg-slate-800 p-2 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Crown className="w-12 h-12 text-yellow-900" />
              </div>
              <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-square relative flex items-center justify-center border border-slate-700">
                 <div className="text-center">
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">NIVEL 12</div>
                    <div className="text-slate-400 mb-6">Atleta Dedicado</div>
                    <div className="w-64 h-4 bg-slate-800 rounded-full mx-auto overflow-hidden mb-2">
                      <div className="w-3/4 h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-slate-500">2,450 / 3,000 XP para Nivel 13</div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const PricingSection = () => {
  return (
    <section id="precios" className="py-32 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Inversión en tu salud, <br/>
            <span className="text-emerald-400">sin letra chica</span>
          </h2>
          <p className="text-xl text-slate-400">
            Cancela cuando quieras. Sin contratos forzados.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-2">Básico</h3>
            <div className="text-4xl font-bold text-white mb-6">$0<span className="text-lg text-slate-500 font-normal">/mes</span></div>
            <p className="text-slate-400 mb-8 text-sm">Ideal para comenzar tu viaje fitness.</p>
            <ul className="space-y-4 mb-8 flex-1">
              {['Acceso a 50+ ejercicios', 'Seguimiento básico', 'Comunidad pública'].map((feat, i) => (
                <li key={i} className="flex items-center text-slate-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-slate-500 mr-3" /> {feat}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full">Crear cuenta gratis</Button>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="relative p-8 rounded-3xl bg-slate-900 border-2 border-emerald-500 flex flex-col transform md:-translate-y-4 shadow-2xl shadow-emerald-500/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
              Más Popular
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Pro Athlete</h3>
            <div className="text-4xl font-bold text-white mb-6">$19<span className="text-lg text-slate-500 font-normal">/mes</span></div>
            <p className="text-slate-400 mb-8 text-sm">Para quienes buscan resultados serios.</p>
            <ul className="space-y-4 mb-8 flex-1">
              {['Todo lo de Básico', 'Rutinas con IA', 'Planes de nutrición', 'Estadísticas avanzadas', 'Soporte prioritario'].map((feat, i) => (
                <li key={i} className="flex items-center text-white text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-3" /> {feat}
                </li>
              ))}
            </ul>
            <Button variant="primary" className="w-full">Comenzar Prueba Gratis</Button>
            <p className="text-center text-xs text-slate-500 mt-4">7 días de prueba gratis, luego $19/mes</p>
          </div>

          {/* Elite Plan */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-2">Elite Coach</h3>
            <div className="text-4xl font-bold text-white mb-6">$49<span className="text-lg text-slate-500 font-normal">/mes</span></div>
            <p className="text-slate-400 mb-8 text-sm">Entrenamiento personalizado 1 a 1.</p>
            <ul className="space-y-4 mb-8 flex-1">
              {['Todo lo de Pro', 'Coach humano asignado', 'Ajustes semanales en vivo', 'Acceso a eventos exclusivos'].map((feat, i) => (
                <li key={i} className="flex items-center text-slate-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-slate-500 mr-3" /> {feat}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full">Aplicar ahora</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-bold text-white">KinetixFit</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
              La plataforma definitiva para transformar tu físico y mentalidad. Ciencia, tecnología y comunidad en un solo lugar.
            </p>
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer">
                  <Users className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Producto</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#características" className="hover:text-emerald-400 transition-colors">Características</a></li>
              <li><a href="#precios" className="hover:text-emerald-400 transition-colors">Precios</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Descargar App</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Actualizaciones</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Empresa</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Carreras</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Contacto</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacidad</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Términos</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">© 2024 KinetixFit Inc. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-500 text-sm">SSL Secure & Data Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <RetentionSection />
        <PricingSection />
        
        {/* CTA Final */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-30"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">¿Listo para empezar?</h2>
            <p className="text-xl text-emerald-100 mb-10">Únete a más de 50,000 atletas que ya están transformando sus vidas.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/register">
                <Button className="bg-white text-emerald-600 hover:bg-slate-100 shadow-xl w-full sm:w-auto text-lg px-8 py-4">
                  Obtener Acceso Gratis
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
