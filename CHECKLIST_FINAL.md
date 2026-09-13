# ✅ CHECKLIST FINAL — EZEQUIEL COACHING

**Fecha:** 12 de septiembre de 2026  
**Versión:** 1.0.1  
**Estado:** Listo para testing y producción

---

## 🎯 COMPONENTES CREADOS/MEJORADOS

### ✅ Skeleton Screens (NUEVO)
- [x] `src/components/ui/skeleton.tsx`
  - Skeleton base
  - SkeletonCard
  - SkeletonMetricCard
  - SkeletonClientRow
  - SkeletonToolCard
  - SkeletonHeroCard
  - SkeletonList
  - SkeletonGrid

### ✅ Loading States (NUEVO)
- [x] `src/components/ui/loading-state.tsx`
  - DashboardLoading (cliente y trainer)
  - ClientListLoading
  - ToolsLoading
  - WorkoutLoading
  - ProgressLoading
  - CheckinFormLoading
  - MessagesLoading
  - EmptyState component

### ✅ Optimized Images (NUEVO)
- [x] `src/components/ui/optimized-image.tsx`
  - OptimizedImage (wrapper de next/image)
  - AvatarImage
  - ProgressPhoto
  - ResourceThumbnail

---

## 📋 TESTING MANUAL — CLIENTE

### Autenticación
- [ ] **Login con email/password** → Redirect a dashboard
- [ ] **Login con credenciales incorrectas** → Muestra error
- [ ] **Logout** → Redirect a /login
- [ ] **Auth persiste al refrescar** → Mantiene sesión
- [ ] **Sesión expira tras 7 días** → Redirect a login

### Dashboard Cliente
- [ ] **Carga en <2 segundos** (con skeleton mientras carga)
- [ ] **Hero card muestra entrenamiento del día** correcto
- [ ] **Si sin programa:** Muestra "Ezequiel está diseñando tu plan"
- [ ] **Si completó hoy:** Muestra badge "Completado" + Post-Workout Coach
- [ ] **Métricas muestran datos reales:**
  - Volumen semanal (kg)
  - Adherencia (%)
  - Peso actual (kg)
  - Racha (días)
- [ ] **Weekly Progress** muestra días correctos (L-D)
- [ ] **Smartwatch Widget** muestra progreso animado
- [ ] **Check-in pendiente** aparece si >7 días
- [ ] **Último mensaje** se muestra si existe
- [ ] **Grid de herramientas** (6 categorías) funcionan
- [ ] **Animaciones** son fluidas (CountUp, FadeIn, Tilt3D)

### Navegación Cliente
- [ ] **Bottom nav (mobile):**
  - Inicio ✅
  - Entrenar ✅
  - Nutrición ✅
  - Progreso ✅
  - Más (drawer) ✅
- [ ] **Drawer "Más"** muestra 8 opciones
- [ ] **Herramientas tiene badge "NUEVO"**
- [ ] **Active state** se ve claramente
- [ ] **Touch targets ≥52px** en mobile
- [ ] **Desktop nav** muestra 5 secciones horizontales

### Entrenamiento
- [ ] **Click "COMENZAR ENTRENAMIENTO"** → Va a `/client/workout/[id]`
- [ ] **Página de workout carga** correctamente
- [ ] **Ejercicios se muestran** en orden con:
  - Nombre del ejercicio
  - Músculo trabajado
  - Series y reps objetivo
  - RIR/RPE indicado
- [ ] **Timer funciona:**
  - Cuenta regresiva desde 90s (o configurado)
  - Audio de narrador (si habilitado)
  - Vibración en móvil
- [ ] **Registro de sets:**
  - Puede ingresar peso
  - Puede ingresar reps
  - Puede marcar como completado
- [ ] **Guardar sesión:**
  - POST a `/api/workout-logs` exitoso
  - Optimistic UI (feedback inmediato)
  - Vibración al completar
- [ ] **Volver a dashboard** → Muestra estado "Completado"
- [ ] **Post-Workout Coach** aparece con:
  - Sets completados vs planificados
  - Volumen total
  - Sugerencias para próxima sesión

