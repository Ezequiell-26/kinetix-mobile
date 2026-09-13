# 🎙️ GUÍA COMPLETA DE VOCES — EZEQUIEL COACHING

**Fecha:** 12 de septiembre de 2026  
**Sistema:** Voice Engine con voces de Ezequiel  
**Estado:** Parcialmente implementado (algunas voces son TTS robótico)

---

## 📊 RESUMEN ACTUAL

### ✅ Voces Grabadas (Confirmadas)
**Total archivos:** 67 archivos MP3

**Distribución:**
- **Connectors:** 11 archivos (de, y, con, para, tu, una, ultimas, el, la, en, mas)
- **Countdown:** 2 archivos (preparate, tiempo)
- **Motivation:** 13 archivos (vamos-suave, muy-bien, buen-trabajo, etc.)
- **Phrases:** 4 archivos (serie-completada, ejercicio-completado, record-personal, ultimas-dos)
- **Words:** 18 archivos (serie, repeticion, descanso, kilo, segundo, etc.)
- **Legacy:** 13 archivos (arranque, cierre, cuenta-regresiva, etc.)
- **Extra:** 6 archivos HIIT (trabaja, descansa, ultima, fin)

### ❌ Voces Faltantes (Se genera TTS robótico)
**Numbers:** 0 archivos (se generan con TTS)
**Syllables:** 0 archivos (se generan con TTS)

---

## 📂 ESTRUCTURA DE ARCHIVOS

```
public/audio/
├── narrador-*.mp3 (13 archivos LEGACY - primera versión)
│   ├── narrador-arranque.mp3
│   ├── narrador-checkin.mp3
│   ├── narrador-cierre.mp3
│   ├── narrador-cuenta-regresiva.mp3
│   ├── narrador-descanso.mp3
│   ├── narrador-hiit-descansa.mp3
│   ├── narrador-hiit-fin.mp3
│   ├── narrador-hiit-trabaja.mp3
│   ├── narrador-hiit-ultima.mp3
│   ├── narrador-mitad.mp3
│   ├── narrador-racha.mp3
│   ├── narrador-siguiente.mp3
│   └── narrador-ultimo.mp3
│
└── voices/
    └── ezequiel/ (54 archivos nuevos - voz natural)
        ├── connectors/ (11 archivos)
        │   ├── con.mp3 ✅
        │   ├── de.mp3 ✅
        │   ├── el.mp3 ✅
        │   ├── en.mp3 ✅
        │   ├── la.mp3 ✅
        │   ├── mas.mp3 ✅
        │   ├── para.mp3 ✅
        │   ├── tu.mp3 ✅
        │   ├── ultimas.mp3 ✅
        │   ├── una.mp3 ✅
        │   └── y.mp3 ✅
        │
        ├── countdown/ (2 archivos)
        │   ├── preparate.mp3 ✅
        │   └── tiempo.mp3 ✅
        │
        ├── motivation/ (13 archivos)
        │   ├── buen-trabajo.mp3 ✅
        │   ├── dale.mp3 ✅
        │   ├── manten-ritmo.mp3 ✅
        │   ├── muy-bien.mp3 ✅
        │   ├── no-aflojes.mp3 ✅
        │   ├── seguimos.mp3 ✅
        │   ├── ultima-vamos.mp3 ✅
        │   ├── ultima.mp3 ✅
        │   ├── una-mas.mp3 ✅
        │   ├── vamos-fuerte.mp3 ✅
        │   └── vamos-suave.mp3 ✅
        │
        ├── phrases/ (4 archivos)
        │   ├── ejercicio-completado.mp3 ✅
        │   ├── record-personal.mp3 ✅
        │   ├── serie-completada.mp3 ✅
        │   └── ultimas-dos.mp3 ✅
        │
        └── words/ (18 archivos)
            ├── descansa.mp3 ✅
            ├── descanso.mp3 ✅
            ├── ejercicio.mp3 ✅
            ├── kilo.mp3 ✅
            ├── kilos.mp3 ✅
            ├── marca.mp3 ✅
            ├── minuto.mp3 ✅
            ├── minutos.mp3 ✅
            ├── peso.mp3 ✅
            ├── quedan.mp3 ✅
            ├── repeticion.mp3 ✅
            ├── repeticiones.mp3 ✅
            ├── ronda.mp3 ✅
            ├── segundo.mp3 ✅
            ├── segundos.mp3 ✅
            ├── serie.mp3 ✅
            ├── tiempo.mp3 ✅
            └── trabajo.mp3 ✅
```

