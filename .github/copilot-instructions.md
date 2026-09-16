# KinetixFitt — AI Review & Coding Instructions

These instructions apply to AI coding and code-review agents operating on this repository.

## Mandatory context

Before meaningful work, read:

1. `AGENTS.md`
2. `.ai/AI_CONTROL_CENTER.md`
3. `.ai/AI_ENGINEERING_SYSTEM.md`
4. `.ai/PROJECT_STATE.md`
5. relevant `.ai/*_CONTRACT.md`
6. relevant `.ai/DECISIONS/*`
7. `.ai/FEATURE_LEDGER.md`
8. `.ai/INTEGRATION_REGISTRY.md`
9. `.ai/PERFORMANCE_BASELINES.md`

Then inspect the actual source, tests, package manifests, lockfiles, schemas, migrations and workflows affected by the task.

## Grounding rules

Never infer implementation from a filename, README, previous agent message or task wording.

Never invent routes, fields, SDK methods, environment variables, providers, tests or platform capabilities.

Code existence is not proof of functionality. Compilation is not proof of runtime correctness. A green unit test is not proof of end-to-end correctness.

Every claim must identify its evidence level.

## Preserve working behavior

Before modifying an existing capability:

- identify callers/importers;
- identify public input/output contracts;
- identify persistence and side effects;
- identify related tests;
- identify platform consumers;
- identify known-good behavior.

Prefer the smallest compatible change. Avoid whole-file rewrites unless explicitly justified.

## Independent review

The implementing agent is not the final authority on its own work.

For substantial changes, perform an independent review pass after implementation. The review must attempt to falsify the implementation and search for:

- regression;
- authorization bypass;
- missing validation;
- race conditions;
- stale-cache behavior;
- incorrect assumptions;
- broken error handling;
- resource leaks;
- missing tests;
- performance regressions;
- cross-platform incompatibilities;
- accidental deletion or duplication.

## Required verification ladder

Run the narrowest relevant check first, then expand:

`focused test → focused lint/typecheck → affected integration/security tests → affected build → broader gates → diff review → re-audit`

For runtime-dependent behavior, use actual runtime/provider/device evidence when available.

## External APIs / SDKs / repositories

Before integration:

`discover → verify official docs → verify license/terms → search existing equivalent → security review → compatibility review → adapter → validation → timeout/retry/fallback → tests → observability → registry → runtime verification`

Keep provider-specific payloads behind an adapter/interface. Do not spread third-party response shapes through the product.

## AI agent safety

Do not execute destructive commands, rotate secrets, alter production data, rewrite migration history, or disable gates as part of ordinary improvement work.

High-risk actions require explicit human control according to the repository's AI governance documents.

## Pull requests

A PR description must state:

- exact change;
- preserved behavior;
- risk;
- tests actually run;
- runtime verification actually performed;
- migration/deployment impact;
- rollback;
- known unverified areas.

Do not approve a PR only because the diff is small or tests are green.

## Evidence over confidence

If uncertain, write `UNKNOWN` or `UNVERIFIED` and investigate. Never convert uncertainty into a confident implementation claim.
