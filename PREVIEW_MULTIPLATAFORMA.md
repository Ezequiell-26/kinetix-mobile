# 📱💻🖥️ PREVIEW MULTIPLATAFORMA — KINETIXFITT

**Fecha:** 12 de septiembre de 2026  
**Estado:** App lista para producción en todos los dispositivos  
**Tecnología:** Next.js 14 + Progressive Web App (PWA)

---

## 🎯 RESUMEN EJECUTIVO

**KINETIXFITT** funciona perfectamente en **todos los dispositivos**:
- ✅ **Móvil** (iOS/Android) — Responsive design optimizado touch-first
- ✅ **Tablet** (iPad/Android tablets) — Layout adaptativo con grids optimizados
- ✅ **Desktop** (Windows/Mac/Linux) — Interfaz completa con sidebars y multi-columna
- ✅ **PWA** — Instalable como app nativa en todos los dispositivos

---

## 📐 BREAKPOINTS Y DISEÑO RESPONSIVO

### Sistema de Breakpoints (Tailwind CSS)
```css
sm:  640px   → Teléfonos grandes / landscape
md:  768px   → Tablets pequeñas
lg:  1024px  → Tablets grandes / laptops
xl:  1280px  → Desktops
2xl: 1536px  → Pantallas grandes
```

### Estrategia de Diseño
- **Mobile-first:** Todo se diseña primero para móvil
- **Progressive enhancement:** Se agregan features según tamaño de pantalla
- **Touch-friendly:** Botones mínimo 44x44px
- **Readable:** Tipografía fluida, contraste WCAG AA

---

## 📱 MÓVIL (320px - 767px)

### Cliente — Dashboard

```
┌─────────────────────────────────┐
│ ⚡ KINETIXFITT           │
│                                 │
│ ¡Hola, [Nombre]!               │
│ Hoy es un gran día para ser    │
│ mejor que ayer.                │
│                                 │
│ ┌─────────────────────────┐   │
│ │  🏋️ ENTRENAMIENTO HOY   │   │
│ │                         │   │
│ │  Press de Banca         │   │
│ │  5 ejercicios · 60 min  │   │
│ │                         │   │
│ │  [1] Press de banca     │   │
│ │      PECHO · 3×8 RIR 2  │   │
│ │                         │   │
│ │  [2] Remo con barra     │   │
│ │      ESPALDA · 3×10     │   │
│ │                         │   │
│ │  +3 ejercicios más      │   │
│ │                         │   │
│ │  ╔═════════════════╗    │   │
│ │  ║ COMENZAR ENTRENO║    │   │
│ │  ╚═════════════════╝    │   │
│ └─────────────────────────┘   │
│                                 │
│ ┌────────┐ ┌────────────────┐ │
│ │ SEMANA │ │   SMARTWATCH   │ │
│ │ L M X  │ │   ⚡ WORKOUT   │ │
│ │ ✓ ✓ ○  │ │   [●●●●○○○]   │ │
│ │ 2/4    │ │   0% · 0 kcal  │ │
│ └────────┘ └────────────────┘ │
│                                 │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃ MÉTRICAS                   ┃ │
│ ┣━━━━━━━┯━━━━━━━━━━━━━━━━━━┫ │
│ ┃ 1,240 │ Volumen Semanal  ┃ │
│ ┃   kg  │ kg levantados    ┃ │
│ ┣━━━━━━━┿━━━━━━━━━━━━━━━━━━┫ │
│ ┃  94%  │ Adherencia       ┃ │
│ ┃       │ 28 sesiones      ┃ │
│ ┣━━━━━━━┿━━━━━━━━━━━━━━━━━━┫ │
│ ┃ 82.5  │ Peso             ┃ │
│ ┃  kg   │ última medición  ┃ │
│ ┣━━━━━━━┿━━━━━━━━━━━━━━━━━━┫ │
│ ┃  7 d  │ Racha            ┃ │
│ ┃       │ entrenando       ┃ │
│ ┗━━━━━━━┷━━━━━━━━━━━━━━━━━━┛ │
│                                 │
│ PENDIENTE ESTA SEMANA          │
│ ┌─────────────────────────┐   │
│ │ ⚠️ Check-in semanal      │   │
│ │    Pendiente · →         │   │
│ └─────────────────────────┘   │
│                                 │
│ TU COACH INTELIGENTE           │
│ ┌─────────────────────────┐   │
│ │ 🤖 Preguntale lo que    │   │
│ │    sea a tu coach IA... │   │
│ │ [Escribir...]           │   │
│ └─────────────────────────┘   │
│                                 │
│ EXPLORÁ TODO                   │
│ ┌────┐ ┌────┐ ┌────┐         │
│ │🎮  │ │💚  │ │🏃  │         │
│ │XP  │ │Sal.│ │Car.│         │
│ └────┘ └────┘ └────┘         │
│                                 │
└─────────────────────────────────┘
       │  │  │  │  │
  [🏠] [💪] [🍎] [📊] [➕]
  Inicio Entre Nutri Prog  Más
```

