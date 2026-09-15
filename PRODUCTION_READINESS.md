# KinetixFitt — Production Readiness

**Fecha:** 2026-09-16  
**Versión de aplicación:** 1.0.0  
**Rama objetivo:** `main`

## Estado real

El repositorio contiene la infraestructura y los controles necesarios para preparar un lanzamiento, pero este documento **no certifica un despliegue real**. Un lanzamiento de producción solo debe declararse después de ejecutar los gates de CI y configurar/verificar los servicios externos con credenciales reales.

## Cambios de hardening realizados en `main`

- El gate `npm run test` ejecuta las suites de estadísticas, voz, core, dominio y seguridad.
- Se eliminó de Git el archivo `apps/mobile/.env.production`, que solo contenía placeholders y no debía estar trackeado.
- `.env.example` distingue `DATABASE_URL` (pooler/runtime) de `DIRECT_URL` (conexión directa para Prisma).
- Se agregó `scripts/verify-production-env.mjs` para bloquear configuraciones de producción incompletas y evitar imprimir secretos.
- Se agregó `npm run verify:production` en `apps/mobile`.
- El health endpoint ya no devuelve mensajes internos de excepciones al cliente.
- CI usa health-check nativo de PostgreSQL antes de ejecutar migrations/seed/tests/build.

## Gates obligatorios antes de lanzar

### Código

- [ ] CI de `main` en verde.
- [ ] `npm run typecheck` sin errores.
- [ ] `npm run lint` sin errores bloqueantes.
- [ ] `npm run test` en verde.
- [ ] `npm run build` en verde para mobile/web.
- [ ] `npm run test:e2e` ejecutado contra un entorno de staging real.

### Base de datos

- [ ] Crear/configurar PostgreSQL/Supabase de producción.
- [ ] `DATABASE_URL` apunta al pooler/runtime correcto.
- [ ] `DIRECT_URL` apunta al host directo de PostgreSQL.
- [ ] Ejecutar `prisma migrate deploy` en producción.
- [ ] Confirmar backups y restauración real.
- [ ] Confirmar índices y límites de conexiones.

### Autenticación y seguridad

- [ ] `JWT_SECRET` aleatorio, único y >= 32 caracteres.
- [ ] `TRUST_PROXY_HEADERS=true` solo si el proxy de producción sobrescribe de forma fiable los headers de IP.
- [ ] Redis/Upstash configurado para rate limiting distribuido.
- [ ] Verificar login, register, forgot-password, reset-password y logout en staging.
- [ ] Verificar ownership/IDOR para trainer y athlete con usuarios separados.
- [ ] Verificar uploads privados y URLs firmadas.
- [ ] Rotar cualquier secreto que haya aparecido accidentalmente en historial Git.

### Pagos

- [ ] Stripe live configurado.
- [ ] Webhook Stripe live configurado y firma verificada.
- [ ] Mercado Pago configurado si se habilita en lanzamiento.
- [ ] Probar checkout, webhook, idempotencia y conciliación en staging/live controlado.

### Email

- [ ] RESEND o SMTP real configurado.
- [ ] `EMAIL_FROM` usa un dominio verificado.
- [ ] Probar recuperación de contraseña y correos transaccionales.

### Storage / fotos / backups

- [ ] Bucket privado de assets.
- [ ] Bucket privado de backups.
- [ ] Credenciales AWS/S3 con mínimo privilegio.
- [ ] Upload y descarga autorizados por ownership.
- [ ] Backup automático configurado.
- [ ] Restauración de prueba completada.

### Observabilidad

- [ ] Sentry configurado.
- [ ] Logs sin tokens, contraseñas, secretos ni datos innecesarios.
- [ ] Alertas para errores 5xx, base de datos, pagos y autenticación.
- [ ] Health check monitorizado externamente.

### Dominio y distribución

- [ ] Dominio de producción configurado.
- [ ] HTTPS/SSL verificado.
- [ ] `NEXT_PUBLIC_APP_URL` y `NEXT_PUBLIC_WEB_URL` apuntan al dominio real.
- [ ] OpenGraph, favicon, manifest, robots y sitemap comprobados desde producción.
- [ ] PWA instalada y probada en Android/iOS/desktop.

## Comandos de release

Desde `apps/mobile`:

```bash
npm run verify:production
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e
```

En CI, las migrations deben desplegarse con:

```bash
npx prisma migrate deploy --schema apps/mobile/prisma/schema.prisma
```

No usar `prisma migrate dev` contra el entorno de producción.

## Riesgos que siguen requiriendo verificación real

1. No se puede afirmar que el despliegue externo, DNS, Stripe, Mercado Pago, S3, Redis, email o Sentry estén correctamente configurados solo mirando el código.
2. El conector utilizado para esta revisión no ejecuta el build completo del repositorio en una máquina de CI; por eso el estado final debe confirmarse con GitHub Actions.
3. Los flujos E2E requieren credenciales/servicios y un entorno accesible para validación real.
4. La aplicación usa un shell Electron además del despliegue web; la generación de instaladores debe probarse por sistema operativo.

## Regla de lanzamiento

El release se considera **listo para lanzamiento técnico** cuando todos los gates marcados como obligatorios estén en verde y los servicios externos hayan sido verificados en staging o producción controlado.

El objetivo de este archivo es evitar que una documentación optimista sustituya a una verificación real.
