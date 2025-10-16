@echo off
echo ========================================
echo     ACTUALIZANDO REPOSITORIO GIT
echo ========================================

echo Verificando estado del repositorio...
git status

echo.
echo Agregando todos los archivos modificados...
git add .

echo.
echo Haciendo commit de todos los cambios...
git commit -m "Fix: Correccion de configuraciones de frontend y backend

- Simplificacion de vite.config.ts para evitar conflictos de puerto
- Actualizacion de archivos .env para frontend y backend
- Creacion de scripts de inicio mejorados (start.bat)
- Limpieza de configuraciones complejas que causaban problemas
- Scripts de emergencia para resolver problemas de puerto
- Configuracion consistente de CORS y URLs
- Eliminacion de scripts duplicados y limpieza general

Cambios principales:
- Frontend: Puerto 3000 fijo, configuracion Vite simplificada
- Backend: Puerto 8000, configuracion Django optimizada
- Scripts: start.bat, start-app.bat, fix-emergency.bat, clean-cache.bat
- Archivos .env actualizados para desarrollo local"

echo.
echo Haciendo push al repositorio remoto...
git push

echo.
echo ========================================
echo     REPOSITORIO ACTUALIZADO
echo ========================================
echo Todos los cambios han sido subidos al repositorio.
echo Ahora puedes trabajar con otra IA desde esta base actualizada.
echo ========================================
pause