/**
 * Componente LocaleSelector mejorado con animaciones y accesibilidad
 */

'use client';

import { useTranslation, type Locale } from '@/hooks/use-translation';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocaleSelectorProps {
  className?: string;
  variant?: 'button' | 'dropdown' | 'inline';
  showFlags?: boolean;
  showLabels?: boolean;
}

const locales: { value: Locale; label: string; flag: string; nativeName: string }[] = [
  { value: 'es', label: 'Español', flag: '🇪🇸', nativeName: 'Español' },
  { value: 'en', label: 'English', flag: '🇬🇧', nativeName: 'English' },
  { value: 'pt', label: 'Português', flag: '🇧🇷', nativeName: 'Português' },
];

export function LocaleSelector({ 
  className, 
  variant = 'button',
  showFlags = true,
  showLabels = true,
}: LocaleSelectorProps) {
  const { locale, changeLocale } = useTranslation();

  // Variante botón compacto
  if (variant === 'button') {
    return (
      <div className={cn('relative inline-block', className)}>
        <details className="group">
          <summary
            className="list-none min-h-[44px] px-3 inline-flex items-center gap-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
            aria-label="Cambiar idioma"
          >
            <Globe size={18} className="text-zinc-400" aria-hidden="true" />
            {showFlags && (
              <span className="text-base">{locales.find(l => l.value === locale)?.flag}</span>
            )}
            {showLabels && (
              <span className="text-sm font-medium text-zinc-300">
                {locales.find(l => l.value === locale)?.nativeName}
              </span>
            )}
            <span className="transition-transform group-open:rotate-180">▾</span>
          </summary>
          <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl border border-zinc-800 bg-[#101010] p-2 shadow-2xl">
            {locales.map((loc) => (
              <button
                key={loc.value}
                onClick={() => changeLocale(loc.value)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all',
                  locale === loc.value
                    ? 'bg-[#34D399]/10 text-[#34D399]'
                    : 'text-zinc-300 hover:bg-zinc-800'
                )}
                aria-pressed={locale === loc.value}
                lang={loc.value}
              >
                {showFlags && <span className="text-xl">{loc.flag}</span>}
                <div className="flex-1">
                  <div className="text-sm font-medium">{loc.nativeName}</div>
                  {loc.label !== loc.nativeName && (
                    <div className="text-xs text-zinc-500">{loc.label}</div>
                  )}
                </div>
                {locale === loc.value && (
                  <span className="text-[#34D399]" aria-hidden="true">✓</span>
                )}
              </button>
            ))}
          </div>
        </details>
      </div>
    );
  }

  // Variante inline (horizontal)
  if (variant === 'inline') {
    return (
      <div className={cn('flex gap-1.5', className)}>
        {locales.map((loc) => (
          <button
            key={loc.value}
            onClick={() => changeLocale(loc.value)}
            className={cn(
              'min-h-[40px] px-3 rounded-lg text-sm font-medium transition-all border',
              locale === loc.value
                ? 'bg-[#34D399] text-black border-[#34D399]'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white hover:border-zinc-500'
            )}
            aria-pressed={locale === loc.value}
            aria-label={`Cambiar a ${loc.label}`}
            lang={loc.value}
          >
            {showFlags && <span className="mr-1.5">{loc.flag}</span>}
            {showLabels ? loc.nativeName : loc.flag}
          </button>
        ))}
      </div>
    );
  }

  // Variante dropdown nativo
  return (
    <div className={cn('inline-block', className)}>
      <label htmlFor="locale-select" className="sr-only">
        Seleccionar idioma
      </label>
      <select
        id="locale-select"
        value={locale}
        onChange={(e) => changeLocale(e.target.value as Locale)}
        className="min-h-[44px] px-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#34D399] cursor-pointer"
        aria-label="Cambiar idioma"
      >
        {locales.map((loc) => (
          <option key={loc.value} value={loc.value} lang={loc.value}>
            {showFlags ? `${loc.flag} ` : ''}{loc.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LocaleSelector;