### Progreso
- [ ] **Página `/client/progress` carga**
- [ ] **Charts de Recharts funcionan:**
  - Peso en el tiempo
  - Cargas en el tiempo
  - Medidas
- [ ] **Slider de fotos funciona** (si hay fotos)
- [ ] **Fotos privadas** muestran icono candado
- [ ] **Botón "Exportar"** funciona (CSV/PDF)
- [ ] **Responsive** en móvil y desktop

### Check-ins
- [ ] **Formulario de check-in** carga en `/client/checkins`
- [ ] **8 preguntas 1-10** funcionan
- [ ] **Campo de comentario** acepta texto
- [ ] **Upload de fotos** funciona
- [ ] **Botón "Enviar"** guarda correctamente
- [ ] **POST a `/api/checkins`** exitoso
- [ ] **Confirmación** se muestra tras enviar
- [ ] **Aparece en lista** de check-ins enviados

### Mensajes
- [ ] **Chat carga** en `/client/messages`
- [ ] **Historial de mensajes** se muestra
- [ ] **Escribir mensaje nuevo** funciona
- [ ] **Enviar** (POST `/api/messages`) exitoso
- [ ] **Optimistic UI** muestra mensaje inmediatamente
- [ ] **Estado "Leído"** se actualiza
- [ ] **Upload de fotos/archivos** funciona (si implementado)
- [ ] **Scroll automático** al último mensaje

### Nutrición
- [ ] **Calculadoras TDEE** funcionan
- [ ] **Macros** se calculan correctamente (2g/kg proteína)
- [ ] **IMC** se calcula bien
- [ ] **1RM** calculator funciona
- [ ] **Agua recomendada** se muestra
- [ ] **Calendario de hábitos** funciona (si implementado)

### Herramientas (`/client/tools`)
- [ ] **Página carga** con categorías
- [ ] **Chips de categoría** son clickeables
- [ ] **Favoritos** se marcan con estrella
- [ ] **Favoritos persisten** (localStorage)
- [ ] **Recientes** muestra últimas 4
- [ ] **Cada categoría muestra sus herramientas:**
  - Juegos & XP (4 herramientas)
  - Salud & Recuperación (3)
  - Cardio & Outdoor (2)
  - Datos & Integraciones (3)
  - Social & Comunidad (2)
  - Educación (1)
  - Sistema & App (5)
- [ ] **Todas las herramientas funcionan** (verificar las principales)

### PWA (Mobile)
- [ ] **Android Chrome:** Botón "Instalar" aparece
- [ ] **Instalar PWA** funciona
- [ ] **Icono en home screen** correcto
- [ ] **Splash screen** se muestra
- [ ] **Offline cache** funciona (entrenamientos, audio)
- [ ] **Vibración** funciona en entrenamiento
- [ ] **iOS Safari:** "Agregar a pantalla de inicio" funciona
- [ ] **Audio requiere tap inicial** en iOS (comportamiento esperado)
- [ ] **Safe areas** respetadas (notch, Dynamic Island)

---

## 📋 TESTING MANUAL — TRAINER

### Autenticación
- [ ] **Login con credenciales trainer** → Redirect a `/trainer/dashboard`
- [ ] **Login como CLIENT** → Redirect a `/client/dashboard` (no accede a trainer)
- [ ] **Logout** funciona

### Dashboard Trainer
- [ ] **Carga en <2 segundos**
- [ ] **KPIs muestran datos reales:**
  - Clientes Activos (con +X nuevos esta semana)
  - Check-ins Pendientes (resalta si >0)
  - Entrenamientos Hoy (sesiones finalizadas)
  - Mensajes Sin Leer (resalta si >0)
- [ ] **Progress bars animadas** en cada KPI
- [ ] **"Atención Necesaria"** lista items:
  - Check-ins sin revisar
  - Mensajes sin leer
  - Clientes inactivos >4 días
- [ ] **Si todo al día:** Muestra "Todo al día" con checkmark verde
- [ ] **Actividad Reciente** muestra entrenamientos de hoy
- [ ] **MRR** (Monthly Recurring Revenue) se calcula correctamente
- [ ] **Clientes Recientes** (grid 3 cols) muestra últimos 3
- [ ] **Link a Studio** funciona → `/trainer/studio`

