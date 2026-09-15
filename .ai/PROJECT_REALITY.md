# KinetixFitt — Project Reality

Última actualización: 2026-09-16.

Este archivo es un mapa operativo, no una promesa de producción. El código, las migraciones y los checks vivos son la fuente de verdad.

## Estado global

- `main` es la rama operativa solicitada para cambios.
- Prisma usa PostgreSQL (`DATABASE_URL` + `DIRECT_URL`).
- Monorepo con `apps/mobile`, `apps/web` y `packages/shared`.
- KinetixFitt usa la identidad `#C6F91E / #081119 / #0B151E` como base visual.
- No afirmar `PRODUCTION READY`, `VERIFIED`, `AI-powered` o `COMPLETE` sin evidencia actual.

## Web

- Landing principal, `/es` y `/en`: implementadas con navegación, CTA, metadata, sitemap, robots y OG dinámico.
- Homepage debe mantener una propuesta factual: no usar ratings, usuarios, retención, rankings o escasez inventados.
- La landing usa `https://app.kinetixfitt.com` como URL de producto.
- `apps/web` es una aplicación real del repositorio; no documentarla como “untracked” o inexistente.

## Auth / Seguridad

- Passwords con bcrypt.
- JWT HS256 + sesión persistente en DB.
- `getSession()` valida firma y sesión persistente.
- Logout revoca sesión; logout global revoca todas.
- Password reset usa `PasswordResetToken`, SHA-256, expiración y consumo atómico.
- Rate limiting soporta Upstash Redis con fallback local.
- Uploads usan allowlists y sanitización centralizada.
- `.env` NO debe versionarse. Solo `.env.example`.
- Toda API que use `clientId` debe verificar ownership server-side.

## Multi-trainer

- `Client.trainerId` define propiedad.
- `assertTrainerOwnsClient()` es la guardia central.
- Mensajes, check-ins, pagos, workout logs y analytics deben respetar ownership.
- No usar `findFirst({ role: "TRAINER" })` para decidir el coach de un cliente.

## Database

- PostgreSQL authoritative.
- Relaciones de `Client`, `Program`, `WorkoutLog`, `Payment`, `Subscription`, `Message`, `CheckIn`, `Progress*` usan `onDelete` explícito.
- `PaymentWebhookEvent` existe y tiene unique `(provider, eventId)` para idempotencia.
- No commitear `dev.db`, `.next`, `.tsbuildinfo`, uploads ni artefactos locales.

## Payments

- Registro manual de pagos usa `/api/payments`.
- Checkout de Stripe y Mercado Pago está implementado a nivel de servidor.
- Webhooks verifican firma e idempotencia.
- Mercado Pago soporta `MP_*` y aliases `MERCADO_PAGO_*`.
- E2E de proveedores externos sigue UNVERIFIED hasta probar con credenciales y webhooks reales.

## Training / Progress

- Workout logs reales con sets, fecha, duración y comentarios.
- Resúmenes calculan sesiones, streak, PRs, adherencia y analytics a partir de DB.
- Calendar muestra historial real y debe evolucionar hacia sesiones programadas/eventos.
- Importación Hevy/Strong crea logs históricos mediante API; debe seguir validando duplicados/mapeos.

## AI

- `KinetixFitt AI` tiene endpoint autenticado `/api/ai/chat`.
- Proveedor configurable mediante `AI_BASE_URL`, `AI_MODEL`, `AI_API_KEY` o aliases de OpenAI/GLM.
- Si no hay credenciales, el endpoint debe indicarlo y no fingir inferencia.
- El chat no debe afirmar que conoce métricas del usuario que no hayan sido cargadas.
- Form Check NO muestra scores ficticios; requiere un modelo real de pose para análisis biomecánico.
- Inferencia on-device, vision avanzada y tool-calling persistente siguen UNVERIFIED/PARTIAL.

## Trainer

- Control Center consume clientes y workout logs reales.
- Asignación masiva usa API real y ownership.
- Analytics API está restringida a TRAINER y a su cartera.
- Pendiente ampliar Trainer Command Center con automatizaciones, cohortes, MRR/LTV y operaciones masivas completas.

## Notifications / Messaging

- Mensajes limitados al coach asignado y cliente propietario.
- Check-ins y workout completions notifican al `trainerId` real.
- Push subscriptions y preferencias existen; entrega end-to-end aún requiere pruebas por plataforma.

## Native / PWA / 3D

- PWA existe.
- Capacitor/Electron existen como wrappers.
- Packaging Android/iOS/macOS/Windows end-to-end: UNVERIFIED hasta generar y probar artefactos.
- 3D usa Three.js/WebGL y geometría procedural. No afirmar WebGPU, Web Workers de cálculo u OffscreenCanvas real sin implementación y medición.

## Quality gates

- CI debe ejecutar install, typecheck, lint, migrations, seed, tests y builds de mobile/web.
- Para cualquier cambio importante: READ → SEARCH → MAP IMPACT → PLAN → CHANGE → TEST → REVIEW DIFF → RE-TEST → DOCUMENT → COMMIT.
- CI vivo y Vercel deben consultarse después de cambios; no asumir que un check anterior sigue verde.

## Riesgos abiertos reales

1. Vercel puede estar limitado por cuota/build-rate-limit aunque el código compile correctamente.
2. Integraciones externas de Stripe/Mercado Pago, email, push, storage S3/R2 y AI requieren credenciales reales para E2E.
3. Falta completar la pirámide E2E de journeys completos.
4. Falta terminar sincronización offline real y resolución de conflictos.
5. Community, automatizaciones y varias capacidades avanzadas de IA siguen parciales.
6. Native packaging y releases de stores siguen sin verificación end-to-end.
