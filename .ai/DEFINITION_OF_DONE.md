# KinetixFitt - Definición de "Terminado"

## ✅ Criterios Obligatorios

Una tarea se considera **COMPLETADA** solo cuando TODOS estos criterios se cumplen:

### 1. Implementación Física
- [ ] Archivos creados físicamente en el sistema de archivos
- [ ] Archivos modificados físicamente (no solo planeado)
- [ ] Imports/exports actualizados y funcionales
- [ ] No hay código muerto o imports sin usar

### 2. Validación de Código
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] Tests unitarios relevantes pasan
- [ ] Tests de integración pasan (si aplica)

### 3. Build y Compilación
- [ ] `npm run build` exitoso para apps afectadas
- [ ] No hay warnings nuevos introducidos
- [ ] Bundle size dentro de budgets establecidos

### 4. Funcionalidad
- [ ] Feature funciona como se especificó
- [ ] No hay regresiones en features existentes
- [ ] Casos edge manejados correctamente
- [ ] Estados de error implementados (loading, empty, error)

### 5. Integración
- [ ] Componente integrado con el resto del sistema
- [ ] API endpoints conectados (si aplica)
- [ ] Base de datos actualizada (si aplica)
- [ ] Migraciones ejecutadas y verificadas

### 6. Documentación
- [ ] README actualizado (si es feature nueva)
- [ ] Comentarios en código complejo
- [ ] Types/interfaces documentados
- [ ] `.ai/PROJECT_STATE.md` actualizado (si es cambio mayor)

### 7. Seguridad
- [ ] No hay secretos expuestos (.env, keys, tokens)
- [ ] Inputs validados y sanitizados
- [ ] Autorización verificada (si aplica)
- [ ] Datos sensibles encriptados (si aplica)

### 8. Performance
- [ ] No hay degradación de performance medible
- [ ] Lazy loading implementado (si es componente pesado)
- [ ] No hay memory leaks
- [ ] FPS se mantienen en 60+ (si hay animaciones)

### 9. Accesibilidad
- [ ] Atributos ARIA correctos
- [ ] Navegación por teclado funciona
- [ ] Contraste de colores adecuado
- [ ] Screen readers pueden leer contenido

### 10. Responsive
- [ ] Mobile (320px+) funciona correctamente
- [ ] Tablet (768px+) se ve bien
- [ ] Desktop (1024px+) aprovecha el espacio
- [ ] No hay overflow o clipping no deseado

---

## 🚫 Lo que NO cuenta como "Terminado"

- ❌ Solo escribir código sin verificar que compila
- ❌ Solo describir la implementación sin hacerla
- ❌ Solo crear archivos sin integrarlos
- ❌ Ignorar errores de TypeScript/Lint
- ❌ Dejar tests fallando
- ❌ Romper builds existentes
- ❌ Crear deuda técnica sin documentarla

---

## 📊 Niveles de Completitud

### ✅ COMPLETADO (100%)
Todos los criterios anteriores cumplidos.

### 🟡 PARCIAL (50-99%)
Implementación funcional pero faltan validaciones, tests o documentación.

### 🔴 NO COMPLETADO (<50%)
Solo planeación o implementación incompleta sin funcionalidad real.

---

## 🔄 Proceso de Verificación

Antes de marcar tarea como completada:

```bash
# 1. Verificar archivos existen
ls -la <archivos-creados>

# 2. Type checking
npm run typecheck

# 3. Lint
npm run lint

# 4. Tests
npm run test

# 5. Build
npm run build

# 6. Git status
git status
git diff
```

---

**Nota**: Es mejor reportar "PARCIAL" honestamente que "COMPLETADO" falsamente.
