/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          lime: "#D6FF2A",
          limeHover: "#E0FF5A",
          black: "#09090B",
          dark: "#101012",
          zinc: "#1A1A1E",
          muted: "#A1A1AA",
        },
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Inter", "sans-serif"],
      },
      borderRadius: { xl: "16px", "2xl": "20px", "3xl": "24px" },
    },
  },
  plugins: [],
};
