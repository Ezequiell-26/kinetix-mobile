# KinetixFitt — AI Engineering Constitution

**Status:** NORMATIVE / MANDATORY  
**Version:** 3.0.0  
**Applies to:** Every human and AI agent modifying this repository  
**Primary goal:** allow KinetixFitt to evolve continuously without sacrificing correctness, security, data integrity, performance, compatibility, or user experience.

---

## 0. NON-NEGOTIABLE PRINCIPLE

An agent must leave the repository in a state that is **at least as safe as it was before the task**.

Never trade:

- correctness for speed;
- security for convenience;
- stability for feature count;
- real integration for a mock;
- maintainability for a quick patch;
- existing behavior for an unverified rewrite.

**No agent can guarantee that software will never break. These rules are designed to make accidental breakage difficult, detectable, reversible, and attributable.**

---

## 1. SOURCE OF TRUTH

The source of truth is, in order:

1. actual repository state;
2. executable tests and checks;
3. current architecture/contracts;
4. deployment/runtime evidence;
5. documentation;
6. commit messages and agent claims.

Documentation can be stale. A commit message is not proof. A file existing is not proof of functionality.

Before any meaningful change, inspect the current branch, commit, working tree, affected code, dependencies, contracts, tests, and deployment constraints.

---

## 2. NO FALSE COMPLETION

Never claim `COMPLETE`, `FIXED`, `SECURE`, `PRODUCTION READY`, `REAL`, or `VERIFIED` without evidence.

A feature is COMPLETE only when all applicable layers are connected and validated:

`UI → API/Application → Authorization → Domain → Data → External Services → Persistence → UI state`

plus relevant tests, build, documentation, and regression review.

Use these states honestly:

- `COMPLETE`
- `PARTIAL`
- `MOCK`
- `BROKEN`
- `BLOCKED_EXTERNAL`
- `NOT_IMPLEMENTED`

---

## 3. MANDATORY CHANGE LOOP

For every task:

`READ → SEARCH → MAP IMPACT → PLAN → CHANGE → TEST → REVIEW DIFF → RE-TEST → DOCUMENT → COMMIT → VERIFY`

### READ
Read `AGENTS.md`, `.ai/INDEX.md`, `.ai/PROJECT_STATE.md`, and the relevant contract before coding.

### SEARCH
Search for existing implementations, consumers, routes, schemas, hooks, tests, and utilities before creating anything new.

### MAP IMPACT
Identify direct and indirect dependencies. Think about data, API contracts, authentication, permissions, caches, stores, native platforms, build configuration, and external integrations.

### PLAN
Define the smallest safe change, expected files, tests, migration requirements, and rollback strategy when risk is non-trivial.

### CHANGE
Prefer incremental edits. Do not rewrite large areas unless the rewrite itself is justified and staged safely.

### TEST
Run the smallest relevant tests first, then the broader required gates.

### REVIEW DIFF
Review the actual diff for accidental changes, deletions, formatting churn, secret exposure, API breakage, dependency changes, and unrelated edits.

### RE-TEST
Run checks again after corrections.

### DOCUMENT
Update contracts/state/ADR when architecture or behavior changed.

### COMMIT
Use an atomic Conventional Commit.

### VERIFY
Confirm the committed tree, CI/preview status where available, and final branch state.

---

## 4. STOP CONDITIONS

An agent MUST stop making unrelated changes and report a blocker when it encounters:

- secret exposure;
- data-loss risk;
- migration ambiguity affecting production data;
- cross-user or cross-trainer authorization bypass;
- authentication regression;
- payment integrity problem;
- destructive command with unclear scope;
- failing build that cannot be safely diagnosed within the current task;
- conflicting architecture rules that cannot be resolved from existing ADRs/contracts.

Do not hide a blocker by weakening tests or removing validation.

---

## 5. PROTECTED SYSTEMS

Treat these as high-risk surfaces. Changes require dedicated tests and extra review:

- authentication/session management;
- authorization/ownership;
- PostgreSQL/Prisma/Supabase schema and migrations;
- payments/subscriptions/webhooks;
- file storage/uploads;
- secrets/configuration;
- offline sync/conflict resolution;
- AI provider routing and safety limits;
- native bridges (Swift/Kotlin/Capacitor/Electron);
- service workers/PWA caching;
- CI/CD and deployment configuration.

