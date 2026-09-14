/**
 * Sistema de Diseño Unificado - EZEQUIEL COACHING
 * Define variables CSS para temas, espaciado, tipografía, sombras y animaciones.
 */

export const designTokens = {
  colors: {
    background: {
      light: 'hsl(0 0% 100%)',
      dark: 'hsl(222.2 84% 4.9%)',
      card: {
        light: 'hsl(0 0% 100%)',
        dark: 'hsl(222.2 84% 4.9%)',
      },
      popover: {
        light: 'hsl(0 0% 100%)',
        dark: 'hsl(222.2 84% 4.9%)',
      },
      primary: {
        light: 'hsl(222.2 47.4% 11.2%)',
        dark: 'hsl(210 40% 98%)',
      },
      secondary: {
        light: 'hsl(210 40% 96.1%)',
        dark: 'hsl(217.2 32.6% 17.5%)',
      },
      muted: {
        light: 'hsl(210 40% 96.1%)',
        dark: 'hsl(217.2 32.6% 17.5%)',
      },
      accent: {
        light: 'hsl(210 40% 96.1%)',
        dark: 'hsl(217.2 32.6% 17.5%)',
      },
      destructive: {
        light: 'hsl(0 84.2% 60.2%)',
        dark: 'hsl(0 62.8% 30.6%)',
      },
      border: {
        light: 'hsl(214.3 31.8% 91.4%)',
        dark: 'hsl(217.2 32.6% 17.5%)',
      },
      input: {
        light: 'hsl(214.3 31.8% 91.4%)',
        dark: 'hsl(217.2 32.6% 17.5%)',
      },
      ring: {
        light: 'hsl(222.2 84% 4.9%)',
        dark: 'hsl(212.7 26.8% 83.9%)',
      },
      // Brand Colors (Kinetix Fit)
      brand: {
        primary: 'hsl(262 83% 58%)', // Purple vibrante
        secondary: 'hsl(199 89% 48%)', // Cyan eléctrico
        accent: 'hsl(329 82% 56%)', // Rosa neón
        success: 'hsl(142 76% 36%)',
        warning: 'hsl(38 92% 50%)',
        info: 'hsl(204 94% 52%)',
      }
    },
    foreground: {
      light: 'hsl(222.2 84% 4.9%)',
      dark: 'hsl(210 40% 98%)',
      muted: {
        light: 'hsl(215.4 16.3% 46.9%)',
        dark: 'hsl(215 20.2% 65.1%)',
      },
    },
  },
  radius: {
    sm: '0.3rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    glow: '0 0 15px rgba(124, 58, 237, 0.5)', // Glow púrpura
    glowCyan: '0 0 15px rgba(34, 211, 238, 0.5)', // Glow cyan
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      heading: ['Poppins', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    timing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    keyframes: {
      fadeIn: `
        from { opacity: 0; }
        to { opacity: 1; }
      `,
      fadeOut: `
        from { opacity: 1; }
        to { opacity: 0; }
      `,
      slideUp: `
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      `,
      slideDown: `
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      `,
      slideRight: `
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      `,
      scaleIn: `
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      `,
      pulse: `
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      `,
      shimmer: `
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      `,
      float: `
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      `,
      spin: `
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      `,
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
};

// Helper para generar clases CSS dinámicas
export function generateCSSVariables(theme: 'light' | 'dark') {
  const colors = designTokens.colors;
  const isDark = theme === 'dark';
  
  return `
    :root {
      --background: ${colors.background.light};
      --foreground: ${colors.foreground.light};
      --card: ${colors.background.card.light};
      --card-foreground: ${colors.foreground.light};
      --popover: ${colors.background.popover.light};
      --popover-foreground: ${colors.foreground.light};
      --primary: ${colors.background.primary.light};
      --primary-foreground: ${colors.foreground.dark};
      --secondary: ${colors.background.secondary.light};
      --secondary-foreground: ${colors.foreground.light};
      --muted: ${colors.background.muted.light};
      --muted-foreground: ${colors.foreground.muted.light};
      --accent: ${colors.background.accent.light};
      --accent-foreground: ${colors.foreground.light};
      --destructive: ${colors.background.destructive.light};
      --destructive-foreground: ${colors.foreground.light};
      --border: ${colors.background.border.light};
      --input: ${colors.background.input.light};
      --ring: ${colors.background.ring.light};
      
      /* Brand Colors */
      --brand-primary: ${colors.background.brand.primary};
      --brand-secondary: ${colors.background.brand.secondary};
      --brand-accent: ${colors.background.brand.accent};
      --brand-success: ${colors.background.brand.success};
      --brand-warning: ${colors.background.brand.warning};
      --brand-info: ${colors.background.brand.info};
      
      /* Radius */
      --radius-sm: ${designTokens.radius.sm};
      --radius-md: ${designTokens.radius.md};
      --radius-lg: ${designTokens.radius.lg};
      --radius-xl: ${designTokens.radius.xl};
      --radius-full: ${designTokens.radius.full};
      
      /* Shadows */
      --shadow-sm: ${designTokens.shadows.sm};
      --shadow-md: ${designTokens.shadows.md};
      --shadow-lg: ${designTokens.shadows.lg};
      --shadow-xl: ${designTokens.shadows.xl};
      --shadow-inner: ${designTokens.shadows.inner};
      --shadow-glow: ${designTokens.shadows.glow};
      --shadow-glow-cyan: ${designTokens.shadows.glowCyan};
      
      /* Spacing */
      --space-xs: ${designTokens.spacing.xs};
      --space-sm: ${designTokens.spacing.sm};
      --space-md: ${designTokens.spacing.md};
      --space-lg: ${designTokens.spacing.lg};
      --space-xl: ${designTokens.spacing.xl};
      --space-2xl: ${designTokens.spacing['2xl']};
      --space-3xl: ${designTokens.spacing['3xl']};
      
      /* Typography */
      --font-sans: ${designTokens.typography.fontFamily.sans.join(', ')};
      --font-heading: ${designTokens.typography.fontFamily.heading.join(', ')};
      --font-mono: ${designTokens.typography.fontFamily.mono.join(', ')};
      
      /* Animation */
      --duration-fast: ${designTokens.animation.duration.fast};
      --duration-normal: ${designTokens.animation.duration.normal};
      --duration-slow: ${designTokens.animation.duration.slow};
      --ease: ${designTokens.animation.timing.ease};
      --ease-in: ${designTokens.animation.timing.easeIn};
      --ease-out: ${designTokens.animation.timing.easeOut};
      --ease-bounce: ${designTokens.animation.timing.bounce};
      
      /* Z-Index */
      --z-hide: ${designTokens.zIndex.hide};
      --z-base: ${designTokens.zIndex.base};
      --z-docked: ${designTokens.zIndex.docked};
      --z-dropdown: ${designTokens.zIndex.dropdown};
      --z-sticky: ${designTokens.zIndex.sticky};
      --z-banner: ${designTokens.zIndex.banner};
      --z-overlay: ${designTokens.zIndex.overlay};
      --z-modal: ${designTokens.zIndex.modal};
      --z-popover: ${designTokens.zIndex.popover};
      --z-toast: ${designTokens.zIndex.toast};
      --z-tooltip: ${designTokens.zIndex.tooltip};
    }
    
    .dark {
      --background: ${colors.background.dark};
      --foreground: ${colors.foreground.dark};
      --card: ${colors.background.card.dark};
      --card-foreground: ${colors.foreground.dark};
      --popover: ${colors.background.popover.dark};
      --popover-foreground: ${colors.foreground.dark};
      --primary: ${colors.background.primary.dark};
      --primary-foreground: ${colors.foreground.light};
      --secondary: ${colors.background.secondary.dark};
      --secondary-foreground: ${colors.foreground.dark};
      --muted: ${colors.background.muted.dark};
      --muted-foreground: ${colors.foreground.muted.dark};
      --accent: ${colors.background.accent.dark};
      --accent-foreground: ${colors.foreground.dark};
      --destructive: ${colors.background.destructive.dark};
      --destructive-foreground: ${colors.foreground.dark};
      --border: ${colors.background.border.dark};
      --input: ${colors.background.input.dark};
      --ring: ${colors.background.ring.dark};
    }
    
    /* Keyframes Globales */
    @keyframes fadeIn { ${designTokens.animation.keyframes.fadeIn} }
    @keyframes fadeOut { ${designTokens.animation.keyframes.fadeOut} }
    @keyframes slideUp { ${designTokens.animation.keyframes.slideUp} }
    @keyframes slideDown { ${designTokens.animation.keyframes.slideDown} }
    @keyframes slideRight { ${designTokens.animation.keyframes.slideRight} }
    @keyframes scaleIn { ${designTokens.animation.keyframes.scaleIn} }
    @keyframes pulse { ${designTokens.animation.keyframes.pulse} }
    @keyframes shimmer { ${designTokens.animation.keyframes.shimmer} }
    @keyframes float { ${designTokens.animation.keyframes.float} }
    @keyframes spin { ${designTokens.animation.keyframes.spin} }
    
    /* Clases de Utilidad para Animaciones */
    .animate-fade-in { animation: fadeIn var(--duration-normal) var(--ease); }
    .animate-fade-out { animation: fadeOut var(--duration-normal) var(--ease); }
    .animate-slide-up { animation: slideUp var(--duration-normal) var(--ease-out); }
    .animate-slide-down { animation: slideDown var(--duration-normal) var(--ease-out); }
    .animate-slide-right { animation: slideRight var(--duration-normal) var(--ease-out); }
    .animate-scale-in { animation: scaleIn var(--duration-normal) var(--ease-bounce); }
    .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    .animate-shimmer { animation: shimmer 2s linear infinite; }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-spin { animation: spin 1s linear infinite; }
    
    /* Background Shimmer para Skeleton */
    .bg-shimmer {
      background: linear-gradient(
        90deg,
        var(--muted) 0%,
        var(--muted-foreground) 50%,
        var(--muted) 100%
      );
      background-size: 1000px 100%;
    }
    
    /* Glassmorphism */
    .glass {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .glass-dark {
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    /* Gradient Text */
    .text-gradient {
      background: linear-gradient(to right, var(--brand-primary), var(--brand-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .text-gradient-accent {
      background: linear-gradient(to right, var(--brand-secondary), var(--brand-accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    /* Gradient Background */
    .bg-gradient-brand {
      background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
    }
    
    .bg-gradient-accent {
      background: linear-gradient(135deg, var(--brand-secondary), var(--brand-accent));
    }
    
    /* Focus Visible Accessible */
    .focus-visible-ring:focus-visible {
      outline: 2px solid var(--ring);
      outline-offset: 2px;
      box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.2);
    }
    
    /* Scrollbar Personalizado */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: var(--muted);
      border-radius: var(--radius-full);
    }
    
    ::-webkit-scrollbar-thumb {
      background: var(--muted-foreground);
      border-radius: var(--radius-full);
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: var(--foreground);
    }
  `;
}

export default designTokens;
