# KINETIXFITT

Plataforma unificada de fitness para atletas y entrenadores, con aplicación web, aplicación móvil/PWA, backend API, IA, seguimiento de entrenamiento, pagos, notificaciones y herramientas de coaching.

## Arquitectura actual

```text
kinetixFitt-mobile-and-web/
├── apps/
│   ├── web/            # Next.js — web pública + dashboard
│   └── mobile/         # Next.js — aplicación dinámica + API + PWA + Capacitor + Electron
├── packages/
│   ├── shared/
│   ├── ai-models/
│   ├── core/
│   └── native-modules/
├── docs/
├── scripts/
└── package.json
```

`apps/web` y `apps/mobile` se despliegan como aplicaciones separadas. El proyecto web usa `vercel.json` en la raíz; el backend/app móvil tiene `apps/mobile/vercel.json` para un segundo proyecto Vercel apuntando al mismo repositorio.

## Requisitos

- Node.js 22 recomendado (CI usa Node 22)
- npm 10+ recomendado
- PostgreSQL/Supabase para producción
- Upstash Redis para rate limiting distribuido
- Proveedor de email para transaccionales
- Stripe y/o Mercado Pago para pagos
- S3 compatible para assets/backups privados
- Sentry/PostHog para observabilidad/analytics

## Desarrollo

Instalación del monorepo:

```bash
npm ci
npm ci --prefix apps/web
```

Web:

```bash
npm run web:dev
```

Mobile/app dinámica:

```bash
npm run mobile
```

Build web:

```bash
npm run web:build
```

Build mobile/backend:

```bash
npm run mobile:build
```

## Quality gates

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Para validación de producción de la aplicación móvil/backend:

```bash
npm -w apps/mobile run verify:production
npm -w apps/mobile run test:e2e
```

Las migraciones de producción se ejecutan con `prisma migrate deploy`; no se utiliza `prisma migrate dev` contra producción.

## Variables de entorno

La referencia está en `apps/mobile/.env.example`. Nunca se deben commitear credenciales reales.

En producción son especialmente críticas:

- `DATABASE_URL` y `DIRECT_URL`
- `JWT_SECRET`
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`
- claves de Stripe/Mercado Pago si están habilitados
- credenciales S3
- proveedor de email
- Sentry/PostHog
- `CAPACITOR_SERVER_URL` para builds nativos

## Despliegue Vercel

### Web

Crear un proyecto Vercel con este repositorio y mantener la raíz del proyecto en el repositorio. El `vercel.json` raíz instala el lock de `apps/web` y ejecuta:

```bash
npm --prefix apps/web run build
```

### Mobile/backend/API

Crear un segundo proyecto Vercel usando el mismo repositorio. Su configuración es `apps/mobile/vercel.json` y ejecuta:

```bash
npm run mobile:build
```

Este proyecto debe tener las variables privadas del backend. No se deben copiar secretos del backend al proyecto web si la web no los necesita.

## Native release

El workflow `.github/workflows/native.yml` sigue destinado a builds de distribución de escritorio y APK de prueba.

Para Android de producción, `.github/workflows/android-release.yml` genera un AAB firmado. Requiere los secrets de GitHub:

```text
ANDROID_KEYSTORE_BASE64
ANDROID_KEY_ALIAS
ANDROID_KEYSTORE_PASSWORD
ANDROID_KEY_PASSWORD
```

Para iOS, el build de App Store requiere un entorno macOS con certificados/provisioning profiles de Apple; se documenta en `docs/RELEASE_RUNBOOK.md`.

## Producción: regla de lanzamiento

El repositorio contiene infraestructura de producción, pero el lanzamiento no se considera verificado hasta que CI, staging, base de datos, dominios, credenciales, pagos, email, storage, observabilidad y pruebas E2E hayan sido comprobados con servicios reales.

Consulta:

- `PRODUCTION_READINESS.md`
- `DEPLOYMENT_CHECKLIST.md`
- `docs/RELEASE_RUNBOOK.md`
- `.ai/PROJECT_REALITY.md`

## Rama operativa

`main` es la rama operativa para los cambios de lanzamiento solicitados en este proyecto. `develop` sigue existiendo en GitHub como rama de desarrollo histórica y no debe considerarse automáticamente equivalente a `main`.

## Licencia

MIT — ver `LICENSE`.

**Actualizado:** 2026-09-16
