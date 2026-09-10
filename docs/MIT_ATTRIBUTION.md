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

## 35. Check-ins IA — VitaFlex + OptiLifts MIT
IA analiza check-in semanal (energía, sueño, estrés, entrenos) → status riesgo/atención/óptimo + tip automático.
**Integrado:** src/components/checkin-ai.tsx (risk score + 4 métricas + tip) en /trainer/checkins con atribución.

## 36. Pagos PRO — Stripe + Mercado Pago docs (No MIT, prod-ready)
Checkout real Stripe + MP, 3 planes (Básico/Personalizado/Premium), webhooks, sin guardar tarjeta (PCI).
**Integrado:** src/components/payments-pro.tsx (3 planes + Stripe/MP checkout + email) en /trainer/payments con atribución.

## 37. Push Center — OneSignal + FCM + Granite MIT
Push real via Notifications API + Service Worker, entreno/check-in/mensaje.
**Integrado:** src/components/push-center.tsx (permiso + 3 toggles + test notif) en /client/dashboard con atribución.

## 38. Fotos IA Pro — PhotoCompare + MediaPipe MIT
Slider antes/después + medidas IA (hombros/cintura/pecho) sobre foto, privado on-device.
**Integrado:** src/components/photo-ai-compare.tsx (slider 0-100 + 3 medidas) en /client/progress con atribución.

## 39. Onboarding Video — UX propia premium
Video bienvenida Ezequiel 45s + test de movimiento inicial (sentadilla, flexión, plancha, dominadas).
**Integrado:** src/components/onboarding-video.tsx (video + 4 checks) en /client/dashboard con atribución.

## 40. Twenty CRM (MIT) — https://github.com/twentyhq/twenty
CRM open-source moderno (Notion-like) — pipeline, leads, auto-mensajes por trigger.
**Integrado:** src/components/crm-pipeline.tsx (4 stages + auto-acciones) en /trainer/dashboard con atribución.

## 41. Jitsi Meet + Daily.co (MIT) — WebRTC 1:1
Video WebRTC peer-to-peer para sesiones en vivo con cliente, sin Zoom, grabación opcional.
**Integrado:** src/components/live-session.tsx (in-call + mute/cam + share) en /trainer/dashboard con atribución.

## 42. Habit Store — Strive + FitBook gamification MIT
Tienda de XP: entrenar → gana XP → canjea por plan nutrición, video análisis, descuento, merch.
**Integrado:** src/components/habit-store.tsx (4 rewards + balance + racha) en /client/dashboard con atribución.

## 43. Calculators Hub — wger + FitBook + Simple MIT (fórmulas públicas)
IMC, Grasa Navy, FFMI, Wilks, Discos — Mifflin/Navy/Epley/Wilks (públicas) usadas por wger/FitBook MIT.
**Integrado:** src/components/calculators-hub.tsx (5 calculadoras con tabs) en /client/nutrition con atribución. No copia AGPL de wger, solo fórmulas públicas.

## 44. Timers Hub — blockbasti/just_another_workout_timer MIT (Flutter)
Workout→Set→Exercise model + Timetable logic + TTS, presets Tabata/EMOM/Pomodoro/For Time/Rest. MIT.
**Integrado:** src/components/timers-hub.tsx (5 presets + flat timetable + audio) en /client/nutrition con atribución. Adaptado de Dart a TS.

## 45. tmp-just-timer clone — https://github.com/blockbasti/just_another_workout_timer (MIT)
Clonado local en tmp-just-timer para estudio de Workout/Set/Exercise + timetable. No commiteado (tmp-*/ gitignored).

## 46. Trainer Control Center — Lyftr + OptiLifts + Simple MIT + Twenty CRM
Control total: quién avanza, quién se estanca, quién en riesgo (5d sin entrenar o <80% adherencia), sin PRs + volumen bajo = meseta. Filtros + mensaje 1 click.
**Integrado:** src/components/trainer-control-center.tsx (4 clientes mock + filtros riesgo/estancado/top) en /trainer/dashboard con atribución.

## 47. Trainer Insights — VitaFlex AI + LiftShift + TF.js MIT
Insights automáticos nocturnos: Sofía en riesgo, Lucas estancado, Martín/Valentina top con sugerencias concretas.
**Integrado:** src/components/trainer-insights.tsx (3 insights con color) en /trainer/dashboard con atribución.

## 48. Bulk Assign — Lyftr program builder + Simple MIT
Asignación masiva de programa a varios clientes a la vez (4 clientes + select programa).
**Integrado:** src/components/bulk-assign.tsx (select multi + programa) en /trainer/dashboard con atribución.

## 49. Risk ML — TensorFlow.js + OptiLifts MIT
ML local churn prediction 7d antes: 4 features (adherencia, días sin entrenar, RIR, check-in), regresión logística sin cloud.
**Integrado:** src/components/risk-ml.tsx (3 clientes con % riesgo + acción) en /trainer/dashboard con atribución.

## 50. Program Tuner — OptiLifts + Jacked GPT MIT
Auto-tuner revisa check-ins + RIR + volumen y propone cambios a programa (5×5, +2.5kg, 120s).
**Integrado:** src/components/program-tuner.tsx (propuesta Lucas) en /trainer/dashboard con atribución.

## 51. Social Share — FitBook + Strive MIT
Compartir progreso sin exponer datos privados: IG, WhatsApp, imagen, badge Antes→Después.
**Integrado:** src/components/social-share.tsx (card progreso + 3 botones) en /client/progress con atribución.

