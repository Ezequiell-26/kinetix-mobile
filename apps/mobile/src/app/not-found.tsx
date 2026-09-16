import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import { BRAND } from "@/constants/branding";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#080D11] px-6 py-10 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(52,211,153,0.08),transparent_38%)]" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[70vh] w-full max-w-xl items-center justify-center">
        <section className="w-full rounded-3xl border border-zinc-800 bg-zinc-950/85 p-7 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <SearchX size={25} aria-hidden="true" />
          </div>
          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">{BRAND.name}</p>
          <p className="mt-2 font-display text-5xl font-black tracking-[-0.04em] text-zinc-800" aria-hidden="true">404</p>
          <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-white">Página no encontrada</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">
            El enlace puede estar desactualizado o la página ya no existe.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-black transition hover:brightness-105 focus-visible:outline-primary"
          >
            <Home size={16} aria-hidden="true" />
            Volver al inicio
          </Link>
        </section>
      </div>
    </main>
  );
}
