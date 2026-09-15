# APP_REORGANIZATION_PLAN.md — KINETIXFITT

Fecha: 2026-09-10 · Estado: PLAN ACTIVO · Regla crítica: **no eliminar ninguna funcionalidad, solo reubicarla y agruparla.**

---

## 1. Estado actual

- Next.js 15 App Router, dos roles (`(client)` y `(trainer)`), 37 rutas, ~130 componentes, Prisma + SQLite.
- Auth por rol sólida (lote 1: ownership y persistencia de programas ya corregidos y testeados).
- Navegación cliente: bottom bar (Inicio, Entrenar, Progreso, Mensajes) + drawer "Más" (Nutrición, Cronómetros, Check-ins, Perfil, Ajustes).
- Navegación trainer: sidebar 10 links planos.

## 2. Problemas encontrados (diagnóstico)

| # | Problema | Evidencia |
|---|---|---|
| P1 | **Dashboard-cliente = pila de 19 componentes** sin jerarquía: gamificación, breathing, referidos, educación, calendarios, push, PWA… todo apilado. Scroll infinito, acción principal diluida. | `client/dashboard/page.tsx` |
| P2 | **Progreso = 31 componentes** en una sola página (sueño, running, GPX, exports, import Hevy, share, wearables…) — es un mega-hub, no una pantalla de progreso. | `client/progress/page.tsx` |
| P3 | **Trainer dashboard = 20 componentes**, incluidos 4 clones "all-in-one" (Trainerize, Everfit, PT Distinction, FitBod) que compiten entre sí. | `trainer/dashboard/page.tsx` |
| P4 | **Duplicados reales**: `timers-hub + openhiit-pro + hiit-timer` montados en Nutrición Y en Cronómetros; `Achievements`, `Challenges`, `PredictivePlateau` en Dashboard Y Progreso; `CommandPalette` + `CommandPalettePro` conviviendo; `revenue-analytics` vs `trainer-revenue-pro`. | mapa página→componente |
| P5 | Funciones de **salud/cardio** (sueño, run, GPX, escalas) sin hogar temático: viven atropelladas al final de Progreso. | idem |
| P6 | **Descubrimiento nulo**: el usuario nuevo no ve el catálogo de funciones; no hay hub "ver todo". | drawer Más tiene solo 5 items |
| P7 | Icono duplicado en nav trainer (Workouts y Ejercicios comparten `Dumbbell`). | `trainer-nav.tsx` |
| P8 | `/client/calculators` es un redirect puro a Nutrición (ruta muerta). | `calculators/page.tsx` |

## 3. Inventario de funcionalidades (clasificación)

**CORE (visible, acceso 1 tap):** Entrenar (plan + sesión + timer + PRs), Progreso (peso/cargas/medidas/fotos), Check-ins, Mensajes, Dashboard, Clientes (trainer), Programas/Workouts (trainer).
**IMPORTANTES (1-2 taps):** Nutrición + calculadoras, Cronómetros/HIIT, Analíticas, Pagos, Check-in review, Ejercicios, Perfil, Ajustes.
**SECUNDARIAS (agrupadas en hubs):** Gamificación (Habitica RPG, Tienda XP, Challenges, Logros, Calendario hábitos), Salud (Sueño, Healthbox, Recovery Breathing), Cardio (Run Tracker, GPX), Datos (Wearables BT, OpenScale, import Hevy, Export Center), IA Coach, Social (Share, Referidos), Educación.
**AVANZADAS (studio/herramientas):** Trainerize All-in-One, Everfit UX Builder, PT Distinction, FitBod Adaptivo, Program Tuner, Bulk Assign, CRM Pipeline, Risk ML, Auto-mensajes, Live Session, Revenue Pro/Analytics.
**CONFIG/ADMIN:** Ajustes (ambos roles), Tema, Push Center, PWA install, Changelog.
**EXPERIMENTALES:** photo-ai-compare, streak-prediction, granite-offline, fittrackee-pro (se mantienen, agrupados, con su badge).

## 4. Nueva arquitectura de navegación

**CLIENTE** (mobile-first, sin cambios de stack):
- Bottom bar: **Inicio · Entrenar · Progreso · Mensajes · Más**
- Drawer "Más": **Nutrición · Check-ins · Herramientas (nuevo) · Perfil · Ajustes**
- Nuevo **`/client/tools` = "Más herramientas"**: catálogo completo con pestañas por categoría (Gamificación, Salud, Cardio, Datos, Social, Educación, Sistema). Todas las funciones siguen montadas y funcionando — solo cambian de pantalla.
- Inicio queda como **centro de acciones**, no catálogo: Hoy (acción principal) → stats → check-in → mensaje → IA Coach → accesos rápidos por categoría → búsqueda (palette).

**TRAINER:**
- Sidebar agrupada: **Operación** (Dashboard, Clientes, Check-ins, Mensajes) · **Contenido** (Entrenamientos, Ejercicios) · **Negocio** (Analíticas, Pagos, Studio) · Sistema (Recursos, Ajustes).
- Nuevo **`/trainer/studio`**: las herramientas avanzadas/clones (Trainerize, Everfit, PT Distinction, FitBod, CRM, Risk ML, Bulk Assign, Program Tuner, Auto-mensajes, Live Session, Revenue Pro) con tabs por categoría.
- Dashboard trainer queda: pendientes de hoy (check-ins sin revisar, sesiones, mensajes), MRR, charts principales, control center.

## 5. Reubicaciones concretas (sin borrar nada)

