@echo off
echo Iniciando Frontend Mi-Pyme...
echo.

echo Configurando PATH...
set "PATH=%PATH%;C:\Program Files\nodejs"

echo Verificando Node.js...
"C:\Program Files\nodejs\node.exe" --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js no funciona
    pause
    exit /b 1
)

echo Verificando npm...
"C:\Program Files\nodejs\npm.cmd" --version
if %errorlevel% neq 0 (
    echo ERROR: npm no funciona
    pause
    exit /b 1
)

echo.
echo Iniciando servidor...
echo Servidor disponible en: http://localhost:5173
echo.

"C:\Program Files\nodejs\npm.cmd" run dev
pause