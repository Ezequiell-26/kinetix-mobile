# KinetixFitt — AI Control Center

This is the first document a coding agent should read when asked to continue improving, fix bugs, finish the project, integrate an API/repository, or review everything.

## Start here

Run the repository audit before making changes:

```bash
node scripts/ai-repo-audit.mjs
node scripts/ai-repo-audit.mjs --json
node scripts/ai-repo-audit.mjs --strict
```

Then read, in order:

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/AI_ENGINEERING_SYSTEM.md`
4. `.ai/AI_EVALUATION_PROTOCOL.md`
5. `.ai/AI_AGENT_HANDOFF.md`
6. `.ai/PROJECT_STATE.md`
7. `.ai/FEATURE_LEDGER.md`
8. `.ai/INTEGRATION_REGISTRY.md`
9. `.ai/PERFORMANCE_BASELINES.md`
10. the relevant contract in `.ai/`
11. the relevant ADR in `.ai/DECISIONS/`
12. the relevant skill(s) in `.github/skills/`
13. the actual source, tests, schema, workflows and deployment configuration

The audit is a map generator, not a claim that the software works.

## Skill routing

Select skills by risk instead of asking one generic prompt to solve every problem:

- debugging → `.github/skills/debugging/SKILL.md`
- architecture → `.github/skills/architecture/SKILL.md`
- API reliability → `.github/skills/api-reliability/SKILL.md`
- DB/migrations → `.github/skills/database-migrations/SKILL.md`
- security → `.github/skills/security-audit/SKILL.md`
- external APIs/repos → `.github/skills/integration-review/SKILL.md`
- AI/model providers → `.github/skills/ai-integration/SKILL.md`
- performance → `.github/skills/performance-audit/SKILL.md`
- mobile/native/PWA/desktop → `.github/skills/mobile-native/SKILL.md`
- UX/accessibility → `.github/skills/ux-accessibility/SKILL.md`
- dependency changes → `.github/skills/dependency-governance/SKILL.md`
- tests/regressions → `.github/skills/test-and-regression/SKILL.md`
- release/observability → `.github/skills/release-observability/SKILL.md`
- independent review → `.github/skills/code-review/SKILL.md`

For high-risk work, the implementing agent must not be the only evaluator. Use an independent review pass.

## Mandatory durable registries

### Feature truth
`.ai/FEATURE_LEDGER.md` is the canonical place to record important product capabilities and their evidence.

### External integrations
`.ai/INTEGRATION_REGISTRY.md` is the canonical place to record APIs, SDKs, providers and external repositories.

### Performance
`.ai/PERFORMANCE_BASELINES.md` is the canonical place to record measured performance and cross-device baselines.

When these registries become stale after a meaningful change, downgrade the affected evidence until re-verified.

## Current state model

For every important claim distinguish:

`KNOWN_GOOD | KNOWN_BROKEN | UNKNOWN | BLOCKED_EXTERNAL`

Never treat UNKNOWN as an invitation to guess.

## Change ownership

Every iteration must name one risk cluster and one accountable change surface. Do not mix unrelated architecture, UI and dependency rewrites into one large autonomous change.

## Independent verification

For substantial changes:

```text
IMPLEMENT
↓
FOCUSED TESTS
↓
AFFECTED GATES
↓
INDEPENDENT ADVERSARIAL REVIEW
↓
RE-AUDIT
```

The reviewer must actively attempt to falsify the implementation rather than merely summarize it.

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
search by integration/provider name
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

## API/repository integration gate

When a new API or external repository is proposed, classify it:

`USE | ADAPT | EXTRACT | REJECT`

Then register the decision in `.ai/INTEGRATION_REGISTRY.md`.

The integration must have:

```text
purpose
source/version
license/terms
security review
compatibility
adapter boundary
input validation
output normalization
timeout
retry/backoff
rate limits
fallback
observability
tests
runtime verification
removal strategy
```

## Performance gate

Every meaningful performance optimization must be measured when measurement is available and must preserve correctness, accessibility and security.

Never use an unsupported `100% performance` claim. Use measured budgets and regression thresholds.

## Change budget

A single AI iteration should target one coherent risk cluster.

## Required verification ladder

After editing:

```text
1. focused test
2. focused typecheck/lint
3. affected integration/security tests
4. affected build
5. independent code review for substantial/high-risk changes
6. broader repository gates
7. diff review
8. registry/state update
9. final branch/commit verification
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

When the human says “seguí mejorando todo” or equivalent:

```text
AUDIT CURRENT REPO
↓
READ DURABLE REGISTRIES
↓
SELECT REQUIRED SKILLS
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
INDEPENDENT REVIEW
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
SKILLS USED:
FILES CHANGED:
KNOWN-GOOD BEHAVIOR PRESERVED:
NEW BEHAVIOR:
TESTS ACTUALLY RUN:
BUILD ACTUALLY RUN:
RUNTIME/PROVIDER CHECKS ACTUALLY RUN:
INDEPENDENT REVIEW:
EVIDENCE LEVEL:
KNOWN UNVERIFIED AREAS:
MIGRATION/DEPLOYMENT IMPACT:
ROLLBACK:
NEXT HIGHEST-RISK ITEM:
```

This report is a factual ledger, not a marketing summary.

## Golden rule

**The next AI must be able to understand the project better than the previous AI did, without trusting the previous AI blindly.**