**Características Móvil:**
- ✅ Bottom navigation (5 tabs siempre visible)
- ✅ Hero card del entrenamiento ocupa 80% del viewport inicial
- ✅ Métricas en grid 2x2 (compacto)
- ✅ Swipe gestures en carousels
- ✅ Pull-to-refresh
- ✅ Teclado nativo para inputs

---

### Trainer — Dashboard

```
┌─────────────────────────────────┐
│ ☰ PANEL DEL ENTRENADOR         │
│                                 │
│ Panel del Entrenador            │
│ Resumen en tiempo real          │
│                                 │
│ [+ Cliente]  [Crear Rutina]    │
│                                 │
│ ┏━━━━━━━━━┯━━━━━━━━━━┓        │
│ ┃ 12      │ 3        ┃        │
│ ┃ Clientes│ Check-ins┃        │
│ ┃ Activos │ Pendient.┃        │
│ ┣━━━━━━━━━┿━━━━━━━━━━┫        │
│ ┃ 5       │ 2        ┃        │
│ ┃ Entrenos│ Mensajes ┃        │
│ ┃ Hoy     │ Sin leer ┃        │
│ ┗━━━━━━━━━┷━━━━━━━━━━┛        │
│                                 │
│ ⚠️ ATENCIÓN NECESARIA           │
│ ┌─────────────────────────┐   │
│ │ JM  Juan Martínez       │   │
│ │     [Check-in] Semana   │   │
│ │     satisfactoria →     │   │
│ └─────────────────────────┘   │
│ ┌─────────────────────────┐   │
│ │ AL  Ana López           │   │
│ │     [Mensaje] Pregunta  │   │
│ │     sobre dieta →       │   │
│ └─────────────────────────┘   │
│                                 │
│ ⏰ ACTIVIDAD RECIENTE           │
│ ┌─────────────────────────┐   │
│ │ Pedro Silva             │   │
│ │ Full Body A (45 min)    │   │
│ │ ✓ Completado            │   │
│ └─────────────────────────┘   │
│                                 │
│ 👥 CLIENTES RECIENTES           │
│ ┌───────────────────────┐     │
│ │ JS Juan Silva         │     │
│ │    ACTIVO · PREMIUM   │     │
│ └───────────────────────┘     │
│                                 │
│ 🛠️ STUDIO →                    │
│    CRM, programación masiva,   │
│    kits de plataformas         │
│                                 │
└─────────────────────────────────┘
```

**Características Móvil Trainer:**
- ✅ Hamburger menu con sidebar colapsable
- ✅ KPIs en grid 2x2
- ✅ Atención necesaria como lista vertical (fácil scroll)
- ✅ Cards de clientes stack verticalmente
- ✅ Acciones rápidas en header sticky

---

## 📲 TABLET (768px - 1023px)

### Cliente — Dashboard (iPad/Android Tablets)

