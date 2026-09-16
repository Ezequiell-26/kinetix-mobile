"use client";

import { useEffect, useRef, type RefObject } from "react";

export interface ParticleConfig {
  count: number;
  size: { min: number; max: number };
  speed: { min: number; max: number };
  colors: string[];
  opacity: { min: number; max: number };
  life: { min: number; max: number };
  shape: "circle" | "square" | "triangle" | "star";
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
  shape: ParticleConfig["shape"];
}

type Cleanup = () => void;

function getContext2D(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context is not available");
  return context;
}

export class ParticleSystem {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private readonly config: ParticleConfig;
  private readonly resizeHandler = () => this.resize();
  private cssWidth = 0;
  private cssHeight = 0;

  constructor(canvas: HTMLCanvasElement, config?: Partial<ParticleConfig>) {
    this.canvas = canvas;
    this.ctx = getContext2D(canvas);
    this.config = {
      count: 100,
      size: { min: 1, max: 4 },
      speed: { min: 0.5, max: 2 },
      colors: ["#C6F91E", "#7A8F00", "#D9FF66"],
      opacity: { min: 0.25, max: 0.7 },
      life: { min: 100, max: 300 },
      shape: "circle",
      ...config,
    };
    this.resize();
    this.init();
    window.addEventListener("resize", this.resizeHandler, { passive: true });
  }

  private resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cssWidth = Math.max(1, Math.round(rect.width));
    this.cssHeight = Math.max(1, Math.round(rect.height));
    this.canvas.width = Math.round(this.cssWidth * dpr);
    this.canvas.height = Math.round(this.cssHeight * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  private createParticle(): Particle {
    const colors = this.config.colors.length ? this.config.colors : ["#C6F91E"];
    return {
      x: Math.random() * this.cssWidth,
      y: Math.random() * this.cssHeight,
      vx: this.randomBetween(-this.config.speed.max, this.config.speed.max),
      vy: this.randomBetween(-this.config.speed.max, this.config.speed.max),
      size: this.randomBetween(this.config.size.min, this.config.size.max),
      color: colors[Math.floor(Math.random() * colors.length)] || "#C6F91E",
      opacity: this.randomBetween(this.config.opacity.min, this.config.opacity.max),
      life: this.randomBetween(this.config.life.min, this.config.life.max),
      maxLife: Math.max(1, this.config.life.max),
      shape: this.config.shape,
    };
  }

  private init(): void {
    this.particles = Array.from({ length: Math.max(0, this.config.count) }, () => this.createParticle());
  }

  private update(): void {
    for (let i = 0; i < this.particles.length; i += 1) {
      const particle = this.particles[i]!;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 1;

      if (particle.x < 0 || particle.x > this.cssWidth) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.cssHeight) particle.vy *= -1;
      if (particle.life <= 0) this.particles[i] = this.createParticle();
    }
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);
    for (const particle of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, Math.min(1, particle.opacity * (particle.life / particle.maxLife)));
      this.ctx.fillStyle = particle.color;
      const s = particle.size;
      switch (particle.shape) {
        case "square":
          this.ctx.fillRect(particle.x - s, particle.y - s, s * 2, s * 2);
          break;
        case "triangle":
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y - s);
          this.ctx.lineTo(particle.x + s, particle.y + s);
          this.ctx.lineTo(particle.x - s, particle.y + s);
          this.ctx.closePath();
          this.ctx.fill();
          break;
        case "star":
          this.ctx.beginPath();
          for (let i = 0; i < 10; i += 1) {
            const radius = i % 2 === 0 ? s : s * 0.45;
            const angle = -Math.PI / 2 + i * (Math.PI / 5);
            const x = particle.x + Math.cos(angle) * radius;
            const y = particle.y + Math.sin(angle) * radius;
            if (i === 0) this.ctx.moveTo(x, y); else this.ctx.lineTo(x, y);
          }
          this.ctx.closePath();
          this.ctx.fill();
          break;
        default:
          this.ctx.beginPath();
          this.ctx.arc(particle.x, particle.y, s, 0, Math.PI * 2);
          this.ctx.fill();
      }
      this.ctx.restore();
    }
  }

  public animate(): void {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  public start(): void {
    if (this.animationId === null) this.animate();
  }

  public stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public destroy(): void {
    this.stop();
    window.removeEventListener("resize", this.resizeHandler);
    this.ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);
  }

  public addParticles(count: number): void {
    const amount = Math.max(0, Math.floor(count));
    for (let i = 0; i < amount; i += 1) this.particles.push(this.createParticle());
  }

  public explode(x: number, y: number, count = 20): void {
    const amount = Math.max(0, Math.floor(count));
    for (let i = 0; i < amount; i += 1) {
      const particle = this.createParticle();
      const angle = Math.random() * Math.PI * 2;
      const speed = this.randomBetween(2, 10);
      particle.x = x;
      particle.y = y;
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
      this.particles.push(particle);
    }
  }
}

