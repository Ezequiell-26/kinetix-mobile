"use client";

/**
 * motion-provider.tsx — Respeta `prefers-reduced-motion` en Framer Motion.
 *
 * globals.css ya neutraliza las animaciones CSS cuando el sistema pide
 * movimiento reducido, pero Framer Motion no pasa por CSS: escribe transform y
 * opacity inline vía WAAPI/estilos, así que seguía animando igual. Los
 * usuarios con trastornos vestibulares (o simplemente con "reducir movimiento"
 * activado en el sistema) seguían viendo parallax, confeti y pulsos.
 *
 * `reducedMotion="user"` hace que Framer Motion consulte la preferencia del
 * sistema y desactive automáticamente las animaciones de transform/layout,
 * conservando las de opacidad (que no provocan mareo).
 */

import { MotionConfig } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
