# KinetixFitt — OWASP Security Audit

**Revisión actualizada:** 2026-09-16  
**Ámbito:** `apps/mobile` auth, middleware, API, uploads, webhooks, rate limiting, health endpoints y configuración de despliegue.

> Este documento refleja el estado del código revisado en `main`. Las integraciones externas y pruebas de penetración no se consideran verificadas solo por inspección estática.

## Hallazgos resueltos representados en main

### Autenticación y sesiones

- El registro público usa `createAuthSession`, igual que login, por lo que la sesión persistente puede revocarse.
- El secreto JWT de producción tiene estrategia fail-closed.
- Logout y revocación de sesiones están soportados por la capa de auth.
- Reset de contraseña usa token almacenado como hash con expiración/consumo.

### Autorización / IDOR

- Existe `assertTrainerOwnsClient()` como guard central.
- Check-ins, mensajes, pagos, analytics, measurements, fotos y workout logs deben comprobar ownership antes de operar sobre `clientId`.
- El `PATCH /api/checkins` actual comprueba que el check-in pertenezca a un cliente del trainer o al propio usuario para registros legacy.
- No se debe usar un trainer global arbitrario para asignar o consultar datos de un cliente.

### Rate limiting

- La ruta de rate limiting intenta primero Upstash Redis distribuido.
- Existe fallback local para desarrollo/degradación.
- `getClientIp()` solo acepta forwarded headers cuando `TRUST_PROXY_HEADERS=true`.
- Registro ya no parsea `X-Forwarded-For` por su cuenta.

### Webhooks

- Stripe verifica firma del proveedor.
- Mercado Pago verifica la firma configurada en la implementación actual.
- `PaymentWebhookEvent` proporciona idempotencia por proveedor/evento.

### Health / readiness

- `/api/health` no devuelve excepciones internas.
- `/api/ready` no devuelve excepciones internas ni la lista de variables faltantes.

### Uploads

- El sistema usa allowlists/sanitización centralizada y lectura autenticada para assets privados.
- Cualquier bucket público debe considerarse un defecto de configuración, no un requisito de la aplicación.

## Riesgos que todavía requieren pruebas reales

### 🔴 P0 — Verificación de secretos e infraestructura

Revisar historial Git y proveedores de secretos para confirmar que no haya credenciales reales expuestas. Si existieron, rotarlas antes del lanzamiento.

### 🟠 P1 — E2E de autorización

Ejecutar con cuentas separadas:

1. cliente A intenta leer/modificar recursos de cliente B;
2. trainer A intenta operar sobre cliente del trainer B;
3. usuario no autenticado intenta cada endpoint protegido;
4. repetir con IDs válidos de otros usuarios.

### 🟠 P1 — E2E de pagos

Comprobar firma real, duplicados, reintentos, estados inconsistentes y conciliación con Stripe/Mercado Pago.

### 🟠 P1 — Storage

Verificar que los buckets de assets/backups sean privados y que URLs de descarga respeten autorización/expiración.

### 🟠 P1 — AI

Probar límites, coste, timeout, proveedor ausente, prompt injection y que no se expongan datos de otros usuarios.

### 🟡 P2 — CSP / XSS profundo

Mantener revisión específica de cualquier `dangerouslySetInnerHTML`, JSON-LD y contenido generado por usuario. Los scripts inline deben seguir usando nonce y el contenido de usuario debe renderizarse como texto/markup sanitizado.

## Controles de lanzamiento

- [ ] CI verde en el commit candidato.
- [ ] SAST/dependency audit ejecutado.
- [ ] E2E authZ/IDOR ejecutado.
- [ ] E2E pagos ejecutado con sandbox/live controlado.
- [ ] Storage privado verificado.
- [ ] Headers/CSP comprobados desde producción.
- [ ] Secretos auditados/rotados.
- [ ] Sentry/alertas activas.

## Regla

Un resultado de revisión estática no equivale a una certificación de seguridad. Para liberar KinetixFitt se necesita evidencia de tests y del entorno de ejecución real.
