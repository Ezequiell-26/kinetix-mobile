# KinetixFitt AI Skills Registry

These skills are reusable procedures for coding and review agents. They complement `AGENTS.md` and `.ai/` governance; they do not override repository contracts.

## Selection

| Skill | Use when |
|---|---|
| `architecture` | changing boundaries, packages, shared services or public contracts |
| `api-reliability` | creating/changing internal or external APIs |
| `database-migrations` | changing Prisma/PostgreSQL schema or persistence |
| `security-audit` | auth, authorization, payments, storage, secrets or high-risk endpoints |
| `integration-review` | adding APIs, SDKs, AI providers or external Git repositories |
| `ai-integration` | adding/changing model providers, AI gateway or AI tooling |
| `performance-audit` | optimizing speed, memory, CPU, battery, network or bundle size |
| `mobile-native` | Android, iOS, PWA, Capacitor, Electron or device APIs |
| `ux-accessibility` | screens, components, responsive behavior, accessibility or motion |
| `test-and-regression` | fixing bugs, adding behavior, extending regression coverage |
| `debugging` | diagnosing failures or flaky behavior |
| `dependency-governance` | adding/upgrading/removing dependencies |
| `release-observability` | release validation, deployment verification or runtime monitoring |
| `code-review` | independent adversarial review after implementation |

## Mandatory selection rule

Use the smallest set of relevant skills. For high-risk changes combine implementation guidance with an independent review skill.

## Default open-ended improvement stack

`ai audit → debugging → architecture → relevant domain skill → test-and-regression → performance-audit → code-review → release-observability → re-audit`

## Truth rule

A skill is guidance, not evidence. Final claims must be backed by actual repository state, executed checks or runtime evidence.