import type { Metadata } from "next";
import Landing from "../../components/landing";

export const metadata: Metadata = {
  title: "KinetixFitt — Transform Your Body, Master Your Mind",
  description:
    "The all-in-one platform that blends sports science, personalized AI and community for results that last forever.",
  alternates: {
    canonical: "https://kinetixfitt.com/en",
    languages: {
      "en": "https://kinetixfitt.com/en",
      "es": "https://kinetixfitt.com/es",
      "x-default": "https://kinetixfitt.com/es",
    },
  },
  openGraph: {
    title: "KinetixFitt — Transform Your Body, Master Your Mind",
    description: "Join 12k+ athletes transforming their lives. 4.9★ on App Store.",
    locale: "en_US",
    url: "https://kinetixfitt.com/en",
    alternateLocale: ["es_AR"],
  },
};

export default function Page() {
  return <Landing locale="en" />;
}
