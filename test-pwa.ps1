# Script para probar la PWA localmente en Windows
# Ejecutar con: .\test-pwa.ps1

Write-Host "🚀 Iniciando servidor local para probar PWA..." -ForegroundColor Green

# Verificar si Python está instalado
$pythonInstalled = Get-Command python -ErrorAction SilentlyContinue
if ($pythonInstalled) {
    Write-Host "✅ Python encontrado. Iniciando servidor..." -ForegroundColor Green
    python -m http.server 8000
} else {
    Write-Host "❌ Python no encontrado. Intentando con Node.js..." -ForegroundColor Yellow

    # Verificar si Node.js está instalado
    $nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeInstalled) {
        Write-Host "✅ Node.js encontrado. Verificando live-server..." -ForegroundColor Green

        # Verificar si live-server está instalado globalmente
        $liveServerInstalled = Get-Command live-server -ErrorAction SilentlyContinue
        if ($liveServerInstalled) {
            Write-Host "✅ Live-server encontrado. Iniciando servidor..." -ForegroundColor Green
            live-server --port=8000
        } else {
            Write-Host "❌ Live-server no encontrado. Instalando..." -ForegroundColor Yellow
            npm install -g live-server
            Write-Host "✅ Live-server instalado. Iniciando servidor..." -ForegroundColor Green
            live-server --port=8000
        }
    } else {
        Write-Host "❌ Ni Python ni Node.js encontrados." -ForegroundColor Red
        Write-Host "📋 Instrucciones:" -ForegroundColor Yellow
        Write-Host "1. Instala Python desde: https://www.python.org/downloads/" -ForegroundColor White
        Write-Host "2. O instala Node.js desde: https://nodejs.org/" -ForegroundColor White
        Write-Host "3. Luego ejecuta este script nuevamente" -ForegroundColor White
        Write-Host "" -ForegroundColor White
        Write-Host "🔄 Mientras tanto, puedes abrir index.html directamente en tu navegador" -ForegroundColor Cyan
        Write-Host "   pero algunas funciones de PWA no estarán disponibles" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "🌐 Una vez que el servidor esté ejecutándose:" -ForegroundColor Cyan
Write-Host "1. Abre http://localhost:8000 en tu navegador" -ForegroundColor White
Write-Host "2. Para instalar como PWA en Android:" -ForegroundColor White
Write-Host "   - Abre en Chrome/Edge para Android" -ForegroundColor White
Write-Host "   - Toca el menú (⋮) > 'Agregar a pantalla de inicio'" -ForegroundColor White
Write-Host "3. ¡Disfruta tu cronómetro!" -ForegroundColor Green