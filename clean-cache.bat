@echo off
echo ========================================
echo     Limpieza de Cache - PyME Lactea
echo ========================================
echo.
echo Limpiando cache de Vite...
cd dashboard-front
if exist node_modules\.vite (
    echo Eliminando node_modules\.vite...
    rmdir /s /q node_modules\.vite
)
if exist dist (
    echo Eliminando dist...
    rmdir /s /q dist
)
if exist build (
    echo Eliminando build...
    rmdir /s /q build
)
cd ..

echo.
echo Limpiando cache de Django...
cd backend
if exist __pycache__ (
    echo Eliminando __pycache__ del backend...
    for /d /r . %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d"
)
if exist *.pyc (
    echo Eliminando archivos .pyc...
    del /s *.pyc
)
cd ..

echo.
echo ========================================
echo  Cache limpiado completamente!
echo ========================================
echo.
echo Ahora puedes ejecutar start-app.bat
echo o usar los scripts individuales.
echo.
pause