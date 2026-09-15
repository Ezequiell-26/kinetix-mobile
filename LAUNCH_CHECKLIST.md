# 🚀 CHECKLIST DE LANZAMIENTO - KINETIXFITT

## ESTADO ACTUAL (2026-09-15)

### ✅ COMPLETADO

#### 1. Configuración de Vercel
- [x] **vercel.json** creado en `apps/mobile/`
  - Framework: Next.js configurado
  - Build command: `prisma generate && next build`
  - Headers de seguridad incluidos
  - Región: iad1 (US East)

#### 2. Variables de Entorno
- [x] **.env.production** creado como template
- [x] **.env.example** existe con todos los campos requeridos
- [ ] ⚠️ **FALTA**: Configurar variables reales en Vercel Dashboard

#### 3. Base de Datos
- [x] Migraciones existentes en `prisma/migrations/`
  - 20260913000000_postgres_init
  - 20260913060000_drop_password_reset_dupe
  - 20260914120000_notification_prefs
  - 20260914_add_perf_indexes
  - 20260914_ftue_onboarding
  - 20260914_push_notifications
- [ ] ⚠️ **FALTA**: Ejecutar `npx prisma migrate deploy` en producción

#### 4. Webhooks de Pago
- [x] Endpoint `/api/payments/webhook` implementado
  - Soporta Stripe
  - Soporta Mercado Pago
  - Verificación de firmas incluida
- [ ] ⚠️ **FALTA**: Configurar webhooks en Stripe Dashboard
- [ ] ⚠️ **FALTA**: Configurar webhooks en Mercado Pago Dashboard

#### 5. Documentación
- [x] **VERCEL_DEPLOY_GUIDE.md** creado con instrucciones completas
- [x] **DEPLOY.md** ya existía con guía detallada
- [x] **PRODUCCION_LISTO.md** ya existía

---

## ⚠️ LO QUE FALTA PARA LANZAR EL PRODUCTO

### 🔴 CRÍTICO (Requerido para lanzar)

#### 1. Variables de Entorno Reales [PRIORIDAD ALTA]
**Acción:** Ir a Vercel Dashboard > Project Settings > Environment Variables

Variables requeridas:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
DIRECT_URL
JWT_SECRET
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
MP_ACCESS_TOKEN
MP_PUBLIC_KEY
MP_WEBHOOK_SECRET
RESEND_API_KEY o SMTP_USER/SMTP_PASS
EMAIL_FROM
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
BACKUP_S3_BUCKET
VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
```

**Cómo obtener:**
- Supabase: https://app.supabase.com > Settings > API
- Stripe: https://dashboard.stripe.com/apikeys
- Mercado Pago: https://www.mercadopago.com.ar/developers/panel
- Resend: https://resend.com/api-keys
- AWS: https://console.aws.amazon.com/iam
- VAPID: Ejecutar `node scripts/generate-vapid-keys.js`

#### 2. Aplicar Migraciones [PRIORIDAD ALTA]
**Comando:**
```bash
cd apps/mobile
npx prisma migrate deploy
```

**Nota:** Esto debe ejecutarse UNA VEZ antes del primer deploy, y cada vez que haya nuevas migraciones.

#### 3. Configurar Webhooks [PRIORIDAD ALTA]

**Stripe:**
1. Ir a https://dashboard.stripe.com/test/webhooks (modo test primero)
2. Agregar endpoint: `https://tu-dominio.vercel.app/api/payments/webhook`
3. Eventos: 
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment.succeeded
   - invoice.payment.failed
4. Copiar `Signing Secret` a Vercel: `STRIPE_WEBHOOK_SECRET`

**Mercado Pago:**
1. Ir a https://www.mercadopago.com.ar/developers/panel
2. Sección Integraciones > Webhooks
3. URL: `https://tu-dominio.vercel.app/api/payments/webhook`
4. Eventos: payment.created, payment.updated, subscription.created, subscription.updated
5. Copiar secret a Vercel: `MP_WEBHOOK_SECRET`

#### 4. Dominio Personalizado [PRIORIDAD MEDIA]
**En Vercel:**
1. Project Settings > Domains
2. Agregar: `tudominio.com`
3. Configurar DNS:
   - A record: @ → 76.76.21.21
   - CNAME: www → cname.vercel-dns.com
4. SSL es automático

---

### 🟡 RECOMENDADO (Mejora la calidad pero no bloquea el lanzamiento)

#### 5. Testing Completo [PRIORIDAD MEDIA]

**Flujos críticos a testear:**
- [ ] Registro de nuevo usuario
- [ ] Login con email/password
- [ ] Login con Google (si está habilitado)
- [ ] Recuperación de contraseña
- [ ] Crear programa de entrenamiento
- [ ] Guardar progreso de workout
- [ ] Subir foto de progreso
- [ ] Comprar suscripción (Stripe test mode)
- [ ] Comprar suscripción (Mercado Pago test mode)
- [ ] Cancelar suscripción
- [ ] Recibir notificación push
- [ ] Funcionalidad offline

**Herramientas:**
```bash
# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Health check manual
curl https://tu-dominio.vercel.app/api/health
```

#### 6. Monitoreo y Analytics [PRIORIDAD BAJA]

