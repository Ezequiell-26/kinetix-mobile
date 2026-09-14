# Guía Git Profesional — EZEQUIEL COACHING

## Ramas

- `main` — producción (protegida, solo via PR)
- `develop` — integración
- `feat/*` — features (ej: `feat/nutrition`)
- `fix/*` — fixes (ej: `fix/auth-cookie`)
- `docs/*` — docs

## Commits

Conventional Commits:

```
feat: agrega calculadora TDEE
fix: corrige Secure cookie en http
docs: actualiza README
refactor: extrae useDebounce
perf: paraleliza dashboard queries
```

## Flujo

```bash
git checkout develop
git checkout -b feat/nueva
# ... cambios
git add .
git commit -m "feat: descripción"
git push -u origin feat/nueva
# PR a develop → CI (build, lint, tsc) → merge → PR develop → main
```

## CI

- `npm run build` 35/37 rutas
- `npm run lint` 0 warnings
- `npx tsc --noEmit` 0

## Publicar

```bash
git remote add origin https://github.com/ezequiel-coaching/ezequiel-coaching.git
git push -u origin main
git push -u origin develop
```

## Versionado

Usamos `CHANGELOG.md` + tags `v1.0.0`, `v1.1.0`
