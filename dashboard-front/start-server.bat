@echo off
cls
echo ========================================
echo   Iniciando Frontend Mi-Pyme
echo ========================================
echo.

REM Configurar PATH para esta sesion
set "PATH=C:\Program Files\nodejs;%PATH%"

echo Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js no funciona
    pause
    exit /b 1
)

echo Verificando npm...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm no funciona
    pause
    exit /b 1
)

echo.
echo ✓ Node.js y npm funcionando correctamente
echo.

echo Iniciando servidor de desarrollo...
echo Servidor disponible en: http://localhost:5173
echo Presiona Ctrl+C para detener el servidor
echo.

npm run dev