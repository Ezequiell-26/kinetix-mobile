import Link from "next/link";
import type { Metadata } from "next";
import {
  ClipboardList,
  Dumbbell,
  Timer,
  Apple,
  MessagesSquare,
  Camera,
  ArrowRight,
} from "lucide-react";
import { SiteNav } from "@/components/landing/site-nav";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Funciones — EZEQUIEL COACHING",
  description:
    "Programa personalizado, +100 ejercicios, cronómetros, nutrición, mensajes con tu coach y progreso privado.",
};

const groups = [
  {
    icon: ClipboardList,
    title: "Programa personalizado",
    desc: "Tu plan armado por Ezequiel según tu objetivo, días disponibles y lugar de entreno: casa o gimnasio.",
    href: "/client/workout",
    cta: "Ver mi entreno",
  },
  {
    icon: Dumbbell,
    title: "+100 ejercicios con guía",
    desc: "Biblioteca disponible sin conexión: instrucciones, músculos trabajados y equipo necesario de cada ejercicio.",
    href: "/client/workout",
    cta: "Explorar ejercicios",
  },
  {
    icon: Timer,
    title: "Cronómetros integrados",
    desc: "HIIT, Tabata, EMOM, Pomodoro y descansos entre series, sin salir de tu sesión de entreno.",
    href: "/client/timers",
    cta: "Abrir cronómetros",
  },
  {
    icon: Apple,
    title: "Nutrición y calculadoras",
    desc: "Registro diario de comidas, macros, calculadora de calorías, TMB y 1RM estimado.",
    href: "/client/nutrition",
    cta: "Ver nutrición",
  },
  {
    icon: MessagesSquare,
    title: "Contacto directo con tu coach",
    desc: "Mensajes privados y check-ins semanales con respuesta real de Ezequiel. Nada de bots.",
    href: "/client/messages",
    cta: "Abrir mensajes",
  },
  {
    icon: Camera,
    title: "Progreso 100% privado",
    desc: "Peso, medidas y fotos de progreso visibles solo para vos y tu entrenador. Comparador antes/después incluido.",
    href: "/client/progress",
    cta: "Ver mi progreso",
  },
];

export default function FuncionesPage() {
  return (
    <div className="min-h-dvh bg-[#080808] text-white">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-center text-balance">
          Todo tu entreno, <span className="text-[#34D399]">en un solo lugar</span>
        </h1>
        <p className="mt-4 text-center text-zinc-400 max-w-xl mx-auto">
          Seis herramientas reales que usás todos los días. Tocá cada una para
          abrirla en tu panel.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {groups.map((g) => (
            <article
              key={g.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col"
            >
              <g.icon size={26} className="text-[#34D399]" />
              <h2 className="mt-4 text-xl font-black">{g.title}</h2>
              <p className="mt-2 text-sm text-zinc-400 flex-1">{g.desc}</p>
              <Link
                href={g.href}
                className="mt-5 min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 text-sm font-black hover:border-[#34D399]"
              >
                {g.cta} <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/register"
            className="min-h-[52px] inline-flex items-center gap-2 px-8 rounded-full bg-[#34D399] text-black font-black"
          >
            Probarlo gratis <ArrowRight size={18} />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