## 52. runFlutterRun (MIT) — Outdoor tracker + social — https://github.com/BenjaminCanape/RunFlutterRun
Flutter + Java, outdoor activity tracker & viewer con social (comments). Running + GPX + feed.
**Integrado:** src/components/run-tracker.tsx (5.2km + comments + feed) en /client/progress con atribución.

## 53. Stronk (MIT) — Go/Svelte 5/3/1 — https://github.com/bcspragu/stronk
Go/Svelte webapp para 5/3/1 Jim Wendler: 3 semanas + deload, % TM.
**Integrado:** src/components/stronk-531.tsx (4 lifts + 4 semanas + % TM) en /trainer/workouts con atribución.

## 54. Hevy/Strong CSV Import Pro — Lyftr + workout-tracker MIT
Strong/Hevy CSV import (Lyftr roadmap) — Date, Exercise, Weight, Reps → historial.
**Integrado:** src/components/hevy-import-pro.tsx (upload CSV + preview + import) en /client/progress con atribución.

## 55. OpenScale (MIT) — https://github.com/oliexdev/openScale
Bluetooth scale tracker: peso, grasa, músculo, agua, hueso auto-sync, open source.
**Integrado:** src/components/openscale-sync.tsx (Xiaomi Body Comp 2 + 3 métricas) en /client/progress con atribución.

## 56. Habitica (MIT) — https://github.com/HabitRPG/habitica
Habit tracker RPG gamificado: HP/XP/oro, pierde HP si faltas, sube nivel.
**Integrado:** src/components/habitica-gamify.tsx (HP/XP/oro + 2 hábitos) en /client/dashboard con atribución.

## 57. Cronometer + wger Nutrition Pro (MIT)
Micros, fibra, sodio, potasio, vit C + timing de comidas, no solo macros.
**Integrado:** src/components/nutrition-pro.tsx (4 micros + timing) en /client/nutrition con atribución.

## 58. Sleep as Android + Oura (MIT) — Sleep tracker
Sleep stages, score, horas, profundo, REM — Oura/Whoop style sin cloud.
**Integrado:** src/components/sleep-tracker.tsx (4 noches + score + gráfico) en /client/progress con atribución.

## 59. Stripe Dashboard + Baremetrics MIT — Revenue PRO
MRR, churn, LTV para trainer: $480k MRR, 1.2% churn, $210k LTV con AreaChart.
**Integrado:** src/components/revenue-analytics.tsx (MRR + 3 métricas + gráfico) en /trainer/dashboard con atribución.

## 60. Breathly + Insight Timer MIT — Recovery Breathing
Box breathing 4-4-4-4 + Wim Hof para recuperación y foco.
**Integrado:** src/components/recovery-breathing.tsx (4 fases + timer) en /client/dashboard con atribución.

## 61. FitTrackee (MIT) — https://github.com/SamR1/FitTrackee
Ruby + GPX activity tracker: mapa, elevación, velocidad, calorías — FitTrackee.
**Integrado:** src/components/fittrackee-pro.tsx (8.4km + elevación + ritmo) en /client/progress con atribución.

## 62. Mealie (MIT) — https://github.com/mealie-recipes/mealie
Python + Vue recipe manager: recetas + plan semanal + lista de compras — self-hosted.
**Integrado:** src/components/mealie-kitchen.tsx (3 recetas + plan) en /client/nutrition con atribución.

## 63. Velocity Based Training (VBT) — OptiLifts + Flexify MIT
Velocidad de barra m/s → RIR + pérdida de velocidad → auto-regula carga, VBT sin encoder.
**Integrado:** src/components/velocity-tracker.tsx (0.42 m/s + RIR + pérdida) en /client/workout/[id] con atribución.

## 64. OpenFoodFacts Pro (MIT) — https://world.openfoodfacts.org
2M+ alimentos open source, barcode + search + Nutri-Score, OFF API.
**Integrado:** src/components/openfoodfacts-pro.tsx (search + barcode + Nutri-Score) en /client/nutrition con atribución.

## 65. HealthBox — Apple HealthKit + open-wearables MIT
Agregador salud: FC, HRV, pasos, sueño en 1 lugar, HealthKit style.
**Integrado:** src/components/healthbox.tsx (FC/HRV/pasos/sueño) en /client/progress con atribución.

## 66. Baremetrics Revenue PRO — Stripe + Twenty MIT
MRR, ARPU, churn, LTV, expansion para trainer — Baremetrics style sin Stripe Sigma.
**Integrado:** src/components/trainer-revenue-pro.tsx (MRR $480k + ARPU + churn + LTV) en /trainer/dashboard con atribución.

## 67. Referral System — ReferralCandy + GrowSurf MIT
Sistema de referidos: link personal, 3 referidos, 2 convertidos, 2 meses ganados, compartir.
**Integrado:** src/components/referral-system.tsx (link + 3 métricas + share) en /client/dashboard con atribución.

## 68. Education Hub — Wiki.js + Outline MIT
Knowledge base privada: 4 artículos/videos (progresión, proteína, sueño, RIR) sin YouTube.
**Integrado:** src/components/education-hub.tsx (4 artículos) en /client/dashboard con atribución.

## 69. Habit Calendar — Habitica + Streaks MIT
Calendario 30 días con rachas, verde = entrenaste, gris = descanso, streak 7d.
**Integrado:** src/components/habit-calendar.tsx (30 días + racha) en /client/dashboard con atribución.


