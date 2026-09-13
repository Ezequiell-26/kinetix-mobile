# KinetixFitt - AI Agent Operating System

## Reglas Permanentes para Agentes de IA

Este documento es la **fuente única de verdad** para cualquier agente de IA que trabaje en este repositorio.

---

## 🚫 REGLA DE ORO: NO FINGIR IMPLEMENTACIÓN

**NUNCA** digas que:
- "creaste" un archivo
- "implementaste" una función
- "arreglaste" un bug
- "migraste" código
- "completaste" una tarea

**A MENOS QUE** hayas físicamente:
1. Creado el archivo en el sistema de archivos
2. Modificado el código existente
3. Verificado que los cambios funcionan
4. Ejecutado tests y build exitosamente

Si solo analizaste o planeaste: **DÍLO EXPLÍCITAMENTE**.

---

## 📋 FLUJO DE TRABAJO OBLIGATORIO

Para CADA tarea, debes seguir este protocolo:

### 1. INSPECCIONAR (Antes de actuar)
```bash
# Verificar estado actual
git status
ls -la
# Inspeccionar archivos relevantes
cat <archivo-existente>
```

### 2. PLANIFICAR
- Identificar archivos a crear/modificar
- Verificar si ya existe funcionalidad similar (NO DUPLICAR)
- Definir dependencias necesarias

### 3. IMPLEMENTAR
- Crear archivos físicos reales
- Modificar código existente
- Actualizar imports/exports

### 4. VERIFICAR SISTEMA DE ARCHIVOS
```bash
# Confirmar que los archivos existen
ls -la <ruta-del-archivo>
cat <ruta-del-archivo> # Verificar contenido
```

### 5. VALIDAR CÓDIGO
```bash
# Type checking
npm run typecheck

# Lint
npm run lint

# Tests
npm run test

# Build
npm run build
```

### 6. REPORTAR RESULTADO REAL
- Archivos creados: [lista real]
- Archivos modificados: [lista real]
- Tests pasados: [número real]
- Errores encontrados: [si los hubo]
- Estado final: [ÉXITO/PARCIAL/FALLIDO]

---

## 🏗️ ARQUITECTURA DEL PROYECTO

```
kinetix-mobile/
├── apps/
│   ├── mobile/          # App móvil (React Native/Capacitor)
│   └── web/             # Dashboard web (Next.js)
├── packages/
│   ├── shared/          # Código compartido (tipos, utils, validadores)
│   ├── core/            # Core en Rust + WASM
│   └── config/          # Configuraciones compartidas
├── .ai/                 # Documentación de gobernanza IA
├── docs/                # Documentación del proyecto
└── infra/               # Infraestructura (Docker, K8s, Terraform)
```

### Límites Estrictos

- **UI**: Solo en `apps/`
- **Lógica de negocio**: En `packages/shared` o `packages/core`
- **Cálculos intensivos**: En `packages/core/rust` (Rust + WASM)
- **Configuración**: En `packages/config`
- **Infraestructura**: En `infra/`

---

## 🎨 IDENTIDAD DE MARCA

### Colores Oficiales
- **Electric Lime**: `#D6FF2A` (Color primario)
- **Deep Space**: `#09090B` (Fondo principal)

### Reglas de Diseño
1. Usar tokens de diseño centralizados
2. No crear colores arbitrarios
3. Mantener jerarquía visual clara
4. Respetar modo oscuro/claro

---

## ⚡ PERFORMANCE

### Objetivos
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **FPS en animaciones**: 60 FPS mínimo
- **Bundle size**: < 500KB inicial

### Estrategias
1. Lazy loading para componentes pesados (3D, gráficos)
2. Code splitting por rutas
3. Web Workers para cálculos intensivos
4. Rust + WASM para operaciones críticas

---

## 🔒 SEGURIDAD

### Reglas Absolutas
1. **NUNCA** commits secretos (.env, keys, tokens)
2. Validar TODOS los inputs del usuario
3. Usar HTTPS en producción
4. Implementar rate limiting
5. Encriptar datos sensibles (AES-256)
6. JWT con expiración corta

---

## 🧪 TESTING

### Cobertura Mínima
- Funciones críticas: 90%+
- Componentes UI: 80%+
- APIs: 100% de endpoints

### Tipos de Tests Requeridos
1. **Unitarios**: Funciones puras, utilidades
2. **Integración**: Flujos completos
3. **E2E**: Escenarios críticos (auth, workout, pagos)

---

## 📦 GESTIÓN DE DEPENDENCIAS

### Antes de Agregar
1. ¿Ya existe una solución en el proyecto?
2. ¿Es realmente necesaria?
3. Impacto en bundle size
4. Mantenimiento a largo plazo
5. Compatibilidad con mobile/web

### Preferencias
- TypeScript nativo > Librerías externas
- Rust para performance crítica
- Librerías bien mantenidas (>1000 stars, updates recientes)

---

## 🔄 GIT

### Reglas
1. Rama principal de desarrollo: `develop`
2. Commits atómicos y descriptivos
3. Mensajes en formato convencional:
   - `feat:` nueva funcionalidad
   - `fix:` corrección de bug
   - `refactor:` refactorización
   - `perf:` mejora de performance
   - `docs:` documentación
   - `test:` tests
   - `chore:` mantenimiento

### NUNCA
- Force push a `develop` o `main`
- Borrar migraciones de base de datos
- Commit directo a `main`

---

## 🚫 LO QUE ESTÁ PROHIBIDO

1. **Duplicar funcionalidad** existente
2. **Crear sistemas paralelos** (animación, estado, etc.)
3. **Modificar archivos** sin verificar usos
4. **Borrar código** sin confirmar que no se usa
5. **Ignorar errores** de build/tests
6. **Fingir completitud** sin verificación real
7. **Agregar dependencias** innecesarias
8. **Romper compatibilidad** sin migración

---

## ✅ DEFINICIÓN DE "TERMINADO"

Una tarea está COMPLETA solo cuando:

- [ ] Archivos creados/modificados físicamente
- [ ] Imports/exports actualizados
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] Tests relevantes pasan
- [ ] `npm run build` exitoso
- [ ] No hay regresiones obvias
- [ ] Documentación actualizada (si aplica)

---

## 🆘 SI ALGO FALLA

1. **Diagnosticar**: Leer el error completo
2. **Documentar**: Guardar mensaje de error exacto
3. **Intentar recuperar**: Buscar solución segura
4. **Reportar**: Decir explícitamente qué falló y por qué
5. **No continuar**: Si hay blocker crítico, detenerse y reportar

---

## 📚 DOCUMENTACIÓN DE REFERENCIA

Todos los agentes deben leer en orden:

1. `AGENTS.md` (este archivo) - Reglas generales
2. `.ai/INDEX.md` - Mapa de documentación
3. `.ai/PROJECT_STATE.md` - Estado actual del proyecto
4. `.ai/*_CONTRACT.md` - Contratos específicos por área
5. Documentación específica de la feature a modificar

---

## 🎯 OBJETIVO FINAL

Cada interacción debe dejar el repositorio en **MEJOR ESTADO** que como lo encontró:

- Más claro
- Más seguro
- Más rápido
- Mejor documentado
- Más fácil de mantener

---

**Última actualización**: $(date)
**Versión**: 1.0.0
**Estado**: Activo
