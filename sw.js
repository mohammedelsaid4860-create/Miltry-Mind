self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('military-store').then((cache) => cache.addAll([
      '/Miltry-Mind/',
      '/Miltry-Mind/index.html'
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
