/* SU Needle Matcher — service worker v1.05 */
const CACHE = 'su-needles-v1.05';
const ASSETS = [
  './', './index.html',
  './SU_Needle_Matcher_v1.05-protected.html',
  './SU_Needle_Matcher_v1.05.html',
  './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png', './favicon-32.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(ASSETS.map((url) => cache.add(url).catch((err) => console.log('skip', url, err))))
    ).then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      }).catch(() =>
        caches.match('./SU_Needle_Matcher_v1.05-protected.html').then((r) =>
          r || caches.match('./SU_Needle_Matcher_v1.05.html')
        )
      );
    })
  );
});
