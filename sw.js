/* Offline cache for NepTuner.

   The page itself is fetched network-first: an update shows on the next load
   instead of hiding behind the cache until the version name changes. The
   other three files are cache-first, since they rarely change. Offline, both
   fall back to the cache and the app works with no network at all. */
const CACHE = 'neptuner-v2';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.filter(nm => nm !== CACHE).map(nm => caches.delete(nm))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate'){
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put('./index.html', copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request)));
});
