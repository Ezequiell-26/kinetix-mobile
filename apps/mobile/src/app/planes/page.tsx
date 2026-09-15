import Link from "next/link";
import type { Metadata } from "next";
import { Check, ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/landing/site-nav";
import { BRAND } from "@/constants/branding";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: `Planes — ${BRAND.name}`,
  description:
    "Planes mensuales en pesos argentinos, sin permanencia. Elegí el tuyo y empezá hoy.",
};

const plans = [
  {
    name: "Básico",
    price: 12000,
    items: ["Programa de entrenamiento", "Biblioteca de ejercicios", "Registro de progreso"],
  },
  {
    name: "Personalizado",
    price: 18000,
    highlight: true,
    items: [
      "Todo lo del Básico",
      "Plan 100% a tu medida",
      "Check-ins semanales",
      "Mensajes con tu coach",
    ],
  },
  {
    name: "Premium",
    price: 25000,
    items: [
      "Todo lo del Personalizado",
      "Seguimiento prioritario",
      "Ajustes semanales del plan",
      "Plan nutricional guiado",
    ],
  },
];

const faqs = [
  {
    q: "¿Hay permanencia mínima?",
    a: "No. Los planes son mensuales y podés cambiar o dar de baja cuando quieras.",
  },
  {
    q: "¿Cómo pago?",
    a: `Coordinás el pago con ${BRAND.name} al registrarte. Aceptamos Mercado Pago.`,
  },
  {
    q: "¿Necesito ir a un gimnasio?",
    a: "No necesariamente. Tu programa se adapta a casa o gimnasio según lo que tengas.",
  },
  {
    q: "¿La app funciona en mi celular?",
    a: "Sí: se instala como app desde el navegador, en Android y iPhone, y tu cuenta es la misma en todos lados.",
  },
];

export default function PlanesPage() {
  return (
    <div className="min-h-dvh text-white" style={{ backgroundColor: BRAND.colors.dark }}>
      <SiteNav />
      <main className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-center">
          Planes <span style={{ color: BRAND.colors.lime }}>mensuales</span>
        </h1>
        <p className="mt-4 text-center text-sm text-zinc-500">
          Precios en pesos argentinos. Sin permanencia.
        </p>
        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {plans.map((p) => (
            <article
              key={p.name}
              className={`rounded-2xl border p-6 ${p.highlight ? "bg-primary/5" : "border-zinc-800 bg-zinc-950"}`} style={p.highlight ? { borderColor: BRAND.colors.lime, backgroundColor: `${BRAND.colors.lime}0D` } : undefined}
            >
              <h2 className="font-black text-lg">{p.name}</h2>
              <p className="mt-2 text-3xl font-black">${p.price.toLocaleString("es-AR")}</p>
              <p className="text-xs text-zinc-500">por mes</p>
              <ul className="mt-5 space-y-2.5 text-sm text-zinc-300">
                {p.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <Check size={16} style={{ color: BRAND.colors.lime }} className="shrink-0 mt-0.5" />
                    {it}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-6 min-h-[48px] flex items-center justify-center rounded-full text-sm font-black ${p.highlight ? "text-black" : "border border-zinc-700 hover:border-zinc-500"}`} style={p.highlight ? { backgroundColor: BRAND.colors.lime } : undefined}
              >
                Elegir {p.name}
              </Link>
            </article>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-black text-center">
          Preguntas frecuentes
        </h2>
        <div className="mt-6 max-w-2xl mx-auto space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
            >
              <summary className="font-bold cursor-pointer min-h-[24px]">
                {f.q}
              </summary>
              <p className="mt-2 text-sm text-zinc-400">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/register"
            className="min-h-[52px] inline-flex items-center gap-2 px-8 rounded-full text-black font-black" style={{ backgroundColor: BRAND.colors.lime }}
          >
            Empezar ahora <ArrowRight size={18} />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
