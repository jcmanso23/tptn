const CACHE_NAME = 'topotino-v9';

const STATIC_ASSETS = [
  './index.html',
  './styles.css',
  './app.js',
  './missions.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './images/topotino.png',
  './images/topotino_buckingham.png',
  './images/buckingham.jpg',
  './images/stjames.jpg',
  './images/marblearch.jpg',
  './images/piccadilly.jpg',
  './images/trafalgar.jpg',
  './images/bigben.jpg',
  './images/westminster.jpg',
  './images/londoneye.jpg',
  './images/nhm.jpg',
  './images/leadenhall.jpg',
  './images/towerbridge.jpg',
  './images/coventgarden.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache core files; ignore missing optional images
      return Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(() => {})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // If offline and not cached, return nothing (graceful fail)
      });
    })
  );
});
