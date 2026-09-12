/**
 * CommandPalette — alias de la implementación unificada (Fase 3 R-next).
 * Antes había dos palettes (CommandPalette y CommandPalettePro); ahora existe
 * una sola: command-palette-pro.tsx, con roles, favoritos y búsqueda dinámica.
 * Este shim mantiene los imports existentes (trainer-nav) sin duplicación.
 */
export { CommandPalettePro as CommandPalette } from "@/components/command-palette-pro";
