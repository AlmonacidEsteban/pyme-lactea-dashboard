@echo off
echo ========================================
echo   Configurando PATH de Node.js
echo ========================================
echo.

echo Verificando si Node.js esta instalado...
if not exist "C:\Program Files\nodejs\node.exe" (
    echo ERROR: Node.js no encontrado en C:\Program Files\nodejs\
    echo Por favor, verifica la instalacion de Node.js
    pause
    exit /b 1
)

echo Node.js encontrado en: C:\Program Files\nodejs\
echo.

echo Agregando Node.js al PATH del sistema...
echo IMPORTANTE: Este script requiere permisos de administrador
echo.

REM Agregar Node.js al PATH del usuario actual
setx PATH "%PATH%;C:\Program Files\nodejs" >nul 2>&1

if %errorlevel% equ 0 (
    echo ✓ PATH configurado exitosamente para el usuario actual
    echo.
    echo IMPORTANTE: 
    echo 1. Cierra y reabre todas las ventanas de terminal/CMD
    echo 2. Reinicia tu IDE (Trae AI)
    echo 3. Despues podras usar 'node' y 'npm' desde cualquier terminal
    echo.
) else (
    echo ✗ Error al configurar el PATH
    echo Intenta ejecutar este script como administrador
    echo.
)

echo Verificando configuracion actual...
echo PATH actual incluye:
echo %PATH% | findstr /i nodejs
if %errorlevel% equ 0 (
    echo ✓ Node.js encontrado en PATH actual
) else (
    echo ⚠ Node.js no visible en PATH actual (requiere reiniciar terminal)
)

echo.
echo ========================================
echo   Configuracion completada
echo ========================================
echo.
echo Para aplicar los cambios:
echo 1. Cierra este terminal
echo 2. Abre un nuevo terminal
echo 3. Ejecuta: node --version
echo.
pause