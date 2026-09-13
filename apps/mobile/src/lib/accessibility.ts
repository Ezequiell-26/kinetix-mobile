/**
 * Sistema de Accesibilidad WCAG 2.1 AA
 * Mejora la accesibilidad para todos los usuarios
 */

'use client';

import { useEffect, useCallback } from 'react';

// Niveles de conformidad WCAG
export type WCAGLevel = 'A' | 'AA' | 'AAA';

// Criterios de éxito WCAG 2.1 AA implementados
export const wcagCriteria = {
  // Perceptible
  '1.1.1': { name: 'Texto Alternativo', level: 'A' as const },
  '1.3.1': { name: 'Información y Relaciones', level: 'A' as const },
  '1.4.1': { name: 'Uso del Color', level: 'A' as const },
  '1.4.3': { name: 'Contraste (Mínimo)', level: 'AA' as const },
  '1.4.4': { name: 'Redimensionamiento de Texto', level: 'AA' as const },
  '1.4.10': { name: 'Reflow', level: 'AA' as const },
  '1.4.11': { name: 'Contraste No Textual', level: 'AA' as const },
  
  // Operable
  '2.1.1': { name: 'Teclado', level: 'A' as const },
  '2.1.2': { name: 'Sin Trampa de Teclado', level: 'A' as const },
  '2.4.1': { name: 'Saltar Bloques', level: 'A' as const },
  '2.4.2': { name: 'Títulos de Página', level: 'A' as const },
  '2.4.3': { name: 'Orden del Foco', level: 'A' as const },
  '2.4.4': { name: 'Propósito del Enlace', level: 'A' as const },
  '2.4.6': { name: 'Encabezados y Etiquetas', level: 'AA' as const },
  '2.4.7': { name: 'Foco Visible', level: 'AA' as const },
  '2.5.3': { name: 'Etiqueta en Nombre', level: 'A' as const },
  
  // Comprensible
  '3.1.1': { name: 'Idioma de la Página', level: 'A' as const },
  '3.1.2': { name: 'Idioma de las Partes', level: 'AA' as const },
  '3.2.1': { name: 'Al Recibir el Foco', level: 'A' as const },
  '3.2.2': { name: 'Al Recibir Input', level: 'A' as const },
  '3.3.1': { name: 'Identificación de Errores', level: 'A' as const },
  '3.3.2': { name: 'Etiquetas o Instrucciones', level: 'A' as const },
  '3.3.3': { name: 'Sugerencia ante Errores', level: 'AA' as const },
  
  // Robusto
  '4.1.1': { name: 'Parsing', level: 'A' as const },
  '4.1.2': { name: 'Nombre, Rol, Valor', level: 'A' as const },
  '4.1.3': { name: 'Estado de los Mensajes', level: 'AA' as const },
};

// Verificar contraste de colores según WCAG
export function checkColorContrast(
  foreground: string,
  background: string,
  level: WCAGLevel = 'AA'
): { passes: boolean; ratio: number; required: number } {
  // Implementación simplificada - en producción usar librería como chroma.js
  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  const ratio = l1 > l2 
    ? (l1 + 0.05) / (l2 + 0.05) 
    : (l2 + 0.05) / (l1 + 0.05);
  
  const required = level === 'AAA' ? 7 : 4.5;
  
  return {
    passes: ratio >= required,
    ratio,
    required,
  };
}

// Hook para gestionar skip links
export function useSkipLinks() {
  useEffect(() => {
    // Manejar tecla 's' para saltar al contenido principal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

// Hook para gestionar atajos de teclado accesibles
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si está en un input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      
      const key = e.key.toLowerCase();
      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Componente Skip Link
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    >
      Saltar al contenido principal
    </a>
  );
}

// Componente Live Region para anuncios a lectores de pantalla
export function LiveRegion({ 
  children, 
  polite = true,
  atomic = true 
}: { 
  children: React.ReactNode; 
  polite?: boolean;
  atomic?: boolean;
}) {
  return (
    <div
      role="status"
      aria-live={polite ? 'polite' : 'assertive'}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  );
}

// Hook para anunciar cambios a lectores de pantalla
export function useAnnouncer() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.getElementById('announcer');
    if (announcer) {
      announcer.setAttribute('aria-live', priority);
      announcer.textContent = '';
      // Pequeño delay para asegurar que el cambio sea detectado
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  }, []);
  
  return announce;
}

// Validar accesibilidad de formulario
export interface FormAccessibilityConfig {
  labels: boolean;
  errorMessages: boolean;
  requiredIndicators: boolean;
  keyboardNavigation: boolean;
  focusManagement: boolean;
}

export function validateFormAccessibility(
  formElement: HTMLFormElement,
  config: FormAccessibilityConfig
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Verificar labels
  if (config.labels) {
    const inputs = formElement.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      const id = input.getAttribute('id');
      const label = id ? formElement.querySelector(`label[for="${id}"]`) : null;
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      
      if (!label && !ariaLabel && !ariaLabelledBy) {
        issues.push(`Input sin label: ${input.tagName} (name: ${input.getAttribute('name')})`);
      }
    });
  }
  
  // Verificar mensajes de error
  if (config.errorMessages) {
    const invalidInputs = formElement.querySelectorAll(':invalid');
    invalidInputs.forEach(input => {
      const describedBy = input.getAttribute('aria-describedby');
      if (!describedBy) {
        issues.push(`Input inválido sin mensaje de error: ${input.getAttribute('name')}`);
      }
    });
  }
  
  // Verificar indicadores de requerido
  if (config.requiredIndicators) {
    const requiredInputs = formElement.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
      const requiredText = input.getAttribute('aria-required');
      if (!requiredText && !input.closest('label')?.textContent?.includes('*')) {
        issues.push(`Input requerido sin indicador: ${input.getAttribute('name')}`);
      }
    });
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// Gestionar foco en modales/dialogs
export function useFocusTrap(isOpen: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focar primer elemento
    firstElement?.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, containerRef]);
}

// Detectar modo de alto contraste del sistema
export function usePrefersHighContrast(): boolean {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: more)');
    setPrefersHighContrast(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersHighContrast;
}

// Detectar movimiento reducido
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReducedMotion;
}

// Import React hooks
import { useState, useEffect, useCallback, useRef } from 'react';
