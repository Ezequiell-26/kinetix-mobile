'use client';

import Link from "next/link";
import {
  ClipboardList,
  Dumbbell,
  Timer,
  Apple,
  MessagesSquare,
  Camera,
  ArrowRight,
  CheckCircle2,
  Play,
  Sparkles,
} from "lucide-react";
import { SiteNav } from "@/components/landing/site-nav";
import { SiteFooter } from "@/components/landing/site-footer";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useTranslation } from "@/hooks/use-translation";

const groups = [
  {
    icon: ClipboardList,
    title: "Programa personalizado",
    desc: "Tu plan armado por Ezequiel según tu objetivo, días disponibles y lugar de entreno: casa o gimnasio.",
    href: "/client/workout",
    cta: "Ver mi entreno",
    features: ["Adaptativo", "Sin conexión", "Actualizable"],
    image: "/features/programa-personalizado.jpg",
  },
  {
    icon: Dumbbell,
    title: "+100 ejercicios con guía",
    desc: "Biblioteca disponible sin conexión: instrucciones, músculos trabajados y equipo necesario de cada ejercicio.",
    href: "/client/workout",
    cta: "Explorar ejercicios",
    features: ["Videos 3D", "Instrucciones paso a paso", "Músculos trabajados"],
    image: "/features/biblioteca-ejercicios.jpg",
  },
  {
    icon: Timer,
    title: "Cronómetros integrados",
    desc: "HIIT, Tabata, EMOM, Pomodoro y descansos entre series, sin salir de tu sesión de entreno.",
    href: "/client/timers",
    cta: "Abrir cronómetros",
    features: ["Múltiples modos", "Personalizable", "Alertas sonoras"],
    image: "/features/cronometros.jpg",
  },
  {
    icon: Apple,
    title: "Nutrición y calculadoras",
    desc: "Registro diario de comidas, macros, calculadora de calorías, TMB y 1RM estimado.",
    href: "/client/nutrition",
    cta: "Ver nutrición",
    features: ["Scanner de códigos", "Base de datos alimentos", "Seguimiento de macros"],
    image: "/features/nutricion.jpg",
  },
  {
    icon: MessagesSquare,
    title: "Contacto directo con tu coach",
    desc: "Mensajes privados y check-ins semanales con respuesta real de Ezequiel. Nada de bots.",
    href: "/client/messages",
    cta: "Abrir mensajes",
    features: ["Respuesta rápida", "Check-ins semanales", "Soporte 24/7"],
    image: "/features/mensajes-coach.jpg",
  },
  {
    icon: Camera,
    title: "Progreso 100% privado",
    desc: "Peso, medidas y fotos de progreso visibles solo para vos y tu entrenador. Comparador antes/después incluido.",
    href: "/client/progress",
    cta: "Ver mi progreso",
    features: ["Comparador de fotos", "Gráficos de progreso", "Privacidad total"],
    image: "/features/progreso.jpg",
  },
];

const testimonials = [
  {
    name: "Martín G.",
    role: "Cliente desde 2024",
    content: "La mejor app de entrenamiento que usé. El programa se adapta perfectamente a mi horario y los ejercicios están muy bien explicados.",
    rating: 5,
    image: "/testimonials/martin-g.jpg",
  },
  {
    name: "Sofía R.",
    role: "Cliente desde 2023",
    content: "El seguimiento nutricional y las calculadoras me ayudaron a alcanzar mis objetivos. La comunicación con Ezequiel es excelente.",
    rating: 5,
    image: "/testimonials/sofia-r.jpg",
  },
  {
    name: "Lucas P.",
    role: "Cliente desde 2024",
    content: "Los cronómetros integrados y el modo offline son increíbles. Entreno en cualquier lado sin preocuparme por la conexión.",
    rating: 5,
    image: "/testimonials/lucas-p.jpg",
  },
];

