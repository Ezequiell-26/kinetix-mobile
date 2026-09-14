# ✅ CHECKLIST DE TESTING FINAL — KINETIXFITT

**Fecha:** 12 de septiembre de 2026  
**Versión:** 1.0 (Pre-lanzamiento)  
**Tiempo estimado:** 4-5 horas de testing exhaustivo

---

## 🎯 OBJETIVO

Verificar que TODA la app funciona perfectamente en:
- ✅ Móvil (iOS/Android)
- ✅ Tablet (iPad/Android tablets)
- ✅ Desktop (Windows/Mac/Linux)
- ✅ PWA (instalada)

---

## 📋 ESTRUCTURA DEL TESTING

```
1. AUTENTICACIÓN (15 min)
2. CLIENTE — FLUJO COMPLETO (60 min)
3. TRAINER — FLUJO COMPLETO (90 min)
4. NAVEGACIÓN Y UI (30 min)
5. PERFORMANCE (20 min)
6. PWA Y OFFLINE (30 min)
7. RESPONSIVE (45 min)
8. ACCESSIBILITY (30 min)
```

---

## 1. 🔐 AUTENTICACIÓN (15 min)

### Login
- [ ] Abrir `/auth/login`
- [ ] Ingresar credenciales válidas
- [ ] Verificar redirect correcto (cliente → `/client/dashboard`, trainer → `/trainer/dashboard`)
- [ ] Verificar que el nombre aparece en la UI
- [ ] Probar "Recordarme" (checkbox)
- [ ] Cerrar sesión y verificar que no hay acceso a rutas protegidas

### Login con Errores
- [ ] Probar credenciales incorrectas → Ver mensaje de error
- [ ] Probar email inválido → Ver validación
- [ ] Probar dejar campos vacíos → Ver validación
- [ ] Verificar que no hay console errors

### Registro
- [ ] Abrir `/auth/register`
- [ ] Completar formulario de registro
- [ ] Verificar validación de email
- [ ] Verificar validación de contraseña (mínimo 8 caracteres)
- [ ] Registrar usuario nuevo
- [ ] Verificar redirect a dashboard
- [ ] Verificar que se crea el perfil correctamente

### Recovery
- [ ] Abrir `/auth/recovery`
- [ ] Ingresar email válido
- [ ] Verificar mensaje de confirmación
- [ ] (Opcional) Verificar que llegó el email

---

## 2. 👤 CLIENTE — FLUJO COMPLETO (60 min)

### Dashboard (10 min)
- [ ] Login como cliente
- [ ] Verificar saludo personalizado con nombre
- [ ] Verificar fecha y objetivo mostrados
- [ ] Verificar hero card del entrenamiento de hoy
  - [ ] Nombre del workout correcto
  - [ ] Ejercicios (mínimo 3 visibles)
  - [ ] Estimación de tiempo
  - [ ] Botón "COMENZAR ENTRENAMIENTO" funciona
- [ ] Verificar rail semanal
  - [ ] Días de la semana correctos (L-D)
  - [ ] Sesiones completadas marcadas (✓)
  - [ ] Progreso X/Y sesiones
  - [ ] Racha visible
- [ ] Verificar smartwatch widget
  - [ ] Progreso del día
  - [ ] Calorías/Steps
- [ ] Verificar métricas (4 cards)
  - [ ] Volumen semanal (kg)
  - [ ] Adherencia (%)
  - [ ] Peso (kg)
  - [ ] Racha (días)
  - [ ] Números correctos (no placeholder)
- [ ] Verificar sección "Pendiente esta semana"
  - [ ] Check-in semanal (si aplica)
  - [ ] Mensaje de Ezequiel (si aplica)
- [ ] Verificar Coach IA
  - [ ] Input funciona
  - [ ] Enviar mensaje de prueba
  - [ ] Respuesta aparece
- [ ] Verificar "Explorá todo"
  - [ ] 6 categorías visibles
  - [ ] Íconos correctos
  - [ ] Click lleva a `/client/tools?cat=X`

### Entrenar — Workout (15 min)
- [ ] Click en "COMENZAR ENTRENAMIENTO" desde dashboard
- [ ] Verificar página `/client/workout/[id]`
- [ ] Header del workout
  - [ ] Nombre correcto
  - [ ] Descripción
  - [ ] Botón de pausa/reanudar
  - [ ] Timer visible
