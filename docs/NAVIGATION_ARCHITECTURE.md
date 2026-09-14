# NAVIGATION_ARCHITECTURE.md — Arquitectura de navegación

Principio: **3 toques máximo a cualquier función; 1 toque a las 5 acciones del día.**

## CLIENTE (mobile-first)

**Bottom bar (pulgar):**
```
Inicio · Entrenar · Nutrición · Progreso · Más
```
*(cambio R-FitSync: Nutrición sube al bar como pide la referencia; Mensajes pasa al drawer "Más" y a la campana de notificaciones — el coach siempre avisa por ahí.)*

**Drawer "Más":** Nutrición · Herramientas · Cronómetros · Check-ins · Mensajes · Historial · Perfil · Ajustes

**Inicio = centro de decisiones** (en este orden):
1. Saludo personalizado + objetivo
2. Entrenamiento de hoy (hero 2-col, CTA COMENZAR)
3. Tu progreso semanal (anillo + LMXJVSD + racha)
4. KPIs (Peso · Adherencia · Plan · Racha)
5. Check-in semanal / Mensaje de Ezequiel
6. IA Coach + semana adaptativa
7. Descubrimiento (accesos a /client/tools por categoría)

**Pantallas clave y su acción principal (UNA por pantalla):**
- Entrenar → COMENZAR (sesión de hoy; plan completo debajo; generador como herramienta)
- Sesión `[id]` → COMPLETAR SERIE (gym-mode, timer, RIR)
- Nutrición → REGISTRAR/CONSULTAR (calculadora TDEE destacada; alimentos, hábitos debajo)
- Progreso → VER MI PROGRESO (tabs Peso/Cargas/Medidas/Fotos + charts reales)
- Tools → explorar por categoría (gamificación, salud, cardio, datos, social, educación, sistema)

## TRAINER (desktop con sidebar agrupada)

```
OPERACIÓN   Dashboard · Clientes · Check-ins · Mensajes
CONTENIDO   Entrenamientos · Ejercicios · Recursos
NEGOCIO     Analíticas · Pagos · Studio
SISTEMA     Ajustes
```

**Studio** (avanzadas): Clientes & CRM · Programación · Plataformas · Negocio.
**Dashboard trainer:** pendientes de hoy (atención necesaria), KPIs animados, sesiones en vivo, clientes recientes. Acción principal: resolver pendientes.

## Búsqueda global
`CommandPalette` (⌘K / botón Buscar) en topbar de ambos roles → páginas, herramientas, acciones. *(R-next: indexar ejercicios y atletas dentro del palette.)*

## Reglas
- Toda función existe en exactamente UN lugar canónico; los accesos son links, nunca montajes duplicados.
- Empty states con CTA; nada de pantallas muertas.
- Volver siempre visible (back del browser + links contextuales).
