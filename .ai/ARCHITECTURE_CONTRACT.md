# KinetixFitt - Contrato de Arquitectura

## 🏗️ Límites Arquitectónicos Estrictos

### Regla Fundamental
Cada capa del sistema tiene responsabilidades claras. NO cruzar estos límites sin justificación arquitectónica documentada.

---

## 📁 Estructura de Directorios

```
/workspace
├── apps/
│   ├── mobile/          # ÚNICAMENTE UI móvil y lógica específica de plataforma
│   └── web/             # ÚNICAMENTE UI web y lógica específica de servidor
├── packages/
│   ├── shared/          # Lógica de negocio pura, tipos, validadores
│   ├── core/            # Rust Core para cálculos intensivos
│   └── config/          # Configuraciones compartidas (Tailwind, TSConfig)
├── .ai/                 # Gobernanza para agentes IA
├── docs/                # Documentación del proyecto
└── infra/               # Infraestructura (Docker, K8s, Terraform)
```

---

## 🚫 Límites de Importación

### LO QUE ESTÁ PROHIBIDO

❌ `apps/web` NO puede importar de `apps/mobile`
❌ `apps/mobile` NO puede importar de `apps/web`
❌ `packages/shared` NO puede importar de `apps/*`
❌ `packages/config` NO puede tener lógica de negocio

### LO QUE ESTÁ PERMITIDO

✅ `apps/*` PUEDE importar de `packages/*`
✅ `packages/shared` PUEDE importar de `packages/config`
✅ `packages/core/rust` PUEDE ser importado por `apps/*` y `packages/shared`

---

## 🎯 Responsabilidades por Capa

### Apps (`apps/mobile`, `apps/web`)
- Componentes UI específicos de plataforma
- Routing y navegación
- Integración con APIs
- Estado local de UI
- Responsive design
- Animaciones específicas

### Shared (`packages/shared`)
- Tipos TypeScript compartidos
- Validadores Zod
- Utilidades puras
- Constantes de dominio
- Formatters
- Cálculos fitness (si no son intensivos)

### Core (`packages/core/rust`)
- Cálculos fitness intensivos
- Procesamiento de series temporales
- Modelos ACWR
- Detección de PRs
- Cálculos de XP/Level
- Análisis estadístico

### Config (`packages/config`)
- Tailwind config compartido
- TypeScript base config
- ESLint config
- Prettier config
- Variables de entorno tipadas

---

## 🔄 Flujo de Datos

```
Usuario → App (UI) → API Route → Domain Logic → Database
                    ↓
              Rust Core (cálculos)
                    ↓
              Response → UI
```

### Reglas del Flujo

1. **UI nunca toca database directamente**
2. **API routes validan inputs antes de pasar a domain logic**
3. **Domain logic usa Rust Core para cálculos intensivos**
4. **Responses se tipan con types compartidos**

---

## 📦 Ownership de Código

### UI Components
- **Dueño**: `apps/mobile/src/components` o `apps/web/src/components`
- **Excepción**: Componentes idénticos en ambas apps → `packages/shared/ui`

### Business Logic
- **Dueño**: `packages/shared/src/domain` o `packages/core/rust`
- **Nunca**: En archivos de componente UI

### API Endpoints
- **Dueño**: `apps/web/src/app/api/*` o `apps/mobile/src/services/*`
- **Validación**: Zod schemas en `packages/shared/src/validators`

### Database Schema
- **Dueño**: `/prisma/schema.prisma` (raíz del monorepo)
- **Migraciones**: `/prisma/migrations/`

---

## 🔧 Dependencias

### Allowed Dependencies por Capa

#### Apps
- React, Next.js, React Native
- Framer Motion, Three.js (solo aquí)
- Recharts, D3 (solo web)
- Capacitor plugins (solo mobile)

#### Shared
- Zod (validación)
- Date-fns (fechas)
- Utils puras (lodash-es tree-shakeable)
- Types compartidos

#### Core (Rust)
- wasm-bindgen
- serde
- ndarray (matemáticas)
- No dependencias innecesarias

---

## 🚨 Señales de Alerta (Code Smells)

### Malo ❌
```typescript
// En componente UI
const volume = sets * reps * weight; // Cálculo de dominio en UI

// Importando entre apps
import { MobileComponent } from 'apps/mobile/...';

// Lógica de negocio en API route
if (workout.completed) {
  user.xp += 100; // Debería estar en domain logic
}
```

### Bueno ✅
```typescript
// En packages/shared
export function calculateVolume(sets: number, reps: number, weight: number) {
  return sets * reps * weight;
}

// En componente UI
import { calculateVolume } from '@kinetix/shared';
const volume = calculateVolume(sets, reps, weight);
```

---

## 📝 Decisiones Arquitectónicas

Ver `.ai/DECISIONS/` para:
- Por qué Rust para cálculos intensivos
- Por qué monorepo vs repos separados
- Por qué Next.js para web
- Por qué Capacitor para mobile

---

**Violaciones de este contrato deben ser justificadas en un ADR (Architecture Decision Record).**
