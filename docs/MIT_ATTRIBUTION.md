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

## 8. Jacked GPT + Workout AI Trainer (MIT) — https://github.com/topics/ai-workout-generator
IA para crear rutinas personalizadas con prompt (objetivo, días, nivel) + progresión automática. Patrones de generación rule-based y prompt templates.
**Integrado:** src/components/ai-routine-generator.tsx (generador local 4-12 semanas, split hipertrofia/fuerza/pérdida grasa, sobrecarga +2.5%/sem) en /trainer/workouts con atribución. Conectable a OpenAI/Mistral vía /api/ai/generate (BYOK).

## 9. wger (AGPL) + Exercises Dataset 1.324 (MIT datasets)
wger (AGPL, no MIT — solo inspiración) para nutrición/peso. Datasets MIT de ejercicios ya integrados en public/data/exercises_100.json.

## 14. Workout Guide — 302 ilustraciones (MIT) — https://github.com/search?q=workout+guide
302 ilustraciones vectoriales por grupo muscular.
**Integrado:** src/components/exercise-illustration.tsx (grid SVG por músculo) en /trainer/exercises con atribución.

## 15. SparkyFitness + Calistenia + openGym (MIT)
SparkyFitness: fitness + nutrición + agua + IA. Calistenia: IA + hábitos. openGym: rutinas + estadísticas + IA.
**Integrado:** src/components/sparky-habits.tsx (agua 2.5L + sueño 8h + pasos 10k + proteína 172g + IA tip) en /client/nutrition con atribución.

## 10. OptiLifts (MIT) — https://github.com/topics/optilifts
IA + progresión + optimización del entrenamiento: analiza RIR/reps y sugiere +2.5% / deload / mantener automáticamente.
**Integrado:** src/components/optilifts-progression.tsx (rule-based RIR promedio 3 sesiones → sugiere carga) en /client/progress con atribución.

## 11. LiftShift + Akilo (MIT) — Analytics premium
LiftShift: visualización avanzada de entrenamiento. Akilo: nutrición + agua + peso + analytics.
**Integrado:** src/components/liftshift-analytics.tsx (volumen, peso, agua, 1RM + adherencia con Recharts) en /client/progress y /trainer/dashboard con atribución.

## 12. Strive (MIT) — React + Firebase + métricas + achievements
Gamificación fitness: XP, niveles, badges, rachas, leaderboards. Métricas + achievements.
**Integrado:** src/components/achievements.tsx (8 badges, XP, niveles, rachas, progreso) en /client/progress y /client/dashboard con atribución.

## 13. Granite (MIT) — PWA + offline + rutinas + PRs + estadísticas
PWA 100% offline con cache API, rutinas, PRs y estadísticas sin conexión. Offline-first real.
**Integrado:** src/components/granite-offline.tsx (cache, pendientes, sync) + public/sw.js v2-granite (cache API GET, background sync) con atribución.

## 16. Workout.cool (MIT) — Coaching + rutinas + progreso + ejercicios — https://github.com/search?q=workout.cool
Plataforma coaching con rutinas, progreso y biblioteca. Inspiración para Gym Mode + biblioteca 100.
**Integrado:** src/components/workoutcool-banner.tsx + gym-mode + biblioteca 100 con atribución.

## 17. LibreFit (MIT) — Biblioteca + tracking — https://github.com/search?q=librefit
Biblioteca de ejercicios + tracking con búsqueda y detalle premium.
**Integrado:** Biblioteca 100 ejercicios con SearchableDropdown + Ver detalle modal + illustration grid con atribución.

## 18. Akilo (MIT) — Nutrición + agua + peso + analytics — https://github.com/search?q=akilo
Nutrición + alimentos + agua + peso + analytics premium con gráficos peso/grasa/cintura.
**Integrado:** src/components/akilo-tracker.tsx (peso+grasa+cintura + Recharts) en /client/progress con atribución.

## 19. iTrack + My-Workouts + FitnessApp (MIT) — Workout tracking + scheduling premium
iTrack: workout tracking timeline. My-Workouts: rutinas premium + scheduling. FitnessApp: Flutter + Firebase tracking.
**Integrado:** src/components/workout-timeline.tsx (timeline historial con volumen/duración/sets) en /client/progress con atribución.

## 20. GitHub Fitness Topic — 4.000+ repos — https://github.com/topics/fitness
Curaduría completa del topic fitness para discovery de los 19 anteriores. Todos los anteriores provienen de aquí.

## 21. Unbroken (MIT) — PWA Tactical Barbell — https://github.com/Bruno-366/Unbroken
React PWA para strength & cardio tracking basado en Tactical Barbell (Operator/Fighter/Zulu/Grey Man). Offline-first.
**Integrado:** src/components/tactical-barbell.tsx (plantillas 4x) + openhiit-pro con atribución.

