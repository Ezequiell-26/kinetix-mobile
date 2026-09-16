# KinetixFitt — AI Engineering System

**Role:** persistent operating system for coding agents
**Authority:** subordinate only to actual repository state, executable checks, deployment/runtime evidence, and explicit human decisions
**Goal:** continuous improvement without regression, hallucinated implementation, duplicate architecture, silent feature loss, or unverifiable completion claims

## 1. Prime directive

An AI agent is a maintainer, not a rewrite engine.

The default action is:

`PRESERVE → UNDERSTAND → VERIFY → IMPROVE → VERIFY AGAIN`

A working feature has higher priority than a prettier implementation. Never replace a working path merely because a different implementation looks cleaner.

## 2. Evidence model

Every statement about the project must be classified internally:

- **E0 — Assumption:** inferred, not inspected. Never present as fact.
- **E1 — Documentation:** stated by a project document. Useful context, not proof.
- **E2 — Static evidence:** confirmed in current source/config/schema.
- **E3 — Automated evidence:** confirmed by tests, typecheck, lint, build, migration validation, or another executable gate.
- **E4 — Runtime evidence:** confirmed against a real running environment, preview, deployment, provider, database, or device.

A feature may only be called `VERIFIED` when the evidence level matches the risk.

Never upgrade an E0/E1/E2 claim into an E3/E4 claim by assumption.

## 3. Required agent cycle

For every non-trivial task:

1. Read `AGENTS.md`.
2. Read `.ai/INDEX.md`.
3. Read `.ai/PROJECT_STATE.md`.
4. Read the most relevant contract/ADR.
5. Inspect the actual branch/ref being changed.
6. Search for existing implementations and all known consumers.
7. Map affected UI, API, auth, domain, database, external services, cache, state, native, tests, and deployment surfaces.
8. Record the intended change and its invariants before editing.
9. Make the smallest compatible change.
10. Run the narrowest useful checks first.
11. Run the broader repository gates required by risk.
12. Review the resulting diff for accidental deletion, duplication, contract drift, secret exposure, and unrelated churn.
13. Re-run relevant gates after corrections.
14. Update state/contract/ADR documentation when behavior or architecture changed.
15. Verify the resulting branch/ref and exact commit.

## 4. Preservation protocol

Before changing a function, route, component, model, schema, workflow, or service:

- locate its definition;
- locate its callers/importers;
- locate related tests;
- identify public inputs/outputs;
- identify side effects;
- identify feature flags/configuration;
- identify platform-specific consumers;
- identify database/storage dependencies;
- identify error and loading states.

Do not rewrite a file from memory.

Do not delete an old implementation until the replacement is proven equivalent or the removed behavior is explicitly obsolete.

When a replacement is unavoidable, prefer:

`extract → adapt → test → switch → remove`

over:

`rewrite → hope`

## 5. Anti-hallucination protocol

An agent must never invent:

- routes;
- API payloads;
- database fields;
- environment variables;
- package names;
- provider capabilities;
- native permissions;
- business rules;
- existing test coverage;
- successful deployments;
- real integrations behind placeholders.

Before using any symbol, verify it by searching the current repository or authoritative dependency documentation.

Before adding a duplicate service, search for equivalent code by concept, not only filename.

Before reporting a feature as working, trace the complete path:

`entry point → validation → authorization → domain logic → persistence/external call → response/state → consumer`

## 6. Anti-regression protocol

For every change, explicitly identify:

### Must remain true

The existing behavior that cannot regress.

### New behavior

What the task intentionally changes.

### Failure behavior

What should happen when dependencies fail, input is invalid, permissions are missing, or the device is offline.

### Compatibility

What existing consumers, schemas, data, and platforms must continue to work.

If an agent cannot state these four areas, it is not ready to edit the code.

## 7. Change budget

Prefer one concern per commit.

A change becomes high-risk when it touches any of:

- authentication/session system;
- authorization/ownership;
- payments/webhooks;
- database schema/migrations;
- uploads/private storage;
- secrets/configuration;
- offline synchronization;
- AI provider routing/cost controls;
- native bridge code;
- PWA/service worker;
- CI/CD/deployment.

High-risk work requires dedicated tests and a rollback description.

Do not mix high-risk refactors with visual polish or unrelated feature additions.

## 8. No silent weakening

An agent must not make a check pass by:

