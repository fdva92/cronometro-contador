// Service Worker básico para PWA
const CACHE_NAME = 'cronometro-v1';
const urlsToCache = [
  'https://fdva92.github.io/cronometro-contador/',
  'https://fdva92.github.io/cronometro-contador/index.html',
  'https://fdva92.github.io/cronometro-contador/styles.css',
  'https://fdva92.github.io/cronometro-contador/01.js',
  'https://fdva92.github.io/cronometro-contador/manifest.json',
  'https://fdva92.github.io/cronometro-contador/cronometro.png',
  'https://fdva92.github.io/cronometro-contador/icon-192.png',
  'https://fdva92.github.io/cronometro-contador/icon-512.png'
];

// Instalación del service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar las peticiones
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retornar la respuesta cacheada si existe, sino hacer la petición
        return response || fetch(event.request);
      })
  );
});