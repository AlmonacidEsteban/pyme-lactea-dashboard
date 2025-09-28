#!/bin/bash

echo "========================================"
echo "   Iniciando Dashboard PyME Lactea"
echo "========================================"
echo

echo "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no está instalado o no está en el PATH"
    echo "Por favor, complete la instalación de Node.js primero"
    exit 1
fi

echo "Node.js versión: $(node --version)"

echo "Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm no está disponible"
    exit 1
fi

echo "npm versión: $(npm --version)"
echo

echo "Instalando dependencias del proyecto..."
echo "Esto puede tomar unos minutos..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Falló la instalación de dependencias"
    exit 1
fi

echo
echo "========================================"
echo "   Dependencias instaladas exitosamente"
echo "========================================"
echo

echo "Iniciando servidor de desarrollo..."
echo "El dashboard estará disponible en: http://localhost:5173"
echo
echo "Presiona Ctrl+C para detener el servidor"
echo

npm run dev