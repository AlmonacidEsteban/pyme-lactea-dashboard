# Instrucciones para Iniciar el Backend

## Error Actual
El frontend está mostrando el error "Failed to fetch" porque no puede conectarse al backend en `http://127.0.0.1:8000`.

## Solución

### Opción 1: Usar el script de inicio
1. Abre una terminal/PowerShell en el directorio raíz del proyecto
2. Ejecuta: `start_backend.bat`

### Opción 2: Inicio manual
1. Abre una terminal/PowerShell
2. Navega al directorio del backend:
   ```
   cd "C:\Users\pc\Desktop\MyPyme\Trae My Pyme\mi-pyme\backend"
   ```
3. Ejecuta las migraciones:
   ```
   python manage.py migrate
   ```
4. Inicia el servidor:
   ```
   python manage.py runserver 8000
   ```

### Opción 3: Usar el script PowerShell
1. Abre PowerShell en el directorio raíz del proyecto
2. Ejecuta:
   ```
   powershell -ExecutionPolicy Bypass -File "start_backend.ps1"
   ```

## Verificación
Una vez que el backend esté ejecutándose, deberías ver un mensaje como:
```
Starting development server at http://127.0.0.1:8000/
```

## Cambios Realizados
- ✅ Configuración CORS actualizada para incluir puerto 5173 (Vite)
- ✅ Mejor manejo de errores en el frontend
- ✅ Scripts de inicio creados

El frontend ahora mostrará un mensaje más claro si no puede conectarse al backend.