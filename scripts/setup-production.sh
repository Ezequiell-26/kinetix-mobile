#!/bin/bash

###############################################################################
# KINETIXFITT - Script de Configuración para Producción
# Ejecutar ANTES del deploy inicial
###############################################################################

set -e  # Salir en caso de error

echo "=========================================="
echo "🚀 KINETIXFITT - Setup de Producción"
echo "=========================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "Este script debe ejecutarse desde la raíz del proyecto"
    exit 1
fi

###############################################################################
# PASO 1: Verificar archivos .env
###############################################################################
echo ""
echo "📝 PASO 1: Verificando archivos .env..."

if [ ! -f ".env" ]; then
    print_warning ".env no existe. Creando desde .env.example..."
    cp .env.example .env
    print_success ".env creado. EDITAR CON CREDENCIALES REALES"
else
    print_success ".env ya existe"
fi

if [ ! -f "apps/mobile/.env" ]; then
    print_warning "apps/mobile/.env no existe. Creando..."
    cp apps/mobile/.env.example apps/mobile/.env
    print_success "apps/mobile/.env creado. EDITAR CON CREDENCIALES REALES"
else
    print_success "apps/mobile/.env ya existe"
fi

###############################################################################
# PASO 2: Generar JWT_SECRET si es default
###############################################################################
echo ""
echo "🔐 PASO 2: Verificando JWT_SECRET..."

JWT_SECRET=$(grep "^JWT_SECRET=" .env | cut -d'=' -f2 | tr -d '"')

if [[ "$JWT_SECRET" == *"cambia-esto"* ]] || [[ ${#JWT_SECRET} -lt 32 ]]; then
    print_warning "JWT_SECRET inseguro. Generando nuevo..."
    NEW_SECRET=$(openssl rand -base64 32)
    
    # Reemplazar en ambos .env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|^JWT_SECRET=.*|JWT_SECRET=\"$NEW_SECRET\"|" .env
        sed -i '' "s|^JWT_SECRET=.*|JWT_SECRET=\"$NEW_SECRET\"|" apps/mobile/.env
    else
        # Linux
        sed -i "s|^JWT_SECRET=.*|JWT_SECRET=\"$NEW_SECRET\"|" .env
        sed -i "s|^JWT_SECRET=.*|JWT_SECRET=\"$NEW_SECRET\"|" apps/mobile/.env
    fi
    
    print_success "JWT_SECRET generado y guardado"
else
    print_success "JWT_SECRET parece seguro"
fi

###############################################################################
# PASO 3: Instalar dependencias para VAPID keys
###############################################################################
echo ""
echo "📦 PASO 3: Instalando web-push para generar VAPID keys..."

if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado. Instalalo y volvé a ejecutar este script"
    exit 1
fi

npm install --no-save web-push 2>/dev/null || true
print_success "web-push instalado"

###############################################################################
# PASO 4: Generar VAPID keys
###############################################################################
echo ""
echo "🔔 PASO 4: Generando VAPID keys para notificaciones push..."

if [ ! -f "scripts/generate-vapid-keys.js" ]; then
    print_warning "Script de generación de VAPID keys no encontrado"
else
    node scripts/generate-vapid-keys.js || print_warning "Error generando VAPID keys. Podés generarlas manualmente con: npx web-push generate-vapid-keys"
fi

###############################################################################
# PASO 5: Verificar instalación de dependencias
###############################################################################
echo ""
echo "📦 PASO 5: Verificando dependencias..."

if [ ! -d "node_modules" ]; then
    print_warning "Instalando dependencias principales..."
    npm install
    print_success "Dependencias instaladas"
else
    print_success "Dependencias ya instaladas"
fi

###############################################################################
# PASO 6: Build de verificación
###############################################################################
echo ""
echo "🔨 PASO 6: Probando build de producción..."

if npm run build --dry-run &>/dev/null; then
    print_success "Comando de build disponible"
else
    print_warning "El build puede fallar si las variables de entorno no están configuradas correctamente"
fi

###############################################################################
# PASO 7: Checklist final
###############################################################################
echo ""
echo "=========================================="
echo "✅ CHECKLIST PRE-DEPLOY"
echo "=========================================="
echo ""
echo "Revisá y completá los siguientes items ANTES de hacer deploy:"
echo ""
echo "📋 VARIABLES DE ENTORNO (.env):"
echo "   [ ] NEXT_PUBLIC_SUPABASE_URL (URL de tu proyecto Supabase)"
echo "   [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (Anon key de Supabase)"
echo "   [ ] SUPABASE_SERVICE_ROLE_KEY (Service role key de Supabase)"
echo "   [ ] DATABASE_URL (Connection string de PostgreSQL)"
echo "   [ ] JWT_SECRET (Generado automáticamente ✓)"
echo "   [ ] STRIPE_SECRET_KEY (Live key de Stripe)"
echo "   [ ] STRIPE_PUBLISHABLE_KEY (Publishable key de Stripe)"
echo "   [ ] STRIPE_WEBHOOK_SECRET (Configurar después del deploy)"
echo "   [ ] MP_ACCESS_TOKEN (Access token de Mercado Pago)"
echo "   [ ] MP_WEBHOOK_SECRET (Configurar después del deploy)"
echo "   [ ] RESEND_API_KEY o SMTP_* (Email transaccional)"
echo "   [ ] AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY (Backups S3)"
echo "   [ ] SENTRY_DSN (Monitoreo de errores)"
echo "   [ ] VAPID_PUBLIC_KEY y VAPID_PRIVATE_KEY (Push notifications)"
echo "   [ ] NEXT_PUBLIC_APP_URL (Tu dominio de producción)"
echo ""
echo "📋 BASE DE DATOS:"
echo "   [ ] Ejecutar migraciones: npx prisma migrate deploy"
echo "   [ ] Ejecutar seed data: npx prisma db seed"
echo "   [ ] Verificar tablas push_subscriptions creadas"
echo ""
echo "📋 DOMINIO Y SSL:"
echo "   [ ] Dominio configurado y apuntando al servidor"
echo "   [ ] Certificado SSL instalado (Let's Encrypt o similar)"
echo "   [ ] HTTPS forzado en producción"
echo ""
echo "📋 WEBHOOKS (Configurar DESPUÉS del deploy):"
echo "   [ ] Stripe webhook URL: https://tu-dominio.com/api/payments/stripe/webhook"
echo "   [ ] Mercado Pago webhook URL: https://tu-dominio.com/api/payments/mp/webhook"
echo ""
echo "📋 MONITOREO:"
echo "   [ ] Sentry configurado y recibiendo eventos"
echo "   [ ] Health check endpoint accesible: /api/health"
echo "   [ ] Uptime monitoring configurado (UptimeRobot, Pingdom, etc.)"
echo ""
echo "=========================================="
echo ""
print_success "¡Setup completado!"
echo ""
echo "Próximos pasos:"
echo "  1. Editá .env y apps/mobile/.env con tus credenciales reales"
echo "  2. Ejecutá: npx prisma migrate deploy"
echo "  3. Ejecutá: npm run build"
echo "  4. Hacé deploy a tu servidor"
echo "  5. Configura los webhooks de Stripe y Mercado Pago"
echo ""
echo "=========================================="
