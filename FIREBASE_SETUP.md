# Configuración de Firebase para EZEQUIEL COACHING

## Pasos para configurar la autenticación:

### 1. Crear proyecto en Firebase Console
1. Ve a https://console.firebase.google.com/
2. Haz clic en "Agregar proyecto"
3. Nombre del proyecto: `EZEQUIEL COACHING` (o el que prefieras)
4. Desactiva Google Analytics (opcional)
5. Haz clic en "Crear proyecto"

### 2. Habilitar métodos de autenticación
1. En el panel izquierdo, ve a **Compilación** > **Authentication**
2. Haz clic en "Comenzar"
3. En la pestaña **Sign-in method**:
   - **Correo electrónico/contraseña**: 
     - Haz clic en el lápiz ✏️
     - Activa "Habilitar"
     - Guarda
   - **Google**:
     - Haz clic en el lápiz ✏️
     - Activa "Habilitar"
     - Ingresa el email de soporte del proyecto
     - Guarda

### 3. Obtener credenciales
1. Ve a **Configuración del proyecto** (engranaje ⚙️ junto a Overview)
2. Baja hasta "Tus apps"
3. Haz clic en el ícono de web `</>`
4. Registra la app con el nombre: `EZEQUIEL COACHING Web`
5. **NO** marques la opción de Firebase Hosting (por ahora)
6. Haz clic en "Registrar app"
7. Copia el objeto `firebaseConfig` que aparece

### 4. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 5. Restricciones de seguridad (Opcional pero recomendado)
En Firebase Console > Authentication > Settings:
- **Authorized domains**: Asegúrate de que `localhost` esté agregado para desarrollo
- Para producción, agrega tu dominio real

### 6. Pruebas
1. Ejecuta el proyecto: `npm run dev`
2. Ve a `/auth`
3. Prueba:
   - Registro con email @gmail.com
   - Login con Google
   - Verifica que correos que NO sean @gmail.com sean rechazados

## Notas importantes:

⚠️ **El sistema solo permite correos @gmail.com**
- Cualquier intento de registro con otro dominio será rechazado
- Esto incluye validación tanto en frontend como en lógica de negocio

🔒 **Seguridad**
- Las contraseñas deben tener mínimo 6 caracteres
- Firebase maneja el hashing automáticamente
- Los tokens se gestionan automáticamente

📱 **Para producción**
- Configura los dominios autorizados en Firebase
- Considera habilitar verificación de email
- Puedes agregar reCAPTCHA para protección adicional

## Solución de problemas:

### Error: "Network request failed"
- Verifica que las credenciales en `.env.local` sean correctas
- Asegúrate de que el proyecto esté activo en Firebase Console

### Error: "Operation not allowed"
- Verifica que el método de autenticación esté habilitado en Firebase Console
- Revisa que el domain esté autorizado

### Error: "Popup closed by user"
- El usuario cerró la ventana emergente de Google
- Asegúrate de no tener bloqueadores de popups activos

## Enlaces útiles:
- [Firebase Console](https://console.firebase.google.com/)
- [Documentación de Firebase Auth](https://firebase.google.com/docs/auth)
- [Guía de inicio rápido](https://firebase.google.com/docs/auth/web/start)
