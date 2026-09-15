# 🚀 KINETIXFITT - TODO LISTO PARA PRODUCCIÓN

## ✅ ARCHIVOS CREADOS (COMPLETADO)

### 1. Variables de Entorno
- ✅ `/workspace/.env` - Archivo principal de variables de entorno
- ✅ `/workspace/apps/mobile/.env` - Variables específicas para mobile/web

### 2. APIs de Notificaciones Push
- ✅ `/workspace/apps/mobile/src/app/api/push/subscribe/route.ts` - Suscribirse a notificaciones
- ✅ `/workspace/apps/mobile/src/app/api/push/send/route.ts` - Enviar notificaciones

### 3. Migración de Base de Datos
- ✅ `/workspace/apps/mobile/prisma/migrations/20260914_push_notifications/migration.sql`
  - Tabla `push_subscriptions` para guardar dispositivos
  - Tabla `pending_notifications` para fallback
  - Índices de rendimiento
  - Trigger para updated_at

### 4. Sistema Offline-First
- ✅ `/workspace/apps/mobile/src/lib/offline-sync.ts` - Lógica de sincronización offline
- ✅ `/workspace/apps/mobile/src/components/offline-indicator.tsx` - UI indicador de conexión

### 5. Scripts de Setup
- ✅ `/workspace/scripts/generate-vapid-keys.js` - Generar claves VAPID para push
- ✅ `/workspace/scripts/setup-production.sh` - Script automático de configuración

---

## 📋 CHECKLIST DE CONFIGURACIÓN MANUAL

### ⚠️ REQUERIDO ANTES DEL DEPLOY

#### 1. Configurar Variables de Entorno (.env)

Editá `/workspace/.env` y completá con valores reales:

```bash
# Supabase (obtener de https://app.supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Database (Supabase connection pooler)
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@...pooler.supabase.com:6543/postgres"

# JWT Secret (generado automáticamente por el script)
JWT_SECRET="..."

# Stripe (https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Mercado Pago (https://www.mercadopago.com.ar/developers/panel)
MP_ACCESS_TOKEN=APP_USR-...
MP_PUBLIC_KEY=APP_USR-...

# Email (Resend o SMTP)
RESEND_API_KEY=re_...
# O SMTP
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password

# AWS S3 (https://console.aws.amazon.com/s3)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# Sentry (https://sentry.io)
SENTRY_DSN=https://...@sentry.io/...

# Dominio
NEXT_PUBLIC_APP_URL=https://tudominio.com
```

#### 2. Generar VAPID Keys para Push Notifications

Ejecutar:
```bash
npm install --no-save web-push
node scripts/generate-vapid-keys.js
```

Copiar las keys generadas al `.env`:
```bash
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

#### 3. Aplicar Migraciones de Base de Datos

```bash
cd apps/mobile
npx prisma migrate deploy
```

Esto creará las tablas:
- `push_subscriptions`
- `pending_notifications`

#### 4. Ejecutar Seed Data (Opcional pero recomendado)

```bash
npx prisma db seed
```

---

## 🔧 COMANDOS PARA DEPLOY

### Opción A: Script Automático (Recomendado)

```bash
./scripts/setup-production.sh
```

Este script:
1. Verifica/crea archivos .env
2. Genera JWT_SECRET seguro
3. Instala dependencias
4. Genera VAPID keys
5. Muestra checklist completo

### Opción B: Manual Paso a Paso

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (editar .env manualmente)

# 3. Generar JWT_SECRET
openssl rand -base64 32

# 4. Generar VAPID keys
npx web-push generate-vapid-keys

# 5. Aplicar migraciones
cd apps/mobile && npx prisma migrate deploy

# 6. Build de producción
npm run build

# 7. Iniciar servidor
npm start
```

---

## 🌐 CONFIGURACIÓN POST-DEPLOY

### 1. Configurar Webhooks de Pago

Una vez el dominio esté activo:

