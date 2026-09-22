/* NepTuner offline store.

   The essential app files are copied to the device the first time it is opened
   and served from that copy afterwards. That is what lets it work in aeroplane
   mode. The browser still checks this same origin for updates.

   To publish a change, raise the version in CACHE, and in VERSION inside index.html. A device picks it up the next
   time the browser checks this file, or immediately if the reader presses the
   update button inside the app. */
const CACHE = 'neptuner-0.27';   // same string the app shows at its foot
const FILES = [
  './', './index.html', './pitch-engine.js', './manifest.webmanifest',
  './icon.svg', './icon.png', './icon-192.png',
  './icon-maskable-512.png', './apple-touch-icon.png'
];

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

/* Cache first. A same-origin network fallback is used only if an expected file
   is missing, for example during an interrupted first installation. */
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
