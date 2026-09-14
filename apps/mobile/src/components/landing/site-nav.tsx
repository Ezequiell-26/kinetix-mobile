'use client';

import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

const links = [
  { href: "/funciones", labelKey: "nav.features" as const },
  { href: "/planes", labelKey: "nav.plans" as const },
  { href: "/descargar", labelKey: "nav.download" as const },
];

export function SiteNav() {
  const { t, locale, changeLocale } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900 bg-[#080808]/90 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-black tracking-tight text-lg min-h-[44px] inline-flex items-center"
          aria-label={t('common.brandName')}
        >
          EZEQUIEL<span className="text-[#34D399]">COACHING</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hidden sm:inline text-sm text-zinc-400 hover:text-white px-3 min-h-[44px] inline-flex items-center"
            >
              {t(l.labelKey)}
            </Link>
          ))}
          {/* Menú móvil sin JS (details/summary): los links estaban hidden en móvil */}
          <details className="sm:hidden relative">
            <summary className="min-h-[44px] inline-flex items-center px-3 text-sm text-zinc-300 cursor-pointer list-none">
              {t('nav.menu')} ▾
            </summary>
            <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-zinc-800 bg-[#101010] p-2 shadow-xl">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block rounded-lg px-3 py-3 text-sm text-zinc-200 hover:bg-zinc-800 min-h-[44px]"
                >
                  {t(l.labelKey)}
                </Link>
              ))}
            </div>
          </details>
          <Link
            href="/login"
            className="min-h-[44px] inline-flex items-center px-5 rounded-full bg-[#34D399] text-black text-sm font-black"
          >
            {t('auth.login.button')}
          </Link>
        </nav>
      </div>
    </header>
  );
}
