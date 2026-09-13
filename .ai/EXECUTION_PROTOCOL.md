# KinetixFitt - Protocolo de Ejecución para Agentes IA

## 🔄 Flujo de Trabajo Obligatorio

Todo agente DEBE seguir este protocolo en orden estricto. NO saltar pasos.

---

## FASE 1: ENTENDER (10% del tiempo)

### Acciones Requeridas
1. Leer solicitud del usuario completamente
2. Identificar tipo de tarea:
   - [ ] Creación de archivo nuevo
   - [ ] Modificación de archivo existente
   - [ ] Eliminación de archivo
   - [ ] Refactorización
   - [ ] Implementación de feature
   - [ ] Fix de bug
   - [ ] Optimización

3. Identificar sistemas afectados:
   - UI (mobile/web)
   - Backend/API
   - Database
   - Rust Core
   - 3D/Graphics
   - AI/ML

### Output Esperado
- Comprensión clara de qué se pide
- Lista de archivos potencialmente involucrados

---

## FASE 2: INSPECCIONAR (20% del tiempo)

### Acciones Requeridas

#### 2.1 Leer Documentación Relevante
```bash
# Siempre leer primero
cat /workspace/AGENTS.md
cat /workspace/.ai/INDEX.md
cat /workspace/.ai/PROJECT_STATE.md

# Según tipo de tarea
cat /workspace/.ai/DESIGN_SYSTEM_CONTRACT.md    # Si es UI
cat /workspace/.ai/ARCHITECTURE_CONTRACT.md     # Si es estructura
cat /workspace/.ai/RUST_CONTRACT.md             # Si es Rust
cat /workspace/.ai/3D_CONTRACT.md               # Si es 3D
```

#### 2.2 Inspeccionar Código Existente
```bash
# Verificar si ya existe funcionalidad similar
find /workspace -name "*.ts" -o -name "*.tsx" | xargs grep -l "funcionalidad"

# Leer archivos relevantes
cat /ruta/al/archivo/existente.ts

# Ver imports y dependencias
grep -r "import.*modulo" /workspace/apps /workspace/packages
```

#### 2.3 Verificar Estado del Repositorio
```bash
git status
git log --oneline -5
```

### Output Esperado
- Lista de archivos existentes que podrían reutilizarse
- Entendimiento de dependencias
- Confirmación de que no hay duplicación

---

## FASE 3: PLANIFICAR (15% del tiempo)

### Acciones Requeridas

#### 3.1 Definir Archivos a Crear/Modificar
```
Archivos a crear:
- /ruta/nuevo-archivo.ts

Archivos a modificar:
- /ruta/archivo-existente.ts (agregar función X)
- /ruta/otro-archivo.tsx (actualizar import)
```

#### 3.2 Definir Dependencias
```
Dependencias necesarias:
- packages/shared/types
- packages/core/rust (WASM)
- npm packages: [lista]
```

#### 3.3 Definir Tests Necesarios
```
Tests a crear/actualizar:
- unit: calculateVolume.test.ts
- integration: workout-flow.spec.ts
```

### Output Esperado
- Plan escrito antes de implementar
- Validación mental de que el plan es seguro

---

## FASE 4: IMPLEMENTAR (30% del tiempo)

### Acciones Requeridas

#### 4.1 Crear Archivos Físicos
```bash
# Usar str_replace_editor o comandos bash
mkdir -p /workspace/ruta/directorio
cat > /workspace/ruta/archivo.ts << 'EOF'
...contenido...