- [ ] Lista de ejercicios
  - [ ] Todos los ejercicios del workout visibles
  - [ ] Imágenes de ejercicios cargan
  - [ ] Sets y reps correctos
  - [ ] RIR visible
  - [ ] Peso recomendado (si aplica)
- [ ] Registrar una serie
  - [ ] Click en botón "Registrar serie"
  - [ ] Modal/form aparece
  - [ ] Ingresar peso y reps
  - [ ] Guardar
  - [ ] Verificar que se marca como completada (✓)
- [ ] Contador de reps (si hay)
  - [ ] Botones +/- funcionan
  - [ ] Contador se actualiza
  - [ ] Al llegar al target → motivación de voz (si está habilitado)
- [ ] Timer de descanso
  - [ ] Inicia automáticamente después de serie
  - [ ] Cuenta regresiva funciona
  - [ ] Avisos de voz (si está habilitado)
  - [ ] Botón skip funciona
- [ ] Voice Coach panel (si está visible)
  - [ ] Botón mute/unmute funciona
  - [ ] Settings abre modal
  - [ ] Configuraciones se guardan
- [ ] Completar workout
  - [ ] Completar todas las series
  - [ ] Verificar mensaje de finalización
  - [ ] Botón "Finalizar sesión"
  - [ ] Verificar redirect a dashboard
  - [ ] Verificar que workout aparece como completado en dashboard

### Progreso (10 min)
- [ ] Ir a `/client/progress`
- [ ] Verificar tabs (Peso, Cargas, Medidas, Fotos)
- [ ] Tab "Peso"
  - [ ] Gráfico de peso visible
  - [ ] Datos correctos
  - [ ] Botón "Agregar medición" funciona
  - [ ] Formulario se abre
  - [ ] Ingresar peso nuevo
  - [ ] Guardar
  - [ ] Verificar que aparece en el gráfico
- [ ] Tab "Cargas"
  - [ ] Lista de ejercicios con récords
  - [ ] Filtros funcionan
  - [ ] Datos correctos
- [ ] Tab "Medidas"
  - [ ] Circunferencias visibles
  - [ ] Botón "Nueva medición" funciona
  - [ ] Formulario completo
  - [ ] Guardar y verificar
- [ ] Tab "Fotos"
  - [ ] Galería de fotos
  - [ ] Upload funciona
  - [ ] Preview aparece
  - [ ] Modal/lightbox al hacer click

### Nutrición (5 min)
- [ ] Ir a `/client/nutrition`
- [ ] Verificar plan nutricional (si existe)
- [ ] Verificar macros del día
- [ ] Verificar comidas sugeridas
- [ ] Botón "Registrar comida" funciona

### Check-ins (10 min)
- [ ] Ir a `/client/checkins`
- [ ] Verificar historial de check-ins
- [ ] Botón "Nuevo check-in"
- [ ] Formulario completo
  - [ ] Todas las preguntas visibles
  - [ ] Sliders funcionan
  - [ ] Textarea para comentarios
  - [ ] Upload de fotos funciona
- [ ] Enviar check-in
- [ ] Verificar confirmación
- [ ] Verificar que aparece en historial
- [ ] Abrir check-in anterior
  - [ ] Ver detalles completos
  - [ ] Ver respuesta de Ezequiel (si existe)

### Mensajes (5 min)
- [ ] Ir a `/client/messages`
- [ ] Verificar historial de conversaciones
- [ ] Abrir conversación con Ezequiel
- [ ] Enviar mensaje nuevo
- [ ] Verificar que aparece en el chat
- [ ] Verificar que se marca como enviado (✓)
- [ ] Verificar scroll automático al último mensaje

### Herramientas (5 min)
- [ ] Ir a `/client/tools`
- [ ] Verificar 6 categorías visibles
  - [ ] Gamificación
  - [ ] Salud
  - [ ] Cardio
  - [ ] Datos
  - [ ] Social
  - [ ] Sistema
- [ ] Click en cada categoría
- [ ] Verificar herramientas filtradas
- [ ] Verificar búsqueda funciona
- [ ] Verificar favoritos (⭐)
  - [ ] Marcar herramienta como favorita
  - [ ] Verificar que aparece en "Favoritas"
  - [ ] Desmarcar favorita

---

## 3. 💼 TRAINER — FLUJO COMPLETO (90 min)

