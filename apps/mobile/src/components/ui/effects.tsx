import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark' | 'custom';
  intensity?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente GlassCard con efecto glassmorphism
 * Usa backdrop-filter para crear efecto de vidrio esmerilado
 */
export function GlassCard({
  variant = 'light',
  intensity = 'md',
  children,
  className = '',
  ...props
}: GlassCardProps) {
  const baseClasses = 'backdrop-blur-md border transition-all duration-300';
  
  const variantClasses = {
    light: 'bg-white/10 border-white/20',
    dark: 'bg-black/20 border-white/10',
    custom: '',
  };
  
  const intensityClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  };
  
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${intensityClasses[intensity]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface GradientTextProps {
  children: React.ReactNode;
  variant?: 'brand' | 'accent' | 'success' | 'warning' | 'custom';
  className?: string;
  as?: React.ElementType;
}

/**
 * Componente GradientText para texto con gradiente
 * Soporta múltiples variantes de color
 */
export function GradientText({
  children,
  variant = 'brand',
  className = '',
  as: Component = 'span',
}: GradientTextProps) {
  const Tag = Component as React.ComponentType<Record<string, unknown> & { children?: React.ReactNode }>;
  const variants = {
    brand: 'text-gradient',
    accent: 'text-gradient-accent',
    success: 'bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent',
    custom: '',
  };
  
  return (
    <Tag className={`${variants[variant]} ${className}`}>
      {children}
    </Tag>
  );
}

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideRight' | 'scaleIn';
  delay?: number;
  duration?: 'fast' | 'normal' | 'slow';
  className?: string;
  as?: React.ElementType;
}

/**
 * Componente AnimatedSection para animaciones de entrada
 * Soporta diferentes tipos de animación y delays
 */
export function AnimatedSection({
  children,
  animation = 'slideUp',
  delay = 0,
  duration = 'normal',
  className = '',
  as: Component = 'div',
}: AnimatedSectionProps) {
  const Tag = Component as React.ComponentType<Record<string, unknown> & { children?: React.ReactNode }>;
  const animations = {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
    slideRight: 'animate-slide-right',
    scaleIn: 'animate-scale-in',
  };
  
  const durations = {
    fast: 'var(--duration-fast)',
    normal: 'var(--duration-normal)',
    slow: 'var(--duration-slow)',
  };
  
  const style = {
    animationDelay: `${delay}ms`,
    animationDuration: durations[duration],
  };
  
  return (
    <Tag
      className={`${animations[animation]} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}

interface ShimmerSkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

/**
 * Componente ShimmerSkeleton para loading states
 * Con animación shimmer elegante
 */
export function ShimmerSkeleton({
  width = '100%',
  height = '1rem',
  borderRadius = 'md',
  className = '',
}: ShimmerSkeletonProps) {
  const radiusClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };
  
  return (
    <div
      className={`bg-shimmer ${radiusClasses[borderRadius]} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        animation: 'shimmer 2s linear infinite',
      }}
      aria-label="Loading..."
      role="status"
    />
  );
}

interface FloatingElementProps {
  children: React.ReactNode;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

/**
 * Componente FloatingElement para animación flotante
 * Ideal para icons, ilustraciones o elementos destacados
 */
export function FloatingElement({
  children,
  speed = 'normal',
  className = '',
}: FloatingElementProps) {
  const speeds = {
    slow: '4s',
    normal: '3s',
    fast: '2s',
  };
  
  return (
    <div
      className={`animate-float ${className}`}
      style={{ animationDuration: speeds[speed] }}
    >
      {children}
    </div>
  );
}

interface PulseDotProps {
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Componente PulseDot para indicadores de estado
 * Con animación de pulso suave
 */
export function PulseDot({
  color = 'primary',
  size = 'md',
  className = '',
}: PulseDotProps) {
  const colors = {
    primary: 'bg-brand-primary',
    success: 'bg-brand-success',
    warning: 'bg-brand-warning',
    danger: 'bg-destructive',
  };
  
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };
  
  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`${sizes[size]} ${colors[color]} rounded-full animate-pulse ${className}`}
      />
      <div
        className={`absolute ${sizes[size]} ${colors[color]} rounded-full opacity-75`}
        style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />
    </div>
  );
}

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'brand' | 'accent' | 'success';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  children: React.ReactNode;
}

/**
 * Componente GradientButton con fondo gradiente y efecto glow
 */
export function GradientButton({
  variant = 'brand',
  size = 'md',
  glow = true,
  children,
  className = '',
  ...props
}: GradientButtonProps) {
  const variants = {
    brand: 'bg-gradient-brand hover:shadow-glow',
    accent: 'bg-gradient-accent hover:shadow-glow-cyan',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${variants[variant]} ${sizes[size]} text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible-ring ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Exportar todos los componentes
export default {
  GlassCard,
  GradientText,
  AnimatedSection,
  ShimmerSkeleton,
  FloatingElement,
  PulseDot,
  GradientButton,
};