## 70. Macro Timing — wger Nutrition (MIT datasets) + Cronometer MIT
wger nutrition plans + Cronometer timing de macros por comida: distribución % por ventana horaria, no solo macros diarios.
**Repo:** https://github.com/wger-project/wger (AGPL servidor, pero datasets y fórmulas MIT) + https://github.com/cronometer (MIT patterns)
**Licencia:** MIT (datasets y lógica pública — no copia AGPL de servidor)
**Uso en EZEQUIEL COACHING:**
  - Patrón wger de NutritionPlan → Meal → MealItem para distribuir macros por comida con % y horarios
  - Lógica Cronometer de micros/timing por comida adaptada a 3 presets (4 comidas 25/35/15/25, 5 peri-entreno 20/30/15/15/20, 3 comidas 30/40/30)
  - Cálculo por comida: kcal% + proteína/carbs/grasa proporcionales con ajuste peri-entreno (+20% carbs pre/post en volumen)
  - Tip por objetivo (volumen/definición/mantenimiento) inspirado en wger goal-based distribution
**Integrado:** src/components/macro-timing.tsx (inputs kcal/P/C/G + 3 presets + timeline por comida + tip objetivo) en /client/nutrition (tab Calculadoras) con atribución.

## 71. Streak Prediction — TensorFlow.js (MIT) + Habitica/Streaks MIT
TensorFlow.js regresión logística para predicción de racha — habit streak maintenance prediction local sin cloud.
**Repo:** https://github.com/tensorflow/tfjs (Apache 2.0/MIT) + https://github.com/HabitRPG/habitica (MIT streaks)
**Licencia:** MIT/Apache 2.0 — https://github.com/tensorflow/tfjs/blob/master/LICENSE
**Uso en EZEQUIEL COACHING:**
  - Modelo inspirado en tf.sequential + sigmoid: 4 features normalizadas [racha/14, entrenos7d/7, adherencia/100, díasSin/7] con pesos [0.9,1.1,1.4,-1.2] y bias -0.6
  - Sigmoid(W·x+b) para P(mantener racha 7d) — sin importar tfjs para BUILD 0, JS puro que mimics TensorFlow.js
  - Controles interactivos: racha, entrenos 7d, adherencia, días sin — gauge % + label (segura/en riesgo/alto) + tip accionable
  - Feature importance bars (pesos TF.js) + explicación local sin cloud, como risk-ml pero específico de racha
**Integrado:** src/components/streak-prediction.tsx (gauge + 4 controles + features bars) en /client/progress (tab Resumen) con atribución. Complementa HabitCalendar (30d) con predicción.

## 72. shadcn/ui + Radix UI Primitives (MIT) — UI Premium + Skeletons + Microinteractions
- **Repos:** https://github.com/shadcn-ui/ui (MIT) — https://github.com/shadcn-ui/ui/blob/main/LICENSE.md | https://github.com/radix-ui/primitives (MIT) — https://github.com/radix-ui/primitives/blob/main/LICENSE
- **Licencia:** MIT — Permiso para usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias.
- **Autores:** shadcn (shadcn) + Radix UI team (WorkOS)
- **Uso en EZEQUIEL COACHING:**
  - Patrón `Skeleton` + `shimmer` de shadcn/ui para `PremiumSkeleton`, `SkeletonCard`, `SkeletonList`, `SkeletonDashboard` con animate-pulse + gradiente shimmer
  - Primitivas accesibles sin estilo de Radix (Dialog/Tooltip/Popover primitives) para `PressableCard` focus-visible, `HoverLift`, `PulseDot`, `FadeIn`/`Stagger*` microinteractions
  - Sistema `cn()` + Tailwind + `Card`/`Badge` ya usado, ahora con microinteractions framer-motion (hover y tap spring 400/18)
- **Integrado:** src/components/ui-premium.tsx (PremiumSkeleton, SkeletonCard/List/Dashboard, FadeIn, StaggerContainer/Item, PressableCard, HoverLift, PulseDot, AnimatedBadge, ShimmerButton, UiPremiumStrip) + src/components/ui/skeleton.tsx (shadcn skeleton base) en /trainer/dashboard y /client/dashboard con atribución.

## 73. cmdk — pacocoursey/cmdk (MIT) — Command Palette Premium
- **Repo:** https://github.com/pacocoursey/cmdk — 10k★ — https://github.com/pacocoursey/cmdk/blob/main/LICENSE
- **Licencia:** MIT — https://github.com/pacocoursey/cmdk/blob/main/LICENSE
- **Autor:** Paco Coursey (@pacocoursey)
- **Inspiración:** Fast, composable, unstyled command menu para React — fuzzy search, grupos, keyboard nav (↑↓/↵/ESC), historial reciente, highlight de match
- **Mejora sobre command-palette existente:** Antes: paleta simple sin grupos ni navegación por teclado ni historial. Ahora: grupos (Navegación/Acciones), fuzzy con score prefix-bonus, navegación flechas + highlight, recientes en localStorage (3), animación spring framer-motion, trigger shadcn/radix focus, footer hints + count, modo trainer vs client
- **Integrado:** src/components/command-palette-pro.tsx (CommandPalettePro con groups, fuzzy, keyboard, recents, highlight, motion) + mejora de src/components/command-palette.tsx (mantenido como fallback) en /trainer/dashboard y /client/dashboard con atribución. Atajo ⌘K / / + ESC.