export default function FuncionesView() {
  const { t, locale } = useTranslation();
  
  return (
    <div className="min-h-dvh bg-[#080808] text-white">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-4 py-14">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-6">
            <Sparkles size={16} className="text-[#34D399]" />
            <span className="text-sm font-medium">6 herramientas esenciales</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-balance">
            Todo tu entreno,{" "}
            <span className="text-[#34D399]">en un solo lugar</span>
          </h1>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            Seis herramientas reales que usás todos los días. Diseñadas para maximizar tus resultados sin complicaciones.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#34D399] text-black font-black hover:bg-[#2DC48A] transition-colors"
            >
              Probarlo gratis <ArrowRight size={18} />
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-zinc-700 font-black hover:border-[#34D399] transition-colors"
            >
              <Play size={18} /> Ver demo
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {groups.map((g, index) => (
            <article
              key={g.title}
              className="group rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden hover:border-[#34D399]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#34D399]/10"
            >
              <div className="relative h-48 bg-zinc-900 overflow-hidden">
                <OptimizedImage
                  src={g.image}
                  alt={g.title}
                  width={400}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAAA//EABQAAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AfwAAAP//2Q=="
                />
                <div className="absolute top-4 left-4 p-2 rounded-lg bg-zinc-950/80 backdrop-blur-sm">
                  <g.icon size={24} className="text-[#34D399]" />
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-black">{g.title}</h2>
                <p className="mt-2 text-sm text-zinc-400">{g.desc}</p>
                <ul className="mt-4 space-y-2">
                  {g.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-zinc-300">
                      <CheckCircle2 size={16} className="text-[#34D399] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={g.href}
                  className="mt-6 min-h-[48px] inline-flex items-center justify-center gap-2 w-full rounded-full border border-zinc-700 text-sm font-black hover:border-[#34D399] hover:bg-[#34D399]/10 transition-all"
                >
                  {g.cta} <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </section>

        {/* Demo Section */}
        <section id="demo" className="mb-20">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-black">Mirá cómo funciona</h2>
              <p className="mt-2 text-zinc-400">Una vista rápida de todas las funciones en acción</p>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="group flex items-center gap-4 px-8 py-4 rounded-full bg-[#34D399]/20 border border-[#34D399] hover:bg-[#34D399]/30 transition-all">
                  <div className="w-12 h-12 rounded-full bg-[#34D399] flex items-center justify-center">
                    <Play size={24} className="text-black ml-1" />
                  </div>
                  <span className="font-black text-[#34D399]">Reproducir video</span>
                </button>
              </div>
              <OptimizedImage
                src="/features/video-thumbnail.jpg"
                alt="Video demo de funciones"
                width={1280}
                height={720}
                className="w-full h-full object-cover opacity-50"
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-black">Lo que dicen nuestros clientes</h2>
            <p className="mt-2 text-zinc-400">Resultados reales de personas reales</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-[#34D399]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-zinc-300 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden">
                    <OptimizedImage
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-zinc-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-black">Preguntas frecuentes</h2>
            <p className="mt-2 text-zinc-400">Resolvemos tus dudas</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "¿Necesito conexión a internet para usar la app?",
                a: "No. La mayoría de las funciones funcionan sin conexión, incluyendo tu programa de ejercicios y los cronómetros. Solo necesitas internet para sincronizar tu progreso y recibir actualizaciones.",
              },
              {
                q: "¿Cuánto tiempo tarda Ezequiel en responder los mensajes?",
                a: "Generalmente responde dentro de las 24 horas hábiles. Para consultas urgentes, podés usar el chat en vivo durante el horario de atención.",
              },
              {
                q: "¿Puedo cambiar mi programa si mis objetivos cambian?",
                a: "Sí. Tu programa se adapta automáticamente según tu progreso y feedback. Además, podés solicitar ajustes personalizados en cualquier momento.",
              },
              {
                q: "¿La app está disponible para iOS y Android?",
                a: "Sí, KinetixFitt está disponible como PWA progresiva que funciona en ambos sistemas, además de tener versiones nativas para una experiencia optimizada.",
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-bold">{faq.q}</h3>
                  <span className="transition group-open:rotate-180">
                    <svg
                      className="w-5 h-5 text-zinc-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-zinc-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section className="text-center">
          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-900 p-12">
            <h2 className="text-2xl lg:text-4xl font-black mb-4">
              ¿Listo para empezar tu transformación?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Unite a miles de clientes que ya alcanzaron sus objetivos con Ezequiel Coaching.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#34D399] text-black font-black hover:bg-[#2DC48A] transition-colors"
              >
                Comenzar gratis <ArrowRight size={18} />
              </Link>
              <Link
                href="/planes"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-zinc-700 font-black hover:border-[#34D399] transition-colors"
              >
                Ver planes
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

