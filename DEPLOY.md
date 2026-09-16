# KinetixFitt — Deploy guide

**Última actualización:** 2026-09-16

Esta guía describe el diseño actual del repositorio. No contiene credenciales reales ni asume que los servicios externos estén configurados.

## Arquitectura de despliegue

KinetixFitt se compone de dos aplicaciones:

- `apps/web`: web pública + dashboard web.
- `apps/mobile`: aplicación dinámica, PWA, API, Capacitor y Electron.

Se recomienda utilizar dos proyectos Vercel sobre el mismo repositorio: uno con `vercel.json` para `apps/web` y otro con `apps/mobile/vercel.json` para la app/API.

## Variables de entorno

La fuente de nombres y formatos es `apps/mobile/.env.example`.

Producción necesita, según las funciones activadas:

- PostgreSQL: `DATABASE_URL`, `DIRECT_URL`.
- Auth: `JWT_SECRET`, `TRUST_PROXY_HEADERS`.
- Rate limiting: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
- Push interno: `KINETIX_INTERNAL_API_SECRET`, VAPID keys.
- Backups: `BACKUP_ADMIN_USER_IDS`, S3 credentials/buckets.
- Pagos: Stripe y/o Mercado Pago.
- Email: Resend o SMTP.
- Storage: S3/R2 privado.
- Observabilidad: Sentry/PostHog.
- AI: proveedor OpenAI-compatible si se habilita.

Nunca guardar estos valores en Git.

## Base de datos

```bash
npm ci
npx prisma migrate deploy --schema apps/mobile/prisma/schema.prisma
```

No ejecutar `prisma migrate dev` contra producción.

Antes del release hay que verificar una restauración real de backup, no solo que el job de backup termine correctamente.

## Vercel — web

Crear un proyecto Vercel con el repositorio completo y conservar la configuración raíz:

```text
Build: npm --prefix apps/web run build
Output: apps/web/.next
```

Configurar únicamente las variables `NEXT_PUBLIC_*` necesarias por la web.

## Vercel — app/API

Crear un segundo proyecto Vercel con el mismo repositorio y establecer Root Directory a `apps/mobile`.

La configuración `apps/mobile/vercel.json` debe utilizarse con ese Root Directory. Las variables privadas del backend deben configurarse únicamente en este proyecto.

## Webhooks de pagos

Ambos proveedores utilizan el endpoint común:

```text
POST /api/payments/webhook
```

Stripe requiere `STRIPE_WEBHOOK_SECRET` y firma `stripe-signature`.

Mercado Pago requiere `MP_WEBHOOK_SECRET` y firma `x-signature`, además de `MP_ACCESS_TOKEN` para consultar el pago antes de liquidarlo.

Nunca probar un webhook de producción enviando un POST sin firma y esperar un `200`; el sistema debe rechazarlo.

## Validación local

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Para la suite HTTP de seguridad:

```bash
npm -w apps/mobile run build
npm -w apps/mobile run start
BASE_URL=http://127.0.0.1:3001 npm -w apps/mobile run test:security
```

## Validación de producción

Ejecutar además:

```bash
npm -w apps/mobile run verify:production
npm -w apps/mobile run test:e2e
```

Verificar en staging:

- registro, login, logout y reset de contraseña;
- ownership entre dos trainers y dos clientes;
- creación/edición/asignación de programas;
- workout logs, métricas y fotos;
- mensajería y push;
- Stripe/Mercado Pago con webhooks y duplicados;
- backup + restauración;
- PWA y artefactos nativos.

## Native release

Android de producción utiliza `.github/workflows/android-release.yml` para generar un AAB firmado.

Desktop continúa con `.github/workflows/native.yml`.

iOS necesita macOS, certificados Apple y provisioning profiles; no se declara listo solo porque Capacitor esté configurado.

## Seguridad

La aplicación ya incluye:

- cookies HTTP-only y sesiones persistentes revocables;
- rate limiting distribuido con fallback local;
- ownership server-side;
- validación de uploads y storage privado;
- verificación de firmas de webhook;
- idempotencia atómica de eventos;
- CSP/headers y health endpoints mínimos.

Mantener las pruebas de regresión después de cada cambio de auth, pagos, uploads o autorización.

## Estado de lanzamiento

La presencia de una guía o configuración no demuestra un deploy funcional. El lanzamiento requiere evidencia de CI, staging, infraestructura y servicios externos reales.
