import type { Metadata } from "next";
import Landing from "../components/landing-pro";

export const metadata: Metadata = {
  title: "KinetixFitt — Entrenamiento, progreso y coaching en un solo lugar",
  description:
    "Planificá entrenamientos, registrá sesiones, analizá tu progreso y conectá con tu coach desde una experiencia KinetixFitt unificada.",
  alternates: {
    canonical: "https://kinetixfitt.com/es",
    languages: {
      es: "https://kinetixfitt.com/es",
      en: "https://kinetixfitt.com/en",
      "x-default": "https://kinetixfitt.com/es",
    },
  },
};

export default function Page() {
  return <Landing locale="es" />;
}
