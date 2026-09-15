# KinetixFitt — AI Agent Operating System

## Fuente única de verdad para agentes

Este documento define las reglas obligatorias para cualquier agente de IA que modifique este repositorio.

El objetivo no es simplemente producir código: es mantener KinetixFitt **estable, seguro, verificable y fácil de evolucionar**.

---

# 1. REGLA DE ORO — NO FINGIR IMPLEMENTACIÓN

NUNCA afirmes que una tarea está creada, corregida, migrada, integrada o terminada si no existe evidencia real.

Solo puedes afirmar que algo está COMPLETO cuando:

1. el código existe físicamente;
2. los consumidores fueron revisados;
3. la implementación está conectada de extremo a extremo;
4. las validaciones relevantes pasan;
5. los tests relevantes pasan;
6. el build correspondiente pasa;
7. no existe una regresión conocida.

Si solo analizaste, propusiste o dejaste parcialmente implementado algo, dilo explícitamente.

---

# 2. REGLA DE NO REGRESIÓN

Antes de modificar cualquier módulo:

1. localizar el archivo y sus consumidores;
2. localizar imports/exports;
3. localizar rutas/API relacionadas;
4. revisar modelos Prisma y relaciones;
5. revisar hooks/store/estado relacionados;
6. revisar tests existentes;
7. identificar dependencias directas e indirectas;
8. implementar el cambio mínimo y seguro;
9. ejecutar las verificaciones apropiadas.

Nunca cambies una pieza aislada sin revisar qué puede romper.

Regla permanente:

> BUG → FIX → REGRESSION TEST

Toda corrección de un bug crítico debe dejar un test que impida que reaparezca.

---

# 3. FLUJO OBLIGATORIO DE TRABAJO

Para cada tarea:

## 3.1 INSPECCIONAR

Primero entender el estado real del repositorio.

- git status
- branch actual
- commit actual
- árbol de archivos
- configuración
- código relevante
- tests relevantes

No confiar ciegamente en README, comentarios o documentos antiguos.

## 3.2 PLANIFICAR

Identificar:

- archivos a crear/modificar;
- funcionalidades existentes que serán afectadas;
- dependencias;
- migraciones necesarias;
- riesgos;
- tests necesarios.

NO duplicar una solución ya existente.

## 3.3 IMPLEMENTAR

Modificar únicamente lo necesario.

Preferir cambios incrementales sobre reescrituras completas.

## 3.4 VALIDAR

Ejecutar como mínimo las verificaciones relevantes:

- lint
- typecheck
- tests
- build

Para cambios de seguridad, DB, auth, pagos o API, ejecutar además sus suites específicas.

## 3.5 REVISAR

Buscar regresiones, imports rotos, rutas rotas, contratos incompatibles y efectos colaterales.

## 3.6 REPORTAR

Informar:

- archivos creados;
- archivos modificados;
- tests ejecutados;
- resultados reales;
- errores restantes;
- estado final.

Nunca inventar resultados.

---

# 4. DEFINICIÓN DE ESTADOS

Toda funcionalidad debe poder clasificarse como:

- COMPLETE
- PARTIAL
- MOCK
- BROKEN
- NOT_IMPLEMENTED

Una pantalla existente NO implica que la funcionalidad esté completa.

Una API existente NO implica que el flujo end-to-end esté completo.

Un test unitario NO implica que producción esté validada.

---

# 5. ARQUITECTURA Y LÍMITES

Mantener separación clara entre:

PRESENTATION
→ APPLICATION/API
→ DOMAIN
→ DATA
→ EXTERNAL SERVICES

Reglas:

- UI en `apps/`;
- lógica compartida en `packages/` cuando corresponda;
- acceso a infraestructura sensible únicamente desde servidor;
- no duplicar reglas de negocio entre múltiples APIs/componentes;
- centralizar autorización, validación y manejo de errores;
- reutilizar servicios existentes antes de crear otros paralelos.

No introducir una nueva arquitectura por preferencia personal del agente.

