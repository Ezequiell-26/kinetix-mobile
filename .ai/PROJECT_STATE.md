# KinetixFitt — Project State

**Status:** Living document / evidence-based  
**Last verified:** 2026-09-16  
**Repository:** `Ezequiell-26/kinetixFitt-mobile-and-web`

## 1. How to read this document

This file is CONTEXT, not proof.

Do not infer that a subsystem is production-ready because a feature appears in this document. Current code, tests, CI, deployment, and runtime evidence are authoritative.

Never copy an old metric or completion claim into a new report without re-verifying it.

For AI-driven continuous improvement, start with `.ai/AI_CONTROL_CENTER.md`, `.ai/AI_ENGINEERING_SYSTEM.md`, and `node scripts/ai-repo-audit.mjs`.

## 2. AI continuous-improvement control layer

The repository now contains a persistent operating layer intended to prevent regression and hallucinated completion claims:

- `.ai/AI_CONTROL_CENTER.md` — first entry point for open-ended improvement/audit work.
- `.ai/AI_ENGINEERING_SYSTEM.md` — preservation, evidence, anti-hallucination, risk, verification, rollback and performance rules.
- `.ai/FEATURE_LEDGER.md` — canonical living ledger for important product capabilities and evidence.
- `.ai/INTEGRATION_REGISTRY.md` — canonical registry for external APIs, SDKs, providers and repositories.
- `.ai/PERFORMANCE_BASELINES.md` — canonical registry for cross-device performance baselines and regressions.
- `scripts/ai-repo-audit.mjs` — dependency-free static repository inventory and risk-signal audit.
- `npm run ai:audit` / `ai:audit:json` / `ai:audit:strict` — repeatable audit commands.
- CI executes the strict static audit before dependency installation and the normal quality gates.

This layer provides static evidence and guardrails. It does NOT by itself prove production runtime behavior, external-provider delivery, store approval, or device behavior.

## 3. Current repository shape

The repository is a multi-package project containing application code, shared packages, AI governance, documentation, CI/CD and platform-specific code.

The repository currently contains both `apps/mobile` and `apps/web`. Their roles must remain explicit and must not silently drift into two competing production implementations.

## 4. Current technology signals from the repository

The current codebase includes, among other technologies:

- Next.js / React / TypeScript
- Prisma
- PostgreSQL / Supabase integration
- Stripe
- AWS S3 SDK
- Capacitor
- Electron
- Three.js / React Three Fiber
- Sentry
- Zod
- React Hook Form
- Recharts
- Framer Motion

The installed versions and exact package ownership must always be read from the current lockfiles/package manifests before upgrades or architecture changes.

## 5. Major product domains present

The repository contains or references functionality for:

- Coach / trainer workflows
- Athlete / client workflows
- authentication and sessions
- training/program/workout flows
- progress and analytics
- check-ins and messaging
- notifications / PWA
- nutrition
- recovery
- calculators
- 3D / interactive experiences
- AI-related functionality
- payments/subscriptions
- backups
- mobile/desktop platform integration

Presence of code is not equivalent to end-to-end completion.

## 6. Verification policy

The current state of every important subsystem must be classified using:

- `COMPLETE`
- `PARTIAL`
- `MOCK`
- `BROKEN`
- `BLOCKED_EXTERNAL`
- `NOT_IMPLEMENTED`

A state claim requires evidence from current code/tests/build/deployment/runtime as applicable.

## 7. Known governance facts

`AGENTS.md` is the repository-wide engineering constitution for AI and human contributors.

`.ai/INDEX.md` defines the document hierarchy and routing rules.

`.ai/AI_CONTROL_CENTER.md` defines how an agent starts and prioritizes open-ended improvement work.

`.ai/AI_ENGINEERING_SYSTEM.md` defines evidence levels and preservation/verification rules.

`.ai/FEATURE_LEDGER.md` defines the feature evidence ledger.

`.ai/INTEGRATION_REGISTRY.md` defines external dependency governance.

`.ai/PERFORMANCE_BASELINES.md` defines measured performance tracking.

`.ai/DEFINITION_OF_DONE.md` defines completion gates.

`.ai/EXECUTION_PROTOCOL.md` defines the mandatory incremental change workflow.

`.ai/DECISIONS/` is the location for architectural decision records.

## 8. Main branch policy

`main` is intended to represent a stable integration/release state.

Normal feature work should happen on feature branches and enter `main` only after appropriate verification/review.

Repository settings/branch protection must be checked directly; this document does not itself enforce GitHub settings.

## 9. Database policy

PostgreSQL/Supabase is the intended persistent data source for the current architecture.

All production schema changes must use versioned migrations and compatibility-aware deployment steps.

Do not describe database persistence as verified without a real persistence test for the affected path.

## 10. Security policy

Security-sensitive changes must be tested separately from ordinary feature logic.

Critical surfaces include:

- authentication
- sessions
- authorization/ownership
- payments
- webhooks
- storage
- secrets
- database migrations
- offline sync
- native bridges

## 11. Current release gate

A production release is blocked until all release-critical areas have a current evidence-based status and all applicable gates pass.

At minimum:

- build
- typecheck
- lint
- relevant tests
- security tests
- database migration validation
- deployment/preview validation
- critical user journeys

Payment, authorization, secret-management, and deployment failures are release blockers.

## 12. Updating this document

Update this document after material changes to:

- architecture
- database/schema
- authentication/security
- payment systems
- storage
- platforms
- deployment
- major product capabilities
- AI governance or repository verification tooling
- external integrations
- performance baselines

Use exact dates and verifiable statements.

## 13. Principle

**KinetixFitt should gain capabilities over time without losing reliability.**
