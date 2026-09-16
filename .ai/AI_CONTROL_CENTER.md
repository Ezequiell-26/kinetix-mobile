# KinetixFitt — AI Control Center

This is the first document a coding agent should read when asked to **continue improving, fix bugs, finish the project, or review everything**.

## Start here

Run the repository audit before making changes:

```bash
node scripts/ai-repo-audit.mjs
node scripts/ai-repo-audit.mjs --json
```

Then read, in order:

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/AI_ENGINEERING_SYSTEM.md`
4. `.ai/PROJECT_STATE.md`
5. the relevant contract in `.ai/`
6. the relevant ADR in `.ai/DECISIONS/`
7. the actual source, tests, schema, workflows and deployment configuration

The audit is a map generator, not a claim that the software works.

## The rule that prevents AI from breaking good code

Never start from the request alone.

Start from the current repository.

For every requested improvement, establish:

`CURRENT STATE → KNOWN GOOD BEHAVIOR → KNOWN BROKEN BEHAVIOR → UNKNOWN → CHANGE → PROOF`

A missing proof is an explicit unknown, not a reason to guess.

## What the agent must discover

### Product surface

Identify all existing user journeys and entry points for:

- authentication and account lifecycle;
- coach/trainer workflows;
- athlete/client workflows;
- training/program/workout execution;
- progress and analytics;
- check-ins and messaging;
- notifications and PWA;
- nutrition;
- recovery;
- calculators;
- AI features;
- payments/subscriptions;
- uploads/private assets;
- backups/recovery;
- mobile/native/desktop features;
- community/social features when implemented.

### Technical surface

Map:

`web → API → authorization → domain → database/storage → external provider → state/UI`

and separately:

`mobile/PWA/native → bridge → platform service → server`

Never assume the web and mobile applications are interchangeable.

## Feature truth table

For every important feature, record:

| Feature | Entry point | Backend | Data | External | Auth boundary | Tests | Status | Evidence | Gaps |
|---|---|---|---|---|---|---|---|---|---|

Statuses:

`COMPLETE | PARTIAL | MOCK | BROKEN | BLOCKED_EXTERNAL | NOT_IMPLEMENTED`

Evidence:

`UNVERIFIED | E2_STATIC | E3_AUTOMATED | E4_RUNTIME`

Do not mark `COMPLETE` merely because a route/component exists.

## Known-good preservation

When a feature already has working tests or runtime evidence:

1. preserve the contract;
2. write down the invariants;
3. change the smallest possible surface;
4. rerun the same proof after the change.

A refactor that cannot preserve the existing proof is not a safe default.

## Anti-duplication search

Before creating a new helper/service/component/API/schema:

```text
search by filename
search by exported symbol
search by domain concept
search by route/path
search by database model
search by environment variable
```

There should be one canonical cross-cutting implementation unless an ADR explicitly permits more than one.

## Anti-hallucination rules

The agent must verify every external fact it relies on.

Never invent:

- an endpoint because its name looks obvious;
- a Prisma field because another model has a similar field;
- a provider API because an SDK package exists;
- a native capability because a device supports it;
- a test because a test filename exists;
- a deployment because a Vercel/GitHub configuration exists;
- a successful payment/email/push/AI response without provider/runtime evidence.

When uncertain, search the repository first. If still uncertain, label it `UNKNOWN` and avoid destructive changes.

## Anti-bug protocol

For each bug:

### Reproduce

Find the exact failing path or the strongest available static evidence.

### Isolate

Identify the smallest responsible boundary.

### Fix

Prefer a local, compatible correction over a rewrite.

### Regression test

Add a test that fails before the fix and passes after it whenever practical.

### Re-audit

Search for the same bug pattern elsewhere before closing the issue.

## High-risk mandatory checks

### Auth/authorization

Validate ownership server-side. At minimum test tenant A vs tenant B.

### Payments

Validate trusted provider state, signed webhooks, duplicate delivery, idempotency, and persistent state transitions.

### Database

Check schema, migration ordering, constraints, indexes, destructive behavior and compatibility with existing data.

### Storage/uploads

Validate type/signature/size, path safety, ownership, private access and cleanup lifecycle.

### AI

Validate provider selection, timeout/retry policy, input limits, output handling, cost/rate controls, privacy, and failure behavior. Never turn an AI placeholder into a claimed production integration.

### Offline/native/PWA

Check cache invalidation, stale writes, conflict policy, bridge compatibility, permissions, secure storage and platform-specific failure states.

## Change budget

A single AI iteration should target one coherent risk cluster.

Example clusters:

- auth/security;
- database/migrations;
- payments;
- API contracts;
- uploads/storage;
- CI/build;
- E2E;
- performance;
- accessibility;
- UI/UX.

Do not combine a high-risk backend rewrite with unrelated design work.

## Required verification ladder

After editing:

```text
1. focused test
2. focused typecheck/lint
3. affected integration/security tests
4. affected build
5. broader repository gates
6. diff review
7. final branch/commit verification
```

For runtime-dependent functionality, add the real runtime/provider/device check when available.

## Never do this to make progress look better

Do not:

- delete failing tests;
- skip tests in CI;
- weaken TypeScript;
- add broad `any` casts;
- swallow errors;
- remove authorization checks;
- replace real services with fake success responses;
- delete old code before proving replacement behavior;
- rewrite entire files from memory;
- claim production readiness from static inspection;
- update completion documents without re-verifying the underlying behavior.

## Open-ended improvement algorithm

When the human says **“seguí mejorando todo”** or equivalent:

```text
AUDIT CURRENT REPO
↓
FIND RELEASE BLOCKERS
↓
FIX BROKEN GATES
↓
FIX SECURITY/DATA RISKS
↓
FIX REGRESSION-PRONE ARCHITECTURE
↓
COVER CRITICAL USER JOURNEYS
↓
IMPROVE RELIABILITY/OBSERVABILITY/PERFORMANCE/ACCESSIBILITY
↓
IMPROVE PRODUCT FLOWS
↓
POLISH UI/UX
↓
RE-AUDIT FROM SCRATCH
```

Never jump directly to visual polish while a higher-risk subsystem is unverified or broken.

## Truth maintenance

The repository may contain historical documents that say a feature is complete. Do not inherit that claim automatically.

When code and documentation disagree:

`actual source/tests/runtime > contracts/ADR > current project state > older summaries`

Update stale documentation only after the underlying state is re-verified.

## Final AI report

Every iteration must end with:

```text
BRANCH:
COMMIT:
CHANGE CLUSTER:
FILES CHANGED:
KNOWN-GOOD BEHAVIOR PRESERVED:
NEW BEHAVIOR:
TESTS ACTUALLY RUN:
BUILD ACTUALLY RUN:
RUNTIME/PROVIDER CHECKS ACTUALLY RUN:
EVIDENCE LEVEL:
KNOWN UNVERIFIED AREAS:
MIGRATION/DEPLOYMENT IMPACT:
ROLLBACK:
NEXT HIGHEST-RISK ITEM:
```

This report is a factual ledger, not a marketing summary.

## Golden rule

**The next AI must be able to understand the project better than the previous AI did, without trusting the previous AI blindly.**
