const CACHE_NAME = 'my-portfolio-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/vercel.svg',
  // CSS & JS (add your actual CSS/JS files if different)
  '/styles.css',
  '/main.js',
  // Manifest icons
  '/icons/icon-16x16.png',
  '/icons/icon-32x32.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Audio
  '/beethoven-fur-elise-relaxing-classical-piano-268551.mp3',
  // Add more assets as needed
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(cached => {
          if (cached) return cached;
          if (event.request.destination === 'image') {
            return caches.match('/icons/icon-192x192.png');
          }
          if (event.request.destination === 'audio') {
            return new Response('', { status: 200 });
          }
          return new Response('Offline', { status: 503 });
        })
      )
  );
});
