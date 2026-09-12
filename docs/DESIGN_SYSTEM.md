# DESIGN_SYSTEM.md — FitSync Premium (EZEQUIEL COACHING)

Filosofía: **completa por dentro, simple por fuera.** Un solo sistema de tokens; ningún componente define colores propios.

## Tokens (variables CSS en `globals.css`)

| Token | Dark | Light | Uso |
|---|---|---|---|
| `--bg` | `#0A0F14` (azul-negro) | `#FAFAFA` | fondo de página |
| `--surface` | zinc-900 (`#111318`*) | `#F2F2F2` | cards |
| `--surface-elevated` | zinc-950 | `#F7F7F8` | tiles internos |
| `--border` | `#1F2937`/zinc-800 | `#E4E4E7` | bordes |
| `--text-primary` | `#F4F6F8` | `#0A0A0A` | títulos |
| `--text-secondary` | zinc-400 | `#52525B` | cuerpo |
| `--text-muted` | zinc-500/600 | `#8E8E99` | metadata |
| `--primary` | `#34D399` (esmeralda) | `#059669` | identidad, CTAs, progreso |
| `--primary-hover` | `#6EE7B7` | `#047857` | hover |
| `--success` | emerald-400 | emerald-600 | éxito, cumplido |
| `--warning` | amber-400 | amber-600 | pendiente, esfuerzo |
| `--danger` | red-400 | red-600 | riesgo, alertas |
| `--info` | sky-400 | sky-600 | hidratación, info |
| `--ai` / `--premium` | violet-400 | violet-600 | Coach IA, VIP |

\* superficies zinc estándar de Tailwind (los componentes usan `bg-zinc-900`); el tinte azul-negro lo aportan `--bg` y los gradientes.

## Reglas de aplicación

1. **Un solo acento.** El esmeralda es EL color. Violeta solo para IA/premium. Rojo/naranja solo esfuerzo/alertas. Azul solo info/hidratación.
2. **Cómo se usa el acento en componentes Tailwind:** hex `#34D399` en clases (`bg-[#34D399]`, `text-[#34D399]`) — migración mecánica desde `#D6FF2A` ya aplicada en todo `src/`. En modo claro, `globals.css` remapea `text-[#34D399]` → `#047857` para contraste AA.
3. **Botones:** PRIMARY = `bg-[#34D399] text-black font-black`; SECONDARY = `bg-white text-black border` (dark) / borde oscuro (light); TERTIARY = texto + flecha; siempre `min-h-[44px]` en móvil.
4. **Cards:** `rounded-[20px]`, borde zinc-800, superficie zinc-900, jerarquía = label pequeño uppercase → dato grande → metadata.
5. **Tipografía:** Space Grotesk (display, `-tracking-tight`) para H1-H2; Inter para todo lo demás. Escala: H1 24-30/900 · H2 20/800 · H3 14-16/700 · body 13-14 · caption 11-12 · metadata 10 uppercase tracking-widest.
6. **Iconografía:** solo `lucide-react`, 16-20px, stroke consistente. Sin emojis (regla de producto).
7. **Motion:** CountUp/ProgressRing/ProgressBar de `animated-stats.tsx` (arrancan en 0, respetan `prefers-reduced-motion`); FadeIn/Stagger de `ui-premium.tsx` para entrada de secciones; hover-lift sutil en cards clickeables. Nada que baile: máx 350ms entradas, 1.2s anillos.
8. **Estados vacíos:** título empático + qué hacer + CTA. Nunca "No hay datos".
9. **Premium:** badge pequeño violeta ("VIP/PRO") o acento; nunca banners de venta.

## Componentes base (`src/components/ui/*`)
`card · badge · button · input · tabs · progress · skeleton` — todos consumen los tokens de arriba. Nuevos componentes deben construirse solo con estas piezas + tokens.
