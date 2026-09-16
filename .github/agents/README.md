# KinetixFitt AI Agent System

The repository uses specialized agents so open-ended improvement work is decomposed by risk instead of being handled by one generic agent.

## Agent routing

- `repo-architect.md` — architecture boundaries, duplication, dependency direction, monorepo health.
- `security-guardian.md` — auth, authorization, secrets, CSRF, uploads, payments and webhooks.
- `reliability-engineer.md` — API failures, retries, idempotency, queues, offline sync and data consistency.
- `performance-engineer.md` — bundle size, rendering, caching, Web Vitals, PWA and native performance.
- `ux-product-engineer.md` — information architecture, interaction quality, accessibility and premium UX.
- `ai-systems-engineer.md` — AI gateway, model adapters, prompts, tool boundaries, cost and evals.
- `mobile-platform-engineer.md` — PWA, Capacitor, Electron, iOS/Android capability boundaries.
- `test-engineer.md` — unit/integration/E2E coverage, regression tests and adversarial cases.
- `release-engineer.md` — CI/CD, deployment evidence, observability and release gates.
- `code-reviewer.md` — independent adversarial review; attempts to falsify the change.

## Autonomous loop

For an open-ended request such as `seguí mejorando`:

`audit → select risk cluster → read skill → implement smallest safe change → focused proof → independent review → re-audit → merge if verified → select next risk cluster`

One iteration should have one primary risk cluster. A new iteration may immediately begin after the previous one finishes, but it must reconstruct truth from Git rather than trust conversation memory.

## Non-negotiable rules

1. Never delete functionality merely to simplify the project.
2. Never weaken security, types or tests to make a gate pass.
3. Never claim runtime/provider/device success from static code inspection.
4. Preserve known-good behavior and rerun its proof after changes.
5. Update `.ai/FEATURE_LEDGER.md`, `.ai/INTEGRATION_REGISTRY.md` or `.ai/PERFORMANCE_BASELINES.md` when affected.
6. Merge to `main` only after the applicable verification ladder passes or an external blocker is explicitly recorded.
