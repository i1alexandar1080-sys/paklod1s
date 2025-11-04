const CACHE_NAME = 'nadec-app-cache-v1';

// A simple service worker for PWA installability.
// Caches the main page on install.
// Responds with cached content when available, otherwise fetches from network.

self.addEventListener('install', (event) => {
  // A simple install event to make the app installable.
  // For a full offline experience, you'd cache more assets here.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // A fetch handler is required for the app to be installable.
  // This strategy is cache-first.
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
