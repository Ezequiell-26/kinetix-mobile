# ==========================================
# KINETIXFITT - GUÍA RÁPIDA DE DEPLOY EN VERCEL
# ==========================================

## ✅ ARCHIVOS CREADOS PARA EL DEPLOY

1. **vercel.json** - Configuración de Vercel para apps/mobile
   - Framework: Next.js
   - Build command: `prisma generate && next build`
   - Headers de seguridad incluidos
   - Región: iad1 (US East)

2. **.env.production** - Template de variables de entorno
   - Copiar este archivo como referencia
   - NO commitear a Git con valores reales
   - Configurar en Vercel Dashboard

---

## 🚀 PASOS PARA DEPLOY EN VERCEL

### Paso 1: Conectar Repositorio en Vercel

1. Ir a https://vercel.com/new
2. Importar repositorio de GitHub
3. Seleccionar el root del proyecto (`/workspace`)
4. Vercel detectará automáticamente Next.js

### Paso 2: Configurar Variables de Entorno

En Vercel Dashboard > Project Settings > Environment Variables, agregar:

#### Supabase (OBLIGATORIO)
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

#### Stripe (OBLIGATORIO para pagos)
```
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

#### Mercado Pago (OBLIGATORIO si se usa)
```
MP_ACCESS_TOKEN=APP_USR-xxx
MP_PUBLIC_KEY=APP_USR-xxx
MP_WEBHOOK_SECRET=xxx
```

#### Email (OBLIGATORIO)
```
RESEND_API_KEY=re_xxx
EMAIL_FROM=KINETIXFITT <noreply@tudominio.com>
```

#### JWT Secret (OBLIGATORIO)
```
JWT_SECRET=generar-con-openssl-rand-base64-32
```

#### AWS S3 (OPCIONAL pero recomendado)
```
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
BACKUP_S3_BUCKET=tu-bucket
```

#### Push Notifications (OPCIONAL)
```
VAPID_PUBLIC_KEY=xxx
VAPID_PRIVATE_KEY=xxx
```

### Paso 3: Configurar Root Directory

En Vercel Dashboard:
- Project Settings > General > Root Directory
- Establecer: `apps/mobile`

### Paso 4: Aplicar Migraciones de Base de Datos

**IMPORTANTE:** Las migraciones NO se ejecutan automáticamente en Vercel.

Ejecutar localmente o desde un servidor con acceso a la DB:

```bash
cd apps/mobile
npx prisma migrate deploy
```

Esto aplicará:
- Tablas iniciales
- Notificaciones push
- Preferencias de notificación
- Índices de rendimiento

### Paso 5: Configurar Webhooks

#### Stripe Webhook
1. Ir a Stripe Dashboard > Developers > Webhooks
2. Agregar endpoint: `https://tu-dominio-vercel.app/api/payments/webhook`
3. Eventos requeridos:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment.succeeded
   - invoice.payment.failed
4. Copiar `Signing Secret` y actualizar en Vercel: `STRIPE_WEBHOOK_SECRET`

#### Mercado Pago Webhook
1. Ir a MP Panel > Integraciones > Webhooks
2. URL: `https://tu-dominio-vercel.app/api/payments/webhook`
3. Eventos:
   - payment.created
   - payment.updated
   - subscription.created
   - subscription.updated
4. Copiar secret y actualizar: `MP_WEBHOOK_SECRET`

### Paso 6: Configurar Dominio Personalizado

1. Vercel Dashboard > Project Settings > Domains
2. Agregar dominio: `tudominio.com`
3. Configurar DNS según instrucciones de Vercel:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com
4. SSL automático provisto por Vercel

---

## 🔧 COMANDOS ÚTILES

### Build Local (para testing)
```bash
cd apps/mobile
npm install
npm run build
```

### Generar VAPID Keys (Push Notifications)
```bash
node scripts/generate-vapid-keys.js
```

### Verificar Health Check
```bash
curl https://tu-dominio.com/api/health
```

---

## ⚠️ CHECKLIST PRE-LANZAMIENTO

### Infraestructura
- [ ] Variables de entorno configuradas en Vercel
- [ ] Migraciones de base de datos aplicadas
- [ ] Webhooks de Stripe configurados
- [ ] Webhooks de Mercado Pago configurados
- [ ] Dominio personalizado conectado
- [ ] SSL activo (automático en Vercel)

### Funcionalidad
- [ ] Landing page carga correctamente
- [ ] Registro de usuario funciona
- [ ] Login funciona (email/password y Google)
- [ ] Recuperación de contraseña envía emails
- [ ] Dashboard de cliente carga
- [ ] Crear sesión de entrenamiento funciona
- [ ] Guardar progreso funciona
- [ ] Pagos con Stripe funcionan
- [ ] Pagos con Mercado Pago funcionan
- [ ] Notificaciones push se reciben

### Seguridad
- [ ] JWT_SECRET es único y seguro (32+ caracteres)
- [ ] Rate limiting activo
- [ ] Headers de seguridad configurados
- [ ] CSP con nonce implementado
- [ ] HTTPS forzado

### Monitoreo
- [ ] Sentry configurado (opcional)
- [ ] Logs de Vercel accesibles
- [ ] Backups automáticos configurados

---

## 🐛 TROUBLESHOOTING

### Error: "Database connection failed"
- Verificar que DATABASE_URL usa el pooler (puerto 6543)
- Confirmar credenciales en Supabase Dashboard
- Verificar que la IP no está bloqueada

### Error: "Webhook signature verification failed"
- Regenerar webhook secret en Stripe/MP
- Actualizar variable de entorno en Vercel
- Redeployar

### Error: "Build failed"
- Revisar logs en Vercel Dashboard > Deployments > Logs
- Ejecutar `npm run build` localmente para reproducir error
- Verificar que todas las variables de entorno están seteadas

---

## 📞 SOPORTE

Para issues técnicos:
1. Revisar logs en Vercel Dashboard
2. Verificar estado de servicios externos (Supabase, Stripe)
3. Contactar al equipo de desarrollo

---

**Última actualización:** 2026-09-15
**Versión:** 1.0.0
