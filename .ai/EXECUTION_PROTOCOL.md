# KinetixFitt — AI Execution Protocol

**Version:** 3.0.0  
**Status:** Mandatory  
**Purpose:** ensure every AI agent changes the repository incrementally, safely, and with verifiable evidence.

## 1. PHASE 0 — READ THE RULES

Always read:

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/PROJECT_STATE.md`
4. `.ai/DEFINITION_OF_DONE.md`
5. the contract relevant to the task
6. relevant ADRs

Never skip these because the change appears small.

## 2. PHASE 1 — BASELINE

Capture:

- current branch;
- current commit;
- working tree status;
- affected package/app;
- existing test/build status when feasible.

Do not start on a dirty/unexplained working tree without first identifying whether the changes belong to the task.

## 3. PHASE 2 — IMPACT ANALYSIS

Search before editing.

Check:

- symbol usages;
- imports/exports;
- API consumers;
- routes;
- Prisma models/relations;
- stores/hooks;
- environment variables;
- platform-specific code;
- tests;
- docs/contracts.

For high-risk changes, explicitly document the blast radius.

## 4. PHASE 3 — PLAN

Choose the smallest safe implementation.

The plan must include:

- objective;
- files/modules affected;
- dependencies;
- migration needs;
- tests;
- rollback considerations;
- known external prerequisites.

Do not expand scope merely because adjacent improvements are visible.

## 5. PHASE 4 — IMPLEMENT IN SMALL STEPS

Prefer commits that each leave the project understandable and recoverable.

Avoid:

- giant rewrites;
- unrelated refactors;
- mass formatting;
- dependency upgrades unrelated to the task;
- simultaneous architecture and feature migrations.

If a large migration is necessary, split it into compatibility-preserving stages.

## 6. PHASE 5 — EARLY VALIDATION

After the first meaningful change, run the cheapest relevant check.

Examples:

- typecheck for type changes;
- unit test for pure logic;
- API test for endpoint behavior;
- migration test for schema changes.

Do not wait until hundreds of lines have changed before discovering a basic error.

## 7. PHASE 6 — FULL VALIDATION

For affected projects run as applicable:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Also run:

- security tests;
- integration tests;
- E2E tests;
- platform builds;
- migration verification;

when the change requires them.

## 8. PHASE 7 — DIFF REVIEW

Review the actual diff.

Look for:

- accidental deletions;
- unrelated modifications;
- changed API contracts;
- changed DB behavior;
- secret exposure;
- dependency churn;
- disabled tests;
- weakened security;
- generated artifacts;
- performance regressions.

## 9. PHASE 8 — REGRESSION REVIEW

Ask:

“What existing user journey could this change break?”

For every material risk, test the affected journey.

Minimum critical journeys:

- auth;
- trainer/client ownership;
- workout logging;
- progress;
- nutrition/recovery where affected;
- messaging;
- payments;
- deployment.

## 10. PHASE 9 — DOCUMENT

Update only what changed.

Update:

- contracts;
- `PROJECT_STATE.md`;
- ADRs;
- README/deployment docs;

when applicable.

Never preserve known false statements just because they are old documentation.

## 11. PHASE 10 — COMMIT

Use an atomic Conventional Commit.

Examples:

`feat:`
`fix:`
`refactor:`
`perf:`
`test:`
`docs:`
`ci:`
`build:`
`chore:`

The commit message must describe the actual change, not an aspirational result.

## 12. PHASE 11 — VERIFY THE COMMIT

After committing, verify:

- commit exists;
- expected files changed;
- no unintended files changed;
- working tree is clean or intentionally dirty;
- checks correspond to the committed state.

## 13. DATABASE CHANGE PROTOCOL

For schema changes:

`DESIGN → MIGRATION → TEST → CI → PREVIEW/STAGING → PRODUCTION`

Never rewrite migration history to make CI pass.

For destructive changes, require a documented recovery/data plan.

## 14. SECURITY CHANGE PROTOCOL

For auth, authorization, secrets, storage, or payments:

1. identify trust boundaries;
2. identify attack paths;
3. implement smallest safe change;
4. add/adjust security tests;
5. review logs and error messages;
6. verify no secrets exposed.

## 15. PAYMENT CHANGE PROTOCOL

Payment changes require:

- server-side price/product validation;
- signature verification;
- idempotency;
- persisted state transitions;
- duplicate webhook tests;
- failure tests;
- no frontend fake success.

## 16. AI CHANGE PROTOCOL

For AI features:

- keep provider secrets server-side;
- preserve provider abstraction;
- validate inputs/outputs;
- enforce limits/timeouts;
- handle provider failure;
- never fabricate completion;
- never silently replace a real integration with a mock.

## 17. CROSS-PLATFORM PROTOCOL

When shared code changes, evaluate web, PWA, Android, iOS, desktop, and server runtime as applicable.

Never import platform-exclusive APIs through shared layers accidentally.

## 18. FAILURE PROTOCOL

When a required check fails:

`STOP → READ FULL ERROR → ISOLATE → FIX → RE-RUN`

Do not:

- skip the test;
- weaken the rule;
- hide the error;
- mark the task complete.

If blocked by external configuration, use `BLOCKED_EXTERNAL` and state exactly what is missing.

## 19. ROLLBACK PROTOCOL

Before risky releases identify:

- previous known-good commit;
- application rollback method;
- DB compatibility/rollback method;
- feature-flag fallback when available;
- recovery verification.

## 20. MULTI-AGENT HANDOFF

An agent must leave enough evidence for the next agent to continue safely:

- files changed;
- behavior changed;
- tests run;
- known limitations;
- migration/API impact;
- remaining work.

Never assume the next agent has context from the conversation.

## 21. FINAL OUTPUT FORMAT

Every agent completion report must contain:

```text
TASK:

CHANGES:

FILES:

TESTS:

TYPECHECK:

LINT:

BUILD:

SECURITY:

DEPLOY/PREVIEW:

KNOWN LIMITATIONS:

FINAL STATUS:
```

Use only verified facts.

## 22. GOLDEN LOOP

`UNDERSTAND → CHANGE SMALL → VERIFY EARLY → VERIFY FULL → REVIEW DIFF → DOCUMENT → COMMIT → VERIFY`

The protocol is designed to make safe progress the default behavior for every AI agent.
