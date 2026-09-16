import type { Metadata } from "next";
import Landing from "../../components/landing-pro";

export const metadata: Metadata = {
  title: "KinetixFitt — Training, progress and coaching in one place",
  description:
    "Plan workouts, log sessions, analyze progress and stay connected with your coach through one unified KinetixFitt experience.",
  alternates: {
    canonical: "https://kinetixfitt.com/en",
    languages: {
      en: "https://kinetixfitt.com/en",
      es: "https://kinetixfitt.com/es",
      "x-default": "https://kinetixfitt.com/es",
    },
  },
  openGraph: {
    title: "KinetixFitt — Training, progress and coaching",
    description:
      "A unified experience for athletes and coaches: programming, sessions, metrics, follow-up and community.",
    locale: "en_US",
    url: "https://kinetixfitt.com/en",
    alternateLocale: ["es_AR"],
    type: "website",
    siteName: "KinetixFitt",
  },
  twitter: {
    card: "summary_large_image",
    title: "KinetixFitt — Training, progress and coaching",
    description: "A unified experience for athletes and coaches.",
  },
};

export default function Page() {
  return <Landing locale="en" />;
}
