const CACHE = "ezequiel-v3-voz";
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
];
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
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  // Never cache API mutations, but cache GET api for offline
  if (url.pathname.startsWith("/api/") && e.request.method === "GET") {
    e.respondWith(
      fetch(e.request).then((res)=>{
        const clone=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request, clone));
        return res;
      }).catch(()=> caches.match(e.request))
    );
    return;
  }
  if (url.pathname.startsWith("/api/")) return;
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
      // Will be handled by client-side sync in granite-offline.tsx
      Promise.resolve()
    );
  }
});
