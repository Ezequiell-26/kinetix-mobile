import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}","./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { black: "#080808", dark: "#111111", zinc: "#1A1A1A", "zinc-light": "#27272A", accent: "#D6FF2A", "accent-hover": "#E0FF5A", muted: "#A1A1AA" },
        border: "hsl(var(--border))", background: "hsl(var(--background))", foreground: "hsl(var(--foreground))",
      },
      fontFamily: { sans: ["Inter","system-ui","sans-serif"], display: ["Space Grotesk","Inter","sans-serif"] },
      borderRadius: { xl: "16px", "2xl": "20px" },
    },
  },
  plugins: [],
};
export default config;
