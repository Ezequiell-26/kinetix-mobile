# UI_UX_AUDIT.md — Auditoría UX/UI (2026-09-10)

Auditoría sobre la app real (37 rutas, ~130 componentes, 2 roles). Estado: post-reorganización R1 (hubs Tools/Studio) y R2 (motion + iconos). Esta auditoría guía el rediseño FitSync premium.

## Problemas de navegación
- ✅ RESUELTO (R1): catálogo de funciones sin hogar → `/client/tools` (7 categorías) y `/trainer/studio` (4 tabs).
- ⚠️ Mensajes ocupa un slot del bottom-nav móvil; la referencia prioriza Nutrición. → mover Mensajes al drawer "Más" (sigue a 1 tap).
- ⚠️ El trainer tiene 10 links planos agrupados (R1) pero sin estados de sección; ok para MVP.
- ⚠️ `/client/calculators` sigue siendo un redirect muerto a Nutrición (ruta heredada).

## Problemas visuales
- ✅ RESUELTO: microcopia técnica ("X MIT", "fórmulas públicas") eliminada de toda la UI (74 archivos).
- ✅ RESUELTO: emojis reemplazados por iconos lucide consistentes.
- 🔴 **Acento lima #D6FF2A ≠ identidad premium fitness de la referencia (verde esmeralda sobre azul-negro).** → migrar a tokens esmeralda.
- 🔴 Fondos negro puro (#080808) sin el tinte azul de la referencia. → tokens de superficie.
- ⚠️ Botones mezclan 3 estilos de radio en componentes viejos (xl vs 2xl vs full).

## Problemas de jerarquía
- ✅ RESUELTO: dashboard cliente 370→~130 líneas con hero 2-col + módulo semanal + KPIs 4.
- ⚠️ Progreso sigue siendo una pestaña larga (31 componentes → varios ya viven en Tools); falta separar "Resumen" de "Herramientas de salud" con secciones colapsables.
- ⚠️ En Nutrición, 6 cards de calculadoras al mismo nivel; la principal (TDEE/macros) debería destacar.

## Funciones duplicadas
- ✅ RESUELTO: timers en Nutrición y Timers (solo Timers + banner link).
- ✅ RESUELTO: Achievements/Challenges/PredictivePlateau duplicados entre Dashboard y Progreso (quedaron en Progreso/Tools).
- ⚠️ `CommandPalette` y `CommandPalettePro` conviven (trainer usa ambas) → unificar en R-next.

## Funciones mal ubicadas / difíciles de encontrar
- ✅ RESUELTO: CRM/RiskML/BulkAssign/RevenuePro estaban importados y nunca montados → visibles en Studio.
- ⚠️ Historial del atleta (`/client/history`) no está en ningún menú (solo URL directa) → agregar al drawer Más.
- ⚠️ Onboarding (`/client/onboarding`) solo accesible por URL → enlazar desde Perfil y primera sesión.

## Pantallas sobrecargadas / vacías
- Sobrecargadas: Progreso (ver arriba), Nutrición (6 calculadoras al mismo nivel).
- Vacías: `/trainer/resources` y `/trainer/analytics` tienen poco contenido propio; usarlos para consolidar (RevenueAnalytics ya se movió a analytics).

## Elementos innecesarios
- `WhatsappFloat` usa número placeholder 5490000000000 → configurable o fuera hasta tener el real.
- Changelog visible solo para trainer: ok, mantener.

## Consistencia
- Tokens: hoy todo usa hex hardcodeados (#D6FF2A, zinc). → migrar a variables CSS (`--primary`, `--surface`...) definidas en DESIGN_SYSTEM.md; los componentes siguen Tailwind, así que el cambio se hace en globals + hex constantes.
- Tipografía: Space Grotesk (display) + Inter (texto) ya consistente.

## Responsive
- ✅ RESUELTO: cliente 640px móvil / 1100px desktop; trainer sidebar + contenido.
- ⚠️ Tablas de pagos/analytics en móvil hacen scroll horizontal → envolver en overflow-x.

## Accesibilidad
- ✅ RESUELTO: contraste del acento como texto en modo claro (#047857), focus-visible global, aria en rings/bars.
- ⚠️ Verificar contraste del nuevo esmeralda (#34D399) como texto pequeño sobre zinc-900 (≈7:1 ✓) y en claro usar emerald-700.

## Rendimiento visual
- ✅ RESUELTO: dashboards livianos (componentes movidos a hubs), animaciones con `prefers-reduced-motion`.
- ⚠️ Recharts remonta en cada cambio de tab de Progreso → memoizar en R-next.

## A destacar más / a ocultar
- Destacar: Entrenamiento de hoy (ya hero), Check-in pendiente (badge), Mensajes sin leer (bell ya existe).
- Ocultar en hubs (ya hecho): gamificación, salud, cardio, datos, social, educación, sistema, studio.
