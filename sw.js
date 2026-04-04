// Service Worker avanzado para cronómetro con notificaciones
const CACHE_NAME = 'cronometro-v2';
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

// Estado persistente del cronómetro
let cronometroEstado = {
  tiempoMs: 0,
  activo: false,
  ultimaActualizacion: Date.now(),
  contadorVueltas: 0,
  colorActual: 'color-1',
  ultimaNotificacion: 0
};

// Intervalos para el timer y notificaciones
let timerInterval;
let notificationInterval;

// Función para guardar estado en IndexedDB
async function guardarEstadoIndexedDB() {
  try {
    const db = await openIndexedDB();
    const transaction = db.transaction(['cronometro'], 'readwrite');
    const store = transaction.objectStore('cronometro');
    await store.put(cronometroEstado, 'estado');
    db.close();
  } catch (error) {
    console.error('Error guardando estado en IndexedDB:', error);
  }
}

// Función para cargar estado desde IndexedDB
async function cargarEstadoIndexedDB() {
  try {
    const db = await openIndexedDB();
    const transaction = db.transaction(['cronometro'], 'readonly');
    const store = transaction.objectStore('cronometro');
    const estado = await store.get('estado');
    db.close();
    return estado.result || cronometroEstado;
  } catch (error) {
    console.error('Error cargando estado desde IndexedDB:', error);
    return cronometroEstado;
  }
}

// Función para abrir IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CronometroDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('cronometro')) {
        db.createObjectStore('cronometro');
      }
    };
  });
}

// Función para mostrar notificación
async function mostrarNotificacion(tiempoFormateado, esPeriodica = false) {
  try {
    const titulo = esPeriodica ? '⏱️ Cronómetro Activo' : '⏱️ Cronómetro Continúa';
    const opciones = {
      body: `Tiempo: ${tiempoFormateado}\nVueltas: ${cronometroEstado.contadorVueltas}`,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'cronometro-timer',
      requireInteraction: false,
      silent: esPeriodica, // Las notificaciones periódicas son silenciosas
      actions: [
        {
          action: 'stop',
          title: 'Detener'
        },
        {
          action: 'view',
          title: 'Ver'
        }
      ]
    };

    await self.registration.showNotification(titulo, opciones);
  } catch (error) {
    console.error('Error mostrando notificación:', error);
  }
}

// Función para formatear tiempo
function formatTime(ms) {
  const minutos = Math.floor(ms / 60000);
  const segundos = Math.floor((ms % 60000) / 1000);
  const centesimas = Math.floor((ms % 1000) / 10);
  const mm = String(minutos).padStart(2, "0");
  const ss = String(segundos).padStart(2, "0");
  const cs = String(centesimas).padStart(2, "0");
  return `${mm}:${ss}:${cs}`;
}

// Función para iniciar el timer
function iniciarTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(async () => {
    if (cronometroEstado.activo) {
      const ahora = Date.now();
      const tiempoTranscurrido = ahora - cronometroEstado.ultimaActualizacion;
      cronometroEstado.tiempoMs += tiempoTranscurrido;
      cronometroEstado.ultimaActualizacion = ahora;

      // Guardar estado cada segundo
      if (cronometroEstado.tiempoMs % 1000 < 10) {
        await guardarEstadoIndexedDB();
      }

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
  }, 10);
}

// Función para iniciar notificaciones periódicas
function iniciarNotificaciones() {
  if (notificationInterval) return;

  notificationInterval = setInterval(async () => {
    if (cronometroEstado.activo) {
      const ahora = Date.now();
      // Mostrar notificación cada 30 segundos
      if (ahora - cronometroEstado.ultimaNotificacion >= 30000) {
        const tiempoFormateado = formatTime(cronometroEstado.tiempoMs);
        await mostrarNotificacion(tiempoFormateado, true);
        cronometroEstado.ultimaNotificacion = ahora;
        await guardarEstadoIndexedDB();
      }
    }
  }, 5000); // Verificar cada 5 segundos
}

// Función para detener el timer
function detenerTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Función para detener notificaciones
function detenerNotificaciones() {
  if (notificationInterval) {
    clearInterval(notificationInterval);
    notificationInterval = null;
  }
}

// Instalación del service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalándose...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Forzar activación inmediata
});

// Activación del service worker
self.addEventListener('activate', async (event) => {
  console.log('Service Worker activándose...');
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Cargar estado guardado
      cargarEstadoIndexedDB().then(estado => {
        if (estado) {
          cronometroEstado = { ...cronometroEstado, ...estado };
          console.log('Estado cargado:', cronometroEstado);

          // Si el cronómetro estaba activo, continuar
          if (cronometroEstado.activo) {
            iniciarTimer();
            iniciarNotificaciones();
            // Mostrar notificación de reanudación
            mostrarNotificacion(formatTime(cronometroEstado.tiempoMs), false);
          }
        }
      })
    ])
  );

  // Tomar control de todos los clientes
  self.clients.claim();
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
self.addEventListener('message', async (event) => {
  if (event.data && event.data.type) {
    console.log('Mensaje recibido:', event.data.type);

    switch (event.data.type) {
      case 'CRONOMETRO_START':
        cronometroEstado.activo = true;
        cronometroEstado.ultimaActualizacion = Date.now();
        cronometroEstado.tiempoMs = event.data.tiempoMs || 0;
        cronometroEstado.contadorVueltas = event.data.contadorVueltas || 0;
        cronometroEstado.colorActual = event.data.colorActual || 'color-1';

        iniciarTimer();
        iniciarNotificaciones();
        await mostrarNotificacion(formatTime(cronometroEstado.tiempoMs), false);
        await guardarEstadoIndexedDB();
        break;

      case 'CRONOMETRO_STOP':
        cronometroEstado.activo = false;
        detenerTimer();
        detenerNotificaciones();
        await guardarEstadoIndexedDB();
        break;

      case 'CRONOMETRO_RESET':
        cronometroEstado.activo = false;
        cronometroEstado.tiempoMs = 0;
        cronometroEstado.contadorVueltas = 0;
        cronometroEstado.colorActual = 'color-1';
        detenerTimer();
        detenerNotificaciones();
        await guardarEstadoIndexedDB();
        break;

      case 'CRONOMETRO_LAP':
        cronometroEstado.contadorVueltas = event.data.contadorVueltas || 0;
        cronometroEstado.colorActual = event.data.colorActual || 'color-1';
        await guardarEstadoIndexedDB();
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

// Manejar clics en notificaciones
self.addEventListener('notificationclick', async (event) => {
  console.log('Notificación clickeada:', event.action);

  event.notification.close();

  if (event.action === 'stop') {
    // Detener el cronómetro
    cronometroEstado.activo = false;
    detenerTimer();
    detenerNotificaciones();
    await guardarEstadoIndexedDB();

    // Abrir la app y mostrar que se detuvo
    event.waitUntil(
      self.clients.openWindow('/').then(client => {
        if (client) {
          client.postMessage({
            type: 'CRONOMETRO_STOPPED_FROM_NOTIFICATION'
          });
        }
      })
    );
  } else {
    // Abrir la app (acción por defecto)
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', (event) => {
  console.log('Notificación cerrada');
});