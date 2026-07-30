const CACHE_NAME = 'yuan-workbench-v1';
const urlsToCache = [
  './yuan工作台.html',
  './manifest.json',
  './icon-192.png',
  './icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).catch(() => {
        // If offline and trying to access external resources, return a fallback
        if (event.request.url.includes('chart.js')) {
          // Return an empty script or placeholder
          return new Response('', { headers: { 'Content-Type': 'application/javascript' } });
        }
      });
    })
  );
});
