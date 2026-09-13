# 🎯 Guía Para IAs: Entender El Monorepo Unificado

## Este es un Monorepo de DOS Repos Que Fueron Unificados

### La Historia
```
ANTES (Dos Repos Separados):
├── kinetix-mobile/  (en GitHub)
└── kinetix-web/     (en GitHub separado)

AHORA (Un Solo Repo):
└── kinetix-mobile/
    ├── apps/mobile/  ← Antes: repo kinetix-mobile
    ├── apps/web/     ← Antes: repo kinetix-web
    └── packages/
        └── shared/   ← Nueva oportunidad para código común
```

### Lo Importante

Cuando trabajas con este repo, debes saber:

1. **Ambas apps ahora están en el MISMO repo** 
   - Antes: 2 PRs diferentes, 2 procesos
   - Ahora: 1 PR puede mejorar ambas apps

2. **Comparten dependencias** (via npm workspaces)
   - Cambio en `package.json` afecta AMBAS
   - Cambio en `tsconfig.base.json` afecta AMBAS

3. **Pero funcionan independientemente**
   - `apps/mobile/` se ejecuta solo
   - `apps/web/` se ejecuta solo
   - Cada una tiene su propia config, puede customizar

4. **OPORTUNIDAD: Código Duplicado**
   - Si `apps/mobile/src/lib/X.ts` y `apps/web/src/lib/X.ts` hacen lo mismo
   - Muévelo a `packages/shared/lib/X.ts`
   - Ambas apps lo importan
   - **Ganas**: Menos duplicación, más mantenible

---

## 🔍 Cómo Buscar Duplicación

### Paso 1: Identifica Archivos Similares
```
apps/mobile/src/lib/achievements.ts
apps/web/src/utils/achievements.ts  ← ¿Mismo contenido?

apps/mobile/src/lib/auth.ts
apps/web/src/lib/auth.ts           ← ¿Similar lógica?
```

### Paso 2: Compara Contenido
```bash
diff apps/mobile/src/lib/achievements.ts apps/web/src/lib/achievements.ts
```

### Paso 3: Si Hay Duplicación
**Estrategia A: Código IDÉNTICO**
```
1. Copia a packages/shared/lib/achievements.ts
2. Ambas apps importan desde shared
3. Elimina los archivos originales
4. Test: npm run build (debe compilar)
```

**Estrategia B: Código SIMILAR pero con diferencias**
```
1. Extrae lógica común → packages/shared/lib/achievements-core.ts
2. Envuelve en cada app con custom logic:
   - apps/mobile/src/lib/achievements.ts (importa shared + mobile-specific)
   - apps/web/src/lib/achievements.ts (importa shared + web-specific)
3. Test: npm run build + ambas apps funcionan
```

---

## 💡 Ejemplos de Consolidación

### Ejemplo 1: Utilidades de Cálculo (Fácil)
```
ANTES:
├── apps/mobile/src/lib/calc.ts    (función para calcular calorías)
└── apps/web/src/lib/calc.ts       (misma función)

DESPUÉS:
├── packages/shared/lib/calc.ts    (lógica pura sin UI)
├── apps/mobile/src/lib/calc.ts    (importa shared, agrega mobile-specific)
└── apps/web/src/lib/calc.ts       (importa shared, agrega web-specific)
```

### Ejemplo 2: Componentes UI (Medio)
```
ANTES:
├── apps/mobile/src/components/achievement-badge.tsx
└── apps/web/src/components/achievement-badge.tsx   (casi idéntica)

DESPUÉS:
├── packages/shared/components/achievement-badge-base.tsx  (lógica pura)
├── apps/mobile/src/components/achievement-badge.tsx (importa base, mobile styling)
└── apps/web/src/components/achievement-badge.tsx    (importa base, web styling)
```

### Ejemplo 3: Tipos TypeScript (Más Fácil)
```
ANTES:
├── apps/mobile/src/types/user.ts
└── apps/web/src/types/user.ts     (duplicada)

DESPUÉS:
├── packages/shared/types/user.ts   (una sola fuente de verdad)
├── apps/mobile/src/types/index.ts  (import from shared)
└── apps/web/src/types/index.ts     (importa from shared)
```

---

## ✅ Checklist: Mejora Consolidada

Antes de crear PR, verifica:

- [ ] Identifiqué código duplicado entre apps/mobile/ y apps/web/
- [ ] Extraje lo común a packages/shared/
- [ ] Actualicé imports en AMBAS apps
- [ ] Compilé sin errores: `npm run build`
- [ ] Probé mobile app: `npm run mobile` → funciona ✅
- [ ] Probé web app: `npm run web` → funciona ✅
- [ ] Commit menciona: "consolidate X to shared packages"
- [ ] PR explica qué se movió a shared

---

## 🚫 No Rompas Esto

NO hagas cambios que rompan la separación:

```javascript
// ❌ NO HAGAS: Asumir que solo existe mobile
if (process.env.NEXT_PUBLIC_ENV === 'mobile') { ... }

// ❌ NO HAGAS: Cambios en root package.json sin avisar
// (afecta AMBAS apps)

// ❌ NO HAGAS: Meter lógica mobile en web o viceversa
// (deben ser independientes)

// ✅ SÍ HAGAS: Shared code en packages/shared
// (común, sin dependencia una de otra)
```

---

## 📊 Estructur después de consolidación ideal

```
apps/mobile/                      apps/web/
├── src/                          ├── src/
│   ├── lib/                      │   ├── lib/
│   │   ├── achievements.ts       │   │   ├── achievements.ts
│   │   │   (importa shared)      │   │   │   (importa shared)
│   │   └── ...                   │   │   └── ...
│   ├── components/               │   ├── components/
│   │   └── ...                   │   │   └── ...
│   └── app/                      │   └── app/
│   ...                           │   ...
├── tsconfig.json                 ├── tsconfig.json
└── package.json                  └── package.json

packages/shared/                  ← MÁS CONTENIDO AQUÍ
├── lib/
│   ├── achievements-core.ts      ← Extráido de ambas
│   ├── calculations.ts           ← Extráido de ambas
│   └── ...
├── types/
│   ├── user.ts
│   ├── workout.ts
│   └── ...
├── components/                   ← Componentes sin UI specific
│   ├── data-displayer.tsx
│   └── ...
└── tsconfig.json
```

---

## 🎯 Tu Meta Como IA

Cuando trabajes:

1. **Entiende la historia**: Eran 2 repos, ahora son 1
2. **Aprovecha**:  Busca duplicación → consolida a shared
3. **Mejora ambas**: Si cambias mobile, revisa si web también lo necesita
4. **Test todo**: Ambas apps deben funcionar después
5. **Comunica**: Menciona en commit qué apps afectó

---

**Resultado**: Código más limpio, menos duplicación, más mantenible. 🚀
