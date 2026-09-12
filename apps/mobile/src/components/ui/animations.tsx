"use client";

import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Componentes de animación premium para microinteracciones
 * Respeta prefers-reduced-motion
 */

// ────────────────────────────────────────────────────────────────
// FADE & SLIDE ANIMATIONS
// ────────────────────────────────────────────────────────────────

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  className?: string;
}) {
  const initial = {
    left: { x: -100, opacity: 0 },
    right: { x: 100, opacity: 0 },
    up: { y: -100, opacity: 0 },
    down: { y: 100, opacity: 0 },
  };

  return (
    <motion.div
      initial={initial[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// SCALE & ZOOM ANIMATIONS
// ────────────────────────────────────────────────────────────────

export function ScaleIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PopIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.34, 1.56, 0.64, 1], // spring easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// STAGGER ANIMATIONS (para listas)
// ────────────────────────────────────────────────────────────────

export function StaggerContainer({
  children,
  stagger = 0.1,
  className = "",
}: {
  children: React.ReactNode;
  stagger?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// HOVER ANIMATIONS
// ────────────────────────────────────────────────────────────────

export function HoverScale({
  children,
  scale = 1.05,
  className = "",
}: {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: scale * 0.95 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HoverLift({
  children,
  lift = -8,
  className = "",
}: {
  children: React.ReactNode;
  lift?: number;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: lift, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HoverGlow({
  children,
  color = "rgba(52, 211, 153, 0.4)",
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{
        boxShadow: `0 0 30px ${color}`,
        borderColor: color,
      }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// MAGNETIC BUTTON (cursor atrae el botón)
// ────────────────────────────────────────────────────────────────

export function MagneticButton({
  children,
  strength = 0.3,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// PARALLAX SCROLL
// ────────────────────────────────────────────────────────────────

export function ParallaxScroll({
  children,
  offset = 50,
  className = "",
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      style={{
        y: scrollY * (offset / 100),
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// NUMBER TICKER (animación suave de números)
// ────────────────────────────────────────────────────────────────

export function NumberTicker({
  value,
  duration = 1000,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const spring = useSpring(0, { duration, bounce: 0 });
  const display = useTransform(spring, (latest) =>
    `${prefix}${latest.toFixed(decimals)}${suffix}`
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
}

// ────────────────────────────────────────────────────────────────
// SHIMMER EFFECT (loading shimmer)
// ────────────────────────────────────────────────────────────────

export function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// REVEAL ON SCROLL
// ────────────────────────────────────────────────────────────────

export function RevealOnScroll({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(`[data-reveal]`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      data-reveal
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// CONFETTI BURST (celebración)
// ────────────────────────────────────────────────────────────────

export function ConfettiBurst({ trigger }: { trigger: boolean }) {
  const confettiCount = 30;
  const colors = ["#34D399", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6"];

  return (
    <AnimatePresence>
      {trigger && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: confettiCount }).map((_, i) => {
            const angle = (Math.random() * 360 * Math.PI) / 180;
            const velocity = 200 + Math.random() * 300;
            const x = Math.cos(angle) * velocity;
            const y = Math.sin(angle) * velocity - 200;

            return (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
                style={{
                  backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x,
                  y,
                  opacity: 0,
                  scale: 0,
                  rotate: Math.random() * 720,
                }}
                transition={{
                  duration: 1.5 + Math.random() * 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                exit={{ opacity: 0 }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}

// ────────────────────────────────────────────────────────────────
// PULSE GLOW (para notificaciones/badges)
// ────────────────────────────────────────────────────────────────

export function PulseGlow({
  children,
  color = "rgba(52, 211, 153, 0.6)",
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 0 0 ${color}`,
          `0 0 0 10px rgba(52, 211, 153, 0)`,
          `0 0 0 0 ${color}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// TYPING INDICATOR (para chat)
// ────────────────────────────────────────────────────────────────

export function TypingIndicator({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-zinc-500"
          animate={{
            y: [0, -8, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// FLIP CARD (para achievements/badges)
// ────────────────────────────────────────────────────────────────

export function FlipCard({
  front,
  back,
  className = "",
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`relative cursor-pointer ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="front"
            initial={{ rotateY: 0 }}
            exit={{ rotateY: 90 }}
            transition={{ duration: 0.3 }}
            style={{ backfaceVisibility: "hidden" }}
          >
            {front}
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: -90 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.3 }}
            style={{ backfaceVisibility: "hidden" }}
          >
            {back}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
