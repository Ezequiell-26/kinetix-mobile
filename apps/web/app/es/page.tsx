import type { Metadata } from "next";
import Landing from "../../components/landing-pro";

export const metadata: Metadata = {
  title: "KinetixFitt — Entrenamiento, progreso y coaching en un solo lugar",
  description:
    "Planificá entrenamientos, registrá sesiones, analizá tu progreso y conectá con tu coach desde una experiencia KinetixFitt unificada.",
  alternates: {
    canonical: "https://kinetixfitt.com/es",
    languages: {
      en: "https://kinetixfitt.com/en",
      es: "https://kinetixfitt.com/es",
      "x-default": "https://kinetixfitt.com/es",
    },
  },
  openGraph: {
    title: "KinetixFitt — Entrenamiento, progreso y coaching",
    description:
      "Una experiencia unificada para atletas y coaches: programación, sesiones, métricas, seguimiento y comunidad.",
    locale: "es_AR",
    url: "https://kinetixfitt.com/es",
    alternateLocale: ["en_US"],
    type: "website",
    siteName: "KinetixFitt",
  },
  twitter: {
    card: "summary_large_image",
    title: "KinetixFitt — Entrenamiento, progreso y coaching",
    description:
      "Una experiencia unificada para atletas y coaches.",
  },
};

export default function Page() {
  return <Landing locale="es" />;
}