### Dashboard (15 min)
- [ ] Login como trainer
- [ ] Verificar header
  - [ ] "Panel del Entrenador"
  - [ ] Marca: KINETIXFITT
  - [ ] Botones "+ Nuevo Cliente" y "Crear Rutina"
- [ ] Verificar KPIs (4 cards)
  - [ ] Clientes Activos (número real)
  - [ ] Check-ins Pendientes (número real)
  - [ ] Entrenamientos Hoy (número real)
  - [ ] Mensajes Sin Leer (número real)
  - [ ] Barras de progreso animadas
- [ ] Verificar "Atención Necesaria"
  - [ ] Check-ins pendientes listados
  - [ ] Mensajes sin responder listados
  - [ ] Clientes inactivos listados
  - [ ] Badges correctos (color y texto)
  - [ ] Click en cada item lleva a la página correcta
- [ ] Verificar "Actividad Reciente"
  - [ ] Workouts de hoy listados
  - [ ] Nombres de clientes correctos
  - [ ] Duración visible
  - [ ] MRR mostrado
  - [ ] Total de clientes mostrado
- [ ] Verificar "Clientes Recientes"
  - [ ] 3 clientes visibles
  - [ ] Avatares (iniciales o foto)
  - [ ] Email visible
  - [ ] Badges de estado (ACTIVO/INACTIVO)
  - [ ] Badge de plan (BÁSICO/PREMIUM)
  - [ ] Click lleva a `/trainer/clients/[id]`
- [ ] Verificar link a Studio
  - [ ] Click lleva a `/trainer/studio`

### Clientes (20 min)

#### Lista de Clientes
- [ ] Ir a `/trainer/clients`
- [ ] Verificar tabla/grid de clientes
  - [ ] Todos los clientes visibles
  - [ ] Columnas correctas (Nombre, Email, Estado, Plan, Última sesión)
  - [ ] Ordenamiento funciona
  - [ ] Búsqueda funciona
- [ ] Filtros
  - [ ] Filtrar por estado (Activo/Inactivo)
  - [ ] Filtrar por plan (Básico/Premium/Elite)
  - [ ] Limpiar filtros

#### Crear Cliente
- [ ] Click en "+ Nuevo Cliente"
- [ ] Ir a `/trainer/clients/new`
- [ ] Formulario completo
  - [ ] Nombre (requerido)
  - [ ] Email (requerido + validación)
  - [ ] Teléfono
  - [ ] Fecha de nacimiento
  - [ ] Género
  - [ ] Peso inicial
  - [ ] Altura
  - [ ] Objetivo (dropdown)
  - [ ] Plan (dropdown)
- [ ] Validaciones funcionan
- [ ] Guardar cliente
- [ ] Verificar redirect a ficha del cliente
- [ ] Verificar que aparece en lista de clientes

#### Ficha de Cliente
- [ ] Abrir cliente existente `/trainer/clients/[id]`
- [ ] Tabs visibles
  - [ ] Resumen
  - [ ] Programa
  - [ ] Historial
  - [ ] Check-ins
  - [ ] Mensajes
  - [ ] Mediciones
- [ ] Tab "Resumen"
  - [ ] Info del cliente completa
  - [ ] Métricas clave
  - [ ] Botón "Editar información"
  - [ ] Botón "Asignar programa"
  - [ ] Actividad reciente
- [ ] Tab "Programa"
  - [ ] Programa asignado visible (si existe)
  - [ ] Semanas del programa
  - [ ] Workouts por día
  - [ ] Botón "Cambiar programa"
  - [ ] Modal de selección funciona
  - [ ] Asignar nuevo programa
  - [ ] Verificar que se actualiza
- [ ] Tab "Historial"
  - [ ] Workouts completados listados
  - [ ] Fechas correctas
  - [ ] Duración visible
  - [ ] Click en workout abre detalle
  - [ ] Detalle muestra series completadas
- [ ] Tab "Check-ins"
  - [ ] Check-ins del cliente visibles
  - [ ] Pendientes marcados
  - [ ] Revisados marcados
  - [ ] Abrir check-in
  - [ ] Ver respuestas completas
  - [ ] Botón "Responder"
  - [ ] Textarea para respuesta
  - [ ] Enviar respuesta
  - [ ] Verificar que se marca como revisado
