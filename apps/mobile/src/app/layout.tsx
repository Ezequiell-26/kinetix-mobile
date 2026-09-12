import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";
import { ThemeProvider } from "@/components/theme-provider";
import { MotionProvider } from "@/components/motion-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "EZEQUIEL COACHING — Entrenamiento Personalizado Online",
  description:
    "Programa a medida, seguimiento real y contacto directo con tu coach. Entrenamiento, nutrición y progreso desde tu celular.",
  applicationName: "EZEQUIEL COACHING",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EZEQUIEL COACHING",
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
    title: "EZEQUIEL COACHING — Tu mejor versión, cada día",
    description: "Entrenamiento personalizado online con seguimiento real.",
    type: "website",
    locale: "es_AR",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EZEQUIEL COACHING — Tu mejor versión, cada día",
      },
    ],
  },
};

export const viewport: Viewport = {
  // Coincide con el fondo real (globals.css --background) en cada tema, no con
  // un tercer color que no aparece en ninguna parte de la UI.
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
  // `maximumScale: 1` bloqueaba el zoom por pinza (WCAG 1.4.4, Nivel AA):
  // dejaba sin salida a usuarios con baja visión. Se permite escalar hasta 5x.
  maximumScale: 5,
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
      <body className={`${inter.variable} ${grotesk.variable} min-h-screen bg-[#080808] text-zinc-100 antialiased selection:bg-primary selection:text-black`}>
        {/* storageKey alineado con la clave que lee el script anti-FOUC de
            arriba ('ec-theme'). Antes el provider usaba
            "ezequiel-coaching-theme": se escribía en una clave y se leía de
            otra, así que el tema elegido no sobrevivía al reload. */}
        <ThemeProvider storageKey="ec-theme" defaultTheme="dark">
          {/* Desactiva las animaciones de Framer Motion si el sistema pide
              movimiento reducido (globals.css ya cubría solo las de CSS). */}
          <MotionProvider>
            {children}
            <PwaRegister />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
