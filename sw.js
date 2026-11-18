/* SU Needle Matcher — offline-first service worker
 * Cache name bumped so devices pick up this version after deploy.
 * App matching / unlock logic is NOT in this file.
 */
const CACHE = 'su-needles-v106-offline';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './SU_Needle_Matcher_v1.06-protected.html',
  './SU_Needle_Matcher_v1.05-protected.html',
  './SU_Needle_Matcher_DEMO.html',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      /* Cache each asset individually so one missing file does not fail install */
      return Promise.all(
        ASSETS.map(function (url) {
          return cache.add(url).catch(function (err) {
            console.warn('[SU SW] skip', url, err && err.message);
          });
        })
      );
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE) return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  /* Only handle same-origin (this GitHub Pages site) */
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) {
        /* Cache-first: serve offline immediately; refresh cache in background when online */
        event.waitUntil(
          fetch(req).then(function (res) {
            if (res && res.ok) {
              return caches.open(CACHE).then(function (cache) {
                return cache.put(req, res.clone());
              });
            }
          }).catch(function () {})
        );
        return cached;
      }
      /* Not in cache yet — try network, then store */
      return fetch(req).then(function (res) {
        if (res && res.ok) {
          var clone = res.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(req, clone);
          });
        }
        return res;
      }).catch(function () {
        /* Offline and nothing cached: try start page / index fallbacks */
        return caches.match('./SU_Needle_Matcher_v1.06-protected.html')
          .then(function (r) {
            return r || caches.match('./SU_Needle_Matcher_v1.05-protected.html');
          })
          .then(function (r) {
            return r || caches.match('./index.html');
          })
          .then(function (r) {
            return r || new Response(
              'SU Needle Matcher is offline and this page is not in the cache yet. Open the site once online to finish installing.',
              { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
            );
          });
      });
    })
  );
});
