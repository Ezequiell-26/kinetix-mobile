/**
 * KinetixFit Service Worker
 * Implementación profesional con estrategias de caché avanzadas
 * Basado en Workbox patterns (MIT License)
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `kinetixfit-${CACHE_VERSION}`;
const OFFLINE_PAGE = '/offline.html';

// Recursos críticos para app shell
const APP_SHELL = [
  '/',
  '/offline.html',
  '/manifest.json',
];

// Estrategias de caché configurables
interface CacheStrategy {
  pattern: RegExp;
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate' | 'network-only' | 'cache-only';
  cacheName: string;
  maxEntries?: number;
  maxAgeSeconds?: number;
}

const STRATEGIES: CacheStrategy[] = [
  {
    pattern: /^\/$/,
    strategy: 'cache-first',
    cacheName: `${CACHE_NAME}-app-shell`,
    maxEntries: 10,
    maxAgeSeconds: 604800
  },
  {
    pattern: /\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|ico|webp)$/,
    strategy: 'cache-first',
    cacheName: `${CACHE_NAME}-static`,
    maxEntries: 200,
    maxAgeSeconds: 2592000
  },
  {
    pattern: /\/api\//,
    strategy: 'network-first',
    cacheName: `${CACHE_NAME}-api`,
    maxEntries: 100,
    maxAgeSeconds: 300
  },
  {
    pattern: /^https:\/\/.*\.(png|jpg|jpeg|gif|webp|svg)$/,
    strategy: 'stale-while-revalidate',
    cacheName: `${CACHE_NAME}-images`,
    maxEntries: 100,
    maxAgeSeconds: 604800
  },
  {
    pattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
    strategy: 'cache-first',
    cacheName: `${CACHE_NAME}-fonts`,
    maxEntries: 30,
    maxAgeSeconds: 31536000
  }
];

// === INSTALL EVENT ===

self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(APP_SHELL);
      })
      .then(() => {
        console.log('[SW] Installation complete, skipping waiting');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// === ACTIVATE EVENT ===

self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('kinetixfit-') && name !== CACHE_NAME)
            .map(name => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete, claiming clients');
        return self.clients.claim();
      })
  );
});

// === FETCH EVENT ===

self.addEventListener('fetch', (event: FetchEvent) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Solo manejar solicitudes del mismo origen o HTTPS
  if (url.protocol !== 'https:' && url.hostname !== location.hostname) {
    return;
  }
  
  // Encontrar estrategia correspondiente
  const strategy = STRATEGIES.find(s => s.pattern.test(url.href));
  
  if (strategy) {
    event.respondWith(handleRequest(request, strategy));
  } else {
    // Default: network first con fallback a caché
    event.respondWith(handleNetworkFirst(request));
  }
});

// === ESTRATEGIAS DE CACHÉ ===

async function handleRequest(request: Request, strategy: CacheStrategy): Promise<Response> {
  switch (strategy.strategy) {
    case 'cache-first':
      return handleCacheFirst(request, strategy);
    case 'network-first':
      return handleNetworkFirst(request, strategy);
    case 'stale-while-revalidate':
      return handleStaleWhileRevalidate(request, strategy);
    case 'network-only':
      return fetch(request);
    case 'cache-only':
      return handleCacheOnly(request, strategy);
    default:
      return fetch(request);
  }
}

async function handleCacheFirst(request: Request, strategy: CacheStrategy): Promise<Response> {
  const cache = await caches.open(strategy.cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Verificar si el caché está vencido
    if (strategy.maxAgeSeconds) {
      const cachedTime = getCachedTime(cachedResponse);
      const now = Date.now();
      
      if (now - cachedTime < strategy.maxAgeSeconds * 1000) {
        return cachedResponse;
      }
    } else {
      return cachedResponse;
    }
  }
  
  // Fetch desde red y actualizar caché
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache-first network failed:', error);
    
    // Fallback a página offline para navegaciones
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match(OFFLINE_PAGE);
      return offlinePage || new Response('Offline', { status: 503 });
    }
    
    throw error;
  }
}

async function handleNetworkFirst(request: Request, strategy?: CacheStrategy): Promise<Response> {
  const cache = strategy ? await caches.open(strategy.cacheName) : null;
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && cache) {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network first failed, trying cache:', error);
    
    if (cache) {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // Fallback a página offline para navegaciones
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match(OFFLINE_PAGE);
      return offlinePage || new Response('Offline', { status: 503 });
    }
    
    throw error;
  }
}

async function handleStaleWhileRevalidate(request: Request, strategy: CacheStrategy): Promise<Response> {
  const cache = await caches.open(strategy.cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch en background para actualizar
  const networkPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);
  
  // Retornar caché inmediatamente o esperar red
  return cachedResponse || networkPromise || new Response('Offline', { status: 503 });
}

async function handleCacheOnly(request: Request, strategy: CacheStrategy): Promise<Response> {
  const cache = await caches.open(strategy.cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  throw new Error('Resource not found in cache');
}

// === UTILS ===

function getCachedTime(response: Response): number {
  const cachedTime = response.headers.get('X-Cache-Time');
  return cachedTime ? parseInt(cachedTime, 10) : 0;
}

// Interceptar mensajes del cliente
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    event.waitUntil(
      caches.keys().then(names => 
        Promise.all(names.map(name => caches.delete(name)))
      )
    );
  }
});

// Background Sync (si está soportado)
self.addEventListener('sync', (event: ExtendableSyncEvent) => {
  console.log('[SW] Sync event:', event.tag);
  
  if (event.tag === 'sync-workout') {
    event.waitUntil(syncWorkouts());
  }
});

async function syncWorkouts(): Promise<void> {
  // Lógica de sincronización de entrenamientos
  console.log('[SW] Syncing workouts...');
}

// Push Notifications
self.addEventListener('push', (event: ExtendablePushEvent) => {
  console.log('[SW] Push received:', event);
  
  const data = event.data?.json() || {};
  const title = data.title || 'KinetixFit';
  const options = {
    body: data.body || 'Tienes una nueva notificación',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
    actions: [
      { action: 'open', title: 'Abrir' },
      { action: 'dismiss', title: 'Descartar' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notificación click handler
self.addEventListener('notificationclick', (event: ExtendableNotificationEvent) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(clientList => {
          for (const client of clientList) {
            if (client.url === event.notification.data && 'focus' in client) {
              return client.focus();
            }
          }
          
          if (clients.openWindow) {
            return clients.openWindow(event.notification.data);
          }
        })
    );
  }
});

console.log('[SW] Service Worker loaded');
