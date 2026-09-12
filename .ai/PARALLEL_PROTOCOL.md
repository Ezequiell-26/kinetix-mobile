# PARALLEL_PROTOCOL — 10 agentes, 0 rupturas (V8 §84–§90)

## Respuesta corta a "¿10 Qwen a la vez está bien?"

Solo con este protocolo. Sin él ya se rompió 3 veces en 30 commits
(paths `../`, 500s de theme, `.gitignore` reescrito 4 veces).

## Reglas (obligatorias para toda sesión, Qwen o humana)

### 1. Una rama por sesión, jamás develop directo

```bash
git checkout develop && git pull --ff-only origin develop
git checkout -b feat/<dominio>-<n>   # o fix/<dominio>-<n>
```

Dominios sugeridos (V8 §85): `web-ux`, `backend-api`, `database`,
`fitness-domain`, `ai`, `3d`, `native`, `rust-wasm`, `testing`, `integration`.
Cada cuenta reclama UN dominio en `.ai/CLAIMS.md` (crear si no existe)
antes de trabajar. Dos sesiones, mismo dominio = coordinar primero.

### 2. Sincronizar antes de pushear

```bash
git fetch origin && git rebase origin/develop
npm run typecheck && npm run test     # desde apps/mobile
git push -u origin feat/<rama>
```

PR contra `develop`. Merge solo con CI verde. Prohibido:
`push --force`, `reset --hard`, `clean -fd`, `checkout -- .` sobre trabajo ajeno.

### 3. Zonas calientes (un dueño a la vez)

`next.config.mjs` · `tsconfig*.json` · `packages/shared/src/*` ·
`src/components/theme*` · `src/lib/auth.ts` · `prisma/schema.prisma` ·
`.gitignore` · `package*.json`.

Si tu cambio toca una zona caliente: avísalo en el PR y espera CI verde.
Nadie reescribe `.gitignore` sin leerlo antes (ya pasó 4 veces).

### 4. Gate local antes de cada push (V8 §80)

```bash
npx tsc --noEmit          # 0 errores (línea base 2026-09-12)
npm run test              # stats + core
npm run build             # si tocaste rutas, providers o next.config
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/login  # 200
```

Si algo falla: FIX IT o repórtalo. Nunca fingir que pasó (AGENTS.md).

### 5. Nunca commitear

`.next/` · `*.tsbuildinfo` · `prisma/*.db` · `node_modules/` ·
`public/uploads/*` · `.next-dev*/` · `.env*` (con valores reales).

### 6. Handoff obligatorio (V8 §86)

Al cerrar sesión, actualizar `.ai/PROJECT_REALITY.md`:
WHAT CHANGED / VERIFIED (comando + resultado) / REMAINS / RISKS / FILES.

### 7. Fuente de verdad

1. runtime real → 2. código → 3. tests → 4. schema/migraciones →
5. contratos → 6. docs. Si un doc contradice al código, se arregla el doc.

### 8. Prohibido (V8 §2, §95)

Funcionalidad finta, APIs inventadas, claims (WebGPU, anatomía
profesional, IA on-device, "100x") sin verificación, duplicar sistemas,
segundos backends/stores, dependencias innecesarias, reescribir todo.
