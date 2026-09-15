/**
 * BRAND — single source of truth KinetixFitt (web)
 * Usar siempre: import { BRAND } from "@/lib/branding" o "../lib/branding"
 * No hardcodear #D6FF2A / #09090B / nombres sueltos
 */
export const BRAND = {
  name: 'KinetixFitt',
  shortName: 'KinetixFitt',
  displayName: 'KINETIXFITT',
  tagline: 'Transforma tu Cuerpo, Domina tu Mente',
  colors: {
    lime: '#D6FF2A',
    limeHover: '#E0FF5A',
    dark: '#09090B',
    darkElevated: '#101012',
    zinc: '#1A1A1E',
    muted: '#A1A1AA',
  },
  app: {
    id: 'com.kinetixfitt.app',
    url: 'https://kinetixfitt.com',
    appUrl: 'https://app.kinetixfitt.com',
  },
  support: {
    email: 'hola@kinetixfitt.com',
  },
} as const;

export const BRAND_TOKENS = {
  bgLime: 'bg-[#D6FF2A]',
  textLime: 'text-[#D6FF2A]',
  borderLime: 'border-[#D6FF2A]',
  bgDark: 'bg-[#09090B]',
} as const;
