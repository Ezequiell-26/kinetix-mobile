"use client";

import { useEffect, useRef } from "react";

/**
 * use-dismissable.ts — Comportamiento común de overlays (drawer, modal, popover).
 *
 * Antes, ningún overlay de la app se podía cerrar con Escape y todos dejaban
 * el fondo scrolleable. Para quien navega con teclado, un drawer abierto sin
 * Escape es una trampa: el foco queda detrás del overlay y no hay salida
 * evidente. Es un requisito de WCAG 2.1 (2.1.2, sin trampa de teclado).
 *
 * Cubre:
 *  - Escape cierra el overlay.
 *  - El fondo no scrollea mientras el overlay está abierto.
 *
 * NO cubre el focus trap completo (mover el foco dentro del overlay y
 * devolverlo al disparador al cerrar), que cada overlay implementa según su
 * estructura. Acá se garantiza la salida.
 */
export function useDismissable(open: boolean, onClose: () => void) {
  // Ref para no re-suscribir el listener en cada render por una función inline.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);
}