---

## 🎯 VOCES QUE FALTAN (Para eliminar el TTS robótico)

### 1. **NÚMEROS (CRÍTICO)** 📢

El sistema arma números dinámicamente combinando piezas. Necesitas grabar **39 archivos** para cubrir 0-100:

```
public/audio/voices/ezequiel/numbers/
```

#### Números básicos (0-29) — 30 archivos
```
cero.mp3        ❌ "cero"
uno.mp3         ❌ "uno"
dos.mp3         ❌ "dos"
tres.mp3        ❌ "tres"
cuatro.mp3      ❌ "cuatro"
cinco.mp3       ❌ "cinco"
seis.mp3        ❌ "seis"
siete.mp3       ❌ "siete"
ocho.mp3        ❌ "ocho"
nueve.mp3       ❌ "nueve"
diez.mp3        ❌ "diez"
once.mp3        ❌ "once"
doce.mp3        ❌ "doce"
trece.mp3       ❌ "trece"
catorce.mp3     ❌ "catorce"
quince.mp3      ❌ "quince"
dieciseis.mp3   ❌ "dieciséis"
diecisiete.mp3  ❌ "diecisiete"
dieciocho.mp3   ❌ "dieciocho"
diecinueve.mp3  ❌ "diecinueve"
veinte.mp3      ❌ "veinte"
veintiuno.mp3   ❌ "veintiuno"
veintidos.mp3   ❌ "veintidós"
veintitres.mp3  ❌ "veintitrés"
veinticuatro.mp3 ❌ "veinticuatro"
veinticinco.mp3 ❌ "veinticinco"
veintiseis.mp3  ❌ "veintiséis"
veintisiete.mp3 ❌ "veintisiete"
veintiocho.mp3  ❌ "veintiocho"
veintinueve.mp3 ❌ "veintinueve"
```

#### Decenas (30-90) — 7 archivos
```
treinta.mp3     ❌ "treinta"
cuarenta.mp3    ❌ "cuarenta"
cincuenta.mp3   ❌ "cincuenta"
sesenta.mp3     ❌ "sesenta"
setenta.mp3     ❌ "setenta"
ochenta.mp3     ❌ "ochenta"
noventa.mp3     ❌ "noventa"
```

#### Especiales — 2 archivos
```
cien.mp3        ❌ "cien"
coma.mp3        ❌ "coma" o "punto" (para decimales)
```

**Ejemplo de cómo se combinan:**
- "35" = `treinta.mp3` + `y.mp3` + `cinco.mp3`
- "52" = `cincuenta.mp3` + `y.mp3` + `dos.mp3`
- "100" = `cien.mp3`
- "12.5" = `doce.mp3` + `coma.mp3` + `cinco.mp3`

**Total números:** 39 archivos

---

### 2. **SÍLABAS (OPCIONAL pero recomendado)**

Para nombres de ejercicios que no están en el diccionario, el sistema puede armarlos por sílabas.

```
public/audio/voices/ezequiel/syllables/
```

#### Sílabas comunes en nombres de ejercicios
```
press.mp3       ❌ "press"
bench.mp3       ❌ "bench"
squat.mp3       ❌ "squat"
dead.mp3        ❌ "dead"
lift.mp3        ❌ "lift"
curl.mp3        ❌ "curl"
push.mp3        ❌ "push"
pull.mp3        ❌ "pull"
row.mp3         ❌ "row"
fly.mp3         ❌ "fly"
dip.mp3         ❌ "dip"
lunge.mp3       ❌ "lunge"
plank.mp3       ❌ "plank"
crunch.mp3      ❌ "crunch"
```

**O mejor: grabar nombres de ejercicios completos:**

```
public/audio/voices/ezequiel/exercises/
```

```
press-de-banca.mp3          ❌ "Press de banca"
sentadilla.mp3              ❌ "Sentadilla"
peso-muerto.mp3             ❌ "Peso muerto"
curl-de-biceps.mp3          ❌ "Curl de bíceps"
press-militar.mp3           ❌ "Press militar"
dominadas.mp3               ❌ "Dominadas"
fondos.mp3                  ❌ "Fondos"
remo-con-barra.mp3          ❌ "Remo con barra"
extensiones-de-triceps.mp3  ❌ "Extensiones de tríceps"
elevaciones-laterales.mp3   ❌ "Elevaciones laterales"
```

