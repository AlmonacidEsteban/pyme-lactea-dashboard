# Script para iniciar el servidor de desarrollo
Write-Host "Configurando PATH para Node.js..." -ForegroundColor Green

# Agregar Node.js al PATH
$env:PATH = $env:PATH + ";C:\Program Files\nodejs"

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
& "C:\Program Files\nodejs\node.exe" --version

# Verificar npm
Write-Host "Verificando npm..." -ForegroundColor Yellow
& "C:\Program Files\nodejs\npm.cmd" --version

# Iniciar servidor de desarrollo
Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Green
& "C:\Program Files\nodejs\npm.cmd" run dev