---

# 6. BASE DE DATOS

PostgreSQL/Supabase es la fuente persistente real.

NO:

- usar localStorage como sustituto permanente de DB;
- modificar producción manualmente sin control;
- crear cambios de schema sin migration;
- borrar migraciones existentes;
- ignorar archivos de migración mediante `.gitignore`;
- usar `db push` como sustituto de un flujo de migraciones controlado en producción.

Flujo requerido para cambios de schema:

SCHEMA CHANGE
→ MIGRATION
→ LOCAL TEST
→ CI
→ PREVIEW/STAGING
→ PRODUCTION

Revisar siempre:

- foreign keys;
- índices;
- unique constraints;
- cascade behavior;
- transactions;
- connection pooling;
- compatibilidad hacia atrás.

Para migraciones complejas preferir estrategias expand/contract antes que cambios destructivos inmediatos.

---

# 7. AUTORIZACIÓN MULTI-TRAINER

La autorización se valida en servidor.

Nunca confiar en IDs enviados por el cliente.

Un trainer solo puede acceder a recursos que realmente le pertenecen o a los que tiene permiso.

Validar ownership para:

- clients
- profiles
- programs
- workouts
- workout logs
- measurements
- photos
- check-ins
- messages
- payments
- subscriptions
- analytics
- uploads
- documents

Prueba mínima:

Trainer A → Client A ✅
Trainer A → Client B ❌
Trainer B → Client B ✅
Trainer B → Client A ❌

Toda corrección relacionada con ownership debe incluir pruebas cruzadas.

---

# 8. AUTH Y SESIONES

Nunca debilitar:

- password hashing;
- secure cookies;
- httpOnly;
- sameSite;
- session expiration;
- session revocation;
- rate limiting;
- input validation.

Password reset debe utilizar tokens suficientemente aleatorios, almacenamiento seguro del token y consumo atómico/one-time.

Nunca almacenar secrets innecesarios.

---

# 9. SEGURIDAD Y SECRETOS

PROHIBIDO subir a Git:

- `.env` reales;
- passwords;
- API keys;
- Stripe secrets;
- Mercado Pago secrets;
- Supabase service-role keys;
- JWT secrets;
- SMTP passwords;
- tokens privados.

Antes de un commit sensible revisar el diff.

Si se detecta un secret expuesto:

1. detener la distribución del secret;
2. rotarlo/revocarlo;
3. eliminarlo del árbol actual;
4. comprobar exposición en historial cuando corresponda;
5. sustituir por environment variables.

Nunca utilizar un secret real en tests o documentación.

---

# 10. API CONTRACTS

Cada API crítica debe tener:

- input validation;
- output contract;
- auth rules;
- ownership rules;
- stable error behavior.

No cambiar contratos públicos sin revisar todos sus consumidores.

Si el cambio rompe consumidores, migrarlos coordinadamente.

Nunca ocultar breaking changes.

---

# 11. PAGOS

No usar pagos falsos en producción.

PROHIBIDO:

- `setTimeout()` como simulación de checkout;
- `alert()` como simulación de pago;
- fake success;
- fake webhook.

Stripe/Mercado Pago deben validar en servidor:

- plan;
- precio;
- moneda;
- usuario;
- firma/webhook;
- idempotencia.

Nunca confiar en el precio enviado directamente por el cliente.

---

# 12. AI

La AI debe reflejar su estado real.

NO afirmar que un provider está conectado cuando no lo está.

No exponer API keys al cliente.

Preferir una capa de provider/adapters para permitir cambiar de modelo sin reescribir el producto.

Los fallbacks deben ser explícitos.

---

# 13. STORAGE

El filesystem efímero no es el almacenamiento definitivo de producción.

Para archivos de usuario usar storage durable y controles de acceso.

Validar:

- MIME;
- magic bytes;
- tamaño;
- nombre seguro;
- ownership;
- URLs firmadas cuando corresponda.

---

