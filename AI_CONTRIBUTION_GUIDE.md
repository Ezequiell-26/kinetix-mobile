# 🤖 Guía para IAs - Contribución y Mejora del Proyecto

Este documento está diseñado para que cualquier **IA (Qwen, Claude, GPT, etc.)** pueda analizar, entender y mejorar el proyecto Kinetix de manera efectiva y sin romper nada.

---

## 📋 Estructura del Proyecto

```
kinetix-mobile/ (MONOREPO)
├── apps/
│   ├── mobile/              # 📱 Cliente mobile + desktop (Capacitor + Electron)
│   │   ├── src/             # Código fuente React/TypeScript
│   │   ├── prisma/          # Base de datos (PostgreSQL)
│   │   ├── public/          # Assets estáticos
│   │   └── tests/           # Tests del app
│   ├── web/                 # 🌐 Dashboard trainer (Kinetix Web)
│   │   ├── src/             # Código fuente React/TypeScript
│   │   └── public/          # Assets estáticos
├── packages/
│   ├── shared/              # 📦 Componentes y utilidades compartidas
│   └── config/              # ⚙️ Configuración compartida
├── docs/                    # 📚 Documentación
├── MONOREPO.md              # Guía de structure del monorepo
├── AI_CONTRIBUTION_GUIDE.md # Este archivo
└── package.json             # Root con workspaces
```

---

## 🎯 Cómo Trabajar con el Proyecto

### 1️⃣ **Entender el Contexto**

Antes de hacer cambios:

```bash
# Ver cambios recientes
git log --oneline -10

# Ver estructura de carpetas
# apps/mobile → Cliente (user-facing)
# apps/web → Trainer dashboard (management)
```

### 2️⃣ **Cambios SIN Romper Nada**

Estrategia segura:

```
1. Crear rama: git checkout -b feature/tu-feature
2. Hacer cambios en UNA app o en packages/shared
3. Testear cambios locales
4. Commit con mensaje claro
5. Push y crear PR a 'develop'
6. Mergeado después de review
```

### 3️⃣ **Apps Independientes, Código Compartido**

```
// ❌ NO HAGAS: modificar ambas apps simétricamente sin razón
if (type === 'mobile') { ... } else if (type === 'web') { ... }

// ✅ SÍ HAGAS: usa packages/shared para código común
import { useAchievements } from '@packages/shared'

// Luego cada app lo usa:
// apps/mobile/src/hooks/mobile-achievements.ts → usa shared
// apps/web/src/hooks/web-achievements.ts → usa shared pero adapta UI
```

---

## 🔧 Stack Tecnológico

### Frontend (Ambas Apps)
- **Framework**: Next.js 14 + React 18
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **State**: React Hooks (+ Zustand si es necesario)

### Mobile Specifics
- **Desktop**: Electron (Windows/Mac/Linux)
- **Mobile**: Capacitor (iOS/Android)
- **PWA**: Service Workers

### Web Specifics
- **Dashboard**: Next.js server-side rendering
- **Real-time**: Server-Sent Events (SSE)

### Backend (Mobile App)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (jose library)
- **API**: Next.js API Routes
- **Monitoring**: Sentry

---

## 💾 Base de Datos

```typescript
// Ubicación: apps/mobile/prisma/schema.prisma

// Tablas principales:
- User (trainers + clients)
- Workout (programas de entrenamiento)
- Exercise (ejercicios)
- WorkoutLog (registro de entrenamientos)
- Checkin (check-ins de clientes)
- Achievement (logros desbloqueados)
- Measurement (medidas de clientes)
- Message (mensajería)
```

### Migraciones

```bash
# Ver migraciones
ls apps/mobile/prisma/migrations/

# Crear nueva: (NOT APPLICABLE - IAs no deberían crear directamente)
# Los cambios de schema deben ser coordinados con el owner
```

---

## 📱 Componentes Principales

### Mobile App (`apps/mobile`)

**Rutas principales:**

```
src/app/
├── (auth)/
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── (client)/
│   └── client/
│       ├── dashboard/
│       ├── workout/[id]/
│       ├── progress/
│       ├── nutrition/
│       ├── achievements/
│       └── messages/
├── (trainer)/
│   └── trainer/
│       ├── dashboard/
│       ├── clients/
│       ├── analytics/
│       ├── payments/
│       └── messages/
└── api/
    ├── auth/
    ├── workouts/
    ├── exercises/
    └── [more routes]
```

