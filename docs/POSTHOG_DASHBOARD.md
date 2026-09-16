# PostHog — Funnel Onboarding + Revenue MRR Dashboard

> **Proyecto:** KinetixFitt (mobile + web) · **Analytics:** PostHog (`posthog-js` 1.430.3) · **Última:** 2026-09-15

---

## 1. En qué consiste

**Funnel Onboarding (step1→step4 + completed)**

- Eventos en orden estricto, mismo `distinct_id` (PostHog lo agrupa por persona).
- Funnel de 6 pasos (recomendado) o 4 pasos (core):
  1. `onboarding_started` `{ funnel: "onboarding_main" }`
  2. `onboarding_step_viewed` `{ step: 1, step_name: "welcome" }`
  3. `onboarding_step_viewed` `{ step: 2, step_name: "goal" }`
  4. `onboarding_step_viewed` `{ step: 3, step_name: "days" }`
  5. `onboarding_step_viewed` `{ step: 4, step_name: "place" }`
  6. `onboarding_completed` `{ funnel: "onboarding_main" }`

También se emiten duplicados `onboarding_funnel_step` y `onboarding_step` por compatibilidad — usar cualquiera para el funnel, pero **no mezclar**.

**Revenue MRR Tracking**

- Evento primario: `payment_completed` con `revenue`, `$revenue`, `mrr`, `currency`, `plan`, `provider`.
- Secundarios: `revenue_tracked`, `revenue_mrr_updated`, `checkout_completed`, `subscription_started`, `mrr_dashboard_viewed`, `revenue_dashboard_viewed`, `trainer_payments_viewed`.
- Propiedades numéricas: `price`, `amount`, `mrr`, `monthly_recurring_revenue`, `revenue`.

Dashboard combina funnel (conversión por paso) + revenue (MRR acumulado, tendencia).

---

## 2. Configuración previa

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com  # o https://eu.i.posthog.com
```

- Si usas `phc_placeholder_…` el SDK hace `opt_out_capturing()` y no envía.
- `initPostHog()` se llama en `PostHogProvider` (`apps/mobile/src/components/posthog-provider.tsx` y `apps/web/components/posthog-provider.tsx`).
- Verificar en DevTools: `localStorage["ph_posthog"]` y network a `*.i.posthog.com/capture`.

---

## 3. Instrumentación (código)

### Mobile — onboarding funnel (step1→step4)

```ts
// lib/posthog.ts
import { trackOnboardingStarted, trackOnboardingFunnelStep, trackOnboardingCompleted } from "@/lib/posthog";

trackOnboardingStarted({ source: "mobile_onboarding_flow" });
trackOnboardingFunnelStep(1, { goal: "Hipertrofia" }); // → welcome
trackOnboardingFunnelStep(2, { goal: "Hipertrofia" }); // → goal
trackOnboardingFunnelStep(3, { days: 4 });             // → days
trackOnboardingFunnelStep(4, { place: "Gimnasio" });   // → place
trackOnboardingCompleted({ goal, days, place, source: "mobile_onboarding_flow" });
```

Componentes ya instrumentados:
- `src/components/onboarding-flow.tsx` (5 pasos UI → funnel 4)
- `src/components/onboarding-wizard.tsx` (7 pasos → primeros 4 mapean al funnel)
- ambos usan `trackOnboardingFunnelStep(1|2|3|4)` para orden garantizado.

### Mobile — revenue MRR (payments-pro.tsx + trainer/payments)

```ts
import { trackCheckoutStarted, trackCheckoutCompleted, trackPaymentCompleted } from "@/lib/posthog";

// Al hacer click en Stripe/MP
trackCheckoutStarted({ plan: "personalizado", provider: "stripe", price: 45000, currency: "ARS", email });
capture("payment_started", { plan, provider, price, mrr: 45000, currency: "ARS" });

