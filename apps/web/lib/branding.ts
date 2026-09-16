/**
 * BRAND — single source of truth for the KinetixFitt web experience.
 * Keep product identity centralized so web and app stay visually consistent.
 */
export const BRAND = {
  name: 'KinetixFitt',
  shortName: 'KinetixFitt',
  displayName: 'KINETIXFITT',
  tagline: 'TU MEJOR VERSIÓN',
  colors: {
    lime: '#C6F91E',
    limeHover: '#D8FF4A',
    dark: '#081119',
    darkElevated: '#0B151E',
    zinc: '#12212D',
    muted: '#8193A5',
    border: '#1C3142',
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
  bgLime: 'bg-[#C6F91E]',
  textLime: 'text-[#C6F91E]',
  borderLime: 'border-[#C6F91E]',
  bgDark: 'bg-[#081119]',
} as const;
