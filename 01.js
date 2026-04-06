let tiempoMs = 0; // iniciamos el tiempo en 0 milisegundos
let intervalo = null; // null indica que el motor está apagado
let contador = 0; // Este será nuestro contador de vueltas
const colores = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6', 'color-7', 'color-8', 'color-9', 'color-10', 'color-11'];
let colorActual = 'color-1'; // Color actual del fondo
let acumuladoMs = 0; // Tiempo acumulado antes del último inicio
let ultimoInicio = null; // Marca de tiempo del último inicio/reanudación
let cronometroActivo = false; // Estado del cronómetro

// Función para guardar estado en localStorage
function guardarEstado() {
  const estado = {
    acumuladoMs,
    ultimoInicio,
    contador,
    colorActual,
    cronometroActivo
  };
  localStorage.setItem('cronometroEstado', JSON.stringify(estado));
}

// Función para cargar estado desde localStorage
function cargarEstado() {
  const estadoGuardado = localStorage.getItem('cronometroEstado');
  if (estadoGuardado) {
    const estado = JSON.parse(estadoGuardado);
    acumuladoMs = estado.acumuladoMs || 0;
    contador = estado.contador || 0;
    colorActual = estado.colorActual || 'color-1';
    ultimoInicio = estado.ultimoInicio || null;
    cronometroActivo = estado.cronometroActivo || false;

    if (cronometroActivo && ultimoInicio) {
      const tiempoTranscurrido = Date.now() - ultimoInicio;
      tiempoMs = acumuladoMs + tiempoTranscurrido;
      ultimoInicio = Date.now();
      iniciarIntervalo();
    } else {
      tiempoMs = acumuladoMs;
    }

    actualizarDisplay();
    actualizarContadorDisplay();
    aplicarColor();
  }
}

function iniciarIntervalo() {
  if (intervalo) return;

  intervalo = setInterval(() => {
    if (!cronometroActivo || !ultimoInicio) return;
    tiempoMs = acumuladoMs + (Date.now() - ultimoInicio);
    actualizarDisplay();
  }, 100);
}

// Función para aplicar el color actual
function aplicarColor() {
  colores.forEach(color => document.body.classList.remove(color));
  document.body.classList.add(colorActual);
}

// Función para manejar visibilidad de página
function manejarVisibilidad() {
  if (document.hidden) {
    guardarEstado();
    console.log('Página oculta - estado guardado');
  } else {
    cargarEstado();
    console.log('Página visible - estado cargado');
  }
}

// Función para inicializar el cronómetro
function inicializarCronometro() {
  cargarEstado();

  // Escuchar cambios de visibilidad
  document.addEventListener('visibilitychange', manejarVisibilidad);

  // Guardar estado periódicamente
  setInterval(guardarEstado, 1000);

  // Solicitar permisos de notificación (opcional)
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function formatTime(ms) { // Función para convertir milisegundos a formato mm:ss:cs
  const minutos = Math.floor(ms / 60000);// 1 minuto = 60000 ms
  const segundos = Math.floor((ms % 60000) / 1000); // 1 segundo = 1000 ms
  const centesimas = Math.floor((ms % 1000) / 10); // 1 centésima = 10 ms
  const mm = String(minutos).padStart(2, "0");// Asegura que siempre tenga 2 dígitos y conviértelo a string
  const ss = String(segundos).padStart(2, "0"); // Asegura que siempre tenga 2 dígitos y conviértelo a string
  const cs = String(centesimas).padStart(2, "0");// Asegura que siempre tenga 2 dígitos y conviértelo a string
  return { mm, ss, cs, texto: `${mm}:${ss}:${cs}` };// Devuelve un objeto con los valores formateados y el texto completo para mostrar
}

function actualizarDisplay() { // Función para actualizar el display con el tiempo formateado
  const { mm, ss, cs, texto } = formatTime(tiempoMs); // Obtenemos el tiempo formateado
  document.getElementById("tiempo").textContent = texto; // Actualizamos el display principal con el tiempo formateado
  const minEl = document.getElementById("minutos");
  const segEl = document.getElementById("segundos");
  const csEl = document.getElementById("centesimas");
  if (minEl) minEl.textContent = mm;
  if (segEl) segEl.textContent = ss;
  if (csEl) csEl.textContent = cs;
}

function actualizarContadorDisplay() {
  const contadorEl = document.getElementById("contador-display");
  if (contadorEl) {
    contadorEl.textContent = contador;
  }
}

function iniciar() {
  if (intervalo) return;

  cronometroActivo = true;
  ultimoInicio = Date.now();
  acumuladoMs = tiempoMs;

  // Si es la primera vez, aplicamos un color inicial
  if (contador === 0) {
    aplicarColor();
  }

  iniciarIntervalo();
  guardarEstado();

  // Notificar al service worker
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CRONOMETRO_START',
      tiempoMs: tiempoMs,
      contadorVueltas: contador,
      colorActual: colorActual
    });
  }
}

function registrarVuelta() {
  if (!cronometroActivo) return;

  contador++;
  actualizarContadorDisplay();

  let nuevoColor;
  do {
    nuevoColor = colores[Math.floor(Math.random() * colores.length)];
  } while (nuevoColor === colorActual);

  colores.forEach(color => document.body.classList.remove(color));
  document.body.classList.add(nuevoColor);
  colorActual = nuevoColor;

  // Paso 1: Limpiar intervalo viejo
  if (intervalo) {
    clearInterval(intervalo);
    intervalo = null;
  }

  // Paso 2: Resetear valores sin interferencia del intervalo
  ultimoInicio = Date.now();
  acumuladoMs = 0;
  tiempoMs = 0;
  actualizarDisplay();

  // Paso 3: Reiniciar intervalo con valores limpios
  iniciarIntervalo();

  guardarEstado();

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CRONOMETRO_LAP',
      contadorVueltas: contador,
      colorActual: colorActual
    });
  }
}

function detener() {
  if (intervalo) {
    clearInterval(intervalo);
    intervalo = null;
  }

  cronometroActivo = false;
  acumuladoMs = 0;
  ultimoInicio = null;
  tiempoMs = 0;
  contador = 0;
  colorActual = 'color-1';
  actualizarDisplay();
  actualizarContadorDisplay();

  colores.forEach(color => document.body.classList.remove(color));

  guardarEstado();

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CRONOMETRO_STOP'
    });
  }
}

// Función para solicitar permisos de notificación
async function solicitarPermisosNotificacion() {
  if ('Notification' in window) {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      console.log('Permiso de notificación:', permission);
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }
  return false;
}

// Función para inicializar el cronómetro
async function inicializarCronometro() {
  console.log('Inicializando cronómetro...');

  cargarEstado();

  document.addEventListener('visibilitychange', manejarVisibilidad);
  window.addEventListener('beforeunload', guardarEstado);
  setInterval(guardarEstado, 1000);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado:', registration);
        if (cronometroActivo && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'CRONOMETRO_START',
            tiempoMs: tiempoMs,
            contadorVueltas: contador,
            colorActual: colorActual
          });
        }
      })
      .catch((error) => {
        console.error('Error registrando Service Worker:', error);
      });
  }
}

// Manejar mensajes del service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type) {
      switch (event.data.type) {
        case 'CRONOMETRO_UPDATE':
          tiempoMs = event.data.tiempoMs;
          actualizarDisplay();
          break;

        case 'CRONOMETRO_STOPPED_FROM_NOTIFICATION':
          // El cronómetro fue detenido desde la notificación
          detener();
          alert('⏱️ Cronómetro detenido desde la notificación');
          break;
      }
    }
  });
}
