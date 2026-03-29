let tiempoMs = 0;
let intervalo = null;
let contador = 0; // Este será nuestro contador de vueltas

function formatTime(ms) {
  const minutos = Math.floor(ms / 60000);
  const segundos = Math.floor((ms % 60000) / 1000);
  const centesimas = Math.floor((ms % 1000) / 10);
  const mm = String(minutos).padStart(2, "0");
  const ss = String(segundos).padStart(2, "0");
  const cs = String(centesimas).padStart(2, "0");
  return { mm, ss, cs, texto: `${mm}:${ss}:${cs}` };
}

function actualizarDisplay() {
  const { mm, ss, cs, texto } = formatTime(tiempoMs);
  document.getElementById("tiempo").textContent = texto;
  const minEl = document.getElementById("minutos");
  const segEl = document.getElementById("segundos");
  const csEl = document.getElementById("centesimas");
  if (minEl) minEl.textContent = mm;
  if (segEl) segEl.textContent = ss;
  if (csEl) csEl.textContent = cs;

  const body = document.body;
  if (Math.floor(tiempoMs / 1000) % 10 === 0 && tiempoMs % 1000 === 0) {
    body.classList.toggle("color-change");
  }
}

function iniciar() {
  if (intervalo) return;

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

  // 3. Reiniciamos el tiempo a 0 para que la siguiente vuelta empiece de cero
  tiempoMs = 0;
  actualizarDisplay();
}

function detener() {
  clearInterval(intervalo);
  intervalo = null;

  // 4. Reinicio total al detener
  tiempoMs = 0;
  contador = 0;
  actualizarDisplay();
  document.getElementById("lista").innerHTML = "";
}
