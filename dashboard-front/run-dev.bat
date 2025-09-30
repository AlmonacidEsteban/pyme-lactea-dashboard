@echo off
echo ========================================
echo   Iniciando Frontend Mi-Pyme
echo ========================================
echo.

REM Configurar PATH temporalmente para esta sesion
set "PATH=%PATH%;C:\Program Files\nodejs"

echo Verificando Node.js...
"C:\Program Files\nodejs\node.exe" --version
if %errorlevel% neq 0 (
    echo ERROR: No se puede ejecutar Node.js
    echo Verifica que Node.js este instalado en: C:\Program Files\nodejs\
    pause
    exit /b 1
)

echo Verificando npm...
"C:\Program Files\nodejs\npm.cmd" --version
if %errorlevel% neq 0 (
    echo ERROR: No se puede ejecutar npm
    pause
    exit /b 1
)

echo.
echo ✓ Node.js y npm funcionando correctamente
echo.

echo Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    "C:\Program Files\nodejs\npm.cmd" install
    if %errorlevel% neq 0 (
        echo ERROR: Fallo al instalar dependencias
        pause
        exit /b 1
    )
) else (
    echo ✓ Dependencias ya instaladas
)

echo.
echo Iniciando servidor de desarrollo...
echo Servidor estará disponible en: http://localhost:5173
echo Presiona Ctrl+C para detener el servidor
echo.

"C:\Program Files\nodejs\npm.cmd" run dev