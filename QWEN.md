# QWEN — Reglas duras de este repo (leer ANTES de tocar nada)

Este archivo está por encima de tu comportamiento por defecto. `AGENTS.md` es la
autoridad de arquitectura; esto es el **protocolo anti-ruptura**. Incumplirlo ya
rompió `main` 4 veces (PR #17, #19, #20 + `.gitignore` con cercas). No seas la 5ª.

## 0. Dónde estás

- Clon local: `C:/Users/ofici/EzequielCoaching` — ramas `develop` (trabajo) y `main` (releases).
- La app vive en `apps/mobile/`. NO existe `src/` en la raíz ni `/workspace/`:
  toda ruta vieja tipo `src/...`, `prisma/...`, `middleware.ts` en raíz es del
  layout ANTERIOR al monorepo. Si tu rama la trae de vuelta, tu PR choca.
- Hay ~10 sesiones Qwen en paralelo + Hermes en este mismo clon.
  Otro agente puede pushear mientras trabajás. Asumilo siempre.

## 1. Antes de empezar (OBLIGATORIO)

```bash
git fetch origin
git checkout develop
git pull --rebase origin develop
git checkout -b feat/<tu-tarea>   # UNA rama por tarea, nombre descriptivo
```

- NUNCA trabajes directo en `develop` ni en `main`.
- NUNCA hagas `git checkout` si `git status` muestra cambios ajenos sin commitear.
- Si tu rama tiene >1 día: `git pull --rebase origin develop` ANTES de seguir
  y ANTES de abrir el PR. Rama vieja = PR con conflictos = tu PR se cierra.

## 2. Gate de calidad: NADA se pushea en rojo

Antes de CADA push, desde la RAÍZ del repo, los 3 en orden:

```bash
npx tsc --noEmit -p apps/mobile
npm run test --workspaces --if-present
```

- `tsc` debe terminar con CERO líneas `error TS`. Ojo con `strict: true`:
  NADA de parámetros sin tipo en callbacks (`.map((x: any, i: number) => ...)`).
  Los `any` explícitos con `eslint-disable` están permitidos; los IMPLÍCITOS rompen CI.
- Si tocaste build/config: `npm run build -w apps/mobile` también.
- Si algo falla: lo arreglás VOS en tu rama. Pushear en rojo está prohibido.

## 3. Prohibido commitear (el CI y Hermes lo revierten igual)

- `.gitignore`: NO TOCAR el bloque `KinetixFitt: higiene local`. Y jamás escribir
  cercas markdown (```) dentro — ya pasó, rompió los patrones de ignorado.
- Artefactos: `*.db*`, `*.tsbuildinfo`, `.next*/`, `out/`, `node_modules/`,
  `apps/mobile/public/uploads/`, `.env` (solo `.env.example`).
- `package-lock.json` de raíz: existe UNO solo. No crear segundos locks ni
  borrar workspaces de `package.json` raíz.
- `packages/shared`: SIN `devDependencies` (un solo `@types/react` en raíz;
  duplicarlo rompe el build con errores de `JSX element type`).

## 4. Dónde van los cambios

- Código app → `apps/mobile/src/...` · Docs de sesión → `.ai/...` (NO crear
  más `RESUMEN_*.md` / `SPRINT_*.md` en raíz: ya hay ~20 duplicados).
- PRs siempre contra `develop`, NUNCA contra `main`. `main` solo la mueve Hermes
  con fast-forward cuando el CI de `develop` está verde.
- Commits en español, formato: `tipo(alcance): descripción` — tipos:
  `feat fix chore docs refactor test ci`. Sin `--no-verify` salvo hook roto
  documentado en el mensaje del commit.
- Tras el push: verificar en
  `https://github.com/Ezequiell-26/kinetix-mobile/actions` que el run de TU rama
  termina `success`. Si falla, el fix va en TU rama, no en otra.

## 5. Archivos que YA existen: reutilizar, no duplicar

Antes de crear `components/X.tsx` o `lib/Y.ts`, buscar si existe algo igual en
`apps/mobile/src/components/`, `apps/mobile/src/lib/` y `packages/shared/src/`.
Dos sesiones ya implementaron 2 veces los mismos widgets (stats, coach,
wearables) y hubo que tirar una versión entera. `grep` primero, crear después.

## 6. Auth y DB (zona caliente)

- Sesiones: `apps/mobile/src/lib/session-store.ts` + `password-reset-store.ts`
  ya existen y están cableados. No crear stores paralelos.
- `prisma/schema.prisma`: cambios SIEMPRE vía `prisma migrate dev --name ...`
  con el dev server APAGADO (puerto 3001 libre), nunca editando `dev.db` a mano.
- Cuentas demo: existen en `prisma/seed.ts`. No inventar otras.

---
*Teams: si una regla de acá contradice tu default, gana esta. Si el repo te pide
algo que este archivo prohíbe, preguntale al dueño antes de hacerlo.*
