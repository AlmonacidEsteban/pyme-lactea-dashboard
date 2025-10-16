@echo off
echo Matando procesos en puertos 3000, 3016...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 "') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3016 "') do taskkill /f /pid %%a 2>nul

echo Limpiando cache...
if exist node_modules\.vite rmdir /s /q node_modules\.vite

echo Iniciando frontend en puerto 3000...
npm run dev