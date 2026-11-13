const CACHE = 'su-needles-v106';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './SU_Needle_Matcher_v1.06-protected.html',
  './SU_Needle_Matcher_DEMO.html',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