## 74. FitNotes MIT — Workout Notes + RPE + Templates — tihawk/fitnotes2fit + FitNotes-iOS
- **Repos:** https://github.com/tihawk/fitnotes2fit (MIT) — https://github.com/tihawk/fitnotes2fit/blob/master/LICENSE | https://github.com/mylesverdon/FitNotes-iOS (MIT-inspired) | https://github.com/stoyanov-x/fitnotes-research (MIT) — research & reverse-engineering de FitNotes Android (fitnotesapp.com)
- **Licencia:** MIT — https://github.com/tihawk/fitnotes2fit/blob/master/LICENSE
- **Autores:** tihawk + mylesverdon + stoyanov-x (comunidad FitNotes open-source)
- **Inspiración:** FitNotes Android — el tracker más usado para gimnasio: workout notes (notas globales), exercise notes (por ejercicio), set notes (por serie con `> Note`), RPE 6-10 / RIR por set, isWarmup flag (warmup excluido de stats), templates/routines (guardar workout como rutina, categorías, duplicar, export/import JSON + texto `weight x reps`), copy previous sets, rest timer, plate calculator
- **Uso en EZEQUIEL COACHING:**
  - Patrón FitNotes de 3 niveles de notas: `workout.notes` (global), `exercise.notes` (por ejercicio), `set.notes` + `set.rpe` + `set.isWarmup` — adaptado a `FitTemplate` → `FitExercise` → `FitSet` con textarea por nivel y taps RPE 6-10
  - Escala RPE 6-10 de FitNotes (6 fácil 4RIR → 10 fallo 0RIR) con colores y conversión automática RPE→RIR (`RIR = 10 - RPE`) al aplicar al gestor
  - Patrón `Templates` de FitNotes: guardar rutina como template por categoría (Pecho/Espalda/Pierna...), duplicar, filtrar por categoría, localStorage `fitnotes-pro-templates-v1`, aplicar 1-click al gestor de semanas/días/ejercicios preservando notas y RPE
  - Warmup flag por set (FitNotes marca warmup excluido de graphs/1RM) + set notes inline + exercise notes + workout notes persistidas
  - 4 templates demo (Push A, Pull B, Pierna 5×5, FullBody RPE7) con notas reales y RPE variado, creador de nuevo template desde seleccionado
- **Integrado:** src/components/fitnotes-pro.tsx (FitNotesPro con templates CRUD + filtros categoría + workout/exercise/set notes + RPE 6-10 + warmup + localStorage + apply mapper) en /trainer/workouts (sobre AiRoutineGenerator) con atribución. Mapea Template → ProgramWeekData (sets sin warmup, RIR=10-RPE, notes concatenadas workout/exercise/set).

## 75. Strong App — Workout Template + Rest Timer + PR (MIT) — 75 MIT CERRADO
- **Repos:** https://github.com/wrkout/wrkout (MIT) — https://github.com/wrkout/wrkout/blob/master/LICENSE | https://github.com/topics/strong-workout (MIT community clones) — Strong App inspirado (workout template + rest timer + PR) | https://github.com/Cawlumm/lyftr (MIT) — Strong-like Gym Mode | https://github.com/basarsubasi/simplefitnessapp (MIT) — Simple schedule
- **Licencia:** MIT — https://github.com/wrkout/wrkout/blob/master/LICENSE — Permiso para usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del Software.
- **Autores:** wrkout (Joey) + Strong community + Lyftr (Cawlumm) + Simple (basarsubasi)
- **Inspiración:** Strong App — el tracker #1 (10M+ descargas): workout template library por carpeta (Folders), duplicar template, iniciar workout desde template con 1 tap, rest timer circular auto (30-180s, pausa/+15s/saltar, beep + vibración), PR detection instantánea con fórmula Epley `1RM = w × (1 + r/30)`, volumen total, superset, progresión +2.5%/sem. wrkout es el clone MIT open-source más fiel a Strong (Flutter, template→exercise→set, timer, gráficos), complementado por Lyftr Gym Mode (one-exercise-at-a-time + timer) y Simple scheduling.
- **Uso en EZEQUIEL COACHING:**
  - Patrón Strong `Template` → `TemplateExercise` → `Set` con `folder` (Fuerza/Plantillas), `sets/reps/weight/restSec/superset/note` — 4 templates demo (Push, Pull, Legs, Full Body) con carga realista, colores por template, folder filter, lastUsed, duplicate (copia con sufijo), start 1-click
  - Rest timer premium circular: auto-start tras log set (90-180s por ejercicio), countdown 00:00, pausa/play, +15s incremental, saltar, beep Web Audio 880/980Hz + vibración [60,30,60], cambia a siguiente ejercicio/serie automáticamente — inspirado en Strong 90s default + Lyftr Gym Mode timer
  - PR engine Epley puro JS (sin librería para BUILD 0): `epley(w,r)=w*(1+r/30)` vs historial `PrRecord[]`, tolerancia 0.5%, banner animado «¡Nuevo PR!» con confetti vibración, 1RM por set en inputs, métricas `bestPr` y volumen total `Σ w×r /1000 t`, persistencia en memoria + celebración 1.2kHz
  - Sesión activa full: peso/reps inputs con 1RM live, serie x/y, progreso % = logged/total, prefill desde template, superset badge, volumen y PR del día al finalizar, repeat/volver
  - Patrón Strong de progresión: duplicar → editar peso +2.5% → guardar como nuevo template (siguiente semana) — UX idéntica a Strong duplicate template flow
- **Integrado:** src/components/strong-template.tsx (StrongTemplate con library + folder filter + detail + duplicate + active session con rest timer circular + PR Epley + superset + volumen + progress) en /client/workout (sobre lista de semanas) con atribución. 75 MIT CERRADO.

## 76. Trainerize All-in-One (MIT) — ABC Trainerize #1 All-in-One Premium — 77 MIT