**Stripe:**
- Ir a https://dashboard.stripe.com/webhooks
- Crear webhook: `https://tudominio.com/api/payments/stripe/webhook`
- Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`, `customer.subscription.*`
- Copiar el signing secret al `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`

**Mercado Pago:**
- Ir a https://www.mercadopago.com.ar/developers/panel
- Configuración → Webhooks
- URL: `https://tudominio.com/api/payments/mp/webhook`
- Copiar el secret al `.env`: `MP_WEBHOOK_SECRET=...`

### 2. Configurar DNS y SSL

```bash
# Ejemplo con Cloudflare + Vercel/Railway
# 1. Apuntar dominio al servidor
tudominio.com    A     IP_DEL_SERVIDOR
www.tudominio.com CNAME tudominio.com

# 2. SSL automático con Let's Encrypt (la mayoría de hosts lo hacen auto)
```

### 3. Verificar Health Check

```bash
curl https://tudominio.com/api/health
# Debería responder: {"status":"ok","timestamp":"..."}
```

### 4. Configurar Monitoreo

- **Sentry**: Verificar que los errores lleguen al dashboard
- **Uptime**: Configurar en UptimeRobot/Pingdom para `/api/health` cada 5 min
- **Analytics**: Verificar PostHog/Firebase recibiendo eventos

---

## 📱 PRUEBAS PRE-LANZAMIENTO

### Checklist de Testing Manual

```
[ ] Login de usuario funciona
[ ] Registro de nuevo usuario
[ ] Recuperación de contraseña por email
[ ] Dashboard cliente carga correctamente
[ ] Dashboard trainer carga correctamente
[ ] Crear entrenamiento funciona
[ ] Timer de ejercicios funciona offline
[ ] Guardar workout log funciona
[ ] Subir fotos de progreso
[ ] Mensajes entre trainer/cliente
[ ] Pagos con Stripe (modo test primero)
[ ] Pagos con Mercado Pago (modo test primero)
[ ] Notificaciones push se reciben
[ ] Modo offline detecta pérdida de conexión
[ ] Sincronización funciona al recuperar conexión
[ ] PWA instalable en móvil
[ ] Service Worker cachea recursos
```

---

## 🎯 MÉTRICAS DE ÉXITO (Primera Semana)

| Métrica | Objetivo | Cómo Medir |
|---------|----------|------------|
| Uptime | >99.5% | UptimeRobot |
| Error Rate | <1% | Sentry |
| Load Time | <3s | Lighthouse |
| Conversion | >5% | Stripe/MP dashboard |
| Retención D7 | >40% | PostHog/Firebase |

---

## 🆘 SOPORTE Y TROUBLESHOOTING

### Errores Comunes

**1. "JWT_SECRET must be at least 32 characters"**
```bash
# Solución: Generar nuevo secret
openssl rand -base64 32
# Copiar al .env
```

**2. "Database connection error"**
```bash
# Verificar DATABASE_URL en .env
# Usar pooler URL (puerto 6543) para producción
# Verificar credenciales en Supabase dashboard
```

**3. "VAPID keys not configured"**
```bash
# Ejecutar script de generación
node scripts/generate-vapid-keys.js
# Copiar keys al .env
```

**4. "Migration error: relation already exists"**
```bash
# Las migraciones ya fueron aplicadas, usar:
npx prisma migrate resolve --applied <migration_name>
```

### Recursos de Ayuda

- Documentación: `/docs/`
- Logs de la app: `docker logs <container>` o ver archivo de logs
- Sentry Dashboard: https://sentry.io
- Supabase Dashboard: https://app.supabase.com

---

## 📞 CONTACTO PARA EMERGENCIAS

Si algo sale mal durante el lanzamiento:

1. **No entrar en pánico** 😅
2. Revertir deploy si es crítico
3. Revisar logs de errores
4. Checkear status de servicios externos (Supabase, Stripe, etc.)
5. Comunicar a usuarios si hay downtime prolongado

---

## ✨ ¡LISTO!

Una vez completada esta guía, tu aplicación KINETIXFITT estará lista para producción.

**Próximos pasos post-lanzamiento:**
- [ ] Recolectar feedback de primeros usuarios
- [ ] Monitorear métricas diariamente
- [ ] Planear v1.1 basado en uso real
- [ ] Implementar features del roadmap (wearables, challenges, etc.)

**¡Mucho éxito con el lanzamiento! 🚀**
