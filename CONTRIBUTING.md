# Contribuir a EZEQUIEL COACHING

Gracias por querer mejorar la plataforma.

## Flujo Git Profesional

1. **Branch:** `main` (prod) ← `develop` ← `feat/*`, `fix/*`, `docs/*`
2. **Commits:** Conventional Commits `feat:`, `fix:`, `docs:`, `refactor:`, `perf:`, `test:`
   - Ej: `feat(nutrition): agrega calculadora TDEE`
   - Ej: `fix(auth): cookie Secure en http`
3. **PR:** contra `develop`, con descripción, screenshots y test
4. **CI:** `npm run build` + `lint` + `tsc` deben pasar

## Setup

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

## Calidad

- TypeScript estricto, sin `any`
- Componentes en `src/components/ui`, lógica en `src/lib`
- Tests para flujos críticos
- Mobile-first 320-1024, sin scroll horizontal

## Código de Conducta

Sé respetuoso, profesional y enfócate en el cliente.
