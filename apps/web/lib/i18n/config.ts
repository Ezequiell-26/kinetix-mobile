export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
};

/**
 * Parse Accept-Language header using quality values.
 * Returns best matching locale or default.
 */
export function getLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const prefs = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, qStr] = part.trim().split(";q=");
      const q = qStr ? parseFloat(qStr) : 1;
      const locale = lang.toLowerCase().slice(0, 2);
      return { locale, q: isNaN(q) ? 0 : q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { locale } of prefs) {
    if ((locales as readonly string[]).includes(locale)) return locale as Locale;
  }
  return defaultLocale;
}

export function isValidLocale(v: string | null | undefined): v is Locale {
  return !!v && (locales as readonly string[]).includes(v);
}
