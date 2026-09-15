# KinetixFitt — Project State

**Status:** Living document / evidence-based  
**Last verified:** 2026-09-15  
**Repository:** `Ezequiell-26/kinetixFitt-mobile-and-web`

## 1. How to read this document

This file is CONTEXT, not proof.

Do not infer that a subsystem is production-ready because a feature appears in this document. Current code, tests, CI, deployment, and runtime evidence are authoritative.

Never copy an old metric or completion claim into a new report without re-verifying it.

## 2. Current repository shape

The repository is a multi-package project containing application code, shared packages, AI governance, documentation, CI/CD and platform-specific code.

The repository currently contains both `apps/mobile` and `apps/web`. Their roles must remain explicit and must not silently drift into two competing production implementations.

## 3. Current technology signals from the repository

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

## 4. Major product domains present

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

## 5. Verification policy

The current state of every important subsystem must be classified using:

- `COMPLETE`
- `PARTIAL`
- `MOCK`
- `BROKEN`
- `BLOCKED_EXTERNAL`
- `NOT_IMPLEMENTED`

A state claim requires evidence from current code/tests/build/deployment/runtime as applicable.

## 6. Known governance facts

`AGENTS.md` is the repository-wide engineering constitution for AI and human contributors.

`.ai/INDEX.md` defines the document hierarchy and routing rules.

`.ai/DEFINITION_OF_DONE.md` defines completion gates.

`.ai/EXECUTION_PROTOCOL.md` defines the mandatory incremental change workflow.

`.ai/DECISIONS/` is the location for architectural decision records.

## 7. Main branch policy

`main` is intended to represent a stable integration/release state.

Normal feature work should happen on feature branches and enter `main` only after appropriate verification/review.

Repository settings/branch protection must be checked directly; this document does not itself enforce GitHub settings.

## 8. Database policy

PostgreSQL/Supabase is the intended persistent data source for the current architecture.

All production schema changes must use versioned migrations and compatibility-aware deployment steps.

Do not describe database persistence as verified without a real persistence test for the affected path.

## 9. Security policy

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

## 10. Current release gate

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

## 11. Updating this document

Update this document after material changes to:

- architecture
- database/schema
- authentication/security
- payment systems
- storage
- platforms
- deployment
- major product capabilities

Use exact dates and verifiable statements.

## 12. Principle

**KinetixFitt should gain capabilities over time without losing reliability.**
