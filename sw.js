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

// Estado del cronómetro en el service worker
let cronometroEstado = {
  tiempoMs: 0,
  activo: false,
  ultimaActualizacion: Date.now()
};

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

// Manejar mensajes desde la página principal
self.addEventListener('message', (event) => {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'CRONOMETRO_START':
        cronometroEstado.activo = true;
        cronometroEstado.ultimaActualizacion = Date.now();
        cronometroEstado.tiempoMs = event.data.tiempoMs || 0;
        break;

      case 'CRONOMETRO_STOP':
        cronometroEstado.activo = false;
        break;

      case 'CRONOMETRO_RESET':
        cronometroEstado.activo = false;
        cronometroEstado.tiempoMs = 0;
        break;

      case 'CRONOMETRO_GET_STATE':
        // Enviar estado actual al cliente
        event.ports[0].postMessage({
          type: 'CRONOMETRO_STATE',
          estado: cronometroEstado
        });
        break;
    }
  }
});

// Mantener el cronómetro funcionando en background
setInterval(() => {
  if (cronometroEstado.activo) {
    const ahora = Date.now();
    const tiempoTranscurrido = ahora - cronometroEstado.ultimaActualizacion;
    cronometroEstado.tiempoMs += tiempoTranscurrido;
    cronometroEstado.ultimaActualizacion = ahora;

    // Enviar actualización a todos los clientes conectados
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'CRONOMETRO_UPDATE',
          tiempoMs: cronometroEstado.tiempoMs
        });
      });
    });
  }
}, 10); // Actualizar cada 10ms como el cronómetro original