- [ ] Tab "Mediciones"
  - [ ] Historial de peso
  - [ ] Gráfico de peso
  - [ ] Mediciones antropométricas
  - [ ] Fotos de progreso (si existen)

### Programas (15 min)

#### Lista de Programas
- [ ] Ir a `/trainer/programs`
- [ ] Verificar lista de programas
- [ ] Botón "+ Nuevo Programa"

#### Crear Programa
- [ ] Click en "+ Nuevo Programa"
- [ ] Ir a `/trainer/programs/new`
- [ ] Formulario de programa
  - [ ] Nombre (requerido)
  - [ ] Descripción
  - [ ] Duración (semanas)
  - [ ] Frecuencia (sesiones/semana)
  - [ ] Nivel (principiante/intermedio/avanzado)
  - [ ] Objetivo (dropdown)
- [ ] Botón "Agregar semana"
  - [ ] Click agrega semana 1
  - [ ] Botón "Agregar día" dentro de semana
  - [ ] Click agrega día 1
  - [ ] Form de workout del día
    - [ ] Nombre del workout
    - [ ] Descripción
    - [ ] Estimación de tiempo
- [ ] Botón "Agregar ejercicio"
  - [ ] Modal de búsqueda de ejercicios
  - [ ] Búsqueda funciona
  - [ ] Seleccionar ejercicio
  - [ ] Configurar sets, reps, RIR
  - [ ] Guardar ejercicio
  - [ ] Verificar que aparece en lista
- [ ] Agregar varios ejercicios (mínimo 5)
- [ ] Botón "Guardar programa"
- [ ] Verificar redirect a lista de programas
- [ ] Verificar que programa nuevo aparece

#### Editar Programa
- [ ] Abrir programa existente `/trainer/programs/[id]`
- [ ] Verificar estructura completa
  - [ ] Semanas
  - [ ] Días (workouts)
  - [ ] Ejercicios
- [ ] Botón "Editar"
- [ ] Modificar nombre del programa
- [ ] Modificar ejercicio (cambiar sets/reps)
- [ ] Eliminar ejercicio
- [ ] Agregar nuevo ejercicio
- [ ] Guardar cambios
- [ ] Verificar que se actualizó

### Rutinas/Workouts (10 min)
- [ ] Ir a `/trainer/workouts`
- [ ] Verificar lista de workouts standalone
- [ ] Botón "+ Nueva Rutina"
- [ ] Crear workout rápido
  - [ ] Nombre
  - [ ] Seleccionar ejercicios (biblioteca)
  - [ ] Configurar series y reps
  - [ ] Guardar
- [ ] Verificar que aparece en lista
- [ ] Asignar workout a cliente (como sesión standalone)

### Check-ins (10 min)
- [ ] Ir a `/trainer/checkins`
- [ ] Verificar lista de check-ins
- [ ] Filtros
  - [ ] Pendientes
  - [ ] Revisados
  - [ ] Todos
- [ ] Abrir check-in pendiente
- [ ] Revisar respuestas completas
- [ ] Textarea para respuesta del trainer
- [ ] Enviar respuesta
- [ ] Verificar que se marca como revisado
- [ ] Verificar notificación al cliente (opcional)

### Mensajes (10 min)
- [ ] Ir a `/trainer/messages`
- [ ] Verificar lista de conversaciones
  - [ ] Clientes con mensajes
  - [ ] Último mensaje preview
  - [ ] Badge de sin leer (número)
- [ ] Abrir conversación
- [ ] Verificar historial completo
- [ ] Enviar mensaje nuevo
- [ ] Verificar que aparece en el chat
- [ ] Verificar que se marca como enviado (✓)
- [ ] Verificar que contador de sin leer se actualiza

### Reportes/Analytics (5 min)
- [ ] Ir a `/trainer/reports`
- [ ] Verificar gráficos
  - [ ] Adherencia semanal
  - [ ] Clientes activos vs inactivos
  - [ ] Ingresos (MRR/ARR)
  - [ ] Check-ins completados
- [ ] Filtros de fecha funcionan
- [ ] Exportar reporte (si está disponible)

### Studio (5 min)
- [ ] Ir a `/trainer/studio`
- [ ] Verificar 4 secciones
  - [ ] CRM y Retención
  - [ ] Programación Masiva
  - [ ] Kits de Plataformas
  - [ ] Negocio
- [ ] Click en cada sección
- [ ] Verificar que abre herramientas correspondientes

