/**
 * Componente Selector de Idioma
 * Permite cambiar entre español, inglés y portugués
 */

'use client';

import { useTranslation, Locale } from '@/hooks/use-translation';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LocaleSelectorProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  showLabel?: boolean;
}

const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
};

const localeFlags: Record<Locale, string> = {
  es: '🇪🇸',
  en: '🇬🇧',
  pt: '🇧🇷',
};

export function LocaleSelector({ 
  variant = 'ghost', 
  size = 'default',
  showLabel = false 
}: LocaleSelectorProps) {
  const { t, locale, changeLocale } = useTranslation();

  const handleLocaleChange = (newLocale: Locale) => {
    changeLocale(newLocale);
    
    // Dispatch custom event para otros componentes
    window.dispatchEvent(new CustomEvent('locale-change', { detail: { locale: newLocale } }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Globe className="h-4 w-4" />
          {showLabel && (
            <span className="hidden sm:inline-block">
              {localeNames[locale]}
            </span>
          )}
          <span className="sm:hidden">{localeFlags[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {(['es', 'en', 'pt'] as Locale[]).map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className="gap-2 cursor-pointer"
          >
            <span>{localeFlags[loc]}</span>
            <span>{localeNames[loc]}</span>
            {locale === loc && (
              <span className="ml-auto text-xs text-zinc-400">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Versión simplificada para mobile
export function LocaleSelectorMobile() {
  const { locale, changeLocale } = useTranslation();
  const locales: Locale[] = ['es', 'en', 'pt'];
  const currentIndex = locales.indexOf(locale);

  const nextLocale = () => {
    const nextIndex = (currentIndex + 1) % locales.length;
    changeLocale(locales[nextIndex]);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={nextLocale}
      className="gap-2"
      aria-label="Cambiar idioma"
    >
      <Globe className="h-4 w-4" />
      <span className="text-xs">{localeFlags[locale]}</span>
    </Button>
  );
}
