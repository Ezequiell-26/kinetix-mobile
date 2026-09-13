import Link from "next/link";
import { SiteNav } from "@/components/landing/site-nav";
import { SiteFooter } from "@/components/landing/site-footer";
import {
  Dumbbell,
  ClipboardList,
  MessagesSquare,
  Camera,
  Apple,
  Timer,
  Check,
  ArrowRight,
} from "lucide-react";

// Landing pública (estática y cacheable). El redirect con sesión lo hace el
// middleware (src/middleware.ts §2): redirect() acá competía con él y llegaba
// serializado como error NEXT_REDIRECT en el stream RSC (página en blanco).
export default async function Home() {

  const features = [
    {
      icon: ClipboardList,
      title: "Programa personalizado",
      desc: "Tu plan armado por Ezequiel según tu objetivo, días y lugar de entreno.",
    },
    {
      icon: Dumbbell,
      title: "+100 ejercicios con guía",
      desc: "Biblioteca offline con instrucciones, músculos y equipo necesario.",
    },
    {
      icon: Timer,
      title: "Cronómetros integrados",
      desc: "HIIT, Tabata, EMOM y descansos sin salir de tu entreno.",
    },
    {
      icon: Apple,
      title: "Nutrición y calculadoras",
      desc: "Registro diario, macros, TMB y 1RM siempre a mano.",
    },
    {
      icon: MessagesSquare,
      title: "Contacto directo",
      desc: "Mensajes y check-ins semanales con respuesta de tu coach.",
    },
    {
      icon: Camera,
      title: "Progreso 100% privado",
      desc: "Medidas y fotos visibles solo para vos y tu entrenador.",
    },
  ];

  const plans = [
    { name: "Básico", price: "$12.000", note: "Para arrancar con guía" },
    {
      name: "Personalizado",
      price: "$18.000",
      note: "El más elegido",
      highlight: true,
    },
    { name: "Premium", price: "$25.000", note: "Seguimiento total" },
  ];

  return (
    <div className="min-h-dvh bg-[#080808] text-white">
      <SiteNav />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:pt-24 pb-14 text-center">
        <p className="inline-block text-[11px] font-black tracking-widest text-[#D6FF2A] border border-[#D6FF2A]/30 rounded-full px-4 py-1.5 mb-6">
          ENTRENAMIENTO PERSONALIZADO ONLINE
        </p>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-balance">
          Tu mejor versión,
          <br />
          <span className="text-[#D6FF2A]">cada día.</span>
        </h1>
        <p className="mt-5 text-zinc-400 max-w-xl mx-auto text-balance">
          Programa a medida, seguimiento real y contacto directo con tu coach.
          Todo desde tu celular, sin vueltas.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="min-h-[52px] inline-flex items-center justify-center gap-2 px-8 rounded-full bg-[#D6FF2A] text-black font-black"
          >
            Empezar ahora <ArrowRight size={18} />
          </Link>
          <Link
            href="/install"
            className="min-h-[52px] inline-flex items-center justify-center px-8 rounded-full border border-zinc-700 text-white font-bold hover:border-zinc-500"
          >
            Instalar la app
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
          <span>
            <strong className="text-white text-lg font-black">+100</strong>{" "}
            <span className="text-zinc-500">ejercicios con guía</span>
          </span>
          <span>
            <strong className="text-white text-lg font-black">3</strong>{" "}
            <span className="text-zinc-500">planes a medida</span>
          </span>
          <span>
            <strong className="text-white text-lg font-black">100%</strong>{" "}
            <span className="text-zinc-500">privado</span>
          </span>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-center">
          Todo tu entreno, en un solo lugar
        </h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
            >
              <f.icon size={22} className="text-[#D6FF2A]" />
              <p className="mt-3 font-bold">{f.title}</p>
              <p className="mt-1 text-sm text-zinc-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="border-y border-zinc-900 bg-zinc-950/50">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-center">
            Cómo funciona
          </h2>
          <ol className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              ["1", "Creá tu cuenta", "Registrate gratis en menos de un minuto."],
              ["2", "Recibí tu programa", "Ezequiel arma tu plan según tu objetivo."],
              ["3", "Entrená y progresá", "Registrá, medí y ajustamos juntos."],
            ].map(([n, t, d]) => (
              <li key={n} className="rounded-2xl border border-zinc-800 p-5">
                <span className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-[#D6FF2A] text-black font-black">
                  {n}
                </span>
                <p className="mt-3 font-bold">{t}</p>
                <p className="mt-1 text-sm text-zinc-500">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Planes (precios reales en ARS) */}
      <section id="planes" className="mx-auto max-w-5xl px-4 py-14 scroll-mt-16">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-center">
          Planes mensuales
        </h2>
        <p className="text-center text-sm text-zinc-500 mt-2">
          Precios en pesos argentinos. Sin permanencia.
        </p>
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-6 text-center ${
                p.highlight
                  ? "border-[#D6FF2A] bg-[#D6FF2A]/5"
                  : "border-zinc-800 bg-zinc-950"
              }`}
            >
              <p className="font-bold">{p.name}</p>
              <p className="mt-2 text-3xl font-black">{p.price}</p>
              <p className="mt-1 text-xs text-zinc-500">por mes · {p.note}</p>
              <Link
                href="/register"
                className={`mt-5 min-h-[48px] flex items-center justify-center gap-1.5 rounded-full text-sm font-black ${
                  p.highlight
                    ? "bg-[#D6FF2A] text-black"
                    : "border border-zinc-700 text-white hover:border-zinc-500"
                }`}
              >
                <Check size={16} /> Elegir {p.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="rounded-3xl bg-[#D6FF2A] text-black p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-balance">
            Empezá hoy. Tu yo de mañana te lo agradece.
          </h2>
          <Link
            href="/register"
            className="mt-6 min-h-[52px] inline-flex items-center gap-2 px-8 rounded-full bg-black text-white font-black"
          >
            Crear mi cuenta <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