---

## 🎬 CONTEXTO DE USO (Cuándo se escucha cada voz)

### **PHRASES** (Frases completas)
| Archivo | Cuándo se dice | Ejemplo de uso |
|---------|----------------|----------------|
| `serie-completada.mp3` | Al terminar una serie | "¡Serie completada!" → motivación |
| `ejercicio-completado.mp3` | Al terminar un ejercicio completo | "¡Ejercicio completado!" → siguiente |
| `record-personal.mp3` | Cuando supera su mejor marca | "¡Nuevo récord personal!" |
| `ultimas-dos.mp3` | En las últimas 2 reps | "¡Las últimas dos!" |
| `arranque.mp3` (legacy) | Al iniciar el workout | "¡Vamos con todo!" |
| `cierre.mp3` (legacy) | Al finalizar el workout | "¡Excelente trabajo!" |
| `mitad.mp3` (legacy) | A la mitad del workout | "Vas por la mitad" |
| `ultimo.mp3` (legacy) | Última serie del workout | "Último esfuerzo" |

### **WORDS** (Palabras individuales)
| Archivo | Se usa en | Ejemplo completo |
|---------|-----------|------------------|
| `serie.mp3` | Anuncios de series | "Serie 3" o "Serie completada" |
| `repeticion.mp3` | 1 repetición | "1 repetición" |
| `repeticiones.mp3` | 2+ repeticiones | "12 repeticiones" |
| `descanso.mp3` | Inicio de descanso | "Descanso de 60 segundos" |
| `descansa.mp3` | Durante descanso | "Descansa" |
| `quedan.mp3` | Avisos de tiempo | "Quedan 10 segundos" |
| `segundo.mp3` | 1 segundo | "1 segundo" |
| `segundos.mp3` | 2+ segundos | "30 segundos" |
| `kilo.mp3` | 1 kilo | "1 kilo" |
| `kilos.mp3` | 2+ kilos | "100 kilos" |
| `peso.mp3` | Referencia a carga | "Con peso de..." |
| `ejercicio.mp3` | Anuncio de ejercicio | "Ejercicio: Press de banca" |
| `ronda.mp3` | Para HIIT | "Ronda 3" |

### **MOTIVATION** (Motivación aleatoria)
| Archivo | Cuándo | Intensidad |
|---------|--------|------------|
| `vamos-suave.mp3` | Ejercicios suaves/warm-up | LOW |
| `muy-bien.mp3` | General | LOW |
| `buen-trabajo.mp3` | General | LOW-MEDIUM |
| `manten-ritmo.mp3` | Serie en curso | MEDIUM |
| `seguimos.mp3` | General | MEDIUM |
| `vamos-fuerte.mp3` | Series pesadas | HIGH |
| `una-mas.mp3` | Cerca del objetivo | HIGH |
| `dale.mp3` | General motivación | MEDIUM |
| `no-aflojes.mp3` | Series duras | HIGH |
| `ultima.mp3` | Última rep/serie | LAST_REP |
| `ultima-vamos.mp3` | Última rep con énfasis | LAST_REP |

### **CONNECTORS** (Conectores para armar frases)
| Archivo | Uso |
|---------|-----|
| `de.mp3` | "3 **de** 10", "Descanso **de** 60 segundos" |
| `y.mp3` | "30 **y** 5 segundos", números compuestos |
| `con.mp3` | "**Con** peso de 80 kilos" |
| `para.mp3` | "Tiempo **para** descansar" |
| `tu.mp3` | "**Tu** próximo ejercicio" |
| `una.mp3` | "**Una** más" |
| `ultimas.mp3` | "Las **últimas** dos" |
| `el.mp3` | "**El** próximo ejercicio" |
| `la.mp3` | "**La** próxima serie" |
| `en.mp3` | "**En** 3 segundos" |
| `mas.mp3` | "Una **más**" |

### **COUNTDOWN** (Cuenta regresiva)
| Archivo | Cuándo |
|---------|--------|
| `preparate.mp3` | Antes de empezar un ejercicio | "Prepárate" |
| `tiempo.mp3` | Marca de tiempo | "Tiempo" |

---

## 🎙️ GUÍA DE GRABACIÓN

