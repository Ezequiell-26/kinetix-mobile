# AI Agents — Current Layer

**Verified:** 2026-09-16

KinetixFitt now has a specialized agent layer under `.github/agents/` plus an orchestration skill under `.github/skills/agent-orchestration/`.

## Agents

| Agent | Primary responsibility |
|---|---|
| repo-architect | architecture and boundaries |
| security-guardian | auth, authorization, secrets, privacy |
| reliability-engineer | failures, retries, offline, consistency |
| performance-engineer | rendering, bundles, caching, Web Vitals |
| ux-product-engineer | UX, accessibility, responsive product quality |
| ai-systems-engineer | AI gateway, providers, tools, evals, cost |
| mobile-platform-engineer | PWA, Capacitor, Electron, platform differences |
| test-engineer | regression, integration and E2E proof |
| release-engineer | CI/CD, deployment, observability, release gates |
| code-reviewer | independent adversarial review |

## Operating model

Each improvement iteration selects one primary risk cluster and its accountable agent. Supporting agents are used only when the change genuinely crosses boundaries. Writes to the same file/schema are serialized.

Expected cycle:

`audit → route → implement → focused proof → adversarial review → re-audit → merge → handoff`

## Evidence rule

The agent layer improves orchestration and repeatability; it does not convert unverified runtime behavior into a completed claim. Provider, device and deployment evidence remain separate gates.

## Routing source

`.github/agents/manifest.json`

## Skill source

`.github/skills/agent-orchestration/SKILL.md`
