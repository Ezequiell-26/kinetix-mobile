# VISUAL_REFERENCE_ANALYSIS.md — Lectura artística de la referencia FitSync

Análisis del lenguaje visual de la referencia (no del contenido). Esto define qué imitamos: **principios**, no píxeles.

## Composición y proporciones
- **Una zona dominante por pantalla.** El hero ocupa ~55-60% del ancho útil y la mayor altura del primer viewport; el resto es soporte. Nada compite con el hero.
- **Rail lateral de progreso**: el anillo de objetivo semanal vive al costado del hero (columna estrecha, altura similar), no como widget flotante separado.
- **Densidad alta controlada**: mucha información, poco chrome. La información se apila con jerarquía tipográfica, no con cajas.

## Tratamiento de superficies (la clave anti-"SaaS")
- **NO hay grid de cards iguales.** Las secciones son niveles de superficie distintos: página (azul-negro) → panel (gris grafito sutil) → hero (panel con profundidad: gradiente radial de acento + viñeta + textura).
- Los bloques se separan por **espacio y jerarquía tipográfica** más que por bordes. Los bordes existen pero son casi invisibles (1px, bajo contraste).
- Radios grandes (20-24px) solo en bloques contenedores; elementos internos más chicos.

## Tipografía y números
- **El título del hero es display enorme** (2 líneas máx), el elemento tipográfico más grande de la pantalla después del saludo.
- **Los números de métricas son grandes y tabulares**; los labels son micro-caps con tracking amplio. La pareja número-grande/label-chico es EL patrón repetido.
- Saludo personal: nombre en display bold + frase de estado en texto secundario. Nada de banners.

## Progreso
- **Anillos finos** (stroke delgado, cap redondeado) con el % gigante adentro y label micro debajo.
- **Barras de semana**: columnas finas con el día de hoy acentuado; el resto neutro.
- El progreso SIEMPRE tiene denominador visible (0/4, 78% de objetivo).

## CTAs
- **Un CTA dominante por pantalla**: píldora/rectángulo full-width del color de identidad, texto bold, alto ~52-56px. Los secundarios son ghost/texto.
- El CTA vive DENTRO del hero, abajo, ocupando el ancho del bloque.

## Listas (ejercicios, comidas)
- **Nunca tablas planas**: filas con monograma numerado circular, título truncado, meta a la derecha, separadas por aire (no líneas). Escaneables en <1s.
- Chips de metadata (duración, dificultad, cantidad) con icono pequeño + texto.

## Métricas
- **Strip horizontal con divisores internos** (una superficie, no 4 cards sueltas): icono pequeño + número grande + label micro, separados por hairlines.
- Progressive disclosure: 4 métricas visibles; el resto en hubs.

## Imágenes / profundidad
- La referencia usa **fotografía dentro del hero** (atleta) con overlay oscuro para que el texto flote.
- Sin foto disponible, el equivalente premium es: **gradiente radial del acento + formas geométricas difuminadas + patrón sutil** (grid/glow) + tipografía enorme. Nunca un rectángulo gris plano.
- Sombras suaves y profundas (no bordes duros) para elevar el hero.

## Color
- Fondo azul-negro; superficies graphite; UN acento (esmeralda) para progreso/CTA/estados positivos; violeta exclusivo de IA; naranja/rojo solo esfuerzo/alertas. 90% de la pantalla es neutra.

## Header / nav
- Header de una línea: marca compacta + búsqueda + estado de usuario (avatar+nombre) + iconos. Sin cajas.
- Bottom nav móvil: dock limpio, item activo = acento (pill o fill), iconos de línea, labels micro. 44px+ táctil.

## Espacio negativo
- Intencional: separación generosa ENTRE zonas (24-32px), densa DENTRO de cada zona. El contenido importante entra en el primer viewport.