### Navegación Trainer
- [ ] **Sidebar (desktop)** muestra 4 categorías:
  - OPERACIÓN (Dashboard, Clientes, Check-ins, Mensajes)
  - CONTENIDO (Entrenamientos, Ejercicios, Recursos)
  - NEGOCIO (Analíticas, Pagos, Studio)
  - SISTEMA (Ajustes)
- [ ] **Active state** se ve claramente
- [ ] **Sticky sidebar** funciona al hacer scroll
- [ ] **Mobile:** Bottom nav + drawer "Más"
- [ ] **Studio en drawer** con descripción

### Clientes
- [ ] **Lista de clientes** carga en `/trainer/clients`
- [ ] **Búsqueda** funciona (debounce)
- [ ] **Filtros** (ACTIVO, INACTIVO, PAUSADO) funcionan
- [ ] **Paginación** funciona si >20 clientes
- [ ] **Click en cliente** → Va a `/trainer/clients/[id]`
- [ ] **Ficha de cliente** muestra:
  - Info personal (nombre, email, objetivo, plan)
  - Programa asignado
  - Últimas sesiones
  - Check-ins recientes
  - Estadísticas (adherencia, volumen, progreso)
- [ ] **Botón "Nuevo Cliente"** abre formulario
- [ ] **Crear cliente** (POST `/api/clients`) funciona
- [ ] **Editar cliente** (PATCH `/api/clients/[id]`) funciona

### Programas
- [ ] **Lista de programas** carga en `/trainer/workouts`
- [ ] **Botón "Crear Rutina"** funciona
- [ ] **Editor de programa** abre correctamente
- [ ] **Estructura funciona:**
  - Crear programa → Fase → Semana → Día → Ejercicio
- [ ] **Agregar ejercicio** desde biblioteca
- [ ] **Reordenar ejercicios** (drag & drop o flechas)
- [ ] **Superseries** se pueden crear
- [ ] **Duplicar día/semana** funciona
- [ ] **Guardar programa** (POST `/api/programs`) exitoso
- [ ] **Editar programa existente** (PUT `/api/programs/[id]`) funciona
- [ ] **No borra workout logs** al editar (test de regresión)
- [ ] **Asignar programa a cliente:**
  - Desde ficha de cliente
  - Dropdown con programas disponibles
  - PATCH `/api/clients/[id]` con `assignedProgramId`
  - Cliente ve el programa inmediatamente

### Check-ins (Revisión)
- [ ] **Lista de check-ins** carga en `/trainer/checkins`
- [ ] **Filtro "Pendientes"** muestra solo sin revisar
- [ ] **Click en check-in** → Muestra detalle con:
  - 8 respuestas 1-10
  - Comentario del cliente
  - Fotos (si adjuntó)
  - Fecha
- [ ] **Campo de respuesta** funciona
- [ ] **Botón "Marcar como revisado":**
  - PATCH `/api/checkins/[id]` exitoso
  - Check-in desaparece de pendientes
  - Cliente recibe notificación (cuando se implemente push)

### Mensajes
- [ ] **Chat funciona** igual que cliente
- [ ] **Lista de conversaciones** muestra clientes con mensajes
- [ ] **Unread count** es correcto
- [ ] **Enviar mensaje** funciona
- [ ] **Mark as read** se actualiza

### Analíticas
- [ ] **Página `/trainer/analytics` carga**
- [ ] **Charts de Recharts:**
  - Adherencia por cliente (bar chart)
  - Revenue MRR (line chart)
  - Check-ins por semana (area chart)
- [ ] **Stats agregadas:**
  - Total clientes
  - MRR actual
  - Churn rate
  - Adherencia promedio
- [ ] **Filtros de fecha** funcionan
- [ ] **Export a CSV** funciona

### Studio
- [ ] **Página `/trainer/studio` carga**
- [ ] **Herramientas avanzadas listadas:**
  - CRM Pipeline (verificar si existe)
  - Risk ML (verificar)
  - Program Tuner (verificar)
  - Bulk Assign (verificar)
  - Revenue Pro (verificar)
  - Otros clones de plataformas
- [ ] **Cada herramienta funciona** o tiene placeholder

