import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-900">
      <div className="mx-auto max-w-5xl px-4 py-8 flex flex-col sm:flex-row gap-3 items-center justify-between text-sm text-zinc-500">
        <Link
          href="/"
          className="font-black text-white min-h-[44px] inline-flex items-center"
        >
          EZEQUIEL<span className="text-[#D6FF2A]">COACHING</span>
        </Link>
        <nav className="flex flex-wrap justify-center gap-x-4">
          <Link
            href="/funciones"
            className="hover:text-white min-h-[44px] inline-flex items-center"
          >
            Funciones
          </Link>
          <Link
            href="/planes"
            className="hover:text-white min-h-[44px] inline-flex items-center"
          >
            Planes
          </Link>
          <Link
            href="/descargar"
            className="hover:text-white min-h-[44px] inline-flex items-center"
          >
            Descargar
          </Link>
          <Link
            href="/login"
            className="hover:text-white min-h-[44px] inline-flex items-center"
          >
            Ingresar
          </Link>
          <Link
            href="/register"
            className="hover:text-white min-h-[44px] inline-flex items-center"
          >
            Crear cuenta
          </Link>
        </nav>
        <span>© 2026 · Tu mejor versión, cada día</span>
      </div>
    </footer>
  );
}
