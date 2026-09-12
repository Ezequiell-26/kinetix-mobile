# .ai/PROJECT_REALITY.md — Mapa canónico de realidad (V8 §5)

> Fuente de verdad operativa entre sesiones/agentes. El código manda;
> si este archivo contradice al código, se corrige el archivo.
> Estados: IMPLEMENTED · PARTIAL · NOT IMPLEMENTED · BLOCKED · VERIFIED · UNVERIFIED.
> Última actualización: 2026-09-12 (sesión Hermes + 3 auditores).

## Cómo usar este archivo (toda sesión Qwen/Hermes)

1. Leerlo antes de tocar nada (V8 §84).
2. Verificar en código lo que vayas a usar (no asumir).
3. Al cerrar sesión, actualizar: WHAT CHANGED / VERIFIED / REMAINS / RISKS (V8 §86).

## Estado por subsistema

### WEB APP — rutas (34 page.tsx en apps/mobile/src/app)

| Área | Estado | Verificación |
|---|---|---|
| `/` → redirect por rol | IMPLEMENTED | `src/app/page.tsx` usa `getSession()` fail-closed (2026-09-12). Antes verificaba con secreto hardcodeado |
| `(auth)/login` | VERIFIED | HTTP 200 + `POST /api/auth/login` → `{"ok":true,"role":"CLIENT"}` con `martin@demo.com`. Demos: trainer `ezequiel@ezequielcoaching.com/Admin123!`, cliente `martin@demo.com/cliente123` |
| `(auth)/register`, `forgot-password` | IMPLEMENTED | register fuerza `role:"CLIENT"`; reset con token 1 uso TTL 30min (store en memoria — se pierde al reiniciar) |
| `(client)/*` 16 rutas | PARTIAL | 500 `useTheme...` CORREGIDO y VERIFICADO en vivo 2026-09-12: `/client/workout`, `/client/progress`, `/client/dashboard` → 200 con sesión real (causa: provider sin valor en SSR; fix: Provider siempre renderizado) |
| `(trainer)/*` 14 rutas | PARTIAL | Mismo 500 (mismo chrome). Mismo fix |
| `loading.tsx` / `error.tsx` / `not-found.tsx` | NOT IMPLEMENTED | Cero archivos en `app/`. Existen `ui/skeleton`, `ui/loading-state`, `ui/empty-state` sin usar en rutas |
| UX states por página | PARTIAL | dashboard: catch por fuente ✅; workout: `.catch(()=>null)`; progress/nutrition/messages: `catch{}` silenciosos ❌; messages: polling 3s + rollback optimista |

### DOMAIN (packages/shared/src)

| Pieza | Estado |
|---|---|
| `domain/fitness` (MuscleId 15, MuscleRole, ExerciseDefinition, MovementPattern, Equipment, Difficulty, Laterality, COMMON_EXERCISES 6) | IMPLEMENTED + VERIFIED (tsc) |
| `utils` (cn, fechas, cálculos, XP) | IMPLEMENTED |
| `constants` (BRAND, colores, spacing…) | IMPLEMENTED (2026-09-12: eliminado `APP_CONFIG` fantasma del default export → tsc verde) |
| `components` (button, card, input, badge, skeleton, empty-state) | IMPLEMENTED |
| `services/background-sync.ts` | PARTIAL (registra SW, sin sync real verificada) |
| `types` | IMPLEMENTED |

**Regla**: `apps/mobile` importa dominio vía `@kinetix/shared` (tsconfig `paths` → `../../packages/shared/src/*`; el `../` anterior rompía todo con 500 — no repetir). No usar `name.includes("press")` como lógica canónica (V8 §19).

### BACKEND / API (24 rutas en src/app/api)

Auth por `getSession()` en todas salvo `version` (pública intencional). `GET /api/analytics` reescrito 2026-09-12: solo TRAINER + agregados reales (sin mock, sin retención inventada) — verificado: trainer 200, cliente 401, anónimo 401. `POST /api/analytics` atribuye sesión, ignora `userId` del body. Ownership CLIENT-scoped ✅ en checkins/measurements/photos/workout-logs/messages/notifications/uploads. Brecha: ramas TRAINER aceptan cualquier `clientId` sin verificar pertenencia (OK con 1 trainer; IDOR horizontal si hay 2+).

### AUTH / SEGURIDAD

- bcrypt cost 10 ✅ · JWT HS256 7d ✅ (sin refresh; logout solo borra cookie — token robado vive hasta expirar).
- Cookie `secure` environment-sensitive (fix 2026-09-12; antes `false` siempre).
- `secret.ts` fail-closed en prod ✅.
- `POST /api/uploads`: allowlist `type ∈ {progress,checkin,message}` + extensión por allowlist (fix 2026-09-12; antes traversal `type=../..` + ext arbitraria).
- Rate-limit en memoria (se pierde al reiniciar).
- Reset-password: token logueado en consola SOLO en dev (sin email real configurado) — riesgo aceptado y documentado.
- CSP: solo producción (en dev dejaba página en blanco por React Refresh `eval`). `cdn.jsdelivr.net` permitido en `style-src`.