**Componentes reutilizables:** `src/components/`

```
- achievements.tsx (sistema de logros)
- exercise-library-ui.tsx (selector de ejercicios)
- workout-timeline.tsx (timeline de entrenamientos)
- analytics-charts.tsx (gráficos de progreso)
- ai-coach-chat.tsx (chat con IA)
- gamification components (retos, leaderboards)
```

### Web Dashboard (`apps/web`)

**Similar estructura para trainers:**

```
src/
├── (auth)/
├── (dashboard)/
└── api/
```

---

## ✅ Mejoras Seguras que las IAs Pueden Hacer

### 🟢 SEGURO

```
1. Refactor de componentes → mejora de performance
2. Optimizaciones de re-renders → React.memo, useMemo
3. Consolidación de código duplicado → packages/shared
4. Tipos TypeScript más estrictos → mejor DX
5. Tests → cobertura mayor
6. Mejoras de UX → sin cambios en DB
7. A11y improvements → accesibilidad
8. Performance optimization → bundle size, lazy loading
9. Error handling → logging, validations
10. Documentación → JSDoc, README updates
```

### 🟡 REQUIERE COORDINACIÓN

```
1. Cambios de API routes → afecta ambas apps
2. Cambios de schema.prisma → requiere migration
3. Cambios de autenticación → requiere testing en ambas apps
4. Cambios de UI/UX principal → revisar consistencia
```

### 🔴 NO HACER (JAMÁS)

```
1. Eliminar componentes sin verificar usages
2. Cambiar rutas de API existentes
3. Eliminar migrations
4. Cambiar estructura de DB
5. Cambiar métodos de autenticación
6. Borrar código sin comentario explicativo
7. Hacer commits sin descripción clara
8. Forzar pushes (force push)
```

---

## 🚀 Workflow para IAs

### Paso 1: Analizar el Proyecto

```bash
# Ver estado actual
git status
git log --oneline -5

# Entender cambios recientes
git diff develop[latest_branch]

# Ver tamaño del codebase
git ls-files | wc -l  # Total files
```

### Paso 2: Identificar Mejoras

Busca:

```
1. Duplicación de código → consolidar en packages/shared
2. Componentes sin memoization → optimizar
3. Large bundles → lazy load, code splitting
4. TODOs, FIXMEs, XXX en código → revisar si se pueden resolver
5. Sin tests unitarios → agregar
6. TypeErrors o any types → convertir a tipos específicos
7. Logs sin info → mejorar logging
8. Componentes con lógica mixta → separar concerns
```

### Paso 3: Plan de Acción

```markdown
## Análisis del Proyecto Kinetix

### Oportunidades Identificadas:
1. [componente A] - Problema: ...  - Impacto: ... - Riesgo: ...
2. [componente B] - Problema: ...  - Impacto: ... - Riesgo: ...

### Recomendaciones:
- [ ] Mejora 1 - Tipo: SEGURO
- [ ] Mejora 2 - Tipo: REQUIERE COORDINACIÓN
- [ ] Mejora 3 - Tipo: SEGURO

### Orden de Ejecución:
1. Crear rama `feature/improvements-1`
2. Implementar mejora 1
3. Testear
4. Crear PR con descripción clara
```

### Paso 4: Implementar

```bash
# Crear rama
git checkout -b feature/mejora-descriptiva

# Hacer cambios
# ... editar archivos ...

# Commit
git add .
git commit -m "feat: mejora específica + beneficio"

# Push
git push origin feature/mejora-descriptiva
```

### Paso 5: Pull Request

Template para PR:

```markdown
## Descripción
[Qué cambió y por qué]

## Tipo de Cambio
- [ ] Refactor (sin cambios funcionales)
- [ ] Mejora de Performance
- [ ] Consolidación de código
- [ ] Tests
- [ ] Otros: __

## Cambios Específicos
- [ ] Cambio 1
- [ ] Cambio 2

## Testing
- [ ] Mobile app funciona
- [ ] Web dashboard funciona
- [ ] No hay breaking changes

## Nota
[Información adicional si es necesaria]
```

---

## 📊 Métricas para Considerar

Antes de hacer mejoras, medir:

