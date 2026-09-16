# KinetixFitt — Release status

**Actualizado:** 2026-09-16  
**Rama operativa:** `main`  
**Versión:** `1.0.0`

Este documento reemplaza la antigua guía que afirmaba que KinetixFitt ya estaba listo para producción. El repositorio contiene una base funcional amplia, pero un lanzamiento real requiere verificar infraestructura y servicios externos.

## Ya implementado en código

- Autenticación con bcrypt, JWT y sesiones persistentes revocables.
- Rate limiting distribuido con Upstash como primario y fallback local.
- Ownership multi-trainer mediante `Client.trainerId` y guardas server-side.
- Password reset con token almacenado como hash y expiración.
- Uploads con allowlist MIME, firma/magic-bytes y serving autenticado.
- Stripe y Mercado Pago con verificación de webhook e idempotencia atómica.
- Endpoint `/api/health` sin mensajes internos.
- Endpoint `/api/ready` sin exposición de variables faltantes.
- Push interno protegido por un secreto dedicado.
- Backups restringidos a identidades explícitamente autorizadas.
- Offline sync con límites de cola, tamaño y reintentos.
- PWA, Capacitor y Electron presentes.
- Workflow Android para AAB firmado mediante secrets de GitHub.
- CI configurado para typecheck, lint, migraciones, seed, tests y builds de mobile/web.

## Gates obligatorios antes de anunciar el lanzamiento

### Código

- [ ] GitHub Actions de `main` en verde para el commit de release.
- [ ] Typecheck mobile y web sin errores.
- [ ] Lint mobile y web sin errores bloqueantes.
- [ ] Tests unitarios/integración en verde.
- [ ] Build de mobile y web verificado.
- [ ] E2E de login → onboarding → workout → check-in → trainer → pagos → logout en staging.

### Infraestructura

- [ ] PostgreSQL/Supabase de producción creado.
- [ ] `DATABASE_URL` y `DIRECT_URL` verificados.
- [ ] Migraciones aplicadas con `prisma migrate deploy`.
- [ ] Backups automáticos y restauración probados.
- [ ] Upstash Redis operativo.
- [ ] S3/R2 privado operativo para assets y backups.
- [ ] Sentry/monitorización y alertas operativas.

### Seguridad

- [ ] Secrets reales configurados fuera de Git.
- [ ] Ningún token/clave real presente en el historial que siga siendo válido.
- [ ] `KINETIX_INTERNAL_API_SECRET` configurado para producción.
- [ ] `BACKUP_ADMIN_USER_IDS` configurado.
- [ ] Verificación de IDOR con dos trainers y dos clientes distintos.
- [ ] Prueba de uploads y lectura cruzada denegada.

### Pagos y comunicaciones

- [ ] Stripe live verificado con webhook real.
- [ ] Mercado Pago live verificado si se habilita.
- [ ] Email transaccional real con dominio verificado.
- [ ] Push real en Android/iOS/PWA.

### Web y apps

- [ ] Dominio de producción y HTTPS.
- [ ] Landing `/es` y `/en` verificada.
- [ ] Login y dashboard protegidos.
- [ ] PWA instalable y actualizable.
- [ ] AAB firmado probado en dispositivo Android.
- [ ] iOS/TestFlight preparado con Apple Developer y firma real.
- [ ] Windows/macOS installers generados y probados si se comercializan.

## Comandos de validación

```bash
npm ci
npm run typecheck -w apps/mobile
npm run lint -w apps/mobile
npm run typecheck --prefix apps/web
npm run lint --prefix apps/web
npm run test -w apps/mobile
npm run build -w apps/mobile
npm run build --prefix apps/web
npm run verify:production -w apps/mobile
npm run test:e2e -w apps/mobile
```

## Configuración externa

Los valores reales de producción deben mantenerse en el proveedor de infraestructura, no en este repositorio. `.env.example` solo documenta nombres y formatos esperados.

No usar datos ficticios de usuarios, pagos, métricas, IA o rendimiento para declarar el sistema listo. El estado final debe basarse en checks ejecutados y evidencia del entorno real.
