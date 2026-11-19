// ThoughtTree Offline Service Worker (ADR-042 — v2.31)
const CACHE = 'thoughttree-pwa-v31';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const reqUrl = new URL(event.request.url);
  if (reqUrl.origin !== self.location.origin) return;

  // Stale-While-Revalidate (Cache-First) for instant <30ms mobile PWA launch + silent background updates
  event.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(event.request).then((cachedRes) => {
        const netPromise = fetch(event.request).then((netRes) => {
          if (netRes && netRes.status === 200) {
            cache.put(event.request, netRes.clone()).catch(() => {});
          }
          return netRes;
        }).catch(() => cachedRes);

        return cachedRes || netPromise;
      })
    )
  );
});
