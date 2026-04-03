# 📱 Guía de Despliegue para Android

## 🚀 Opción 1: PWA (Recomendado - Más fácil)

### Instalación desde navegador:
1. **Abre la app en Chrome/Edge para Android**
2. **Toca el menú** (tres puntos ⋮ en la esquina superior derecha)
3. **Selecciona "Agregar a pantalla de inicio"** o **"Instalar aplicación"**
4. **Confirma la instalación**
5. **¡Listo!** La app aparecerá en tu pantalla de inicio como cualquier otra app

### Requisitos:
- Android 5.0 o superior
- Chrome 57+ o Edge 79+
- Conexión a internet (para instalación inicial)

## 🔧 Opción 2: APK Nativo (Avanzado)

### Usando Capacitor:
```bash
# Instalar dependencias
npm install

# Agregar Android
npm run capacitor

# Abrir en Android Studio
npm run android

# Generar APK
# En Android Studio: Build > Build Bundle(s)/APK(s) > Build APK(s)
```

### Usando PWABuilder (Online):
1. Ve a https://www.pwabuilder.com/
2. Pega la URL de tu sitio web
3. Selecciona "Android" como plataforma
4. Descarga el paquete
5. Abre el proyecto en Android Studio
6. Genera el APK

## 📋 Archivos necesarios para PWA:

- ✅ `manifest.json` - Configuración de la app
- ✅ `sw.js` - Service Worker para funcionamiento offline
- ✅ `icon-192.png` & `icon-512.png` - Iconos de la app
- ✅ Meta tags en `index.html`

## 🔍 Verificar instalación:

1. **Abre Chrome/Edge en Android**
2. **Ve a Configuración > Sitios web > Añadidos a pantalla de inicio**
3. **Deberías ver "Cronómetro Contador"**

## 🐛 Solución de problemas:

### La opción "Instalar" no aparece:
- Asegúrate de que la PWA esté sirviendo desde HTTPS (o localhost)
- Verifica que el `manifest.json` sea válido
- Limpia caché del navegador

### La app no se instala:
- Verifica que los iconos existan y sean accesibles
- Comprueba la consola del navegador por errores
- Asegúrate de que el Service Worker se registre correctamente

### Problemas de rendimiento:
- La app funciona mejor cuando se instala como PWA
- Para mejor rendimiento, considera generar un APK nativo

## 📱 Características en Android:

- ✅ **Notificaciones** (si se implementan)
- ✅ **Acceso offline** completo
- ✅ **Icono en pantalla de inicio**
- ✅ **Modo pantalla completa**
- ✅ **Sin barra de direcciones**
- ✅ **Comportamiento nativo**

¡Tu cronómetro contador está listo para Android! 🎉📱