Never make speculative refactors in these areas while doing an unrelated feature.

---

## 6. AUTHORIZATION IS SERVER-SIDE

Never trust IDs, roles, prices, plan names, ownership flags, or permissions supplied by the client.

Every protected resource must be authorized on the server.

For multi-trainer data, validate ownership on every read/write/delete path where applicable. Cross-trainer access is a release blocker.

Minimum security fixture:

- Trainer A owns Client A;
- Trainer B owns Client B;
- A can access A and cannot access B;
- B can access B and cannot access A.

---

## 7. DATABASE RULES

PostgreSQL/Supabase is authoritative for persistent application data.

Never:

- use localStorage as a permanent database substitute;
- silently fall back to an in-memory store for production persistence;
- change production schema without a tracked migration;
- delete or rewrite an existing migration to repair history;
- create a destructive migration without a data-safety plan;
- commit ignored/untracked migrations accidentally.

Preferred migration strategy for risky changes:

`ADD → BACKFILL → DUAL COMPATIBILITY → SWITCH → CLEANUP`

Every schema change must account for indexes, foreign keys, uniqueness, nullability, cascading behavior, transactions, connection pooling, rollback implications, and existing data.

---

## 8. API CONTRACTS

Every important endpoint must have:

- validated input;
- authorization policy;
- stable response/error shape;
- predictable status codes;
- idempotency where needed;
- timeout/retry behavior where relevant;
- tests for success and failure.

Do not introduce a breaking API change without updating every known consumer or introducing a compatibility path.

---

## 9. PAYMENTS

Payment success must originate from the trusted payment provider/webhook flow, not from frontend state.

Never trust client-provided amount, currency, product, price, or subscription state.

No fake checkout, fake success, timeout-based payment simulation, or success alert may exist in production flows.

Webhooks must verify signatures and handle duplicate delivery safely.

Payment state transitions must be persistent and auditable.

---

## 10. SECRETS

Never commit:

- `.env` files containing secrets;
- API keys;
- database passwords;
- JWT secrets;
- payment secrets;
- service-role credentials;
- private tokens;
- SMTP passwords.

Use environment variables and secret managers.

If a secret is discovered in Git, immediately rotate it and remove the secret from active use. Removing the file alone is not enough.

---

## 11. DEPENDENCIES

Before adding a dependency:

1. search the existing repo for an equivalent;
2. justify why it is required;
3. check maintenance/security/license/size;
4. check platform compatibility;
5. update the correct lockfile;
6. run install/typecheck/test/build.

Never upgrade a large dependency set opportunistically during an unrelated task.

---

## 12. PERFORMANCE BUDGETS

Performance is a feature.

Avoid unnecessary:

- client components;
- JavaScript shipped to the browser;
- re-renders;
- polling;
- large images;
- 3D canvases;
- animations running continuously;
- duplicated network requests;
- N+1 database queries.

Use lazy loading and code splitting for heavy features.

Measure before and after for meaningful performance work.

---

## 13. 3D / MEDIA

3D, video, audio, and high-resolution media are expensive resources.

They must have:

- lazy loading;
- loading/error states;
- memory cleanup;
- device fallback where needed;
- reduced-motion behavior;
- mobile-safe defaults.

Never load a heavy 3D scene globally if the current route does not need it.

---

## 14. OFFLINE / SYNC

Offline behavior must fail safely.

Every sync system needs:

- deterministic queued operations;
- retry limits/backoff;
- conflict policy;
- idempotency or deduplication;
- observable failure state;
- recovery after reconnect.

Never silently overwrite newer server data with stale offline data.

---

## 15. AI AGENT RULES

AI agents must operate as maintainers, not as autonomous rewrite engines.

Before changing architecture, they must inspect existing contracts and ADRs.

An agent must not:

- invent APIs;
- invent database fields without checking schema;
- duplicate existing services;
- create parallel auth/state/payment systems;
- remove existing functionality to simplify a task;
- rename public contracts casually;
- disable lint/type errors to pass a gate;
- delete tests because they are inconvenient;
- create fake production integrations;
- claim external verification it did not perform.

When uncertain, preserve the existing behavior and choose the smallest reversible change.

---

## 16. CROSS-PLATFORM COMPATIBILITY