export class GlowEffect {
  private readonly element: HTMLElement;
  private readonly glow: HTMLDivElement;
  private readonly moveHandler = (event: MouseEvent) => {
    const rect = this.element.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
    this.glow.style.opacity = "1";
  };
  private readonly leaveHandler = () => { this.glow.style.opacity = "0"; };
  private mouseX = 0;
  private mouseY = 0;
  private targetX = 0;
  private targetY = 0;
  private animationFrame: number | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.element.style.position = this.element.style.position || "relative";
    this.element.style.overflow = this.element.style.overflow || "hidden";
    this.glow = document.createElement("div");
    this.glow.className = "glow-effect";
    this.glow.setAttribute("aria-hidden", "true");
    Object.assign(this.glow.style, {
      position: "absolute",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(198,249,30,0.16) 0%, transparent 70%)",
      pointerEvents: "none",
      transform: "translate(-50%, -50%)",
      opacity: "0",
      zIndex: "1",
      willChange: "left, top, opacity",
    });
    this.element.appendChild(this.glow);
    this.element.addEventListener("mousemove", this.moveHandler, { passive: true });
    this.element.addEventListener("mouseleave", this.leaveHandler, { passive: true });
    this.animate();
  }

  private animate(): void {
    this.targetX += (this.mouseX - this.targetX) * 0.1;
    this.targetY += (this.mouseY - this.targetY) * 0.1;
    this.glow.style.left = `${this.targetX}px`;
    this.glow.style.top = `${this.targetY}px`;
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  public destroy(): void {
    if (this.animationFrame !== null) cancelAnimationFrame(this.animationFrame);
    this.element.removeEventListener("mousemove", this.moveHandler);
    this.element.removeEventListener("mouseleave", this.leaveHandler);
    this.glow.remove();
  }
}

export class RippleEffect {
  private readonly element: HTMLElement;
  private readonly clickHandler = (event: MouseEvent) => this.createRipple(event);

  constructor(element: HTMLElement) {
    this.element = element;
    this.element.style.position = this.element.style.position || "relative";
    this.element.style.overflow = this.element.style.overflow || "hidden";
    this.element.addEventListener("click", this.clickHandler);
  }

  private createRipple(event: MouseEvent): void {
    const rect = this.element.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height, 100);
    Object.assign(ripple.style, {
      position: "absolute",
      width: `${size}px`,
      height: `${size}px`,
      left: `${event.clientX - rect.left - size / 2}px`,
      top: `${event.clientY - rect.top - size / 2}px`,
      borderRadius: "50%",
      background: "rgba(198,249,30,0.18)",
      transform: "scale(0)",
      animation: "kinetix-ripple 600ms ease-out forwards",
      pointerEvents: "none",
      zIndex: "2",
    });
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    this.element.appendChild(ripple);
  }

  public destroy(): void {
    this.element.removeEventListener("click", this.clickHandler);
    this.element.querySelectorAll(".kinetix-ripple, span[style*='kinetix-ripple']").forEach((node) => node.remove());
  }
}

export class Parallax3D {
  private readonly element: HTMLElement;
  private readonly layers: HTMLElement[];
  private readonly moveHandler: (event: MouseEvent) => void;
  private readonly leaveHandler: () => void;
  private rotateX = 0;
  private rotateY = 0;

  constructor(element: HTMLElement, intensity = 8) {
    this.element = element;
    this.layers = Array.from(element.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
    this.layers.forEach((layer, index) => { layer.dataset.depth = String(index + 1); });
    this.element.style.perspective = "1000px";
    this.element.style.transformStyle = "preserve-3d";
    this.moveHandler = (event) => {
      const rect = this.element.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      this.rotateX = ((event.clientY - rect.top - centerY) / Math.max(centerY, 1)) * -intensity;
      this.rotateY = ((event.clientX - rect.left - centerX) / Math.max(centerX, 1)) * intensity;
      this.applyTransform();
    };
    this.leaveHandler = () => { this.rotateX = 0; this.rotateY = 0; this.applyTransform(); };
    this.element.addEventListener("mousemove", this.moveHandler, { passive: true });
    this.element.addEventListener("mouseleave", this.leaveHandler, { passive: true });
  }

  private applyTransform(): void {
    this.element.style.transform = `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`;
    this.layers.forEach((layer) => {
      const depth = Number.parseFloat(layer.dataset.depth || "1");
      layer.style.transform = `translateZ(${depth * 12}px)`;
    });
  }

  public destroy(): void {
    this.element.removeEventListener("mousemove", this.moveHandler);
    this.element.removeEventListener("mouseleave", this.leaveHandler);
    this.element.style.transform = "";
    this.element.style.perspective = "";
    this.element.style.transformStyle = "";
    this.layers.forEach((layer) => { layer.style.transform = ""; delete layer.dataset.depth; });
  }
}

export class AnimatedGradient {
  private readonly element: HTMLElement;
  private colors: string[];
  private speed: number;
  private angle = 0;
  private animationFrame: number | null = null;