---

## 4. 🧭 NAVEGACIÓN Y UI (30 min)

### Navegación Cliente
- [ ] Bottom navigation visible en móvil
  - [ ] 5 tabs: Inicio, Entrenar, Nutrición, Progreso, Más
  - [ ] Active state correcto
  - [ ] Click cambia de página
- [ ] Drawer "Más"
  - [ ] Swipe o click abre drawer
  - [ ] Links correctos (Herramientas, Mensajes, Perfil, etc.)
  - [ ] Badge "NUEVO" en Herramientas
  - [ ] Close funciona
- [ ] Desktop navigation (si aplica)
  - [ ] Top bar horizontal
  - [ ] Dropdown de perfil funciona
  - [ ] Logout funciona

### Navegación Trainer
- [ ] Sidebar visible en desktop
  - [ ] Categorías: Operación, Contenido, Negocio, Sistema
  - [ ] Links correctos bajo cada categoría
  - [ ] Active state correcto
  - [ ] Collapse/expand funciona
- [ ] Móvil: hamburger menu
  - [ ] Click abre drawer
  - [ ] Misma estructura que sidebar
  - [ ] Close funciona
- [ ] Perfil dropdown
  - [ ] Click abre menú
  - [ ] Opciones visibles (Perfil, Config, Logout)
  - [ ] Logout funciona

### Command Palette (si está implementado)
- [ ] Presionar Ctrl+K (Windows/Linux) o Cmd+K (Mac)
- [ ] Modal de búsqueda aparece
- [ ] Buscar "clientes" → resultados correctos
- [ ] Buscar "workout" → resultados correctos
- [ ] Enter selecciona resultado y navega
- [ ] Esc cierra modal

### Breadcrumbs (si están)
- [ ] Verificar en páginas profundas
- [ ] Click en breadcrumb navega correctamente

---

## 5. ⚡ PERFORMANCE (20 min)

### Lighthouse Audit
- [ ] Abrir Chrome DevTools
- [ ] Tab "Lighthouse"
- [ ] Seleccionar "Mobile" + "Performance"
- [ ] Run audit en dashboard cliente
  - [ ] Performance > 85
  - [ ] FCP < 2s
  - [ ] LCP < 3s
  - [ ] CLS < 0.1
- [ ] Run audit en dashboard trainer
  - [ ] Performance > 85
- [ ] Run audit en móvil real (si es posible)

### Prueba en Slow 3G
- [ ] DevTools → Network → Slow 3G
- [ ] Navegar a dashboard
- [ ] Verificar que skeleton aparece instantáneo
- [ ] Verificar que contenido carga progresivamente
- [ ] Verificar que no hay bloqueos de UI
- [ ] Verificar que imágenes lazy load

### Bundle Size
- [ ] Correr `npm run build`
- [ ] Verificar output de Next.js
- [ ] First Load JS < 200 KB (ideal)
- [ ] Route segments < 50 KB cada uno

### Imágenes
- [ ] DevTools → Network → Img
- [ ] Verificar que imágenes son WebP/AVIF
- [ ] Verificar que hay lazy loading
- [ ] Verificar responsive sizes (srcset)

---

## 6. 🌐 PWA Y OFFLINE (30 min)

### Instalación Móvil (iOS)
- [ ] Abrir en Safari (iPhone/iPad)
- [ ] Tap "Compartir" (ícono cuadrado con flecha)
- [ ] Tap "Agregar a pantalla de inicio"
- [ ] Verificar nombre "KinetixFitt"
- [ ] Verificar ícono de la app
- [ ] Tap en ícono en home screen
- [ ] App abre en fullscreen (sin barra de Safari)
- [ ] Navegación funciona
- [ ] Splash screen aparece (branded)

### Instalación Móvil (Android)
- [ ] Abrir en Chrome (Android)
- [ ] Banner de instalación aparece (o tap "⋮" → "Instalar app")
- [ ] Tap "Instalar"
- [ ] Verificar ícono en home screen
- [ ] Abrir app
- [ ] Fullscreen funciona
- [ ] Splash screen aparece

### Instalación Desktop
- [ ] Abrir en Chrome/Edge (Windows/Mac)
- [ ] Ícono "⊕" en barra de direcciones
- [ ] Click "Instalar KinetixFitt"
- [ ] App abre en ventana independiente
- [ ] Sin barra de navegación del browser
- [ ] Redimensionable
- [ ] Íconos en taskbar/dock

