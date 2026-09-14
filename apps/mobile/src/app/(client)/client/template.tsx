/**
 * Transición de entrada para cada pantalla del área cliente.
 * `template.tsx` se re-monta en cada navegación → la animación se repite,
 * dando continuidad visual al cambiar de sección (Inicio · Entrenar · …).
 */
export default function ClientTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