### DATABASE (Prisma SQLite, 19 modelos)

Migraciones aplicadas ✅ · seed OK (trainer + 3 clientes demo + programa + mensajes). Índices completos desde migración `add-missing-indexes` (2026-09-12): Notification(userId,read), Measurement/Photo(userId,clientId,date), Message.senderId, CheckIn.userId. `onDelete` Cascade/SetNull coherentes con historia ✅. Pendiente: `Payment` huérfana (sin relaciones); `Client.assignedProgramId` sin `onDelete` (borrar programa asignado falla).

### 3D (packages/core/3d-engine + src/3d + Exercise3DViewer)

- Renderer: **WebGL (three.js), NO WebGPU** — prohibido afirmarlo.
- Sin OffscreenCanvas real (solo un `console.warn` engañoso en `engine.ts:60`).
- Sin Web Workers de cómputo (solo Service Workers PWA).
- Viewer migrado a `exercise: ExerciseDefinition` (f1d9759). Anatomía = geometría procedural, NO activo anatómico profesional (decirlo explícito en UI/docs).
- Cámara: una autoridad (OrbitControls + reset determinista tras fix e252374).

### AI / PYTHON / RUST / NATIVE — verdad

- AI: UI de chat existe; NO hay inferencia on-device verificada ni provider real integrado → marcar PARTIAL donde corresponda, nunca "AI-powered".
- `packages/ai-models` (Python): archivado como referencia, no integrado al runtime web.
- Rust/WASM: solo donde aporte valor medido; sin benchmarks no se afirma aceleración.
- iOS/Android (`packages/native-modules`): fuentes existen, integración NO verificada → NOT VERIFIED.
- PWA: manifest + icons + SW ✅. Capacitor/Electron: envoltorios existen, packaging no verificado end-to-end. NO hay `apps/web` real (restos untracked) — prohibido documentarlo como existente.

### DUPLICADOS conocidos (V8 §8)

- `command-palette.tsx` = shim de `command-palette-pro.tsx` ✅ resuelto.
- `photo-compare.tsx` vs `photo-ai-compare.tsx` → DUPLICADO real, pendiente unificar.
- Timers: `timers-hub.tsx` ⊃ `hiit-timer.tsx` + ruta `client/timers` → pendiente unificar en Hub.
- Nutrición fragmentada (nutrition-pro / macro-timing / food-database / openfoodfacts-pro) → pendiente diseño único.

### HIGIENE (V8 §6)

Trackeados indebidos: `apps/mobile/.next/*`, `*.tsbuildinfo`, `prisma/*.db`, `packages/shared/node_modules/*`. Untracked basura: `.next-dev*/`, `.next-stale*/`, `test-core.db`, `public/uploads/*`. `.gitignore` reescrito 4 veces en 15 commits — congelado desde 2026-09-12 (ver ítems abajo). `dev.db` modificado en working tree = solo datos locales de seed, no commitear.

### TESTS / CI

- Tests: `test:stats` + `test:core` (tsx puntuales). Sin pirámide (V8 §52 = REMAINING).
- CI: `.github/workflows/ci.yml` (typecheck+test+build) creado 2026-09-12. Línea base VERIFICADA: `tsc --noEmit` ✅ 0 errores · `npm run test` ✅ 25 pass (16 stats+voice, 9 core) · `npm run build` ✅ 35+ rutas compilan · login API ✅.
- Scripts raíz con `--if-present` + `typecheck` agregado (2026-09-12; antes `npm run build --workspaces` rompía por paquetes sin script y AGENTS exigía un `typecheck` inexistente).

## Fixes 2026-09-12 (sesión Hermes, SIN commitear — los sube Qwen)

1. `apps/mobile/tsconfig.json`: `paths @kinetix/shared` `../` → `../../` (500 global).
2. `apps/mobile/next.config.mjs`: CSP solo en prod + `cdn.jsdelivr.net` en style-src (blanco en dev).
3. `packages/shared/src/constants/index.ts`: `APP_CONFIG` fantasma → `BRAND` (tsc verde).
4. `src/components/theme-provider.tsx`: Provider siempre renderizado (500 /client+trainer).
5. `src/lib/auth.ts`: cookie `secure` por entorno.
6. `src/app/api/uploads/route.ts`: allowlists type/ext.
7. `src/app/page.tsx`: verificación vía `getSession()` (sin secreto hardcodeado).
8. `package.json` raíz: `--if-present` + `typecheck`. `apps/mobile/package.json`: script `typecheck`.

## Riesgos abiertos

1. 10 sesiones en paralelo sin CI verde obligatorio → ver PARALLEL_PROTOCOL.md.
2. `/analytics` sin auth; TRAINER sin segmentación por entrenador (IDOR futuro).
3. Sesiones JWT 7d sin revocación; reset store en memoria.
4. Duplicados photo/timers/nutrición pendientes.
5. `apps/web` untracked: decidir si existe o se borra antes de que alguien lo reviva.
