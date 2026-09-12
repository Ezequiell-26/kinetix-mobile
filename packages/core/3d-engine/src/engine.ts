/**
 * KinetixFitt 3D Engine - High Performance Renderer
 * WebGL-based renderer with quality tiers and automatic fallback
 */

import { WebGLRenderer, Scene, PerspectiveCamera, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as THREE from 'three';

export interface RenderConfig {
  targetFPS: number;
  pixelRatio: number;
  antialias: boolean;
  powerPreference: 'high-performance' | 'low-power' | 'default';
}

export class Kinetix3DEngine {
  private canvas: HTMLCanvasElement;
  private renderer: WebGLRenderer | null = null;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private animationFrame: number | null = null;
  private frameCount: number = 0;
  private fps: number = 0;
  private isRunning: boolean = false;
  
  // FPS measurement window for accurate calculation
  private fpsWindowStart: number = 0;
  private framesInWindow: number = 0;

  constructor(
    canvas: HTMLCanvasElement,
    config: RenderConfig = {
      targetFPS: 60,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      antialias: true,
      powerPreference: 'high-performance'
    }
  ) {
    this.canvas = canvas;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      75,
      canvas.width / canvas.height,
      0.1,
      1000
    );
    
    this.camera.position.set(0, 0, 5);
    
    // Initialize WebGL renderer
    this.initWebGL(config);
    this.setupLighting();
    this.startRenderLoop();
  }

  private initWebGL(config: RenderConfig): void {
    if (!(this.canvas instanceof HTMLCanvasElement)) {
      // Honestidad V8 §30: este engine es WebGL en hilo principal. No existe
      // OffscreenCanvas ni worker real; si el canvas no sirve, va a 2D.
      console.warn('Kinetix3DEngine: canvas no utilizable, usando fallback 2D (sin OffscreenCanvas/workers)');
      this.initFallback();
      return;
    }

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: config.antialias,
      alpha: true,
      powerPreference: config.powerPreference,
      preserveDrawingBuffer: false
    });

    this.renderer.setPixelRatio(config.pixelRatio);
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.renderer.outputColorSpace = 'srgb-color-space';
    this.renderer.toneMappingExposure = 1.5;
  }

  private initFallback(): void {
    // 2D Canvas fallback for low-end devices
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#09090B';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private setupLighting(): void {
    // Kinetic lighting system - optimized for performance
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xD6FF2A, 1.2);
    keyLight.position.set(5, 5, 5);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x6366f1, 0.8);
    rimLight.position.set(-5, 3, -5);
    this.scene.add(rimLight);
  }

  private startRenderLoop(): void {
    const render = (time: number) => {
      if (!this.isRunning) return;

      // FPS calculation using independent measurement window
      this.framesInWindow++;
      const elapsed = time - this.fpsWindowStart;
      
      if (elapsed >= 1000) {
        // Calculate FPS from frames in the last 1000ms window
        this.fps = Math.round(this.framesInWindow / (elapsed / 1000));
        this.framesInWindow = 0;
        this.fpsWindowStart = time;
      }

      // Update animations
      this.updateScene(elapsed);

      // Render
      if (this.renderer) {
        this.renderer.render(this.scene, this.camera);
      }

      this.animationFrame = requestAnimationFrame(render);
    };

    this.isRunning = true;
    this.fpsWindowStart = performance.now();
    this.framesInWindow = 0;
    this.animationFrame = requestAnimationFrame(render);
  }

  private updateScene(deltaTime: number): void {
    // Optimized scene updates - only animate visible objects
    this.scene.traverse((object) => {
      if (object.userData.animate && object.userData.onUpdate) {
        object.userData.onUpdate(deltaTime);
      }
    });
  }

  public loadModel(url: string, onLoad?: (model: any) => void): void {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        
        // Optimize model for performance
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Enable LOD if available
            if (child.geometry) {
              child.geometry.computeVertexNormals();
            }
          }
        });

        this.scene.add(model);
        onLoad?.(model);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );
  }

  public resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    if (this.renderer) {
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }

  /**
   * Handle page visibility changes to pause/resume rendering
   * Call this from the parent component on visibilitychange event
   */
  public setVisibility(isVisible: boolean): void {
    if (isVisible && !this.isRunning) {
      this.startRenderLoop();
    } else if (!isVisible && this.isRunning) {
      this.stop();
    }
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  public dispose(): void {
    this.stop();
    
    // Properly dispose all GPU resources
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer = null;
    }
    
    // Dispose scene objects
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry?.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) 
            ? object.material 
            : [object.material];
          materials.forEach((mat) => mat.dispose());
        }
      }
    });
    
    // Clear scene
    while(this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }

  public getFPS(): number {
    return this.fps;
  }
}

// Auto-detect device capability for quality tier selection
export function getDeviceTier(): 'high' | 'medium' | 'low' {
  if (typeof window === 'undefined') return 'low';
  
  const devicePixelRatio = window.devicePixelRatio || 1;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const deviceMemory = (navigator as any).deviceMemory || 4;
  
  // High: modern devices with good GPU, 8+ cores, 4GB+ RAM
  if (devicePixelRatio >= 2 && hardwareConcurrency >= 8 && deviceMemory >= 4) {
    return 'high';
  }
  // Medium: mid-range devices
  if (devicePixelRatio >= 1.5 && hardwareConcurrency >= 4 && deviceMemory >= 2) {
    return 'medium';
  }
  // Low: older or low-end devices
  return 'low';
}

// Get quality settings based on device tier
export function getQualitySettings(tier: 'high' | 'medium' | 'low'): RenderConfig {
  switch (tier) {
    case 'high':
      return {
        targetFPS: 60,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        antialias: true,
        powerPreference: 'high-performance'
      };
    case 'medium':
      return {
        targetFPS: 30,
        pixelRatio: 1,
        antialias: true,
        powerPreference: 'default'
      };
    case 'low':
      return {
        targetFPS: 30,
        pixelRatio: 0.5,
        antialias: false,
        powerPreference: 'low-power'
      };
  }
}

export default Kinetix3DEngine;
