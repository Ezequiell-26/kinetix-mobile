import type { Metadata } from "next";
import FuncionesView from "./funciones-view";

export const metadata: Metadata = {
  title: "Funciones — EZEQUIEL COACHING | Todo tu entreno en un solo lugar",
  description:
    "Programa personalizado, +100 ejercicios, cronómetros, nutrición, mensajes con tu coach y progreso privado. Descubrí todas las funciones de KinetixFitt.",
  keywords: ["funciones", "entrenamiento", "nutrición", "coach", "fitness", "app"],
  openGraph: {
    title: "Funciones — EZEQUIEL COACHING",
    description: "Todo tu entreno en un solo lugar",
    images: ["/og-funciones.jpg"],
  },
};

// Server Component: mantiene metadata/SEO. La vista usa useTranslation
// (hook cliente) y vive en ./funciones-view.tsx.
export default function FuncionesPage() {
  return <FuncionesView />;
}
