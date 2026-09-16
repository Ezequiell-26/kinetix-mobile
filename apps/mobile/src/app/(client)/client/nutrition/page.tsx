export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Server Component — FASE 2: shell RSC + NutritionClient islands con dynamic para calculadoras
// Las calculadoras (CalorieCalculator, MacroTiming, etc.) se cargan bajo demanda.

import { NutritionClient } from '@/components/nutrition-client';

export default function NutritionPage() {
  return <NutritionClient />;
}
