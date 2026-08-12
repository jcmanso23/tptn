const CACHE_NAME = 'topotino-offline-v16';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css?v=memory-v30',
  '/app.js?v=memory-v30',
  '/chat-format.js?v=memory-v30',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/images/topotino.png?v=marco-v1',
  '/content/episodes.json?v=memory-v30'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    precacheStory()
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(networkFirst(event.request));
});

async function precacheStory() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.allSettled(CORE_ASSETS.map((asset) => cacheOne(cache, asset)));

  try {
    const response = await fetch('/content/episodes.json?v=memory-v30', { cache: 'no-store' });
    if (!response.ok) return;
    const manifest = await response.clone().json();
    await cache.put('/content/episodes.json?v=memory-v30', response);
    await Promise.allSettled(
      manifest.map((episode) => cacheOne(cache, `/${episode.file}`))
    );
  } catch {
    // A later online visit will fill any missing runtime entries.
  }
}

async function cacheOne(cache, url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (response.ok) await cache.put(url, response);
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: false });
    if (cached) return cached;

    if (request.mode === 'navigate') {
      return cache.match('/index.html');
    }

    return new Response('Sin conexión y recurso no disponible.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}