### Modo Offline
- [ ] Con app abierta, activar modo Airplane/Offline
- [ ] Navegar a dashboard → Debe cargar desde cache
- [ ] Navegar a otras páginas ya visitadas → Deben cargar
- [ ] Intentar acción que requiere red (ej: enviar mensaje)
  - [ ] Ver mensaje de "Sin conexión"
  - [ ] O queue automático para cuando vuelva conexión
- [ ] Reactivar conexión
- [ ] Verificar que datos se sincronizan

### Service Worker
- [ ] DevTools → Application → Service Workers
- [ ] Verificar que SW está activo
- [ ] Verificar que hay cache storage
- [ ] Cache "core-v1" existe
- [ ] Cache tiene archivos críticos (HTML, JS, CSS, fonts)

### Notificaciones Push (si están implementadas)
- [ ] Permitir notificaciones
- [ ] Simular notificación desde backend
- [ ] Verificar que aparece en sistema operativo
- [ ] Click en notificación abre la app

---

## 7. 📱 RESPONSIVE DESIGN (45 min)

### Móvil Portrait (375×667 - iPhone SE)
- [ ] Dashboard se ve bien
- [ ] Hero card ocupa ancho completo
- [ ] Métricas en grid 2×2
- [ ] Bottom nav visible y funcional
- [ ] Touch targets > 44px
- [ ] No hay scroll horizontal
- [ ] Formularios son usables
- [ ] Teclado no oculta botones importantes

### Móvil Landscape (667×375)
- [ ] Dashboard se adapta
- [ ] Navegación sigue funcionando
- [ ] No hay elementos cortados

### Tablet Portrait (768×1024 - iPad)
- [ ] Layout cambia a 2 columnas donde corresponda
- [ ] Navegación híbrida funciona
- [ ] Grids se expanden (3-4 columnas)
- [ ] Touch targets adecuados

### Tablet Landscape (1024×768)
- [ ] Layout óptimo
- [ ] Sidebar visible (trainer) o top nav (cliente)
- [ ] 3-columna layouts funcionan

### Desktop Small (1280×720)
- [ ] Sidebar permanente (trainer)
- [ ] Top navigation completa (cliente)
- [ ] Multi-columna layouts
- [ ] Hover effects funcionan

### Desktop Large (1920×1080)
- [ ] Contenido centrado (max-width)
- [ ] No hay elementos excesivamente estirados
- [ ] Imágenes no pixeladas

### Desktop Ultra-wide (2560×1440)
- [ ] Layout sigue funcionando
- [ ] Contenido no se pierde en los bordes

### Responsive en Tiempo Real
- [ ] Abrir DevTools → Toggle device toolbar
- [ ] Resize ventana fluidamente
- [ ] Verificar que no hay breaks en ningún punto
- [ ] Verificar que no hay layout shifts

---

## 8. ♿ ACCESSIBILITY (30 min)

### Navegación con Teclado
- [ ] Tab funciona (resalta elementos focusables)
- [ ] Shift+Tab retrocede
- [ ] Enter activa botones/links
- [ ] Esc cierra modales
- [ ] Foco visible (outline o ring)
- [ ] Orden lógico de foco

### Screen Reader (NVDA/VoiceOver)
- [ ] Activar screen reader
- [ ] Navegar por dashboard
- [ ] Labels de botones son descriptivos
- [ ] Imágenes tienen alt text
- [ ] Formularios tienen labels
- [ ] Errores se anuncian

### Contraste de Color
- [ ] Lighthouse → Accessibility
- [ ] Contrast ratio > 4.5:1 (AA)
- [ ] Verificar manualmente en textos pequeños

### Semantic HTML
- [ ] Inspeccionar elementos
- [ ] Usar tags correctos (`<button>`, `<nav>`, `<main>`, `<article>`)
- [ ] No abusar de `<div>`
- [ ] Headings jerárquicos (h1 → h2 → h3)

### ARIA Labels
- [ ] Elementos interactivos tienen aria-label
- [ ] Loading states tienen aria-live
- [ ] Modales tienen aria-modal

### Touch Targets
- [ ] Todos los botones > 44×44px
- [ ] Espaciado entre botones > 8px
- [ ] Fácil de tocar en móvil

---