```typescript
// Performance
- Bundle size (apps/mobile vs apps/web)
- First Contentful Paint (FCP)
- Time to Interactive (TTI)
- Lighthouse score

// Code Quality
- TypeScript strict errors
- Test coverage
- Duplications
- Cyclomatic complexity

// User Experience
- Accessibility score
- Mobile responsiveness
- Error handling
- Loading states
```

---

## 🤝 Buenas Prácticas para IAs

### ✨ Commits Claros

```
❌ git commit -m "fix: bug"
✅ git commit -m "fix: prevent race condition in workout update"

❌ git commit -m "refactor"
✅ git commit -m "refactor: extract achievement logic to shared package"

❌ git commit -m "chore"
✅ git commit -m "chore: add missing TypeScript types to API routes"
```

### 📝 Comentarios en Código

```typescript
// ❌ Comentario inútil
const x = 42; // x equals 42

// ✅ Comentario útil
// Delay to debounce rapid API calls (e.g., während typing)
const DEBOUNCE_DELAY_MS = 300;

// ✅ O mejor aún: nombre claro + opcional JSDoc
const WORKOUT_UPDATE_DEBOUNCE_MS = 300;

/**
 * Validates workout data before sending to API
 * @param workout - Workout object to validate
 * @returns true if valid, throws error otherwise
 */
function validateWorkout(workout: Workout): boolean {
  // ...
}
```

### 🧪 Testing

```typescript
// ✅ Test cada lógica cambiada
describe('achievement calculation', () => {
  it('should unlock 5K steps achievement', () => {
    const result = calculateAchievements({ steps: 5000 });
    expect(result).toContain('5k-steps');
  });
});
```

### 🎯 Scope de PRs

```
✅ PR pequeño = 200-300 líneas de cambio
❌ PR gigante = 2000+ líneas

✅ Una mejora por PR = fácil de reviewear
❌ Múltiples mejoras = difícil de trackear
```

---

## 🆘 Si Algo Se Rompe

### Emergency Fix

```bash
# Ver qué se rompió
git diff

# Revert último commit
git revert HEAD

# O revert a estado conocido bueno
git reset --hard origin/develop
```

---

## 📞 Referencias Importantes

### Archivos Críticos (NO TOCAR sin coordinación)

```
- apps/mobile/prisma/schema.prisma    (DATA STRUCTURE)
- apps/mobile/src/lib/db.ts           (DB CONNECTION)
- apps/mobile/src/lib/auth.ts         (AUTHENTICATION)
- package.json                         (DEPENDENCIES)
- tsconfig.base.json                   (TS CONFIG)
```

### Documentación

```
- MONOREPO.md                 → Estructura del proyecto
- README.md                   → Inicio rápido
- apps/mobile/README.md       → Docs del app mobile
- apps/web/README.md          → Docs del web dashboard
```

---

## 🎓 Ejemplo: Refactoring Seguro

### Objetivo: Consolidar lógica de achievements

```
Paso 1: Analizar
├─ apps/mobile/src/lib/achievements.ts (440 líneas)
├─ apps/web/src/utils/achievements.ts  (450 líneas)
└─ Similar pero divergente → Opción 1: compartir

Paso 2: Plan
├─ Crear packages/shared/lib/achievements-core.ts (lógica pura)
├─ apps/mobile → importa del shared
├─ apps/web → importa del shared
└─ Testing en ambas

Paso 3: Implementar
├─ Crear archivo shared
├─ Mover lógica común
├─ Actualizar imports
├─ Test ambas apps
├─ Commit

Paso 4: PR
├─ Descripción: "refactor: consolidate achievements logic to shared"
├─ Todo verde en CI
├─ Ready para merge
```

---

## ✍️ Resumen

**Como IA, tu misión es:**

1. ✅ Mejorar sin romper
2. ✅ Código limpio y tipado
3. ✅ Tests cuando sea posible
4. ✅ Commits descriptivos
5. ✅ PRs pequeñas y focused
6. ✅ Documentación clara
7. ❌ Jamás cambios DB sin coordinación
8. ❌ Jamás force push
9. ❌ Jamás commits sin mensaje claro

**Resultado esperado:** Proyecto más mantenible, performante y limpio 🚀

---

**Última actualización:** September 12, 2026  
**Autor:** Ezequiel & AI Contributors  
**Status:** ACTIVE - Ready for AI contributions
