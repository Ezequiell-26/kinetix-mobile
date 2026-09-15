# ==========================================
# KINETIXFITT - Dockerfile de Producción
# ==========================================
# Basado en Node.js 20 Alpine para menor tamaño
# Optimizado para Next.js standalone output

FROM node:20-alpine AS base

# Instalar dependencias de sistema necesarias
RUN apk add --no-cache libc6-compat openssl

# Configurar working directory
WORKDIR /app

# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM base AS deps

# Copiar package files
COPY package.json package-lock.json ./
COPY apps/mobile/package.json ./apps/mobile/
COPY packages/shared/package.json ./packages/shared/

# Instalar dependencias
RUN npm ci --only=production --ignore-scripts=false

# ==========================================
# Stage 2: Builder
# ==========================================
FROM base AS builder

WORKDIR /app

# Copiar dependencias instaladas
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/mobile/node_modules ./apps/mobile/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

# Copiar código fuente
COPY . .

# Setear variables de entorno para build (placeholders - reemplazar en runtime)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build de la aplicación
WORKDIR /app/apps/mobile
RUN npm run build

# ==========================================
# Stage 3: Runner (Producción)
# ==========================================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar standalone output desde builder
COPY --from=builder /app/apps/mobile/.next/standalone ./
COPY --from=builder /app/apps/mobile/.next/static ./apps/mobile/.next/static
COPY --from=builder /app/apps/mobile/public ./apps/mobile/public

# Copiar package.json para scripts adicionales si es necesario
COPY --from=builder /app/apps/mobile/package.json ./apps/mobile/

# Establecer propietario correcto
RUN chown -R nextjs:nodejs /app

USER nextjs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Iniciar aplicación
WORKDIR /app/apps/mobile
CMD ["node", "server.js"]
