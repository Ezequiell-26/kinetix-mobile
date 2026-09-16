# KinetixFitt — Production Readiness

**Fecha:** 2026-09-16  
**Versión:** 1.0.0  
**Rama operativa:** `main`

## Estado real

El código contiene los controles y automatizaciones necesarios para preparar un lanzamiento. Este documento no certifica que Vercel, PostgreSQL, Stripe, Mercado Pago, email, storage, Redis, Sentry, Apple o Google estén configurados con credenciales reales.

## Cambios aplicados en `main`

- Vercel web ahora instala y construye explícitamente `apps/web` sin depender de un workspace raíz que no la incluye.
- Existe una configuración Vercel separada para `apps/mobile`, que aloja la app dinámica y API.
- Registro usa la resolución centralizada de IP y ya no consume `X-Forwarded-For` directamente.
- Registro ya no devuelve errores internos de infraestructura al cliente.
- Capacitor dejó de depender de un preview URL hardcodeado y usa `CAPACITOR_SERVER_URL`.
- Se añadió workflow de Android para generar AAB firmado con secrets de GitHub.
- `DEPLOYMENT_CHECKLIST.md` y `docs/RELEASE_RUNBOOK.md` fueron actualizados para la arquitectura de dos proyectos.
- `apps/mobile/.env.production` permanece fuera de Git.

## Gates obligatorios

### Código / CI

- [ ] CI de `main` en verde para el commit candidato.
- [ ] `npm ci` reproducible.
- [ ] `npm run typecheck` sin errores.
- [ ] `npm run lint` sin errores bloqueantes.
- [ ] `npm run test` en verde.
- [ ] `npm run web:build` en verde.
- [ ] `npm run mobile:build` en verde.
- [ ] E2E de journeys críticos ejecutado contra staging real.

### Arquitectura / Vercel

- [ ] Proyecto Vercel web creado con `vercel.json` raíz.
- [ ] Proyecto Vercel app/API creado usando `apps/mobile/vercel.json`.
- [ ] Los dos proyectos tienen dominios estables y no dependen de previews.
- [ ] Cambios relevantes de `apps/mobile` disparan el deployment del backend.
- [ ] Variables públicas y privadas están separadas entre proyectos.

### Base de datos

- [ ] PostgreSQL/Supabase de producción creado.
- [ ] `DATABASE_URL` usa el pooler/runtime apropiado.
- [ ] `DIRECT_URL` usa conexión directa.
- [ ] `prisma migrate deploy` ejecutado.
- [ ] Backup automático activo.
- [ ] Restore de prueba completado.
- [ ] Pool y límites de conexiones revisados.

### Auth / seguridad

- [ ] `JWT_SECRET` único, aleatorio y fuera de Git.
- [ ] `TRUST_PROXY_HEADERS=true` solo detrás de un proxy que sobrescriba headers del cliente.
- [ ] Upstash Redis operativo.
- [ ] Login/register/reset/logout probados.
- [ ] Ownership/IDOR probado entre cuentas separadas.
- [ ] Upload/download probado con propietario y usuario ajeno.
- [ ] Respuestas 4xx/5xx no exponen secretos, stack traces ni errores internos.
- [ ] Revisión de secretos en historial completada.

### Pagos

- [ ] Stripe live configurado.
- [ ] Stripe webhook validado con firma real.
- [ ] Mercado Pago live configurado si se habilita.
- [ ] Mercado Pago webhook validado con firma real.
- [ ] Idempotencia probada con reenvío del mismo evento.
- [ ] Checkout → webhook → estado de suscripción verificado.

### Email / Push / Storage

- [ ] Dominio de email verificado.
- [ ] Reset de contraseña entrega correo real.
- [ ] Push probado en dispositivo real.
- [ ] Buckets S3/R2 privados.
- [ ] Ownership de assets verificado.
- [ ] Backups privados y restaurables.

### IA

- [ ] Provider de IA configurado en staging.
- [ ] `/api/ai/chat` requiere sesión válida.
- [ ] El sistema responde explícitamente cuando el provider no está configurado.
- [ ] No se presentan métricas o scores ficticios.
- [ ] Form Check no se declara “biomecánico” hasta tener modelo real de pose validado.
- [ ] Costes y límites del provider monitorizados antes de abrir acceso amplio.

### Native / PWA

- [ ] PWA probada en Android, iOS y desktop.
- [ ] Android AAB firmado y probado mediante release interno.
- [ ] Bundle ID Android `com.kinetixfitt.app` coincide con Play Console.
- [ ] iOS archive/IPA firmado y probado en TestFlight.
- [ ] Desktop Windows/macOS probado.
- [ ] Firma/notarización desktop configurada antes de distribución pública.

### Dominio / Observabilidad

- [ ] DNS y HTTPS verificados.
- [ ] robots/sitemap/OG/favicons comprobados.
- [ ] Sentry activo.
- [ ] Alertas 5xx, auth, DB y pagos activas.
- [ ] `GET /api/health` monitorizado externamente.
- [ ] Procedimiento de rollback probado.

## Lo que ya NO debe considerarse bloqueante de código

La separación de despliegues web/backend, la URL nativa configurable, el control de IP de registro y el workflow Android ya están representados en `main`.

## Lo que sigue requiriendo intervención externa

1. Credenciales reales de servicios.
2. Configuración de dominios/DNS.
3. Base de datos, backups y restore real.
4. E2E contra staging/producción controlada.
5. Cuentas y certificados Apple/Google.
6. Validación de proveedores de pago, email, push, storage e IA.

## Regla de lanzamiento

El release se considera técnicamente candidato cuando el código y CI pasan todos los gates. Se considera listo para usuarios únicamente cuando además las integraciones externas y los journeys reales han sido verificados.