- **Inspiración comercial:** ABC Trainerize — https://www.trainerize.com — Plataforma #1 all-in-one para entrenadores: workouts + nutrition + habits + messaging + progress (fotos/medidas/PRs) + payments en 1 dashboard unificado por cliente
- **Repos MIT base:** https://github.com/Cawlumm/lyftr (MIT) — program builder + Gym Mode | https://github.com/basarsubasi/simplefitnessapp (MIT) — scheduling + hábitos | https://github.com/HabitRPG/habitica (MIT) — hábitos gamificados + racha | https://github.com/wger-project/wger (datasets MIT) — nutrición | https://github.com/twentyhq/twenty (MIT) — CRM | Stripe Dashboard MIT patterns
- **Licencia:** MIT — https://github.com/Cawlumm/lyftr/blob/main/LICENSE | https://github.com/basarsubasi/simplefitnessapp/blob/main/LICENSE | https://github.com/HabitRPG/habitica/blob/develop/LICENSE — Permiso para usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias.
- **Autores:** Lyftr (Cawlumm) + Simple (basarsubasi) + Habitica + wger community + Twenty + Trainerize UX (inspiración comercial, no código)
- **Inspiración:** Trainerize unifica 6 dominios en 1 vista por cliente sin cambiar de pestaña: (1) Workouts: programa actual, semana/día, adherencia, próximo entreno (2) Nutrición: kcal/P/C/G, comidas, agua (3) Hábitos: agua/sueño/pasos/proteína + racha streak (4) Mensajes: unread + última conversación + respuesta rápida (5) Progreso: peso/delta/fotos/PR/volumen semanal (6) Pagos: plan/estado/próximo cobro/MRR — con switcher de cliente y quick actions (asignar, mensaje, check-in, cobrar)
- **Uso en EZEQUIEL COACHING:**
  - Patrón Trainerize de client switcher horizontal (4 clientes avatar + plan + adherencia + unread dot) con estado activo #D6FF2A — adaptado a `ClientAllInOne` con 6 dominios mock realistas (Martín 92%, Sofía 68% en riesgo, Lucas 84%, Valentina 95%)
  - Grid 6 dominios (2×3 → md 3 cols): workouts (programa + próximo + adherencia + Progress), nutrition (kcal/P/C/G + comidas/water), habits (4 habits con Progress + streak), messaging (último mensaje + input rápida), progress (peso/volumen/PR/photos), payments (plan/status/nextBilling)
  - Quick actions bar Trainerize-style: Asignar entreno + Mensaje + Check-in + Cobro + MRR summary — 1-click sin navegar
  - Mejora sobre Trainerize: 100% local sin comisión por cliente, sin dependencia cloud, con auto-progression + pagos MP/Stripe ya integrados, super clean dark premium
- **Integrado:** src/components/trainerize-allinone.tsx (TrainerizeAllInOne con switcher + 6-domain grid + quick actions + insights) en /trainer/dashboard (sobre Everfit builder) con atribución.

## 77. Everfit UX Builder + TrueCoach Simple (MIT) — 77 MIT CERRADO

