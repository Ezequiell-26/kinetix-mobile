#!/bin/bash

# Script de verificación pre-deploy para KinetixFitt
# Ejecutar antes de hacer deploy a producción

set -e

echo "🔍 Verificación Pre-Deploy - KinetixFitt"
echo "=============================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# 1. Verificar archivo .env
echo "1. Verificando variables de entorno..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Archivo .env encontrado"
    
    # Verificar variables críticas
    if grep -q "NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co" .env 2>/dev/null; then
        echo -e "${YELLOW}⚠${NC} WARNING: Supabase URL no configurada (usa valor por defecto)"
        ((WARNINGS++))
    fi
    
    if grep -q "JWT_SECRET=\"tu-jwt-secret-seguro-de-32-caracteres-minimo\"" .env 2>/dev/null; then
        echo -e "${YELLOW}⚠${NC} WARNING: JWT_SECRET no configurado (usa valor por defecto)"
        ((WARNINGS++))
    fi
    
    if grep -q "STRIPE_SECRET_KEY=sk_live_xxx" .env 2>/dev/null; then
        echo -e "${YELLOW}⚠${NC} WARNING: Stripe Key no configurada (usa valor por defecto)"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}✗${NC} ERROR: Archivo .env no encontrado"
    echo "   Copia .env.example a .env y configura tus credenciales"
    ((ERRORS++))
fi

echo ""

# 2. Verificar apps/mobile/.env
echo "2. Verificando configuración mobile..."
if [ -f "apps/mobile/.env" ]; then
    echo -e "${GREEN}✓${NC} Archivo apps/mobile/.env encontrado"
else
    echo -e "${YELLOW}⚠${NC} WARNING: apps/mobile/.env no encontrado"
    echo "   Copia apps/mobile/.env.example a apps/mobile/.env"
    ((WARNINGS++))
fi

echo ""

# 3. Verificar migraciones de Prisma
echo "3. Verificando migraciones de base de datos..."
if [ -d "apps/mobile/prisma/migrations" ]; then
    MIGRATION_COUNT=$(ls -1 apps/mobile/prisma/migrations | grep -c "^[0-9]" || echo 0)
    echo -e "${GREEN}✓${NC} $MIGRATION_COUNT migraciones encontradas"
else
    echo -e "${RED}✗${NC} ERROR: Directorio de migraciones no encontrado"
    ((ERRORS++))
fi

echo ""

# 4. Verificar seed data
echo "4. Verificando seed data..."
if [ -f "apps/mobile/prisma/seed.ts" ]; then
    echo -e "${GREEN}✓${NC} Seed script encontrado"
else
    echo -e "${RED}✗${NC} ERROR: Seed script no encontrado"
    ((ERRORS++))
fi

echo ""

# 5. Verificar Service Worker
echo "5. Verificando Service Worker..."
if [ -f "apps/mobile/public/sw.js" ]; then
    echo -e "${GREEN}✓${NC} Service Worker encontrado"
else
    echo -e "${RED}✗${NC} ERROR: Service Worker no encontrado"
    ((ERRORS++))
fi

echo ""

# 6. Verificar documentación de deploy
echo "6. Verificando documentación..."
if [ -f "DEPLOY.md" ]; then
    echo -e "${GREEN}✓${NC} Guía de deploy encontrada"
else
    echo -e "${YELLOW}⚠${NC} WARNING: DEPLOY.md no encontrado"
    ((WARNINGS++))
fi

echo ""

# 7. Verificar tests
echo "7. Verificando tests..."
TEST_COUNT=$(find . -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" | wc -l)
if [ "$TEST_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} $TEST_COUNT archivos de test encontrados"
else
    echo -e "${YELLOW}⚠${NC} WARNING: No se encontraron tests"
    ((WARNINGS++))
fi

echo ""

# 8. Verificar Docker configs
echo "8. Verificando configuración Docker..."
if [ -f "docker-compose.yml" ]; then
    echo -e "${GREEN}✓${NC} docker-compose.yml encontrado"
else
    echo -e "${YELLOW}⚠${NC} INFO: docker-compose.yml no encontrado (opcional)"
fi

echo ""

# 9. Verificar package.json scripts
echo "9. Verificando scripts de build..."
if grep -q '"build"' apps/mobile/package.json 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Script de build disponible"
else
    echo -e "${RED}✗${NC} ERROR: Script de build no encontrado"
    ((ERRORS++))
fi

echo ""
echo "=============================================="
echo "Resumen:"
echo -e "  Errores: ${RED}$ERRORS${NC}"
echo -e "  Warnigns: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ Hay errores críticos que deben resolverse antes del deploy${NC}"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Hay warnings que deberían revisarse${NC}"
    echo "   Puedes continuar con el deploy bajo tu responsabilidad"
    exit 0
else
    echo -e "${GREEN}✅ Todo está listo para deploy!${NC}"
    exit 0
fi