  constructor(element: HTMLElement, colors = ["#081119", "#0B151E", "#162331"], speed = 0.25) {
    this.element = element;
    this.colors = colors.length ? colors : ["#081119", "#0B151E"];
    this.speed = speed;
    this.animate();
  }

  private animate(): void {
    this.angle = (this.angle + this.speed) % 360;
    this.element.style.background = `linear-gradient(${this.angle}deg, ${this.colors.join(", ")})`;
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  public setColors(colors: string[]): void { this.colors = colors.length ? colors : this.colors; }
  public setSpeed(speed: number): void { this.speed = speed; }

  public destroy(): void {
    if (this.animationFrame !== null) cancelAnimationFrame(this.animationFrame);
    this.element.style.background = "";
  }
}

export class ShinyTextEffect {
  private readonly element: HTMLElement;
  private readonly originalText: string;
  private animationFrame: number | null = null;
  private position = -100;

  constructor(element: HTMLElement) {
    this.element = element;
    this.originalText = element.textContent || "";
    const wrapper = document.createElement("span");
    wrapper.className = "shiny-text-wrapper";
    Object.assign(wrapper.style, { position: "relative", display: "inline-block" });
    wrapper.textContent = this.originalText;
    const shine = document.createElement("span");
    shine.className = "shine";
    Object.assign(shine.style, {
      position: "absolute",
      inset: "0",
      background: "linear-gradient(120deg, transparent 0%, transparent 42%, rgba(255,255,255,0.7) 50%, transparent 58%, transparent 100%)",
      backgroundSize: "200% 100%",
      mixBlendMode: "overlay",
      pointerEvents: "none",
    });
    wrapper.appendChild(shine);
    this.element.replaceChildren(wrapper);
    this.animate(shine);
  }

  private animate(shine: HTMLElement): void {
    this.position += 2;
    if (this.position > 200) this.position = -100;
    shine.style.backgroundPosition = `${this.position}%`;
    this.animationFrame = requestAnimationFrame(() => this.animate(shine));
  }

  public destroy(): void {
    if (this.animationFrame !== null) cancelAnimationFrame(this.animationFrame);
    this.element.textContent = this.originalText;
  }
}

export function useParticleSystem(canvasRef: RefObject<HTMLCanvasElement | null>, config?: Partial<ParticleConfig>) {
  const systemRef = useRef<ParticleSystem | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    systemRef.current = new ParticleSystem(canvas, config);
    systemRef.current.start();
    return () => { systemRef.current?.destroy(); systemRef.current = null; };
  }, [canvasRef, config]);
  return {
    addParticles: (count: number) => systemRef.current?.addParticles(count),
    explode: (x: number, y: number, count?: number) => systemRef.current?.explode(x, y, count),
  };
}

export function useGlowEffect(elementRef: RefObject<HTMLElement | null>): void {
  const effectRef = useRef<GlowEffect | null>(null);
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;
    effectRef.current = new GlowEffect(element);
    return () => { effectRef.current?.destroy(); effectRef.current = null; };
  }, [elementRef]);
}

export function useParallax3D(elementRef: RefObject<HTMLElement | null>, intensity?: number): void {
  const effectRef = useRef<Parallax3D | null>(null);
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;
    effectRef.current = new Parallax3D(element, intensity);
    return () => { effectRef.current?.destroy(); effectRef.current = null; };
  }, [elementRef, intensity]);
}

export class VisualEffectsEngine {
  private effects = new Map<string, { destroy: () => void }>();
  private sequence = 0;

  applyEffects(element: HTMLElement, effects: Array<"glow" | "ripple" | "parallax" | "gradient" | "shiny">, options?: {
    intensity?: number;
    colors?: string[];
    speed?: number;
  }): void {
    effects.forEach((effectName) => {
      const key = `${effectName}-${element.id || ++this.sequence}`;
      switch (effectName) {
        case "glow": this.effects.set(key, new GlowEffect(element)); break;
        case "ripple": this.effects.set(key, new RippleEffect(element)); break;
        case "parallax": this.effects.set(key, new Parallax3D(element, options?.intensity)); break;
        case "gradient": this.effects.set(key, new AnimatedGradient(element, options?.colors, options?.speed)); break;
        case "shiny": this.effects.set(key, new ShinyTextEffect(element)); break;
      }
    });
  }

  removeEffect(key: string): void {
    this.effects.get(key)?.destroy();
    this.effects.delete(key);
  }

  clearAll(): void {
    this.effects.forEach((effect) => effect.destroy());
    this.effects.clear();
  }

  createParticleSystem(canvas: HTMLCanvasElement, config?: Partial<ParticleConfig>): ParticleSystem {
    const system = new ParticleSystem(canvas, config);
    system.start();
    return system;
  }
}

export const visualEffects = new VisualEffectsEngine();
export default visualEffects;
