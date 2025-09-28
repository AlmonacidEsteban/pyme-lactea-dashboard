@echo off
echo ========================================
echo   Iniciando Dashboard PyME Lactea
echo ========================================
echo.

echo Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado o no esta en el PATH
    echo Por favor, complete la instalacion de Node.js primero
    pause
    exit /b 1
)

echo Verificando npm...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm no esta disponible
    pause
    exit /b 1
)

echo.
echo Instalando dependencias del proyecto...
echo Esto puede tomar unos minutos...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Fallo la instalacion de dependencias
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Dependencias instaladas exitosamente
echo ========================================
echo.

echo Iniciando servidor de desarrollo...
echo El dashboard estara disponible en: http://localhost:5173
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

npm run dev