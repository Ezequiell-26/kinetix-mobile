# KINETIXFITT — Release Runbook

## Objetivo

Usar este documento para pasar de `main` a un lanzamiento controlado sin depender de memoria, comandos ad-hoc o configuraciones de preview.

## A. Preparación local

```bash
npm ci
npm ci --prefix apps/web
npm run typecheck
npm run lint
npm run test
npm run web:build
npm run mobile:build
```

En un entorno con variables de staging:

```bash
npm -w apps/mobile run verify:production
npm -w apps/mobile run test:e2e
```

## B. Base de datos

1. Crear PostgreSQL/Supabase de producción.
2. Guardar pooler en `DATABASE_URL` y conexión directa en `DIRECT_URL`.
3. Ejecutar únicamente:

```bash
npx prisma migrate deploy --schema apps/mobile/prisma/schema.prisma
```

4. Verificar que los índices esperados existen.
5. Ejecutar un backup.
6. Restaurar ese backup en una base aislada y comprobar integridad básica.

## C. Vercel web

Proyecto independiente usando el repositorio raíz.

Configuración:

```text
vercel.json
```

Build:

```bash
npm install && npm --prefix apps/web ci
npm --prefix apps/web run build
```

Dominio sugerido de la capa web: `kinetixfitt.com` / `www.kinetixfitt.com`.

## D. Vercel app/API

Segundo proyecto Vercel sobre el mismo repositorio.

Configuración:

```text
apps/mobile/vercel.json
```

Build:

```bash
npm ci
npm run mobile:build
```

El dominio de esta capa debe ser estable antes de generar builds nativos. Ejemplo: `app.kinetixfitt.com`.

## E. Variables de producción

Nunca copiar `.env` desde una máquina local.

Configurar manualmente en el proveedor de secretos:

```text
DATABASE_URL
DIRECT_URL
JWT_SECRET
TRUST_PROXY_HEADERS
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
API_URL
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_WEB_URL
CAPACITOR_SERVER_URL
```

Añadir pagos, email, storage, push y observabilidad solo cuando estén habilitados y verificados.

## F. Auth / seguridad

Antes de abrir registro público:

- Crear dos cuentas cliente y una cuenta trainer de staging.
- Confirmar que un cliente no puede leer/modificar recursos de otro cliente.
- Confirmar que un cliente no puede operar endpoints exclusivos del trainer.
- Probar logout y revocación de sesión.
- Probar reset de contraseña y expiración del token.
- Probar rate limiting desde múltiples requests.
- Comprobar que respuestas públicas no contienen stack traces, SQL errors ni secretos.

## G. Pagos

Endpoint de webhook:

```text
POST /api/payments/webhook
```

Probar en entorno controlado:

1. Checkout.
2. Pago exitoso.
3. Webhook válido.
4. Webhook inválido.
5. Reenvío del mismo evento.
6. Cambio de estado de suscripción.
7. Conciliación entre proveedor y base de datos.

## H. Email / push / storage

### Email

Enviar password reset y confirmar dominio remitente.

### Push

Registrar subscription desde un dispositivo real y comprobar entrega real.

### Storage

Comprobar:

- upload autenticado;
- descarga del propietario;
- rechazo de usuario ajeno;
- bucket no público;
- URLs firmadas con expiración cuando corresponda.

## I. Android

Usar `.github/workflows/android-release.yml`.

Secrets obligatorios:

```text
ANDROID_KEYSTORE_BASE64
ANDROID_KEY_ALIAS
ANDROID_KEYSTORE_PASSWORD
ANDROID_KEY_PASSWORD
```

Crear un tag de release:

```text
android-v1.0.0
```

Verificar que el artefacto es `.aab`, está firmado y usa `com.kinetixfitt.app`.

No publicar un APK debug en producción.

## J. iOS

La distribución App Store requiere un runner macOS y credenciales Apple válidas.

Proceso operativo:

1. Registrar `com.kinetixfitt.app` en Apple Developer.
2. Configurar signing certificate y provisioning profile.
3. Generar el proyecto iOS con Capacitor contra `CAPACITOR_SERVER_URL` de producción.
4. Abrir el workspace en Xcode.
5. Archive en Release.
6. Validar y subir a TestFlight.
7. Probar login, pagos, push y navegación en un dispositivo físico.
8. Completar la información de privacidad de App Store Connect.

## K. Desktop

El workflow nativo existente genera Windows y macOS, pero la distribución pública requiere probar los instaladores y configurar firma/notarización.

## L. Verificación post-deploy

Comprobar desde Internet:

```text
GET /api/health
```

Y validar manualmente:

- landing;
- login;
- registro;
- dashboard trainer;
- dashboard athlete;
- creación/asignación de entrenamiento;
- registro de una sesión;
- analytics/estadísticas;
- AI cuando haya provider configurado;
- pago y webhook;
- notificación;
- logout.

## M. Rollback

1. Identificar el deployment estable anterior.
2. Detener el tráfico al deployment defectuoso según la plataforma.
3. Restaurar DB solo si hubo migración incompatible y existe un procedimiento específico.
4. No borrar datos para revertir una versión de aplicación.
5. Registrar el incidente y la causa.

## Regla final

Un deployment puede llamarse lanzamiento solo cuando el código, infraestructura, integraciones y usuarios reales fueron verificados. Un commit verde de GitHub no sustituye esta validación.
