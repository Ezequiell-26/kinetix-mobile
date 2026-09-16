# AI Engineering V4 Gates

This file summarizes the mandatory controls added in the current governance layer.

## Before edit

- Read the AI Control Center and handoff.
- Run the static repository audit.
- Update `.ai/CHANGE_MANIFEST.json` with the actual scope.
- Search for an existing implementation before creating a new one.
- Identify high-risk surfaces.

## During edit

- Keep public API contracts stable unless migration is explicit.
- Preserve authorization and ownership boundaries.
- Keep integrations behind adapters.
- Avoid unrelated refactors and dependency churn.
- Do not weaken tests or CI to make a change pass.

## After edit

Run, as applicable:

```text
npm run ai:audit:strict
npm run ai:change:manifest
npm run ai:api:audit
npm run ai:evidence:compare
npm run typecheck
npm run lint
npm run test
npm run build
```

Then perform runtime/browser verification for affected UI and product journeys. Record unknowns instead of guessing.

## Evidence hierarchy

`source` < `typecheck` < `unit/contract test` < `build` < `runtime E2E` < `real provider/device`.

A lower evidence level must never be reported as a higher one.