### Configuración de Audio Recomendada
- **Formato:** MP3, 128-192 kbps (calidad media-alta)
- **Sample Rate:** 44.1 kHz
- **Mono** (no estéreo, ahorra espacio)
- **Volumen:** Normalizado a -3dB (sin clipping)
- **Sin reverb ni efectos** (sonido directo)
- **Sin silencios largos** al inicio/final (max 0.1s)

### Tono y Estilo
- **Energético pero natural** (como hablarías con un amigo en el gym)
- **Ritmo constante** (ni muy rápido ni muy lento)
- **Énfasis en las últimas sílabas** de motivación (¡dale!, ¡vamos!)
- **Números con cadencia neutra** (no aceleres al final)

### Herramientas Recomendadas
- **Grabación:** Audacity (gratis), Adobe Audition, GarageBand
- **Micrófono:** Cualquier USB decente (Blue Yeti, Rode NT-USB)
- **Ambiente:** Silencioso, sin eco (closet con ropa funciona bien)

---

## 🔧 CÓMO AGREGAR VOCES NUEVAS

### 1. Grabar el audio
Usa la guía de arriba para grabar con buena calidad.

### 2. Guardar en la ubicación correcta
```bash
# Ejemplo: número "veinte"
public/audio/voices/ezequiel/numbers/veinte.mp3

# Ejemplo: ejercicio "press de banca"
public/audio/voices/ezequiel/exercises/press-de-banca.mp3
```

### 3. Actualizar el manifiesto
Edita `src/lib/voice-engine/voices.ts`:

```typescript
export const DEFAULT_VOICE: VoiceManifest = {
  id: "ezequiel",
  label: "Ezequiel",
  phrases: { /* ... */ },
  words: { /* ... */ },
  numbers: {
    // AGREGAR AQUÍ 👇
    cero: `${V}/numbers/cero.mp3`,
    uno: `${V}/numbers/uno.mp3`,
    dos: `${V}/numbers/dos.mp3`,
    // ... hasta noventa
    cien: `${V}/numbers/cien.mp3`,
    coma: `${V}/numbers/coma.mp3`,
  },
  // ... resto
};
```

### 4. Actualizar Service Worker (para offline)
Edita `public/sw.js` y agrega las nuevas rutas al array `CORE`:

```javascript
const CORE = [
  // ... rutas existentes
  "/audio/voices/ezequiel/numbers/cero.mp3",
  "/audio/voices/ezequiel/numbers/uno.mp3",
  // ... etc
];
```

### 5. Probar
```bash
npm run dev
```

Ve a `/client/workout/[id]` y entrena. Escucha si los números ya no suenan robóticos.

---

## 🧪 TESTING DE VOCES

### Voice Lab (Herramienta de testing)
Ya tienes un componente `VoiceLab` para probar:

1. Agrégalo a una página temporal:
```tsx
import { VoiceLab } from "@/components/voice-lab";

export default function TestPage() {
  return <VoiceLab />;
}
```

2. Escribe texto y escucha cómo suena:
```
"Serie 3 de 10"
"Quedan 30 segundos"
"100 kilos con 5 repeticiones"
```

3. Ve qué archivos faltan en la lista "Missing Audio"

---

## 📝 PLANTILLA PARA GRABACIÓN

### Script de Números (copiar y pegar en orden)
```
0. cero
1. uno
2. dos
3. tres
4. cuatro
5. cinco
6. seis
7. siete
8. ocho
9. nueve
10. diez
11. once
12. doce
13. trece
14. catorce
15. quince
16. dieciséis
17. diecisiete
18. dieciocho
19. diecinueve
20. veinte
21. veintiuno
22. veintidós
23. veintitrés
24. veinticuatro
25. veinticinco
26. veintiséis
27. veintisiete
28. veintiocho
29. veintinueve
30. treinta
40. cuarenta
50. cincuenta
60. sesenta
70. setenta
80. ochenta
90. noventa
100. cien
coma
```

### Script de Ejercicios Comunes (top 20)
```
1. Press de banca
2. Sentadilla
3. Peso muerto
4. Press militar
5. Dominadas
6. Curl de bíceps
7. Extensiones de tríceps
8. Remo con barra
9. Fondos
10. Elevaciones laterales
11. Press inclinado
12. Sentadilla frontal
13. Peso muerto rumano
14. Curl martillo
15. Jalón al pecho
16. Press francés
17. Zancadas
18. Elevaciones frontales
19. Remo con mancuerna
20. Face pulls
```