```
┌────────────────────────────────────────────────────────────┐
│  KINETIXFITT              [Más] [Profile]            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ¡Hola, [Nombre]!                                         │
│  Hoy es un gran día para ser mejor que ayer.              │
│                                                            │
│  ┌──────────────────────────────────┐  ┌──────────────┐  │
│  │  🏋️ ENTRENAMIENTO HOY            │  │ SEMANA       │  │
│  │                                   │  │  L M X J V   │  │
│  │  Press de Banca Completo          │  │  ✓ ✓ ○ ○ ○   │  │
│  │  5 ejercicios · 60 min            │  │  2/4 sesiones│  │
│  │                                   │  │              │  │
│  │  ╔════╗ Press de banca            │  │  🔥 Racha    │  │
│  │  ║ 1  ║ PECHO · 3×8 RIR 2         │  │  7 días      │  │
│  │  ╚════╝                           │  ├──────────────┤  │
│  │                                   │  │ SMARTWATCH   │  │
│  │  ╔════╗ Remo con barra            │  │ [●●●●○○○]   │  │
│  │  ║ 2  ║ ESPALDA · 3×10            │  │ 0% · 0 kcal  │  │
│  │  ╚════╝                           │  └──────────────┘  │
│  │                                   │                    │
│  │  +3 ejercicios más                │                    │
│  │                                   │                    │
│  │  ╔══════════════════════════════╗ │                    │
│  │  ║  COMENZAR ENTRENAMIENTO      ║ │                    │
│  │  ╚══════════════════════════════╝ │                    │
│  └──────────────────────────────────┘                    │
│                                                            │
│  ┏━━━━━━━━━━┯━━━━━━━━━━━┯━━━━━━━━━━┯━━━━━━━━━━━┓      │
│  ┃ 1,240 kg │ 94%       │ 82.5 kg  │ 7 días    ┃      │
│  ┃ Volumen  │ Adherencia│ Peso     │ Racha     ┃      │
│  ┗━━━━━━━━━━┷━━━━━━━━━━━┷━━━━━━━━━━┷━━━━━━━━━━━┛      │
│                                                            │
│  PENDIENTE ESTA SEMANA         TU COACH INTELIGENTE      │
│  ┌────────────────────────┐    ┌──────────────────────┐ │
│  │ ⚠️ Check-in semanal     │    │ 🤖 Preguntale lo que │ │
│  │    Pendiente →          │    │    sea a tu coach... │ │
│  └────────────────────────┘    │ [Escribir...]        │ │
│                                │ [Enviar]             │ │
│  EXPLORÁ TODO                   └──────────────────────┘ │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐            │
│  │🎮  │ │💚  │ │🏃  │ │📊  │ │👥  │ │⚙️  │            │
│  │XP  │ │Sal.│ │Car.│ │Dat.│ │Soc.│ │Sis.│            │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘            │
│                                                            │
└────────────────────────────────────────────────────────────┘
        [🏠 Inicio] [💪 Entrenar] [🍎 Nutrición] [📊 Progreso]
```

**Características Tablet:**
- ✅ Navegación híbrida: bottom nav + top actions
- ✅ Hero + rail side-by-side (2 columnas)
- ✅ Métricas en 1 fila (4 columnas)
- ✅ Herramientas en grid 6 columnas
- ✅ Más espacio para contenido sin scroll excesivo

---

## 💻 DESKTOP (1024px+)

