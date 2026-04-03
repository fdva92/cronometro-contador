# Cronómetro Contador - PWA para Android

Aplicación web hecha con JavaScript que permite medir el tiempo y registrar vueltas a la vez que el contador vuelve a 0. Ahora optimizada como Progressive Web App (PWA) para instalación en dispositivos Android.

## 🚀 Características

- ⏱️ Cronómetro preciso con centésimas
- 🎨 11 colores de fondo que cambian aleatoriamente
- ☁️ Cielo animado con nubes flotantes
- 🐦 Aves volando
- 🌊 Océano con olas y peces nadando
- 📱 Optimizado para móviles
- 🔄 Funciona offline (PWA)
- 📱 Instalable en Android

## 📱 Instalación en Android

### Opción 1: Desde el navegador (PWA) - RECOMENDADO
1. **Ve directamente a la app desplegada:** https://fdva92.github.io/cronometro-contador/
2. **Abre en Chrome o Edge para Android**
3. **Toca el menú** (tres puntos) ⋮
4. **Selecciona "Agregar a pantalla de inicio"** o **"Instalar aplicación"**
5. **Confirma la instalación**
6. **¡Listo!** La app aparecerá en tu pantalla de inicio

### Opción 2: Generar APK nativo
Para generar un APK nativo, puedes usar herramientas como:
- **PWABuilder**: https://www.pwabuilder.com/
- **Capacitor**: `npx cap add android && npx cap build android`
- **Bubblewrap**: https://github.com/GoogleChromeLabs/bubblewrap

## 🔗 Demo en línea

https://fdva92.github.io/cronometro-contador/

## 🛠️ Desarrollo local

### Requisitos
- Navegador web moderno con soporte PWA

### Ejecutar localmente
1. Clona o descarga los archivos
2. Abre `index.html` en tu navegador
3. Para funcionalidad completa de PWA, sirve los archivos desde un servidor web

### Servidor local simple
```bash
# Usando Python
python -m http.server 8000

# Usando Node.js
npx live-server
```

## 📁 Estructura del proyecto

```
cronometro_contador/
├── index.html          # HTML principal con PWA
├── styles.css          # Estilos CSS
├── 01.js              # Lógica JavaScript
├── manifest.json      # Configuración PWA
├── sw.js              # Service Worker
├── cronometro.png     # Imagen del cronómetro
├── icon-192.png       # Icono 192x192
├── icon-512.png       # Icono 512x512
└── README.md          # Este archivo
```

## 🎨 Funcionalidades

* ✅ Iniciar cronómetro
* ✅ Registrar vueltas
* ✅ Contador automático de vueltas
* ✅ Reinicio de tiempo en cada vuelta
* ✅ Detener cronómetro
* ✅ 11 colores dinámicos aleatorios
* ✅ Animaciones de cielo y océano
* ✅ Modo offline (PWA)

## 📱 Compatibilidad

- ✅ Chrome para Android
- ✅ Edge para Android
- ✅ Firefox para Android
- ✅ Navegadores modernos con soporte PWA

## 🛠️ Tecnologías

* HTML5
* CSS3 (Animaciones, Gradientes, Flexbox)
* JavaScript (ES6+)
* Progressive Web App (PWA)
* Service Worker para funcionamiento offline

## 💡 Autor

Freddy Vargas

## 📄 Licencia

Este proyecto es de código abierto y gratuito para uso personal y educativo.
