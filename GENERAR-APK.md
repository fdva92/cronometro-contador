# 📱 Guía Completa: Convertir PWA a APK/APP Móvil

## 🚀 Opción 1: PWABuilder (MÁS FÁCIL - Online)

### Pasos:
1. **Ve a:** https://www.pwabuilder.com/
2. **En el campo "URL"** pega: `https://fdva92.github.io/cronometro-contador/`
3. **Haz click en "Start"**
4. **Espera a que analice tu PWA** (2-3 segundos)
5. **Haz click en "Build My PWA"** (botón azul abajo)
6. **Selecciona "Android"** en la columna izquierda
7. **Haz click en "Download"** para descargar el paquete
8. **Descomprime el archivo descargado**
9. **Abre el proyecto en Android Studio:**
   - Descarga Android Studio: https://developer.android.com/studio
   - Abre la carpeta descomprimida en Android Studio
10. **Genera el APK:**
    - Menú: Build → Build Bundle(s)/APK(s) → Build APK(s)
    - Espera a que termine
    - El APK estará en: `app/release/app-release.apk`
11. **Instala en tu teléfono:**
    - Conecta el teléfono a la PC
    - Arrastra el APK al teléfono
    - O copia por cable USB
    - Abre el APK en tu teléfono
    - Confirma la instalación

---

## 🔧 Opción 2: Capacitor (Recomendado si tienes Node.js)

### Requisitos previos:
- **Node.js**: https://nodejs.org/
- **Java Development Kit (JDK)**: https://www.oracle.com/java/technologies/downloads/
- **Android SDK**: https://developer.android.com/studio
- **Android Studio** (opcional pero recomendado)

### Pasos:

#### 1. Instalar Capacitor globalmente
```bash
npm install -g @capacitor/cli
```

#### 2. En tu carpeta del proyecto (cronometro_contador):
```bash
cd C:\Users\elbec\Documents\proyectos\cronometro_contador
```

#### 3. Inicializar Capacitor
```bash
npx cap init
```
Cuando pregunte:
- **App name:** `Cronometro Contador`
- **App Package ID:** `com.cronometro.contador`

#### 4. Agregar Android
```bash
npm install @capacitor/android
npx cap add android
```

#### 5. Sincronizar archivos
```bash
npx cap sync
```

#### 6. Abrir en Android Studio
```bash
npx cap open android
```

#### 7. Generar APK en Android Studio:
- Click en el menú: **Build** → **Build Bundle(s)/APK(s)** → **Build APK(s)**
- Espera a que compile (puede tardar 5-10 minutos en la primera vez)
- El APK se generará en: `app/release/app-release.apk`

#### 8. Instalar APK
```bash
# Conecta el teléfono
adb install app/release/app-release.apk
```

---

## 📦 Opción 3: Bubblewrap (Google Chrome Labs)

### Requisitos:
- Node.js instalado
- Java Development Kit (JDK)
- Experiencia con línea de comandos

### Instalación:
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://fdva92.github.io/cronometro-contador/manifest.json
bubblewrap build
```

El APK se generará automáticamente en la carpeta `output/`.

---

## 🎯 Comparación de Opciones

| Opción | Facilidad | Requisitos | Tiempo | Resultado |
|--------|-----------|-----------|--------|-----------|
| **PWABuilder** | ⭐⭐⭐⭐⭐ (Muy fácil) | Solo navegador | 15 min | APK listo |
| **Capacitor** | ⭐⭐⭐ (Moderado) | Node.js + Java | 20 min | APK + proyecto |
| **Bubblewrap** | ⭐⭐ (Difícil) | Node.js + Java | 10 min | APK directo |

**RECOMENDACIÓN:** Usa **PWABuilder** para empezar, es la más fácil y rápida.

---

## 🔍 Verificar que el APK funciona

1. **Conecta tu teléfono Android**
2. **Abre los ajustes:**
   - Ajustes → Seguridad → Habilitar "Origen desconocido"
3. **Instala el APK:**
   - Copia el APK a your teléfono vía USB
   - O arrastra el APK a una carpeta compartida
   - Abre el APK desde tu teléfono
4. **Confirma la instalación**
5. **¡Listo! Tu app está instalada como app nativa**

---

## 📝 Notas importantes

### Versioning
Cuando actualices tu PWA y quieras generar un nuevo APK:
1. Aumenta la versión en `manifest.json`: `"version": "1.0.1"`
2. Regenera el APK siguiendo los mismos pasos
3. Los usuarios pueden actualizar la app desde Google Play (si la publicas)

### Publicar en Google Play
Para distribuir en Google Play:
1. Necesitas una cuenta Google Play Developer ($25 de pago único)
2. Generar un APK de lanzamiento (release signed)
3. Cargar en Google Play Console
4. Escribir descripción y capturas
5. Enviar para revisión

---

## 🆘 Solución de Problemas

### "Build failed"
- Verifica que tienes Java instalado: `java -version`
- Actualiza Android SDK en Android Studio
- Limpia la cache: `npx cap clean`

### "APK muy grande"
- Es normal (10-50 MB)
- Las PWAs requieren Chromium embebido

### "No se instala en Android"
- Verifica que el teléfono sea Android 5.0+
- Habilita "Origen desconocido" en Ajustes
- Intenta desinstalar versiones anteriores

---

## 📱 Resultado Final

Una vez seguidos estos pasos, tendrás:
✅ Una app móvil nativa instalable
✅ Icono en tu pantalla de inicio
✅ Funcionamiento offline
✅ Acceso a notificaciones y otras APIs
✅ Misma funcionalidad que en web

**¡Tu cronómetro ahora es una app móvil profesional!** 🎉📱⏱️