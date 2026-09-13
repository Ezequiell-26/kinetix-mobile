import Link from "next/link";

const links = [
  { href: "/funciones", label: "Funciones" },
  { href: "/planes", label: "Planes" },
  { href: "/descargar", label: "Descargar" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900 bg-[#080808]/90 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-black tracking-tight text-lg min-h-[44px] inline-flex items-center"
        >
          EZEQUIEL<span className="text-[#D6FF2A]">COACHING</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hidden sm:inline text-sm text-zinc-400 hover:text-white px-3 min-h-[44px] inline-flex items-center"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="min-h-[44px] inline-flex items-center px-5 rounded-full bg-[#D6FF2A] text-black text-sm font-black"
          >
            Ingresar
          </Link>
        </nav>
      </div>
    </header>
  );
}