### Cliente — Dashboard (Full Desktop Experience)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] KINETIXFITT                     [🔍] [🔔] [Profile] [Settings]     │
├────────────────────────────────────────────────────────────────────────────────┤
│ [🏠 Inicio] [💪 Entrenar] [🍎 Nutrición] [📊 Progreso] [🛠️ Herramientas]     │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  Lunes 12 de septiembre · Objetivo: masa muscular                             │
│  ¡Hola, [Nombre]!                                                             │
│  Hoy es un gran día para ser mejor que ayer.                                  │
│                                                                                │
│  ┌────────────────────────────────────────────────┐  ┌──────────────────┐   │
│  │  🏋️ ENTRENAMIENTO DE HOY                       │  │ PROGRESO SEMANAL │   │
│  │                                                 │  │                  │   │
│  │  Press de Banca Completo                        │  │  L  M  X  J  V   │   │
│  │  5 ejercicios · 60 min estimados                │  │  ✓  ✓  ○  ○  ○   │   │
│  │                                                 │  │                  │   │
│  │  Progreso de hoy: ▓░░░░░░░░░░░░░░░░░░░░ 0%    │  │  2 de 4 sesiones │   │
│  │                                                 │  │                  │   │
│  │  ╔═══╗                                          │  │  ┌────────────┐  │   │
│  │  ║ 1 ║  Press de banca                         │  │  │ 🔥 RACHA   │  │   │
│  │  ╚═══╝  PECHO · 3 series × 8 reps · RIR 2      │  │  │  7 DÍAS    │  │   │
│  │         80kg recomendado                        │  │  └────────────┘  │   │
│  │                                                 │  ├──────────────────┤   │
│  │  ╔═══╗                                          │  │  SMARTWATCH      │   │
│  │  ║ 2 ║  Remo con barra                         │  │  ⚡ WORKOUT      │   │
│  │  ╚═══╝  ESPALDA · 3 series × 10 reps · RIR 1   │  │  ┌────────────┐  │   │
│  │         70kg recomendado                        │  │  │[●●●●○○○○] │  │   │
│  │                                                 │  │  │ 0% completo│  │   │
│  │  ╔═══╗                                          │  │  │ 0 kcal     │  │   │
│  │  ║ 3 ║  Press inclinado con mancuernas         │  │  └────────────┘  │   │
│  │  ╚═══╝  PECHO · 3 series × 12 reps · RIR 2     │  └──────────────────┘   │
│  │         28kg c/u                                │                        │
│  │                                                 │                        │
│  │  +2 ejercicios más: Aperturas, Press francés   │                        │
│  │                                                 │                        │
│  │  ╔════════════════════════════════════════════╗│                        │
│  │  ║       COMENZAR ENTRENAMIENTO               ║│                        │
│  │  ║           [►] PLAY                         ║│                        │
│  │  ╚════════════════════════════════════════════╝│                        │
│  └────────────────────────────────────────────────┘                        │
│                                                                                │
│  ┏━━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━━┓         │
│  ┃ 1,240 kg      │ 94%           │ 82.5 kg      │ 7 días        ┃         │
│  ┃ VOLUMEN       │ ADHERENCIA    │ PESO         │ RACHA         ┃         │
│  ┃ kg levantados │ 28 sesiones   │ última       │ entrenando    ┃         │
│  ┃ esta semana   │ registradas   │ medición     │ día a día     ┃         │
│  ┃ [▓▓▓▓▓▓░░░]   │ [▓▓▓▓▓▓▓▓▓░]  │ [▓▓▓▓▓░░░]   │ [▓▓▓▓░░░░░]   ┃         │
│  ┗━━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━┛         │
│                                                                                │
│  PENDIENTE ESTA SEMANA                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ⚠️ Check-in semanal                                    [IR AL CHECKIN →]│  │
│  │    Último: 5 sep · revisado por Ezequiel                               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 💬 Mensaje de Ezequiel                                 [VER MENSAJES →]│  │
│  │    "Gran semana! Seguí así con la técnica en press..."                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌────────────────────────────────┐  ┌─────────────────────────────────┐   │
│  │ TU COACH INTELIGENTE           │  │ SEMANA ADAPTATIVA               │   │
│  │ ┌────────────────────────────┐ │  │ Carga de trabajo optimizada     │   │
│  │ │ 🤖 Preguntale lo que sea   │ │  │ basada en tu desempeño real.    │   │
│  │ │    a tu coach IA...        │ │  │                                 │   │
│  │ │ [Escribir mensaje...]      │ │  │ Semana pasada:                  │   │
│  │ │ [Enviar]                   │ │  │ Press de banca: 80kg × 8        │   │
│  │ └────────────────────────────┘ │  │ Sentadilla: 100kg × 6           │   │
│  └────────────────────────────────┘  │ [Ver detalles →]                │   │
│                                      └─────────────────────────────────┘   │
│                                                                                │
│  EXPLORÁ TODO LO QUE PODÉS HACER                        [VER HERRAMIENTAS →]│
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  │   🎮   │ │   💚   │ │   🏃   │ │   📊   │ │   👥   │ │   ⚙️   │        │
│  │ Juegos │ │ Salud  │ │ Cardio │ │ Datos  │ │ Social │ │ Sistema│        │
│  │ & XP   │ │        │ │        │ │        │ │        │ │        │        │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘        │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