**Sentry (Errores):**
```
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

**PostHog (Analytics):**
- Ya configurado en `components/posthog-provider.tsx`
- Solo falta agregar key en variables de entorno

**Google Analytics:**
- Configurar en Vercel o vía tag manager

#### 7. Optimización SEO [PRIORIDAD BAJA]

**Archivos existentes:**
- [x] `app/sitemap.ts` - Genera sitemap automáticamente
- [x] `app/robots.ts` - Configuración de robots.txt
- [x] `app/opengraph-image.tsx` - OG image dinámica
- [x] `app/twitter-image.tsx` - Twitter card

**Falta:**
- [ ] Configurar dominio en Google Search Console
- [ ] Submit sitemap.xml
- [ ] Configurar Google My Business

#### 8. Legal y Compliance [PRIORIDAD MEDIA]

**Archivos existentes:**
- [x] Páginas legales en `app/legal/`
- [x] Términos y condiciones
- [x] Política de privacidad
- [x] Cookie banner implementado

**Falta:**
- [ ] Revisar con abogado local (recomendado)
- [ ] Configurar cookie consent management (OneTrust, Cookiebot, etc.)
- [ ] GDPR compliance si hay usuarios EU

---

### 🟢 OPCIONAL (Nice-to-have)

#### 9. Performance [PRIORIDAD BAJA]

**Optimizaciones ya implementadas:**
- [x] Imágenes en formato WebP
- [x] Lazy loading de componentes
- [x] Code splitting automático (Next.js)
- [x] Cache de imágenes (30 días)
- [x] Optimized package imports (lucide-react, framer-motion, etc.)

**Falta:**
- [ ] Configurar CDN para assets estáticos
- [ ] Implementar Service Worker avanzado (ya hay uno básico)
- [ ] Lighthouse score > 90 en todas las categorías

#### 10. Backup y Recovery [PRIORIDAD MEDIA]

**Ya implementado:**
- [x] Script de backup en `scripts/backup.js`
- [x] Backup automático a S3 (configurable)

**Falta:**
- [ ] Configurar cron job para backups diarios
- [ ] Testear restore de backup
- [ ] Configurar alertas de backup fallido

#### 11. Escalabilidad [PRIORIDAD BAJA]

**Para cuando tengas tráfico:**
- [ ] Configurar Redis para rate limiting distribuido
- [ ] Implementar cache de consultas frecuentes
- [ ] Configurar auto-scaling en Vercel Pro
- [ ] Monitorear costos de Supabase

---

## 📋 PLAN DE LANZAMIENTO PASO A PASO

### Semana 1: Preparación

**Día 1-2: Configuración de Infraestructura**
1. Crear cuenta en Vercel
2. Conectar repositorio de GitHub
3. Configurar variables de entorno en Vercel
4. Ejecutar migraciones de base de datos
5. Deploy inicial (modo borrador)

**Día 3-4: Configuración de Pagos**
1. Activar modo live en Stripe
2. Configurar webhooks de Stripe
3. Activar modo live en Mercado Pago
4. Configurar webhooks de Mercado Pago
5. Testear flujo completo de pago

**Día 5: Testing**
1. Ejecutar todos los tests unitarios
2. Ejecutar tests E2E críticos
3. Testing manual de flujos principales
4. Corregir bugs encontrados

### Semana 2: Lanzamiento

**Día 1-2: Dominio y SSL**
1. Configurar dominio personalizado en Vercel
2. Verificar DNS propagation
3. Confirmar SSL activo
4. Actualizar URLs en Stripe/MP

**Día 3: Soft Launch**
1. Lanzar a grupo pequeño de beta testers
2. Monitorear logs y errores
3. Recoger feedback
4. Ajustes menores

**Día 4-5: Launch Oficial**
1. Anunciar en redes sociales
2. Email a lista de espera (si existe)
3. Monitorear métricas en tiempo real
4. Soporte técnico disponible

---

## 🎯 MÉTRICAS DE ÉXITO

### Primera Semana
- [ ] 0 errores críticos en Sentry
- [ ] 99.9% uptime (Vercel SLA)
- [ ] < 2s tiempo de carga promedio
- [ ] 10+ usuarios activos
- [ ] 1+ venta exitosa

### Primer Mes
- [ ] 100+ usuarios registrados
- [ ] 10+ suscripciones activas
- [ ] < 1% churn rate
- [ ] 4+ estrellas en feedback
- [ ] ROI positivo en marketing

---

## 🆘 SOPORTE POST-LANZAMIENTO

### Monitoreo Diario
- Revisar logs de Vercel
- Chequear errores en Sentry
- Verificar webhooks de pagos
- Monitorear uso de Supabase

### Mantenimiento Semanal
- Actualizar dependencias
- Revisar métricas de rendimiento
- Analizar feedback de usuarios
- Planear mejoras

### Respuesta a Incidentes
1. Identificar problema en logs
2. Evaluar impacto (usuarios afectados)
3. Comunicar a usuarios si es crítico
4. Deploy de hotfix si es necesario
5. Post-mortem y prevención

---

## 📞 CONTACTOS ÚTILES

- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/dashboard/support
- **Stripe Support:** https://stripe.com/support
- **Mercado Pago Support:** https://www.mercadopago.com.ar/ayuda

---

**Documento creado:** 2026-09-15
**Próxima revisión:** 2026-09-22
**Responsable:** Equipo de Desarrollo
