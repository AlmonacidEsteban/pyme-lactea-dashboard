# Script para iniciar el frontend Mi-Pyme
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Iniciando Frontend Mi-Pyme" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configurar PATH temporalmente
$env:PATH += ";C:\Program Files\nodejs"

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = & "C:\Program Files\nodejs\node.exe" --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: No se puede ejecutar Node.js" -ForegroundColor Red
    Write-Host "Verifica que Node.js esté instalado en: C:\Program Files\nodejs\" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar npm
Write-Host "Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = & "C:\Program Files\nodejs\npm.cmd" --version
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: No se puede ejecutar npm" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""
Write-Host "✓ Node.js y npm funcionando correctamente" -ForegroundColor Green
Write-Host ""

# Verificar dependencias
Write-Host "Verificando dependencias..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias..." -ForegroundColor Yellow
    & "C:\Program Files\nodejs\npm.cmd" install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Error al instalar dependencias" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
} else {
    Write-Host "✓ Dependencias ya instaladas" -ForegroundColor Green
}

Write-Host ""
Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Yellow
Write-Host "Servidor estará disponible en: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Iniciar servidor
& "C:\Program Files\nodejs\npm.cmd" run dev