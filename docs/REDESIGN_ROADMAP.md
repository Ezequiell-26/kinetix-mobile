# REDESIGN_ROADMAP.md — Plan FitSync Premium

Referencia visual: mockup FitSync (esmeralda sobre azul-negro, cards jerárquicas, anillos, bottom-nav con Nutrición). Principio: **más potencia, menos complejidad, mejor experiencia.** Nunca romper funcionalidad.

## Hecho (este lote — "identidad FitSync")
- ✅ Tokens + acento **esmeralda #34D399** en toda la app (migración mecánica desde lima #D6FF2A: ~100 archivos), hover #6EE7B7, claro #047857 (AA).
- ✅ Fondos azul-negro (#0A0F14) en dark theme (página, navs, drawers).
- ✅ Bottom-nav móvil: Inicio · Entrenar · **Nutrición** · Progreso · Más (Mensajes → drawer + campana).
- ✅ Docs: UI_UX_AUDIT · DESIGN_SYSTEM · NAVIGATION_ARCHITECTURE · FEATURE_MAP · este roadmap.
- (Previo ya en producción: hubs Tools/Studio, motion premium, sin emojis ni microcopia técnica, dashboard hero+semanal, responsive 640/1100.)

## R-next — Profundidad FitSync
1. **Favoritos y recientes** en Tools + palette (localStorage por usuario).
2. **Coach IA como capa**: mensaje post-entreno con % de sesión completada y recomendación de mañana (usa WorkoutLog real).
3. **Progreso colapsable**: Resumen fijo + acordeones de salud/cardio/datos.
4. Nutrición: TDEE destacada como "acción principal" y el resto jerarquizado.
5. Unificar CommandPalette + CommandPalettePro; indexar ejercicios y atletas.
6. Tooltips de charts claros en tema claro.

## R+2 — Experiencia
7. Onboarding progresivo (objetivo → nivel → disponibilidad → métricas), máx 3 pasos por pantalla.
8. Empty states auditados con CTA (parcial hecho en hubs).
9. Accesibilidad: pass de foco/labels en modales; contraste revisado por token.
10. Performance: memoizar charts de Progreso; medir bundle de dashboard.

## Bloqueados por decisión/pendientes de ok
- **P0 uploads privados** (storage fuera de `public/` + ruta autenticada) — requiere ok para tocar carpeta de uploads.
- Datos del mockup sin fuente real (pasos/calorías/sueño) — esperan integración real de wearables.

## Criterio de éxito por lote
`tsc 0 · lint 0 · test:core 9/9 · recorrido trainer+cliente en preview (móvil y desktop) · ningún componente desmontado · cero microcopia técnica · cero emojis`.
