import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KinetixFit - Transforma tu Cuerpo, Domina tu Mente',
  description: 'La plataforma todo-en-uno que combina ciencia del deporte, IA personalizada y comunidad para resultados que duran para siempre.',
  keywords: ['fitness', 'entrenamiento', 'nutrición', 'salud', 'gimnasio', 'workout', 'app fitness'],
  authors: [{ name: 'KinetixFit Team' }],
  openGraph: {
    title: 'KinetixFit - Transforma tu Cuerpo, Domina tu Mente',
    description: 'Únete a más de 50,000 atletas que ya están transformando sus vidas.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'KinetixFit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KinetixFit',
    description: 'La plataforma definitiva para transformar tu físico y mentalidad.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