## 9. 🐛 BUGS COMUNES A VERIFICAR (15 min)

### UI
- [ ] No hay elementos superpuestos
- [ ] No hay texto cortado
- [ ] No hay imágenes rotas
- [ ] No hay layout shifts al cargar
- [ ] Scrollbars no ocultan contenido
- [ ] Modales centran correctamente
- [ ] Tooltips no salen de pantalla

### Formularios
- [ ] Validación funciona
- [ ] Mensajes de error claros
- [ ] Submit no se puede hacer múltiple (doble click)
- [ ] Campos requeridos están marcados
- [ ] Autofocus en primer campo

### Data
- [ ] No hay datos hardcodeados (placeholder)
- [ ] Fechas en formato correcto (es-AR)
- [ ] Números con separadores correctos (1.234 no 1,234)
- [ ] Tiempo relativo funciona ("hace 2 horas")

### Console
- [ ] Abrir DevTools → Console
- [ ] No hay errores en rojo
- [ ] No hay warnings críticos
- [ ] No hay logs de debug en producción

---

## 10. 🚀 PRE-DEPLOY CHECKLIST (10 min)

### Configuración
- [ ] `.env.production` configurado correctamente
- [ ] Variables de entorno en Vercel/hosting
- [ ] Database URL correcta (producción)
- [ ] JWT_SECRET único y seguro
- [ ] NEXTAUTH_URL correcto

### Build
- [ ] `npm run build` sin errores
- [ ] TypeScript sin errores (`npm run type-check`)
- [ ] Linter sin errores (`npm run lint`)
- [ ] Tests pasan (si hay: `npm test`)

### SEO
- [ ] Meta tags en `layout.tsx`
- [ ] Open Graph images configurados
- [ ] Favicon en `/public`
- [ ] robots.txt configurado
- [ ] sitemap.xml generado

### Security
- [ ] Rate limiting implementado
- [ ] CORS configurado correctamente
- [ ] Helmet/security headers
- [ ] No hay secrets en el código
- [ ] No hay console.logs con datos sensibles

### Performance
- [ ] Bundle size < 200KB first load
- [ ] Imágenes optimizadas (WebP)
- [ ] Lazy loading implementado
- [ ] Code splitting funciona

---

## ✅ RESUMEN FINAL

### Criterios de Aprobación

**CRÍTICO (Must have):**
- [ ] Login/Registro funciona
- [ ] Dashboard carga sin errores
- [ ] Workout completo se puede ejecutar
- [ ] Check-in se puede enviar
- [ ] Trainer puede crear cliente y programa
- [ ] No hay console errors críticos
- [ ] Performance Lighthouse > 80

**IMPORTANTE (Should have):**
- [ ] PWA instalable
- [ ] Modo offline básico funciona
- [ ] Responsive en todos los dispositivos
- [ ] Accesibilidad básica (keyboard, contrast)
- [ ] Loading states funcionan

**NICE TO HAVE:**
- [ ] Notificaciones push
- [ ] Command palette
- [ ] Animations suaves
- [ ] Easter eggs

---

## 📊 TRACKING DE BUGS

### Template de Bug Report
```markdown
**Título:** [Descripción corta]
**Severidad:** Crítica / Alta / Media / Baja
**Pasos para reproducir:**
1. Ir a [página]
2. Hacer click en [elemento]
3. Resultado: [lo que pasó]

**Resultado esperado:** [lo que debería pasar]
**Screenshot/Video:** [adjuntar]
**Dispositivo:** [iPhone 13 Pro / Windows 11 Chrome]
**Versión:** [1.0.0]
```

---

## 🎉 CONCLUSIÓN

Una vez completado este checklist:
1. **Documentar todos los bugs encontrados**
2. **Priorizar: Críticos → Altos → Medios → Bajos**
3. **Fijar bugs críticos antes de deploy**
4. **Verificar que lighthouse scores están OK**
5. **Hacer testing final en dispositivos reales**
6. **Deploy a staging**
7. **Re-testing en staging**
8. **Deploy a producción** 🚀

---

**Tiempo total estimado:** 4-5 horas  
**Recomendación:** Hacerlo en 2 sesiones de 2.5h cada una  
**Best practice:** Tener 2 personas testeando en paralelo

---

**Creado:** 12 septiembre 2026  
**Para:** KinetixFitt  
**Versión:** 1.0 Pre-launch
