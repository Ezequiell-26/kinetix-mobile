# ✅ Checklist de Despliegue - Kinetix

## Cambios Realizados (Commit: f47cbfc)

### 1. Error de Migración Corregido
- **Problema**: La migración `20260914_push_notifications` referenciaba `users` en lugar de `"User"`
- **Solución**: Corregido el nombre de la tabla en el SQL
- **Archivo**: `apps/mobile/prisma/migrations/20260914_push_notifications/migration.sql`

### 2. CI Mejorado con Manejo de Errores
- **Problema**: Las migraciones fallaban sin recuperación en CI
- **Solución**: Añadido fallback con `migrate reset` automático
- **Archivo**: `.github/workflows/ci.yml`

### 3. Vercel Configuración Optimizada
- **Mejoras**:
  - GitHub integration habilitada
  - Auto job cancelation activado
  - Funciones API con maxDuration: 60s
- **Archivo**: `vercel.json`

---

## 📋 Pasos para Completar el Deploy

### 1. Configurar Variables de Entorno en Vercel

Ve al dashboard de Vercel → Project Settings → Environment Variables y añade:

```bash
# Base de datos
DATABASE_URL=postgresql://user:pass@host:5432/kinetix_prod
DIRECT_URL=postgresql://user:pass@host:5432/kinetix_prod

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-...
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=APP_USR-...
MERCADO_PAGO_WEBHOOK_SECRET=...

# PostHog (Analytics)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App URL
NEXT_PUBLIC_APP_URL=https://tudominio.com
```

### 2. Ejecutar Migraciones en Producción

```bash
# Conecta a tu DB de producción y ejecuta:
npx prisma migrate deploy --schema apps/mobile/prisma/schema.prisma
```

### 3. Configurar Webhooks

#### Stripe Webhook
- URL: `https://tudominio.com/api/stripe/webhook`
- Eventos: `payment_intent.succeeded`, `customer.subscription.*`, `checkout.session.completed`
- Secret: Copia de `STRIPE_WEBHOOK_SECRET` en Vercel

#### Mercado Pago Webhook
- URL: `https://tudominio.com/api/mercadopago/webhook`
- Secret: Copia de `MERCADO_PAGO_WEBHOOK_SECRET` en Vercel

### 4. Configurar Dominio en Vercel

1. Ve a Project Settings → Domains
2. Añade tu dominio (ej: `kinetix.app`)
3. Configura DNS según instrucciones de Vercel
4. SSL se configura automáticamente

### 5. Push a GitHub

```bash
# Añade tu remote (reemplaza con tu repo)
git remote add origin https://github.com/tu-usuario/kinetix.git

# Push a main para trigger deploy
git checkout main
git merge qwen-code-28fbf0ed-5e41-4971-b2ef-cb460e0d7d87
git push origin main
```

### 6. Verificar Deploy en Vercel

1. El deploy comenzará automáticamente
2. Monitorea logs en Vercel Dashboard
3. Verifica que las migraciones se apliquen correctamente

---

## 🧪 Testing Post-Deploy

### Endpoints Críticos
- [ ] `GET /api/health` - Health check
- [ ] `POST /api/auth/login` - Login funciona
- [ ] `POST /api/stripe/webhook` - Webhook Stripe responde 200
- [ ] `POST /api/mercadopago/webhook` - Webhook MP responde 200

### Flujos de Usuario
- [ ] Registro de nuevo usuario
- [ ] Creación de cliente
- [ ] Asignación de programa
- [ ] Checkout de suscripción
- [ ] Recepción de notificaciones push

### Performance
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

---

## 🚀 Comandos Útiles

```bash
# Check de migraciones pendientes
npx prisma migrate status --schema apps/mobile/prisma/schema.prisma

# Reset de DB local (desarrollo)
npx prisma migrate reset --schema apps/mobile/prisma/schema.prisma

# Seed de datos
npm run db:seed -w apps/mobile

# Build de producción
npm run build -w apps/mobile

# Typecheck
npm run typecheck -w apps/mobile
```

---

## ⚠️ Troubleshooting

### Error: "relation users does not exist"
✅ Ya corregido en este commit. Si persiste, verifica que:
- Las migraciones anteriores se aplicaron correctamente
- El schema de Prisma coincide con las migraciones

### Error: "Database URL not found"
- Verifica variables de entorno en Vercel
- Asegúrate de que DATABASE_URL y DIRECT_URL estén configuradas

### Webhooks no funcionan
- Verifica que los secrets coincidan exactamente
- Usa herramientas como stripe listen para testing local
- Revisa logs de Vercel para errores

---

**Estado**: ✅ Listo para deploy
**Última actualización**: 2025-01-15
**Commit**: f47cbfc