# 14. NUTRITION Y RECOVERY

No presentar datos mock o calculados como si fueran mediciones reales del usuario.

Distinguir siempre:

USER DATA
DERIVED DATA
DEVICE DATA
DEMO DATA

El escaneo de alimentos, wearable integrations u otras integraciones solo se consideran reales cuando existe conexión y validación real.

---

# 15. UI / UX

KinetixFitt debe mantener una identidad:

- premium;
- profesional;
- sport-tech;
- consistente;
- rápida;
- accesible.

Usar tokens y componentes compartidos.

No crear sistemas visuales paralelos.

Toda vista importante debe contemplar:

- loading;
- empty;
- error;
- success;
- responsive;
- accesibilidad básica.

No agregar animaciones o 3D que comprometan funcionalidad o rendimiento sin necesidad.

---

# 16. PERFORMANCE

Antes de agregar librerías nuevas evaluar:

- bundle size;
- runtime cost;
- memory;
- mobile impact;
- maintenance cost.

Preferir:

- code splitting;
- lazy loading;
- dynamic imports;
- server rendering cuando corresponda;
- queries eficientes;
- imágenes optimizadas;
- carga bajo demanda de Three.js.

No optimizar a costa de romper UX.

---

# 17. TESTING

Tipos de test esperados:

1. Unit
2. Domain
3. Integration
4. API
5. Security
6. E2E

Objetivos mínimos cualitativos:

- toda lógica crítica debe tener tests;
- toda API sensible debe tener autorización probada;
- bugs críticos deben tener regression tests;
- journeys principales deben estar cubiertos por E2E.

No bajar cobertura o eliminar tests solo para hacer pasar CI.

---

# 18. CI / QUALITY GATES

El CI debe validar como mínimo:

- install
- lint
- typecheck
- tests
- security tests
- build

Un cambio que falle cualquiera de estos gates no está listo para integrarse.

No ignorar errores de CI sin documentar la razón.

---

# 19. GIT Y RAMAS

Estrategia recomendada:

feature/*
→ desarrollo aislado
→ PR / validación
→ integración
→ `main`

`main` representa una versión estable.

NO force push a `main`.
NO reescribir historia de `main` sin una razón excepcional y explícita.
NO usar `main` como rama experimental.

Regla actual de integración:

> Todo trabajo que haya sido realmente verificado debe quedar integrado en `main`.

Esto sustituye cualquier regla anterior que prohibiera la integración de trabajo verificado a `main`.

---

# 20. COMMITS

Usar Conventional Commits:

- `feat:`
- `fix:`
- `refactor:`
- `perf:`
- `docs:`
- `test:`
- `chore:`
- `security:` cuando corresponda.

Preferir commits atómicos.

No mezclar cambios no relacionados.

---

# 21. RELEASE Y ROLLBACK

Cada cambio importante debe poder rastrearse a un commit/release.

Mantener capacidad de rollback.

Para cambios DB destructivos definir estrategia antes del deploy.

Nunca eliminar la última versión estable sin una alternativa recuperable.

---

# 22. BACKUPS Y RECOVERY

Los backups deben ser reales, automáticos y restaurables.

No afirmar que existe disaster recovery sin haber probado un restore en un entorno seguro.

Documentar cuando corresponda:

- RPO
- RTO
- retención
- procedimiento de restore.

---

# 23. OBSERVABILIDAD

Los cambios importantes deben dejar suficientes señales para diagnosticar problemas.

Usar donde corresponda:

- Sentry;
- structured logging;
- audit logs;
- performance metrics;
- request IDs.

NO registrar passwords, tokens o secrets.

---

# 24. DEPENDENCIAS

Antes de agregar una dependencia:

1. comprobar si ya existe solución interna;
2. evaluar bundle size;
3. evaluar compatibilidad;
4. evaluar mantenimiento;
5. evaluar impacto en mobile/web/desktop.

Preferir APIs nativas y código TypeScript propio cuando la funcionalidad sea trivial.

No actualizar grandes grupos de dependencias sin pruebas de compatibilidad.

---

# 25. PLATAFORMAS

No declarar una plataforma “lista” solo porque existe configuración.

Validar realmente:

- Web
- PWA
- Android
- iOS
- Desktop

Los cambios compartidos deben revisarse para efectos específicos de cada plataforma.

---

# 26. WEB Y APPS DUPLICADAS

Si existen implementaciones paralelas (`apps/mobile`, `apps/web` u otras), identificar claramente cuál es oficial, cuál es legacy y cuál es experimental.

No mantener dos fuentes de verdad para la misma funcionalidad sin una razón documentada.

Antes de eliminar una implementación aparentemente duplicada, comprobar referencias y consumers.

---

# 27. DOCUMENTACIÓN

Cuando cambie arquitectura o comportamiento importante, actualizar la documentación relevante.

Especialmente:

- `.ai/PROJECT_STATE.md`
- `.ai/PROJECT_REALITY.md`
- `.ai/INDEX.md`
- `DEPLOY.md`
- `SECURITY_AUDIT.md`
- `PRODUCTION_READINESS.md`

La documentación debe reflejar el estado real, no el estado deseado.

---

# 28. REGLAS ESPECIALES PARA AGENTES DE IA

Antes de escribir código:

READ
→ SEARCH
→ UNDERSTAND

Antes de commit:

TEST
→ REVIEW
→ CHECK DIFF

Después:

COMMIT
→ VERIFY
→ INTEGRATE

Nunca:

- borrar por conveniencia;
- reescribir sin necesidad;
- introducir sistemas paralelos;
- desactivar checks;
- falsificar funcionalidades;
- ocultar errores;
- inventar resultados.

Cuando no tengas suficiente información, inspecciona el repositorio antes de asumir.

---

# 29. CRITICAL CHANGE PROTOCOL

Para cambios en:

- authentication
- authorization
- database schema
- payments
- storage
- AI infrastructure
- deployment
- CI/CD

es obligatorio:

1. revisar dependencias;
2. implementar incrementalmente;
3. tests específicos;
4. build;
5. revisar diff;
6. actualizar documentación si corresponde;
7. integrar solo después de verificación.

---

# 30. DEFINITION OF DONE

Una tarea está COMPLETA solo cuando:

- [ ] código real implementado;
- [ ] consumidores revisados;
- [ ] imports/exports correctos;
- [ ] validación correcta;
- [ ] autorización correcta;
- [ ] persistencia correcta si aplica;
- [ ] loading/error/empty states cuando aplica;
- [ ] tests relevantes pasan;
- [ ] lint pasa;
- [ ] typecheck pasa;
- [ ] build pasa;
- [ ] no existe regresión conocida;
- [ ] documentación actualizada cuando aplica;
- [ ] cambios integrados en `main` cuando están verificados.

---

# 31. SI ALGO FALLA

No esconder el fallo.

Procedimiento:

1. capturar error exacto;
2. diagnosticar;
3. aislar causa;
4. aplicar corrección segura;
5. volver a ejecutar validaciones;
6. documentar cualquier bloqueo restante.

Nunca marcar como verde algo que sigue rojo.

---

# 32. OBJETIVO FINAL

Cada interacción de una IA debe dejar KinetixFitt:

- más estable;
- más seguro;
- más rápido;
- más claro;
- más testeado;
- más fácil de mantener.

La meta es que una nueva IA pueda entrar mañana al repositorio, comprender las reglas y agregar una funcionalidad importante **sin romper funcionalidades existentes**.

KinetixFitt debe evolucionar de forma incremental y controlada.

**ESTABILIDAD > VELOCIDAD DE CAMBIO**
**EVIDENCIA > AFIRMACIONES**
**SEGURIDAD > COMODIDAD**
**DATOS REALES > MOCKS**
**CAMBIOS INCREMENTALES > REESCRITURAS**

---

**Versión:** 2.0.0
**Estado:** Activo