// Tras confirmar (demo) — esto alimenta el dashboard revenue
trackCheckoutCompleted({ plan, provider, price, currency: "ARS" });
trackPaymentCompleted({ amount: 45000, currency: "ARS", plan, provider, mrr: 45000, billing_period: "monthly" });
// → emite payment_completed + revenue_tracked + revenue_mrr_updated
```

Trainer:
- `src/components/payments-pro.tsx` → `PaymentsPro` captura `trainer_payments_viewed` en mount + plan selected + checkout iniciado/completado con `revenue`/`mrr`.
- `src/components/revenue-analytics.tsx` → captura `revenue_dashboard_viewed` + `mrr_dashboard_viewed` con `mrr` real (suma de `Subscription` con `status: "ACTIVA"`).
- `src/components/trainer-revenue-pro.tsx` → idem `mrr_dashboard_viewed`.
- `src/components/posthog-tracker.tsx` → `TrainerAnalyticsTracker` y `TrainerPaymentsTracker` usados en `trainer/analytics/page.tsx` y `trainer/payments/page.tsx`.

### Web

`apps/web/lib/posthog.ts` tiene mismas helpers (`trackOnboardingFunnelStep`, `trackPaymentCompleted`, `trackMRRViewed`).

---

## 4. Crear Funnel en PostHog UI (paso a paso)

1. **PostHog → Insights → New insight → Funnels**
2. Add step 1: Event `onboarding_started` where `funnel = onboarding_main`
3. Steps 2-5:
   - Event `onboarding_step_viewed` where `step = 1` (y `step_name = welcome`)
   - Event `onboarding_step_viewed` where `step = 2` (`goal`)
   - Event `onboarding_step_viewed` where `step = 3` (`days`)
   - Event `onboarding_step_viewed` where `step = 4` (`place`)
   > Alternativa: usar `onboarding_funnel_step` con mismo filtro `funnel_order`.
4. Step 6: Event `onboarding_completed` where `funnel = onboarding_main`
5. **Filters globales:** `source = mobile_onboarding_flow` o `onboarding_wizard` para separar variantes, o dejar sin filtro para global.
6. **Conversion window:** 7 days, **Order:** Sequential, **Exclusion:** opcional `onboarding_abandoned`.
7. Save as **“Kinetix — Onboarding Funnel 1→4”** → Add to dashboard.
8. **Breakdown:** por `goal`, `place`, `days`, `role`, `source` para ver qué variantes convierten mejor.
9. **Ver conversión:** Funnel debe mostrar drop-off por paso; objetivo > 65% end-to-end (welcome→completed).

**Funnel alternativo 4 pasos core (si prefieres sin welcome):**
- Steps = `goal (2)` → `days (3)` → `place (4)` → `completed`; comparar ambos.

---

## 5. Crear Revenue / MRR Dashboard en PostHog UI

### Insight A — MRR Trend (Line)

- Insight type: **Trends** → **Line**
- Series: Event `payment_completed` → aggregation **Sum** of property `mrr` (o `revenue` / `monthly_recurring_revenue`) grouped by `day`/`week`.
- Filter: `currency = ARS`, `provider = stripe | mp` (breakdown por provider).
- Display: `Total value` + `Compare to previous period`.
- Save as **“MRR — Sum por día”**.

### Insight B — Revenue Total (Number)

- Trends → **Number**
- Series: Event `revenue_tracked` or `payment_completed` → **Sum** `revenue`, `currency = ARS`.
- Save as **“Revenue 30d”**.

### Insight C — Payments table + Churn

- Trends → **Table** or **Retention** (si usas `subscription_started/cancelled`)
- Series A: `subscription_started` count
- Series B: `subscription_cancelled` count → deriva **churn %** (B/A*100).
- O usar `revenue_mrr_updated` where `churn = true` para churn events.
- Breakdown por `plan` (basico/personalizado/premium).

### Insight D — Checkout funnel (opcional)

- Funnel: `checkout_plan_selected` → `checkout_started` → `checkout_completed` → `payment_completed`.
- Para medir conversión Stripe vs MP.

### Ensamblar Dashboard

1. **Dashboards → New dashboard → “Kinetix — Revenue & Onboarding”**
2. Add todos los insights previos + el funnel onboarding.
3. Añadir filtros globales: `currency`, `provider`, `plan`, `source=mobile|web`.
4. Share → habilitar para equipo trainer.

---

## 6. Propiedades estándar (referencia)

| Propiedad | Tipo | Ejemplo | Eventos |
|---|---|---|---|
| `funnel` | string | `onboarding_main` | onboarding_* |
| `step` / `funnel_order` | number | `1..5` | onboarding_step_viewed/funnel_step |
| `step_name` | string | `welcome/goal/days/place` | onboarding_* |
| `source` | string | `mobile_onboarding_flow` | onboarding_*, trainer_* |
| `plan` / `plan_id` | string | `personalizado` | checkout_*, payment_* |
| `provider` | string | `stripe`, `mp` | checkout_*, payment_* |
| `price` / `amount` / `revenue` / `$revenue` | number | `45000` | checkout_*, payment_* |
| `mrr` / `monthly_recurring_revenue` | number | `45000` | payment_completed, revenue_* |
| `currency` | string | `ARS` | todos revenue |
| `billing_period` | string | `monthly` | payment_completed |

`revenue` y `$revenue` duplicados a propósito: PostHog reconoce `$revenue` para revenue analytics nativo.

---

## 7. Verificación

```bash
# mobile (debe dar 0 errores)
cd apps/mobile && npx tsc --noEmit

