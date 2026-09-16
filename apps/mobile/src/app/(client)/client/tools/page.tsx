export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Server Component — FASE 2: hub de herramientas como RSC.
// Cada categoría (SleepTracker, HealthBox, etc.) es dynamic(ssr:false) dentro de ToolsClient
// → Code splitting por categoría. Workbox cachea cada chunk por separado.

import { ToolsClient } from '@/components/tools-client';

export default function ToolsPage() {
  return <ToolsClient />;
}
