# KinetixFitt — AI Governance Index

**Version:** 3.2.0  
**Status:** Mandatory navigation map  
**Last updated:** 2026-09-16

## Start every AI session here

When an agent is asked to continue, improve, fix, finish, refactor, or audit the project, read:

1. `../AGENTS.md`
2. `.ai/AI_CONTROL_CENTER.md`
3. `.ai/AI_ENGINEERING_SYSTEM.md`
4. `.ai/AI_EVALUATION_PROTOCOL.md`
5. `.ai/AI_AGENT_HANDOFF.md`
6. `.ai/PROJECT_STATE.md`
7. `.ai/FEATURE_LEDGER.md`
8. `.ai/INTEGRATION_REGISTRY.md`
9. `.ai/PERFORMANCE_BASELINES.md`
10. `.ai/DEFINITION_OF_DONE.md`
11. the relevant contract(s)
12. relevant ADRs
13. the actual source/tests/config/schema/workflows affected by the task

Before changing code, run:

```bash
npm run ai:audit
npm run ai:audit:json
```

The audit creates fresh static evidence. It does not prove runtime/provider/device/deployment behavior.

## Skill routing

Reusable domain skills live under `.github/skills/` and must be selected according to the task:

- `architecture/SKILL.md`
- `api-reliability/SKILL.md`
- `database-migrations/SKILL.md`
- `security-audit/SKILL.md`
- `integration-review/SKILL.md`
- `ai-integration/SKILL.md`
- `performance-audit/SKILL.md`
- `mobile-native/SKILL.md`
- `ux-accessibility/SKILL.md`
- `test-and-regression/SKILL.md`
- `debugging/SKILL.md`
- `dependency-governance/SKILL.md`
- `release-observability/SKILL.md`
- `code-review/SKILL.md`

Use `.github/skills/README.md` as the registry and default routing guide. Skills are guidance only; repository state and executable evidence remain authoritative.

## Authority order

When documents disagree, use this order:

1. `../AGENTS.md` — engineering constitution; highest repository-level authority.
2. `.ai/DECISIONS/*` — accepted architectural decisions for their scope.
3. Area contracts — normative rules for specific systems.
4. `DEFINITION_OF_DONE.md` — completion gates.
5. `EXECUTION_PROTOCOL.md` — required change workflow.
6. `.ai/AI_*` governance and evaluation protocols for agent behavior.
7. `PROJECT_STATE.md` / `ROADMAP_STATE.md` — current state/context, updated as reality changes.
8. README and feature docs — user/developer guidance.

If a conflict affects security, data, production behavior, or architecture, stop and resolve it through an ADR before taking a risky action.

## Core AI safety documents

- `AI_CONTROL_CENTER.md` — entry point for continuous improvement and anti-regression behavior.
- `AI_ENGINEERING_SYSTEM.md` — persistent operating rules, evidence levels, preservation protocol, change budget, and completion truth.
- `AI_EVALUATION_PROTOCOL.md` — layered evaluation, adversarial review, regression corpus and anti-self-approval rules.
- `AI_AGENT_HANDOFF.md` — session handoff and context-recovery protocol.
- `FEATURE_LEDGER.md` — evidence-based feature inventory.
- `INTEGRATION_REGISTRY.md` — external API/SDK/repository inventory.
- `PERFORMANCE_BASELINES.md` — measured performance guardrails.
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
Read governance → select required skills → run audit → inspect current state → prioritize by risk → change one risk cluster → verify → independent review → re-audit.

### Feature
Read AGENTS → architecture skill → project state → relevant domain skill/contract → DoD → affected code/tests.

### UI/UX
Use `ux-accessibility` + `performance-audit` when motion/media/heavy rendering is involved.

### Database
Use `database-migrations` + `architecture` + `api-reliability` as applicable.

### API
Use `api-reliability` + `security-audit` + `integration-review` for external providers.

### Auth / Security / Payments / Storage
Use `security-audit` + relevant domain contract + `test-and-regression` + `code-review`.

### AI
Use `ai-integration` + `integration-review` + `security-audit` + `performance-audit` where applicable.

### Performance / 3D
Use `performance-audit` + `ux-accessibility` + `mobile-native` for device impact.

### Mobile / Native / Desktop
Use `mobile-native` + `architecture` + `performance-audit` + target-platform tests.

### Broken / flaky behavior
Use `debugging` + `test-and-regression` + independent `code-review`.

### Dependencies
Use `dependency-governance` before adding/upgrading/removing packages.

### Release
Use `release-observability` after affected tests/builds and before declaring completion.

## Current repository map

```text
apps/        Product applications
packages/    Shared/domain/infrastructure packages
.ai/         AI governance, contracts, ADRs, project state
.github/     CI/CD, instructions and reusable AI skills
docs/        General documentation
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
- inspect related API/DB contracts;
- select the relevant skill before implementation.

Do not create parallel implementations merely because the existing one is inconvenient.

## State maintenance

Update project-state documentation after material architectural, platform, data, security, release or agent-governance changes.

Do not copy old claims into new documentation without verifying them.

## Core principle

**The repository should become more capable without becoming more fragile.**
