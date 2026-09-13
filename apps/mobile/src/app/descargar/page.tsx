import Link from "next/link";
import type { Metadata } from "next";
import {
  Smartphone,
  MonitorDown,
  Apple,
  Bot,
  KeyRound,
  ArrowRight,
  Download,
} from "lucide-react";
import { SiteNav } from "@/components/landing/site-nav";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Descargar la app — EZEQUIEL COACHING",
  description:
    "Instalá EZEQUIEL COACHING en tu celular o compu. Una sola cuenta en todos lados.",
};

// Se actualizan solos con cada Release (workflow Native).
// NOTA: hasta que el primer Native verde publique artefactos, los botones
// llevan a la página de releases (los /latest/download darían 404).
const GH = "https://github.com/Ezequiell-26/kinetix-mobile/releases";
const FILES = {
  win: GH,
  apk: GH,
  dmg: GH,
};

const cards = [
  {
    icon: MonitorDown,
    title: "Windows",
    desc: "Instalador .exe. Tu cuenta y tu progreso, en el escritorio.",
    href: FILES.win,
    cta: "Descargar .exe",
    primary: true,
  },
  {
    icon: Bot,
    title: "Android",
    desc: "APK directo, sin Play Store. Aceptá 'orígenes desconocidos' al instalar.",
    href: FILES.apk,
    cta: "Descargar .apk",
    primary: true,
  },
  {
    icon: Apple,
    title: "Mac",
    desc: ".dmg sin firmar: al abrir por primera vez, click derecho → Abrir.",
    href: FILES.dmg,
    cta: "Descargar .dmg",
    primary: false,
  },
  {
    icon: Smartphone,
    title: "iPhone y resto",
    desc: "La app web instalada (PWA): ícono propio y pantalla completa, sin App Store.",
    href: "/install",
    cta: "Cómo instalarla",
    primary: false,
  },
];

export default function DescargarPage() {
  return (
    <div className="min-h-dvh bg-[#080808] text-white">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-center text-balance">
          Llevá tu entreno <span className="text-[#34D399]">a todos lados</span>
        </h1>
        <p className="mt-4 text-center text-zinc-400 max-w-xl mx-auto">
          Una sola cuenta en la web, el celular y la compu. Todo sincronizado.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {cards.map((c) => (
            <article
              key={c.title}
              className={`rounded-2xl border p-6 flex flex-col ${
                c.primary
                  ? "border-[#34D399] bg-[#34D399]/5"
                  : "border-zinc-800 bg-zinc-950"
              }`}
            >
              <c.icon size={26} className="text-[#34D399]" />
              <h2 className="mt-4 text-xl font-black">{c.title}</h2>
              <p className="mt-2 text-sm text-zinc-400 flex-1">{c.desc}</p>
              <a
                href={c.href}
                className={`mt-5 min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full text-sm font-black ${
                  c.primary
                    ? "bg-[#34D399] text-black"
                    : "border border-zinc-700 hover:border-[#34D399]"
                }`}
              >
                <Download size={16} /> {c.cta}
              </a>
            </article>
          ))}
        </div>

        <article className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <KeyRound size={26} className="text-[#34D399] shrink-0" />
          <p className="text-sm text-zinc-400 flex-1">
            Iniciás sesión una vez y todo te sigue: entrenos, medidas, fotos y
            mensajes sincronizados entre web y app.
          </p>
          <Link
            href="/register"
            className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full bg-[#34D399] text-black text-sm font-black px-6"
          >
            Crear mi cuenta <ArrowRight size={16} />
          </Link>
        </article>

        <ol className="mt-12 max-w-2xl mx-auto space-y-3">
          {[
            ["1", "Creá tu cuenta gratis desde acá o desde el celular."],
            ["2", "Descargá la versión de tu dispositivo."],
            ["3", "Iniciá sesión: todo tu progreso ya está ahí."],
          ].map(([n, t]) => (
            <li
              key={n}
              className="flex gap-4 items-start rounded-2xl border border-zinc-800 p-4"
            >
              <span className="inline-flex w-8 h-8 shrink-0 items-center justify-center rounded-full bg-[#34D399] text-black font-black">
                {n}
              </span>
              <p className="text-sm text-zinc-300 pt-1.5">{t}</p>
            </li>
          ))}
        </ol>
      </main>
      <SiteFooter />
    </div>
  );
}