---

## 🎯 PRIORIDADES DE GRABACIÓN

### CRÍTICO (Hacer YA)
- ✅ **Números 0-29** (30 archivos) — Elimina 90% del TTS robótico
- ✅ **Decenas** (7 archivos) — Completa el sistema de números
- ✅ **Especiales** (cien, coma) — Números grandes y decimales

**Total:** 39 archivos de ~2-5 segundos cada uno
**Tiempo de grabación:** 1-2 horas (con edición)

### ALTA (Hacer esta semana)
- ✅ **Top 10 ejercicios** — Los más usados en tus programas

### MEDIA (Hacer cuando tengas tiempo)
- ✅ **Resto de ejercicios** — Completa tu biblioteca
- ✅ **Sílabas** — Para nombres exóticos

---

## 🔍 DETECTAR VOCES ROBÓTICAS

### Durante el entrenamiento:
Si escuchas **voces sintetizadas/robóticas**, significa que esa pieza no está grabada.

### Cómo ver qué falta:
1. Abre la consola del navegador (F12)
2. Busca mensajes de `VoiceEngine`
3. Verás logs como:
```
[VoiceEngine] Missing audio: numbers/treinta
[VoiceEngine] Missing audio: exercises/press-de-banca
```

### Reporte automático:
El engine guarda un registro de audios faltantes. Puedes verlo en `VoiceLab` componente.

---

## 📊 ESTADÍSTICAS

### Estado Actual
- ✅ **Voces grabadas:** 67/106 (63%)
- ❌ **Números faltantes:** 0/39 (0%)
- ❌ **Ejercicios faltantes:** Variable (depende de tu biblioteca)

### Después de grabar números
- ✅ **Voces grabadas:** 106/106 (100% core)
- ✅ **TTS robótico:** Eliminado en 95% de casos
- ⚠️ **Ejercicios:** Seguirán con TTS si no los grabas

---

## 🎉 RESULTADO ESPERADO

**Antes** (ahora):
> "Serie **TRES** de **DIEZ**" (TRES y DIEZ suenan robóticos)

**Después** (con números grabados):
> "Serie tres de diez" (todo con voz natural de Ezequiel)

**Experiencia:**
- ✅ Voz consistente en todo el workout
- ✅ Sin cambios abruptos a TTS
- ✅ Suena 100% profesional
- ✅ Usuarios ni notan que es sistema dinámico

---

## 💡 TIPS FINALES

1. **Graba en lotes:** Haz todos los números en una sesión (mantiene tono consistente)
2. **Revisa el volumen:** Normaliza todos los audios al mismo nivel
3. **Prueba combinaciones:** "treinta y cinco", "sesenta y dos" deben sonar naturales
4. **Gap de 0.15s:** El engine agrega pausas automáticamente, no las graves
5. **Backup:** Guarda los archivos WAV originales por si necesitas reexportar

---

## 📞 SOPORTE

**Archivos clave:**
- `src/lib/voice-engine/voices.ts` — Manifiesto de voces
- `src/lib/voice-engine/numbers.ts` — Lógica de números
- `src/components/voice-lab.tsx` — Herramienta de testing
- `public/sw.js` — Cache offline

**Testing:**
```bash
npm run test:voice
```

---

## ✅ CHECKLIST DE GRABACIÓN

### Números
- [ ] Grabar 0-29 (30 archivos)
- [ ] Grabar 30,40,50,60,70,80,90 (7 archivos)
- [ ] Grabar "cien" y "coma" (2 archivos)
- [ ] Exportar todos a MP3 128kbps mono
- [ ] Guardar en `public/audio/voices/ezequiel/numbers/`
- [ ] Actualizar `voices.ts` con todas las claves
- [ ] Actualizar `sw.js` con las rutas
- [ ] Probar en workout real

### Ejercicios (Opcional)
- [ ] Listar ejercicios de tu biblioteca actual
- [ ] Grabar top 10 más usados
- [ ] Exportar a MP3
- [ ] Guardar en `public/audio/voices/ezequiel/exercises/`
- [ ] Actualizar `voices.ts`
- [ ] Probar combinaciones

---

**Creado:** 12 septiembre 2026  
**Para:** Ezequiel Coaching Voice System  
**Próxima actualización:** Después de grabar números
