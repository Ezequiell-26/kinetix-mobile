import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'KinetixFit - Transforma tu Cuerpo, Domina tu Mente',
    template: '%s | KinetixFit'
  },
  description: 'La plataforma todo-en-uno que combina ciencia del deporte, IA personalizada y comunidad para resultados que duran para siempre.',
  keywords: [
    'fitness', 
    'entrenamiento', 
    'nutrición', 
    'salud', 
    'gimnasio', 
    'workout', 
    'app fitness',
    'IA entrenador',
    'ejercicios en casa',
    'rutinas personalizadas'
  ],
  authors: [{ name: 'KinetixFit Team' }],
  creator: 'KinetixFit',
  publisher: 'KinetixFit Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KinetixFit',
  },
  openGraph: {
    title: 'KinetixFit - Transforma tu Cuerpo, Domina tu Mente',
    description: 'Únete a más de 50,000 atletas que ya están transformando sus vidas.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'KinetixFit',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KinetixFit - Tu Entrenador Inteligente'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KinetixFit',
    description: 'La plataforma definitiva para transformar tu físico y mentalidad.',
    images: ['/twitter-image.png'],
    creator: '@kinetixfit',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

// Security headers
export const revalidate = 3600; // Revalidar cada hora

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        {/* Security Headers via meta tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
        {/* Preconnect a recursos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.kinetixfit.com" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                      console.log('[SW] Registered:', registration.scope);
                    })
                    .catch(error => {
                      console.log('[SW] Registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
