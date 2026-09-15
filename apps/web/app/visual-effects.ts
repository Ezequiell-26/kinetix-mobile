/**
 * KINETIXFIT VISUAL EFFECTS ENGINE v2.0
 * Sistema de efectos visuales avanzados
 * 
 * Basado en patrones de:
 * - Three.js (3D graphics)
 * - Framer Motion (Animaciones React)
 * - GSAP (GreenSock Animation Platform)
 * - Particles.js (Sistemas de partículas)
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';

// ============================================
// 🎨 SISTEMA DE PARTÍCULAS
// ============================================

export interface ParticleConfig {
  count: number;
  size: { min: number; max: number };
  speed: { min: number; max: number };
  colors: string[];
  opacity: { min: number; max: number };
  life: { min: number; max: number };
  shape: 'circle' | 'square' | 'triangle' | 'star';
}

export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private config: ParticleConfig;

  constructor(canvas: HTMLCanvasElement, config?: Partial<ParticleConfig>) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.config = {
      count: 100,
      size: { min: 1, max: 4 },
      speed: { min: 0.5, max: 2 },
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
      opacity: { min: 0.3, max: 0.8 },
      life: { min: 100, max: 300 },
      shape: 'circle',
      ...config
    };

    this.resize();
    this.init();
    
    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
  }

  private init(): void {
    this.particles = [];
    
    for (let i = 0; i < this.config.count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private createParticle(): Particle {
    const rect = this.canvas.getBoundingClientRect();
    
    return {
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * this.config.speed.max,
      vy: (Math.random() - 0.5) * this.config.speed.max,
      size: Math.random() * (this.config.size.max - this.config.size.min) + this.config.size.min,
      color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
      opacity: Math.random() * (this.config.opacity.max - this.config.opacity.min) + this.config.opacity.min,
      life: Math.random() * (this.config.life.max - this.config.life.min) + this.config.life.min,
      maxLife: this.config.life.max,
      shape: this.config.shape
    };
  }

  private update(): void {
    const rect = this.canvas.getBoundingClientRect();

    this.particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;

      // Rebotar en bordes
      if (particle.x < 0 || particle.x > rect.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > rect.height) particle.vy *= -1;

      // Regenerar partícula muerta
      if (particle.life <= 0) {
        this.particles[index] = this.createParticle();
      }
    });
  }

  private draw(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);

    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity * (particle.life / particle.maxLife);
      this.ctx.fillStyle = particle.color;

      switch (particle.shape) {
        case 'circle':
          this.ctx.beginPath();
          this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          this.ctx.fill();
          break;
        case 'square':
          this.ctx.fillRect(
            particle.x - particle.size,
            particle.y - particle.size,
            particle.size * 2,
            particle.size * 2
          );
          break;
        case 'triangle':
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y - particle.size);
          this.ctx.lineTo(particle.x + particle.size, particle.y + particle.size);
          this.ctx.lineTo(particle.x - particle.size, particle.y + particle.size);
          this.ctx.closePath();
          this.ctx.fill();
          break;
      }

      this.ctx.restore();
    });
  }

  public animate(): void {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  public start(): void {
    if (!this.animationId) {
      this.animate();
    }
  }

  public stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public destroy(): void {
    this.stop();
    window.removeEventListener('resize', () => this.resize());
  }

  public addParticles(count: number): void {
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  public explode(x: number, y: number, count: number = 20): void {
    for (let i = 0; i < count; i++) {
      const particle = this.createParticle();
      particle.x = x;
      particle.y = y;
      particle.vx = (Math.random() - 0.5) * 10;
      particle.vy = (Math.random() - 0.5) * 10;
      this.particles.push(particle);
    }
  }
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
  shape: string;
}

// ============================================
| ✨ EFECTOS DE BRILLO Y GRADIENTES
// ============================================

export class GlowEffect {
  private element: HTMLElement;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private targetX: number = 0;
  private targetY: number = 0;
  private animationFrame: number | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.init();
  }

  private init(): void {
    this.element.style.position = 'relative';
    this.element.style.overflow = 'hidden';

    const glow = document.createElement('div');
    glow.className = 'glow-effect';
    glow.style.cssText = `
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
      pointer-events: none;
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1;
    `;
    
    this.element.appendChild(glow);

    this.element.addEventListener('mousemove', (e) => {
      const rect = this.element.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      glow.style.opacity = '1';
    });

    this.element.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
    });

    this.animate(glow);
  }

  private animate(glow: HTMLElement): void {
    this.targetX += (this.mouseX - this.targetX) * 0.1;
    this.targetY += (this.mouseY - this.targetY) * 0.1;

    glow.style.left = `${this.targetX}px`;
    glow.style.top = `${this.targetY}px`;

    this.animationFrame = requestAnimationFrame(() => this.animate(glow));
  }

  public destroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    const glow = this.element.querySelector('.glow-effect');
    if (glow) glow.remove();
  }
}

// ============================================
| 🌊 EFECTO DE ONDA/RIPPLE
// ============================================

export class RippleEffect {
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
    this.init();
  }

  private init(): void {
    this.element.style.position = 'relative';
    this.element.style.overflow = 'hidden';

    this.element.addEventListener('click', (e) => {
      this.createRipple(e);
    });
  }

  private createRipple(event: MouseEvent): void {
    const rect = this.element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
      left: ${x}px;
      top: ${y}px;
      width: 100px;
      height: 100px;
      margin-left: -50px;
      margin-top: -50px;
    `;

    this.element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  public destroy(): void {
    const ripples = this.element.querySelectorAll('.ripple');
    ripples.forEach(r => r.remove());
  }
}

// ============================================
| 🎭 EFECTO PARALLAX 3D
// ============================================

export class Parallax3D {
  private element: HTMLElement;
  private layers: HTMLElement[] = [];
  private rotateX: number = 0;
  private rotateY: number = 0;

  constructor(element: HTMLElement, intensity: number = 15) {
    this.element = element;
    this.init(intensity);
  }

  private init(intensity: number): void {
    this.element.style.perspective = '1000px';
    this.element.style.transformStyle = 'preserve-3d';

    const children = Array.from(this.element.children) as HTMLElement[];
    children.forEach((child, index) => {
      child.dataset.depth = (index + 1).toString();
      this.layers.push(child);
    });

    this.element.addEventListener('mousemove', (e) => {
      const rect = this.element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateXValue = ((y - centerY) / centerY) * -intensity;
      const rotateYValue = ((x - centerX) / centerX) * intensity;

      this.rotateX = rotateXValue;
      this.rotateY = rotateYValue;

      this.applyTransform();
    });

    this.element.addEventListener('mouseleave', () => {
      this.rotateX = 0;
      this.rotateY = 0;
      this.applyTransform();
    });
  }

  private applyTransform(): void {
    this.element.style.transform = `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`;

    this.layers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth || '1');
      const translateZ = depth * 20;
      layer.style.transform = `translateZ(${translateZ}px)`;
    });
  }

  public destroy(): void {
    this.element.style.transform = '';
    this.layers.forEach(layer => {
      layer.style.transform = '';
      delete layer.dataset.depth;
    });
  }
}

// ============================================
| 🌈 GENERADOR DE GRADIENTES ANIMADOS
// ============================================

export class AnimatedGradient {
  private element: HTMLElement;
  private colors: string[];
  private angle: number = 0;
  private animationFrame: number | null = null;
  private speed: number;

  constructor(
    element: HTMLElement,
    colors: string[] = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    speed: number = 0.5
  ) {
    this.element = element;
    this.colors = colors;
    this.speed = speed;
    this.init();
  }

  private init(): void {
    this.animate();
  }

  private animate(): void {
    this.angle += this.speed;
    
    const gradient = this.generateGradient();
    this.element.style.background = gradient;
    this.element.style.backgroundSize = '400% 400%';
    this.element.style.animation = `gradient-shift 10s ease infinite`;

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  private generateGradient(): string {
    const stops = this.colors.map((color, index) => {
      const position = ((index / this.colors.length) * 100 + this.angle) % 100;
      return `${color} ${position}%`;
    });

    return `linear-gradient(${this.angle}deg, ${stops.join(', ')})`;
  }

  public setColors(colors: string[]): void {
    this.colors = colors;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  public destroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.element.style.background = '';
    this.element.style.animation = '';
  }
}

// ============================================
| 💫 EFECTO DE TEXTO BRILLANTE
// ============================================

export class ShinyTextEffect {
  private element: HTMLElement;
  private animationFrame: number | null = null;
  private position: number = -100;

  constructor(element: HTMLElement) {
    this.element = element;
    this.init();
  }

  private init(): void {
    const originalText = this.element.textContent;
    this.element.innerHTML = `<span class="shiny-text-wrapper" style="position: relative; display: inline-block;">${originalText}</span>`;
    
    const wrapper = this.element.querySelector('.shiny-text-wrapper') as HTMLElement;
    
    const shine = document.createElement('span');
    shine.className = 'shine';
    shine.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        120deg,
        transparent 0%,
        transparent 40%,
        rgba(255, 255, 255, 0.8) 50%,
        transparent 60%,
        transparent 100%
      );
      background-size: 200% 100%;
      background-position: ${this.position}%;
      mix-blend-mode: overlay;
      pointer-events: none;
    `;
    
    wrapper.appendChild(shine);
    this.animate(shine);
  }

  private animate(shine: HTMLElement): void {
    this.position += 2;
    if (this.position > 200) this.position = -100;

    shine.style.backgroundPosition = `${this.position}%`;

    this.animationFrame = requestAnimationFrame(() => this.animate(shine));
  }

  public destroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    const wrapper = this.element.querySelector('.shiny-text-wrapper');
    if (wrapper && wrapper.textContent) {
      this.element.textContent = wrapper.textContent;
    }
  }
}

// ============================================
| 🎯 HOOKS DE REACT PARA EFECTOS
// ============================================

export function useParticleSystem(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  config?: Partial<ParticleConfig>
) {
  const systemRef = useRef<ParticleSystem | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      systemRef.current = new ParticleSystem(canvasRef.current, config);
      systemRef.current.start();
    }

    return () => {
      if (systemRef.current) {
        systemRef.current.destroy();
      }
    };
  }, [canvasRef, config]);

  return {
    addParticles: (count: number) => systemRef.current?.addParticles(count),
    explode: (x: number, y: number, count?: number) => 
      systemRef.current?.explode(x, y, count)
  };
}

export function useGlowEffect(elementRef: React.RefObject<HTMLElement>) {
  const effectRef = useRef<GlowEffect | null>(null);

  useEffect(() => {
    if (elementRef.current) {
      effectRef.current = new GlowEffect(elementRef.current);
    }

    return () => {
      if (effectRef.current) {
        effectRef.current.destroy();
      }
    };
  }, [elementRef]);
}

export function useParallax3D(elementRef: React.RefObject<HTMLElement>, intensity?: number) {
  const effectRef = useRef<Parallax3D | null>(null);

  useEffect(() => {
    if (elementRef.current) {
      effectRef.current = new Parallax3D(elementRef.current, intensity);
    }

    return () => {
      if (effectRef.current) {
        effectRef.current.destroy();
      }
    };
  }, [elementRef, intensity]);
}

// ============================================
| 🚀 CLASE PRINCIPAL DE EFECTOS
// ============================================

export class VisualEffectsEngine {
  private effects: Map<string, any> = new Map();

  /**
   * Aplica múltiples efectos a un elemento
   */
  applyEffects(
    element: HTMLElement,
    effects: Array<'glow' | 'ripple' | 'parallax' | 'gradient' | 'shiny'>,
    options?: any
  ): void {
    effects.forEach(effectName => {
      const key = `${effectName}-${element.id || Date.now()}`;
      
      switch (effectName) {
        case 'glow':
          this.effects.set(key, new GlowEffect(element));
          break;
        case 'ripple':
          this.effects.set(key, new RippleEffect(element));
          break;
        case 'parallax':
          this.effects.set(key, new Parallax3D(element, options?.intensity));
          break;
        case 'gradient':
          this.effects.set(key, new AnimatedGradient(
            element,
            options?.colors,
            options?.speed
          ));
          break;
        case 'shiny':
          this.effects.set(key, new ShinyTextEffect(element));
          break;
      }
    });
  }

  /**
   * Remueve efectos específicos
   */
  removeEffect(key: string): void {
    const effect = this.effects.get(key);
    if (effect && typeof effect.destroy === 'function') {
      effect.destroy();
    }
    this.effects.delete(key);
  }

  /**
   * Limpia todos los efectos
   */
  clearAll(): void {
    this.effects.forEach((effect, key) => {
      if (typeof effect.destroy === 'function') {
        effect.destroy();
      }
    });
    this.effects.clear();
  }

  /**
   * Crea sistema de partículas en canvas
   */
  createParticleSystem(
    canvas: HTMLCanvasElement,
    config?: Partial<ParticleConfig>
  ): ParticleSystem {
    const system = new ParticleSystem(canvas, config);
    system.start();
    return system;
  }
}

export const visualEffects = new VisualEffectsEngine();
export default visualEffects;
