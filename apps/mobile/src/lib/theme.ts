/**
 * Sistema de Temas Completo para KINETIXFITT
 * Soporte para modo claro, oscuro y automático
 * Con persistencia en localStorage y detección del sistema
 */

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  name: string;
  label: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
  };
}

export const themes: Record<'light' | 'dark', ThemeConfig> = {
  light: {
    name: 'light',
    label: 'Claro',
    colors: {
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      card: 'hsl(0 0% 100%)',
      cardForeground: 'hsl(222.2 84% 4.9%)',
      popover: 'hsl(0 0% 100%)',
      popoverForeground: 'hsl(222.2 84% 4.9%)',
      primary: 'hsl(262 83% 58%)',
      primaryForeground: 'hsl(0 0% 98%)',
      secondary: 'hsl(210 40% 96.1%)',
      secondaryForeground: 'hsl(222.2 47.4% 11.2%)',
      muted: 'hsl(210 40% 96.1%)',
      mutedForeground: 'hsl(215.4 16.3% 46.9%)',
      accent: 'hsl(210 40% 96.1%)',
      accentForeground: 'hsl(222.2 47.4% 11.2%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      destructiveForeground: 'hsl(210 40% 98%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      input: 'hsl(214.3 31.8% 91.4%)',
      ring: 'hsl(262 83% 58%)',
      chart1: 'hsl(262 83% 58%)',
      chart2: 'hsl(173 80% 40%)',
      chart3: 'hsl(38 92% 50%)',
      chart4: 'hsl(280 65% 60%)',
      chart5: 'hsl(340 75% 55%)',
    },
  },
  dark: {
    name: 'dark',
    label: 'Oscuro',
    colors: {
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)',
      card: 'hsl(222.2 84% 4.9%)',
      cardForeground: 'hsl(210 40% 98%)',
      popover: 'hsl(222.2 84% 4.9%)',
      popoverForeground: 'hsl(210 40% 98%)',
      primary: 'hsl(262 83% 58%)',
      primaryForeground: 'hsl(0 0% 98%)',
      secondary: 'hsl(217.2 32.6% 17.5%)',
      secondaryForeground: 'hsl(210 40% 98%)',
      muted: 'hsl(217.2 32.6% 17.5%)',
      mutedForeground: 'hsl(215 20.2% 65.1%)',
      accent: 'hsl(217.2 32.6% 17.5%)',
      accentForeground: 'hsl(210 40% 98%)',
      destructive: 'hsl(0 62.8% 30.6%)',
      destructiveForeground: 'hsl(210 40% 98%)',
      border: 'hsl(217.2 32.6% 17.5%)',
      input: 'hsl(217.2 32.6% 17.5%)',
      ring: 'hsl(262 83% 58%)',
      chart1: 'hsl(262 83% 58%)',
      chart2: 'hsl(173 80% 40%)',
      chart3: 'hsl(38 92% 50%)',
      chart4: 'hsl(280 65% 60%)',
      chart5: 'hsl(340 75% 55%)',
    },
  },
};

export function getTheme(theme: Theme): ThemeConfig {
  if (theme === 'system') {
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return themes[isDark ? 'dark' : 'light'];
    }
    return themes.light;
  }
  return themes[theme];
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  
  const themeConfig = getTheme(theme);
  const root = document.documentElement;
  
  Object.entries(themeConfig.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
  
  // Agregar clase para estilos condicionales
  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function initTheme() {
  if (typeof window === 'undefined') return;
  
  const saved = localStorage.getItem('theme') as Theme | null;
  const theme = saved || 'system';
  applyTheme(theme);
  
  // Escuchar cambios del sistema
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = () => {
    if (localStorage.getItem('theme') === 'system') {
      applyTheme('system');
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}

export function setTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', theme);
  applyTheme(theme);
}

export function toggleTheme() {
  if (typeof window === 'undefined') return;
  const current = localStorage.getItem('theme') as Theme || 'system';
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
}