| Componente | Hoy | Destino | Motivo |
|---|---|---|---|
| timers-hub, openhiit-pro, hiit-timer | Nutrición Y Timers | solo `/client/timers` (+ link en Nutrición) | duplicación |
| habitica-gamify, habit-store, challenges*, habit-calendar, achievements* | Dashboard | `/client/tools` (Gamificación) | pila en dashboard; challenges/achievements siguen también en Progreso donde ya estaban |
| recovery-breathing, sleep-tracker, healthbox | Dashboard/Progreso | `/client/tools` (Salud) | hogar temático |
| run-tracker, gpx-tracker | Progreso | `/client/tools` (Cardio) | no son progreso |
| openscale-sync, hevy-import-pro, export-center*, granite-offline | Progreso | `/client/tools` (Datos) | utilidades puntuales |
| social-share, referral-system, education-hub | Dashboard/Progreso | `/client/tools` (Social/Educación) | no son acción diaria |
| push-center, pwa-install-desktop, calendar-sync, premium-calendar, onboarding-video | Dashboard | `/client/tools` (Sistema/Onboarding) | config, no dashboard |
| predictive-plateau | Dashboard | solo Progreso (ya está, con los mismos logs) | duplicado |
| trainerize-allinone, everfit-ux-builder, pt-distinction-auto, fitbod-adaptive, crm-pipeline, risk-ml, auto-message-risk, program-tuner, bulk-assign, workoutcool-banner | Trainer dashboard | `/trainer/studio` | dashboard enfocado en operación del día |
| trainer-revenue-pro | Trainer dashboard | `/trainer/studio` (Negocio) | MRR ya visible en dashboard vía stats |
| revenue-analytics | Trainer dashboard | `/trainer/analytics` | su lugar natural |

\* si el componente ya existe en otra página con los mismos props, no se duplica el montaje.

## 6. Design System (base existente, formalización)

Tokens actuales a respetar y extender en `src/components/ui/*`: fondo `#080808`, superficies `zinc-900/50`, borde `zinc-800`, acento `#D6FF2A` (PRIMARY), blanco para selección secundaria, badges `variant` (accent/success/warn/muted). Tipos: `font-display` (Space Grotesk) títulos, Inter texto. Radios: `rounded-xl/2xl`. Touch targets ≥44px. Todo componente nuevo debe usar solo estos tokens (nada de colores ad-hoc salvo semánticos: rojo HR, azul agua).

## 7. Jerarquía visual por pantalla (regla)

Nivel 1: título de pantalla + subtítulo. Nivel 2: UNA acción principal (máx 2). Nivel 3: info crítica (stats). Nivel 4: accesos a hubs. Nivel 5: avanzadas (studio/tools/búsqueda).

## 8. UX / Onboarding / Descubrimiento

- Empty states ya existentes se mantienen; se agregan al hub Tools (intro 1 línea por categoría).
- Onboarding flow existente en `/client/onboarding` queda como único onboarding; el video de bienvenida se mueve a Tools (no popup).
- Descubrimiento: command palette (ya existe) + grid de categorías en Inicio + badge "PRO/VIP" existente.

## 9. Accesibilidad

Mantener y verificar: contrastes actuales (zinc-400 sobre #080808 pasa AA para texto grande; texto pequeño usa zinc-300+), focus visible en links/botones nuevos, `aria-label` en botones solo-icono, `role="progressbar"` ya agregado en stats.

## 10. Rendimiento

- Las páginas aligeradas reducen JS inicial del dashboard (los componentes movidos se cargan solo en su pantalla).
- No se agregan dependencias nuevas.
- Verificar tras el cambio: `tsc`, `lint`, `test:core`, carga de `/client/dashboard` y `/client/tools` en dev.

## 11. Funcionalidades nuevas propuestas (post-reorg, NO en este lote)

- **MUST:** notificación digest para trainer (check-ins sin revisar >24h) — retención.
- **SHOULD:** favoritos en Tools (localStorage por usuario) — acceso rápido personal.
- **SHOULD:** headers de sección colapsables en Progreso — reducir scroll.
- **NICE:** modo "Sesión enfocada" (gym-mode ya existe; integrarlo como tab default de sesión).
- **EXPERIMENTAL:** resumen semanal autogenerado para compartir con el atleta.

## 12. Riesgos

- Componentes con props dependientes de datos de la página origen → se mueve junto el wiring o se deja donde está (regla: si requiere refetch complejo, queda en su lugar y solo se linkea).
- Service worker cache de rutas viejas → iterar `sw.js` si hace falta.
- Doble montaje (dash viejo + hub nuevo) durante transición: evitar montar el mismo componente dos veces en rutas distintas para no duplicar efectos locales (localStorage).

## 13. Plan de implementación (lotes verificados)

1. **Lote R1 (este):** `/client/tools` + recorte dashboard cliente + drawer "Más" con Herramientas + quitar duplicados de Nutrición (link a Timers) + `/trainer/studio` + sidebar trainer agrupada + recorte dashboard trainer + fixes de iconos.
2. Lote R2: Progreso reorganizado (tabs + colapsables), favoritos en Tools, empty states de hubs.
3. Lote R3: errores/loading uniformes con `ui/`, audit responsive desktop del dashboard trainer, performance (bundle de dashboard).
4. Lote R4: docs (README estado real), accesibilidad pass completo.

**Verificación por lote:** `npx tsc --noEmit` (0 errores) · `npm run lint` (0 errores) · `npm run test:core` (9/9) · recorrido manual en preview (trainer + cliente) · ningún componente desmontado sin nuevo hogar.
