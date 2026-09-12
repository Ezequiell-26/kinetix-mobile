/**
 * Transición de entrada para login / registro / recuperación.
 * Un fade suave evita el "salto" entre formularios.
 */
export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
