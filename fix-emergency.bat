@echo off
echo ========================================
echo     SOLUCION DE EMERGENCIA
echo ========================================

echo Matando TODOS los procesos de Node y Python...
taskkill /f /im node.exe 2>nul
taskkill /f /im python.exe 2>nul

echo Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo Limpiando cache del frontend...
cd dashboard-front
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist dist rmdir /s /q dist
if exist build rmdir /s /q build

echo.
echo ========================================
echo AHORA EJECUTA ESTOS COMANDOS MANUALMENTE:
echo ========================================
echo 1. cd dashboard-front
echo 2. npm run dev
echo.
echo En otra terminal:
echo 3. cd backend  
echo 4. python manage.py runserver 127.0.0.1:8000
echo ========================================
pause