import type { Config } from "tailwindcss";

const config: Config = {
  // Optimización: solo escanear archivos necesarios
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  // Optimización: prevenir re-escritura de archivos sin cambios
  future: {
    hoverOnlyWhenSupported: true,
  },
  
  theme: {
    extend: {
      colors: {
        brand: { 
          black: "#0A0F14", 
          dark: "#0F151B", 
          zinc: "#1A1A1A", 
          "zinc-light": "#27272A", 
          accent: "#34D399", 
          "accent-hover": "#6EE7B7", 
          muted: "#A1A1AA" 
        },
        border: "hsl(var(--border))", 
        background: "hsl(var(--background))", 
        foreground: "hsl(var(--foreground))",
        // ===== Tokens semánticos FitSync (valores canal-RGB en globals.css; alpha soportado) =====
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-hover": "rgb(var(--primary-hover) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-elevated": "rgb(var(--surface-elevated) / <alpha-value>)",
        subtle: "rgb(var(--subtle) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",
        ai: "rgb(var(--ai) / <alpha-value>)",
        premium: "rgb(var(--premium) / <alpha-value>)",
        // Tokens que faltaban: text-muted-foreground y bg-muted se usaban 17+
        // veces en el codigo pero no estaban definidos, asi que Tailwind no
        // generaba la clase y el texto caia al color heredado (blanco sobre
        // blanco en modo claro). OJO: `brand.muted` es otra cosa (text-brand-muted).
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
      },
      fontFamily: { 
        sans: ["var(--font-inter)","system-ui","sans-serif"], 
        display: ["var(--font-display)","Inter","sans-serif"] 
      },
      borderRadius: { xl: "16px", "2xl": "20px" },
      // Optimización: reducir breakpoints innecesarios
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
  // Optimización: deshabilitar purging en desarrollo para velocidad
  safelist: process.env.NODE_ENV === 'development' ? [] : [],
};

export default config;
