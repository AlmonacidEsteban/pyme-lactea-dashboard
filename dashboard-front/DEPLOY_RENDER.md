# Despliegue del Frontend en Render

Este documento explica cómo desplegar el frontend de PyME Láctea Dashboard en Render.

## Configuración Previa

1. **Archivos de configuración creados:**
   - `render.yaml` - Configuración de despliegue para Render
   - `.env.production` - Variables de entorno para producción
   - `.env.example` - Ejemplo de variables de entorno

## Pasos para Desplegar en Render

### 1. Crear un nuevo servicio web en Render

1. Ve a [render.com](https://render.com) e inicia sesión
2. Haz clic en "New +" y selecciona "Web Service"
3. Conecta tu repositorio de GitHub: `https://github.com/AlmonacidEsteban/pyme-lactea-dashboard.git`

### 2. Configurar el servicio

**Configuración básica:**
- **Name:** `pyme-lactea-frontend`
- **Environment:** `Node`
- **Region:** Selecciona la región más cercana
- **Branch:** `main` (o la rama que uses)
- **Root Directory:** `dashboard-front`

**Comandos de build:**
- **Build Command:** `npm install && npm run build`
- **Start Command:** Dejar vacío (es un sitio estático)

**Configuración avanzada:**
- **Publish Directory:** `build`
- **Auto-Deploy:** Habilitado

### 3. Variables de entorno

Agregar las siguientes variables de entorno en Render:

```
VITE_API_URL=https://pyme-lactea-backend.onrender.com
VITE_APP_ENV=production
NODE_ENV=production
```

### 4. Configuración de rutas (SPA)

Para que funcione correctamente como Single Page Application, Render debe estar configurado para redirigir todas las rutas a `index.html`. Esto ya está configurado en el archivo `render.yaml`.

## Verificación del Despliegue

Una vez desplegado, verifica que:

1. ✅ El sitio carga correctamente
2. ✅ El login funciona con el backend de Render
3. ✅ Las rutas de la aplicación funcionan correctamente
4. ✅ No hay errores en la consola del navegador

## URLs del Proyecto

- **Frontend:** `https://pyme-lactea-frontend.onrender.com` (después del despliegue)
- **Backend:** `https://pyme-lactea-backend.onrender.com`

## Solución de Problemas

### Error de CORS
Si hay problemas de CORS, verifica que el backend tenga configurado correctamente el dominio del frontend en `ALLOWED_HOSTS` y `CORS_ALLOWED_ORIGINS`.

### Variables de entorno no funcionan
Asegúrate de que todas las variables de entorno estén configuradas en Render y que tengan el prefijo `VITE_` para que Vite las reconozca.

### Rutas no funcionan
Verifica que la configuración de rutas en `render.yaml` esté correcta para redirigir todas las rutas a `index.html`.

## Comandos Útiles

```bash
# Build local para probar
npm run build:prod

# Preview del build local
npm run preview

# Desarrollo local
npm run dev
```