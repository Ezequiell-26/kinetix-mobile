/**
 * Transición de entrada para cada pantalla del panel del entrenador.
 * Ver `(client)/client/template.tsx` para el detalle.
 */
export default function TrainerTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
