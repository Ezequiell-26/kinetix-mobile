import type { Metadata } from "next";
import Landing from "../../components/landing";

export const metadata: Metadata = {
  title: "KinetixFitt - Transforma tu Cuerpo, Domina tu Mente",
  description:
    "La plataforma todo-en-uno que combina ciencia del deporte, IA personalizada y comunidad para resultados que duran para siempre.",
  alternates: {
    canonical: "https://kinetixfitt.com/es",
    languages: {
      "en": "https://kinetixfitt.com/en",
      "es": "https://kinetixfitt.com/es",
      "x-default": "https://kinetixfitt.com/es",
    },
  },
  openGraph: {
    title: "KinetixFitt - Transforma tu Cuerpo, Domina tu Mente",
    description: "Únete a más de 12,000 atletas que ya están transformando sus vidas. 4.9★ en App Store.",
    locale: "es_AR",
    url: "https://kinetixfitt.com/es",
    alternateLocale: ["en_US"],
  },
};

export default function Page() {
  return <Landing locale="es" />;
}
