/* KINETIXFITT Service Worker — Workbox offline-first */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

const CACHE_VERSION = 'kinetixfitt-v4-workbox';
const OFFLINE_URL = '/offline.html';

// Workbox core config
if (self.workbox) {
  console.log('[SW] Workbox loaded — ' + CACHE_VERSION);

  workbox.core.setCacheNameDetails({
    prefix: 'kinetixfitt',
    suffix: CACHE_VERSION,
    precache: 'precache',
    runtime: 'runtime',
  });

  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // -------------------------------------------------------------
  // 1) PRECACHE — 10 rutas críticas (offline shell)
  // -------------------------------------------------------------
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: 'v4' },
    { url: '/login', revision: 'v4' },
    { url: '/offline.html', revision: 'v4' },
    { url: '/manifest.json', revision: 'v4' },
    { url: '/client/dashboard', revision: 'v4' },
    { url: '/client/workout', revision: 'v4' },
    { url: '/client/progress', revision: 'v4' },
    { url: '/client/nutrition', revision: 'v4' },
    { url: '/icons/icon-192.png', revision: 'v4' },
    { url: '/icons/icon-512.png', revision: 'v4' },
  ]);

  // Install fallback for navigation that is not precached: warm cache
  workbox.precaching.installListener;

  // Clean old precaches
  workbox.precaching.cleanupOutdatedCaches();

  // -------------------------------------------------------------
  // 2) CacheFirst para /exercises/* — imágenes y media de ejercicios
  //    Ideal porque son estáticos, pesados y no cambian seguido.
  // -------------------------------------------------------------
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/exercises/'),
    new workbox.strategies.CacheFirst({
      cacheName: 'exercises-cache-' + CACHE_VERSION,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 150,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
          purgeOnQuotaError: true,
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // También CacheFirst para imágenes del CDN de ejercicios y data JSON
  workbox.routing.registerRoute(
    ({ request, url }) =>
      request.destination === 'image' &&
      (url.pathname.includes('/exercises') || url.pathname.includes('/data/')),
    new workbox.strategies.CacheFirst({
      cacheName: 'exercises-images-' + CACHE_VERSION,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );

  // -------------------------------------------------------------
  // 3) NetworkFirst para /api/* — datos dinámicos con fallback a cache
  // -------------------------------------------------------------
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache-' + CACHE_VERSION,
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 80,
          maxAgeSeconds: 5 * 60, // 5 minutos — fresco pero disponible offline
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // -------------------------------------------------------------
  // 4) StaleWhileRevalidate para assets estáticos (_next, css, js, fonts)
  // -------------------------------------------------------------
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'font' ||
      request.destination === 'image',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-assets-' + CACHE_VERSION,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 80,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        }),
      ],
    })
  );

  // -------------------------------------------------------------
  // 5) NetworkFirst para navegaciones (document) — fallback a offline.html
  // -------------------------------------------------------------
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache-' + CACHE_VERSION,
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 24 * 60 * 60,
        }),
      ],
    })
  );

  // Fallback global: si una navegación falla, servir offline.html precacheado
  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === 'document' || event.request.mode === 'navigate') {
      const cached = await caches.match(OFFLINE_URL);
      if (cached) return cached;
      // fallback a / si offline.html no está
      return caches.match('/');
    }
    return Response.error();
  });

  // -------------------------------------------------------------
  // 6) Google Fonts — CacheFirst con expiración larga
  // -------------------------------------------------------------
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts-' + CACHE_VERSION,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );

} else {
  console.warn('[SW] Workbox no cargó — fallback manual mínimo');
  self.addEventListener('install', (e) => {
    e.waitUntil(
      caches.open(CACHE_VERSION).then((c) => c.addAll([OFFLINE_URL, '/', '/login'])).then(() => self.skipWaiting())
    );
  });
  self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
  });
}

// -----------------------------------------------------------------
// Background Sync queue para mutaciones offline (/api/* POST/PUT)
// -----------------------------------------------------------------
const BG_SYNC_QUEUE = [];

self.addEventListener('fetch', (event) => {
  // Solo interceptar mutaciones offline cuando Workbox no pudo (fallback del else)
  // Cuando Workbox está activo, las GET ya están manejadas arriba.
  // Aquí solo nos ocupamos de métodos no-GET para cola offline.
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' && url.pathname.startsWith('/api/') && url.origin === location.origin) {
    event.respondWith(
      fetch(event.request.clone()).catch(() => {
        BG_SYNC_QUEUE.push({
          method: event.request.method,
          url: event.request.url,
          timestamp: Date.now(),
        });
        return new Response(JSON.stringify({ offline: true, queued: true }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-workout-logs') {
    event.waitUntil(
      Promise.all(
        BG_SYNC_QUEUE.map(async (req) => {
          try {
            await fetch(req.url, { method: req.method, headers: { 'Content-Type': 'application/json' } });
            const idx = BG_SYNC_QUEUE.indexOf(req);
            if (idx > -1) BG_SYNC_QUEUE.splice(idx, 1);
          } catch (err) {
            console.error('[SW] Background sync failed:', err);
          }
        })
      )
    );
  }
});

// -----------------------------------------------------------------
// Push notifications + click handler (se mantiene intacto)
// -----------------------------------------------------------------
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title ?? 'KINETIXFITT';
  const options = {
    body: data.body ?? 'Nueva notificación',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url ?? '/client/dashboard', timestamp: Date.now() },
    actions: [
      { action: 'open', title: 'Abrir' },
      { action: 'dismiss', title: 'Descartar' },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const urlToOpen = event.notification.data?.url ?? '/client/dashboard';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(urlToOpen) && 'focus' in client) return client.focus();
      }
      return self.clients.openWindow(urlToOpen);
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'NOTIFICATION_CLICKED') {
    const urlToOpen = event.data.url || '/client/dashboard';
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        for (const client of clients) {
          if (client.url.includes(urlToOpen) && 'focus' in client) return client.focus();
        }
        return self.clients.openWindow(urlToOpen);
      })
    );
  }
});