# Probar eventos en dev (placeholder opt-out deshabilitado con key real)
NEXT_PUBLIC_POSTHOG_KEY=phc_... npm run dev
# Abrir http://localhost:3001 → DevTools console: [PostHog capture] onboarding_started ...
# PostHog → Activity → Live events debe mostrar onboarding_step_viewed step=1..4 secuenciales

# Revenue
# Click en /trainer/payments → elegir plan → Pagar con Stripe/MP → debe verse payment_completed con mrr=revenue
```

**Test checklist:**
- [ ] `onboarding_started` → 4× `onboarding_step_viewed` (1..4) → `onboarding_completed` en orden.
- [ ] `checkout_started` + `payment_started` → `checkout_completed` + `payment_completed` + `revenue_mrr_updated` tras checkout demo.
- [ ] `mrr_dashboard_viewed` / `revenue_dashboard_viewed` al abrir `/trainer/analytics`.
- [ ] `trainer_payments_viewed` al abrir `/trainer/payments`.
- [ ] Funnel PostHog muestra 6 steps ordenados sin gaps.

---

## 8. Ubicación del código

- `apps/mobile/src/lib/posthog.ts` — helpers funnel + MRR
- `apps/web/lib/posthog.ts` — parity web
- `apps/mobile/src/components/onboarding-flow.tsx` — funnel 1→4 + completed
- `apps/mobile/src/components/onboarding-wizard.tsx` — funnel 1→4 mapping
- `apps/mobile/src/components/payments-pro.tsx` — checkout + payment_completed (MRR)
- `apps/mobile/src/components/revenue-analytics.tsx` — revenue dashboard viewed
- `apps/mobile/src/components/trainer-revenue-pro.tsx` — idem
- `apps/mobile/src/components/posthog-tracker.tsx` — page-level trackers
- `apps/mobile/src/app/(trainer)/trainer/analytics/page.tsx` — MRR real desde Prisma + tracker
- `apps/mobile/src/app/(trainer)/trainer/payments/page.tsx` — MRR real + tracker

---

## 9. Notas PostHog dashboard (no-code)

PostHog no tiene “dashboard as code” importable por defecto; este doc es la **fuente de verdad**. Si usas PostHog Cloud + API, puedes crear insights vía `POST /api/projects/{id}/insights` con `filters: { insight: "FUNNELS", events: [...] }`, pero el flujo recomendado es UI (ver sección 4-5). Para automatizar, usa `posthog-cli` o `curl` contra `https://app.posthog.com/api/projects/<id>/dashboards/`.