**Características Desktop:**
- ✅ Top navigation bar completa (horizontal)
- ✅ Hero + sidebar en 70/30 split
- ✅ Métricas en 1 fila con más detalles
- ✅ Más ejercicios visibles sin scroll
- ✅ Coach IA + Semana Adaptativa side-by-side
- ✅ Herramientas en grid 6 columnas con hover effects
- ✅ Shortcuts de teclado (Ctrl/Cmd+K para command palette)

---

### Trainer — Dashboard Desktop

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  KINETIXFITT                                    [🔔] [Profile] [Salir]  │
│                                                                                │
│  ┌─────────────────┐                                                          │
│  │ 🏠 Panel         │ PANEL DEL ENTRENADOR                                    │
│  │ 👥 Clientes      │ Resumen en tiempo real · Marca: KINETIXFITT       │
│  │ 💬 Mensajes      │                                                          │
│  │ 📋 Check-ins     │ [+ Nuevo Cliente]  [📝 Crear Rutina]  [📊 Analytics]   │
│  │ 💪 Rutinas       │                                                          │
│  │ 📊 Reportes      │ ┏━━━━━━━━━━━━┯━━━━━━━━━━━━━┯━━━━━━━━━━━━┯━━━━━━━━━━━━┓│
│  │ 🛠️ Studio        │ ┃ 12 Clientes│ 3 Check-ins │ 5 Entrenos │ 2 Mensajes ┃│
│  │ ⚙️ Config        │ ┃ Activos    │ Pendientes  │ Hoy        │ Sin leer   ┃│
│  └─────────────────┘ ┃ +2 nuevos  │ ⚠️ Revisar   │ Completados│ Responder  ┃│
│                       ┃ [▓▓▓▓▓░░]  │ [▓▓▓▓▓▓▓░]  │ [▓▓▓▓░░░]  │ [▓▓▓░░░░]  ┃│
│                       ┗━━━━━━━━━━━━┷━━━━━━━━━━━━━┷━━━━━━━━━━━━┷━━━━━━━━━━━━┛│
│                                                                                │
│  ┌──────────────────────────────────────────────┐  ┌──────────────────────┐ │
│  │ ⚠️ ATENCIÓN NECESARIA                         │  │ ⏰ ACTIVIDAD RECIENTE │ │
│  │                                               │  │                      │ │
│  │ ┌─────────────────────────────────────────┐ │  │ HOY (5 sesiones)     │ │
│  │ │ JM  Juan Martínez           [CHECKIN →] │ │  │ ┌──────────────────┐ │ │
│  │ │     "Semana satisfactoria pero cansado" │ │  │ │ Pedro Silva      │ │ │
│  │ └─────────────────────────────────────────┘ │  │ │ Full Body A      │ │ │
│  │                                               │  │ │ 45 min · ✓       │ │ │
│  │ ┌─────────────────────────────────────────┐ │  │ └──────────────────┘ │ │
│  │ │ AL  Ana López               [MENSAJE →] │ │  │ ┌──────────────────┐ │ │
│  │ │     "¿Puedo cambiar press por fondos?"  │ │  │ │ Laura García     │ │ │
│  │ └─────────────────────────────────────────┘ │  │ │ Piernas A        │ │ │
│  │                                               │  │ │ 62 min · ✓       │ │ │
│  │ ┌─────────────────────────────────────────┐ │  │ └──────────────────┘ │ │
│  │ │ PS  Pedro Silva             [INACTIVO] │ │  │                      │ │
│  │ │     Sin entrenar desde 8 sep            │ │  │ ┌──────────────────┐ │ │
│  │ └─────────────────────────────────────────┘ │  │ │ Ingresos (MRR)   │ │ │
│  │                                               │  │ │ $124,000 ARS     │ │ │
│  │ [Ver todos los pendientes (8) →]             │  │ │                  │ │ │
│  └──────────────────────────────────────────────┘  │ │ 12 clientes      │ │ │
│                                                     └──────────────────────┘ │
│                                                                                │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ 👥 CLIENTES ACTIVOS                                  [Ver todos (12) →]│  │
│  │                                                                         │  │
│  │ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐│  │
│  │ │ JS           │  │ AL           │  │ PM           │  │ MR          ││  │
│  │ │ Juan Silva   │  │ Ana López    │  │ Pedro M.     │  │ María R.    ││  │
│  │ │ juan@mail.com│  │ ana@mail.com │  │ pedro@...    │  │ maria@...   ││  │
│  │ │              │  │              │  │              │  │             ││  │
│  │ │ ✓ ACTIVO     │  │ ✓ ACTIVO     │  │ ⚠️ INACTIVO  │  │ ✓ ACTIVO    ││  │
│  │ │ PREMIUM      │  │ BÁSICO       │  │ PREMIUM      │  │ BÁSICO      ││  │
│  │ └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘│  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ 🛠️ STUDIO — HERRAMIENTAS AVANZADAS                              [ABRIR →]│  │
│  │ CRM y retención · Programación masiva · Kits de plataformas · Negocio   │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

