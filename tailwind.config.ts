import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}","./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { black: "#0A0F14", dark: "#0F151B", zinc: "#1A1A1A", "zinc-light": "#27272A", accent: "#34D399", "accent-hover": "#6EE7B7", muted: "#A1A1AA" },
        border: "hsl(var(--border))", background: "hsl(var(--background))", foreground: "hsl(var(--foreground))",
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
      },
      fontFamily: { sans: ["var(--font-inter)","system-ui","sans-serif"], display: ["var(--font-display)","Inter","sans-serif"] },
      borderRadius: { xl: "16px", "2xl": "20px" },
    },
  },
  plugins: [],
};
export default config;
