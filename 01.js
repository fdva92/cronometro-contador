let tiempoMs = 0; //iniciamos el tiempo en 0 milisegundos
let intervalo = null; // null indica que el motor está apagado
let contador = 0; // Este será nuestro contador de vueltas
const colores = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6', 'color-7', 'color-8', 'color-9', 'color-10', 'color-11']; // Array con los 11 colores disponibles
let colorActual = 'color-1'; // Color actual del fondo

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
  const { mm, ss, cs, texto } = formatTime(tiempoMs);// Obtenemos el tiempo formateado
  document.getElementById("tiempo").textContent = texto; // Actualizamos el display principal con el tiempo formateado
  const minEl = document.getElementById("minutos"); 
  const segEl = document.getElementById("segundos");
  const csEl = document.getElementById("centesimas");
  if (minEl) minEl.textContent = mm;
  if (segEl) segEl.textContent = ss;
  if (csEl) csEl.textContent = cs;
}

function iniciar() {
  if (intervalo) return;

  // Si es la primera vez, aplicamos un color inicial
  if (contador === 0) {
    document.body.classList.add(colorActual);
  }

  intervalo = setInterval(() => {
    tiempoMs += 10;
    actualizarDisplay();
  }, 10);
}

function registrarVuelta() {
  // Si el motor no está encendido, no registramos nada
  if (!intervalo) return;

  // 1. Aumentamos el contador en 1 cada vez que entramos aquí
  contador++;

  let lista = document.getElementById("lista");
  let item = document.createElement("li");

  // 2. Usamos el contador para poner el número de vuelta con minutos, segundos y milisegundos
  const info = formatTime(tiempoMs);
  item.textContent = `Vuelta ${contador}: ${info.texto}`;

  lista.appendChild(item);

  // 3. Cambiamos el color de fondo a uno aleatorio
  const body = document.body;
  let nuevoColor;
  do {
    nuevoColor = colores[Math.floor(Math.random() * colores.length)];
  } while (nuevoColor === colorActual);
  
  body.classList.remove(colorActual);
  body.classList.add(nuevoColor);
  colorActual = nuevoColor;

  // 4. Reiniciamos el tiempo a 0 para que la siguiente vuelta empiece de cero
  tiempoMs = 0;
  actualizarDisplay();
}

function detener() {
  clearInterval(intervalo);
  intervalo = null;

  // 4. Reinicio total al detener
  tiempoMs = 0;
  contador = 0;
  colorActual = 'color-1';
  actualizarDisplay();
  document.getElementById("lista").innerHTML = "";
  
  // Removemos todas las clases de color
  colores.forEach(color => document.body.classList.remove(color));
}