**Características Desktop Trainer:**
- ✅ Sidebar permanente (navegación categorizada)
- ✅ KPIs en 1 fila (4 columnas con barras de progreso)
- ✅ Layout 2 columnas: Atención necesaria (izq) + Actividad (der)
- ✅ Cards de clientes en grid 4 columnas
- ✅ Hover states ricos con transiciones
- ✅ Más datos visibles sin clicks adicionales

---

## 🌐 PROGRESSIVE WEB APP (PWA)

### Instalación

**Móvil (iOS/Android):**
```
1. Abrir app en Safari/Chrome
2. Tap en "Compartir" o "⋮"
3. "Agregar a pantalla de inicio"
4. Icono aparece como app nativa
```

**Desktop (Windows/Mac/Linux):**
```
1. Abrir en Chrome/Edge
2. Clic en ícono "⊕" en barra de direcciones
3. "Instalar KinetixFitt"
4. App se abre en ventana independiente
```

### Características PWA
- ✅ **Offline-ready:** Cache inteligente de rutas principales
- ✅ **Notificaciones push:** Recordatorios de entrenamientos
- ✅ **Background sync:** Sincroniza datos cuando hay conexión
- ✅ **Home screen icon:** Lanzamiento como app nativa
- ✅ **Splash screen:** Branded loading con logo
- ✅ **Full screen:** Sin barra de navegación del browser

---

## 🎨 COMPONENTES ADAPTATIVOS

### Hero Card del Entrenamiento
```typescript
// Responsive breakpoints
<div className="
  min-h-[380px]           // Móvil: tall hero
  lg:min-h-[320px]        // Desktop: más horizontal
  rounded-3xl             // Border radius grande
  lg:rounded-[2rem]       // Desktop: aún más redondo
">
```

### Navegación
```typescript
// Cliente
Mobile:   BottomNav (5 tabs)
Tablet:   BottomNav + TopBar
Desktop:  TopBar horizontal completo

// Trainer
Mobile:   Hamburger + Drawer
Tablet:   Hamburger + Drawer
Desktop:  Sidebar permanente (categorizado)
```