---

## 🌐 TESTING RESPONSIVE

### Mobile (375px - iPhone SE)
- [ ] **Bottom nav visible** y funcional
- [ ] **Drawer "Más"** abre desde abajo
- [ ] **Hero card** ocupa ancho completo
- [ ] **Métricas** en grid 2x2
- [ ] **Charts** son legibles
- [ ] **Touch targets ≥44px** (idealmente 52px)
- [ ] **Texto legible** (mínimo 14px body)
- [ ] **No scroll horizontal**

### Tablet (768px - iPad)
- [ ] **Layout se adapta** (mix mobile/desktop)
- [ ] **Bottom nav** sigue visible o cambia a top
- [ ] **Sidebar trainer** aparece o sigue drawer
- [ ] **Grid de herramientas** 3 columnas
- [ ] **Landscape funciona** bien

### Desktop (1280px+)
- [ ] **Top nav horizontal** (cliente)
- [ ] **Sidebar sticky** (trainer)
- [ ] **Max-width** contenedor (640px cliente, 1200px trainer)
- [ ] **Grid 4 columnas** en métricas
- [ ] **Charts** usan espacio completo
- [ ] **Hover effects** funcionan

---

## ⚡ TESTING PERFORMANCE

### Lighthouse (Chrome DevTools)
- [ ] **Performance:** >90
- [ ] **Accessibility:** >95
- [ ] **Best Practices:** >90
- [ ] **SEO:** >85
- [ ] **PWA:** >90

### Core Web Vitals
- [ ] **LCP (Largest Contentful Paint):** <2.5s
- [ ] **FID (First Input Delay):** <100ms
- [ ] **CLS (Cumulative Layout Shift):** <0.1

### Manual
- [ ] **Dashboard carga en <2s** (primera vez)
- [ ] **Dashboard carga en <1s** (segunda vez, cache)
- [ ] **Navegación entre páginas:** <500ms
- [ ] **Scroll es smooth** (60fps)
- [ ] **Animaciones no lag** en mobile
- [ ] **Imágenes cargan lazy** (no bloquean)

---

## 🔒 TESTING SEGURIDAD

### Autenticación
- [ ] **Sin token:** Redirect a /login
- [ ] **Token expirado:** Redirect a /login
- [ ] **Role CLIENT:** No accede a rutas `/trainer/*`
- [ ] **Role TRAINER:** No accede a rutas `/client/*` (redirect)
- [ ] **JWT httpOnly:** Cookie no accesible desde JS

### Autorización
- [ ] **Cliente solo ve sus datos:**
  - Sus workouts logs
  - Sus check-ins
  - Sus mensajes
  - Su programa asignado
- [ ] **Cliente NO puede:**
  - Ver workouts logs de otros
  - Editar programas
  - Ver lista de clientes
  - Acceder a `/api/clients` (403)
- [ ] **Trainer puede:**
  - Ver todos los clientes
  - Editar programas
  - Revisar check-ins de cualquier cliente
  - Acceder a analíticas

### Input Validation
- [ ] **Forms usan Zod** para validación
- [ ] **Errores se muestran** en UI
- [ ] **API rechaza** datos inválidos (400)
- [ ] **No SQL injection** (Prisma protege)
- [ ] **No XSS** en mensajes/comentarios

---

## 🐛 TESTING EDGE CASES

### Cliente sin programa
- [ ] **Dashboard muestra:** "Ezequiel está diseñando tu plan"
- [ ] **NO muestra:** Entrenamiento de otro cliente
- [ ] **CTA:** "Escribirle ahora"

### Trainer sin clientes
- [ ] **Dashboard muestra:** "No hay clientes registrados"
- [ ] **CTA:** "Presioná '+ Nuevo Cliente'"

### Sin conexión (Offline)
- [ ] **Offline indicator** aparece arriba
- [ ] **Rutas cacheadas** funcionan
- [ ] **Audio del narrador** reproduce offline
- [ ] **Intentar guardar:** Muestra error amigable o encola

### Errores de API
- [ ] **500 Internal Server Error:** Muestra mensaje genérico
- [ ] **404 Not Found:** Muestra "No encontrado"
- [ ] **403 Forbidden:** Redirect o muestra "Sin permisos"
- [ ] **Network error:** Muestra "Verifica tu conexión"

