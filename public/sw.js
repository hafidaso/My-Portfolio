const CACHE_NAME = 'hafida-portfolio-v1.2.0';
const STATIC_CACHE = 'hafida-static-v1.2.0';
const DYNAMIC_CACHE = 'hafida-dynamic-v1.2.0';

// Critical resources to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/favicon.ico',
  // Critical CSS and fonts will be cached at runtime
];

// Routes to cache for offline functionality
const CACHE_ROUTES = [
  '/',
  '/blog',
  '/projects',
  '/data-science',
  '/websites',
  '/graphics',
];

// Install event - precache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, CACHE_NAME].includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - implement cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external APIs except for specific ones
  if (url.origin !== self.location.origin && 
      !url.hostname.includes('fonts.googleapis.com') &&
      !url.hostname.includes('fonts.gstatic.com') &&
      !url.hostname.includes('github-readme-stats.vercel.app')) {
    return;
  }

  // Handle different resource types with appropriate strategies
  if (url.pathname.startsWith('/api/')) {
    // API routes - Network first with fallback
    event.respondWith(networkFirstWithFallback(request));
  } else if (url.pathname.match(/\.(css|js|woff2?|ttf|eot)$/)) {
    // Static assets - Cache first
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|avif)$/)) {
    // Images - Cache first with network fallback
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (CACHE_ROUTES.some(route => url.pathname.startsWith(route))) {
    // App routes - Network first with cache fallback
    event.respondWith(networkFirstWithCacheFallback(request));
  } else {
    // Everything else - Network only
    return;
  }
});

// Cache strategies
async function cacheFirst(request, cacheName = STATIC_CACHE) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Return cached version immediately, update in background
      updateCacheInBackground(request, cache);
      return cachedResponse;
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('Cache first strategy failed:', error);
    return fetch(request);
  }
}

async function networkFirstWithCacheFallback(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    try {
      // Try network first
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      }
    } catch (networkError) {
      console.warn('Network request failed, trying cache:', networkError);
    }
    
    // Fall back to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/') || new Response('Offline', { status: 503 });
    }
    
    throw new Error('No network and no cache available');
  } catch (error) {
    console.error('Network first strategy failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.warn('Network request failed for API:', error);
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // Silent fail for background updates
  }
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'GET_VERSION':
        event.ports[0].postMessage({ version: CACHE_NAME });
        break;
      case 'CLEAR_CACHE':
        clearAllCaches().then(() => {
          event.ports[0].postMessage({ success: true });
        });
        break;
    }
  }
});

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
}

// Performance monitoring
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/performance')) {
    event.respondWith(
      new Response(JSON.stringify({
        cacheHits: 0, // You can implement actual metrics
        networkRequests: 0,
        timestamp: Date.now()
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    );
  }
});