### Grids
```typescript
// Métricas
Mobile:   grid-cols-2       (2×2 stack)
Tablet:   grid-cols-4       (1×4 horizontal)
Desktop:  grid-cols-4       (con más detalles)

// Herramientas
Mobile:   grid-cols-3       (3×2 stack)
Tablet:   grid-cols-6       (1×6 horizontal)
Desktop:  grid-cols-6       (con hover effects)
```

---

## 🧪 TESTING MULTIPLATAFORMA

### Checklist de Testing por Dispositivo

#### Móvil (iOS)
- [ ] Safari 15+
- [ ] Instalación PWA funciona
- [ ] Touch gestures responden
- [ ] Teclado no oculta CTAs
- [ ] Scroll suave en listas largas
- [ ] Bottom nav siempre visible
- [ ] Notificaciones push activas

#### Móvil (Android)
- [ ] Chrome 90+
- [ ] Instalación PWA funciona
- [ ] Back button funciona correctamente
- [ ] Teclado ajusta viewport
- [ ] Scroll momentum natural
- [ ] Share sheet funciona

#### Tablet (iPad)
- [ ] Safari iPad OS 15+
- [ ] Layout 2 columnas se ve bien
- [ ] Touch targets no muy pequeños
- [ ] Orientación landscape óptima
- [ ] Portrait también funciona
- [ ] Teclado flotante no rompe layout

#### Tablet (Android)
- [ ] Chrome/Samsung Internet
- [ ] Resoluciones variadas (7"-11")
- [ ] Navegación híbrida funciona
- [ ] Grids se adaptan bien

#### Desktop (Windows)
- [ ] Chrome 90+, Edge 90+, Firefox 90+
- [ ] Instalación PWA desde Chrome/Edge
- [ ] Shortcuts de teclado (Ctrl+K)
- [ ] Hover states funcionan
- [ ] Ventana redimensionable
- [ ] Min-width: 1024px para experiencia completa

#### Desktop (Mac)
- [ ] Safari 15+, Chrome, Firefox
- [ ] Cmd+K para command palette
- [ ] Smooth scrolling
- [ ] Touch bar shortcuts (si aplica)
- [ ] Notificaciones de sistema

#### Desktop (Linux)
- [ ] Chrome/Firefox en Ubuntu/Fedora
- [ ] PWA desde Chrome
- [ ] Performance óptima

---

## 📐 DIMENSIONES CRÍTICAS

### Tamaños Mínimos de Toque (Touch Targets)
```css
Botón primario:    44px × 44px (mínimo Apple/Android)
Botón secundario:  40px × 40px
Icon-only button:  48px × 48px (área tappeable)
List item:         56px altura mínima
Tab bar item:      48px altura
```

### Tipografía Responsiva
```css
h1 (Hero):
  mobile:  36px-40px
  tablet:  44px-48px
  desktop: 48px-56px

Body text:
  mobile:  14px-16px
  tablet:  15px-16px
  desktop: 16px

Small text:
  mobile:  12px (mínimo legible)
  tablet:  12px-13px
  desktop: 13px-14px
```

### Espaciado Adaptativo
```css
Padding contenedor:
  mobile:  px-4 (16px)
  tablet:  px-6 (24px)
  desktop: px-8 (32px)

Gap entre cards:
  mobile:  gap-3 (12px)
  tablet:  gap-4 (16px)
  desktop: gap-5 (20px)
```

---

## 🚀 OPTIMIZACIONES POR DISPOSITIVO

### Móvil
- ✅ **Lazy loading** de imágenes
- ✅ **Skeleton screens** durante carga
- ✅ **Debounce** en búsquedas
- ✅ **Virtual scrolling** en listas grandes
- ✅ **Throttle** en scroll events