A change affecting shared code must be evaluated for:

- web;
- PWA;
- Android;
- iOS;
- desktop;
- server/runtime;
- build-time execution.

Do not import browser-only, Node-only, native-only, or server-only APIs into shared code without an explicit boundary.

---

## 17. UI / UX CONSISTENCY

Do not create a second design system.

Use existing design tokens, primitives, typography, spacing, motion, and accessibility patterns.

Every interactive feature needs appropriate:

- loading;
- empty;
- error;
- success;
- disabled;
- retry/fallback states.

Accessibility is part of correctness, not optional polish.

---

## 18. TESTING POLICY

Test proportional to risk.

### Required by risk

**Pure logic:** unit tests.

**Domain behavior:** unit + integration tests.

**API:** integration/API tests.

**Auth/authorization/payments/storage:** security + integration tests.

**Critical user journeys:** E2E tests.

**DB schema changes:** migration + integration tests.

Every fixed critical bug should gain a regression test.

---

## 19. QUALITY GATES

For affected projects, run:

- lint;
- typecheck;
- relevant unit/integration tests;
- security tests when applicable;
- build;
- E2E for affected critical journeys when applicable.

A red gate must not be hidden by changing scripts to skip the failing test.

---

## 20. GIT AND BRANCHING

Use feature branches for normal development.

Recommended flow:

`feature/* → PR → CI → review → main`

`develop` may remain the integration/development branch only when it is explicitly used as such by current repository configuration.

`main` is a stable release/integration target. Do not force-push it.

Normal work should not be developed directly on `main`.

Every commit must be atomic and understandable.

Use Conventional Commits:

- `feat:`
- `fix:`
- `refactor:`
- `perf:`
- `test:`
- `docs:`
- `build:`
- `ci:`
- `chore:`

---

## 21. PR / CHANGE REVIEW

Every significant change must answer:

1. What changed?
2. Why?
3. What can it affect?
4. What tests prove it?
5. What is the rollback path?
6. Did the public API/schema change?
7. Did security boundaries change?
8. Did dependency/build configuration change?

Do not merge large unrelated changes together.

---

## 22. ROLLBACK

For production-sensitive changes, define rollback before rollout.

Application rollback and database rollback are separate problems. Never assume reverting application code automatically reverts a database migration.

Use additive, backward-compatible migration strategies for high-risk changes whenever possible.

---

## 23. OBSERVABILITY

Production-critical flows must be diagnosable without exposing secrets.

Use structured logs, error tracking, request/correlation identifiers where appropriate, and audit logs for sensitive state transitions.

Never log passwords, raw tokens, secret keys, or full payment credentials.

---

## 24. DOCUMENTATION / ADR

Architecture changes require an ADR under `.ai/DECISIONS/`.

State changes require `.ai/PROJECT_STATE.md` updates when material.

Behavioral contracts belong in `.ai/*_CONTRACT.md`.

Do not leave contradictory documentation behind.

---

## 25. “IMPROVE, DO NOT JUST EXPAND”

Every feature addition should consider whether it can simultaneously improve:

- reliability;
- performance;
- accessibility;
- maintainability;
- security;
- observability;
- testability;
- user experience.

But do not use “improvement” as an excuse for unrelated scope expansion.

Prefer small compounding improvements over massive rewrites.

---

## 26. CLEAN REPOSITORY

Do not commit:

- generated caches;
- local logs;
- temporary debug files;
- OS artifacts;
- editor files;
- local secrets;
- unreviewed generated code;
- giant binaries unless intentionally managed.

Do not change `.gitignore` without understanding what files should actually be tracked.

Database migrations, source files, and deployment configuration that are part of the product must remain versioned.

---

## 27. FINAL REPORT MUST BE EVIDENCE-BASED

At task completion report:

- branch;
- commit;
- files changed;
- tests executed;
- build result;
- deployment/preview result when applicable;
- known limitations;
- follow-up work.

Use exact statuses. Never fabricate a green result.

---

## 28. GOLDEN RULE

> **Preserve first. Verify second. Improve third. Expand fourth.**

KinetixFitt must become more capable over time without becoming less reliable.

---

**This file is normative. If another project document contradicts it, stop and resolve the contradiction through an ADR before making a risky architectural change.**
