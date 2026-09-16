# KINETIXFITT — Deployment Checklist

**Fecha:** 2026-09-16  
**Rama operativa:** `main`

Este documento es un checklist operativo. Marcar una casilla solo después de comprobarla en el entorno correspondiente.

## 1. Código y CI

- [ ] CI de `main` en verde.
- [ ] `npm ci` termina sin modificar locks.
- [ ] `npm run typecheck` sin errores.
- [ ] `npm run lint` sin errores bloqueantes.
- [ ] `npm run test` en verde.
- [ ] `npm run web:build` en verde.
- [ ] `npm run mobile:build` en verde.
- [ ] `npm -w apps/mobile run verify:production` en verde con variables reales de staging.
- [ ] `npm -w apps/mobile run test:e2e` ejecutado contra staging.

## 2. Vercel — Web

Crear un proyecto Vercel para la web usando este repositorio.

El `vercel.json` raíz debe ejecutar:

```bash
npm install && npm --prefix apps/web ci
npm --prefix apps/web run build
```

Variables mínimas de la web:

```text
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
```

Agregar solo las claves públicas de pagos que realmente consuma el frontend.

## 3. Vercel — App/API

Crear un segundo proyecto Vercel para el mismo repositorio, usando la configuración `apps/mobile/vercel.json`.

Build:

```bash
npm ci
npm run mobile:build
```

Variables privadas mínimas:

```text
DATABASE_URL
DIRECT_URL
JWT_SECRET
TRUST_PROXY_HEADERS
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Y, según funcionalidades activadas:

```text
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
MP_ACCESS_TOKEN
MP_WEBHOOK_SECRET
RESEND_API_KEY
EMAIL_FROM
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
ASSETS_S3_BUCKET
BACKUP_S3_BUCKET
SENTRY_DSN
```

## 4. URLs y nativo

- [ ] `NEXT_PUBLIC_APP_URL` apunta a la URL web real.
- [ ] `NEXT_PUBLIC_WEB_URL` apunta a la URL web real.
- [ ] `API_URL` apunta al proyecto Vercel de app/API.
- [ ] `CAPACITOR_SERVER_URL` apunta a la URL pública de la app Next.js que debe cargar Capacitor.
- [ ] No existe ningún preview URL hardcodeado en configuración nativa.

## 5. PostgreSQL

- [ ] Base de datos de producción creada.
- [ ] `DATABASE_URL` usa pooler/runtime si corresponde.
- [ ] `DIRECT_URL` usa conexión directa.
- [ ] `npx prisma migrate deploy --schema apps/mobile/prisma/schema.prisma` ejecutado.
- [ ] Índices críticos verificados.
- [ ] Pool/conexiones máximas revisados.
- [ ] Backup automático activo.
- [ ] Restauración de prueba completada.

## 6. Autenticación y seguridad

- [ ] `JWT_SECRET` es aleatorio, exclusivo de producción y no está en Git.
- [ ] `TRUST_PROXY_HEADERS=true` solo cuando el proxy sobrescribe headers de cliente.
- [ ] Redis/Upstash operativo.
- [ ] Login, registro, forgot-password, reset-password y logout probados.
- [ ] Ownership/IDOR probado con al menos un trainer y dos clientes distintos.
- [ ] Upload/download probado con usuario autorizado y no autorizado.
- [ ] CSP/security headers comprobados.
- [ ] No existen secretos expuestos en historial, logs o respuestas públicas.

## 7. Pagos

Webhook único del backend:

```text
POST https://<API_DOMAIN>/api/payments/webhook
```

- [ ] Stripe live conectado.
- [ ] Firma Stripe verificada.
- [ ] Mercado Pago conectado si se habilita.
- [ ] Firma Mercado Pago verificada.
- [ ] Idempotencia probada.
- [ ] Checkout y estado final de suscripción probados.
- [ ] Reintentos de webhook no duplican pagos.

## 8. Email y notificaciones

- [ ] Dominio de envío verificado.
- [ ] Recuperación de contraseña entrega el correo real.
- [ ] Sentry recibe eventos de error.
- [ ] Push subscription registrada correctamente.
- [ ] Entrega push real comprobada en dispositivo.

## 9. PWA / Android / iOS / Desktop

### PWA

- [ ] Instalación probada en Android.
- [ ] Instalación probada en iOS.
- [ ] Manifest, icons, service worker y offline behavior comprobados.

### Android

El workflow `.github/workflows/android-release.yml` genera un AAB firmado. Configurar estos secrets:

```text
ANDROID_KEYSTORE_BASE64
ANDROID_KEY_ALIAS
ANDROID_KEYSTORE_PASSWORD
ANDROID_KEY_PASSWORD
```

- [ ] AAB generado.
- [ ] Firma verificada.
- [ ] Package id `com.kinetixfitt.app` coincide con Play Console.
- [ ] Release interno probado en dispositivo real.
- [ ] Play Console listing, privacy URL y Data Safety completados.

### iOS

- [ ] Apple Developer configurado.
- [ ] Bundle identifier `com.kinetixfitt.app` registrado.
- [ ] Certificates/provisioning profiles configurados.
- [ ] Archive/IPA generado en macOS.
- [ ] TestFlight probado en dispositivo real.
- [ ] App Store privacy information completada.

### Desktop

- [ ] Windows EXE probado.
- [ ] macOS DMG probado.
- [ ] Code signing/notarization configurados antes de distribución pública.

## 10. Dominio y SEO

- [ ] DNS configurado.
- [ ] HTTPS activo.
- [ ] `/robots.txt` comprobado.
- [ ] `/sitemap.xml` comprobado.
- [ ] OpenGraph/Twitter cards comprobados.
- [ ] Favicon y manifest correctos.
- [ ] Canonicals e idioma comprobados.

## 11. Observabilidad y rollback

- [ ] Alertas de errores 5xx.
- [ ] Alertas de base de datos.
- [ ] Alertas de pagos/webhooks.
- [ ] Health endpoint monitorizado: `GET /api/health`.
- [ ] Procedimiento de rollback probado.
- [ ] Backup y restore probados antes del lanzamiento.

## 12. Go / No-Go

### GO

Solo cuando todos los bloques anteriores tengan evidencia y no existan fallos críticos abiertos.

### NO-GO

Detener el lanzamiento si falla cualquiera de estas condiciones:

- CI/build roto.
- Migraciones no reproducibles.
- Autenticación/ownership no verificados.
- Pagos sin firma/idempotencia verificadas.
- Backups sin restore probado.
- Secretos sin gestión segura.
- Dominio/HTTPS roto.
- E2E crítico roto.

**Estado actual del repositorio:** preparado para completar estos gates; este archivo no certifica que servicios externos o credenciales reales estén configurados.
