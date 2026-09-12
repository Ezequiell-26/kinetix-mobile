# KinetixFitt - Índice de Documentación para IA

Este archivo guía a los agentes de IA hacia la documentación relevante sin necesidad de leer todo el repositorio.

---

## 📚 Jerarquía de Documentos

### Nivel 1: Autoridad Máxima (LEER SIEMPRE)
- [`../AGENTS.md`](../AGENTS.md) - Reglas generales para todos los agentes
- [`../QWEN.md`](../QWEN.md) - Configuración específica para Qwen

### Nivel 2: Estado del Proyecto (LEER PARA CONTEXTO)
- [`PROJECT_STATE.md`](./PROJECT_STATE.md) - Estado actual, arquitectura, stack tecnológico
- [`ROADMAP_STATE.md`](./ROADMAP_STATE.md) - Qué está completado, en progreso o pendiente

### Nivel 3: Contratos por Área (LEER SEGÚN TAREA)

#### Arquitectura General
- [`ARCHITECTURE_CONTRACT.md`](./ARCHITECTURE_CONTRACT.md) - Límites entre componentes

#### Diseño y UI
- [`DESIGN_SYSTEM_CONTRACT.md`](./DESIGN_SYSTEM_CONTRACT.md) - Colores, tipografía, tokens
- [`MOTION_CONTRACT.md`](./MOTION_CONTRACT.md) - Animaciones y transiciones

#### Performance y 3D
- [`PERFORMANCE_CONTRACT.md`](./PERFORMANCE_CONTRACT.md) - Optimización, budgets
- [`3D_CONTRACT.md`](./3D_CONTRACT.md) - Three.js, WebGPU, modelos 3D

#### Backend y Datos
- [`DATABASE_CONTRACT.md`](./DATABASE_CONTRACT.md) - Prisma, migraciones, queries
- [`API_CONTRACT.md`](./API_CONTRACT.md) - Endpoints, validación, respuestas

#### Tecnologías Especiales
- [`RUST_CONTRACT.md`](./RUST_CONTRACT.md) - Cuándo y cómo usar Rust
- [`NATIVE_PLATFORM_CONTRACT.md`](./NATIVE_PLATFORM_CONTRACT.md) - Swift, Kotlin
- [`AI_CONTRACT.md`](./AI_CONTRACT.md) - Inteligencia Artificial, contexto

#### Calidad y Seguridad
- [`SECURITY_CONTRACT.md`](./SECURITY_CONTRACT.md) - Auth, encriptación, secretos
- [`TESTING_CONTRACT.md`](./TESTING_CONTRACT.md) - Tests unitarios, integración, E2E
- [`GIT_CONTRACT.md`](./GIT_CONTRACT.md) - Commits, branches, merges

### Nivel 4: Procesos y Definiciones
- [`DEFINITION_OF_DONE.md`](./DEFINITION_OF_DONE.md) - Criterios de completitud
- [`EXECUTION_PROTOCOL.md`](./EXECUTION_PROTOCOL.md) - Flujo de trabajo paso a paso

### Nivel 5: Decisiones Arquitectónicas
- [`DECISIONS/`](./DECISIONS/) - Registro de decisiones técnicas (ADRs)

---

## 🎯 Guía Rápida por Tipo de Tarea

### Si vas a modificar UI/UX
1. `AGENTS.md` (reglas generales)
2. `DESIGN_SYSTEM_CONTRACT.md` (tokens visuales)
3. `MOTION_CONTRACT.md` (animaciones)
4. Código existente del componente

### Si vas a agregar feature nueva
1. `AGENTS.md` (reglas generales)
2. `ARCHITECTURE_CONTRACT.md` (dónde va el código)
3. `PROJECT_STATE.md` (estado actual)
4. `DEFINITION_OF_DONE.md` (criterios de aceptación)

### Si vas a optimizar performance
1. `AGENTS.md` (reglas generales)
2. `PERFORMANCE_CONTRACT.md` (estrategias y budgets)
3. `3D_CONTRACT.md` (si involucra gráficos 3D)
4. Tests de benchmark existentes

### Si vas a tocar base de datos
1. `AGENTS.md` (reglas generales)
2. `DATABASE_CONTRACT.md` (reglas de migración)
3. `ARCHITECTURE_CONTRACT.md` (límites)
4. Schema de Prisma existente

### Si vas a implementar Rust/WASM
1. `AGENTS.md` (reglas generales)
2. `RUST_CONTRACT.md` (cuándo justifica usar Rust)
3. `ARCHITECTURE_CONTRACT.md` (integración)
4. Benchmarks existentes

### Si vas a trabajar con IA
1. `AGENTS.md` (reglas generales)
2. `AI_CONTRACT.md` (límites y seguridad)
3. `ARCHITECTURE_CONTRACT.md` (integración)
4. Contexto existente

### Si vas a hacer cambios de seguridad
1. `AGENTS.md` (reglas generales)
2. `SECURITY_CONTRACT.md` (reglas estrictas)
3. `ARCHITECTURE_CONTRACT.md` (impacto)
4. Tests de seguridad existentes

---

## 📁 Ubicación de Archivos Clave

### Código Fuente
```
/apps/mobile/          # App móvil
/apps/web/             # Dashboard web
/packages/shared/      # Código compartido
/packages/core/rust/   # Core en Rust
/packages/config/      # Configuraciones
```

### Documentación
```
/docs/                 # Documentación general
/.ai/                  # Gobernanza IA
/.ai/DECISIONS/        # Decisiones arquitectónicas
```

### Infraestructura
```
/infra/                # Docker, K8s, Terraform
.github/workflows/     # CI/CD
```

### Configuración
```
package.json           # Raíz del monorepo
apps/*/package.json    # Apps individuales
packages/*/package.json # Packages compartidos
```

---

## 🔍 Búsqueda Rápida

### Para encontrar componentes existentes
```bash
# Buscar componente por nombre
find /workspace -name "*.tsx" | grep -i "nombre"

# Buscar imports de un módulo
grep -r "from.*modulo" /workspace/apps /workspace/packages

# Ver usos de una función
grep -r "funcionNombre" /workspace --include="*.ts" --include="*.tsx"
```

### Para verificar estado
```bash
git status
git log --oneline -10
npm run typecheck
npm run lint
npm run test
npm run build
```

---

**Última actualización**: 2024
**Mantenimiento**: Actualizar cuando se agregue nueva documentación importante