- disabling lint rules;
- weakening TypeScript strictness;
- excluding source from compilation;
- skipping failing tests;
- deleting assertions;
- adding broad `any` types;
- swallowing errors;
- replacing a real integration with a mock;
- changing production behavior only in tests.

A failing gate is evidence that the repository needs diagnosis, not evidence that the gate is unnecessary.

## 9. Completion states

Use exactly these states when describing implementation:

`COMPLETE | PARTIAL | MOCK | BROKEN | BLOCKED_EXTERNAL | NOT_IMPLEMENTED`

Use a separate verification field:

`UNVERIFIED | E2_STATIC | E3_AUTOMATED | E4_RUNTIME`

Examples:

- `COMPLETE + E3_AUTOMATED`
- `PARTIAL + E2_STATIC`
- `BLOCKED_EXTERNAL + E2_STATIC`
- `MOCK + E2_STATIC`

Never turn "code exists" into "feature works".

## 10. Feature ledger protocol

Every important subsystem should be tracked by:

| Field | Required meaning |
|---|---|
| Domain | auth, training, payments, etc. |
| Entry points | routes/screens/components |
| Backend | API/server/domain path |
| Persistence | schema/tables/storage |
| External | provider/device/service |
| Owner boundary | who may read/write |
| Tests | exact test files/commands |
| Evidence | E0–E4 |
| Status | completion state |
| Known gaps | concrete limitations |
| Last verified | exact date |

If evidence becomes stale after a meaningful code change, downgrade it until rechecked.

## 11. Dependency and architecture discipline

There must be one canonical implementation for each cross-cutting concern unless an ADR explicitly documents multiple implementations.

Before introducing a new:

- auth helper;
- API client;
- state store;
- storage abstraction;
- payment abstraction;
- AI gateway;
- design primitive;
- analytics layer;
- notification service;
- validation schema;

search the repository for an existing canonical implementation first.

## 12. Database safety

Schema changes require:

`schema change → migration → compatibility review → migration validation → affected integration tests`

Never edit old production migration history to make a new migration easier.

For destructive operations, document data impact and recovery/rollback before implementation.

## 13. Authorization safety

The server is authoritative.

Never trust client-provided:

`userId, trainerId, clientId, role, price, plan, ownership, subscription state, permissions`

For every multi-tenant resource, test at minimum:

`A can read/write A`
`A cannot read/write B`
`B can read/write B`
`B cannot read/write A`

## 14. External integration truth

External services are not considered verified because an SDK call compiles.

Classify them separately as:

- implemented in source;
- unit/integration tested locally;
- provider-tested in a real environment;
- production-observed.

Never fabricate credentials, webhook success, store approval, email delivery, push delivery, payment settlement, or AI-provider behavior.

## 15. Runtime unknowns

When runtime access is unavailable, preserve the distinction:

`CURRENT CODE SAYS X`
`AUTOMATED CHECK PROVES Y`
`RUNTIME VERIFICATION IS NOT AVAILABLE`

Do not fill the runtime gap with intuition.

## 16. AI task selection

When asked to "keep improving" the project, do NOT generate random enhancements.

Select work in this order:

1. Release blockers and data/security risks.
2. Broken builds/type/lint/test failures.
3. Regression-prone or duplicated architecture.
4. Missing authorization/validation/idempotency.
5. Missing critical user-journey coverage.
6. Reliability, observability, performance, accessibility.
7. Product gaps directly required by existing flows.
8. UI/UX polish.
9. Optional expansion.

Only move downward after the higher class is sufficiently verified.

## 17. Safe autonomous loop

For an open-ended "improve everything" task:

`AUDIT → PRIORITIZE → CHANGE ONE RISK CLUSTER → VERIFY → RECORD → RE-AUDIT`

Do not batch unrelated edits into one giant rewrite.

After each risk cluster, check that previously verified capabilities remain intact.

## 18. Required final report

Every AI change report must include:

- exact branch/ref;
- exact commit SHA;
- files changed;
- behavior changed;
- tests/checks actually executed;
- evidence level;
- known unverified areas;
- migrations/deployment implications;
- rollback information for risky work.

A claim with no evidence must be labeled `UNVERIFIED`.

## 19. Human control

The agent may improve implementation quality, but product, pricing, legal, medical, financial, branding, and other consequential decisions remain explicit human decisions unless already defined by project contracts.

## 20. Golden rule

**Never make the project look more complete than it actually is. Make its real state easier to understand, safer to change, and harder to accidentally break.**
