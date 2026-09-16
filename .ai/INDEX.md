# KinetixFitt — AI Governance Index

**Version:** 3.1.0  
**Status:** Mandatory navigation map  
**Last updated:** 2026-09-16

## Start every AI session here

When an agent is asked to continue, improve, fix, finish, refactor, or audit the project, read:

1. `../AGENTS.md`
2. `.ai/AI_CONTROL_CENTER.md`
3. `.ai/AI_ENGINEERING_SYSTEM.md`
4. `.ai/PROJECT_STATE.md`
5. `.ai/DEFINITION_OF_DONE.md`
6. the relevant contract(s)
7. relevant ADRs
8. the actual source/tests/config/schema/workflows affected by the task

Before changing code, run:

```bash
npm run ai:audit
npm run ai:audit:json
```

The audit creates fresh static evidence. It does not prove runtime/provider/device/deployment behavior.

## Authority order

When documents disagree, use this order:

1. `../AGENTS.md` — engineering constitution; highest repository-level authority.
2. `.ai/DECISIONS/*` — accepted architectural decisions for their scope.
3. Area contracts — normative rules for specific systems.
4. `DEFINITION_OF_DONE.md` — completion gates.
5. `EXECUTION_PROTOCOL.md` — required change workflow.
6. `PROJECT_STATE.md` / `ROADMAP_STATE.md` — current state/context, updated as reality changes.
7. README and feature docs — user/developer guidance.

If a conflict affects security, data, production behavior, or architecture, stop and resolve it through an ADR before taking a risky action.

## Core AI safety documents

- `AI_CONTROL_CENTER.md` — entry point for continuous improvement and anti-regression behavior.
- `AI_ENGINEERING_SYSTEM.md` — persistent operating rules, evidence levels, preservation protocol, change budget, and completion truth.
- `PROJECT_STATE.md` — evidence-based current-state context.
- `DEFINITION_OF_DONE.md` — completion gates.
- `EXECUTION_PROTOCOL.md` — incremental change workflow.

## Contracts by area

### Architecture
- `ARCHITECTURE_CONTRACT.md`

### UI / Design
- `DESIGN_SYSTEM_CONTRACT.md`
- `MOTION_CONTRACT.md`

### Performance / 3D
- `PERFORMANCE_CONTRACT.md`
- `3D_CONTRACT.md`

### Data / Backend
- `DATABASE_CONTRACT.md`
- `API_CONTRACT.md`

### Security / Quality
- `SECURITY_CONTRACT.md`
- `TESTING_CONTRACT.md`
- `GIT_CONTRACT.md`

### Platforms / Specialized systems
- `RUST_CONTRACT.md`
- `NATIVE_PLATFORM_CONTRACT.md`
- `AI_CONTRACT.md`

## Mandatory process documents

- `DEFINITION_OF_DONE.md`
- `EXECUTION_PROTOCOL.md`
- `DECISIONS/` — ADRs

## Task routing

### Continuous improvement / audit
Read AGENTS → AI_CONTROL_CENTER → AI_ENGINEERING_SYSTEM → run audit → inspect current state → prioritize by risk → change one risk cluster → verify → re-audit.

### Feature
Read AGENTS → architecture → project state → relevant contracts → DoD → affected code/tests.

### UI/UX
Read AGENTS → design → motion → performance if heavy → affected components → visual/accessibility tests.

### Database
Read AGENTS → database → architecture → API → relevant ADRs → schema/migrations/tests.

### API
Read AGENTS → API → security → database if applicable → consumers → contract tests.

### Auth / Security / Payments / Storage
Read AGENTS → security → architecture → affected contract(s) → dedicated security/integration tests.

### AI
Read AGENTS → AI → architecture → security → provider configuration → usage/error tests.

### Performance / 3D
Read AGENTS → performance → 3D → benchmarks → affected screens.

### Mobile / Native / Desktop
Read AGENTS → native platform contract → architecture → platform-specific code → target build/tests.

## Current repository map

```text
apps/        Product applications
packages/    Shared/domain/infrastructure packages
.ai/         AI governance, contracts, ADRs, project state
docs/        General documentation
.github/     CI/CD and repository automation
infra/       Infrastructure configuration where present
scripts/     Repository verification and automation
```

The actual repository structure always wins over this illustrative map.

## Required search behavior

Before creating a new file/service/component:

- search for existing names and equivalents;
- inspect consumers;
- inspect tests;
- inspect exports;
- inspect related API/DB contracts.

Do not create parallel implementations merely because the existing one is inconvenient.

## State maintenance

Update project-state documentation after material architectural, platform, data, security, or release changes.

Do not copy old claims into new documentation without verifying them.

## Core principle

**The repository should become more capable without becoming more fragile.**
