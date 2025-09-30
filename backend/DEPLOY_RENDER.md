# Despliegue en Render - Backend Django

## Pasos para desplegar:

### 1. Preparar el repositorio
- Asegúrate de que todos los cambios estén committeados y pusheados a GitHub

### 2. Crear cuenta en Render
- Ve a [render.com](https://render.com)
- Crea una cuenta o inicia sesión

### 3. Crear la base de datos PostgreSQL
1. En el dashboard de Render, haz clic en "New +"
2. Selecciona "PostgreSQL"
3. Configura:
   - Name: `pyme-lactea-db`
   - Database Name: `pyme_lactea`
   - User: `pyme_lactea_user`
   - Region: Elige la más cercana
   - Plan: Free (para empezar)
4. Haz clic en "Create Database"
5. **Guarda la URL de conexión** que aparecerá en la página de la base de datos

### 4. Crear el servicio web
1. En el dashboard, haz clic en "New +"
2. Selecciona "Web Service"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `mi-pyme`
5. Configura:
   - Name: `pyme-lactea-backend`
   - Root Directory: `backend`
   - Environment: `Python 3`
   - Build Command: `./build.sh`
   - Start Command: `gunicorn core.wsgi:application`
   - Plan: Free (para empezar)

### 5. Configurar variables de entorno
En la sección "Environment Variables" del servicio web, agrega:

```
DJANGO_SECRET_KEY=tu-clave-secreta-aqui
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=tu-app-name.onrender.com,almonacidesteban.github.io
DATABASE_URL=postgresql://user:password@host:port/database
RENDER=True
```

**Importante:** 
- Genera una clave secreta segura para `DJANGO_SECRET_KEY`
- Usa la URL de la base de datos que guardaste en el paso 3 para `DATABASE_URL`
- Reemplaza `tu-app-name` con el nombre real de tu aplicación

### 6. Desplegar
1. Haz clic en "Create Web Service"
2. Render automáticamente construirá y desplegará tu aplicación
3. El proceso puede tomar varios minutos

### 7. Verificar el despliegue
- Una vez completado, visita `https://tu-app-name.onrender.com/api/health/`
- Deberías ver: `{"status": "healthy", "message": "API funcionando correctamente"}`

### 8. Actualizar el frontend
- Actualiza la URL del API en el frontend para apuntar a tu nueva URL de Render
- Redespliega el frontend en GitHub Pages

## Notas importantes:
- El plan gratuito de Render puede tener limitaciones de tiempo de actividad
- La aplicación puede "dormir" después de 15 minutos de inactividad
- Para producción real, considera un plan de pago