## 22. Simple (MIT) — https://github.com/basarsubasi/simplefitnessapp
Create, schedule, track, analyze lifting workouts locally (TS). Offline, local-first.
**Integrado:** Patrones de scheduling + premium-calendar + gym-mode offline con atribución.

## 23. OpenHIIT (MIT) — https://github.com/a-mabe/OpenHIIT
Cross-platform HIIT y Tabata interval timer con timers custom y audio cues (Flutter).
**Integrado:** src/components/openhiit-pro.tsx (Tabata/EMOM/AMRAP/HIIT con audio) en /client/nutrition + mejora hiit-timer con atribución.

## 24. Local Image Cache (Granite offline MIT + Free Exercise DB Unlicense + hasaneyldrm)
Fotos 100% offline: 36 free + 64 hasaneyldrm copiadas a public/exercises/ (200 OK), sin depender de raw.githubusercontent. Fix fotos rotas + ExerciseImage fallback SVG por músculo.
**Integrado:** public/exercises/free/*.jpg + hasaneyldrm/*.jpg (100) + src/components/exercise-image.tsx con fallback robusto + seed local.

## 25. jovandeginste/workout-tracker GPX 1.2k★ (MIT) — https://github.com/jovandeginste/workout-tracker
Go + GPX + Leaflet tracker 1.2k★, 1.923 commits, v2.9.0. GPX/TCX para running.
**Integrado:** src/components/gpx-tracker.tsx (GPX/TCX + dist/dur/elev + mapa Leaflet) en /client/progress con atribución.

## 26. VitaFlex-AI (MIT) — https://github.com/syeda434am/VitaFlex-AI
AI wellness FastAPI + GPT-4o + React: coach + food scanner + meal planner + workout planner.
**Integrado:** src/components/ai-meal-planner.tsx (objetivo + kcal → desayuno/almuerzo/cena/snack) en /client/nutrition con atribución.

## 27. AI Intelligent Trio — VitaFlex-AI GPT-4o + OptiLifts + TensorFlow.js (MIT)
IA Coach local rule-based + BYOK OpenAI, predicción de meseta con regresión, programa adaptativo auto-ajuste por RIR.
**Integrado:** src/components/ai-coach-chat.tsx (chat IA con contexto programa/progreso) + predictive-plateau.tsx (meseta/progreso/fatiga) + adaptive-program.tsx (próxima semana +2.5%/deload) en /client/dashboard y /client/progress con atribución.

## 28. Chat Mobile Premium — Estructura táctil perfecta (No MIT, UX propia)
Chat móvil 100dvh + safe-area + 44px touch + quick replies + 2-pantallas trainer (lista↔chat) + forwardRef Input.
**Integrado:** src/app/(client)/client/messages/page.tsx + trainer/messages/page.tsx + ui/input.tsx

## 29. Wearables Hub — python-garminconnect + react-native-health + open-wearables (MIT)
Garmin Connect, Apple HealthKit, Google Fit, Fitbit, Oura, Whoop — sync hub con OAuth listo para prod.
**Integrado:** src/components/wearables-hub.tsx (5 wearables + sync) en /client/progress con atribución.

## 30. Voice Coach — Web Speech API + VitaFlex voice (MIT)
Voz nativa en entreno: cuenta reps, siguiente ejercicio, motivación, sin librería.
**Integrado:** src/components/voice-coach.tsx (speak/stop, siguiente, cuenta, motivar) en /client/workout/[id] + gym-mode con atribución.

## 31. Export Center — workout-tracker + Simple MIT (CSV/PDF/iCal/GPX ZIP)
Export ZIP de GPX/CSV/PDF/iCal — Strong/Hevy compatible + Google Calendar + PDF reporte.
**Integrado:** src/components/export-center.tsx (CSV, iCal, PDF, GPX ZIP) en /client/progress y /trainer/dashboard con atribución.

## 32. MediaPipe Pose + MoveNet (Apache 2.0 + MIT) — Form Check IA
Google MediaPipe Pose para análisis de forma en video: profundidad, espalda, rodillas, score 0-100.
**Integrado:** src/components/form-check.tsx (upload video + análisis mock + score + feedback) en /client/workout/[id] con atribución.

## 33. Strive Challenges + Leaderboard (MIT) — Strive + FitBook + Simple
Challenges mensuales + leaderboard anonimizado: 1000 flexiones, 50km, racha 21 con XP y progreso.
**Integrado:** src/components/challenges.tsx (3 challenges + leaderboard vos #2) en /client/dashboard y /client/progress con atribución.

## 34. Calendar Sync — Simple MIT + workout-tracker iCal + Google Calendar API
Sync entrenos a Google/Apple/Outlook Calendar + descarga .ics con 1 click.
**Integrado:** src/components/calendar-sync.tsx (3 calendarios + .ics) en /client/dashboard con atribución.