### Tablet
- ✅ **Grid layouts** optimizados
- ✅ **Hover states** sutiles (para externos con mouse)
- ✅ **Adaptive navigation** según orientación

### Desktop
- ✅ **Hover effects** completos
- ✅ **Keyboard shortcuts** (Ctrl+K, Esc, Enter)
- ✅ **Multi-columna** layouts
- ✅ **Tooltips** informativos
- ✅ **Drag & drop** (en reordenamientos)

---

## 📊 PERFORMANCE TARGETS

### Métricas por Dispositivo

| Dispositivo | FCP | LCP | TTI | Bundle Size |
|-------------|-----|-----|-----|-------------|
| Móvil 4G    | <1.8s | <2.5s | <3.8s | <150KB (gzip) |
| Tablet WiFi | <1.2s | <1.8s | <2.5s | <200KB |
| Desktop     | <0.8s | <1.2s | <1.8s | <250KB |

### Lighthouse Scores (Target)
- **Performance:** 90+ (móvil), 95+ (desktop)
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 100
- **PWA:** 100

---

## 🎯 EXPERIENCIA POR DISPOSITIVO

### 📱 Móvil — "Rápido y enfocado"
**Filosofía:** Una tarea a la vez, scroll vertical, gestures naturales
- Entrenamiento con temporizador en pantalla completa
- Bottom nav siempre accesible
- Swipe para navegación entre ejercicios
- Pull-to-refresh en dashboards
- Teclado optimizado para inputs

### 📲 Tablet — "Productividad visual"
**Filosofía:** Más contexto visible, menos navegación
- Vista previa de ejercicios en sidebar
- Métricas y progreso simultáneos
- Chat del coach + entrenamiento side-by-side
- Grid de herramientas más denso

### 💻 Desktop — "Control total"
**Filosofía:** Poder, shortcuts, eficiencia máxima
- Sidebars permanentes (trainer)
- Command palette (Ctrl/Cmd+K)
- Multi-columna layouts
- Hover states informativos
- Keyboard navigation completa

---

## ✅ CHECKLIST FINAL PRE-LANZAMIENTO

### General
- [ ] Manifest.json configurado correctamente
- [ ] Service worker cachea assets críticos
- [ ] Íconos PWA en todos los tamaños (192×192, 512×512)
- [ ] Splash screens generados
- [ ] Meta tags Open Graph completos
- [ ] Favicon en todos los formatos

### Móvil
- [ ] Viewport meta tag correcto
- [ ] Touch-action CSS optimizado
- [ ] No hay zoom involuntario en inputs
- [ ] Bottom nav no oculta contenido
- [ ] Teclado nativo funciona bien

### Tablet
- [ ] Orientación landscape óptima
- [ ] Portrait también funcional
- [ ] Grids se adaptan correctamente
- [ ] No hay elementos cortados

### Desktop
- [ ] Sidebar colapsable (trainer)
- [ ] Shortcuts de teclado documentados
- [ ] Hover states en todas las interacciones
- [ ] Min/max width sensatos
- [ ] Ventana redimensionable sin breaks

### Performance
- [ ] Lighthouse > 90 en todos los dispositivos
- [ ] Imágenes optimizadas (WebP con fallback)
- [ ] Code splitting implementado
- [ ] Lazy loading en componentes pesados
- [ ] Bundle size < targets definidos

---

## 🎉 RESULTADO FINAL

**KINETIXFITT es una app moderna, rápida y hermosa en CUALQUIER dispositivo:**

✅ **Móvil:** Experiencia nativa, fluida, touch-optimized  
✅ **Tablet:** Balance perfecto de información y usabilidad  
✅ **Desktop:** Poder completo, shortcuts, multi-columna  
✅ **PWA:** Instalable, offline-ready, notificaciones push  

**No importa dónde esté el usuario, la experiencia es EXCEPCIONAL.**

---

**Documentado:** 12 de septiembre de 2026  
**Por:** Kiro AI  
**Para:** KinetixFitt Platform
