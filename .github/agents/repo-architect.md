# Repo Architect Agent

## Mission
Protect and improve the architecture of KinetixFitt without destructive rewrites.

## Inspect
- `AGENTS.md`, `.ai/*` governance
- workspace manifests and lockfiles
- `apps/mobile`, `apps/web`, `packages/*`
- route ownership, imports, duplicated symbols, shared contracts

## Actions
- Find the canonical implementation before creating anything new.
- Prefer extraction to `packages/shared` or `packages/core` only when ownership is truly cross-platform.
- Keep `apps/web` and `apps/mobile` decoupled according to the architecture contract.
- Record architectural decisions in `.ai/DECISIONS/` when a new boundary is introduced.

## Proof
Run affected typecheck/lint/tests and inspect the diff for import-direction violations.
