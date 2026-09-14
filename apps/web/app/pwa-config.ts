/**
 * KinetixFit PWA Configuration - Progressive Web App Profesional
 * Basado en workbox, next-pwa, y mejores prácticas MIT de PWAs
 * 
 * Características:
 * - Service Worker con estrategias de caché avanzadas
 * - Offline-first con sincronización inteligente
 * - Instalación 1-click
 * - Notificaciones push
 * - Background sync
 * - App shell architecture
 */

// === MANIFEST CONFIGURATION ===

export const manifest = {
  name: 'KinetixFit - Tu Entrenador Inteligente',
  short_name: 'KinetixFit',
  description: 'La plataforma todo-en-uno que combina ciencia del deporte, IA personalizada y comunidad',
  start_url: '/',
  display: 'standalone',
  background_color: '#0f172a',
  theme_color: '#10b981',
  orientation: 'portrait-primary',
  icons: [
    {
      src: '/icons/icon-72x72.png',
      sizes: '72x72',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-96x96.png',
      sizes: '96x96',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-128x128.png',
      sizes: '128x128',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-144x144.png',
      sizes: '144x144',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-152x152.png',
      sizes: '152x152',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-384x384.png',
      sizes: '384x384',
      type: 'image/png',
      purpose: 'maskable any'
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable any'
    }
  ],
  categories: ['health', 'fitness', 'lifestyle'],
  lang: 'es',
  dir: 'ltr',
  scope: '/',
  prefer_related_applications: false,
  shortcuts: [
    {
      name: 'Iniciar Entrenamiento',
      short_name: 'Entrenar',
      description: 'Comienza tu sesión de entrenamiento',
      url: '/workout/start',
      icons: [{ src: '/icons/shortcut-workout.png', sizes: '96x96' }]
    },
    {
      name: 'Ver Progreso',
      short_name: 'Progreso',
      description: 'Revisa tu progreso y estadísticas',
      url: '/dashboard',
      icons: [{ src: '/icons/shortcut-progress.png', sizes: '96x96' }]
    },
    {
      name: 'Nutrición',
      short_name: 'Comida',
      description: 'Registra tus comidas',
      url: '/nutrition',
      icons: [{ src: '/icons/shortcut-nutrition.png', sizes: '96x96' }]
    }
  ],
  screenshots: [
    {
      src: '/screenshots/dashboard.png',
      sizes: '1280x720',
      type: 'image/png',
      form_factor: 'wide',
      label: 'Dashboard Principal'
    },
    {
      src: '/screenshots/workout.png',
      sizes: '750x1334',
      type: 'image/png',
      form_factor: 'narrow',
      label: 'Entrenamiento en Curso'
    }
  ],
  share_target: {
    action: '/share',
    method: 'POST',
    enctype: 'multipart/form-data',
    params: {
      title: 'title',
      text: 'text',
      url: 'url',
      files: [
        {
          name: 'photos',
          accept: ['image/*', 'video/*']
        }
      ]
    }
  }
};

// === SERVICE WORKER CACHE STRATEGIES ===

export interface CacheStrategy {
  pattern: RegExp;
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate' | 'network-only' | 'cache-only';
  cacheName: string;
  maxEntries?: number;
  maxAgeSeconds?: number;
}

export const cacheStrategies: CacheStrategy[] = [
  // App Shell - Cache First
  {
    pattern: /^\/$/,
    strategy: 'cache-first',
    cacheName: 'app-shell',
    maxEntries: 10,
    maxAgeSeconds: 86400 * 7 // 7 días
  },
  
  // Static Assets - Cache First
  {
    pattern: /\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|ico|webp)$/,
    strategy: 'cache-first',
    cacheName: 'static-assets',
    maxEntries: 200,
    maxAgeSeconds: 86400 * 30 // 30 días
  },
  
  // API Requests - Network First with fallback
  {
    pattern: /\/api\//,
    strategy: 'network-first',
    cacheName: 'api-cache',
    maxEntries: 100,
    maxAgeSeconds: 300 // 5 minutos
  },
  
  // Images from external sources - Stale While Revalidate
  {
    pattern: /^https:\/\/.*\.(png|jpg|jpeg|gif|webp|svg)$/,
    strategy: 'stale-while-revalidate',
    cacheName: 'external-images',
    maxEntries: 100,
    maxAgeSeconds: 86400 * 7
  },
  
  // Google Fonts - Cache First
  {
    pattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
    strategy: 'cache-first',
    cacheName: 'google-fonts',
    maxEntries: 30,
    maxAgeSeconds: 86400 * 365 // 1 año
  }
];

// === OFFLINE PAGE ===

