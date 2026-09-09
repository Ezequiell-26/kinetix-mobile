import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "EZEQUIEL COACHING \u2014 Entrenamiento Personalizado Online",
  description: "Plataforma premium de coaching online. Entrenamiento personalizado, seguimiento y progreso.",
  applicationName: "EZEQUIEL COACHING",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EZEQUIEL",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "EZEQUIEL COACHING",
    description: "Entrenamiento personalizado online \u2014 premium, simple, efectivo.",
    type: "website",
    locale: "es_AR",
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script dangerouslySetInnerHTML={{__html: `(function(){try{var t=localStorage.getItem('ec-theme')||'dark';document.documentElement.classList.add(t);document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`}} />
      </head>
      <body className="min-h-screen bg-[#080808] text-zinc-100 antialiased selection:bg-[#D6FF2A] selection:text-black">
        <ThemeProvider>
          {children}
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
