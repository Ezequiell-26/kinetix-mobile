# KinetixFitt — Multi-Agent / Parallel Work Protocol

**Version:** 3.0.0  
**Status:** Mandatory for concurrent AI/human sessions

## Goal

Allow multiple agents to work in parallel while minimizing conflicts, duplicated systems, broken builds, data corruption, and accidental overwrites.

## 1. BRANCH ISOLATION

Every session uses its own branch.

Recommended:

```bash
git fetch origin
 git switch -c feat/<domain>-<short-name> origin/develop
```

Do not perform normal feature work directly on `develop` or `main`.

`main` is the stable integration/release branch.

## 2. CLAIM A DOMAIN

Before parallel work, claim a domain in `.ai/CLAIMS.md`.

Suggested domains:

- web-ui
- mobile-ui
- backend-api
- database
- auth-security
- payments
- storage
- nutrition
- recovery
- training
- analytics
- ai
- 3d
- native
- rust-wasm
- testing
- infra-deploy
- documentation

One active session should own one primary domain at a time.

If two sessions need the same hot area, coordinate the change rather than overwriting each other.

## 3. HOT FILES

Treat these as conflict-prone:

- `package.json`
- `package-lock.json`
- `apps/*/package.json`
- Prisma schema/migrations
- auth/security modules
- payment modules
- `next.config.*`
- `tsconfig*`
- `.gitignore`
- shared packages
- CI workflows
- design tokens
- service workers
- routing/layout files

Do not casually edit hot files for an unrelated feature.

## 4. SYNC BEFORE PUSH

Before pushing a branch:

```bash
git fetch origin
git rebase origin/develop
```

If the branch is targeting `main` directly under an approved release workflow, sync with the current target first.

Never force-push shared branches.

Never use destructive commands against work you did not create.

## 5. FORBIDDEN DESTRUCTIVE COMMANDS

Do not run against shared/unfamiliar work:

```bash
git reset --hard
 git clean -fd
 git checkout -- .
 git restore .
```

unless the exact files and consequences are explicitly known and belong to the current task.

## 6. NO PARALLEL DUPLICATE SYSTEMS

Before creating a new:

- auth system;
- store;
- API helper;
- database client;
- design primitive;
- payment abstraction;
- AI provider abstraction;
- notification system;
- cache;
- sync engine;

search first.

If an existing implementation can be extended safely, extend it.

## 7. SHARED CONTRACTS

Changes to shared types, schemas, APIs, or design tokens have a wide blast radius.

Treat them as integration changes and update consumers/tests before declaring completion.

## 8. DATABASE COORDINATION

Only one concurrent branch should normally own a given migration/schema change.

Do not create two competing migrations for the same model change.

Resolve migrations before merge.

Never rewrite published migration history to resolve a merge conflict.

## 9. DEPENDENCY COORDINATION

Avoid simultaneous dependency upgrades from multiple branches.

A dependency upgrade should be isolated, tested, and merged before unrelated branches depend on it when practical.

## 10. HANDOFF

Every completed session records:

- domain;
- branch;
- files changed;
- behavior changed;
- tests run;
- known issues;
- migrations/API effects;
- follow-up work.

Update `.ai/PROJECT_REALITY.md` when the project reality materially changes.

## 11. MERGE ORDER

Prefer:

`feature branches → CI → review → integration → main`

Resolve high-risk foundation changes before dependent feature changes.

Example:

`database contract → API → UI`

not the reverse.

## 12. CONFLICT RESOLUTION

When merge/rebase conflicts affect behavior, never choose a side blindly.

Reconstruct intended behavior from:

- current main/develop;
- task requirement;
- contracts;
- tests;
- ADRs.

Then resolve intentionally and rerun the relevant gates.

## 13. PARALLEL AGENT SAFETY RULE

More agents do not automatically mean faster delivery.

If parallelism increases merge conflicts or duplicated work, reduce concurrency.

Prefer independent domains with low shared-file overlap.

## 14. FINAL INTEGRATION GATE

Before integration:

- diff reviewed;
- relevant tests pass;
- no secrets;
- no accidental deletions;
- no migration conflict;
- no API contract breakage;
- no known authorization regression;
- build passes for affected app(s).

## 15. PRINCIPLE

**Parallel work is safe only when ownership, contracts, isolation, and verification are explicit.**
