import Link from "next/link";
import type { Metadata } from "next";
import { Smartphone, MonitorDown, KeyRound, ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/landing/site-nav";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Descargar la app — EZEQUIEL COACHING",
  description:
    "Instalá EZEQUIEL COACHING en tu celular o compu. Una sola cuenta en todos lados.",
};

export default function DescargarPage() {
  return (
    <div className="min-h-dvh bg-[#080808] text-white">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-center text-balance">
          Llevá tu entreno <span className="text-[#D6FF2A]">a todos lados</span>
        </h1>
        <p className="mt-4 text-center text-zinc-400 max-w-xl mx-auto">
          Sin tiendas ni vueltas: se instala directo y tu cuenta es la misma en
          la web, el celular y la compu.
        </p>

        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col">
            <Smartphone size={26} className="text-[#D6FF2A]" />
            <h2 className="mt-4 text-xl font-black">En tu celular</h2>
            <p className="mt-2 text-sm text-zinc-400 flex-1">
              Android y iPhone: abrís la web, la agregás a la pantalla de inicio
              y queda como app, con ícono propio y pantalla completa.
            </p>
            <Link
              href="/install"
              className="mt-5 min-h-[48px] inline-flex items-center justify-center rounded-full bg-[#D6FF2A] text-black text-sm font-black"
            >
              Instalar ahora
            </Link>
          </article>

          <article className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col">
            <MonitorDown size={26} className="text-[#D6FF2A]" />
            <h2 className="mt-4 text-xl font-black">En tu compu</h2>
            <p className="mt-2 text-sm text-zinc-400 flex-1">
              Windows, Mac y Linux: funciona directo en el navegador o instalada
              como app de escritorio. Ideal para ver tu progreso en grande.
            </p>
            <Link
              href="/install"
              className="mt-5 min-h-[48px] inline-flex items-center justify-center rounded-full border border-zinc-700 text-sm font-black hover:border-[#D6FF2A]"
            >
              Cómo instalarla
            </Link>
          </article>

          <article className="rounded-2xl border border-[#D6FF2A] bg-[#D6FF2A]/5 p-6 flex flex-col">
            <KeyRound size={26} className="text-[#D6FF2A]" />
            <h2 className="mt-4 text-xl font-black">Una sola cuenta</h2>
            <p className="mt-2 text-sm text-zinc-400 flex-1">
              Iniciás sesión una vez y todo te sigue: entrenos, medidas, fotos
              y mensajes sincronizados entre web y app.
            </p>
            <Link
              href="/register"
              className="mt-5 min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full bg-[#D6FF2A] text-black text-sm font-black"
            >
              Crear mi cuenta <ArrowRight size={16} />
            </Link>
          </article>
        </div>

        <ol className="mt-12 max-w-2xl mx-auto space-y-3">
          {[
            ["1", "Creá tu cuenta gratis desde acá o desde el celular."],
            ["2", "Instalá la app con el botón de arriba."],
            ["3", "Iniciá sesión: todo tu progreso ya está ahí."],
          ].map(([n, t]) => (
            <li
              key={n}
              className="flex gap-4 items-start rounded-2xl border border-zinc-800 p-4"
            >
              <span className="inline-flex w-8 h-8 shrink-0 items-center justify-center rounded-full bg-[#D6FF2A] text-black font-black">
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
