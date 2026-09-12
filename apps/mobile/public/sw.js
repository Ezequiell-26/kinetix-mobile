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
  "/audio/narrador-checkin.mp3",  "/public/audio/voices/ezequiel/connectors/con.mp3",
  "/public/audio/voices/ezequiel/connectors/de.mp3",
  "/public/audio/voices/ezequiel/connectors/el.mp3",
  "/public/audio/voices/ezequiel/connectors/en.mp3",
  "/public/audio/voices/ezequiel/connectors/la.mp3",
  "/public/audio/voices/ezequiel/connectors/mas.mp3",
  "/public/audio/voices/ezequiel/connectors/para.mp3",
  "/public/audio/voices/ezequiel/connectors/tu.mp3",
  "/public/audio/voices/ezequiel/connectors/ultimas.mp3",
  "/public/audio/voices/ezequiel/connectors/una.mp3",
  "/public/audio/voices/ezequiel/connectors/y.mp3",
  "/public/audio/voices/ezequiel/countdown/preparate.mp3",
  "/public/audio/voices/ezequiel/countdown/tiempo.mp3",
  "/public/audio/voices/ezequiel/motivation/buen-trabajo.mp3",
  "/public/audio/voices/ezequiel/motivation/dale.mp3",
  "/public/audio/voices/ezequiel/motivation/manten-ritmo.mp3",
  "/public/audio/voices/ezequiel/motivation/muy-bien.mp3",
  "/public/audio/voices/ezequiel/motivation/no-aflojes.mp3",
  "/public/audio/voices/ezequiel/motivation/seguimos.mp3",
  "/public/audio/voices/ezequiel/motivation/ultima-vamos.mp3",
  "/public/audio/voices/ezequiel/motivation/ultima.mp3",
  "/public/audio/voices/ezequiel/motivation/una-mas.mp3",
  "/public/audio/voices/ezequiel/motivation/vamos-fuerte.mp3",
  "/public/audio/voices/ezequiel/motivation/vamos-suave.mp3",
  "/public/audio/voices/ezequiel/phrases/ejercicio-completado.mp3",
  "/public/audio/voices/ezequiel/phrases/record-personal.mp3",
  "/public/audio/voices/ezequiel/phrases/serie-completada.mp3",
  "/public/audio/voices/ezequiel/phrases/ultimas-dos.mp3",
  "/public/audio/voices/ezequiel/words/descansa.mp3",
  "/public/audio/voices/ezequiel/words/descanso.mp3",
  "/public/audio/voices/ezequiel/words/ejercicio.mp3",
  "/public/audio/voices/ezequiel/words/kilo.mp3",
  "/public/audio/voices/ezequiel/words/kilos.mp3",
  "/public/audio/voices/ezequiel/words/marca.mp3",
  "/public/audio/voices/ezequiel/words/minuto.mp3",
  "/public/audio/voices/ezequiel/words/minutos.mp3",
  "/public/audio/voices/ezequiel/words/peso.mp3",
  "/public/audio/voices/ezequiel/words/quedan.mp3",
  "/public/audio/voices/ezequiel/words/repeticion.mp3",
  "/public/audio/voices/ezequiel/words/repeticiones.mp3",
  "/public/audio/voices/ezequiel/words/ronda.mp3",
  "/public/audio/voices/ezequiel/words/segundo.mp3",
  "/public/audio/voices/ezequiel/words/segundos.mp3",
  "/public/audio/voices/ezequiel/words/serie.mp3",
  "/public/audio/voices/ezequiel/words/tiempo.mp3",
  "/public/audio/voices/ezequiel/words/trabajo.mp3",
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