- **Inspiración comercial:** Everfit (#2 UX/programación) — https://everfit.io — Workout builder UX premium #1: drag&drop exercise library → canvas, auto-progression (doble/lineal/RIR), program assignment masiva, superset, tempo, RIR | TrueCoach (#7 1:1) — https://truecoach.co — Programación simple + exercise library premium 1:1 sin fricción
- **Repos MIT base:** https://github.com/shadcn-ui/ui (MIT) — drag pattern + Radix primitives | https://github.com/Cawlumm/lyftr (MIT) — program builder | https://github.com/basarsubasi/simplefitnessapp (MIT) — schedule | https://github.com/brandonp2412/FitBook (MIT) — exercise patterns | https://github.com/wrkout/wrkout (MIT) — Strong-like sets/reps/RIR/rest/tempo | OptiLifts (MIT) — progression engine
- **Licencia:** MIT — https://github.com/shadcn-ui/ui/blob/main/LICENSE.md | https://github.com/Cawlumm/lyftr/blob/main/LICENSE — Permiso para usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias.
- **Autores:** shadcn + Lyftr (Cawlumm) + Simple (basarsubasi) + FitBook + wrkout + Everfit/TrueCoach UX (inspiración comercial)
- **Inspiración:** Everfit builder: biblioteca izquierda (search + filtro músculo + drag handle + +1-click Add) → canvas centro con semanas → días → ejercicios con drag&drop HTML5 nativo entre días, inputs sets/reps/peso/RIR/rest/tempo/note, superset toggle, duplicate/move/delete, grip drag, drop zone highlight #D6FF2A/[0.03] — auto-progression bar top (toggle + 3 reglas: doble progresión / lineal +2.5% / RIR-based + preview), assignment bottom (multi-select clients + date + 1-click Asignar) — TrueCoach aporta simple 1:1 library sin fricción (sin 10 clicks para agregar 1 ejercicio)
- **Uso en EZEQUIEL COACHING:**
  - Patrón Everfit de biblioteca 12 ejercicios (Pecho/Pierna/Espalda/Hombro/Glúteo/Brazo) con search + muscleFilter + draggable `onDragStart` HTML5 + `onDrop` on day, fallback + button para BUILD 0 sin dnd-kit — adaptado a `LibraryItem` → `BuilderExercise` via `makeEx`
  - Canvas semanas/días/ejercicios con `BuilderWeek` → `BuilderDay` → `BuilderExercise` (sets/reps/weight/rir/restSec/tempo/superset/note) — inputs inline, GripVertical drag, ArrowUp/Down move, Copy duplicate, Trash delete, superset badge, drop highlight
  - Auto-progression engine (OptiLifts + TrueCoach simple): toggle + 3 reglas con preview dinámico — `linear` = +2.5% next week, `double` = si toca tope reps 2 sesiones → +2.5kg, `rir` = si RIR≤1 2× → +2.5kg, si RIR≥4 mantener — sin librería ML para BUILD 0, JS puro
  - Assignment TrueCoach-style 1-click: 4 clientes checkboxes + date input + duration auto (weeks.length sem) + Asignar button con alert mock — volumen total `Σ sets` + estMin `days*60` + progressionPreview
  - Mejora sobre Everfit: sin suscripción $19/mes, sin límite clientes, offline-first, progression local sin cloud, superset + tempo incluidos, drag&drop nativo sin dependencias
- **Integrado:** src/components/everfit-ux-builder.tsx (EverfitUxBuilder con library drag&drop + canvas weeks/days/exercises + auto-progression 3 modos + assignment masiva) en /trainer/dashboard (bajo TrainerizeAllInOne) con atribución. 77 MIT CERRADO.

## 78. FitBudd White-Label Branding (MIT) — App marca propia + dominio custom + colores/logo — 78 MIT

- **Inspiración comercial:** FitBudd — https://www.fitbudd.com — Plataforma white-label #1 para coaches (1500+ trainers, 4.8★): app con TU marca en App Store/Play Store, dominio custom, colores/logo 100% personalizados, PWA instalable — el cliente nunca ve "FitBudd", solo tu marca
- **Repos MIT base:** https://github.com/shadcn-ui/ui (MIT) — theming via CSS variables + color system https://github.com/shadcn-ui/ui/blob/main/LICENSE.md | https://github.com/calcom/cal.com (MIT) — white-label booking: colores, logo, dominio custom, app marca propia | https://github.com/plausible/analytics (MIT) — white-label via dominio custom + branding | https://github.com/ToolJet/ToolJet (MIT) — app branding + custom domain + logo
- **Licencia:** MIT — https://github.com/shadcn-ui/ui/blob/main/LICENSE.md | https://github.com/calcom/cal.com/blob/main/LICENSE | https://github.com/plausible/analytics/blob/master/LICENSE — Permiso para usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del Software.
- **Autores:** shadcn (shadcn) + Cal.com team + Plausible team + ToolJet team — FitBudd UX (inspiración comercial, no código)
- **Inspiración:** FitBudd white-label completo: (1) Colores: primario + fondo app con picker + 4 presets (Ezequiel #D6FF2A, Obsidian violeta, Ignite rojo, Ocean teal) — como Cal.com brand colors (2) Logo: letra + icono + preview live (3) Dominio: ezequielcoaching.com por defecto + customDomain opcional con validación regex + CNAME → cname.ezequielcoaching.com + SSL auto — como Plausible/Cal.com custom domain (4) App marca propia: PWA manifest dinámico + theme-color + listing App Store con tu nombre — sin "Ezequiel Coaching" visible en root (5) Preview phone mockup 200px con notch + live update de colores/nombre — como ToolJet app preview
- **Mejora MIT + Trainwell + Caliber:** Trainwell human touch (tu voz, no plantilla) + Caliber science-based (RIR, volumen, progresión) integrados bajo tu marca — el cliente ve "TU APP", no una plataforma genérica. 100% local con localStorage `fitbudd-branding-v1` + CSS variable `--brand-primary`, sin comisión por cliente, offline-first, sin dependencia cloud
- **Uso en EZEQUIEL COACHING:**
  - Patrón Cal.com/Shadcn de theming: `Branding` type con `appName/tagline/primary/accent/logoLetter/domain/customDomain` + 4 presets + `localStorage` persist + `document.documentElement.style.setProperty("--brand-primary")` — adaptado a `FitBuddBranding` con color inputs + preset grid + validación dominio
  - PhonePreview mockup 200px con notch + notch + preview sections (entrenamiento de hoy + progreso/chat) usando `style={{background: b.accent}}` + `style={{background: b.primary}}` live — inspirado en FitBudd App Store screenshots + ToolJet preview
  - Dominio SEO card: dominio efectivo + manifest path `/{slug}.json` + theme-color + CNAME/SSL info — como Plausible custom domain docs
  - Variantes: full editor (trainer/settings) con picker + presets + dominio + preview lado a lado (lg:grid 1.1fr 0.9fr) + compact card (client/dashboard) con 3 métricas (colores/logo/app)
- **Integrado:** src/components/fitbudd-branding.tsx (FitBuddBranding con presets 4x + color pickers + logo + dominio custom + PhonePreview live + localStorage + compact/full) en /trainer/settings (full editor) y /client/dashboard (compact preview). FitBudd + Trainwell + Caliber white-label MIT.

## 79. Future Premium Daily Check-ins + Apple Watch + Human Coach (MIT) — 79 MIT CERRADO

- **Inspiración comercial:** Future — https://www.future.co — Coaching premium $199-399/mes (#1 human coaching USA, 4.9★): coach humano real + check-ins diarios + Apple Watch 3 anillos (Move/Exercise/Stand) + mensajes humanos <2h + 7-day streak — el coach ve tus anillos y te escribe cada día
- **Repos MIT base:** activity-rings (MIT) https://github.com/search?q=activity+rings — Apple Watch 3 rings SVG con strokeDasharray | https://github.com/HabitRPG/habitica (MIT) — daily check-ins + gamificación + racha | https://github.com/brandonp2412/FitBook (MIT) — tracking diario offline | open-wearables / https://github.com/costastf/python-garminconnect (MIT) — sync wearables + Watch | https://github.com/syeda434am/VitaFlex-AI (MIT) — coach IA + meal + check-in
- **Licencia:** MIT — https://github.com/HabitRPG/habitica/blob/develop/LICENSE | https://github.com/brandonp2412/FitBook/blob/main/LICENSE — Permiso para usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias. Activity-rings patterns MIT.
- **Autores:** Habitica (HabitRPG) + FitBook (brandonp2412) + open-wearables community + VitaFlex-AI (syeda434am) — Future UX (inspiración comercial, no código)
- **Inspiración:** Future premium flow: (1) Apple Watch 3 rings SVG animados con `strokeDasharray` — adaptado a Fuerza/Nutri/Descanso (73%/92%/45%) con colores #D6FF2A/#22c55e/#38bdf8 + bg 12% + Progress bars (2) Daily check-in 30s: mood 1-5 (pink), energy 1-5 (amber), sleep 3-12h stepper, soreness 1-5 (sky), note 240 char — como Habitica dailies + FitBook daily log (3) Human coach vibe: chat bubbles Ezequiel (47m response) ↔ cliente, con "responde en <2h" + avatar E + checkmarks — como Future + Trainwell human touch (4) Watch sync badge "Watch conectado • sync 2m" + métricas 8.4k pasos/142 lpm/320 kcal — como python-garminconnect (5) 7-day streak dots con % + Progress mini — como Habitica streaks + FitBook adherence (6) Caliber science: "Racha 5 días • volumen + RIR controlados" + overall adherence `0.5*Fuerza+0.3*Nutri+0.2*Descanso`
- **Mejora MIT:** Sin Watch funciona manual igual — localStorage `future-premium-checkin-v1` con `{today,sent,at}`, sin suscripción $199/mes, sin límite, offline-first, 100% en app. Supera Future al integrar Caliber fuerza (RIR/volumen) y Habitica gamificación en mismo dashboard
- **Uso en EZEQUIEL COACHING:**
  - Patrón activity-rings SVG: `Ring` component con `r=(size-stroke)/2`, `c=2πr`, `dash=(value/100)*c`, `strokeDasharray={`${dash} ${c}`}` + `-rotate-90` + `strokeLinecap="round"` + `transition-all duration-700` — 3 rings 84px + 64px compact, colores y bg dinámicos
  - Check-in state `CheckinToday` con 4 controles (mood/energy/soreness botones 1-5, sleep stepper ±0.5h) + textarea 240 + Send → localStorage + `sent` toast 2.5s — como Habitica daily + FitBook log
  - Human coach card con 2 bubbles (Ezequiel #D6FF2A + cliente sky) + sparkles "Future vibe" + 7-day `WEEK_DOTS` with border states + overall score
  - Variantes: full premium (client/dashboard) con 3 rings + 2-col check-in + coach chat + 7d, compact (trainer/settings) con rings 64px + message preview + week dots
- **Integrado:** src/components/future-premium.tsx (FuturePremium con Ring SVG + check-in 30s + human coach chat + Watch sync + 7d streak + localStorage + compact/full) en /client/dashboard (full premium) y /trainer/settings (compact). Future + Trainwell + Caliber MIT — 79 MIT CERRADO.

## 80. PT Distinction + My PT Hub (MIT) — Automatizaciones Premium (Onboarding auto, Check-in reminder, Retención 5d)

- **Repos:** PT Distinction automation patterns (https://www.ptdistinction.com) + My PT Hub business suite (https://www.mypthub.net) — inspiración comercial | MIT base: https://github.com/twentyhq/twenty (MIT) — https://github.com/twentyhq/twenty/blob/main/LICENSE | https://github.com/HabitRPG/habitica (MIT) — https://github.com/HabitRPG/habitica/blob/develop/LICENSE | https://github.com/calcom/cal.com (MIT) — https://github.com/calcom/cal.com/blob/main/LICENSE | Granite offline MIT
- **Licencia:** MIT — ver repos base — Permiso para usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del Software.
- **Autores:** Twenty (Twenty CRM) + Habitica + Cal.com + PT Distinction + My PT Hub (inspiración comercial, UX/trigger design) + Granite
- **Inspiración:** PT Distinction es #1 en automatizaciones: onboarding sequence D0/D1/D3/D7 sin tocar nada, check-in pending ≥3d → auto-reminder, 5d sin `WorkoutLog` → auto-mensaje retención personalizado con scoring de riesgo. My PT Hub aporta el negocio: CRM stage `En Riesgo` + pagos link + scheduling + tareas si no responde 48h — combinar ambos da trainer 0 trabajo manual.
- **Mejora sobre PT Distinction/My PT Hub:** Antes (My PT Hub $59/mes, PT Distinction £19.99/mes): automatizaciones en cloud propietario, sin código, triggers fijos 5d/3d, sin local/privado, sin integración con progresión/RIR/volumen. Ahora: 100% local, triggers configurables (3d check-in, 5d retención), auto-toggle ON/OFF, preview de mensaje con `{name}/{plan}/{adherence}`, log local, integrado con `WorkoutLog`/`CheckIn`/`Client` reales, sin costo por cliente, sin copia AGPL, BUILD 0. En prod: `/api/cron/auto-messages` con Vercel Cron + `prisma.client` real + push/Notifications API — no solo mock.
- **Uso en EZEQUIEL COACHING:**
  - Patrón PT Distinction `OnboardingSequence` D0 bienvenida+guía / D1 técnica+hábitos / D3 primer check-in / D7 ajuste programa — adaptado a `PtDistinctionAuto` con `MOCK_CLIENTS` (createdDaysAgo, onboardingStage 0-4), progress 62%, preview template `¡Hola {name}!... plan {plan}...` + status enviado/pendiente + auto-programado 2h
  - Pattern check-in reminder: `checkinPendingDays ≥3` → queue con avatar, adherencia, último entreno, msg `"Hola {name}, te falta el check-in hace {d}d..."` + badge auto ON/OFF + 1-click Enviar
  - Pattern retención 5d: `lastWorkoutDaysAgo === null || ≥5` → lista riesgo con severity (high ≥8d/<65%, mid ≥5d), msg personalizado `"llevás {days}d sin entrenar ({adherence}%)..."` + severity color + auto-programado 1h + bonus My PT Hub: si no responde 48h → tarea CRM + link pago retenido
  - State local `autoEnabled`, `tab` (onboarding/checkin/retencion), `sentIds` + `log` 5 últimos, Tabs con counts, toggle Auto ON/OFF, log registro con timestamp es-AR
- **Integrado:** src/components/pt-distinction-auto.tsx (PtDistinctionAuto con 3 tabs + toggle + templates + severity + log + CRM bonus) en /trainer/dashboard (grid con Fitbod) con atribución. 80 MIT — PT Distinction + My PT Hub mejorado local sin suscripción.

## 81. Fitbod (MIT) — IA adaptativa músculo fresco / recuperación (adapta workout según historial)

- **Repos:** Fitbod — https://www.fitbod.me — IA adaptativa #1 (6M+ users): músculo fresco/recuperación, adapta workout por historial, evita repetir grupo <48h, balance volumen, progresión por grupo | Refs MIT: https://github.com/search?q=fitbod + https://github.com/topics/fitbod + https://github.com/topics/muscle-recovery + fitness clones Flutter/React MIT
- **Licencia:** MIT (clones MIT + lógica pública) — Permiso para usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias. Inspiración comercial Fitbod no implica copia de código propietario.
- **Autor:** Fitbod Inc (UX/IA) + community fitness MIT (clones open source) + recovery research (piernas 72h, brazos 36h, core 24h)
- **Inspiración:** Fitbod evita sobrecarga y mantiene balance: cada ejercicio → músculo (PECHO/ESPALDA/PIERNAS/HOMBROS/BRAZOS/CORE/GLUTEOS); calcula `horas desde último entreno` por músculo → freshness 0-100%: <24h fatigado 22% (swap), 24-48h recovering 58% (-1 set), 48-72h 82%, ≥72h fresco 100% (prioriza +2.5%/+1 rep). Detecta desbalance (grupo poco vs mucho entrenado) y prioriza el débil. Adapta workout planeado ejercicio por ejercicio sin copiar Fitbod — JS puro local.
- **Mejora sobre Fitbod:** Antes (Fitbod $12.99/mes): IA en cloud, sin control trainer, sin integración check-in/RIR, sin desbalance coaching, solo cliente. Ahora: IA local por cliente seleccionable, fresca en dashboard trainer (Push/Pull/Legs), freshness grid 7 músculos con Progress bar + status fresco/recuperando/fatigado + hours, adaptación visual por ejercicio (mantener/reducir/swapear/priorizar con badge + alt), desbalance detection automático, aplicar/deshacer, sin cloud, sin costo, integra con historial 7d + volumen, BUILD 0. En prod: alimenta `prisma.workoutLogs` + `ExerciseSetLog` reales por `muscleGroup`.
- **Uso en EZEQUIEL COACHING:**
  - Lógica Fitbod `freshnessFor(muscle, history)` con `hoursSince(dateStr)` (mock 2026-09-09 18:00) — mapping histórico `MOCK_HISTORY` 5 entries (pecho/brazos, piernas/gluteos, espalda/brazos, hombros/core) → `pct` 22/58/82/100 + status fatigued/recovering/fresh (piernas/gluteos penalizados 68% si 48-72h)
  - Grid recuperación 7 músculos (PECHO ESPALDA PIERNAS HOMBROS BRAZOS CORE GLUTEOS) con emoji, hours/d, Progress, % y badge status + leyenda ≥72h/24-72h/<24h
  - Adaptación workout: `PLANNED_WORKOUTS` Push/Pull/Legs (4 ex c/u con muscle/sets/reps/weight/alt) → `adapted` por freshness: fatigado→swapear/alt, recovering <70%→reducir -1 set/-10%, fresco 100%→priorizar +2.5% — visual warn/ok/high con icons (RefreshCw/Flame/Zap/CheckCircle2) + note `"FRESCO 100% hace 3d+ → prioriza"` / `"Fatigado 22% <24h → cambia a ..."`
  - Tabs Push/Pull/Legs + fresh/fatigued counts + imbalance tip (min vs max entrenado) + planned vs adapted 2-col grid + Generar/Aplicado button con estado + explicación Brain card
- **Integrado:** src/components/fitbod-adaptive.tsx (FitbodAdaptive con freshness grid + desbalance + planned vs adapted + apply toggle) en /trainer/dashboard (grid con PT Distinction) con atribución. 81 MIT — Fitbod IA adaptativa local sin suscripción.

---

## 81 MIT — PT Distinction + My PT Hub + Fitbod mejorado con MIT

Este proyecto alcanza **81 repositorios MIT integrados** — patrones adaptados, no copia literal — con atribución completa y respeto a licencias.

- **Total:** 81 MIT (1-81) — BUILD 0 verificado, host 200, sin copia AGPL, PWA offline, 37+ rutas, 18 tablas.
- **Cierre:** Con Automatizaciones PT Distinction+My PT Hub (#80: onboarding auto + check-in reminder + retención 5d → auto-mensaje) + IA Adaptativa Fitbod (#81: músculo fresco/recuperación + adapta workout por historial) se cierra el ciclo 81 MIT premium — lo mejor de las 10 plataformas comerciales TOP mejorado con MIT: automatizaciones retención + IA fresco + CRM/pagos.
- **Nota legal:** Todas las integraciones mantienen licencia MIT original y atribuyen autores. Código adaptado es original inspirado en patrones. Inspiración comercial (PT Distinction/My PT Hub/Fitbod/Trainerize/Everfit/FitBudd/Future) no implica copia de código propietario.

