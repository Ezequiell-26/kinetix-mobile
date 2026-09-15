# Guía de Deploy a Producción - KinetixFitt

## Prerrequisitos

- Cuenta en Supabase (proyecto creado)
- Cuenta en Stripe (modo live activado)
- Cuenta en Mercado Pago (credenciales live)
- Servicio SMTP configurado (Gmail, SendGrid, etc.)
- Bucket S3 para backups (AWS o compatible)
- Dominio propio configurado

## 1. Configuración de Variables de Entorno

### Copiar y configurar `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

**Editar `.env` con tus credenciales reales:**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# Database URLs (desde Supabase > Settings > Database)
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# JWT Secret (generar uno nuevo de 32+ caracteres)
JWT_SECRET="tu-jwt-secret-seguro-de-32-caracteres-minimo"

# Stripe (obtener desde Dashboard > Developers > API Keys)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Mercado Pago (obtener desde Panel > Credenciales)
MP_ACCESS_TOKEN=APP_USR-xxx
MP_WEBHOOK_SECRET=xxx
NEXT_PUBLIC_MP_PUBLIC_KEY=xxx

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tucorreo@gmail.com
SMTP_PASS=tu_app_password
EMAIL_FROM="KINETIXFITT <noreply@tu-dominio.com>"

# AWS S3 para Backups
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 3 * * *
BACKUP_S3_BUCKET=tu-bucket-backups
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1

# Sentry (opcional, para monitoreo de errores)
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# Redis (opcional, para rate limiting distribuido)
REDIS_URL=redis://localhost:6379

# Log level
LOG_LEVEL=info

# Firebase (si se usa autenticación)
NEXT_PUBLIC_FIREBASE_API_KEY=TU_API_KEY_AQUI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Copiar y configurar `apps/mobile/.env`:

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

Usar las mismas credenciales que arriba, asegurando que `NODE_ENV=production` y `NEXT_PUBLIC_APP_URL=https://tu-dominio.com`.

## 2. Migraciones de Base de Datos

### Ejecutar migraciones en producción:

```bash
cd apps/mobile
npx prisma migrate deploy
```

**Nota:** No usar `prisma migrate dev` en producción porque el pooler de Supabase no soporta shadow database.

### Cargar datos iniciales (seed):

```bash
npx prisma db seed
```

Esto cargará:
- Ejercicios base (50+ ejercicios)
- Programas template (principiante, intermedio, avanzado)
- Usuario demo para testing
- Configuraciones por defecto

## 3. Configurar Webhooks de Pagos

### Stripe Webhook:

1. Ir a Stripe Dashboard > Developers > Webhooks
2. Agregar endpoint: `https://tu-dominio.com/api/webhooks/stripe`
3. Seleccionar eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment.succeeded`
   - `invoice.payment.failed`
4. Copiar el `Signing Secret` y actualizar `STRIPE_WEBHOOK_SECRET` en `.env`

### Mercado Pago Webhook:

1. Ir a Mercado Pago Panel > Integraciones > Webhooks
2. Agregar URL: `https://tu-dominio.com/api/webhooks/mercadopago`
3. Seleccionar eventos:
   - `payment.created`
   - `payment.updated`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.cancelled`
4. Copiar el secret y actualizar `MP_WEBHOOK_SECRET` en `.env`

## 4. Build y Deploy

### Opción A: Vercel (Recomendado)

1. Conectar repositorio en Vercel
2. Configurar variables de entorno en Vercel Dashboard
3. Deploy automático con cada push a `main`

```bash
npm run build
```

### Opción B: Docker

```bash
docker-compose up -d
```

### Opción C: Kubernetes

```bash
kubectl apply -f k8s/
```

## 5. Configurar Dominio y SSL

### En Vercel:

1. Ir a Project Settings > Domains
2. Agregar dominio: `tu-dominio.com`
3. Configurar DNS según instrucciones de Vercel
4. SSL automático provisto por Vercel

### En servidor propio:

Usar Let's Encrypt:

```bash
certbot --nginx -d tu-dominio.com
```

## 6. Verificación Post-Deploy

### Checklist de verificación:

- [ ] Landing page carga correctamente
- [ ] Registro de usuario funciona
- [ ] Login con email/password funciona
- [ ] Login con Google funciona (si está configurado)
- [ ] Recuperación de contraseña envía email
- [ ] Dashboard de cliente carga
- [ ] Crear sesión de entrenamiento funciona
- [ ] Guardar progreso funciona
- [ ] Notificaciones push se reciben
- [ ] Webhook de Stripe recibe eventos
- [ ] Webhook de Mercado Pago recibe eventos
- [ ] Backups se ejecutan según schedule
- [ ] Logs de errores aparecen en Sentry (si configurado)

### Comandos de verificación:

```bash
# Verificar salud de la API
curl https://tu-dominio.com/api/health

# Verificar webhooks
curl -X POST https://tu-dominio.com/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"type": "checkout.session.completed"}'

# Verificar SSL
openssl s_client -connect tu-dominio.com:443
```

## 7. Monitoreo y Mantenimiento

### Logs:

- Vercel: Dashboard > Deployments > Logs
- Docker: `docker-compose logs -f`
- Kubernetes: `kubectl logs -f deployment/kinetix`

### Backups:

Los backups automáticos se ejecutan diariamente a las 3 AM UTC.
Verificar en el bucket S3 configurado.

### Actualizaciones:

```bash
git pull origin main
npm install
npm run build
# Reiniciar servicio según plataforma
```

## 8. Troubleshooting

### Error: "Database connection failed"

- Verificar que `DATABASE_URL` y `DIRECT_URL` son correctas
- Confirmar que el pooler de Supabase está habilitado
- Verificar que la IP del servidor está permitida en Supabase

### Error: "Webhook signature verification failed"

- Regenerar el webhook secret en Stripe/MercadoPago
- Actualizar variable de entorno
- Reiniciar el servicio

### Error: "Email not sending"

- Verificar credenciales SMTP
- Si usa Gmail, generar App Password (no usar password normal)
- Verificar puertos (587 para TLS, 465 para SSL)

## 9. Seguridad

### Headers de seguridad ya configurados:

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- Referrer-Policy

### Rate Limiting:

- 100 requests/minuto por IP
- 1000 requests/hora por usuario autenticado

### Recomendaciones adicionales:

- Habilitar 2FA para cuentas admin
- Rotar secrets cada 90 días
- Monitorear logs de auditoría regularmente
- Mantener dependencias actualizadas

## 10. Soporte

Para issues técnicos:
- Revisar logs en Sentry
- Verificar estado de servicios externos (Supabase, Stripe, etc.)
- Contactar al equipo de desarrollo

---

**Última actualización:** 2024
**Versión del proyecto:** 3.0.0
