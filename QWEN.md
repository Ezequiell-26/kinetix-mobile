# KinetixFitt - Instrucciones Específicas para Qwen

## Este archivo complementa AGENTS.md

**IMPORTANTE**: `AGENTS.md` es la autoridad máxima. Este archivo solo contiene configuraciones específicas para Qwen Code.

---

## 🤖 Configuración Qwen

### Comportamiento Esperado
1. **Siempre verificar sistema de archivos** antes de reportar completitud
2. **Nunca asumir** que un comando funcionó sin verificarlo
3. **Reportar errores reales** inmediatamente
4. **Crear archivos físicos** cuando se solicite

### Comandos Preferidos
```bash
# Verificación de archivos
ls -la <ruta>
cat <archivo>
file <archivo>

# Git
git status
git diff
git log --oneline -5

# Build/Tests
npm run typecheck
npm run lint
npm run test
npm run build
```

---

## 📋 Flujo de Trabajo Qwen

### Al Recibir una Tarea
1. Leer `AGENTS.md` completamente
2. Inspeccionar repositorio actual
3. Identificar archivos existentes relevantes
4. Planificar implementación real
5. Ejecutar creación/modificación de archivos
6. Verificar físicamente los cambios
7. Ejecutar validaciones (typecheck, lint, test, build)
8. Reportar resultado REAL

### Al Crear Archivos
- Usar rutas absolutas (`/workspace/ruta/archivo.ts`)
- Verificar que el directorio padre existe
- Confirmar creación con `ls -la`
- Mostrar contenido creado con `cat`

### Al Modificar Archivos
- Leer contenido actual primero
- Identificar líneas exactas a cambiar
- Preservar código no relacionado
- Verificar cambios con `git diff`

---

## ⚠️ Errores Comunes a Evitar

1. ❌ Decir "archivo creado" sin verificar existencia física
2. ❌ Asumir que `git commit` funcionó sin checkear `git status`
3. ❌ Reportar "build exitoso" sin ejecutar `npm run build`
4. ❌ Ignorar errores de TypeScript/Lint
5. ❌ Crear sistemas duplicados sin buscar existentes

---

## ✅ Checklist de Verificación Qwen

Antes de reportar una tarea como completada:

- [ ] Verifiqué físicamente los archivos creados/modificados
- [ ] Ejecuté `npm run typecheck` y pasó
- [ ] Ejecuté `npm run lint` y pasó
- [ ] Ejecuté tests relevantes y pasaron
- [ ] Ejecuté `npm run build` y fue exitoso
- [ ] No hay errores en consola
- [ ] El código sigue las reglas de `AGENTS.md`
- [ ] Actualicé documentación si era necesario

---

## 📞 Comunicación con el Usuario

### Cuando Algo Sale Bien
```
✅ COMPLETADO: [Descripción clara]
📁 Archivos creados: [lista real verificada]
📝 Archivos modificados: [lista real verificada]
✅ Tests: X/X pasaron
✅ Build: Exitoso
```

### Cuando Algo Falla
```
❌ ERROR: [Descripción del error]
📍 Ubicación: [archivo/línea]
🔍 Causa probable: [análisis]
🔧 Intentando solución: [qué estás haciendo]
⏸️ Estado: BLOQUEADO/EN PROGRESO
```

### Cuando Necesitas Más Información
```
❓ NECESITO ACLARACIÓN:
- [Punto específico que necesita claridad]
- Opciones posibles: [A, B, C]
- Recomendación: [tu sugerencia]
```

---

## 🎯 Prioridades Qwen

1. **Seguridad**: Nunca comprometer seguridad
2. **Integridad de datos**: Proteger base de datos y usuarios
3. **Funcionalidad**: Que todo funcione correctamente
4. **Performance**: Mantener o mejorar rendimiento
5. **Código limpio**: Seguir mejores prácticas

---

**Versión**: 1.0.0
**Basado en**: AGENTS.md
**Estado**: Activo
