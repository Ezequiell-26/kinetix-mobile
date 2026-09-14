import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PostHogProvider } from '../components/posthog-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://kinetixfitt.com'),
  title: {
    default: 'KinetixFitt - Transforma tu Cuerpo, Domina tu Mente',
    template: '%s | KinetixFitt'
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
    'rutinas personalizadas',
    'KinetixFitt'
  ],
  authors: [{ name: 'KinetixFitt Team', url: 'https://kinetixfitt.com' }],
  creator: 'KinetixFitt',
  publisher: 'KinetixFitt Inc.',
  applicationName: 'KinetixFitt',
  category: 'Health & Fitness',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://kinetixfitt.com',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KinetixFitt',
  },
  openGraph: {
    title: 'KinetixFitt - Transforma tu Cuerpo, Domina tu Mente',
    description: 'Únete a más de 12,000 atletas que ya están transformando sus vidas. 4.9★ en App Store.',
    type: 'website',
    locale: 'es_AR',
    url: 'https://kinetixfitt.com',
    siteName: 'KinetixFitt',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'KinetixFitt - Tu Entrenador Inteligente | 4.9★ 12k+ atletas'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KinetixFitt - Transforma tu Cuerpo, Domina tu Mente',
    description: 'La plataforma definitiva para transformar tu físico y mentalidad. 4.9★ 12k+ atletas.',
    images: ['/twitter-image'],
    creator: '@kinetixfitt',
    site: '@kinetixfitt',
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
    { media: '(prefers-color-scheme: light)', color: '#09090B' },
    { media: '(prefers-color-scheme: dark)', color: '#09090B' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  colorScheme: 'dark light',
};

// JSON-LD structured data — Organization + SoftwareApplication
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://kinetixfitt.com/#organization',
      name: 'KinetixFitt',
      url: 'https://kinetixfitt.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://kinetixfitt.com/icons/icon-512x512.png',
        width: 512,
        height: 512,
      },
      description:
        'KinetixFitt es la plataforma todo-en-uno de fitness que combina ciencia del deporte, IA personalizada y comunidad para resultados que duran.',
      foundingDate: '2024',
      slogan: 'Transforma tu Cuerpo, Domina tu Mente',
      brand: 'KinetixFitt',
      sameAs: [
        'https://www.instagram.com/kinetixfitt',
        'https://www.youtube.com/@kinetixfitt',
        'https://twitter.com/kinetixfitt',
        'https://github.com/kinetixfitt',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'ezequiel@kinetixfitt.com',
        contactType: 'customer support',
        availableLanguage: ['Spanish', 'English'],
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://kinetixfitt.com/#software',
      name: 'KinetixFitt',
      operatingSystem: 'Web, iOS, Android',
      applicationCategory: 'HealthApplication',
      applicationSubCategory: 'FitnessApplication',
      description:
        'App de coaching fitness con IA: rutinas personalizadas, nutrición precisa, gamificación y seguimiento humano. 12k+ atletas activos.',
      url: 'https://kinetixfitt.com',
      image: 'https://kinetixfitt.com/opengraph-image',
      author: { '@id': 'https://kinetixfitt.com/#organization' },
      publisher: { '@id': 'https://kinetixfitt.com/#organization' },
      offers: [
        {
          '@type': 'Offer',
          name: 'Básico',
          price: '0',
          priceCurrency: 'USD',
          description: 'Gratis para siempre',
        },
        {
          '@type': 'Offer',
          name: 'Pro Athlete',
          price: '19',
          priceCurrency: 'USD',
          priceValidUntil: '2027-12-31',
          description: '7 días gratis, luego $19/mes',
        },
        {
          '@type': 'Offer',
          name: 'Elite Coach',
          price: '49',
          priceCurrency: 'USD',
          description: 'Coaching 1 a 1 con humano',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '12000',
        reviewCount: '2400',
        bestRating: '5',
        worstRating: '1',
      },
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/UserInteraction',
        userInteractionCount: 12000,
      },
      featureList: [
        'Plan Personalizado con IA',
        'Cálculo Automático de Sobrecarga Progresiva',
        'Rangos & Gamificación',
        'Red Social Privada',
        'Nutrición Precisa',
        'Analítica Avanzada',
        'Check-ins Humanos',
        'Biblioteca 500+ Ejercicios',
      ],
      screenshot: 'https://kinetixfitt.com/opengraph-image',
      softwareVersion: '1.0.0',
      datePublished: '2024-01-15',
      dateModified: new Date().toISOString().split('T')[0],
      inLanguage: 'es-AR',
      isAccessibleForFree: true,
    },
    {
      '@type': 'WebSite',
      '@id': 'https://kinetixfitt.com/#website',
      name: 'KinetixFitt',
      url: 'https://kinetixfitt.com',
      description: 'Plataforma de coaching fitness con IA, nutrición y comunidad.',
      publisher: { '@id': 'https://kinetixfitt.com/#organization' },
      inLanguage: 'es-AR',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://kinetixfitt.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
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
        <meta name="theme-color" content="#D6FF2A" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* JSON-LD Structured Data — Organization + SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Preconnect a recursos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.kinetixfitt.com" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <PostHogProvider>{children}</PostHogProvider>

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
