@echo off
echo ========================================
echo     PyME Lactea - Sistema Completo
echo ========================================
echo.
echo Limpiando cache del frontend...
cd dashboard-front
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist dist rmdir /s /q dist
if exist build rmdir /s /q build
cd ..

echo.
echo Iniciando Backend (Django)...
start "Backend PyME" cmd /k "cd backend && python manage.py runserver 127.0.0.1:8000"

echo Esperando 5 segundos para que inicie el backend...
timeout /t 5 /nobreak >nul

echo.
echo Iniciando Frontend (React + Vite)...
start "Frontend PyME" cmd /k "cd dashboard-front && set VITE_PORT=3000 && npm run dev"

echo.
echo ========================================
echo  Aplicacion iniciada correctamente!
echo ========================================
echo  Backend:  http://127.0.0.1:8000/
echo  Frontend: http://127.0.0.1:3000/
echo  Admin:    http://127.0.0.1:8000/admin/
echo ========================================
echo.
echo IMPORTANTE: Si ves errores de conexion,
echo cierra el navegador y abre una nueva ventana
echo en modo incognito para evitar cache.
echo.
echo Presiona cualquier tecla para cerrar...
pause >nul