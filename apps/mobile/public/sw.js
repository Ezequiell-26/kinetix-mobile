const CACHE = "kinetixfitt-v3-voz";
const CORE = [
  "/",
  "/login",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/client/workout",
  "/client/progress",
  "/client/nutrition",
  "/audio/narrador-cuenta-regresiva.mp3",
  "/audio/narrador-arranque.mp3",
  "/audio/narrador-siguiente.mp3",
  "/audio/narrador-descanso.mp3",
  "/audio/narrador-mitad.mp3",
  "/audio/narrador-ultimo.mp3",
  "/audio/narrador-cierre.mp3",
  "/audio/narrador-hiit-trabaja.mp3",
  "/audio/narrador-hiit-descansa.mp3",
  "/audio/narrador-hiit-ultima.mp3",
  "/audio/narrador-hiit-fin.mp3",
  "/audio/narrador-racha.mp3",
  "/audio/narrador-checkin.mp3",  "/public/audio/voices/kinetixfitt/connectors/con.mp3",
  "/public/audio/voices/kinetixfitt/connectors/de.mp3",
  "/public/audio/voices/kinetixfitt/connectors/el.mp3",
  "/public/audio/voices/kinetixfitt/connectors/en.mp3",
  "/public/audio/voices/kinetixfitt/connectors/la.mp3",
  "/public/audio/voices/kinetixfitt/connectors/mas.mp3",
  "/public/audio/voices/kinetixfitt/connectors/para.mp3",
  "/public/audio/voices/kinetixfitt/connectors/tu.mp3",
  "/public/audio/voices/kinetixfitt/connectors/ultimas.mp3",
  "/public/audio/voices/kinetixfitt/connectors/una.mp3",
  "/public/audio/voices/kinetixfitt/connectors/y.mp3",
  "/public/audio/voices/kinetixfitt/countdown/preparate.mp3",
  "/public/audio/voices/kinetixfitt/countdown/tiempo.mp3",
  "/public/audio/voices/kinetixfitt/motivation/buen-trabajo.mp3",
  "/public/audio/voices/kinetixfitt/motivation/dale.mp3",
  "/public/audio/voices/kinetixfitt/motivation/manten-ritmo.mp3",
  "/public/audio/voices/kinetixfitt/motivation/muy-bien.mp3",
  "/public/audio/voices/kinetixfitt/motivation/no-aflojes.mp3",
  "/public/audio/voices/kinetixfitt/motivation/seguimos.mp3",
  "/public/audio/voices/kinetixfitt/motivation/ultima-vamos.mp3",
  "/public/audio/voices/kinetixfitt/motivation/ultima.mp3",
  "/public/audio/voices/kinetixfitt/motivation/una-mas.mp3",
  "/public/audio/voices/kinetixfitt/motivation/vamos-fuerte.mp3",
  "/public/audio/voices/kinetixfitt/motivation/vamos-suave.mp3",
  "/public/audio/voices/kinetixfitt/phrases/ejercicio-completado.mp3",
  "/public/audio/voices/kinetixfitt/phrases/record-personal.mp3",
  "/public/audio/voices/kinetixfitt/phrases/serie-completada.mp3",
  "/public/audio/voices/kinetixfitt/phrases/ultimas-dos.mp3",
  "/public/audio/voices/kinetixfitt/words/descansa.mp3",
  "/public/audio/voices/kinetixfitt/words/descanso.mp3",
  "/public/audio/voices/kinetixfitt/words/ejercicio.mp3",
  "/public/audio/voices/kinetixfitt/words/kilo.mp3",
  "/public/audio/voices/kinetixfitt/words/kilos.mp3",
  "/public/audio/voices/kinetixfitt/words/marca.mp3",
  "/public/audio/voices/kinetixfitt/words/minuto.mp3",
  "/public/audio/voices/kinetixfitt/words/minutos.mp3",
  "/public/audio/voices/kinetixfitt/words/peso.mp3",
  "/public/audio/voices/kinetixfitt/words/quedan.mp3",
  "/public/audio/voices/kinetixfitt/words/repeticion.mp3",
  "/public/audio/voices/kinetixfitt/words/repeticiones.mp3",
  "/public/audio/voices/kinetixfitt/words/ronda.mp3",
  "/public/audio/voices/kinetixfitt/words/segundo.mp3",
  "/public/audio/voices/kinetixfitt/words/segundos.mp3",
  "/public/audio/voices/kinetixfitt/words/serie.mp3",
  "/public/audio/voices/kinetixfitt/words/tiempo.mp3",
  "/public/audio/voices/kinetixfitt/words/trabajo.mp3",
];

// Background Sync queue for offline mutations
const BG_SYNC_QUEUE = [];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  
  // Never cache non-GET requests, but handle them with background sync
  if (e.request.method !== "GET") {
    if (url.pathname.startsWith("/api/")) {
      // Store failed requests for background sync
      e.respondWith(
        fetch(e.request).catch(() => {
          BG_SYNC_QUEUE.push({
            method: e.request.method,
            url: e.request.url,
            body: e.request.body ? e.request.clone().body : null,
            timestamp: Date.now(),
          });
          return new Response(JSON.stringify({ offline: true, queued: true }), {
            status: 202,
            headers: { 'Content-Type': 'application/json' }
          });
        })
      );
      return;
    }
    return;
  }
  
  if (url.origin !== location.origin) return;
  
  // Cache API GET requests for offline
  if (url.pathname.startsWith("/api/")) {
    e.respondWith(
      fetch(e.request).then((res)=>{
        const clone=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request, clone));
        return res;
      }).catch(()=> caches.match(e.request))
    );
    return;
  }
  
  // Stale-while-revalidate for static assets
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetchPromise = fetch(e.request)
        .then((res) => {
          if (res.ok && (res.headers.get("content-type") || "").match(/text|javascript|css|image|font|json/)) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => cached || caches.match("/login"));
      return cached || fetchPromise;
    })
  );
});

// Background Sync for offline workout logs (Granite)
self.addEventListener("sync", (e) => {
  if (e.tag === "sync-workout-logs") {
    e.waitUntil(
      // Process queued requests
      Promise.all(BG_SYNC_QUEUE.map(async (request) => {
        try {
          await fetch(request.url, {
            method: request.method,
            headers: { 'Content-Type': 'application/json' },
            body: request.body ? JSON.stringify(request.body) : null,
          });
          // Remove from queue on success
          const index = BG_SYNC_QUEUE.indexOf(request);
          if (index > -1) BG_SYNC_QUEUE.splice(index, 1);
        } catch (err) {
          console.error('Background sync failed:', err);
        }
      }))
    );
  }
});

// Push notifications
self.addEventListener("push", (e) => {
  const data = e.data?.json() ?? {};
  const title = data.title ?? 'KINETIXFITT';
  const options = {
    body: data.body ?? 'Nueva notificación',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url ?? '/client/dashboard',
      timestamp: Date.now(),
    },
    actions: [
      { action: 'open', title: 'Abrir' },
      { action: 'dismiss', title: 'Descartar' },
    ],
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener("notificationclick", (e) => {
  e.notification.close();

  if (e.action === 'dismiss') return;

  const urlToOpen = e.notification.data?.url ?? '/client/dashboard';

  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(urlToOpen);
    })
  );
});

// Message handler for skip waiting and other commands
self.addEventListener("message", (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (e.data && e.data.type === 'NOTIFICATION_CLICKED') {
    const urlToOpen = e.data.url || '/client/dashboard';
    e.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        for (const client of clients) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        return self.clients.openWindow(urlToOpen);
      })
    );
  }
});