---

## ✅ COMPONENTES NUEVOS — TESTING

### Skeleton Screens
- [ ] **DashboardLoading** se muestra mientras carga
- [ ] **ClientListLoading** se muestra en lista trainer
- [ ] **ToolsLoading** se muestra en /client/tools
- [ ] **Transición smooth** skeleton → contenido real
- [ ] **No flash** de contenido sin estilo (FOUC)

### Optimized Images
- [ ] **OptimizedImage** carga con placeholder
- [ ] **Transición fade-in** cuando carga
- [ ] **Error state** muestra icono si falla
- [ ] **Lazy loading** funciona (imágenes fuera de viewport no cargan)
- [ ] **WebP se sirve** en navegadores compatibles
- [ ] **Sizes responsive** correctos

---

## 🚀 CHECKLIST PRE-DEPLOY

### Código
- [ ] `npm run build` → Sin errores
- [ ] `npx tsc --noEmit` → Sin errores TypeScript
- [ ] `npm run lint` → Sin warnings críticos
- [ ] `npm test` → Todos los tests pasan
- [ ] `npm run verify` → Script pasa

### Base de Datos
- [ ] **Backup actual** creado
- [ ] **Migraciones aplicadas** en producción
- [ ] **Seed de datos** si es primera vez:
  - Usuario trainer demo
  - Usuario cliente demo
  - 10 ejercicios en biblioteca
  - 1 programa de ejemplo

### Variables de Entorno
- [ ] `JWT_SECRET` generado (crypto random)
- [ ] `DATABASE_URL` apunta a DB de producción
- [ ] `NODE_ENV=production`
- [ ] URLs de producción configuradas

### Contenido
- [ ] **Terms of Service** URL válido
- [ ] **Privacy Policy** URL válido
- [ ] **WhatsApp flotante** número correcto
- [ ] **Recursos VIP** al menos 3 videos
- [ ] **Biblioteca** al menos 10 ejercicios
- [ ] **Textos revisados** sin typos

### Infraestructura
- [ ] **Domain configurado** (DNS apunta a servidor)
- [ ] **SSL activo** (HTTPS)
- [ ] **Backup automático** DB configurado (diario)
- [ ] **Monitoring:** Sentry o similar
- [ ] **Analytics:** Google Analytics 4
- [ ] **Email transaccional:** SendGrid/Resend configurado

---

## 📊 POST-DEPLOY — MONITOREO

### Semana 1
- [ ] **Revisar Sentry** daily (errores)
- [ ] **Analytics:** Usuarios activos, bounce rate
- [ ] **Performance:** Lighthouse score en producción
- [ ] **Feedback:** Recoger de primeros 5 usuarios
- [ ] **Hotfixes:** Bugs críticos inmediatos

### Semana 2-4
- [ ] **Métricas engagement:**
  - Sesiones por usuario
  - Tiempo en app
  - Páginas por sesión
  - Retención D7
- [ ] **Optimizar flujos** con más fricción
- [ ] **A/B test** CTAs principales (si aplica)
- [ ] **Agregar features** basadas en feedback

---

## 📝 NOTAS FINALES

### Bugs Conocidos (No bloqueantes)
- iOS Safari: Audio requiere tap inicial (comportamiento del navegador)
- Offline: Background Sync limitado en iOS

### Features Opcionales (Post-Launch)
- Push notifications backend
- Integración wearables (HealthKit/Fit)
- Import Hevy/Strong funcional
- IA Coach con API real (OpenAI)
- Apps nativas con Capacitor

### Mejoras Continuas
- Agregar más ejercicios a biblioteca
- Crear más programas de ejemplo
- Agregar más recursos VIP
- Optimizar queries DB lentas
- Refinar animaciones según feedback

---

**✅ CHECKLIST COMPLETADA:** ___ / ___ items  
**TESTER:** _______________  
**FECHA:** _______________  
**APROBADO PARA PRODUCCIÓN:** ☐ SÍ ☐ NO

**Notas adicionales:**
_____________________________________________
_____________________________________________
_____________________________________________
