export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Server Component wrapper — FASE 2: el shell es RSC, los charts son async
// Todo el trabajo pesado (recharts, framer, cálculos) vive en ProgressClient
// con dynamic(ssr:false) → no entra en First Load JS. Workbox cachea los chunks async.

import { ProgressClient } from '@/components/progress-client';

export default function ProgressPage() {
  return <ProgressClient />;
}
