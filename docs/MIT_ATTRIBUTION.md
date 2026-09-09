# Atribución MIT

Este proyecto integra patrones e ideas de los siguientes repositorios MIT, con atribución y respeto a sus licencias:

## 1. jessedelira/gym-tracker — MIT

- **Repo:** https://github.com/jessedelira/gym-tracker
- **Licencia:** MIT — https://github.com/jessedelira/gym-tracker/blob/main/LICENSE
- **Autor:** Jesse De Lira — jessedelira1@gmail.com
- **Uso en EZEQUIEL COACHING:**
  - Patrón `ActiveSession` / `CompletedSession` para tracking de entreno en curso vs completado (adaptado a `WorkoutLog` con `status` y `startedAt`)
  - Componente `ChangelogNotification` (adaptado a `VersionBadge` + `/trainer/changelog`)
  - `ActivityGraph` inspirado para `analytics-charts.tsx` (Recharts)
  - `SearchableDropdown` para biblioteca de ejercicios
  - Estructura `Routine` → `Session` → `Workout` inspiró `Program` → `Phase` → `Week` → `Workout`
  - Configuración `vitest`, `Dockerfile`, `SECURITY.md` como referencia para calidad

> MIT License — Permiso para usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del Software.

## 2. iain-broomell/OpenFit — MIT

- **Repo:** https://github.com/iain-broomell/OpenFit
- **Licencia:** MIT
- **Uso:** Inspiración para soporte cross-platform (Expo) y estructura `RoutineCreator` para nuestro `Creador de entrenamientos` con Fases y superseries.

## 3. jovandeginste/workout-tracker — MIT (Go)

- **Uso:** Inspiración para manejo de archivos GPX/TCX y segmentación de rutas (futuro: importar entrenos de wearables).

Todas las integraciones mantienen la licencia MIT original y atribuyen a sus autores. El código adaptado es original y no es copia literal, sino inspiración de patrones.

## 4. Cawlumm/lyftr (MIT) — 328★ — https://github.com/Cawlumm/lyftr
Self-hosted fitness tracker Go+Gin+SQLite+React (Astro/Go/React). Features: 800+ exercise library, program builder, Gym Mode (guided active, one exercise at a time + rest timer), PRs + progression charts + muscle diagrams, weight trend, nutrition.
**Integrado:** src/components/gym-mode.tsx (Gym Mode full-screen MIT), pr-tracker.tsx (PRs + 1RM Epley MIT), muscle-map.tsx (muscle heatmap MIT) en /client/progress y /client/workout/[id] con atribución.

## 5. brandonp2412/FitBook (MIT) — 157★ — https://github.com/brandonp2412/FitBook
Calorie & macro logger offline, Flutter, 7k foods CORGIS Dataset, OpenFoodFacts barcode, graphs.
**Integrado:** src/components/food-database.tsx (offline 16 foods CORGIS MIT + search) en /client/nutrition con atribución + barcode-scanner OFF.

## 6. brandonp2412/Flexify (MIT) — 396★ — https://github.com/brandonp2412/Flexify
Offline quick lifts tracker Flutter, graphs, cardio, timers, light/dark.
**Integrado:** pr-tracker graphs + hiit-timer audio cues + muscle-map heatmap (inspirado) con atribución.

## 7. Dieterbe/awesome-health-fitness-oss (MIT curated) — https://github.com/Dieterbe/awesome-health-fitness-oss
Curaduría de FitBook/Flexify/OpenHIIT/runFlutterRun/Unbroken etc. (todos MIT). Usado para discovery de los 3 anteriores.

