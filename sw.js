/* NepTuner offline store.

   The app is four files. They are copied to the device the first time it is
   opened and served from that copy every time after, so the tuner never asks
   the network for anything again. That is what lets it work in aeroplane mode,
   and it also means using it leaves no trail of requests behind.

   To publish a change, raise the version in CACHE, and in VERSION inside index.html. A device picks it up the next
   time the browser checks this file, or immediately if the reader presses the
   update button inside the app. */
const CACHE = 'neptuner-0.13';   // same string the app shows at its foot
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

/* Cache only. The network is reached solely if a file is somehow missing from
   the store, which for these four cannot happen after a successful install. */
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (request.mode === 'navigate'){
      return (await cache.match('./index.html')) || fetch(request);
    }
    return (await cache.match(request, { ignoreSearch: true })) || fetch(request);
  })());
});
