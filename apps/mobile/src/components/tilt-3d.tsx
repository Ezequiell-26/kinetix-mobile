"use client";
import { useRef, useState, type ReactNode, type MouseEvent, type TouchEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Configuración de resortes a nivel de módulo.
 *
 * Antes se declaraba dentro del componente: cada render creaba un objeto nuevo
 * y `useSpring` recibía una config distinta por referencia, lo que obligaba a
 * Framer Motion a reconstruir las animaciones. Como el dashboard monta 10+
 * instancias de Tilt3D, el costo se multiplicaba.
 */
const SPRING_CFG = { stiffness: 220, damping: 22, mass: 0.6 } as const;
const GLARE_SPRING_CFG = { stiffness: 200, damping: 30 } as const;

/**
 * Tilt3D — inclinación 3D real con perspectiva y física de resorte,
 * inspirado en microinteracciones tipo Apple/Stripe/Linear.
 * Sigue el mouse/dedo, hace lift (translateZ) + glare de luz.
 * Respeta prefers-reduced-motion. No requiere WebGL: es CSS transform-3d puro.
 */
export function Tilt3D({
  children,
  className,
  max = 8,          // grados máximos de inclinación
  scale = 1.015,     // leve zoom al hover
  glare = true,
  radiusClass = "rounded-3xl", // debe coincidir con el radio de las esquinas del contenido
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  scale?: number;
  glare?: boolean;
  radiusClass?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rx = useSpring(useTransform(y, [0, 1], [max, -max]), SPRING_CFG);
  const ry = useSpring(useTransform(x, [0, 1], [-max, max]), SPRING_CFG);
  const glareX = useTransform(x, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(y, [0, 1], ["0%", "100%"]);
  const glareOpacity = useSpring(0, GLARE_SPRING_CFG);
  const liftScale = useSpring(1, SPRING_CFG);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  function updateFromPoint(clientX: number, clientY: number) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((clientX - rect.left) / rect.width);
    y.set((clientY - rect.top) / rect.height);
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    updateFromPoint(e.clientX, e.clientY);
  }
  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    const t = e.touches[0];
    if (t) updateFromPoint(t.clientX, t.clientY);
  }
  function handleEnter() {
    glareOpacity.set(1);
    liftScale.set(scale);
  }
  function handleLeave() {
    x.set(0.5);
    y.set(0.5);
    glareOpacity.set(0);
    liftScale.set(1);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleLeave}
      className={cn("relative", className)}
      style={{ perspective: 900 }}
    >
      {/* Sin `will-change-transform` permanente: el dashboard monta 10+ de
          estas cards y cada `will-change` promueve una capa GPU propia (mucha
          memoria). Framer Motion ya gestiona will-change durante la animación. */}
      <motion.div
        style={{ rotateX: rx, rotateY: ry, scale: liftScale, transformStyle: "preserve-3d" }}
        className="relative h-full"
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden="true"
            className={cn("pointer-events-none absolute inset-0 overflow-hidden", radiusClass)}
            style={{ opacity: glareOpacity }}
          >
            <motion.div
              className="absolute w-[140%] h-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: glareX,
                top: glareY,
                background: "radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 60%)",
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

/**
 * Tilt3DSubtle — versión más discreta para grids de cards chicas
 * (métricas, accesos rápidos): menos grados, sin glare.
 */
export function Tilt3DSubtle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Tilt3D max={5} scale={1.02} glare={false} className={className}>
      {children}
    </Tilt3D>
  );
}
