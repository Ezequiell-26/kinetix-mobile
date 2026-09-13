/**
 * Hook personalizado para usar el sistema de internacionalización
 * Soporta cambio dinámico de idioma y persistencia en localStorage
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTranslation, interpolate, Locale, defaultLocale, Translation } from '@/lib/i18n';

// Clave para localStorage
const LOCALE_STORAGE_KEY = 'ezecoech_locale';

// Hook principal de traducción
export function useTranslation(initialLocale: Locale = defaultLocale) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [translations, setTranslations] = useState<Translation>(() => getTranslation(initialLocale));
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar idioma guardado al montar
  useEffect(() => {
    const savedLocale = typeof window !== 'undefined' 
      ? (localStorage.getItem(LOCALE_STORAGE_KEY) as Locale) 
      : null;
    
    if (savedLocale && ['es', 'en', 'pt'].includes(savedLocale)) {
      setLocale(savedLocale);
      setTranslations(getTranslation(savedLocale));
    }
    setIsLoaded(true);
  }, []);

  // Función para cambiar idioma
  const changeLocale = useCallback((newLocale: Locale) => {
    if (!['es', 'en', 'pt'].includes(newLocale)) return;
    
    setLocale(newLocale);
    setTranslations(getTranslation(newLocale));
    
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      
      // Actualizar atributo lang del HTML
      document.documentElement.lang = newLocale;
      
      // Actualizar dirección del texto para árabe/hebreo si se agrega
      if (['ar', 'he'].includes(newLocale)) {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    }
  }, []);

  // Función t() para obtener traducciones con interpolación opcional
  const t = useCallback(<T extends keyof Translation>(
    key: T,
    params?: Record<string, string | number>
  ): Translation[T] | string => {
    const keys = (key as string).split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback a inglés si no encuentra la clave
        console.warn(`Translation key not found: ${key}`);
        return key as string;
      }
    }
    
    // Si es string y hay params, interpolar
    if (typeof value === 'string' && params) {
      return interpolate(value, params);
    }
    
    return value;
  }, [translations]);

  // Función para obtener traducción directa sin interpolación
  const raw = useCallback(<T extends keyof Translation>(key: T): Translation[T] => {
    const keys = (key as string).split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key as any;
      }
    }
    
    return value;
  }, [translations]);

  return {
    t,
    raw,
    locale,
    changeLocale,
    isLoaded,
  };
}

// Hook para obtener solo el idioma actual
export function useLocale() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const savedLocale = typeof window !== 'undefined' 
      ? (localStorage.getItem(LOCALE_STORAGE_KEY) as Locale) 
      : null;
    
    if (savedLocale && ['es', 'en', 'pt'].includes(savedLocale)) {
      setLocale(savedLocale);
    }
  }, []);

  return locale;
}

// Hook para verificar si un idioma está disponible
export function useAvailableLocales() {
  return ['es', 'en', 'pt'] as const;
}

// Componente helper para cambiar idioma
export function LocaleProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale?: Locale }) {
  const { isLoaded } = useTranslation(initialLocale);
  
  if (!isLoaded) {
    return null; // O mostrar skeleton
  }
  
  return <>{children}</>;
}
