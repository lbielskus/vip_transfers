// Service Worker for VIP Transfer Service PWA
// NOTE: Avoid caching page routes like "/login" on Vercel/Next.js.
// Caching navigations often results in opaqueredirect errors and broken routing.
const CACHE_NAME = 'vip-transfers-v2';

// Precache only core shell and immutable static assets
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Always use the network for navigations so Next.js routing works on Vercel
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedRoot = await cache.match('/');
        return cachedRoot || Response.error();
      })
    );
    return;
  }

  // For same-origin static assets, use cache-first
  const url = new URL(request.url);
  const isSameOrigin = url.origin === location.origin;
  const isStaticAsset =
    /\.(?:js|css|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot)$/i.test(url.pathname) ||
    url.pathname.startsWith('/_next/static/');

  if (isSameOrigin && isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
          return response;
        });
      })
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
          return undefined;
        })
      )
    )
  );
  self.clients.claim();
});