export const offlinePage = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sin Conexión - KinetixFit</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      text-align: center;
      max-width: 500px;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #10b981, #14b8a6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      font-size: 1.1rem;
      color: #94a3b8;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    .icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.8;
    }
    button {
      background: linear-gradient(135deg, #10b981, #14b8a6);
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 12px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
    }
    .cached-pages {
      margin-top: 2rem;
      padding: 1.5rem;
      background: rgba(255,255,255,0.05);
      border-radius: 12px;
    }
    .cached-pages h3 {
      font-size: 1rem;
      margin-bottom: 1rem;
      color: #10b981;
    }
    .cached-pages ul {
      list-style: none;
      text-align: left;
    }
    .cached-pages li {
      padding: 0.5rem 0;
      color: #94a3b8;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .cached-pages li:last-child {
      border-bottom: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📡</div>
    <h1>Sin Conexión</h1>
    <p>Parece que estás offline. No te preocupes, algunas funciones siguen disponibles sin conexión.</p>
    <button onclick="window.location.reload()">Reintentar Conexión</button>
    
    <div class="cached-pages">
      <h3>Disponible Offline:</h3>
      <ul>
        <li>✓ Dashboard principal</li>
        <li>✓ Historial de entrenamientos</li>
        <li>✓ Rutinas guardadas</li>
        <li>✓ Estadísticas personales</li>
        <li>✓ Configuración de perfil</li>
      </ul>
    </div>
  </div>
</body>
</html>
`;

// === BACKGROUND SYNC TASKS ===

export interface SyncTask {
  id: string;
  type: 'workout-log' | 'nutrition-entry' | 'progress-update' | 'message-send';
  data: any;
  timestamp: number;
  retryCount: number;
}

export class BackgroundSyncManager {
  private readonly STORAGE_KEY = 'kinetix_sync_queue';
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 5000; // 5 segundos

  public async queueTask(task: Omit<SyncTask, 'timestamp' | 'retryCount'>): Promise<void> {
    const fullTask: SyncTask = {
      ...task,
      timestamp: Date.now(),
      retryCount: 0
    };

    const queue = this.getQueue();
    queue.push(fullTask);
    this.saveQueue(queue);

    // Intentar sincronizar inmediatamente si hay conexión
    if (navigator.onLine) {
      this.processQueue();
    }
  }

  public async processQueue(): Promise<void> {
    const queue = this.getQueue();
    const failedTasks: SyncTask[] = [];

    for (const task of queue) {
      try {
        await this.executeTask(task);
      } catch (error) {
        console.error(`Sync task ${task.id} failed:`, error);
        task.retryCount++;
        
        if (task.retryCount < this.MAX_RETRIES) {
          failedTasks.push(task);
        }
      }
    }

    this.saveQueue(failedTasks);
  }

  private async executeTask(task: SyncTask): Promise<void> {
    // Simulación de envío al servidor
    // En producción, esto haría un fetch real al backend
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) { // 80% éxito simulado
          resolve();
        } else {
          reject(new Error('Network error'));
        }
      }, 1000);
    });
  }

  private getQueue(): SyncTask[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveQueue(queue: SyncTask[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue));
  }

  public getQueueLength(): number {
    return this.getQueue().length;
  }

  public clearQueue(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// === PUSH NOTIFICATIONS ===

export class PushNotificationManager {
  private readonly VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY_HERE';

  public async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    return Notification.requestPermission();
  }

  public async subscribe(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY)
      });

      // Enviar suscripción al servidor
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      return null;
    }
  }

  public async unsubscribe(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }

    return false;
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    // Enviar al backend para guardar la suscripción
    console.log('Push subscription:', subscription);
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  public showNotification(title: string, options?: NotificationOptions): void {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        ...options
      });
    }
  }
}

// === INSTALL PROMPT MANAGER ===

export class InstallPromptManager {
  private deferredPrompt: any = null;
  private onStateChange?: (installed: boolean) => void;

  public init(onStateChange?: (installed: boolean) => void): void {
    this.onStateChange = onStateChange;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.onStateChange?.(false);
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.onStateChange?.(true);
    });
  }

  public canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  public async prompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    this.deferredPrompt.prompt();
    
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;

    return outcome === 'accepted';
  }

  public isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (navigator as any).standalone === true;
  }
}

// === SINGLETON INSTANCES ===

export const syncManager = new BackgroundSyncManager();
export const pushManager = new PushNotificationManager();
export const installManager = new InstallPromptManager();

// === SERVICE WORKER REGISTRATION HELPER ===

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    // Actualizar SW si hay cambios
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nuevo contenido disponible
            console.log('New content available, please refresh.');
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('SW registration failed:', error);
    return null;
  }
}
