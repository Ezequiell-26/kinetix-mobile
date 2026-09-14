# Documentación de EZEQUIEL COACHING (KinetixFit)

## 📋 Descripción del Proyecto

EZEQUIEL COACHING es una plataforma integral de fitness y nutrición que conecta clientes con entrenadores personales. Ofrece seguimiento de entrenamientos, planes nutricionales, mensajería directa y análisis de progreso con IA.

## 🏗️ Arquitectura del Proyecto

### Monorepo con Turborepo

```
/apps
  /mobile       - Aplicación React Native (iOS/Android)
  /web          - Next.js 14 PWA (Web progresiva)
  /admin        - Dashboard para administradores
/packages
  /ui           - Componentes UI compartidos (Design System)
  /config       - Configuraciones TypeScript, ESLint, Tailwind
  /utils        - Funciones utilitarias
  /hooks        - Hooks personalizados
  /types        - Tipos TypeScript globales
  /services     - Servicios API, Firebase, Stripe
  /features     - Lógica de negocio modular
```

## 🚀 Tecnologías Utilizadas

### Frontend
- **Next.js 14** - Framework React con App Router
- **React Native** - Desarrollo móvil multiplataforma
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Zustand** - Gestión de estado global
- **Framer Motion** - Animaciones
- **Recharts** - Gráficos interactivos

### Backend & Servicios
- **Firebase** - Autenticación, Firestore, Storage
- **Stripe** - Procesamiento de pagos
- **Vercel** - Deploy y hosting

### Testing & Calidad
- **Vitest** - Tests unitarios
- **Cypress** - Tests E2E
- **ESLint** - Linting de código
- **Prettier** - Formateo automático

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o pnpm
- Cuenta de Firebase
- Variables de entorno configuradas

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Ezequiell-26/kinetixFitt-mobile-and-web.git
cd kinetixFitt-mobile-and-web
```

2. **Instalar dependencias**
```bash
npm install
# o
pnpm install
```

3. **Configurar variables de entorno**

Crear archivo `.env.local` en la raíz:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_key
STRIPE_SECRET_KEY=tu_stripe_secret
```

4. **Configurar Firebase**
   - Ir a [Firebase Console](https://console.firebase.google.com/)
   - Crear nuevo proyecto
   - Habilitar Authentication (Google y Email/Password)
   - Crear base de datos Firestore
   - Copiar credenciales al `.env.local`
   - Desplegar reglas de seguridad desde `FIREBASE_RULES.json`

5. **Ejecutar en desarrollo**
```bash
npm run dev
# o
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔐 Seguridad

### Validación de Datos
- Todos los inputs se validan con **Zod**
- Solo se permiten correos @gmail.com
- Contraseñas con requisitos de seguridad
- Sanitización contra XSS

### Reglas de Firestore
- Usuarios solo acceden a sus propios datos
- Trainers pueden ver datos de sus clientes
- Validación de estructura de datos
- Prevención de escritura no autorizada

### Autenticación
- Firebase Auth con Google OAuth
- Validación estricta de dominios
- Tokens JWT con expiración
- Sesiones persistentes seguras

## 🧪 Testing

### Ejecutar tests unitarios
```bash
npm run test
# o
pnpm test
```

### Ejecutar tests E2E
```bash
npm run test:e2e
# o
pnpm test:e2e
```

### Cobertura de código
```bash
npm run test:coverage
```

## 📱 Características Principales

### Para Clientes
- ✅ Login con Google (@gmail.com exclusivo)
- ✅ Dashboard personalizado con estadísticas
- ✅ Seguimiento de entrenamientos
- ✅ Registro nutricional con macros
- ✅ Fotos de progreso con comparador
- ✅ Mensajería directa con trainer
- ✅ Citas y reservas
- ✅ Notificaciones push
- ✅ Modo oscuro/claro
- ✅ Multi-idioma (ES/EN/PT)

### Para Trainers
- ✅ Gestión de clientes
- ✅ Creación de rutinas personalizadas
- ✅ Seguimiento de progreso de clientes
- ✅ Chat integrado
- ✅ Calendario de citas
- ✅ Analytics avanzados
- ✅ Exportación de datos

## 🎨 Design System

El proyecto utiliza un sistema de diseño unificado con:
- **Colores de marca**: Purple, Cyan, Rosa neón
- **Tipografía**: Inter (optimizada para web)
- **Componentes**: Botones, Cards, Inputs, Dialogs, etc.
- **Animaciones**: Framer Motion para transiciones suaves
- **Accesibilidad**: WCAG 2.1 AA compliant

## 🌐 Internacionalización

Soporte para 3 idiomas:
- 🇪🇸 Español (predeterminado)
- 🇺🇸 English
- 🇧🇷 Português

Los textos se cargan dinámicamente según la preferencia del usuario.

## 📊 Estado del Proyecto

### Completado ✅
- [x] Sistema de autenticación con Firebase
- [x] Gestión de estado con Zustand
- [x] Validaciones con Zod
- [x] Componentes UI completos
- [x] Error boundaries y manejo de errores
- [x] Skeleton loaders
- [x] Tests unitarios
- [x] Reglas de seguridad Firestore
- [x] Diseño responsive
- [x] Modo oscuro/claro
- [x] Internacionalización

### En Progreso 🚧
- [ ] Tests E2E completos
- [ ] Integración con wearables
- [ ] Modo offline avanzado
- [ ] Análisis de IA para progreso

### Pendiente 📋
- [ ] Documentación de API
- [ ] Manual de usuario completo
- [ ] Videos tutoriales

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propiedad de EZEQUIEL COACHING. Todos los derechos reservados.

## 📞 Soporte

Para soporte técnico o consultas:
- Email: soporte@ezequielcoaching.com
- Documentación: `/docs` folder
- Issues: GitHub Issues

---

**Última actualización:** Enero 2025  
**Versión:** 2.0.0  
**Estado:** Producción Ready ✅
